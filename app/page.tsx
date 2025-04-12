"use client";
import Image from "next/image";
import GPTLogo from "./assets/GPTLogo.png";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import PromptSuggestionRow from "./components/PromptSuggestionsRow";
import LoadingBubble from "./components/LoadingBubble";
import { useState, FormEvent } from "react";
import { FiSend } from 'react-icons/fi';

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const noMessages = !messages || messages.length === 0;
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Create a user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    
    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setError(null);
    
    try {
      console.log("[Client] Sending message to API:", input);
      
      // Send the message to the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      
      console.log("[Client] Got response from API:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("[Client] Parsed response data:", data);
      
      // Create an assistant message from the response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
      };
      
      // Add assistant message to the chat
      setMessages(prev => [...prev, assistantMessage]);
      console.log("[Client] Updated messages:", [...messages, userMessage, assistantMessage]);
      
    } catch (err) {
      console.error("[Client] Error in chat:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrompt = (prompt: string) => {
    console.log("[Client] Handling prompt:", prompt);
    setInput(prompt);
  };

  return (
    <main>
      <header className="header">
        <Image src={GPTLogo} alt="AI Assistant" width={48} height={48} priority />
        <h1>AI Assistant</h1>
      </header>
      
      <section className={`${noMessages ? "" : "populated"}`}>
        {noMessages ? (
          <div className="flex flex-col items-center justify-center">
            <p className="starter-text">Hello, I&apos;m the AI Chatbot. How can I help you today?</p>
            <PromptSuggestionRow onPromptSuggestionClick={handlePrompt} />
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble
                key={`message-${index}`}
                message={message}
              />
            ))}
            {isLoading && <LoadingBubble />}
            {error && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error.message}
              </div>
            )}
          </>
        )}
      </section>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="question-box"
          placeholder="Type your message here..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
        >
          <FiSend />
          Send
        </button>
      </form>
    </main>
  );
};

export default Home;
