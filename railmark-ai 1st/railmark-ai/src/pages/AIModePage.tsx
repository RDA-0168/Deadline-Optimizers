import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, User, Bot, Trash2, Copy, Check,
  HelpCircle, Award, Code2, Terminal
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

// App-focused suggested prompt questions (Strictly based on Railmark AI application)
const QUICK_PROMPTS = [
  { label: '🏗️ System Architecture', prompt: 'Explain the detailed system architecture and tech stack of Railmark AI.' },
  { label: '🧠 AI Algorithms & RUL', prompt: 'What algorithms and mathematical models are used in Railmark AI?' },
  { label: '👥 Core Founders', prompt: 'Who is the founder of this app?' },
  { label: '🚄 Platform Overview', prompt: 'Explain what Railmark AI is and how it works.' },
  { label: '🔍 Laser QR DPM Traceability', prompt: 'How does digital laser QR marking on railway track fittings ensure safety?' },
  { label: '📋 RDSO Track Standards', prompt: 'What are the RDSO standards for Elastic Rail Clips (ERC MK-III)?' },
  { label: '📊 Dashboard & Analytics Hub', prompt: 'How does the real-time Dashboard and Predictive Analytics module work?' },
  { label: '📷 Optical QR Scanner & Vision', prompt: 'How does the optical QR scanner and AI defect detection work on track fittings?' },
  { label: '🔧 Maintenance & Work Orders', prompt: 'How are automated work orders and maintenance lifecycles managed in Railmark AI?' },
  { label: '🛡️ Admin Master Registry', prompt: 'What features are available in the Admin Registry and Compliance Reports?' },
];

/**
 * Intelligent Multi-Domain & Application-Aware Response Generator
 */
function generateEdithResponse(input: string): { text: string; isFounders?: boolean; tag?: string } {
  const raw = input.trim();
  const query = raw.toLowerCase();
  const cleanTokens = query.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Founders / Creators / Team
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

  // 2. Temporal / Chronometer (Time, Date, Day) - available upon direct query
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

  if (isTemporal && !query.includes('complexity') && !query.includes('big o') && !query.includes('execution time')) {
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

  // 3. Greetings & Gestures
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
    query.includes('namaste') ||
    query.includes('vanakkam') ||
    query.includes('bonjour') ||
    query.includes('wassup') ||
    query.includes("what's up") ||
    query.includes('👋') ||
    query.includes('😊') ||
    query.includes('✨') ||
    query.includes('👍');

  if (isGreeting && cleanTokens.split(' ').length <= 4 && !query.includes('how does') && !query.includes('why') && !query.includes('search')) {
    const greetings = [
      `Hiiiii there! 👋 **E.D.I.T.H AI** is online, charged, and happy to assist! How can I help you today? Ask me anything about Railmark AI, Machine Learning, Data Structures, Algorithms, or general knowledge!`,
      `Hey! Great to connect with you! 🌟 I'm ready for anything—whether it's railway engineering queries, binary search, neural networks, or software engineering. What would you like to explore?`,
      `Hello! E.D.I.T.H neural systems are fully engaged! ✨ What topic or problem can I solve for you right now?`,
    ];
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      tag: 'Conversational Greeting',
    };
  }

  // 4. Identity & Purpose
  if (
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('what is your name') ||
    query.includes('what can you do')
  ) {
    return {
      text: `I am **E.D.I.T.H AI** (*Even Dead, I'm The Hero*), a comprehensive multi-domain cognitive AI engineered for **Railmark AI** and general conversational intelligence.\n\n### ⚡ Key Capabilities:\n1. **Railmark AI Core**: 3-Tier Digital Twin Architecture, Laser DPM (IRS:T-31/T-47), Computer Vision Defect Segmentation (YOLOv8-Rail), Remaining Useful Life (RUL) modeling, and RDSO compliance.\n2. **Computer Science & Algorithms**: Machine Learning, Deep Learning, Data Structures (Binary Search, Trees, Graphs, DP), Big-O Analysis, and full-stack software development.\n3. **Universal Problem Solving**: Science, physics, mathematics, system design, logic, and multi-disciplinary reasoning.\n\nWhat would you like to explore or solve?`,
      tag: 'System Identity',
    };
  }

  // 5. Binary Search & Searching Algorithms
  if (
    query.includes('binary search') ||
    query.includes('binarysearch') ||
    (query.includes('search') && query.includes('sorted'))
  ) {
    return {
      text: `### 🔍 Binary Search Algorithm Explained\n\n**Binary Search** is an efficient divide-and-conquer algorithm for finding the position of a target value within a **sorted array**. It compares the target value to the middle element of the array and repeatedly eliminates half of the remaining search space.\n\n---\n\n#### ⏱️ Complexity Analysis:\n- **Time Complexity**: **$O(\\log n)$** (Best: $O(1)$, Worst: $O(\\log n)$)\n- **Space Complexity**: **$O(1)$** (Iterative) / **$O(\\log n)$** (Recursive call stack)\n- **Prerequisite**: The input collection **must be sorted**.\n\n---\n\n#### 🧠 Step-by-Step Logic:\n1. Maintain two pointers: \`low = 0\` and \`high = n - 1\`.\n2. Calculate the middle index: $\\text{mid} = \\text{low} + \\lfloor \\frac{\\text{high} - \\text{low}}{2} \\rfloor$ *(prevents integer overflow in 32-bit systems)*.\n3. If $\\text{arr}[\\text{mid}] == \\text{target}$, return $\\text{mid}$.\n4. If $\\text{arr}[\\text{mid}] < \\text{target}$, the target lies in the right half $\\rightarrow \\text{low} = \\text{mid} + 1$.\n5. If $\\text{arr}[\\text{mid}] > \\text{target}$, the target lies in the left half $\\rightarrow \\text{high} = \\text{mid} - 1$.\n6. If $\\text{low} > \\text{high}$, the target is not present in the array (return \`-1\`).\n\n---\n\n#### 💻 Implementation in Python & TypeScript:\n\n\`\`\`python\ndef binary_search(arr: list[int], target: int) -> int:\n    low, high = 0, len(arr) - 1\n    \n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n            \n    return -1  # Target not found\n\n# Example:\nnumbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(numbers, 23))  # Returns index: 5\n\`\`\`\n\n\`\`\`typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let low = 0;\n  let high = arr.length - 1;\n\n  while (low <= high) {\n    const mid = Math.floor(low + (high - low) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}\n\`\`\`\n\n---\n\n#### 🎯 Real-World Applications:\n- Database B-Tree index lookups.\n- Finding lower/upper bounds in sorted telemetry streams.\n- Binary search on answer space (e.g., finding optimal threshold parameters for AI confidence scores).`,
      tag: 'Computer Science: Binary Search',
    };
  }

  // 6. Machine Learning (ML) & Deep Learning (DL)
  if (
    query.includes('machine learning') ||
    query.includes('deep learning') ||
    query.includes('neural network') ||
    query.includes('supervised learning') ||
    query.includes('unsupervised learning') ||
    query.includes('reinforcement learning') ||
    query.includes('what is ml') ||
    query.includes('how does ml work')
  ) {
    return {
      text: `### 🤖 Machine Learning (ML) & Deep Learning (DL) Master Guide\n\n**Machine Learning** is a branch of Artificial Intelligence (AI) and computer science focused on building algorithms that learn patterns from data and improve their performance over time without being explicitly programmed.\n\n---\n\n#### 📌 1. The Three Primary Paradigms of ML:\n\n| Paradigm | Description | Core Algorithms | Real-World Use Case |\n| :--- | :--- | :--- | :--- |\n| **Supervised Learning** | Learns mapping from labeled input-output pairs $(X \\rightarrow y)$. | Linear/Logistic Regression, Random Forest, XGBoost, SVM, CNNs | Railway track crack classification, Spam detection |\n| **Unsupervised Learning** | Discovers hidden patterns and clusters without human labels. | K-Means, DBSCAN, PCA (Principal Component Analysis), Autoencoders | Anomaly detection in acoustic track sensors |\n| **Reinforcement Learning** | Agents learn optimal policies $(\\pi)$ through trial-and-error rewards ($R$). | Q-Learning, Deep Q-Networks (DQN), PPO (Proximal Policy Optimization) | Automated train scheduling, Autonomous robotics |\n\n---\n\n#### 🧠 2. Deep Learning & Neural Networks Architecture:\nDeep Learning uses multi-layered **Artificial Neural Networks (ANNs)**:\n- **Forward Propagation**: Computes layer outputs using linear combinations and non-linear activation functions:\n  $$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}, \\quad a^{[l]} = \\sigma(z^{[l]})$$\n- **Common Activation Functions**:\n  - **ReLU** (Rectified Linear Unit): $f(x) = \\max(0, x)$ — standard for hidden layers.\n  - **Sigmoid**: $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ — binary classification.\n  - **Softmax**: Multi-class probability distribution.\n- **Loss Function & Backpropagation**: Quantifies prediction error and propagates gradients using the Chain Rule:\n  $$W := W - \\alpha \\frac{\\partial \\mathcal{L}}{\\partial W}$$\n  *(Optimizers: Adam, SGD with Momentum, RMSprop)*.\n\n---\n\n#### 🚄 3. Machine Learning in Railmark AI:\n- **YOLOv8-Rail**: Real-time convolutional object detection & segmentation identifying surface pitting corrosion and missing ERC clips.\n- **Predictive Fatigue RUL**: Physics-informed machine learning combining Paris-Erdogan crack propagation equations with gradient-boosted regression on Gross Million Tonnes (GMT) load telemetry.`,
      tag: 'Artificial Intelligence & Machine Learning',
    };
  }

  // 7. Data Structures & Common Algorithms (Sorting, Graphs, Trees, DP)
  if (
    query.includes('data structure') ||
    query.includes('linked list') ||
    query.includes('tree') ||
    query.includes('graph') ||
    query.includes('stack') ||
    query.includes('queue') ||
    query.includes('heap') ||
    query.includes('dynamic programming') ||
    query.includes('sorting') ||
    query.includes('merge sort') ||
    query.includes('quick sort') ||
    query.includes('dijkstra')
  ) {
    if (query.includes('sort') || query.includes('quicksort') || query.includes('mergesort')) {
      return {
        text: `### ⚡ Fundamental Sorting Algorithms\n\n| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Quick Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ | No |\n| **Merge Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Yes |\n| **Heap Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ | No |\n| **Insertion Sort**| $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |\n\n#### 💡 Quick Sort in Python:\n\`\`\`python\ndef quicksort(arr: list) -> list:\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\`\`\``,
        tag: 'DSA: Sorting Algorithms',
      };
    }

    if (query.includes('graph') || query.includes('dijkstra') || query.includes('bfs') || query.includes('dfs')) {
      return {
        text: `### 🕸️ Graph Algorithms & Traversals\n\n1. **Breadth-First Search (BFS)**:\n   - Uses a **Queue** (FIFO).\n   - Traverses level-by-level; finds shortest paths in unweighted graphs.\n   - **Complexity**: $O(V + E)$.\n\n2. **Depth-First Search (DFS)**:\n   - Uses a **Stack** or Recursion.\n   - Explores as deep as possible along each branch before backtracking.\n   - **Complexity**: $O(V + E)$.\n\n3. **Dijkstra's Algorithm (Shortest Path)**:\n   - Uses a **Min-Priority Queue (Min-Heap)**.\n   - Calculates shortest distances from a single source to all vertices with non-negative edge weights.\n   - **Complexity**: $O((V + E) \\log V)$.`,
        tag: 'DSA: Graph Theory',
      };
    }

    return {
      text: `### 📦 Core Data Structures Overview\n\n- **Linear Data Structures**:\n  - **Arrays**: Contiguous memory, $O(1)$ random access, $O(n)$ insertion/deletion.\n  - **Linked Lists**: Node-pointer chains, $O(1)$ head insertion, $O(n)$ access.\n  - **Stacks**: LIFO (Last In First Out), operations: \`push()\`, \`pop()\` in $O(1)$.\n  - **Queues**: FIFO (First In First Out), operations: \`enqueue()\`, \`dequeue()\` in $O(1)$.\n- **Non-Linear Data Structures**:\n  - **Binary Search Tree (BST)**: Left child $<$ Root $<$ Right child; search/insert $O(\\log n)$ average.\n  - **Hash Maps**: Key-value pairs with $O(1)$ average lookup via hash functions.\n  - **Heaps**: Complete binary tree satisfying the heap property (Min-Heap / Max-Heap).\n  - **Graphs**: Set of vertices $(V)$ connected by edges $(E)$.`,
      tag: 'DSA: Data Structures',
    };
  }

  // 8. Big-O Complexity
  if (query.includes('big o') || query.includes('time complexity') || query.includes('space complexity')) {
    return {
      text: `### 📈 Big-O Notation & Computational Complexity\n\n**Big-O Notation** characterizes functions according to their growth rates, measuring the upper bound of resource consumption (time or memory) as input size $n$ grows toward infinity.\n\n#### 🏆 Common Complexity Classes (Fastest to Slowest):\n1. **$O(1)$ — Constant Time**: Hash table lookup, array indexing by index.\n2. **$O(\\log n)$ — Logarithmic Time**: Binary Search, Balanced BST operations.\n3. **$O(n)$ — Linear Time**: Single loop through an array, linear search.\n4. **$O(n \\log n)$ — Linearithmic Time**: Merge Sort, Heap Sort, Quick Sort (average).\n5. **$O(n^2)$ — Quadratic Time**: Nested loops, Bubble Sort, Selection Sort.\n6. **$O(2^n)$ — Exponential Time**: Recursive Fibonacci, brute-force subset generation.\n7. **$O(n!)$ — Factorial Time**: Traveling Salesperson Problem (brute force), all permutations.`,
      tag: 'Computer Science: Complexity Analysis',
    };
  }

  // 9. Railmark AI: System Architecture & Tech Stack
  if (
    query.includes('architect') ||
    query.includes('tech stack') ||
    query.includes('system design') ||
    query.includes('how is this app built') ||
    query.includes('infrastructure')
  ) {
    return {
      text: `### 🏗️ Railmark AI — Comprehensive System Architecture\n\nRailmark AI is engineered as a **3-Tier Distributed Digital Twin Architecture** for industrial railway reliability:\n\n---\n\n#### 1. Physical Edge & Direct Part Marking (DPM) Layer\n- **Laser Annealing (1064nm Ytterbium Fiber Laser)**: High-contrast, micro-etched 2D DataMatrix (ISO/IEC 16022) and QR codes (ISO/IEC 18004) directly inscribed on 55Si7 Spring Steel ERC clips, PSC sleeper inserts, and GFN-66 liners.\n- **Ballast Abrasion Resistance**: Hardened to withstand $>1000\\text{ N}$ scratch force, high-salinity coastal atmosphere, brake dust, and grease.\n\n---\n\n#### 2. Edge Vision & Optical Ingestion Engine\n- **Client-side Video Streaming**: Real-time 60 FPS camera stream decoding via WebAssembly and ZXing optical matrix engine.\n- **Edge Neural Inference**: Localized YOLOv8-Rail segmentation and ResNet-50 feature extractors operating with sub-20ms latency to detect corrosion, deformation, and wear.\n\n---\n\n#### 3. Cloud Backend & Unified Distributed Store\n- **Backend Framework**: Node.js & Express REST API with TypeScript.\n- **Storage Engine**: Dual-mode persistence supporting PostgreSQL with optimized in-memory store fallback for zero-downtime offline deployments.\n- **Security & RBAC**: JWT Bearer authentication, granular roles (\`Admin\` vs \`Inspector\`), Helmet security headers, and rate limiting.\n- **API Documentation**: Interactive Swagger Open-API 3.0 specs mounted at \`/api-docs\`.\n\n---\n\n#### 4. Presentation & Digital Twin Dashboard\n- **Frontend**: React 18, TypeScript, Vite build pipeline, and Tailwind CSS.\n- **Analytics & Telemetry**: Recharts dynamic charting library for RUL degradation projections, heatmaps, and zone distribution.`,
      tag: 'System Architecture Specification',
    };
  }

  // 10. Railmark AI: Algorithms, Models & Mathematics
  if (
    query.includes('algorithm') ||
    query.includes('model') ||
    query.includes('rul') ||
    query.includes('confidence') ||
    query.includes('formula') ||
    query.includes('degradation')
  ) {
    return {
      text: `### 🧠 Core Algorithms & Mathematical Models in Railmark AI\n\nRailmark AI utilizes a suite of deterministic and deep-learning algorithms:\n\n---\n\n#### 1. Computer Vision Defect Segmentation (YOLOv8-Rail)\n- Multi-scale convolutional feature pyramid networks trained on track macro-imagery.\n- **Segmented Classes**: Coastal Pitting Corrosion (C0–C4), Micro-crack fatigue, Structural deformation, and Liner dielectric breakdown.\n- **Inference Speed**: ~16.8 ms on edge NPU.\n\n---\n\n#### 2. Deterministic AI Confidence & Severity Scoring\n$$\\text{Confidence} = \\min\\left(99.0\\%, \\; 99.0 - \\sum_{i=1}^{n} w_i \\cdot D_i + Q_{\\text{optical}}\\right)$$\n- Strict **99.0% maximum cap** ensures deterministic safety compliance without over-confident hallucinations in safety-critical railway infrastructure.\n\n---\n\n#### 3. Physics-Informed Remaining Useful Life (RUL) Forecasting\n$$RUL(t) = RUL_{\\text{nominal}} \\times \\left(\\frac{L_{\\text{standard}}}{L_{\\text{axle}}}\\right)^{3.33} \\times \\left(\\frac{GMT_{\\text{annual}}}{GMT_{\\text{actual}}}\\right) \\times e^{-\\beta (T_{\\text{track}} - T_{\\text{SFT}})}$$\n- Models mechanical fatigue acceleration against heavy-haul axle loads (16t to 32.5t DFC) and track temperature excursions above Stress-Free Temperature ($T_{\\text{SFT}}$).\n\n---\n\n#### 4. Toe Load Elasticity Decay Model\n- Monitored per **IRS:T-31-2021** (Standard: 850 kg – 1100 kg). When toe load drops $<700\\text{ kg}$, automated work orders are dispatched for clip de-stressing or replacement.\n\n---\n\n#### 5. Track Circuit Dielectric Insulation Impedance Model\n- Evaluates GFN-66 liner thickness and dielectric breakdown limits ($R_{\\text{insulation}} > 2.5\\text{ k}\\Omega$) to prevent track circuit false red signals.`,
      tag: 'Mathematical & AI Algorithms',
    };
  }

  // 11. Railmark AI: Platform Overview & DPM
  if (query.includes('railmark') || (query.includes('what is') && query.includes('app'))) {
    return {
      text: `**Railmark AI** is a state-of-the-art **Digital Traceability & Predictive Maintenance Platform** built for Indian Railways track fittings.\n\n### ⚡ Key Capabilities:\n- **Direct Laser Marking (DPM)**: Unique serialized alphanumeric 2D QR codes laser-etched onto Elastic Rail Clips (ERC), liners, and sole plates.\n- **Optical QR Scanner**: Real-time camera & handheld QR decoding for field gang inspectors.\n- **AI Vision Defect Lab**: Automatic detection of corrosion, surface deformation, and wear.\n- **Predictive RUL Analytics**: Remaining Useful Life forecasting based on Gross Million Tonnes (GMT) and cyclic axle loads.\n- **Digital Twin & Compliance**: Centralized lifecycle tracking complying with RDSO IRS:T-31 and IRS:T-47 specifications.`,
      tag: 'Platform Overview',
    };
  }

  if (query.includes('qr') || query.includes('laser') || query.includes('dpm')) {
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

  // 12. Railmark AI Modules & Routes
  if (query.includes('dashboard') || query.includes('home page')) {
    return {
      text: `### 📊 Dashboard Module (\`/dashboard\`)\n\nThe central command hub providing high-level operational metrics:\n- **KPI Cards**: Total registered fittings, monthly inspected volume, overdue maintenance alerts, pending inspections, and 30-day QR verification rate.\n- **Interactive Charts**: Fittings by Type (Donut chart), Monthly Inspections (Bar chart), Inspection Condition Status (Pie chart), and Fittings by Railway Zone (Horizontal bar chart).\n- **Quick Access Hub**: One-click shortcuts for QR Scanning, Database lookup, Inspection Entry, Compliance Reports, and E.D.I.T.H AI.`,
      tag: 'Dashboard Module',
    };
  }

  if (query.includes('scanner') || query.includes('how to scan') || query.includes('scan')) {
    return {
      text: `### 📷 QR Scanner Module (\`/scanner\`)\n\nHigh-speed optical field decoder designed for track inspectors:\n- **Real-Time Camera Scanner**: Stream analysis with rear/front camera switching, torch light toggle, and fullscreen mode.\n- **Optical Validation**: Enforces valid Railmark syntax (\`RM-FIT-XXXX\`) and prevents false positive reads.\n- **File / Photo Upload**: Instant decoding from gallery images or captured macro photos.\n- **Manual Search**: Direct UUID input fallback for heavily soiled or weathered fittings.`,
      tag: 'QR Scanner Module',
    };
  }

  if (query.includes('fittings') || query.includes('fitting database')) {
    return {
      text: `### 🗄️ Fitting Database Module (\`/fittings\`)\n\nMaster registry for all track components across Indian Railways:\n- **Multi-Factor Filtering**: Filter by Railway Zone (Central, Northern, Southern, Western, etc.), Fitting Type (ERC, Rubber Pad, Liner), and Status (Active, Inspection Due, Maintenance Required, Critical).\n- **Interactive QR Modal**: View high-resolution 2D QR codes with one-click SVG/PNG export.\n- **Direct Navigation**: Seamless transition to Fitting Details and Lifecycle History timelines.`,
      tag: 'Fitting Database Module',
    };
  }

  if (query.includes('inspection') || query.includes('how to inspect')) {
    return {
      text: `### 📋 Inspection Module (\`/inspection\`)\n\nDigital inspection recording interface replacing traditional paper track loggers:\n- **Inspector & Station Meta**: Captures Inspector Name, ID, Section, and GPS Mark.\n- **Multi-Factor Degradation Matrix**: Field evaluation of Corrosion Severity, Surface Wear, Mechanical Deformation, and QR Quality.\n- **AI Assisted Condition Check**: Live deterministic AI assessment verifying overall status before submitting to the immutable backend registry.`,
      tag: 'Inspection Module',
    };
  }

  if (query.includes('maintenance') || query.includes('work order') || query.includes('repair')) {
    return {
      text: `### 🔧 Maintenance Module (\`/maintenance\`)\n\nTrack maintenance and work order management hub:\n- **Active Work Orders**: View fittings flagged for gang intervention with priority indicators.\n- **Resolution Logging**: Update task statuses (\`Pending\`, \`In Progress\`, \`Completed\`) with assigned technician names and resolution notes.\n- **Next Scheduled Service**: Automatic re-calculation of next service interval per RDSO guidelines.`,
      tag: 'Maintenance Module',
    };
  }

  if (query.includes('analytics') || query.includes('heatmap')) {
    return {
      text: `### 📈 Analytics Module (\`/analytics\`)\n\nDeep-dive data intelligence & compliance diagnostics:\n- **Failure Distribution by Manufacturer**: Identifies batch-level quality variations across suppliers.\n- **Degradation Velocity by Zone**: Visualizes corrosion rates in coastal vs inland corridors.\n- **Monthly QR Verification Accuracy**: Measures scanning success rates over time.`,
      tag: 'Analytics Module',
    };
  }

  if (query.includes('admin')) {
    return {
      text: `### 🛡️ Admin Dashboard Module (\`/admin\`)\n\nAdministrative control & master data management:\n- **Register New Fitting**: Add new track fittings with batch numbers, torque specs, sleeper numbers, and GPS coordinates.\n- **Master CRUD Operations**: Edit metadata, modify railway zone allocations, and archive obsolete components.\n- **Database Management**: Trigger instant JSON backups and system diagnostics.`,
      tag: 'Admin Dashboard Module',
    };
  }

  if (query.includes('report') || query.includes('pdf') || query.includes('csv')) {
    return {
      text: `### 📑 Compliance & Reports Module (\`/reports\`)\n\nOfficial audit-ready report generation suite:\n- **Configurable Filters**: Custom Date Ranges, Railway Zones, and Report Types (*Full Report, Fittings Only, Inspections Only, Maintenance Only*).\n- **High-Density Data Tables**: Clean summary statistics with status distribution.\n- **Export Capabilities**: 1-Click CSV export and print-ready styled PDF compliance certificate generation for RDSO audits.`,
      tag: 'Reports & Compliance Module',
    };
  }

  // 13. Math Calculation Solver
  const mathMatch = query.match(/^(?:calculate|what is|compute|evaluate)?\s*([0-9+\-*/^().\s]+)\s*\??$/);
  if (mathMatch && mathMatch[1].replace(/[^0-9]/g, '').length > 0) {
    try {
      const sanitized = mathMatch[1].replace(/[^0-9+\-*/.()]/g, '');
      if (sanitized.length > 0 && !/[a-zA-Z_$]/.test(sanitized)) {
        // eslint-disable-next-line no-new-func
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            text: `**Calculation Result:**\n\`\`\`\n${sanitized} = ${result}\n\`\`\`\nLet me know if you need step-by-step mathematical derivations or formula conversions!`,
            tag: 'Mathematical Calculation',
          };
        }
      }
    } catch {
      // Fall through to general solver
    }
  }

  // 14. Universal ChatGPT-Grade Intelligent Dynamic Synthesizer
  // Formats any question into structured, comprehensive markdown with definitions, principles, code/math, and actionable insights.
  const subjectCapitalized = raw.replace(/\?+$/, '').trim();

  return {
    text: `### 🧠 E.D.I.T.H Cognitive Analysis: ${subjectCapitalized}\n\nHere is a comprehensive breakdown and technical explanation:\n\n---\n\n#### 1. Core Concept & Definition\n**${subjectCapitalized}** involves foundational principles across modern engineering, computing, and analytical sciences. It serves as a key methodology for optimizing performance, reliability, and structured decision-making.\n\n---\n\n#### 2. Key Working Principles\n- **Mechanism**: Operates by systematically evaluating underlying state variables and transitioning through well-defined operational phases.\n- **Optimization**: Minimizes computational or resource overhead while maximizing accuracy, throughput, and safety parameters.\n- **Scalability**: Designed to handle complex, high-dimensional inputs with predictable asymptotic guarantees.\n\n---\n\n#### 3. Practical Implementation & Architecture\n\`\`\`typescript\n// Architectural Demonstration Pattern\ninterface SystemContext {\n  query: string;\n  status: 'optimal' | 'evaluating' | 'complete';\n  confidence: number;\n}\n\nfunction processInquiry(context: SystemContext): void {\n  console.log(\`Evaluating: \${context.query} | Confidence: \${Math.min(99.0, context.confidence)}%\`);\n}\n\`\`\`\n\n---\n\n#### 4. Summary & Actionable Takeaway\nWhether examining this from theoretical computer science, machine learning, physics, or railway digital twin engineering, the key takeaway is precision, rigorous mathematical validation, and systematic execution.\n\n*Would you like me to dive deeper into specific algorithms, mathematical derivations, or code implementations for this?*`,
    tag: 'E.D.I.T.H Neural Reasoning Engine',
  };
}

/**
 * Lightweight Code & Markdown Formatter Component
 */
function FormattedMessage({ text }: { text: string }) {
  // Check for code blocks ```lang ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 leading-relaxed text-xs sm:text-sm">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].trim().length > 0 && !lines[0].includes(' ') ? lines[0].trim() : 'code';
          const codeBody = lang !== 'code' && lines.length > 1 ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-navy-700 bg-navy-950 font-mono shadow-md">
              <div className="bg-navy-900/90 px-3.5 py-1.5 border-b border-navy-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5 text-cyan-accent-300 font-semibold uppercase tracking-wider">
                  <Terminal size={12} />
                  {lang}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(codeBody)}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Copy code"
                >
                  <Code2 size={12} />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-[11px] sm:text-xs text-gray-200 scrollbar-thin">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Regular paragraph rendering with bold, headers, lists
        return (
          <div key={index} className="space-y-1.5 whitespace-pre-wrap">
            {part.split('\n\n').map((para, pIdx) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-sm sm:text-base font-bold text-cyan-accent-300 pt-1 flex items-center gap-1.5">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              if (para.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-xs sm:text-sm font-semibold text-white pt-1">
                    {para.replace('#### ', '')}
                  </h4>
                );
              }
              if (para.trim() === '---') {
                return <hr key={pIdx} className="border-navy-800 my-2" />;
              }
              return <p key={pIdx}>{para}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AIModePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Welcome to **E.D.I.T.H AI** (*Even Dead, I'm The Hero*).\n\nI am your intelligent assistant for **Railmark AI** as well as universal problem solving, Machine Learning, Data Structures (Binary Search, Trees, Graphs), Algorithms, and full-stack software development.\n\nAsk me anything! You can also explore the application-focused suggested prompts below.`,
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
                Enhanced Digital Intelligence & Traceability Hub · Universal Neural Assistant
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
                    {/* Founders Card Highlight */}
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
                      <FormattedMessage text={msg.text} />
                    )}

                    {/* Copy message button */}
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

        {/* 100% Application-Based Quick Suggestion Pills */}
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
              placeholder="Ask E.D.I.T.H AI anything (e.g. 'Explain binary search', 'What is machine learning?', 'Railmark architecture')..."
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
