import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Mic, MicOff, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authedFetch } from "@/lib/api";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}


const MentalHealthJournal = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hi there 🌸 I'm here to listen. How are you feeling today? You can share anything — thoughts, worries, or just how your day went.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US"; r.continuous = false; r.interimResults = false;
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setChatInput((p) => p ? p + " " + t : t);
    };
    r.onend = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    recognitionRef.current = r;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice not supported", variant: "destructive" });
      return;
    }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { recognitionRef.current.start(); setIsListening(true); }
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? chatInput).trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    if (textareaRef.current) textareaRef.current.style.height = "44px";
    setChatMessages((p) => [...p, { sender: "user", text: msg }]);
    setChatLoading(true);
    try {
      const res = await authedFetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: msg }),
      });
      if (res.status === 401) {
        setChatMessages((p) => [...p, { sender: "ai", text: "Your session has expired. Please sign in again." }]);
        navigate("/auth");
        return;
      }
      const data = await res.json();
      setChatMessages((p) => [...p, { sender: "ai", text: data.bot_reply }]);
    } catch {
      setChatMessages((p) => [...p, { sender: "ai", text: "I'm having trouble connecting. Please ensure the backend is running on port 8001." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    e.target.style.height = "44px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Figtree:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root { height: 100%; overflow: hidden; }

        .mhj-root {
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background: #FAF7F4;
          font-family: 'Figtree', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* ambient blobs */
        .blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .blob-1 { width: 420px; height: 420px; background: #7C6AF71A; top: -100px; right: -80px; }
        .blob-2 { width: 360px; height: 360px; background: #F26B8A16; bottom: -80px; left: -80px; }

        /* grain */
        .grain {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 180px;
        }

        /* ---- HEADER ---- */
        .mhj-header {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 28px;
          background: rgba(250,247,244,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #EDE8E1;
          flex-shrink: 0;
        }
        .mhj-back {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          font-family: 'Figtree', sans-serif;
          font-size: 13.5px; font-weight: 500; color: #A89B8C;
          padding: 6px 10px; border-radius: 99px;
          transition: background 0.2s, color 0.2s;
        }
        .mhj-back:hover { background: #EDE8E1; color: #1C1612; }

        .mhj-title-wrap {
          display: flex; flex-direction: column; align-items: center;
        }
        .mhj-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 700; color: #1C1612;
          letter-spacing: -0.01em;
        }
        .mhj-subtitle {
          font-size: 11.5px; color: #C4B8AB; font-weight: 400; margin-top: 1px;
        }

        .mhj-status {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 99px;
          background: #fff; border: 1px solid #EDE8E1;
          font-size: 12px; font-weight: 500; color: #A89B8C;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
        }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #3DB88B;
          box-shadow: 0 0 0 3px #3DB88B28;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 3px #3DB88B28; }
          50% { box-shadow: 0 0 0 6px #3DB88B0A; }
        }

        /* ---- CHAT AREA ---- */
        .mhj-chat-wrap {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px 0;
          position: relative; z-index: 1;
          scroll-behavior: smooth;
        }
        .mhj-chat-wrap::-webkit-scrollbar { width: 4px; }
        .mhj-chat-wrap::-webkit-scrollbar-thumb { background: #EDE8E1; border-radius: 99px; }

        .mhj-chat-inner {
          max-width: 720px; margin: 0 auto; padding: 0 24px;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* Message bubbles */
        .msg-row {
          display: flex; gap: 10px;
          animation: fadeUp 0.3s ease both;
        }
        .msg-row.user { flex-direction: row-reverse; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; margin-top: 2px;
        }
        .msg-avatar.ai {
          background: linear-gradient(135deg, #7C6AF7, #F26B8A);
        }
        .msg-avatar.user {
          background: linear-gradient(135deg, #F26B8A, #FB923C);
        }

        .msg-bubble {
          max-width: 72%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14.5px; font-weight: 400; line-height: 1.6;
        }
        .msg-bubble.ai {
          background: #fff;
          border: 1px solid #EDE8E1;
          color: #1C1612;
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #7C6AF7, #9F8BF8);
          color: #fff;
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 16px rgba(124,106,247,0.3);
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex; gap: 5px; align-items: center; padding: 14px 16px;
          background: #fff; border: 1px solid #EDE8E1; border-radius: 18px;
          border-bottom-left-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          width: fit-content;
        }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #C4B8AB;
          animation: bounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* ---- SUGGESTIONS ---- */
        .mhj-suggestions {
          max-width: 720px; margin: 0 auto 10px;
          padding: 0 24px;
          display: flex; gap: 8px; flex-wrap: wrap;
          position: relative; z-index: 2;
        }
        .suggestion-pill {
          padding: 7px 14px; border-radius: 99px;
          background: #fff; border: 1px solid #EDE8E1;
          font-family: 'Figtree', sans-serif;
          font-size: 12.5px; font-weight: 500; color: #A89B8C;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          white-space: nowrap;
        }
        .suggestion-pill:hover {
          background: #EEEAFF; border-color: #C4B8FF; color: #7C6AF7;
          transform: translateY(-1px);
        }

        /* ---- INPUT BAR ---- */
        .mhj-input-bar {
          flex-shrink: 0;
          position: relative; z-index: 10;
          border-top: 1px solid #EDE8E1;
          background: rgba(250,247,244,0.95);
          backdrop-filter: blur(20px);
          padding: 14px 24px 18px;
        }
        .mhj-input-inner {
          max-width: 720px; margin: 0 auto;
          display: flex; align-items: flex-end; gap: 10px;
        }
        .mhj-textarea-wrap {
          flex: 1;
          display: flex; align-items: flex-end;
          background: #fff;
          border: 1.5px solid #EDE8E1;
          border-radius: 16px;
          padding: 10px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .mhj-textarea-wrap:focus-within {
          border-color: #C4B8FF;
          box-shadow: 0 0 0 3px #7C6AF712, 0 2px 10px rgba(0,0,0,0.04);
        }
        .mhj-textarea {
          flex: 1;
          background: none; border: none; outline: none; resize: none;
          font-family: 'Figtree', sans-serif;
          font-size: 14.5px; font-weight: 400; color: #1C1612;
          line-height: 1.55;
          height: 44px; min-height: 44px; max-height: 120px;
          overflow-y: auto;
        }
        .mhj-textarea::placeholder { color: #C4B8AB; }
        .mhj-textarea::-webkit-scrollbar { width: 3px; }
        .mhj-textarea::-webkit-scrollbar-thumb { background: #EDE8E1; border-radius: 99px; }

        .icon-btn {
          width: 44px; height: 44px; border-radius: 13px;
          border: none; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; font-family: 'Figtree', sans-serif;
        }
        .mic-btn {
          background: #F5F0EB;
          border: 1px solid #EDE8E1;
          color: #A89B8C;
        }
        .mic-btn:hover { background: #EDE8E1; color: #1C1612; }
        .mic-btn.active {
          background: #FFEEE9; border-color: #F06A4A; color: #F06A4A;
          animation: micPulse 1s infinite;
        }
        @keyframes micPulse {
          0%,100% { box-shadow: 0 0 0 0 #F06A4A20; }
          50% { box-shadow: 0 0 0 6px #F06A4A08; }
        }
        .send-btn {
          background: linear-gradient(135deg, #7C6AF7, #9F8BF8);
          color: #fff;
          box-shadow: 0 4px 14px rgba(124,106,247,0.35);
        }
        .send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124,106,247,0.45);
        }
        .send-btn:disabled {
          opacity: 0.45; cursor: not-allowed; transform: none;
          box-shadow: none;
        }

        .mhj-hint {
          text-align: center; margin-top: 8px;
          font-size: 11px; color: #C4B8AB; font-weight: 400;
        }
      `}</style>

      <div className="mhj-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grain" />

        {/* HEADER */}
        <header className="mhj-header">
          <button className="mhj-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="mhj-title-wrap">
            <h1 className="mhj-title">Mental Health Journal</h1>
            <p className="mhj-subtitle">Your safe space to feel and heal</p>
          </div>

          <div className="mhj-status">
            <div className="status-dot" />
            AI online
          </div>
        </header>

        {/* CHAT MESSAGES */}
        <div className="mhj-chat-wrap">
          <div className="mhj-chat-inner">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`msg-avatar ${msg.sender}`}>
                  {msg.sender === "ai" ? <Sparkles size={14} color="white" /> : "U"}
                </div>
                <div className={`msg-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="msg-row ai">
                <div className="msg-avatar ai">
                  <Sparkles size={14} color="white" />
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* SUGGESTION PILLS — only show if no user messages yet */}
        {chatMessages.filter((m) => m.sender === "user").length === 0 && (
          <div className="mhj-suggestions">
            {["I'm feeling anxious today 😟", "I had a great day! 🌟", "I need to vent", "Breathing exercises please"].map((s) => (
              <button key={s} className="suggestion-pill" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}


        {/* INPUT BAR */}
        <div className="mhj-input-bar">
          <div className="mhj-input-inner">
            <div className="mhj-textarea-wrap">
              <textarea
                ref={textareaRef}
                className="mhj-textarea"
                value={chatInput}
                onChange={autoResize}
                onKeyDown={handleKey}
                placeholder="Share how you're feeling… (Enter to send)"
                rows={1}
              />
            </div>

            <button
              className={`icon-btn mic-btn ${isListening ? "active" : ""}`}
              onClick={toggleMic}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              className="icon-btn send-btn"
              onClick={() => sendMessage()}
              disabled={chatLoading || !chatInput.trim()}
            >
              <Send size={17} />
            </button>
          </div>
          <p className="mhj-hint">Shift+Enter for new line · Enter to send</p>
        </div>
      </div>
    </>
  );
};

export default MentalHealthJournal;