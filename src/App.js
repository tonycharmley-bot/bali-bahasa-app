import React, { useEffect, useMemo, useRef, useState } from "react";
import baliBahasaDataset from "./dataset";

const APP_VERSION = "2.5.0";
const APP_VERSION_LABEL = "Version 2.5 — Polished Guided Learning";
const STORAGE_KEY = "bali-bahasa-profiles-v25";
const CORRECT_DELAY_MS = 1600;

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[?.!,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function expandVariants(answer) {
  const base = normalize(answer);
  const variants = new Set([base]);
  const swaps = [
    ["tidak", "nggak"], ["tidak", "gak"], ["nggak", "tidak"], ["gak", "tidak"],
    ["saya", "aku"], ["aku", "saya"], ["mau", "ingin"], ["ingin", "mau"],
    ["bisa", "boleh"], ["boleh", "bisa"]
  ];
  swaps.forEach(([from, to]) => variants.add(base.replace(new RegExp(`\\b${from}\\b`, "g"), to)));
  variants.add(base.replace(/^saya /, ""));
  variants.add(base.replace(/^aku /, ""));
  return Array.from(variants).filter(Boolean);
}

function isCorrect(input, answers) {
  const value = normalize(input);
  return answers.flatMap(expandVariants).some((answer) => answer === value);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getXpRank(score) {
  if (score >= 1200) return { level: 6, title: "Confident Speaker", next: 1600 };
  if (score >= 850) return { level: 5, title: "Local Flow", next: 1200 };
  if (score >= 550) return { level: 4, title: "Villa & Driver Confidence", next: 850 };
  if (score >= 300) return { level: 3, title: "Real Conversations", next: 550 };
  if (score >= 120) return { level: 2, title: "Daily Bali Basics", next: 300 };
  return { level: 1, title: "First Steps", next: 120 };
}

function diffHint(wrote, correct) {
  const a = normalize(wrote).split(" ").filter(Boolean);
  const b = normalize(correct).split(" ").filter(Boolean);
  if (!a.length) return "You did not enter an answer.";
  const missing = b.filter((w) => !a.includes(w));
  const extra = a.filter((w) => !b.includes(w));
  if (missing.length) return `Missing: ${missing.slice(0, 4).join(", ")}.`;
  if (extra.length) return `Check: ${extra.slice(0, 4).join(", ")}.`;
  return "Very close. Check word order or spelling.";
}

function safeHint(drill) {
  if (!drill) return "Use the context first.";
  if (drill.type === "word-choice") return "Recognise the word before trying to recall it.";
  if (drill.type === "word-id-en") return "Think of the everyday meaning.";
  if (drill.type === "word-en-id") return "Recall the Bahasa word from memory.";
  if (drill.type === "typing") return "Think of the pattern, then fill the key words.";
  if (drill.type === "builder") return "Start with the subject or request word.";
  if (drill.type === "listening") return "Listen for the key word.";
  if (drill.type === "conversation") return "Choose the reply that fits the situation.";
  return "Use context, not guessing.";
}

function flattenPhrases(dataset) {
  return (dataset?.topics || []).flatMap((topic) =>
    (topic.phrases || []).map((p) => ({ ...p, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 }))
  );
}

function flattenWords(dataset) {
  return (dataset?.topics || []).flatMap((topic) =>
    (topic.coreWords || []).map((w) => ({ ...w, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 }))
  );
}

function flattenConversations(dataset) {
  return (dataset?.topics || []).flatMap((topic) =>
    (topic.conversationChains || []).map((c) => ({ ...c, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 }))
  );
}

const allTopics = baliBahasaDataset?.topics || [];
const allWords = flattenWords(baliBahasaDataset);
const allPhrases = flattenPhrases(baliBahasaDataset);
const allChains = flattenConversations(baliBahasaDataset);

function wordDistractors(word, field) {
  return shuffle(allWords.filter((w) => w.id !== word.id)).slice(0, 3).map((w) => w[field]);
}

function phraseDistractors(phrase, field = "idn") {
  const same = allPhrases.filter((p) => p.id !== phrase.id && p.topicId === phrase.topicId);
  const other = allPhrases.filter((p) => p.id !== phrase.id && p.topicId !== phrase.topicId);
  return shuffle([...same, ...other]).slice(0, 3).map((p) => p[field]);
}

function makeWordDrills(words) {
  return words.flatMap((w, i) => [
    {
      id: `word-choice-${w.id || i}`,
      sourceId: w.id,
      type: "word-choice",
      category: w.category,
      topicId: w.topicId,
      scenario: "Word recognition",
      instruction: "Choose the meaning",
      prompt: w.idn,
      answers: [w.eng],
      options: shuffle([w.eng, ...wordDistractors(w, "eng")]),
      explanation: `${w.idn} = ${w.eng}`,
      level: w.level || 1,
      breakdown: [[w.idn, w.eng]],
      baseWord: w
    },
    {
      id: `word-id-en-${w.id || i}`,
      sourceId: w.id,
      type: "word-id-en",
      category: w.category,
      topicId: w.topicId,
      scenario: "Word meaning",
      instruction: "Type the English meaning",
      prompt: w.idn,
      answers: [w.eng],
      options: shuffle([w.eng, ...wordDistractors(w, "eng")]),
      explanation: `${w.idn} = ${w.eng}`,
      level: w.level || 1,
      breakdown: [[w.idn, w.eng]],
      baseWord: w
    },
    {
      id: `word-en-id-${w.id || i}`,
      sourceId: w.id,
      type: "word-en-id",
      category: w.category,
      topicId: w.topicId,
      scenario: "Word recall",
      instruction: "Type the Bahasa Indonesia word",
      prompt: w.eng,
      answers: [w.idn],
      options: shuffle([w.idn, ...wordDistractors(w, "idn")]),
      explanation: `${w.idn} = ${w.eng}`,
      level: w.level || 1,
      breakdown: [[w.idn, w.eng]],
      baseWord: w
    }
  ]);
}

function makePhraseDrills(phrases) {
  const typing = phrases.map((p, i) => ({
    id: `phrase-${p.id || i}`,
    sourceId: p.id,
    type: "typing",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Say this in Bahasa Indonesia",
    prompt: p.eng,
    answers: [p.idn],
    options: shuffle([p.idn, ...phraseDistractors(p)]),
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  const builder = phrases
    .filter((p) => p.idn.split(" ").length >= 2 && p.idn.split(" ").length <= 8)
    .map((p, i) => ({
      id: `builder-${p.id || i}`,
      sourceId: p.id,
      type: "builder",
      category: p.category,
      topicId: p.topicId,
      scenario: p.category,
      instruction: "Build the sentence",
      prompt: p.eng,
      answers: [p.idn],
      tiles: shuffle(p.idn.split(" ")),
      explanation: `${p.idn} = ${p.eng}`,
      breakdown: p.breakdown || [],
      level: p.level || 1,
      tags: p.tags || []
    }));

  const listening = phrases.map((p, i) => ({
    id: `listen-${p.id || i}`,
    sourceId: p.id,
    type: "listening",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Choose the meaning",
    prompt: p.idn,
    answers: [p.eng],
    options: shuffle([p.eng, ...phraseDistractors(p, "eng")]),
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  const choice = phrases.map((p, i) => ({
    id: `choice-${p.id || i}`,
    sourceId: p.id,
    type: "choice",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Choose the Bahasa phrase",
    prompt: p.eng,
    answers: [p.idn],
    options: shuffle([p.idn, ...phraseDistractors(p)]),
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  return { typing, builder, listening, choice };
}

function makeConversationDrills(chains) {
  const out = [];
  chains.forEach((chain) => {
    (chain.turns || []).forEach((turn, idx) => {
      if (turn.speaker !== "user") return;
      const previous = chain.turns[idx - 1];
      const alternatives = chains.flatMap((c) => (c.turns || []).filter((t) => t.speaker === "user" && t.idn !== turn.idn).map((t) => t.idn));
      out.push({
        id: `conversation-${chain.id}-${idx}`,
        type: "conversation",
        category: chain.category,
        topicId: chain.topicId,
        scenario: chain.title || chain.category,
        instruction: "Choose the best reply",
        theySay: previous?.idn || chain.title,
        prompt: previous?.idn || chain.title,
        answers: [turn.idn],
        options: shuffle([turn.idn, ...shuffle(alternatives).slice(0, 3)]),
        explanation: `${turn.idn} = ${turn.eng}`,
        breakdown: [],
        level: chain.level || 1
      });
    });
  });
  return out;
}

const phraseDrills = makePhraseDrills(allPhrases);
const baseContent = {
  words: makeWordDrills(allWords),
  typing: phraseDrills.typing,
  builder: phraseDrills.builder,
  listening: phraseDrills.listening,
  choice: phraseDrills.choice,
  conversation: makeConversationDrills(allChains)
};

const levelRoadmap = [
  { level: 1, title: "First Steps", capability: "Introduce yourself, recognise core words, and ask simple questions.", topics: ["core_basics", "warung_food"], wordLimit: 14, phraseLimit: 12, requiredCorrect: 14 },
  { level: 2, title: "Daily Bali Basics", capability: "Order simple food, ask where things are, and use polite requests.", topics: ["warung_food", "directions_locations", "time_numbers"], wordLimit: 18, phraseLimit: 18, requiredCorrect: 20 },
  { level: 3, title: "Real Conversations", capability: "Handle short daily exchanges and simple WhatsApp messages.", topics: ["social_smalltalk", "whatsapp_messages", "transport_driver"], wordLimit: 22, phraseLimit: 22, requiredCorrect: 26 },
  { level: 4, title: "Villa & Driver Confidence", capability: "Talk to staff, arrange pickups, and explain common villa issues.", topics: ["villa_staff", "transport_driver", "problems_help"], wordLimit: 25, phraseLimit: 28, requiredCorrect: 32 },
  { level: 5, title: "Local Flow", capability: "Shop, bargain, book services, and understand natural replies.", topics: ["shopping_bargaining", "appointments_services", "social_smalltalk"], wordLimit: 28, phraseLimit: 32, requiredCorrect: 38 },
  { level: 6, title: "Confident Speaker", capability: "Build flexible daily conversation skills across major Bali situations.", topics: allTopics.map((t) => t.id), wordLimit: 36, phraseLimit: 40, requiredCorrect: 48 }
];

const survivalPacks = [
  { id: "pack-first-day", label: "First Day in Bali", topics: ["core_basics", "transport_driver", "directions_locations"], description: "Arrive, move around, and ask simple questions." },
  { id: "pack-food", label: "Order Food", topics: ["warung_food", "time_numbers"], description: "Warung, drinks, spice level, and paying." },
  { id: "pack-driver", label: "Driver Conversations", topics: ["transport_driver", "directions_locations", "whatsapp_messages"], description: "Pickup, location, traffic, and timing." },
  { id: "pack-villa", label: "Villa Management", topics: ["villa_staff", "problems_help", "whatsapp_messages"], description: "Housekeeping, maintenance, and staff messages." },
  { id: "pack-emergency", label: "Problems & Help", topics: ["problems_help", "villa_staff", "transport_driver"], description: "Broken things, urgent help, and practical safety." }
];

function blankUser() {
  return {
    started: false,
    activeTab: "learn",
    learningStage: "intro",
    currentLevel: 1,
    completedLevels: [],
    levelProgress: {},
    lastUnlocked: null,
    currentFlow: "level",
    currentDrillId: "",
    selectedTopicId: "core_basics",
    selectedPackId: "pack-first-day",
    score: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    completedToday: 0,
    hearts: 3,
    feedback: null,
    wrongIds: [],
    recentIds: [],
    drillStats: {},
    reviewSchedule: {},
    shuffledOptions: {},
    builderAnswer: [],
    phrasebook: [],
    muted: false,
    autoPlayAnswer: false,
    lastCorrectAnswer: ""
  };
}

function chooseNext(items, stats, currentId, schedule = {}, onlyDue = false, recentIds = []) {
  const today = todayKey();
  const recentSet = new Set([currentId, ...(recentIds || [])].filter(Boolean));
  let candidates = items.filter((x) => !recentSet.has(x.id));
  if (onlyDue) {
    const due = candidates.filter((x) => !schedule[x.id]?.nextReview || schedule[x.id].nextReview <= today);
    if (due.length) candidates = due;
  }
  if (!candidates.length) candidates = items.filter((x) => x.id !== currentId);
  if (!candidates.length) candidates = items;
  if (!candidates.length) return null;

  const weighted = candidates.map((item) => {
    const s = stats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    const weak = s.wrong * 3 + Math.max(0, s.seen - s.correct);
    const mastered = Math.min(s.streak * 0.8, 4);
    return { item, weight: Math.max(1, 1 + weak - mastered) };
  });
  const total = weighted.reduce((sum, x) => sum + x.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[0].item;
}

function getRandomDrillId(items) {
  return items.length ? items[Math.floor(Math.random() * items.length)].id : "";
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#06111f 0%,#0f172a 55%,#062a27 100%)", color: "#fff", fontFamily: "Inter, Arial, sans-serif", padding: "14px 14px 92px", boxSizing: "border-box" },
  focusPage: { minHeight: "100vh", background: "linear-gradient(135deg,#06111f 0%,#0f172a 55%,#062a27 100%)", color: "#fff", fontFamily: "Inter, Arial, sans-serif", padding: "14px 14px 28px", boxSizing: "border-box" },
  wrap: { maxWidth: 540, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  card: { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)", borderRadius: 24, padding: 16, boxShadow: "0 18px 50px rgba(0,0,0,.24)", backdropFilter: "blur(12px)" },
  hero: { background: "linear-gradient(135deg,rgba(16,185,129,.22),rgba(34,211,238,.12))", border: "1px solid rgba(134,239,172,.25)", borderRadius: 28, padding: 18 },
  title: { fontSize: 31, lineHeight: 1.05, margin: "8px 0", fontWeight: 900 },
  text: { color: "#b8c5d7", lineHeight: 1.5, margin: 0 },
  muted: { color: "#94a3b8" },
  pill: { display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "rgba(16,185,129,.12)", color: "#9af3d4", border: "1px solid rgba(16,185,129,.28)", fontSize: 13, fontWeight: 800 },
  row: { display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
  button: { minHeight: 46, borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.055)", color: "#fff", padding: "0 14px", cursor: "pointer", fontWeight: 800 },
  primary: { minHeight: 52, borderRadius: 18, border: "none", background: "#10b981", color: "white", padding: "0 16px", cursor: "pointer", fontWeight: 900, fontSize: 16 },
  active: { background: "rgba(34,211,238,.18)", border: "1px solid rgba(103,232,249,.28)", color: "#d7fbff" },
  warn: { background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.22)", color: "#fde68a" },
  input: { width: "100%", minHeight: 52, background: "rgba(15,23,42,.82)", border: "1px solid rgba(255,255,255,.14)", color: "white", borderRadius: 18, padding: "0 16px", fontSize: 16, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: 86, background: "rgba(15,23,42,.82)", border: "1px solid rgba(255,255,255,.14)", color: "white", borderRadius: 18, padding: 14, fontSize: 16, outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.45 },
  stat: { background: "rgba(15,23,42,.72)", borderRadius: 18, padding: 12, textAlign: "center", border: "1px solid rgba(255,255,255,.07)" },
  item: { borderRadius: 18, padding: 12, border: "1px solid rgba(255,255,255,.10)", background: "rgba(15,23,42,.68)" },
  choice: { textAlign: "left", minHeight: 54, padding: "12px 14px", borderRadius: 18, border: "1px solid rgba(255,255,255,.10)", background: "rgba(15,23,42,.82)", color: "white", cursor: "pointer", fontWeight: 700, lineHeight: 1.35 },
  badge: { display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: "rgba(34,211,238,.14)", color: "#c8fbff", border: "1px solid rgba(34,211,238,.22)", fontSize: 12, fontWeight: 800 },
  progress: { width: "100%", height: 9, background: "rgba(255,255,255,.08)", borderRadius: 999, overflow: "hidden" },
  good: { borderRadius: 18, padding: 14, border: "1px solid rgba(52,211,153,.24)", background: "rgba(16,185,129,.12)", whiteSpace: "pre-line" },
  bad: { borderRadius: 18, padding: 14, border: "1px solid rgba(251,113,133,.24)", background: "rgba(244,63,94,.12)", whiteSpace: "pre-line" },
  bottomNav: { position: "fixed", left: 0, right: 0, bottom: 0, background: "rgba(2,6,23,.92)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255,255,255,.10)", padding: "8px 8px 12px", zIndex: 20 },
  navInner: { maxWidth: 540, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 },
  navBtn: { border: "none", borderRadius: 16, minHeight: 52, background: "transparent", color: "#94a3b8", fontWeight: 800, fontSize: 11, cursor: "pointer" },
  navActive: { background: "rgba(16,185,129,.16)", color: "#a7f3d0" },
  footer: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.45)", padding: "8px 0 18px" }
};

export default function App() {
  const [profiles, setProfiles] = useState({ Tony: blankUser() });
  const [activeProfile, setActiveProfile] = useState("Tony");
  const [showProfileManager, setShowProfileManager] = useState(true);
  const [newProfileName, setNewProfileName] = useState("");
  const [draftInput, setDraftInput] = useState("");
  const [draftPhrase, setDraftPhrase] = useState({ idn: "", eng: "", note: "" });
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  const user = profiles[activeProfile] || blankUser();
  const levelInfo = levelRoadmap.find((l) => l.level === user.currentLevel) || levelRoadmap[0];
  const xpRank = getXpRank(user.score);

  const phrasebook = useMemo(() => {
    const clean = (user.phrasebook || []).filter((x) => x.idn && x.eng);
    const typing = clean.map((p) => ({
      id: `pb-${p.id}`,
      type: "typing",
      category: "My Phrasebook",
      topicId: "phrasebook",
      scenario: "Personal phrasebook",
      instruction: "Say this in Bahasa Indonesia",
      prompt: p.eng,
      answers: [p.idn],
      options: [p.idn],
      explanation: `${p.idn} = ${p.eng}`,
      breakdown: [[p.idn, p.eng]],
      level: 1
    }));
    return { typing, all: typing };
  }, [user.phrasebook]);

  const content = useMemo(() => ({
    words: baseContent.words,
    typing: [...baseContent.typing, ...phrasebook.typing],
    builder: baseContent.builder,
    listening: baseContent.listening,
    choice: baseContent.choice,
    conversation: baseContent.conversation,
    phrasebook: phrasebook.all
  }), [phrasebook]);

  const updateUser = (patch) => setProfiles((prev) => ({ ...prev, [activeProfile]: { ...blankUser(), ...(prev[activeProfile] || {}), ...patch } }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profiles) setProfiles(data.profiles);
        if (data.activeProfile) setActiveProfile(data.activeProfile);
        if (typeof data.showProfileManager === "boolean") setShowProfileManager(data.showProfileManager);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeProfile, showProfileManager })), [profiles, activeProfile, showProfileManager]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(SR));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => setDraftInput(""), [user.currentDrillId, activeProfile]);

  const levelWords = useMemo(() => allWords.filter((w) => levelInfo.topics.includes(w.topicId)).slice(0, levelInfo.wordLimit), [levelInfo]);
  const levelPhrases = useMemo(() => allPhrases.filter((p) => levelInfo.topics.includes(p.topicId)).slice(0, levelInfo.phraseLimit), [levelInfo]);
  const levelWordDrills = useMemo(() => makeWordDrills(levelWords), [levelWords]);
  const levelPhraseDrills = useMemo(() => makePhraseDrills(levelPhrases), [levelPhrases]);
  const levelConversationDrills = useMemo(() => content.conversation.filter((d) => levelInfo.topics.includes(d.topicId)), [content.conversation, levelInfo]);

  const levelCorrect = user.levelProgress?.[user.currentLevel]?.correct || 0;
  const levelNeeded = levelInfo.requiredCorrect;
  const wordTarget = Math.ceil(levelNeeded * 0.33);
  const phraseTarget = Math.ceil(levelNeeded * 0.7);
  const conversationTarget = Math.ceil(levelNeeded * 0.88);
  const stageLabel = user.learningStage === "word-choice" ? "Word Recognition" : user.learningStage === "word-typing" ? "Word Recall" : user.learningStage === "phrases" ? "Phrases" : user.learningStage === "conversation" ? "Conversation" : user.learningStage === "test" ? "Level Test" : "Preview";

  const microLesson = useMemo(() => {
    if (user.learningStage === "word-choice" || user.learningStage === "word-typing") return { title: "Words First", body: "Recognise the words before you use them in phrases. This makes speaking feel easier." };
    if (user.learningStage === "phrases") return { title: "Pattern Practice", body: "Now use your words inside short, useful Bali phrases." };
    if (user.learningStage === "conversation") return { title: "Real Replies", body: "Now choose replies that fit a real situation." };
    if (user.learningStage === "test") return { title: "Level Test", body: "Pass this mixed review to unlock the next level." };
    return { title: "Words You'll Learn", body: "Each level starts with new words, then phrases, then conversation." };
  }, [user.learningStage]);

  const levelDrills = useMemo(() => {
    if (user.learningStage === "word-choice") return levelWordDrills.filter((d) => d.type === "word-choice");
    if (user.learningStage === "word-typing") return levelWordDrills.filter((d) => d.type !== "word-choice");
    if (user.learningStage === "phrases") return [...levelPhraseDrills.choice, ...levelPhraseDrills.builder, ...levelPhraseDrills.typing];
    if (user.learningStage === "conversation") return levelConversationDrills.length ? levelConversationDrills : [...levelPhraseDrills.listening, ...levelPhraseDrills.typing];
    if (user.learningStage === "test") return [...levelWordDrills.slice(0, 8), ...levelPhraseDrills.typing.slice(0, 8), ...levelPhraseDrills.builder.slice(0, 5), ...levelConversationDrills.slice(0, 4)];
    return levelWordDrills.filter((d) => d.type === "word-choice");
  }, [user.learningStage, levelWordDrills, levelPhraseDrills, levelConversationDrills]);

  const dueItems = useMemo(() => {
    const today = todayKey();
    return content.typing.filter((d) => user.reviewSchedule?.[d.id]?.nextReview <= today);
  }, [content.typing, user.reviewSchedule]);

  const weakItems = useMemo(() => content.typing.filter((d) => user.wrongIds.includes(d.id)), [content.typing, user.wrongIds]);
  const selectedPack = survivalPacks.find((p) => p.id === user.selectedPackId) || survivalPacks[0];

  const pool = useMemo(() => {
    if (user.currentFlow === "level") return levelDrills.length ? levelDrills : levelWordDrills;
    if (user.currentFlow === "review") return dueItems;
    if (user.currentFlow === "weak") return weakItems;
    if (user.currentFlow === "topic") return content.typing.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-words") return content.words.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-builder") return content.builder.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-listening") return content.listening.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-choice") return content.choice.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "pack") return content.typing.filter((d) => selectedPack.topics.includes(d.topicId));
    if (user.currentFlow === "phrasebook") return content.phrasebook;
    if (dueItems.length) return dueItems;
    if (weakItems.length >= 3) return weakItems;
    return levelDrills.length ? levelDrills : content.typing;
  }, [user.currentFlow, user.selectedTopicId, selectedPack, levelDrills, levelWordDrills, dueItems, weakItems, content]);

  const current = useMemo(() => pool.find((d) => d.id === user.currentDrillId) || pool[0] || content.words[0], [pool, user.currentDrillId, content.words]);
  const currentOptions = useMemo(() => {
    const key = `${user.currentFlow}-${current?.id}`;
    return user.shuffledOptions?.[key] || shuffle(current?.options || []);
  }, [current, user.currentFlow, user.shuffledOptions]);

  useEffect(() => {
    if (!current || current.type === "builder") return;
    const key = `${user.currentFlow}-${current.id}`;
    if (!user.shuffledOptions?.[key] && current.options) updateUser({ shuffledOptions: { ...(user.shuffledOptions || {}), [key]: shuffle(current.options) } });
  }, [current?.id, user.currentFlow]);

  const progressFill = (value) => ({ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: "linear-gradient(90deg,#34d399,#10b981)" });
  const footer = <div style={styles.footer}>Created by Tony Charmley · {APP_VERSION_LABEL}</div>;
  const feedback = user.feedback ? <div style={{ marginTop: 14, ...(user.feedback.ok ? styles.good : styles.bad) }}><strong>{user.feedback.text}</strong><div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{user.feedback.explanation}</div></div> : null;

  const playSound = (type) => {
    if (user.muted) return;
    try { const audio = new Audio(`/sounds/${type}.mp3`); audio.volume = 0.45; audio.play().catch(() => {}); } catch (e) {}
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const poolForFlow = (flow) => {
    if (flow === "level") return levelDrills.length ? levelDrills : levelWordDrills;
    if (flow === "topic") return content.typing.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-words") return content.words.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-builder") return content.builder.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-listening") return content.listening.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-choice") return content.choice.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "pack") return content.typing.filter((d) => selectedPack.topics.includes(d.topicId));
    if (flow === "review") return dueItems;
    if (flow === "weak") return weakItems;
    if (flow === "phrasebook") return content.phrasebook;
    return content.typing;
  };

  const startFlow = (flow, explicitPool) => {
    const nextPool = explicitPool || poolForFlow(flow);
    if (!nextPool.length) {
      updateUser({ feedback: { ok: false, text: "Nothing to practise yet", explanation: "Try another topic or mode." } });
      return;
    }
    updateUser({ activeTab: "train", currentFlow: flow, currentDrillId: getRandomDrillId(nextPool), feedback: null, lastCorrectAnswer: "", builderAnswer: [], shuffledOptions: {} });
    setDraftInput("");
  };

  const updateStats = (id, ok, shown = false) => {
    const old = user.drillStats[id] || { seen: 0, correct: 0, wrong: 0, streak: 0, shown: 0 };
    const oldSchedule = user.reviewSchedule[id] || { interval: 0 };
    const interval = ok ? Math.min(Math.max(1, oldSchedule.interval || 1) * 2, 30) : shown ? 1 : 1;
    return {
      drillStats: { ...user.drillStats, [id]: { seen: old.seen + 1, correct: old.correct + (ok ? 1 : 0), wrong: old.wrong + (!ok && !shown ? 1 : 0), shown: old.shown + (shown ? 1 : 0), streak: ok ? old.streak + 1 : 0 } },
      reviewSchedule: { ...user.reviewSchedule, [id]: { interval, nextReview: ok ? addDays(interval) : addDays(1), lastResult: ok ? "correct" : shown ? "shown" : "wrong" } }
    };
  };

  const maybeStageAdvance = (nextCorrect) => {
    if (user.currentFlow !== "level") return null;
    if (user.learningStage === "word-choice" && nextCorrect >= Math.ceil(wordTarget * 0.55)) return "word-typing";
    if (user.learningStage === "word-typing" && nextCorrect >= wordTarget) return "phrases";
    if (user.learningStage === "phrases" && nextCorrect >= phraseTarget) return "conversation";
    if (user.learningStage === "conversation" && nextCorrect >= conversationTarget) return "test";
    return null;
  };

  const nextDrill = () => {
    const recentIds = [current?.id, ...(user.recentIds || [])].filter(Boolean).slice(0, 8);
    const next = chooseNext(pool, user.drillStats, current?.id, user.reviewSchedule, user.currentFlow === "review", recentIds);
    updateUser({ currentDrillId: next ? next.id : getRandomDrillId(pool), shuffledOptions: {}, builderAnswer: [], feedback: null, lastCorrectAnswer: "", recentIds });
    setDraftInput("");
  };

  const completeLevel = () => {
    const completedLevel = user.currentLevel;
    const nextLevel = Math.min(user.currentLevel + 1, levelRoadmap.length);
    updateUser({
      activeTab: "level-complete",
      completedLevels: Array.from(new Set([...(user.completedLevels || []), completedLevel])),
      currentLevel: nextLevel,
      lastUnlocked: { completedLevel, nextLevel },
      learningStage: "intro",
      currentFlow: "level",
      feedback: null,
      lastCorrectAnswer: ""
    });
    playSound("level-up");
  };

  const submitAnswer = (answer, showOnly = false) => {
    if (!current) return;
    const ok = !showOnly && isCorrect(answer, current.answers);
    const statsPatch = updateStats(current.id, ok, showOnly);
    if (ok) {
      playSound("correct");
      const newStreak = user.streak + 1;
      const gained = 10 + Math.min(newStreak * 2, 20);
      const nextCorrect = user.currentFlow === "level" ? levelCorrect + 1 : levelCorrect;
      const nextStage = maybeStageAdvance(nextCorrect);
      const progressPatch = user.currentFlow === "level" ? { levelProgress: { ...user.levelProgress, [user.currentLevel]: { correct: nextCorrect } } } : {};
      updateUser({
        ...statsPatch,
        ...progressPatch,
        score: user.score + gained,
        coins: user.coins + Math.max(1, Math.round(gained / 5)),
        streak: newStreak,
        bestStreak: Math.max(user.bestStreak, newStreak),
        completedToday: user.completedToday + 1,
        wrongIds: user.wrongIds.filter((id) => id !== current.id),
        feedback: { ok: true, text: `Correct · +${gained} XP`, explanation: current.explanation },
        builderAnswer: [],
        lastCorrectAnswer: current.answers[0],
        learningStage: nextStage || user.learningStage
      });
      if (user.autoPlayAnswer) speak(current.answers[0]);
      setDraftInput("");
      if (user.currentFlow === "level" && nextCorrect >= levelNeeded) {
        setTimeout(completeLevel, CORRECT_DELAY_MS);
      } else {
        setTimeout(nextDrill, CORRECT_DELAY_MS);
      }
    } else {
      playSound(showOnly ? "correct" : "wrong");
      const recentIds = [current?.id, ...(user.recentIds || [])].filter(Boolean).slice(0, 8);
      updateUser({
        ...statsPatch,
        hearts: current.topicId === "phrasebook" || showOnly ? user.hearts : Math.max(user.hearts - 1, 0),
        streak: 0,
        wrongIds: showOnly ? user.wrongIds : user.wrongIds.includes(current.id) ? user.wrongIds : [...user.wrongIds, current.id],
        recentIds,
        feedback: { ok: false, text: showOnly ? "Answer shown" : "Not quite", explanation: `You wrote: ${showOnly ? "—" : answer || "—"}\nCorrect: ${current.answers[0]}\n${showOnly ? "This will return later for practice." : diffHint(answer, current.answers[0])}` },
        lastCorrectAnswer: current.answers[0]
      });
    }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return updateUser({ feedback: { ok: false, text: "Voice unavailable", explanation: "Type your answer manually." } });
    const rec = new SR();
    rec.lang = "id-ID";
    rec.onresult = (event) => setDraftInput(event.results?.[0]?.[0]?.transcript || "");
    rec.onerror = () => updateUser({ feedback: { ok: false, text: "Voice unavailable", explanation: "Try Chrome with microphone permission." } });
    recognitionRef.current = rec;
    rec.start();
  };

  const addPhrase = () => {
    const idn = draftPhrase.idn.trim();
    const eng = draftPhrase.eng.trim();
    if (!idn || !eng) return updateUser({ feedback: { ok: false, text: "Missing phrase", explanation: "Add both Bahasa and English." } });
    updateUser({ phrasebook: [{ id: Date.now(), idn, eng, note: draftPhrase.note || "" }, ...user.phrasebook], feedback: { ok: true, text: "Added", explanation: "This phrase is now in your training." } });
    setDraftPhrase({ idn: "", eng: "", note: "" });
  };

  const TrainingCard = () => {
    if (!current) return <div style={styles.card}>No drill available.</div>;
    const isTyping = ["word-id-en", "word-en-id", "typing"].includes(current.type);
    const isBuilder = current.type === "builder";
    const audioText = current.type === "listening" || current.type === "word-id-en" || current.type === "word-choice" ? current.prompt : current.type === "conversation" ? current.theySay : current.answers?.[0];
    const inputPlaceholder = current.type === "word-id-en" ? "Type English meaning" : "Type Bahasa Indonesia";

    return <div style={styles.card}>
      <div style={styles.row}><button style={styles.button} onClick={() => updateUser({ activeTab: "learn" })}>← Exit</button><div style={styles.badge}>{user.currentFlow === "level" ? `Level ${user.currentLevel} · ${stageLabel}` : current.category}</div></div>
      {user.currentFlow === "level" ? <div style={{ ...styles.progress, marginTop: 14 }}><div style={progressFill((levelCorrect / levelNeeded) * 100)} /></div> : null}
      <div style={{ ...styles.muted, marginTop: 14 }}>{current.instruction}</div>
      {current.type === "conversation" ? <div style={{ ...styles.item, marginTop: 12 }}><div style={styles.muted}>They say:</div><h2 style={{ margin: "6px 0 0", fontSize: 23 }}>{current.theySay}</h2></div> : <h2 style={{ fontSize: 29, lineHeight: 1.12 }}>{current.prompt}</h2>}

      {isTyping ? <>
        <input style={styles.input} value={draftInput} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitAnswer(draftInput)} placeholder={inputPlaceholder} />
        <button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer(draftInput)}>Check</button>
      </> : isBuilder ? <>
        <div style={{ ...styles.item, minHeight: 58, marginBottom: 10 }}>{user.builderAnswer.length ? user.builderAnswer.map((w, i) => <button key={`${w}-${i}`} style={{ ...styles.button, margin: 4 }} onClick={() => updateUser({ builderAnswer: user.builderAnswer.filter((_, idx) => idx !== i) })}>{w}</button>) : <div style={styles.muted}>Tap words below to build the sentence.</div>}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(current.tiles || []).map((w, i) => <button key={`${w}-${i}`} style={styles.button} onClick={() => updateUser({ builderAnswer: [...user.builderAnswer, w] })}>{w}</button>)}</div>
        <button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer(user.builderAnswer.join(" "))}>Check Sentence</button>
      </> : <div style={{ display: "grid", gap: 8 }}>{currentOptions.map((option) => <button key={option} style={styles.choice} onClick={() => submitAnswer(option)}>{option}</button>)}<button style={styles.button} onClick={() => speak(audioText)}>🔊 Play Audio</button></div>}

      <div style={{ ...styles.grid2, marginTop: 12 }}><button style={styles.button} onClick={() => submitAnswer("", true)}>Show Answer</button><button style={styles.button} onClick={nextDrill}>Skip</button></div>
      <div style={{ ...styles.muted, marginTop: 12 }}>Hint: {safeHint(current)}</div>
      {user.lastCorrectAnswer ? <button style={{ ...styles.button, width: "100%", marginTop: 10 }} onClick={() => speak(user.lastCorrectAnswer)}>🔊 Play Correct Answer</button> : null}
      {feedback}
      {(user.feedback || user.lastCorrectAnswer) && current.breakdown?.length ? <details style={{ marginTop: 12 }}><summary style={{ color: "#86efac", fontWeight: 800 }}>Breakdown</summary><div style={{ display: "grid", gap: 6, marginTop: 10 }}>{current.breakdown.map(([p, m]) => <div key={`${p}-${m}`}><strong style={{ color: "#86efac" }}>{p}</strong> = {m}</div>)}</div></details> : null}
    </div>;
  };

  const Learn = () => {
    const wordPreview = levelWords.slice(0, 16);
    const phrasePreview = levelPhrases.slice(0, 6);
    return <>
      <div style={styles.hero}>
        <div style={styles.pill}>Learning Level {user.currentLevel}</div>
        <h1 style={styles.title}>{levelInfo.title}</h1>
        <p style={styles.text}>{levelInfo.capability}</p>
        <div style={{ ...styles.progress, marginTop: 14 }}><div style={progressFill((levelCorrect / levelNeeded) * 100)} /></div>
        <div style={{ ...styles.muted, marginTop: 8 }}>{levelCorrect}/{levelNeeded} correct · {stageLabel}</div>
        <button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => user.learningStage === "intro" ? updateUser({ learningStage: "word-choice" }) : startFlow("level", levelDrills.length ? levelDrills : levelWordDrills)}>Continue Learning</button>
      </div>

      <div style={styles.card}>
        <div style={styles.pill}>{microLesson.title}</div>
        <p style={{ ...styles.text, marginTop: 10 }}>{microLesson.body}</p>
        {user.learningStage === "intro" ? <>
          <h3>Words You'll Learn First</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>{wordPreview.map((w) => <div key={w.id} style={styles.item}><strong style={{ color: "#86efac" }}>{w.idn}</strong><div style={styles.muted}>{w.eng}</div></div>)}</div>
          <button style={{ ...styles.primary, width: "100%", marginTop: 14 }} onClick={() => { updateUser({ learningStage: "word-choice" }); startFlow("level", levelWordDrills.filter((d) => d.type === "word-choice")); }}>Start Words</button>
        </> : user.learningStage === "phrases" ? <>
          <h3>Unlocked Phrases</h3>
          <div style={{ display: "grid", gap: 8 }}>{phrasePreview.map((p) => <div key={p.id} style={styles.item}><strong style={{ color: "#86efac" }}>{p.idn}</strong><div style={styles.muted}>{p.eng}</div></div>)}</div>
          <button style={{ ...styles.primary, width: "100%", marginTop: 14 }} onClick={() => startFlow("level", levelDrills)}>Practise Phrases</button>
        </> : <button style={{ ...styles.primary, width: "100%", marginTop: 14 }} onClick={() => startFlow("level", levelDrills.length ? levelDrills : levelWordDrills)}>Continue {stageLabel}</button>}
      </div>

      <div style={styles.grid3}><div style={styles.stat}>🔥<br/><strong>{user.streak}</strong><div style={styles.muted}>Streak</div></div><div style={styles.stat}>🔁<br/><strong>{dueItems.length}</strong><div style={styles.muted}>Due</div></div><div style={styles.stat}>🪙<br/><strong>{user.coins}</strong><div style={styles.muted}>Coins</div></div></div>
      {feedback}
    </>;
  };

  const LevelComplete = () => {
    const completed = levelRoadmap.find((l) => l.level === user.lastUnlocked?.completedLevel) || levelRoadmap[Math.max(0, user.currentLevel - 2)];
    const next = levelRoadmap.find((l) => l.level === user.currentLevel);
    return <div style={styles.card}><div style={{ fontSize: 58, textAlign: "center" }}>🎉</div><h1 style={{ textAlign: "center" }}>Level {completed?.level} Complete</h1><p style={{ ...styles.text, textAlign: "center" }}>{completed?.capability}</p><div style={{ ...styles.item, marginTop: 14 }}><strong>Words learned:</strong><div style={{ ...styles.muted, marginTop: 6 }}>{levelWords.slice(0, 8).map((w) => w.idn).join(" · ")}</div></div>{next ? <><div style={{ ...styles.item, marginTop: 14 }}><strong>Unlocked: Level {next.level} — {next.title}</strong><div style={styles.muted}>{next.capability}</div></div><button style={{ ...styles.primary, width: "100%", marginTop: 14 }} onClick={() => updateUser({ activeTab: "learn", learningStage: "intro", feedback: null })}>Start Next Level</button></> : <button style={{ ...styles.primary, width: "100%", marginTop: 14 }} onClick={() => updateUser({ activeTab: "learn" })}>Continue Practice</button>}</div>;
  };

  const Topics = () => <>
    <div style={styles.card}><h2 style={{ marginTop: 0 }}>Practice Topic</h2><p style={styles.text}>Optional practice when you need a specific situation.</p><div style={{ display: "grid", gap: 8, marginTop: 12 }}>{allTopics.map((topic) => <button key={topic.id} style={{ ...styles.choice, ...(user.selectedTopicId === topic.id ? styles.active : {}) }} onClick={() => updateUser({ selectedTopicId: topic.id })}><strong>{topic.label}</strong><div style={styles.muted}>{topic.description}</div></button>)}</div></div>
    <div style={styles.card}><h3>Training Style</h3><div style={styles.grid2}><button style={styles.primary} onClick={() => startFlow("topic-words")}>Words First</button><button style={styles.button} onClick={() => startFlow("topic")}>Phrases</button><button style={styles.button} onClick={() => startFlow("topic-builder")}>Builder</button><button style={styles.button} onClick={() => startFlow("topic-listening")}>Listening</button><button style={styles.button} onClick={() => startFlow("topic-choice")}>Multiple Choice</button></div></div>
    <div style={styles.card}><h3>Survival Packs</h3><div style={{ display: "grid", gap: 8 }}>{survivalPacks.map((pack) => <button key={pack.id} style={{ ...styles.choice, ...(user.selectedPackId === pack.id ? styles.active : {}) }} onClick={() => updateUser({ selectedPackId: pack.id })}><strong>{pack.label}</strong><div style={styles.muted}>{pack.description}</div></button>)}</div><button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => startFlow("pack")}>Start Selected Pack</button></div>
  </>;

  const Phrasebook = () => <>
    <div style={styles.card}><h2>My Phrasebook</h2><p style={styles.text}>Add real phrases you hear, then train them.</p><div style={{ display: "grid", gap: 10 }}><input style={styles.input} value={draftPhrase.idn} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrase({ ...draftPhrase, idn: e.target.value })} placeholder="Bahasa: Bisa datang sekarang?" /><input style={styles.input} value={draftPhrase.eng} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrase({ ...draftPhrase, eng: e.target.value })} placeholder="English: Can you come now?" /><textarea style={styles.textarea} value={draftPhrase.note} onChange={(e) => setDraftPhrase({ ...draftPhrase, note: e.target.value })} placeholder="Note or context" /><button style={styles.primary} onClick={addPhrase}>Add to Training</button><button style={styles.button} onClick={() => startFlow("phrasebook")}>Train My Phrases</button></div>{feedback}</div>
    <div style={styles.card}><h3>Saved</h3>{user.phrasebook.length ? user.phrasebook.map((p) => <div key={p.id} style={{ ...styles.item, marginTop: 8 }}><strong style={{ color: "#86efac" }}>{p.idn}</strong><div>{p.eng}</div><div style={styles.row}><button style={styles.button} onClick={() => speak(p.idn)}>🔊</button><button style={styles.button} onClick={() => updateUser({ phrasebook: user.phrasebook.filter((x) => x.id !== p.id) })}>Delete</button></div></div>) : <div style={styles.muted}>No saved phrases yet.</div>}</div>
  </>;

  const Profile = () => <>
    <div style={styles.card}><h2>{activeProfile}</h2><div style={styles.grid3}><div style={styles.stat}><strong>{user.currentLevel}</strong><div style={styles.muted}>Learning Level</div></div><div style={styles.stat}><strong>{xpRank.level}</strong><div style={styles.muted}>XP Rank</div></div><div style={styles.stat}><strong>{user.bestStreak}</strong><div style={styles.muted}>Best</div></div></div><div style={{ ...styles.progress, marginTop: 14 }}><div style={progressFill((user.score / xpRank.next) * 100)} /></div><div style={{ display: "grid", gap: 8, marginTop: 14 }}><button style={styles.button} onClick={() => setShowProfileManager(true)}>Switch Profile</button><button style={styles.button} onClick={() => updateUser({ muted: !user.muted })}>{user.muted ? "Unmute Sounds" : "Mute Sounds"}</button><button style={styles.button} onClick={() => updateUser({ autoPlayAnswer: !user.autoPlayAnswer })}>{user.autoPlayAnswer ? "Auto-play Answer: On" : "Auto-play Answer: Off"}</button><button style={{ ...styles.button, ...styles.warn }} onClick={() => { setProfiles((prev) => ({ ...prev, [activeProfile]: blankUser() })); setShowProfileManager(true); }}>Reset Profile</button></div></div>
    <div style={styles.card}><h3>Best Daily Plan</h3><p style={styles.text}>1. Continue level path. 2. Words first. 3. Phrases. 4. Optional topic practice for real situations.</p></div>
  </>;

  const BottomNav = () => <div style={styles.bottomNav}><div style={styles.navInner}>{[["learn", "🏠", "Learn"], ["topics", "📚", "Topics"], ["phrasebook", "⭐", "Phrases"], ["profile", "👤", "Profile"]].map(([tab, icon, label]) => <button key={tab} style={{ ...styles.navBtn, ...(user.activeTab === tab ? styles.navActive : {}) }} onClick={() => updateUser({ activeTab: tab })}><div style={{ fontSize: 20 }}>{icon}</div>{label}</button>)}</div></div>;

  if (showProfileManager) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Bali Bahasa</div><h1 style={styles.title}>Choose learner</h1><p style={styles.text}>Each profile keeps separate levels, progress, and phrasebook items.</p></div><div style={styles.card}>{Object.keys(profiles).map((name) => <button key={name} style={{ ...styles.choice, width: "100%", marginBottom: 8 }} onClick={() => { setActiveProfile(name); setShowProfileManager(false); }}>{name}<div style={styles.muted}>Learning Level {profiles[name]?.currentLevel || 1}</div></button>)}<div style={{ display: "flex", gap: 8 }}><input style={styles.input} value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New profile" /><button style={styles.primary} onClick={() => { const n = newProfileName.trim(); if (!n) return; setProfiles((prev) => ({ ...prev, [n]: blankUser() })); setActiveProfile(n); setNewProfileName(""); setShowProfileManager(false); }}>Add</button></div></div>{footer}</div></div>;

  if (!user.started) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Words → Phrases → Conversation</div><h1 style={styles.title}>Speak useful Bahasa faster</h1><p style={styles.text}>A simple guided path: recognise words, recall words, use phrases, then practise conversation.</p><button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => updateUser({ started: true })}>Start</button></div>{footer}</div></div>;

  const screen = user.activeTab === "train" ? TrainingCard() : user.activeTab === "level-complete" ? <LevelComplete /> : user.activeTab === "topics" ? <Topics /> : user.activeTab === "phrasebook" ? <Phrasebook /> : user.activeTab === "profile" ? <Profile /> : <Learn />;
  const focus = user.activeTab === "train";

  return <div style={focus ? styles.focusPage : styles.page}><div style={styles.wrap}>{screen}{!focus ? footer : null}</div>{!focus ? <BottomNav /> : null}</div>;
}
