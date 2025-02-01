"use client";

import { useState } from "react";
import { useUserId } from "@/hooks/use-user-id";

export default function AiChat() {
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'ai'}>>([
    { text: "Hey, I'm Adam - your AI Assistant. I'm here to help you make your mental health better.", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I understand how you're feeling. Would you like to try some breathing exercises?", 
        sender: 'ai' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.sender === 'user' ? 'bg-accent text-white' : 'bg-secondary'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
          />
          <button 
            onClick={sendMessage}
            className="p-4 rounded-xl bg-accent text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 