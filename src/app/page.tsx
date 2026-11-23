"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "heus"; text: string };
type Resource = { name: string; description: string; url: string; category: string };
type ConnectionChoice = "online" | "friends" | "local" | "games" | "support";
type ChatPreference = "text" | "voice" | "both" | null;
type Feedback = "yes" | "no" | null;

const moods = [
  { emoji: "😄", name: "Happy" },
  { emoji: "🙂", name: "Okay" },
  { emoji: "😔", name: "Sad" },
  { emoji: "😣", name: "Stressed" },
  { emoji: "🥺", name: "Lonely" },
  { emoji: "😐", name: "Bored" },
];

const connectionOptions: { id: ConnectionChoice; emoji: string; title: string; description: string }[] = [
  { id: "online", emoji: "💬", title: "Talk to someone online", description: "Find online conversations and communities." },
  { id: "friends", emoji: "🤝", title: "Make new friends", description: "Build friendships with people who share your interests." },
  { id: "local", emoji: "📍", title: "Find activities near me", description: "Explore local events, clubs and gatherings." },
  { id: "games", emoji: "🎮", title: "Play games with people", description: "Meet others through multiplayer games." },
  { id: "support", emoji: "💜", title: "Talk to a support volunteer", description: "Explore emotional-support services." },
];

const discord: Resource = { name: "Discord", description: "Explore interest-based servers with text and voice channels.", url: "https://discord.com", category: "Text and voice" };
const reddit: Resource = { name: "Reddit", description: "Join discussions about hobbies, interests and everyday life.", url: "https://www.reddit.com", category: "Text communities" };
const cups: Resource = { name: "7 Cups", description: "Explore emotional support and volunteer listening.", url: "https://www.7cups.com", category: "Emotional support" };
const slowly: Resource = { name: "Slowly", description: "Exchange thoughtful messages with pen pals worldwide.", url: "https://slowly.app", category: "Pen pals" };
const onlineResources = [discord, reddit, cups, slowly];
const voiceResources = [discord];
const textResources = [discord, reddit, slowly, cups];
const friendshipResources: Resource[] = [
  { name: "Bumble For Friends", description: "Meet people interested in forming new friendships.", url: "https://bumble.com/bff", category: "Friendship" },
  { name: "Meetup", description: "Join groups organised around shared interests.", url: "https://www.meetup.com", category: "Social groups" },
  slowly,
];
const localResources: Resource[] = [
  { name: "Meetup", description: "Discover social gatherings, sports and interest-based clubs.", url: "https://www.meetup.com", category: "Local groups" },
  { name: "Eventbrite", description: "Explore local events, including free community activities.", url: "https://www.eventbrite.com", category: "Events" },
];
const gamingResources: Resource[] = [
  { name: "Board Game Arena", description: "Play online board games with other people.", url: "https://boardgamearena.com", category: "Online games" },
  discord,
  { name: "Chess.com", description: "Play chess online with people around the world.", url: "https://www.chess.com", category: "Online chess" },
];
const supportResources: Resource[] = [
  cups,
  { name: "Find A Helpline", description: "Find emotional-support services available in your country.", url: "https://findahelpline.com", category: "Support directory" },
];
const financialResources: Resource[] = [
  { name: "211", description: "Find information about food, housing and financial assistance in the US.", url: "https://www.211.org", category: "Community assistance" },
  { name: "CareerOneStop", description: "Explore employment opportunities and career resources in the US.", url: "https://www.careeronestop.org", category: "Employment" },
  { name: "Feeding America", description: "Find food banks and food assistance in the United States.", url: "https://www.feedingamerica.org/find-your-local-foodbank", category: "Food assistance" },
];
const crisisResources: Resource[] = [
  { name: "988 Lifeline", description: "In the United States, call or text 988 for crisis support.", url: "https://988lifeline.org", category: "US crisis support" },
  { name: "Find A Helpline", description: "Find support services in your country.", url: "https://findahelpline.com", category: "International support" },
];
const resourcesByChoice: Record<ConnectionChoice, Resource[]> = {
  online: onlineResources, friends: friendshipResources, local: localResources,
  games: gamingResources, support: supportResources,
};
const promptsByChoice: Record<ConnectionChoice, string> = {
  online: "Would you prefer to talk through text messages, voice chat, or both? You can choose an option below or tell me in your own words.",
  friends: "Would you like to make friends nearby, meet people online, or connect through a shared hobby?",
  local: "What city or neighbourhood would you like to explore? A general area is enough; please don't share your exact address.",
  games: "What games do you enjoy? Would you prefer casual games, competitive games, or something cooperative?",
  support: "Would you like to explore volunteer listening services, or would you prefer to keep talking here?",
};

function isCrisisMessage(text: string) {
  return /\b(suicid(?:e|al)|kill myself|end my life|want to die|wish i were dead|don['’]t want to live|hurt myself|harm myself|self[- ]harm)\b/i.test(text);
}
function isFinancialMessage(text: string) {
  return /\b(money|financial|rent|bills|debt|unemployed|jobless)\b/i.test(text);
}
function isLonelyMessage(text: string) {
  return /\b(lonely|alone|isolated|no friends|nobody to talk to)\b/i.test(text);
}
function isWorkMessage(text: string) {
  return /\b(work|boss|manager|colleague|school|exam|deadline)\b/i.test(text);
}
function detectPreference(text: string): ChatPreference {
  if (/\b(both|either|text and voice|voice and text|text or voice|voice or text)\b/i.test(text)) return "both";
  if (/\b(voice|audio|speaking|talk on (?:a )?call|phone call)\b/i.test(text)) return "voice";
  if (/\b(text|typing|messages?|written chat)\b/i.test(text)) return "text";
  return null;
}
function preferenceResponse(preference: Exclude<ChatPreference, null>) {
  if (preference === "voice") return "Voice conversations can be a lovely way to meet people. Discord has interest-based communities with voice channels you can explore. What topics would you enjoy discussing — gaming, sports, music, everyday life, or something else?";
  if (preference === "text") return "Text conversations can be an easy way to get to know people at your own pace. You could explore Discord, Reddit or Slowly. What topics would you enjoy discussing — gaming, sports, music or everyday life?";
  return "You can enjoy both text and voice conversations! Discord offers both, while Reddit and Slowly offer text-based ways to connect. What interests would you like to share with new people?";
}
function getResponse(mood: string, text: string, choice: ConnectionChoice | null, preference: ChatPreference): string {
  if (isCrisisMessage(text)) return "I'm concerned about your safety. You deserve support from a real person. If you might act on thoughts of harming yourself, contact local emergency services or a crisis service now. In the United States, you can call or text 988. Are you somewhere safe right now?";
  if (isFinancialMessage(text)) return "Money worries can be difficult to manage. Would you prefer help finding employment, food assistance, or support with essential expenses? I've included some resources below.";
  if (choice === "online") {
    const detected = detectPreference(text);
    if (detected) return preferenceResponse(detected);
    if (!preference) return promptsByChoice.online;
    return `That sounds worth exploring. ${preference === "voice" ? "You could look for a Discord voice community" : preference === "text" ? "You could look for a text-based community" : "You could look for a community with text and voice options"} around your interests. What do you enjoy talking about?`;
  }
  if (choice === "friends") return "Building friendships often starts with shared interests. What hobbies or activities do you enjoy? You can explore the friendship resources below.";
  if (choice === "local") return "You can use Meetup or Eventbrite to search for activities in your area. Would you prefer sports, entertainment, or community gatherings?";
  if (choice === "games") return "Playing games with others can be a fun way to connect. Would you prefer board games, chess, or multiplayer gaming communities?";
  if (choice === "support") return "If you'd like someone to listen, you can explore volunteer listening and support services below. You can also continue sharing what's on your mind here.";
  if (isLonelyMessage(text) || mood === "Lonely") return "Feeling disconnected can be difficult. Would you prefer to talk with someone online, make new friends, or find an activity nearby? Choose an option in Find Your Connection below.";
  if (isWorkMessage(text)) return "It sounds like work or study may be weighing on you. Was it the workload, something that happened with another person, or something else?";
  if (mood === "Bored" || /\b(bored|boring|nothing to do)\b/i.test(text)) return "Let's find something enjoyable. Would you prefer gaming, sports, films, or meeting people?";
  const responses: Record<string, string> = {
    Happy: "It's lovely to hear you're feeling happy! What happened today that made you feel good?",
    Okay: "Thanks for checking in. Would you like to talk about your day or explore something enjoyable?",
    Sad: "I'm sorry today has been difficult. Would you like to talk about what happened?",
    Stressed: "That sounds stressful. Would you like to talk about what's happening or try a short break?",
    Lonely: "Would you like to talk online, make friends, or find an activity nearby?",
    Bored: "What activities do you usually enjoy?",
  };
  return responses[mood] || "Thank you for sharing. Would you like to tell me more?";
}

function ResourceCards({ resources }: { resources: Resource[] }) {
  return (
    <div className="mt-4 space-y-3">
      {resources.map((resource) => (
        <a key={resource.name} href={resource.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-purple-100 bg-white p-4 transition hover:border-purple-400 hover:shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-purple-800">{resource.name} ↗</span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">{resource.category}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{resource.description}</p>
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [connectionChoice, setConnectionChoice] = useState<ConnectionChoice | null>(null);
  const [chatPreference, setChatPreference] = useState<ChatPreference>(null);
  const [showConnection, setShowConnection] = useState(false);
  const [crisisMode, setCrisisMode] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation.length > 0) conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [conversation]);

  const resetConversation = () => {
    requestIdRef.current += 1;
    setIsLoading(false);
    setMessage(""); setConversation([]); setResources([]); setConnectionChoice(null);
    setChatPreference(null); setShowConnection(false); setCrisisMode(false); setFeedback(null);
  };

  const handleMoodSelect = (mood: string) => {
    resetConversation();
    setSelectedMood(mood);
    if (mood === "Lonely") setShowConnection(true);
  };

  const handleConnectionChoice = (choice: ConnectionChoice) => {
    if (crisisMode) return;
    setConnectionChoice(choice);
    setChatPreference(null);
    setResources(resourcesByChoice[choice]);
    setFeedback(null);
    setConversation((previous) => [...previous, { role: "heus", text: promptsByChoice[choice] }]);
  };

  const handlePreference = (preference: Exclude<ChatPreference, null>) => {
    if (crisisMode) return;
    setConnectionChoice("online");
    setChatPreference(preference);
    setResources(preference === "voice" ? voiceResources : preference === "text" ? textResources : onlineResources);
    setFeedback(null);
    const label = preference === "voice" ? "🎙️ Voice chat" : preference === "text" ? "💬 Text chat" : "💜 Both";
    setConversation((previous) => [...previous, { role: "user", text: label }, { role: "heus", text: preferenceResponse(preference) }]);
  };

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed || !selectedMood || isLoading) return;

    const urgent = isCrisisMessage(trimmed);
    const detected = connectionChoice === "online" ? detectPreference(trimmed) : null;
    const nextPreference = detected || chatPreference;
    const nextConversation: Message[] = [...conversation, { role: "user", text: trimmed }];
    const requestId = ++requestIdRef.current;

    setConversation(nextConversation);
    setMessage("");
    setFeedback(null);

    if (urgent) {
      setCrisisMode(true);
      setResources(crisisResources);
      setShowConnection(false);
      setConnectionChoice(null);
      setChatPreference(null);
      setConversation([...nextConversation, { role: "heus", text: getResponse(selectedMood, trimmed, connectionChoice, nextPreference) }]);
      return;
    }

    if (!crisisMode) {
      if (isFinancialMessage(trimmed)) setResources(financialResources);
      else if (connectionChoice === "online") {
        setChatPreference(nextPreference);
        setResources(nextPreference === "voice" ? voiceResources : nextPreference === "text" ? textResources : onlineResources);
      } else if (connectionChoice) setResources(resourcesByChoice[connectionChoice]);
      else if (isLonelyMessage(trimmed) || selectedMood === "Lonely") setShowConnection(true);
      else if (selectedMood === "Bored") setResources(gamingResources);
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mood: selectedMood,
          connectionChoice,
          chatPreference: nextPreference,
          messages: nextConversation.map((item) => ({
            role: item.role === "heus" ? "assistant" : "user",
            content: item.text,
          })),
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error("Chat request failed");
      const payload = data as Record<string, unknown>;
      const reply = [payload.reply, payload.response, payload.message, payload.text]
        .find((value): value is string => typeof value === "string" && value.trim().length > 0);
      if (!reply) throw new Error("No reply returned by the chat endpoint");
      if (requestId === requestIdRef.current) {
        setConversation((previous) => [...previous, { role: "heus", text: reply }]);
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setConversation((previous) => [
          ...previous,
          { role: "heus", text: "I'm having trouble connecting right now. Please try again in a moment. 💜" },
        ]);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-50 px-5 py-10 text-gray-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-purple-700">♡ Heus</h1>
        <span className="text-right text-sm text-purple-700">Your wellbeing companion</span>
      </nav>
      <section className="mx-auto mt-16 max-w-2xl text-center">
        <div className="mb-5 text-6xl">🌸</div>
        <h2 className="text-3xl font-bold text-purple-900 sm:text-4xl">Hello. How are you feeling today?</h2>
        <p className="mt-5 text-lg text-gray-600">Welcome to Heus, your personal space to explore your emotions, find support, and discover what makes you feel better.</p>
        <div className="mt-10 rounded-3xl bg-white p-5 shadow-xl sm:p-8">
          <h3 className="mb-6 text-xl font-semibold">Choose how you feel</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {moods.map((mood) => (
              <button key={mood.name} type="button" aria-pressed={selectedMood === mood.name} onClick={() => handleMoodSelect(mood.name)}
                className={`rounded-2xl border p-5 transition hover:bg-purple-100 ${selectedMood === mood.name ? "border-purple-600 bg-purple-100" : "border-purple-100"}`}>
                <div className="text-4xl">{mood.emoji}</div>
                <div className="mt-2 font-medium">{mood.name}</div>
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="mt-8 text-left">
              <div className="rounded-2xl bg-purple-50 p-5">
                <h4 className="text-lg font-semibold text-purple-900">Let&apos;s talk 💜</h4>
                <p className="mt-2 text-gray-700">You&apos;re feeling <strong>{selectedMood.toLowerCase()}</strong>. What&apos;s on your mind?</p>
              </div>
              {crisisMode && (
                <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h4 className="font-semibold text-rose-900">Support is available</h4>
                  <p className="mt-2 text-sm text-gray-700">If you may be in immediate danger, contact local emergency services. In the United States, you can call or text 988 for crisis support.</p>
                </div>
              )}
              {showConnection && !crisisMode && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <h4 className="text-xl font-semibold text-purple-900">💜 Find Your Connection</h4>
                  <p className="mt-2 text-sm text-gray-600">How would you like to connect with someone today?</p>
                  <div className="mt-5 space-y-3">
                    {connectionOptions.map((option) => (
                      <button key={option.id} type="button" aria-pressed={connectionChoice === option.id} onClick={() => handleConnectionChoice(option.id)}
                        className={`w-full rounded-xl border p-4 text-left transition ${connectionChoice === option.id ? "border-purple-600 bg-purple-100" : "border-purple-100 bg-white hover:border-purple-300"}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <div><p className="font-semibold text-purple-900">{option.title}</p><p className="mt-1 text-sm text-gray-600">{option.description}</p></div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {connectionChoice === "online" && (
                    <div className="mt-5 rounded-xl bg-white p-4">
                      <p className="font-semibold text-purple-900">How would you prefer to chat?</p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {([ ["text", "💬 Text chat"], ["voice", "🎙️ Voice chat"], ["both", "💜 Both"] ] as const).map(([value, label]) => (
                          <button key={value} type="button" aria-pressed={chatPreference === value} onClick={() => handlePreference(value)}
                            className={`rounded-xl border px-3 py-3 text-sm font-medium ${chatPreference === value ? "border-purple-600 bg-purple-100 text-purple-900" : "border-purple-200 hover:bg-purple-50"}`}>{label}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {resources.length > 0 && (
                <div className="mt-6 rounded-2xl bg-purple-50 p-5">
                  <h4 className="text-lg font-semibold text-purple-900">{crisisMode ? "Support resources" : "Helpful places to explore"}</h4>
                  <ResourceCards resources={resources} />
                  {!crisisMode && <p className="mt-4 text-xs text-gray-600">These are external services, not operated by Heus. Check age requirements, privacy settings, moderation and possible costs. Never share sensitive information with strangers.</p>}
                </div>
              )}
              {!crisisMode && resources.length > 0 && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-white p-5">
                  <h4 className="font-semibold text-purple-900">Did these suggestions help?</h4>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => setFeedback("yes")} aria-pressed={feedback === "yes"} className={`flex-1 rounded-xl border p-3 ${feedback === "yes" ? "border-green-500 bg-green-50" : "border-purple-200"}`}>👍 Yes</button>
                    <button type="button" onClick={() => setFeedback("no")} aria-pressed={feedback === "no"} className={`flex-1 rounded-xl border p-3 ${feedback === "no" ? "border-purple-500 bg-purple-100" : "border-purple-200"}`}>👎 Not yet</button>
                  </div>
                  {feedback && <p role="status" className="mt-4 text-sm text-gray-600">{feedback === "yes" ? "I'm glad these suggestions were useful. 💜" : "Thanks for letting me know. You can try another connection option above."}</p>}
                </div>
              )}
              {conversation.length > 0 && (
                <div aria-live="polite" aria-label="Conversation with Heus" className="mt-6 space-y-4">
                  <h4 className="font-semibold text-purple-900">Your conversation</h4>
                  {conversation.map((item, index) => (
                    <div key={index} className={`rounded-2xl p-4 ${item.role === "user" ? "ml-6 bg-purple-100" : "mr-6 border border-purple-100 bg-white shadow-sm"}`}>
                      <p className="mb-2 text-sm font-semibold text-purple-800">{item.role === "user" ? "You" : "Heus 💜"}</p>
                      <p className="whitespace-pre-wrap text-gray-700">{item.text}</p>
                    </div>
                  ))}
                  <div ref={conversationEndRef} />
                </div>
              )}
              {isLoading && <p role="status" className="mt-4 text-sm text-purple-700">Heus is thinking… 💜</p>}
              <label htmlFor="heus-message" className="mt-6 block font-medium text-purple-900">Your message</label>
              <textarea id="heus-message" value={message} maxLength={1000} onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell Heus what's on your mind..." className="mt-2 h-32 w-full resize-y rounded-xl border border-purple-200 bg-white p-4 outline-none focus:border-purple-500" />
              <p className="mt-1 text-right text-xs text-gray-500">{message.length}/1000 characters</p>
              <button type="button" onClick={handleSubmit} disabled={!message.trim() || isLoading} className="mt-4 w-full rounded-xl bg-purple-700 px-6 py-3 font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? "Heus is thinking…" : "Share with Heus 💜"}</button>
              <button type="button" onClick={resetConversation} className="mt-3 w-full rounded-xl border border-purple-200 px-6 py-3 text-sm text-purple-700 hover:bg-purple-50">Start a new conversation</button>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs text-gray-500">Heus provides general wellbeing information, not professional mental healthcare. Automated responses may misunderstand your situation.</p>
        <p className="mt-6 text-sm text-gray-500">One day at a time. You&apos;re welcome here. 💜</p>
      </section>
    </main>
  );
}
