
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemInstructions = `
You are Heus, a friendly, thoughtful AI wellbeing companion.

Your purpose:
- Listen with empathy and kindness.
- Help users explore their emotions.
- Offer practical wellbeing suggestions.
- Encourage healthy real-world relationships.
- Respond naturally and conversationally.
- Keep responses clear, supportive, and concise.

Conversation:
- Remember relevant details from the conversation provided.
- Ask thoughtful follow-up questions when appropriate.
- Avoid repeating questions.
- Respect the user's communication preferences.
- Never pretend to be human.

When someone feels lonely:
- Ask whether they prefer text messages, voice chat,
  or both, unless they have already told you.
- Suggest suitable communities and activities.
- Recommend Discord, Reddit, Meetup, or 7 Cups
  when relevant.
- Do not invent communities or events.
- Respect privacy and age requirements.

Safety:
- You are not a therapist or emergency service.
- Do not diagnose medical or mental health conditions.
- Do not encourage emotional dependency.
- Never promise complete confidentiality.
- For suicidal thoughts, encourage immediate human
  support and mention 988 for users in the US.
- For immediate danger, encourage contacting
  local emergency services.
`;

type ErrorDetails = {
  message: string;
  status?: number;
  code?: string | number;
};

function getErrorDetails(error: unknown): ErrorDetails {
  if (error instanceof Error) {
    const apiError = error as Error & {
      status?: number;
      code?: string | number;
    };

    return {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
    };
  }

  return {
    message: String(error),
  };
}

function isTimeout(details: ErrorDetails): boolean {
  const message = details.message.toLowerCase();

  return (
    details.status === 504 ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("deadline") ||
    message.includes("abort")
  );
}

function isTemporaryError(details: ErrorDetails): boolean {
  return (
    details.status === 500 ||
    details.status === 502 ||
    details.status === 503 ||
    isTimeout(details)
  );
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    const primaryModel =
      process.env.GEMINI_MODEL?.trim() ||
      "gemini-3.1-flash-lite";

    const models = [
      ...new Set([
        primaryModel,
        "gemini-3.5-flash-lite",
      ]),
    ];

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is missing. Check .env.local.",
        },
        { status: 500 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    const messages: unknown =
      typeof body === "object" &&
      body !== null &&
      "messages" in body
        ? body.messages
        : undefined;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 20 ||
      !messages.every(
        (message): message is ChatMessage =>
          typeof message === "object" &&
          message !== null &&
          (message.role === "user" ||
            message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0 &&
          message.content.length <= 2000
      ) ||
      messages[messages.length - 1].role !== "user"
    ) {
      return NextResponse.json(
        {
          error: "Invalid conversation data.",
        },
        { status: 400 }
      );
    }

    const contents = (messages as ChatMessage[]).map(
      (message) => ({
        role:
          message.role === "assistant"
            ? "model"
            : "user",
        parts: [{ text: message.content }],
      })
    );

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 12000,
      },
    });

    let lastError: ErrorDetails | null = null;

    // Try each model once.
    // On temporary errors, immediately switch models.
    for (const currentModel of models) {
      try {
        console.log(
          "Heus: Trying Gemini model:",
          currentModel
        );

        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config: {
            systemInstruction: systemInstructions,
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });

        const reply = response.text?.trim();

        if (!reply) {
          console.warn(
            "Heus: Empty response from:",
            currentModel
          );

          lastError = {
            message: "Gemini returned an empty response.",
            status: 502,
          };

          continue;
        }

        console.log(
          "Heus: Successfully responded using:",
          currentModel
        );

        return NextResponse.json({ reply });
      } catch (error: unknown) {
        const details = getErrorDetails(error);
        lastError = details;

        console.error("Heus: Model request failed:", {
          model: currentModel,
          status: details.status,
          message: details.message,
        });

        if (
          isTemporaryError(details) ||
          details.status === 404
        ) {
          console.log(
            "Heus: Trying next available model..."
          );
          continue;
        }

        // Quota, authentication, or invalid requests
        // are unlikely to be fixed by switching models.
        if (details.status === 429) {
          return NextResponse.json(
            {
              error:
                "Gemini's request limit has been reached. Please try again later.",
            },
            { status: 429 }
          );
        }

        if (
          details.status === 401 ||
          details.status === 403
        ) {
          return NextResponse.json(
            {
              error:
                "Gemini rejected the API request. Check your API key and project permissions.",
            },
            { status: 502 }
          );
        }

        if (details.status === 400) {
          return NextResponse.json(
            {
              error:
                "Gemini rejected the request. Check the server logs.",
            },
            { status: 502 }
          );
        }

        return NextResponse.json(
          {
            error:
              "Heus could not connect to Gemini. Please try again.",
          },
          { status: 502 }
        );
      }
    }

    if (lastError && isTimeout(lastError)) {
      return NextResponse.json(
        {
          error:
            "Gemini is taking too long to respond. Please try again shortly.",
        },
        { status: 504 }
      );
    }

    if (lastError?.status === 503) {
      return NextResponse.json(
        {
          error:
            "Gemini is experiencing high demand. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Heus could not get a response from the available Gemini models. Please try again.",
      },
      { status: 502 }
    );
  } catch (error: unknown) {
    console.error(
      "Heus: Unexpected server error:",
      getErrorDetails(error)
    );

    return NextResponse.json(
      {
        error:
          "Heus encountered an unexpected error. Please try again.",
      },
      { status: 500 }
    );
  }
}
