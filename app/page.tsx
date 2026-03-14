"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ChatView, PersonalityPicker } from "@/components/companion";
import type { Personality } from "@/lib/personalities";

const CHAT_API = "/api/chat";

export default function Home() {
  const [personality, setPersonality] = useState<Personality | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API }) as never,
  });

  if (!personality) {
    return <PersonalityPicker onSelect={setPersonality} />;
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
