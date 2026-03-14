# AI Companion

A Next.js web app that lets you chat with an AI companion. Pick a personality (Supportive, Witty, Calm, Curious, or Direct) and have a conversation. Built with the [Vercel AI SDK](https://sdk.vercel.ai), [Google Generative AI](https://ai.google.dev), and [shadcn](https://ui.shadcn.com).

## Setup

1. **Install dependencies** (includes `@ai-sdk/react` for the chat UI):

   ```bash
   npm install
   ```

2. **Add your API key**

   Copy the example env file and add your Google AI API key:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

   Get a key at [Google AI Studio](https://aistudio.google.com/apikey).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Choose a personality, then start chatting.

## Project structure

- **`app/page.tsx`** – Personality picker and chat UI (uses `useChat` from `@ai-sdk/react`).
- **`app/api/chat/route.ts`** – Chat API route: streams responses with `streamText`, using the selected personality’s system prompt.
- **`lib/personalities.ts`** – List of personalities (id, name, description, system prompt). Edit here to add or change personalities.

## Tech

- [Next.js](https://nextjs.org) (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/react`, `@ai-sdk/google`)
- [shadcn](https://ui.shadcn.com) + Tailwind CSS
