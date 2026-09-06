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
  { label: '🕒 What is the current time & date?', prompt: 'What is the current time, date, and day today?' },
  { label: '👥 Who are the founders of this app?', prompt: 'Who is the founder of this app?' },
  { label: '🚄 What is Railmark AI?', prompt: 'Explain what Railmark AI is and how it works.' },
  { label: '💬 General Conversation', prompt: 'Hello E.D.I.T.H! How are you doing today? What can you do?' },
  { label: '🔍 How does QR Laser Marking work?', prompt: 'How does digital laser QR marking on railway track fittings ensure safety?' },
  { label: '💡 Tell me an interesting science fact', prompt: 'Tell me a fascinating fact about railway engineering and physics.' },
  { label: '📋 RDSO Track Standards', prompt: 'What are the RDSO standards for Elastic Rail Clips (ERC MK-III)?' },
];

function generateEdithResponse(input: string): { text: string; isFounders?: boolean; tag?: string } {
  const raw = input.trim();
  const query = raw.toLowerCase();

  // Normalize repeated characters (e.g., 'hiiiii' -> 'hi', 'heyyyy' -> 'hey', 'yessss' -> 'yes')
  const collapsed = query.replace(/(.)\1{2,}/g, '$1$1').replace(/([a-z])\1{2,}/g, '$1');
  const cleanTokens = query.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Time / Date / Day / Calendar Telemetry
  const isTemporal =
    cleanTokens === 'time' ||
    cleanTokens === 'date' ||
    cleanTokens === 'day' ||
    query.includes('time') ||
    query.includes('date') ||
    query.includes('day') ||
    query.includes('today') ||
    query.includes('clock') ||
    query.includes('calendar') ||
    query.includes('current hour') ||
    query.includes('what year') ||
    query.includes('what month');

  if (isTemporal) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    const dayString = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const isoDate = now.toISOString().split('T')[0];
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

    return {
      text: `🕒 **Temporal Telemetry & Live Chronometer:**\n\n- **Current Time:** ${timeString}\n- **Current Day:** ${dayString}\n- **Current Date:** ${dateString} (${isoDate})\n- **Timezone:** ${timeZone}\n\nAll internal railway track telemetry, inspection loggers, and predictive maintenance chronometers are fully synchronized with real-time atomic standards.`,
      tag: 'Live Chronometer Sync',
    };
  }

  // 2. Founders / Creators / Team detection
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

  // 3. Informal Greetings & Gestures (e.g. 'hiiiii', 'heyyy', 'yo', 'wassup', 'namaste', emojis, waves)
  const isGreeting =
    /^h+i+/i.test(query) ||
    /^h+e+y+/i.test(query) ||
    /^h+e+l+l+o+/i.test(query) ||
    /^y+o+/i.test(query) ||
    /^s+u+p+/i.test(query) ||
    query.startsWith('gm') ||
    query.startsWith('gn') ||
    query.includes('good morning') ||
    query.includes('good afternoon') ||
    query.includes('good evening') ||
    query.includes('good night') ||
    query.includes('hola') ||
    query.includes('howdy') ||
    query.includes('namaste') ||
    query.includes('vanakkam') ||
    query.includes('bonjour') ||
    query.includes('aloha') ||
    query.includes('wassup') ||
    query.includes("what's up") ||
    query.includes('👋') ||
    query.includes('😊') ||
    query.includes('✨') ||
    query.includes('❤️') ||
    query.includes('👍') ||
    query.includes('🙏') ||
    query.includes('*wave*') ||
    query.includes('*smile*');

  if (isGreeting && cleanTokens.split(' ').length <= 4 && !query.includes('how does') && !query.includes('why')) {
    const greetings = [
      `Hiiiii there! 👋 **E.D.I.T.H AI** is online, charged, and happy to chat! How can I brighten your day or assist your railway exploration?`,
      `Hey! Great to connect with you! 🌟 I'm ready for anything—whether it's railway engineering queries, coding, science questions, or a fun conversation. What's on your mind?`,
      `Hello! E.D.I.T.H neural systems are fully engaged! ✨ What would you like to explore today?`,
      `Greetings! 👋 Even Dead, I'm The Hero (E.D.I.T.H) at your service. How can I help you right now?`,
    ];
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      tag: 'Conversational Greeting',
    };
  }

  // 4. Gratitude & Appreciation
  if (
    query.includes('thank') ||
    query.includes('thx') ||
    query.includes('tq') ||
    query.includes('appreciate') ||
    query.includes('great job') ||
    query.includes('good job') ||
    query.includes('awesome') ||
    query.includes('you are cool') ||
    query.includes('you are smart') ||
    query.includes('you are great')
  ) {
    return {
      text: `You are very welcome! 😊 It is my pleasure to assist. \n\nFeel free to ask me anything else whenever you need guidance, calculations, or information!`,
      tag: 'Polite Gratitude',
    };
  }

  // 5. Identity & About E.D.I.T.H
  if (
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('what is your name') ||
    query.includes('who made you') ||
    query.includes('what can you do')
  ) {
    return {
      text: `I am **E.D.I.T.H AI** (*Even Dead, I'm The Hero*), an advanced multi-domain cognitive intelligence platform designed for **Railmark AI** and general knowledge assistance.\n\n### ⚡ Core Modules:\n1. **Railway Digital Traceability & Physics**: Direct Part Marking (DPM), 2D QR tracking, RDSO standards (IRS:T-31, IRS:T-47), remaining useful life (RUL) modeling, and inspection analytics.\n2. **Multi-Domain Intelligence**: Science, mathematics, general world facts, coding, reasoning, and casual conversations.\n3. **Temporal Precision**: Real-time synchronized chronometer and atomic date/day telemetry.\n\nAsk me anything!`,
      tag: 'System Identity',
    };
  }

  // 6. Farewell & Goodbyes
  if (
    collapsed === 'bye' ||
    collapsed === 'goodbye' ||
    collapsed === 'cya' ||
    query.includes('see you') ||
    query.includes('bye bye') ||
    query.includes('have a good day')
  ) {
    return {
      text: `Goodbye! 👋 Have a fantastic and productive day! Whenever you return, E.D.I.T.H AI will be right here ready to assist.`,
      tag: 'Farewell',
    };
  }

  // 7. Railmark AI / Application Specifics
  if (query.includes('railmark') || (query.includes('what is') && query.includes('app'))) {
    return {
      text: `**Railmark AI** is a state-of-the-art **Digital Traceability & Predictive Maintenance Platform** built for Indian Railways track fittings.\n\n### Key Capabilities:\n- **Direct Laser Marking (DPM)**: Unique serialized alphanumeric 2D QR codes laser-etched onto Elastic Rail Clips (ERC), liners, and sole plates.\n- **Optical QR Scanner**: Real-time camera & handheld QR decoding for field gang inspectors.\n- **AI Vision Defect Lab**: Automatic detection of corrosion, surface deformation, and wear.\n- **Predictive RUL Analytics**: Remaining Useful Life forecasting based on Gross Million Tonnes (GMT) and cyclic axle loads.\n- **Digital Twin & Compliance**: Centralized lifecycle tracking complying with RDSO IRS:T-31 and IRS:T-47 specifications.`,
      tag: 'Platform Overview',
    };
  }

  if (query.includes('qr') || query.includes('laser') || query.includes('scanner') || query.includes('dpm')) {
    return {
      text: `### Direct Part Marking (DPM) & QR Traceability\n\nIn Railmark AI, each track component undergoes **Fiber Laser Annealing/Engraving** with a high-contrast DataMatrix or QR Code containing:\n- Unique Fitting UUID (e.g. \`RM-FIT-0004\`)\n- Batch Number & Heat Code\n- Metallurgical Grade (e.g. 55Si7 Spring Steel)\n- Installation Date & Geolocation Coordinates\n\nWhen track inspectors scan the QR code via mobile or handheld optical cameras, the fitting's complete maintenance history, inspection logs, and warranty data load instantly.`,
      tag: 'Traceability Architecture',
    };
  }

  if (query.includes('rdso') || query.includes('irs:t-31') || query.includes('standard') || query.includes('irpwm')) {
    return {
      text: `### Indian Railways RDSO Standards Supported:\n- **IRS:T-31-2021**: Standard specifications for Elastic Rail Clips (ERC MK-III & MK-V). Required nominal toe load: **850 kg – 1100 kg**.\n- **IRS:T-47**: Grooved Rubber Sole Plates (GRSP 6mm & 10mm) for PSC Sleepers.\n- **IRS:T-46**: Glass Filled Nylon Insulating Liners (GFN-66).\n- **IRPWM 2020**: Indian Railways Permanent Way Manual for ultrasonic flaw detection (USFD) and track maintenance intervals.`,
      tag: 'Compliance & Standards',
    };
  }

  // 8. Mathematics & Calculations
  const mathMatch = query.match(/^(?:calculate|what is|compute|evaluate)?\s*([0-9+\-*/^().\s]+)\s*\??$/);
  if (mathMatch && mathMatch[1].replace(/[^0-9]/g, '').length > 0) {
    try {
      const sanitized = mathMatch[1].replace(/[^0-9+\-*/.()]/g, '');
      if (sanitized.length > 0 && !/[a-zA-Z_$]/.test(sanitized)) {
        // eslint-disable-next-line no-new-func
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            text: `**Calculation Result:**\n\`\`\`\n${sanitized} = ${result}\n\`\`\`\nLet me know if you need further mathematical derivations, formulas, or conversions!`,
            tag: 'Mathematical Calculation',
          };
        }
      }
    } catch {
      // Fall through to general engine
    }
  }

  // 9. Geography & World Knowledge (Capitals, Countries, Capitals of States)
  if (query.includes('capital of')) {
    const capitals: Record<string, string> = {
      india: 'New Delhi',
      france: 'Paris',
      usa: 'Washington, D.C.',
      'united states': 'Washington, D.C.',
      'united kingdom': 'London',
      uk: 'London',
      germany: 'Berlin',
      japan: 'Tokyo',
      china: 'Beijing',
      russia: 'Moscow',
      canada: 'Ottawa',
      australia: 'Canberra',
      brazil: 'Brasília',
      italy: 'Rome',
      spain: 'Madrid',
      egypt: 'Cairo',
      'tamil nadu': 'Chennai',
      karnataka: 'Bengaluru',
      maharashtra: 'Mumbai',
      delhi: 'New Delhi',
      kerala: 'Thiruvananthapuram',
    };
    for (const [place, cap] of Object.entries(capitals)) {
      if (query.includes(place)) {
        return {
          text: `The capital of **${place.toUpperCase()}** is **${cap}**.`,
          tag: 'World Geography',
        };
      }
    }
  }

  // 10. Science / Physics / Chemistry / Astronomy Facts
  if (query.includes('speed of light')) {
    return {
      text: `The speed of light in a vacuum ($c$) is approximately **299,792,458 meters per second** (~**300,000 km/s** or **186,282 miles per second**). At this speed, light takes about 8 minutes and 20 seconds to travel from the Sun to Earth!`,
      tag: 'Physics Fact',
    };
  }

  if (query.includes('gravity') || query.includes('gravitational')) {
    return {
      text: `**Gravity** is one of the four fundamental forces of nature. On Earth's surface, the standard acceleration due to gravity is **$g \\approx 9.80665 \\text{ m/s}^2$**.\n\nAccording to Einstein's General Theory of Relativity, gravity is not merely a force, but the curvature of spacetime caused by mass and energy!`,
      tag: 'Physics Principles',
    };
  }

  if (query.includes('why is the sky blue')) {
    return {
      text: `The sky is blue because of a physical phenomenon known as **Rayleigh Scattering**.\n\nWhen sunlight reaches Earth's atmosphere, it is scattered in all directions by atmospheric gases. Blue light travels as smaller, shorter waves, so it gets scattered much more than longer red or yellow wavelengths, giving the daytime sky its characteristic blue hue!`,
      tag: 'Atmospheric Physics',
    };
  }

  if (query.includes('fact') || query.includes('science') || query.includes('physics')) {
    const facts = [
      `### Fascinating Railway Physics Fact 🌌\n\nDid you know? **Continuous Welded Rails (CWR)** expand significantly in extreme summer heat (reaching rail temperatures over 65°C in India). To prevent **Track Buckling**, railway engineers pre-stress rails to a **Stress-Free Temperature (SFT)** (typically 38°C–42°C) and secure them with **Elastic Rail Clips (ERC)** exerting >1,000 kg of toe force!`,
      `### Quantum Physics Trivia ⚛️\n\nIn quantum mechanics, particles like electrons can exist in a state of **superposition**—meaning they can occupy multiple possible states simultaneously until observed!`,
      `### Space Telemetry Fact 🚀\n\nNeutron stars are so dense that just a single sugar-cube-sized amount of their material would weigh approximately **1 billion tons** on Earth!`,
    ];
    return {
      text: facts[Math.floor(Math.random() * facts.length)],
      tag: 'Science & Engineering Knowledge',
    };
  }

  // 11. Coding, Programming & Tech Queries
  if (
    query.includes('code') ||
    query.includes('python') ||
    query.includes('javascript') ||
    query.includes('typescript') ||
    query.includes('react') ||
    query.includes('html') ||
    query.includes('css') ||
    query.includes('function') ||
    query.includes('algorithm') ||
    query.includes('loop') ||
    query.includes('bug')
  ) {
    if (query.includes('python') && (query.includes('example') || query.includes('write') || query.includes('sort'))) {
      return {
        text: `Here is a Python quicksort implementation:\n\`\`\`python\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\n# Example usage:\nprint(quicksort([38, 27, 43, 3, 9, 82, 10]))\n\`\`\`\nTime Complexity: $O(n \\log n)$ average. Let me know if you need any other language or framework snippet!`,
        tag: 'Python Code Generator',
      };
    }
    return {
      text: `I'd be glad to assist with full-stack software development, algorithms, or technical design!\n\nWhether you need help with **React/TypeScript**, **REST APIs**, **Computer Vision (OpenCV/PyTorch)**, **PostgreSQL/MongoDB**, or database schema design for industrial IoT, simply describe what you'd like to build or debug!`,
      tag: 'Software Engineering',
    };
  }

  // 12. Jokes, Humor & Entertainment
  if (query.includes('joke') || query.includes('funny') || query.includes('humor') || query.includes('laugh')) {
    const jokes = [
      `Why did the railway track fitting go to therapy?\n\nBecause it was under too much tension and suffering from severe cyclic stress fatigue! 🚄⚡`,
      `Why are train tracks so good at staying grounded?\n\nBecause they always stay on the right rails and have great sleepers! 🛤️😄`,
      `How do software developers inspect railway tracks?\n\nThey run a \`git pull\` on the train and check for merge collisions! 💻🔧`,
      `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛💡`,
    ];
    return { text: jokes[Math.floor(Math.random() * jokes.length)], tag: 'Humor & Fun' };
  }

  // 13. Life, Motivation & Philosophy
  if (query.includes('meaning of life') || query.includes('purpose of life')) {
    return {
      text: `Philosophically, the **meaning of life** is the purpose, connection, and joy you create through your actions, relationships, and pursuit of knowledge.\n\nAs Carl Sagan beautifully said: *"We are a way for the cosmos to know itself."* \n\nAnd from a technological perspective: Keep building, learning, and leaving the world safer and better than you found it! ✨`,
      tag: 'Philosophical Reflection',
    };
  }

  if (query.includes('motivat') || query.includes('inspire') || query.includes('quote')) {
    return {
      text: `💡 **E.D.I.T.H Motivation Protocol:**\n\n*"Excellence is not an act, but a habit. Every complex system—from a transcontinental high-speed railway to breakthrough artificial intelligence—is built sleeper by sleeper, line by line."*\n\nKeep pushing forward; consistency and focus always conquer complexity! 🚀`,
      tag: 'Inspirational Directive',
    };
  }

  // 14. Universal Conversational Reasoning Synthesizer
  return {
    text: `### 🤖 E.D.I.T.H Neural Reasoning Engine\n\nRegarding your query on **"${raw}"**:\n\n1. **Core Insight:** I have analyzed your request across multidisciplinary data banks.\n2. **Contextual Analysis:** Whether this pertains to railway engineering logic, digital infrastructure, scientific principles, or general knowledge, I am ready to delve deeper.\n3. **Next Steps:** Would you like a detailed breakdown, step-by-step calculation, technical standard reference, or a creative perspective on this topic?\n\nTell me how you would like to proceed!`,
    tag: 'E.D.I.T.H Neural Synthesis',
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
