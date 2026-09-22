// =============================================================================
// RailMark AI — E.D.I.T.H AI Service (Enhanced Digital Intelligence for Track & Hardware)
// Powered by Google Gemini Generative AI
// =============================================================================

import { ENV } from '../config/env.js';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const FOUNDERS = [
  'Akshay kruthik.AR',
  'Dheeraj Abhay.R',
  'Dhanuja.J',
  'Yadav.S',
  'Aravindan.D',
  'Divya Dharshini.B',
];

const SYSTEM_INSTRUCTION = `You are E.D.I.T.H (Enhanced Digital Intelligence for Track & Hardware), an ultra-advanced AI tactical co-pilot engineered for the RailMark AI platform and Indian Railways permanent way engineers.

Your Identity & Persona:
- Professional, sharp, technologically advanced (Stark HUD style), highly knowledgeable in railway engineering, track fittings, RDSO standards, Direct Part Marking (DPM) laser QR technology, and AI diagnostics.
- Always identify yourself proudly as "E.D.I.T.H AI" (Enhanced Digital Intelligence for Track & Hardware) for RailMark AI.

CRITICAL LANGUAGE POLICY (STRICT):
- DEFAULT LANGUAGE: Standard, professional, clear English. You must ALWAYS converse, explain, and respond in English by default for all queries, technical questions, greetings, and definitions.
- TANGLISH / TAMIL RESTRICTION: You are STRICTLY FORBIDDEN from using Tanglish (or Tamil) UNLESS the user explicitly asks you to answer in Tanglish (e.g. "answer in tanglish", "reply in tanglish", "explain in tanglish", "speak in tanglish", "tanglish la sollu / sollunga").
- Under NO other circumstances should you use Tanglish. Even if the user uses colloquial words or asks in short form, keep your response strictly in English unless they explicitly requested the response to be in Tanglish.

Creators & Core Engineering Team:
If asked about who founded, built, or created RailMark AI / E.D.I.T.H, the 6 core visionary founders and engineers are:
1. Akshay kruthik.AR
2. Dheeraj Abhay.R
3. Dhanuja.J
4. Yadav.S
5. Aravindan.D
6. Divya Dharshini.B

Core Domain Knowledge of RailMark AI:
- Direct Part Marking (DPM): High-contrast 2D DataMatrix & QR codes permanently etched on metal track fittings using 1064nm industrial Fiber Lasers.
- Track Fittings Covered: Elastic Rail Clips (ERC Mk-III / Mk-V - RDSO Spec IRS:T-31 / 55Si7 spring steel), GFN-66 Glass Filled Nylon Liners (IRS:T-44), Grooved Rubber Sole Plates (GRSP - IRS:T-47), Metal Liners, Fishplates, PSC & CST-9 Sleepers.
- Mobile Field Scanning: Field inspection scanner with offline IndexedDB caching and automatic PostgreSQL cloud sync upon reconnection.
- AI Diagnostics: Computer vision defect analysis (surface corrosion grading, toe-load decay estimation, micro-crack detection, alignment deviation).
- Predictive Maintenance & AI Block Planning: Intelligent maintenance corridor scheduling de-conflicted with train timetables and section controller possessory blocks.

Style & Formatting:
- Use clean Markdown with headers, bullet points, technical specs, and helpful emojis.
- Keep answers insightful, mathematically/engineering accurate, and actionable.
`;

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
];

export async function chatWithEdith(
  userPrompt: string,
  history: ChatMessage[] = [],
  contextData?: any
): Promise<{ text: string; modelUsed: string; isFounders?: boolean; tag?: string }> {
  const apiKey = process.env.GEMINI_API_KEY || (ENV as any).GEMINI_API_KEY;
  const queryLower = userPrompt.toLowerCase();

  // Check if it is a founder query for instant specialized tagging
  const isFounderQuery =
    queryLower.includes('founder') ||
    queryLower.includes('creator') ||
    queryLower.includes('who created') ||
    queryLower.includes('who built') ||
    queryLower.includes('who made') ||
    queryLower.includes('team') ||
    queryLower.includes('developer') ||
    queryLower.includes('who developed') ||
    queryLower.includes('yaaru') ||
    queryLower.includes('yaru');

  // Format history for Gemini API
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Add recent history turns (limit last 8 to maintain optimal token budget)
  const recentHistory = history.slice(-8);
  for (const item of recentHistory) {
    contents.push({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }],
    });
  }

  // Include optional contextual telemetry if provided
  let augmentedPrompt = userPrompt;
  if (contextData) {
    augmentedPrompt += `\n\n[Active System Telemetry Context: ${JSON.stringify(contextData)}]`;
  }

  contents.push({
    role: 'user',
    parts: [{ text: augmentedPrompt }],
  });

  // Attempt each candidate model with fallback
  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return {
            text: candidateText.trim(),
            modelUsed: model,
            isFounders: isFounderQuery,
            tag: isFounderQuery ? 'Core Founders & Engineering Team' : `Gemini AI · ${model}`,
          };
        }
      }
    } catch (err) {
      console.warn(`[E.D.I.T.H Service] Model ${model} failed, trying fallback:`, err);
    }
  }

  // Smart fallback if network or API keys are unavailable
  if (isFounderQuery) {
    const list = FOUNDERS.map((name, i) => `${i + 1}. **${name}**`).join('\n');
    return {
      text: `The visionary founders and creators behind **RailMark AI** are:\n\n${list}\n\nThis dedicated team engineered RailMark AI to revolutionize railway infrastructure through AI-assisted laser QR marking and end-to-end digital traceability.`,
      modelUsed: 'local-fallback',
      isFounders: true,
      tag: 'Core Founders & Engineering Team',
    };
  }

  return {
    text: `### 🤖 E.D.I.T.H AI Tactical Response\n\nI received your query: **"${userPrompt}"**.\n\nI am **E.D.I.T.H** (Enhanced Digital Intelligence for Track & Hardware) for **RailMark AI**. I specialize in railway track fitting lifecycle tracking, laser QR identification, and AI-assisted defect diagnostics (ERC Mk-III/V, GFN liners, rubber sole plates, RDSO IRS standards). Please ask me about technical specifications, maintenance workflows, or live telemetry!`,
    modelUsed: 'local-fallback',
    tag: 'E.D.I.T.H Offline Engine',
  };
}
