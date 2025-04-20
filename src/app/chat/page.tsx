"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/mode-toggle";
import { financialLiteracyChatbot } from "@/ai/flows/financial-literacy-chatbot";

const ChatPage = () => {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user data from local storage
    const storedName = localStorage.getItem("name");
    const storedLanguage = localStorage.getItem("language");
    if (storedName) setName(storedName);
    if (storedLanguage) setLanguage(storedLanguage);

    // Scroll to bottom on message change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to the chat
    setMessages([...messages, { sender: "user", text: inputText }]);

    // Call the financialLiteracyChatbot function
    try {
      const response = await financialLiteracyChatbot({
        question: inputText,
        language: language,
        username: name, // Pass the username
      });

      // Add bot response to the chat
      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        { sender: "bot", text: response.answer },
      ]);
    } catch (error) {
      console.error("Error calling financialLiteracyChatbot:", error);
      // Handle error (e.g., display an error message to the user)
      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        {
          sender: "bot",
          text: "Sorry, I am unable to process your request at the moment.",
        },
      ]);
    }

    setInputText("");
  };

  const predefinedQuestions = [
    "What is investment?",
    "Define insurance.",
    "What is SIP?",
    "How to invest in the stock market?",
    "What is UPI?",
    "How to avoid financial fraud?",
  ];

  const sendPredefinedQuestion = (question: string) => {
    setInputText(question);
    sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl font-bold">FinLit Buddy</h1>
          <p>
            Welcome, {name || "User"} ({language})
          </p>
        </div>
        <ModeToggle />
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`rounded-xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => sendPredefinedQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask me anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
