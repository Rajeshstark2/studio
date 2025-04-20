"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/mode-toggle";
import { financialLiteracyChatbot } from "@/ai/flows/financial-literacy-chatbot";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Share2, Mic, Volume2 } from "lucide-react";

const ChatPage = () => {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Voice-to-text state and functions
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Text-to-voice state
  const [isSpeaking, setIsSpeaking] = useState(false);

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

    // Initialize SpeechRecognition
    if ("SpeechRecognition" in window) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.lang = language;

      recognition.current.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Recognition Started",
        });
      };

      recognition.current.onerror = (event: any) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognition.current.onend = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Ended",
        });
      };

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };
    } else {
      console.log("Speech Recognition API not supported in this browser.");
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser does not support the Speech Recognition API.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [language, toast]);

  useEffect(() => {
    if (recognition.current) {
      recognition.current.lang = language;
    }
  }, [language]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      try {
        recognition.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Error Starting Voice Recognition",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech not supported in this browser.");
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser does not support the Speech Synthesis API.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to the chat
    setMessages([...messages, { sender: "user", text: inputText }]);

    // Call the financialLiteracyChatbot function
    try {
      const response = await financialLiteracyChatbot({
        question: inputText,
        language: language,
        username: name || "user", // Pass the username or a default value
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
      toast({
        title: "Error",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }

    setInputText("");
  };

  const translatedPredefinedQuestions = {
    en: [
      "What is investment?",
      "Define insurance.",
      "What is SIP?",
      "How to invest in the stock market?",
      "What is UPI?",
      "How to avoid financial fraud?",
    ],
    hi: [
      "निवेश क्या है?",
      "बीमा को परिभाषित करें।",
      "एसआईपी क्या है?",
      "शेयर बाजार में निवेश कैसे करें?",
      "यूपीआई क्या है?",
      "वित्तीय धोखाधड़ी से कैसे बचें?",
    ],
    ta: [
      "முதலீடு என்றால் என்ன?",
      "காப்பீட்டை வரையறுக்கவும்.",
      "எஸ்ஐபி என்றால் என்ன?",
      "பங்குச் சந்தையில் எப்படி முதலீடு செய்வது?",
      "UPI என்றால் என்ன?",
      "நிதி மோசடியை எவ்வாறு தவிர்ப்பது?",
    ],
    te: [
      "పెట్టుబడి అంటే ఏమిటి?",
      "భీమాను నిర్వచించండి.",
      "SIP అంటే ఏమిటి?",
      "స్టాక్ మార్కెట్‌లో ఎలా పెట్టుబడి పెట్టాలి?",
      "UPI అంటే ఏమిటి?",
      "ఆర్థిక మోసాలను ఎలా నివారించాలి?",
    ],
    ml: [
      "നിക്ഷേപം എന്നാൽ എന്ത്?",
      "ഇൻഷുറൻസ് നിർവചിക്കുക.",
      "എന്താണ് SIP?",
      "ഓഹരി വിപണിയിൽ എങ്ങനെ നിക്ഷേപം നടത്താം?",
      "UPI എന്നാൽ എന്ത്?",
      "സാമ്പത്തിക തട്ടിപ്പ് എങ്ങനെ ഒഴിവാക്കാം?",
    ],
    kn: [
      "ಹೂಡಿಕೆ ಎಂದರೇನು?",
      "ವಿಮೆಯನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಿ.",
      "SIP ಎಂದರೇನು?",
      "ಷೇರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡುವುದು ಹೇಗೆ?",
      "UPI ಎಂದರೇನು?",
      "ಹಣಕಾಸು ವಂಚನೆಯನ್ನು ತಪ್ಪಿಸುವುದು ಹೇಗೆ?",
    ],
  };

  const getPredefinedQuestions = () => {
    return (
      translatedPredefinedQuestions[language] || translatedPredefinedQuestions["en"]
    );
  };

  const sendPredefinedQuestion = (question: string) => {
    setInputText(question);
    sendMessage();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
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
        <div className="flex gap-4 items-center">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
              <SelectItem value="te">Telugu</SelectItem>
              <SelectItem value="ml">Malayalam</SelectItem>
              <SelectItem value="kn">Kannada</SelectItem>
            </SelectContent>
          </Select>
          <ModeToggle />
        </div>
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
                  : "bg-muted text-foreground"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {getPredefinedQuestions().map((question, index) => (
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
          {/* Voice-to-Text Button */}
          <Button
            variant="outline"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? "Start Listening" : "Stop Listening"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
