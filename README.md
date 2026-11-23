# Heus 💜

**An AI-Powered Mental Health and Emotional Wellbeing Companion**

Heus is an AI-powered mental health and emotional wellbeing application under active development. Its mission is to help individuals understand their emotions, improve their wellbeing, build meaningful human connections, and receive personalised support throughout their daily lives.

The long-term vision is to develop Heus into a comprehensive mental wellbeing platform that combines conversational artificial intelligence, emotional health tracking, proactive wellbeing check-ins, and evidence-informed mental health support.

Heus aims to make emotional support more accessible while encouraging healthy relationships and appropriate professional care.

## Our Mission

To create an accessible, compassionate, and intelligent wellbeing companion that helps people feel heard, understand their emotional patterns, and take positive steps towards better mental health.

Heus is designed around five goals:

1. **Emotional Support:** Provide thoughtful, supportive conversations.
2. **Mental Wellbeing:** Help individuals develop healthy coping strategies and emotional awareness.
3. **Wellbeing Monitoring:** Help users track moods, emotional patterns, and changes in wellbeing over time.
4. **Proactive Check-Ins:** Allow users to opt into regular check-ins and wellbeing reminders.
5. **Human Connection:** Encourage meaningful relationships, community participation, and professional support when appropriate.

## Current Features

### AI-Powered Conversations

Heus integrates Google's Gemini AI models to provide natural, context-aware conversations.

- Supportive and empathetic responses.
- Natural-language understanding.
- Thoughtful follow-up questions.
- Awareness of recent conversation context.
- Personalised suggestions based on information shared during a conversation.

### Emotional Wellbeing Support

Heus helps users discuss emotions such as loneliness, sadness, stress, and happiness.

The application aims to encourage emotional awareness, healthy coping strategies, and supportive real-world relationships.

### Social Connection Recommendations

Heus helps individuals explore opportunities to connect with others based on their interests and communication preferences.

Examples include:

- Online communities.
- Voice and text chat platforms.
- Shared-interest groups.
- Community activities.
- Emotional support resources.

### AI Reliability and Fallback Models

The backend includes error handling and model fallback mechanisms.

- Primary and backup Gemini model configuration.
- Retry handling for certain temporary API failures.
- Handling for unavailable models.
- Server-side request validation.
- API key protection through environment variables.

### Responsive User Interface

The application uses a responsive interface designed for desktop and mobile browsers.

## Planned Features

The following capabilities are part of the development roadmap and are not yet implemented.

### 1. Mental Health and Wellbeing Tracking

Heus will aim to help users understand changes in their emotional wellbeing over time.

Planned capabilities include:

- Daily mood tracking.
- Emotional wellbeing journals.
- Weekly and monthly mood summaries.
- Visual wellbeing charts.
- Identification of recurring emotional patterns.
- Personal wellbeing goals.
- Progress tracking and reflection.

These insights will be intended for self-reflection rather than medical diagnosis.

### 2. Proactive Mental Health Check-Ins

Heus will aim to support users through optional, scheduled wellbeing check-ins.

Planned capabilities include:

- Daily or weekly emotional check-ins.
- Personalised wellbeing reminders.
- Questions about mood, stress, sleep, and general wellbeing.
- Follow-up conversations based on previously recorded check-ins.
- User-controlled notification preferences.
- Suggestions for reaching out to trusted people or professionals when appropriate.

Users will control whether check-ins are enabled and how frequently they occur.

### 3. Evidence-Informed Mental Health Support

A long-term objective is to explore evidence-informed approaches that can complement professional mental healthcare.

Potential features include:

- Guided breathing exercises.
- Mindfulness and relaxation activities.
- Stress management techniques.
- Emotional regulation exercises.
- Guided journaling.
- Healthy routine and sleep-hygiene suggestions.
- Educational resources about mental wellbeing.

Any future clinical treatment functionality would require appropriate clinical expertise, validation, safeguards, and regulatory review.

### 4. Personalised Wellbeing Dashboard

A planned dashboard will help users review their wellbeing information.

Potential dashboard components include:

- Mood history.
- Wellbeing trends.
- Check-in history.
- Personal goals.
- Reflection summaries.
- Suggested wellbeing activities.

### 5. Voice-Based AI Conversations

Future development will explore voice-based interactions, allowing users to communicate with Heus through spoken conversations.

### 6. User Accounts and Secure Data Storage

Planned functionality includes:

- Optional user accounts.
- Secure authentication.
- Private conversation history.
- Encrypted storage of sensitive wellbeing information.
- User-controlled data deletion.
- Privacy and consent settings.

### 7. Human Connection and Community Discovery

Future versions may help users discover relevant communities, activities, and support resources based on their interests and preferences.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack application framework |
| React | Interactive user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling |
| Google Gemini API | AI-powered conversations |
| Next.js API Routes | Server-side AI integration |
| Git and GitHub | Version control and documentation |

## System Architecture

The current application follows a client-server architecture:

1. A user submits a message through the React interface.
2. The frontend sends recent conversation history to `/api/chat`.
3. The server validates the request.
4. The server sends the conversation to Google's Gemini API.
5. If an eligible model request fails, the backend can retry or attempt a backup model.
6. The AI-generated response is returned to the frontend.
7. The response is displayed in the conversation interface.

The Gemini API key is stored in a server-side environment variable.

## Running Locally

### Prerequisites

- Node.js
- npm
- Google Gemini API key

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

Use a Gemini model available to your API project.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Engineering Challenges

Development of Heus involves several practical software engineering challenges:

- Integrating generative AI into a full-stack application.
- Managing conversation history and contextual continuity.
- Designing reliable API communication.
- Implementing retry and fallback strategies.
- Handling temporary model outages.
- Validating incoming requests.
- Protecting server-side credentials.
- Designing supportive human-centred interactions.

Future engineering challenges include:

- Building secure mental wellbeing data storage.
- Designing privacy-preserving wellbeing analytics.
- Implementing opt-in scheduled check-ins.
- Developing mood visualisation dashboards.
- Evaluating conversational AI safety and reliability.
- Exploring responsible AI applications in mental healthcare.

## Responsible AI and Mental Health Safety

Heus is currently an emotional wellbeing support prototype, not a licensed mental health treatment service or medical device.

It does not diagnose, treat, or cure mental health conditions and does not replace licensed mental health professionals.

The long-term goal is to explore how AI can responsibly complement mental healthcare through emotional support, self-reflection, wellbeing monitoring, and evidence-informed activities.

Future development will prioritise:

- User privacy and informed consent.
- Appropriate protection of sensitive wellbeing information.
- Responsible AI response evaluation.
- Human support and professional referrals.
- User control over tracking and notifications.
- Clear limitations on AI-generated advice.
- Appropriate clinical evaluation before introducing treatment claims.

For immediate danger, users should contact local emergency services. In the United States, the 988 Suicide & Crisis Lifeline is available for crisis support.

## Development Roadmap

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Responsive application interface | Prototype implemented |
| Phase 2 | Emotional support and social connection features | Prototype implemented |
| Phase 3 | Gemini AI integration and conversation context | Prototype implemented |
| Phase 4 | API reliability and model fallback | Prototype implemented |
| Phase 5 | User authentication and secure storage | Planned |
| Phase 6 | Daily mood tracking and wellbeing dashboard | Planned |
| Phase 7 | Opt-in mental health check-ins | Planned |
| Phase 8 | Voice-based AI conversations | Planned |
| Phase 9 | Evidence-informed wellbeing activities | Planned |
| Phase 10 | Testing, safety evaluation, and deployment | Planned |

## Project Status

**Active Development — AI-Powered Wellbeing Prototype**

Heus is an evolving software engineering project exploring the intersection of artificial intelligence, mental wellbeing, human-computer interaction, and responsible technology.

Its long-term vision is to create a secure, accessible, and personalised platform that helps individuals better understand their emotions, monitor their wellbeing, and access meaningful support.