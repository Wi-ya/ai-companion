"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ChatView, PersonalityPicker } from "@/components/companion";
import type { Personality } from "@/lib/personalities";

const CHAT_API = "/api/chat";

export default function ChatPage() {
  const [personality, setPersonality] = useState<Personality | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API }) as never,
  });

  if (!personality) {
    return (
      <PersonalityPicker
        onSelect={setPersonality}
        title="Choose your companion"
        description="Pick a personality and start chatting. Each one is the same AI model — just with different instructions."
      />
    );
  }

  return (
    <ChatView
      personality={personality}
      messages={messages}
      sendMessage={sendMessage}
      status={status}
      error={error}
      onBack={() => setPersonality(null)}
    />
  );
}
