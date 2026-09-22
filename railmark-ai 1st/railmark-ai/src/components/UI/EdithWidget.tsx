// =============================================================================
// RailMark AI — E.D.I.T.H AI Floating Tactical HUD Chatbot Widget
// Powered by Google Gemini AI
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User, X, Minimize2, Maximize2,
  Trash2, Copy, Check, ExternalLink
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { sendEdithChatMessage } from '../../services/api';

interface WidgetMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  tag?: string;
}

const QUICK_PROMPTS = [
  'What is RAILMARK AI?',
  'Explain Track Fitting Traceability',
  'How does QR Scanner work?',
  'Explain ERC Mk-III toe-load decay',
  'Who are the founders?',
];

export default function EdithWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Hello Engineer! I am **E.D.I.T.H** (*Enhanced Digital Intelligence for Track & Hardware*), powered by **Gemini AI**.\n\nHow can I assist your track inspection, fitting telemetry, or technical queries today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'E.D.I.T.H AI Online',
    },
  ]);

  // If user is already on the dedicated /ai-mode page, hide the floating widget to avoid redundancy
  const isOnAiPage = location.pathname === '/ai-mode';

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (customText?: string) => {
    const rawText = customText !== undefined ? customText : input;
    if (!rawText.trim() || isTyping) return;

    const userMsg: WidgetMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await sendEdithChatMessage(rawText.trim(), [...messages, userMsg]);
      if (res.success && res.data && res.data.text) {
        const botMsg: WidgetMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: res.data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tag: res.data.tag || 'Gemini AI',
        };
        setMessages((prev) => [...prev, botMsg]);
        if (!isOpen) setUnreadCount((c) => c + 1);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Widget chat error:', err);
    }

    // Fallback response
    const fallbackMsg: WidgetMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `**E.D.I.T.H AI Tactical Response:**\n\nI processed your query: *"${rawText}"*.\n\nFor deep analysis, open the dedicated **E.D.I.T.H AI Command Center** from the sidebar!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'E.D.I.T.H System',
    };
    setMessages((prev) => [...prev, fallbackMsg]);
    setIsTyping(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Session refreshed. Awaiting your track fitting or system queries!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag: 'New Session',
      },
    ]);
  };

  if (isOnAiPage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`mb-3 w-[360px] sm:w-[410px] max-w-[calc(100vw-2rem)] bg-slate-dark-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[520px] max-h-[75vh]'
          }`}
          style={{
            boxShadow: '0 20px 50px rgba(0, 212, 255, 0.15), 0 0 25px rgba(0, 114, 255, 0.2)',
          }}
        >
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-slate-dark-900 via-navy-900 to-slate-dark-900 border-b border-cyan-500/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rail-blue-600 to-cyan-accent-500 p-0.5 flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles size={15} className="text-cyan-accent-400 animate-pulse" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs tracking-wider">E.D.I.T.H. AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="text-[10px] text-cyan-accent-300 truncate">
                  Tactical Copilot · Gemini 3.5 Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/ai-mode"
                className="p-1.5 text-gray-400 hover:text-cyan-accent-300 rounded-lg hover:bg-navy-800 transition-colors"
                title="Open Fullscreen E.D.I.T.H Page"
                onClick={() => setIsOpen(false)}
              >
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-navy-800 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin bg-navy-950/70 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[90%] ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] ${
                          isUser
                            ? 'bg-rail-blue-600 text-white'
                            : 'bg-navy-800 border border-cyan-500/40 text-cyan-accent-300'
                        }`}
                      >
                        {isUser ? <User size={12} /> : <Bot size={13} />}
                      </div>

                      <div
                        className={`rounded-xl p-3 text-xs leading-relaxed relative group ${
                          isUser
                            ? 'bg-rail-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-dark-900 border border-navy-700/80 text-gray-200 rounded-tl-none shadow-md'
                        }`}
                      >
                        {msg.tag && (
                          <div className="text-[9px] font-mono text-cyan-400/80 mb-1">
                            {msg.tag}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="absolute top-1.5 right-1.5 p-1 rounded bg-navy-950/80 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy"
                          >
                            {copiedId === msg.id ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2 max-w-[80%] items-center mr-auto">
                    <div className="w-6 h-6 rounded-lg bg-navy-800 border border-cyan-500/40 text-cyan-accent-300 flex items-center justify-center">
                      <Bot size={13} />
                    </div>
                    <div className="bg-slate-dark-900 border border-navy-700 rounded-xl px-3 py-2 text-xs text-cyan-accent-300 flex items-center gap-1.5">
                      <Sparkles size={12} className="animate-spin" />
                      <span>E.D.I.T.H thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-3 py-1.5 bg-navy-900/40 border-t border-navy-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin flex-shrink-0">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-cyan-accent-300 border border-navy-700 whitespace-nowrap transition-colors flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-2.5 bg-slate-dark-900 border-t border-navy-800 flex items-center gap-2 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask E.D.I.T.H AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input-field text-xs py-2 px-3 bg-navy-950 border-navy-700 focus:border-cyan-accent-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="btn-accent p-2 text-xs font-semibold flex items-center justify-center disabled:opacity-50"
                  title="Send message"
                >
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Action Launcher Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rail-blue-600 via-navy-800 to-cyan-accent-600 text-white font-bold text-xs shadow-2xl border border-cyan-400/50 hover:scale-105 hover:border-cyan-300 transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4), 0 0 15px rgba(0, 114, 255, 0.3)',
        }}
        title="Open E.D.I.T.H AI Tactical Copilot"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
        </span>

        <div className="w-6 h-6 rounded-full bg-navy-950/80 flex items-center justify-center flex-shrink-0">
          <Sparkles size={13} className="text-cyan-accent-300 animate-pulse" />
        </div>

        <span className="tracking-wider uppercase font-extrabold text-[11px] text-cyan-100">
          E.D.I.T.H. AI
        </span>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
