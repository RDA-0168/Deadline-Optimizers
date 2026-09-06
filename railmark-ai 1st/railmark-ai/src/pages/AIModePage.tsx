import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, User, Bot, Trash2, Copy, Check,
  HelpCircle, Award
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isFounders?: boolean;
  tag?: string;
}

const FOUNDERS = [
  'Akshay kruthik.AR',
  'Dheeraj Abhay.R',
  'Dhanuja.J',
  'Yadav.S',
  'Aravindan.D',
  'Divya Dharshini.B',
];

const QUICK_PROMPTS = [
  { label: '👥 Who are the founders of this app?', prompt: 'Who is the founder of this app?' },
  { label: '🚄 What is Railmark AI?', prompt: 'Explain what Railmark AI is and how it works.' },
  { label: '💬 General Conversation', prompt: 'Hello E.D.I.T.H! How are you doing today? What can you do?' },
  { label: '🔍 How does QR Laser Marking work?', prompt: 'How does digital laser QR marking on railway track fittings ensure safety?' },
  { label: '💡 Tell me an interesting science fact', prompt: 'Tell me a fascinating fact about railway engineering and physics.' },
  { label: '📋 RDSO Track Standards', prompt: 'What are the RDSO standards for Elastic Rail Clips (ERC MK-III)?' },
];

function generateEdithResponse(input: string): { text: string; isFounders?: boolean; tag?: string } {
  const query = input.trim().toLowerCase();

  // 1. Founders / Creators / Team detection
  const isFounderQuery =
    query.includes('founder') ||
    query.includes('creator') ||
    query.includes('who created') ||
    query.includes('who built') ||
    query.includes('who made') ||
    query.includes('team') ||
    query.includes('developer') ||
    query.includes('authors') ||
    query.includes('who developed') ||
    query.includes('whose app') ||
    query.includes('created by') ||
    query.includes('built by') ||
    query.includes('makers');

  if (isFounderQuery) {
    const list = FOUNDERS.map((name, i) => `${i + 1}. **${name}**`).join('\n');
    return {
      text: `The visionary founders and creators behind **Railmark AI** are:\n\n${list}\n\nThis dedicated team engineered Railmark AI to revolutionize railway infrastructure through AI-assisted laser QR marking and end-to-end digital traceability.`,
      isFounders: true,
      tag: 'Core Founders & Engineering Team',
    };
  }

  // 2. Identity & Greetings
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.startsWith('hey ') ||
    query.includes('how are you') ||
    query.includes('who are you') ||
    query.includes('what is your name')
  ) {
    if (query.includes('who are you') || query.includes('what is your name')) {
      return {
        text: `I am **E.D.I.T.H AI** (*Even Dead, I'm The Hero*), the advanced neural intelligence system for **Railmark AI**.\n\nI possess dual capabilities:\n1. **Railway Track Digital Intelligence**: Comprehensive assistance on track fittings, laser QR traceability, RDSO/IRS standards, predictive maintenance, and defect analytics.\n2. **General Artificial Intelligence**: Conversing on general knowledge, science, mathematics, coding, philosophy, problem-solving, and everyday chat.\n\nHow may I assist you today?`,
        tag: 'System Identity',
      };
    }
    return {
      text: `Hello! I am **E.D.I.T.H AI**, online and fully operational.\n\nI am here to assist you with everything from railway digital traceability and inspection analytics to general questions, problem-solving, coding, and casual conversations.\n\nWhat would you like to explore or discuss today?`,
      tag: 'Greeting',
    };
  }

  // 3. Railmark AI / Application Specifics
  if (query.includes('railmark') || (query.includes('what is') && query.includes('app'))) {
    return {
      text: `**Railmark AI** is a state-of-the-art **Digital Traceability & Predictive Maintenance Platform** built for Indian Railways track fittings.\n\n### Key Capabilities:\n- **Direct Laser Marking (DPM)**: Unique serialized alphanumeric 2D QR codes laser-etched onto Elastic Rail Clips (ERC), liners, and sole plates.\n- **Optical QR Scanner**: Real-time camera & handheld QR decoding for field gang inspectors.\n- **AI Vision Defect Lab**: Automatic detection of corrosion, surface deformation, and wear.\n- **Predictive RUL Analytics**: Remaining Useful Life forecasting based on Gross Million Tonnes (GMT) and cyclic axle loads.\n- **Digital Twin & Compliance**: Centralized lifecycle tracking complying with RDSO IRS:T-31 and IRS:T-47 specifications.`,
      tag: 'Platform Overview',
    };
  }

  if (query.includes('qr') || query.includes('laser') || query.includes('scanner')) {
    return {
      text: `### Direct Part Marking (DPM) & QR Traceability\n\nIn Railmark AI, each track component undergoes **Fiber Laser Annealing/Engraving** with a high-contrast DataMatrix or QR Code containing:\n- Unique Fitting UUID (e.g. \`RM-FIT-0004\`)\n- Batch Number & Heat Code\n- Metallurgical Grade (e.g. 55Si7 Spring Steel)\n- Installation Date & Geolocation Coordinates\n\nWhen track inspectors scan the QR code via mobile or handheld optical cameras, the fitting's complete maintenance history, inspection logs, and warranty data load instantly.`,
      tag: 'Traceability Architecture',
    };
  }

  if (query.includes('rdso') || query.includes('standard') || query.includes('irs')) {
    return {
      text: `### Indian Railways RDSO Standards Supported:\n- **IRS:T-31-2021**: Standard specifications for Elastic Rail Clips (ERC MK-III & MK-V). Required nominal toe load: **850 kg – 1100 kg**.\n- **IRS:T-47**: Grooved Rubber Sole Plates (GRSP 6mm & 10mm) for PSC Sleepers.\n- **IRS:T-46**: Glass Filled Nylon Insulating Liners (GFN-66).\n- **IRPWM 2020**: Indian Railways Permanent Way Manual for ultrasonic flaw detection (USFD) and track maintenance intervals.`,
      tag: 'Compliance & Standards',
    };
  }

  // 4. Mathematics & Calculations
  const mathMatch = query.match(/^(?:calculate|what is|compute|evaluate)?\s*([0-9+\-*/^().\s]+)\s*\??$/);
  if (mathMatch && mathMatch[1].replace(/[^0-9]/g, '').length > 0) {
    try {
      // Safe sanitized arithmetic
      const sanitized = mathMatch[1].replace(/[^0-9+\-*/.()]/g, '');
      if (sanitized.length > 0 && !/[a-zA-Z_$]/.test(sanitized)) {
        // eslint-disable-next-line no-new-func
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            text: `**Calculation Result:**\n\`\`\`\n${sanitized} = ${result}\n\`\`\`\nLet me know if you need further mathematical derivations, formulas, or conversions!`,
            tag: 'Calculation',
          };
        }
      }
    } catch {
      // Fall through to general response
    }
  }

  // 5. Jokes & Humor
  if (query.includes('joke') || query.includes('funny') || query.includes('humor')) {
    const jokes = [
      `Why did the railway track fitting go to therapy?\n\nBecause it was under too much tension and suffering from severe cyclic stress fatigue! 🚄⚡`,
      `Why are train tracks so good at staying grounded?\n\nBecause they always stay on the right rails and have great sleepers! 🛤️😄`,
      `How do software developers inspect railway tracks?\n\nThey run a \`git pull\` on the train and check for merge collisions! 💻🔧`,
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return { text: picked, tag: 'Humor' };
  }

  // 6. Science / Physics / Engineering Facts
  if (query.includes('fact') || query.includes('science') || query.includes('physics')) {
    return {
      text: `### Fascinating Railway Physics Fact 🌌\n\nDid you know? **Continuous Welded Rails (CWR)** expand significantly in extreme summer heat (reaching rail temperatures over 65°C in India). \n\nTo prevent catastrophic **Track Buckling**, railway engineers pre-stress the rails to a designated **Stress-Free Temperature (SFT)** (usually around 38°C–42°C in Indian Railways zones) and secure them with **Elastic Rail Clips (ERC)** applying over **1,000 kg of toe force** per clip!`,
      tag: 'Science & Physics',
    };
  }

  // 7. Coding & Technical Queries
  if (query.includes('code') || query.includes('python') || query.includes('javascript') || query.includes('function') || query.includes('algorithm')) {
    return {
      text: `I'd be glad to assist with software development, algorithms, or technical design!\n\nWhether you need help with **React/TypeScript**, **REST APIs**, **Computer Vision (OpenCV/PyTorch)**, **PostgreSQL/MongoDB**, or database schema design for industrial IoT, simply describe what you'd like to build or debug!`,
      tag: 'Software Engineering',
    };
  }

  // 8. General AI Conversation Engine
  return {
    text: `That is an insightful question. \n\nRegarding **"${input.trim()}"**:\n\nAs **E.D.I.T.H AI**, I am equipped to assist across all domains—whether analyzing complex railway digital traceability workflows or engaging in general inquiries about science, technology, mathematics, and daily logic.\n\nIs there a specific angle or detail about this you would like me to elaborate on?`,
    tag: 'E.D.I.T.H Neural Reasoning',
  };
}

export default function AIModePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Welcome to **E.D.I.T.H AI** (*Even Dead, I'm The Hero*).\n\nI am your intelligent assistant for **Railmark AI** as well as general knowledge, problem-solving, and conversational intelligence.\n\nFeel free to ask me anything—from questions about the platform, its founders, and railway engineering standards, to science, mathematics, coding, and casual conversation!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'System Boot Initialized',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : input;
    if (!rawText.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic neural inference delay
    setTimeout(() => {
      const { text, isFounders, tag } = generateEdithResponse(rawText);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFounders,
        tag,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Welcome to **E.D.I.T.H AI**.\n\nChat session cleared. How can I assist you right now?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag: 'Fresh Session',
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-fade-in">
      {/* Top E.D.I.T.H Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-dark-900 via-navy-900 to-slate-dark-900 border border-cyan-accent-500/40 p-4 sm:p-5 shadow-2xl flex-shrink-0">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-cyan-accent-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-rail-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rail-blue-600 to-cyan-accent-500 p-0.5 shadow-lg shadow-cyan-accent-900/50 flex-shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles size={22} className="text-cyan-accent-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Welcome to E.D.I.T.H AI
                </h1>
                <span className="badge-active text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider">
                  ● ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Enhanced Digital Intelligence & Traceability Hub · Neural Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleClearChat}
              className="btn-secondary text-xs py-1.5 px-3 hover:border-red-500/50 hover:text-red-300 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-h-0 card p-0 bg-navy-950/90 border-navy-700/80 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Messages Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isUser
                      ? 'bg-rail-blue-600 text-white'
                      : 'bg-navy-800 border border-cyan-accent-500/50 text-cyan-accent-400 shadow-cyan-950/50'
                  }`}
                >
                  {isUser ? <User size={15} /> : <Bot size={16} />}
                </div>

                {/* Message Body */}
                <div className={`space-y-1 max-w-[88%] sm:max-w-[80%]`}>
                  <div className={`flex items-center gap-2 px-1 text-[11px] text-gray-400 ${isUser ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-gray-300">
                      {isUser ? 'You' : 'E.D.I.T.H AI'}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{msg.time}</span>
                    {msg.tag && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy-800 text-cyan-accent-400 border border-navy-700 font-mono">
                        {msg.tag}
                      </span>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg relative group ${
                      isUser
                        ? 'bg-rail-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-dark-900 border border-navy-700/90 text-gray-200 rounded-tl-none'
                    } ${msg.isFounders ? 'border-cyan-accent-500/60 bg-gradient-to-br from-slate-dark-900 via-navy-900 to-slate-dark-900 shadow-cyan-accent-950/50' : ''}`}
                  >
                    {/* Special Founders Card Highlight if applicable */}
                    {msg.isFounders ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-cyan-accent-300 font-bold border-b border-navy-800 pb-2">
                          <Award size={18} className="text-cyan-accent-400" />
                          <span>Railmark AI — Core Founders & Architects</span>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          The visionary founders and creators behind <strong>Railmark AI</strong> are:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2 pt-1">
                          {FOUNDERS.map((founder, idx) => (
                            <div
                              key={founder}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-navy-950/80 border border-navy-700/80 hover:border-cyan-accent-500/50 transition-all"
                            >
                              <div className="w-6 h-6 rounded-full bg-cyan-accent-950 border border-cyan-accent-500/40 flex items-center justify-center text-cyan-accent-300 font-bold text-[11px] font-mono">
                                {idx + 1}
                              </div>
                              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
                                {founder}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 pt-1 leading-relaxed">
                          This dedicated team engineered Railmark AI to revolutionize railway infrastructure through AI-assisted laser QR marking and end-to-end digital traceability.
                        </p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap space-y-2">
                        {msg.text.split('\n\n').map((para, pi) => (
                          <p key={pi}>{para}</p>
                        ))}
                      </div>
                    )}

                    {/* Copy message button on hover */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg bg-navy-950/80 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                        isUser ? 'hidden' : ''
                      }`}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-navy-800 border border-cyan-accent-500/50 text-cyan-accent-400 flex items-center justify-center shadow-md">
                <Bot size={16} />
              </div>
              <div className="bg-slate-dark-900 border border-navy-700/90 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-cyan-accent-300 flex items-center gap-2 shadow-lg">
                <Sparkles size={14} className="animate-spin" />
                <span>E.D.I.T.H AI is processing…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-navy-900/50 border-t border-navy-800/80 flex items-center gap-2 overflow-x-auto scrollbar-thin flex-shrink-0">
          <span className="text-[10px] uppercase font-semibold text-gray-500 flex items-center gap-1 flex-shrink-0">
            <HelpCircle size={11} /> Suggested:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-navy-800/90 hover:bg-navy-700 text-gray-300 hover:text-cyan-accent-300 border border-navy-700/80 hover:border-cyan-accent-500/40 transition-all whitespace-nowrap flex-shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-slate-dark-900 border-t border-navy-800 flex items-center gap-2 sm:gap-3 flex-shrink-0"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask E.D.I.T.H AI anything (e.g. 'Who is the founder of this app?', railway questions, or general chat)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field text-xs sm:text-sm py-3 pl-4 pr-10 bg-navy-950 border-navy-700 focus:border-cyan-accent-500"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-accent px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-950/50"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
