import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  MessageCircle,
  TrendingUp,
  User,
  LogOut,
  Send,
  Mic,
  MicOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
}

interface Profile {
  full_name: string;
}

interface JournalEntry {
  id: string;
  content: string;
  date: string;
}

interface SentimentData {
  sentiment: string;
}

interface ChatMessage {
  sender: string;
  text: string;
}

const MentalHealthJournal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const dummyUser = { email: "test@example.com" };
    const dummyProfile = { full_name: "Test User" };
    setUser(dummyUser);
    setProfile(dummyProfile);
    fetchJournalData();
    initSpeechRecognition();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ---------------- SPEECH RECOGNITION ---------------- */
  const initSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Voice not supported",
        description: "Your browser does not support voice input.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  /* ---------------- API ---------------- */
  const fetchJournalData = async () => {
    try {
      const journalResponse = await fetch("/api/journal/entries");
      if (journalResponse.ok) {
        const journalData = await journalResponse.json();
        setJournalEntries(journalData.entries || []);
      }

      const sentimentResponse = await fetch("/api/sentiment/", {
        method: "POST",
      });
      if (sentimentResponse.ok) {
        const sentiment = await sentimentResponse.json();
        setSentimentData(sentiment.sentiment || null);
      }

      const chatResponse = await fetch("/api/chat/history");
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        setChatHistory(chatData.history || []);
      }
    } catch {
      toast({
        title: "Connection Error",
        description:
          "Unable to connect to backend. Ensure Flask is running on port 8001.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CHAT ---------------- */
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.bot_reply },
      ]);
    } catch {
      toast({
        title: "Chat Error",
        description: "Unable to connect to chat service.",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <main className="container mx-auto px-6 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Chat with AI Assistant
          </h2>

          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-muted/30 rounded-lg">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="flex gap-2 items-end">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type or use voice..."
                rows={2}
              />

              {/* MIC BUTTON */}
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleMic}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>

              {/* SEND BUTTON */}
              <Button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
              >
                <Send />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MentalHealthJournal;
