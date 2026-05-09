import React, { useEffect, useMemo, useRef, useState } from "react";
import baliBahasaDataset from "./dataset";

const APP_VERSION = "2.3.0";
const APP_VERSION_LABEL = "Version 2.3 — Topic Practice";
const STORAGE_KEY = "bali-bahasa-profiles-v23";
const CORRECT_DELAY_MS = 2200;

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

function isCorrectAnswer(input, answers) {
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

function getLevel(score) {
  if (score >= 1200) return { level: 6, title: "Confident Local Chat", next: 1600 };
  if (score >= 850) return { level: 5, title: "Bali Conversation Flow", next: 1200 };
  if (score >= 550) return { level: 4, title: "Local Chat Mode", next: 850 };
  if (score >= 300) return { level: 3, title: "Conversation Builder", next: 550 };
  if (score >= 120) return { level: 2, title: "Pattern Starter", next: 300 };
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

function safeTip(drill) {
  if (!drill) return "Use the context first, then recall the pattern.";
  if (drill.type === "typing") return "Think of the sentence pattern first, then fill the key words.";
  if (drill.type === "builder") return "Start with the subject or request word, then build naturally.";
  if (drill.type === "listening") return "Listen for the main verb and place/time word.";
  if (drill.type === "choice") return "Eliminate options that do not match the situation.";
  if (drill.type === "conversation") return "Choose the reply that fits the situation.";
  return "Use context, not word-for-word guessing.";
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

function flattenConversationChains(dataset) {
  return (dataset?.topics || []).flatMap((topic) =>
    (topic.conversationChains || []).map((c) => ({ ...c, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 }))
  );
}

function distractors(correct, all, count = 3, field = "idn") {
  const same = all.filter((x) => x.id !== correct.id && x.topicId === correct.topicId);
  const other = all.filter((x) => x.id !== correct.id && x.topicId !== correct.topicId);
  return shuffle([...same, ...other]).slice(0, count).map((x) => x[field]);
}

function buildBaseContent(dataset) {
  const phrases = flattenPhrases(dataset);
  const words = flattenWords(dataset);
  const chains = flattenConversationChains(dataset);

  const typing = phrases.map((p, i) => ({
    id: `p-${p.id || i}`,
    sourceId: p.id,
    type: "typing",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Say this in Bahasa Indonesia",
    prompt: p.eng,
    answers: [p.idn],
    options: shuffle([p.idn, ...distractors(p, phrases)]),
    tip: p.pattern || "Pattern practice",
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  const choice = phrases.map((p, i) => ({
    id: `mc-${p.id || i}`,
    sourceId: p.id,
    type: "choice",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Choose the Bahasa Indonesia phrase",
    prompt: p.eng,
    answers: [p.idn],
    options: shuffle([p.idn, ...distractors(p, phrases)]),
    tip: p.pattern || "Choose the matching phrase",
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  const listening = phrases.map((p, i) => ({
    id: `l-${p.id || i}`,
    sourceId: p.id,
    type: "listening",
    category: p.category,
    topicId: p.topicId,
    scenario: p.category,
    instruction: "Listen and choose the meaning",
    prompt: p.idn,
    answers: [p.eng],
    options: shuffle([p.eng, ...distractors(p, phrases, 3, "eng")]),
    tip: "Listen for keywords",
    explanation: `${p.idn} = ${p.eng}`,
    breakdown: p.breakdown || [],
    level: p.level || 1,
    tags: p.tags || []
  }));

  const builder = phrases
    .filter((p) => p.idn.split(" ").length >= 2 && p.idn.split(" ").length <= 8)
    .map((p, i) => ({
      id: `b-${p.id || i}`,
      sourceId: p.id,
      type: "builder",
      category: p.category,
      topicId: p.topicId,
      scenario: p.category,
      instruction: "Build the sentence",
      prompt: p.eng,
      answers: [p.idn],
      tiles: shuffle(p.idn.split(" ")),
      tip: p.pattern || "Build word order",
      explanation: `${p.idn} = ${p.eng}`,
      breakdown: p.breakdown || [],
      level: p.level || 1,
      tags: p.tags || []
    }));

  const wordDrills = words.map((w, i) => ({
    id: `w-${w.id || i}`,
    sourceId: w.id,
    type: "word",
    category: w.category,
    topicId: w.topicId,
    scenario: w.category,
    instruction: "Choose the meaning",
    prompt: w.idn,
    answers: [w.eng],
    options: shuffle([w.eng, ...shuffle(words.filter((x) => x.id !== w.id)).slice(0, 3).map((x) => x.eng)]),
    tip: w.type || "core word",
    explanation: `${w.idn} = ${w.eng}`,
    breakdown: [[w.idn, w.eng]],
    level: w.level || 1,
    tags: w.tags || []
  }));

  const conversation = [];
  chains.forEach((chain) => {
    (chain.turns || []).forEach((turn, index) => {
      if (turn.speaker !== "user") return;
      const previous = chain.turns[index - 1];
      const otherReplies = chains.flatMap((c) => (c.turns || []).filter((t) => t.speaker === "user" && t.idn !== turn.idn).map((t) => t.idn));
      conversation.push({
        id: `c-${chain.id}-${index}`,
        type: "conversation",
        category: chain.category,
        topicId: chain.topicId,
        scenario: chain.title || chain.category,
        instruction: "Choose the best reply",
        theySay: previous?.idn || chain.title,
        prompt: previous?.idn || chain.title,
        answers: [turn.idn],
        options: shuffle([turn.idn, ...shuffle(otherReplies).slice(0, 3)]),
        tip: turn.eng,
        explanation: `${turn.idn} = ${turn.eng}`,
        breakdown: [],
        level: chain.level || 1,
        tags: ["conversation"]
      });
    });
  });

  return { typing, choice, listening, builder, words: wordDrills, conversation };
}

const baseContent = buildBaseContent(baliBahasaDataset);

const survivalPacks = [
  { id: "pack-first-day", label: "First Day in Bali", topics: ["core_basics", "transport_driver", "directions_locations"], description: "Arrive, move around, and ask simple questions." },
  { id: "pack-food", label: "Order Food", topics: ["warung_food", "time_numbers"], description: "Warung, drinks, spice level, and paying." },
  { id: "pack-driver", label: "Driver Conversations", topics: ["transport_driver", "directions_locations", "whatsapp_messages"], description: "Pickup, location, traffic, and timing." },
  { id: "pack-villa", label: "Villa Management", topics: ["villa_staff", "problems_help", "whatsapp_messages"], description: "Housekeeping, maintenance, and staff messages." },
  { id: "pack-emergency", label: "Problems & Help", topics: ["problems_help", "villa_staff", "transport_driver"], description: "Broken things, urgent help, and practical safety." },
  { id: "pack-smalltalk", label: "Small Talk", topics: ["social_smalltalk", "core_basics"], description: "Friendly local conversations." }
];

const missions = [
  { id: "mission-warung", label: "Order Food", topicId: "warung_food", goal: 5, description: "Ordering, spice, drinks, and paying." },
  { id: "mission-driver", label: "Talk to Driver", topicId: "transport_driver", goal: 5, description: "Pickup, location, time, and traffic." },
  { id: "mission-villa", label: "Villa Staff", topicId: "villa_staff", goal: 5, description: "Cleaning, AC, keys, and maintenance." },
  { id: "mission-smalltalk", label: "Small Talk", topicId: "social_smalltalk", goal: 5, description: "Friendly local chat." }
];

function phrasebookContent(items) {
  const clean = (items || []).filter((x) => x.idn && x.eng);
  const typing = clean.map((item) => ({
    id: `pb-t-${item.id}`,
    type: "typing",
    category: "My Phrasebook",
    topicId: "phrasebook",
    scenario: "Personal phrasebook",
    instruction: "Say this in Bahasa Indonesia",
    prompt: item.eng,
    answers: [item.idn],
    options: shuffle([item.idn, ...shuffle(clean.filter((x) => x.id !== item.id)).slice(0, 3).map((x) => x.idn)]),
    tip: item.note || "Personal phrase",
    explanation: `${item.idn} = ${item.eng}`,
    breakdown: [[item.idn, item.eng]],
    level: 1,
    tags: ["phrasebook"]
  }));
  const listening = clean.map((item) => ({
    ...typing.find((x) => x.id === `pb-t-${item.id}`),
    id: `pb-l-${item.id}`,
    type: "listening",
    instruction: "Listen and choose the meaning",
    prompt: item.idn,
    answers: [item.eng],
    options: shuffle([item.eng, ...shuffle(clean.filter((x) => x.id !== item.id)).slice(0, 3).map((x) => x.eng)])
  }));
  const builder = clean.filter((x) => x.idn.split(" ").length >= 2).map((item) => ({
    ...typing.find((x) => x.id === `pb-t-${item.id}`),
    id: `pb-b-${item.id}`,
    type: "builder",
    instruction: "Build your saved phrase",
    tiles: shuffle(item.idn.split(" "))
  }));
  return { typing, listening, builder, all: [...typing, ...listening, ...builder] };
}

function blankUser() {
  return {
    started: false,
    activeTab: "learn",
    currentFlow: "smart",
    currentDrillId: getRandomDrillId(baseContent.typing),
    selectedTopicId: "core_basics",
    selectedPackId: "pack-first-day",
    mode: "all",
    score: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    hearts: 3,
    completedToday: 0,
    dailyGoal: 10,
    feedback: null,
    wrongIds: [],
    recentIds: [],
    answeredIds: [],
    drillStats: {},
    reviewSchedule: {},
    shuffledOptions: {},
    builderAnswer: [],
    phrasebook: [],
    activeMissionId: "",
    missionProgress: {},
    dailyLesson: { date: "", ids: [], completed: 0 },
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
  if (!items.length) return "";
  return items[Math.floor(Math.random() * items.length)].id;
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
  navInner: { maxWidth: 540, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 },
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
  const level = getLevel(user.score);
  const pb = useMemo(() => phrasebookContent(user.phrasebook), [user.phrasebook]);
  const content = useMemo(() => ({
    typing: [...baseContent.typing, ...pb.typing],
    choice: baseContent.choice,
    listening: [...baseContent.listening, ...pb.listening],
    builder: [...baseContent.builder, ...pb.builder],
    words: baseContent.words,
    conversation: baseContent.conversation,
    phrasebook: pb.all
  }), [pb]);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeProfile, showProfileManager }));
  }, [profiles, activeProfile, showProfileManager]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(SR));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => setDraftInput(""), [user.currentDrillId, activeProfile]);

  const dueItems = useMemo(() => {
    const today = todayKey();
    return content.typing.filter((d) => user.reviewSchedule?.[d.id]?.nextReview <= today);
  }, [content.typing, user.reviewSchedule]);

  const weakItems = useMemo(() => content.typing.filter((d) => user.wrongIds.includes(d.id)), [content.typing, user.wrongIds]);
  const currentPack = survivalPacks.find((p) => p.id === user.selectedPackId) || survivalPacks[0];
  const currentMission = missions.find((m) => m.id === user.activeMissionId);

  const pool = useMemo(() => {
    if (user.currentFlow === "review") return dueItems;
    if (user.currentFlow === "weak") return weakItems;
    if (user.currentFlow === "choice") return content.choice;
    if (user.currentFlow === "listening") return content.listening;
    if (user.currentFlow === "builder") return content.builder;
    if (user.currentFlow === "words") return content.words;
    if (user.currentFlow === "conversation") return content.conversation;
    if (user.currentFlow === "phrasebook") return content.phrasebook;
    if (user.currentFlow === "topic") return content.typing.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-listening") return content.listening.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-builder") return content.builder.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-choice") return content.choice.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "topic-conversation") return content.conversation.filter((d) => d.topicId === user.selectedTopicId);
    if (user.currentFlow === "pack") return content.typing.filter((d) => currentPack.topics.includes(d.topicId));
    if (user.currentFlow === "mission" && currentMission) return content.typing.filter((d) => d.topicId === currentMission.topicId);
    if (dueItems.length) return dueItems;
    if (weakItems.length >= 3) return weakItems;
    return [...content.builder.slice(0, 20), ...content.typing.slice(0, 40), ...content.listening.slice(0, 20)];
  }, [user.currentFlow, user.selectedTopicId, user.selectedPackId, dueItems, weakItems, content, currentPack, currentMission]);

  const current = useMemo(() => pool.find((d) => d.id === user.currentDrillId) || pool[0] || content.typing[0], [pool, user.currentDrillId, content.typing]);
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

  const setFlow = (flow, explicitPool) => {
    const nextPool = explicitPool || poolForFlow(flow);
    if (!nextPool.length) {
      updateUser({ activeTab: flow.includes("topic") ? "topics" : "learn", feedback: { ok: false, text: "Nothing to practise yet", explanation: "Try another mode or topic." } });
      return;
    }
    updateUser({ currentFlow: flow, activeTab: "train", currentDrillId: getRandomDrillId(nextPool), shuffledOptions: {}, builderAnswer: [], feedback: null, lastCorrectAnswer: "" });
    setDraftInput("");
  };

  function poolForFlow(flow) {
    if (flow === "topic") return content.typing.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-listening") return content.listening.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-builder") return content.builder.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-choice") return content.choice.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "topic-conversation") return content.conversation.filter((d) => d.topicId === user.selectedTopicId);
    if (flow === "pack") return content.typing.filter((d) => currentPack.topics.includes(d.topicId));
    if (flow === "review") return dueItems;
    if (flow === "weak") return weakItems;
    if (flow === "builder") return content.builder;
    if (flow === "listening") return content.listening;
    if (flow === "conversation") return content.conversation;
    if (flow === "phrasebook") return content.phrasebook;
    return content.typing;
  }

  const updateStatsPatch = (id, ok) => {
    const old = user.drillStats[id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    const oldSchedule = user.reviewSchedule[id] || { interval: 0 };
    const interval = ok ? Math.min(Math.max(1, oldSchedule.interval || 1) * 2, 30) : 1;
    return {
      drillStats: { ...user.drillStats, [id]: { seen: old.seen + 1, correct: old.correct + (ok ? 1 : 0), wrong: old.wrong + (ok ? 0 : 1), streak: ok ? old.streak + 1 : 0 } },
      reviewSchedule: { ...user.reviewSchedule, [id]: { interval, nextReview: ok ? addDays(interval) : addDays(1), lastResult: ok ? "correct" : "wrong" } }
    };
  };

  const nextDrill = () => {
    const recentIds = [current?.id, ...(user.recentIds || [])].filter(Boolean).slice(0, 8);
    const next = chooseNext(pool, user.drillStats, current?.id, user.reviewSchedule, user.currentFlow === "review", recentIds);
    updateUser({ currentDrillId: next ? next.id : getRandomDrillId(pool), shuffledOptions: {}, builderAnswer: [], feedback: null, lastCorrectAnswer: "", recentIds });
    setDraftInput("");
  };

  const submitAnswer = (answer, showOnly = false) => {
    if (!current) return;
    const ok = !showOnly && isCorrectAnswer(answer, current.answers);
    const statsPatch = updateStatsPatch(current.id, ok);
    if (ok) {
      playSound("correct");
      const newStreak = user.streak + 1;
      const gained = 10 + Math.min(newStreak * 2, 20);
      const missionProgress = user.currentFlow === "mission" && currentMission ? user.missionProgress?.[currentMission.id] || { count: 0, completed: false } : null;
      const missionPatch = missionProgress ? { missionProgress: { ...user.missionProgress, [currentMission.id]: { count: missionProgress.count + 1, completed: missionProgress.count + 1 >= currentMission.goal } } } : {};
      updateUser({
        ...statsPatch,
        ...missionPatch,
        score: user.score + gained,
        coins: user.coins + Math.max(1, Math.round(gained / 5)),
        streak: newStreak,
        bestStreak: Math.max(user.bestStreak, newStreak),
        completedToday: user.completedToday + 1,
        wrongIds: user.wrongIds.filter((id) => id !== current.id),
        feedback: { ok: true, text: `Correct · +${gained} XP`, explanation: current.explanation },
        builderAnswer: [],
        lastCorrectAnswer: current.answers[0]
      });
      if (user.autoPlayAnswer) speak(current.answers[0]);
      setDraftInput("");
      setTimeout(nextDrill, CORRECT_DELAY_MS);
    } else {
      playSound("wrong");
      const recentIds = [current?.id, ...(user.recentIds || [])].filter(Boolean).slice(0, 8);
      updateUser({
        ...statsPatch,
        hearts: current.topicId === "phrasebook" ? user.hearts : Math.max(user.hearts - 1, 0),
        streak: 0,
        wrongIds: user.wrongIds.includes(current.id) ? user.wrongIds : [...user.wrongIds, current.id],
        recentIds,
        feedback: { ok: false, text: showOnly ? "Answer shown" : "Not quite", explanation: `You wrote: ${showOnly ? "—" : answer || "—"}\nCorrect: ${current.answers[0]}\n${diffHint(answer, current.answers[0])}` },
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

  const addPhrase = (preset) => {
    const data = preset || draftPhrase;
    const idn = (data.idn || "").trim();
    const eng = (data.eng || "").trim();
    if (!idn || !eng) return updateUser({ feedback: { ok: false, text: "Missing phrase", explanation: "Add both Bahasa and English." } });
    updateUser({ phrasebook: [{ id: Date.now(), idn, eng, note: data.note || "" }, ...user.phrasebook], feedback: { ok: true, text: "Added", explanation: "This phrase is now in your training." } });
    setDraftPhrase({ idn: "", eng: "", note: "" });
  };

  const topicStats = (topicId) => {
    const items = content.typing.filter((d) => d.topicId === topicId);
    const correct = items.filter((d) => user.drillStats[d.id]?.correct > 0).length;
    return { total: items.length || 1, correct };
  };

  const TrainingCard = () => {
    if (!current) return <div style={styles.card}>No drill available.</div>;
    const isTyping = current.type === "typing";
    const isBuilder = current.type === "builder";
    const audioText = current.type === "listening" || current.type === "word" ? current.prompt : current.type === "conversation" ? current.theySay : current.answers?.[0];

    return <div style={styles.card}>
      <div style={styles.row}><button style={styles.button} onClick={() => updateUser({ activeTab: "learn" })}>← Exit</button><div style={styles.badge}>{current.category}</div></div>
      <div style={{ ...styles.muted, marginTop: 14 }}>{current.scenario}</div>
      {current.type === "conversation" ? <div style={{ ...styles.item, marginTop: 12 }}><div style={styles.muted}>They say:</div><h2 style={{ margin: "6px 0 0", fontSize: 23 }}>{current.theySay}</h2></div> : <h2 style={{ fontSize: 26, lineHeight: 1.18 }}>{current.prompt}</h2>}

      {isTyping ? <>
        <div style={{ ...styles.muted, marginBottom: 10 }}>Type your answer in Bahasa Indonesia.</div>
        <div style={{ display: "flex", gap: 8 }}><input style={styles.input} value={draftInput} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitAnswer(draftInput)} placeholder="Type Bahasa Indonesia" /><button style={{ ...styles.button, width: 52, padding: 0 }} onClick={() => speak(current.answers?.[0])}>🔊</button>{voiceSupported ? <button style={{ ...styles.button, width: 52, padding: 0 }} onClick={startVoice}>🎤</button> : null}</div>
        <button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer(draftInput)}>Check</button>
      </> : isBuilder ? <>
        <div style={{ ...styles.item, minHeight: 58, marginBottom: 10 }}>{user.builderAnswer.length ? user.builderAnswer.map((w, i) => <button key={`${w}-${i}`} style={{ ...styles.button, margin: 4 }} onClick={() => updateUser({ builderAnswer: user.builderAnswer.filter((_, idx) => idx !== i) })}>{w}</button>) : <div style={styles.muted}>Tap words below to build the sentence.</div>}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(current.tiles || []).map((w, i) => <button key={`${w}-${i}`} style={styles.button} onClick={() => updateUser({ builderAnswer: [...user.builderAnswer, w] })}>{w}</button>)}</div>
        <button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer(user.builderAnswer.join(" "))}>Check Sentence</button>
      </> : <div style={{ display: "grid", gap: 8 }}>{currentOptions.map((option) => <button key={option} style={styles.choice} onClick={() => submitAnswer(option)}>{option}</button>)}<button style={styles.button} onClick={() => speak(audioText)}>🔊 Play Bahasa</button></div>}

      <div style={styles.grid2}><button style={styles.button} onClick={() => submitAnswer("", true)}>Show Answer</button><button style={styles.button} onClick={nextDrill}>Skip</button></div>
      <div style={{ ...styles.muted, marginTop: 12 }}>Tip: {safeTip(current)}</div>
      {user.lastCorrectAnswer ? <button style={{ ...styles.button, width: "100%", marginTop: 10 }} onClick={() => speak(user.lastCorrectAnswer)}>🔊 Play Correct Answer</button> : null}
      {feedback}
      {(user.feedback || user.lastCorrectAnswer) && current.breakdown?.length ? <details style={{ marginTop: 12 }}><summary style={{ color: "#86efac", fontWeight: 800 }}>Phrase Breakdown</summary><div style={{ display: "grid", gap: 6, marginTop: 10 }}>{current.breakdown.map(([p, m]) => <div key={`${p}-${m}`}><strong style={{ color: "#86efac" }}>{p}</strong> = {m}</div>)}</div></details> : null}
    </div>;
  };

  const Home = () => <>
    <div style={styles.hero}><div style={styles.pill}>Continue Learning</div><h1 style={styles.title}>{dueItems.length ? `${dueItems.length} reviews due` : "Ready for today?"}</h1><p style={styles.text}>Best path: Continue, topic practice before real situations, then one mission.</p><button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => setFlow("smart")}>Continue</button></div>
    <div style={styles.grid3}><div style={styles.stat}>🔥<br/><strong>{user.streak}</strong><div style={styles.muted}>Streak</div></div><div style={styles.stat}>🔁<br/><strong>{dueItems.length}</strong><div style={styles.muted}>Due</div></div><div style={styles.stat}>🪙<br/><strong>{user.coins}</strong><div style={styles.muted}>Coins</div></div></div>
    <div style={styles.card}><h3>Quick Practice</h3><div style={styles.grid2}><button style={styles.button} onClick={() => setFlow("review")}>🔁 Due Review</button><button style={styles.button} onClick={() => setFlow("weak")}>🎯 Weak Phrases</button><button style={styles.button} onClick={() => setFlow("builder")}>🧩 Builder</button><button style={styles.button} onClick={() => updateUser({ activeTab: "topics" })}>📚 Topics</button></div>{feedback}</div>
  </>;

  const Topics = () => {
    const selectedTopic = (baliBahasaDataset?.topics || []).find((t) => t.id === user.selectedTopicId) || (baliBahasaDataset?.topics || [])[0];
    return <>
      <div style={styles.card}><h2 style={{ marginTop: 0 }}>Practice Any Topic</h2><p style={styles.text}>Choose exactly what you want to practise right now.</p><div style={{ display: "grid", gap: 8, marginTop: 12 }}>{(baliBahasaDataset?.topics || []).map((topic) => { const st = topicStats(topic.id); return <button key={topic.id} style={{ ...styles.choice, ...(user.selectedTopicId === topic.id ? styles.active : {}) }} onClick={() => updateUser({ selectedTopicId: topic.id })}><strong>{topic.label}</strong><div style={{ ...styles.muted, marginTop: 4 }}>{topic.description}</div><div style={{ ...styles.progress, marginTop: 8 }}><div style={progressFill((st.correct / st.total) * 100)} /></div><div style={{ ...styles.muted, marginTop: 4 }}>{st.correct}/{st.total} phrases practised</div></button>; })}</div></div>
      <div style={styles.card}><div style={styles.pill}>{selectedTopic?.label}</div><h3>Choose Training Style</h3><div style={styles.grid2}><button style={styles.primary} onClick={() => setFlow("topic")}>Typing</button><button style={styles.button} onClick={() => setFlow("topic-builder")}>Builder</button><button style={styles.button} onClick={() => setFlow("topic-listening")}>Listening</button><button style={styles.button} onClick={() => setFlow("topic-choice")}>Multiple Choice</button><button style={styles.button} onClick={() => setFlow("topic-conversation")}>Conversation</button></div></div>
      <div style={styles.card}><h3>Survival Packs</h3><div style={{ display: "grid", gap: 8 }}>{survivalPacks.map((pack) => <button key={pack.id} style={{ ...styles.choice, ...(user.selectedPackId === pack.id ? styles.active : {}) }} onClick={() => updateUser({ selectedPackId: pack.id })}><strong>{pack.label}</strong><div style={styles.muted}>{pack.description}</div></button>)}</div><button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => setFlow("pack")}>Start Selected Pack</button></div>
    </>;
  };

  const Speak = () => <>
    <div style={styles.card}><h2>Real Bali Missions</h2><p style={styles.text}>Practise real situations, not random words.</p>{missions.map((m) => { const p = user.missionProgress[m.id] || { count: 0, completed: false }; return <div key={m.id} style={{ ...styles.item, marginTop: 8 }}><div style={styles.row}><div><strong>{m.label}</strong><div style={styles.muted}>{m.description}</div><div style={styles.muted}>{Math.min(p.count, m.goal)}/{m.goal} complete {p.completed ? "✅" : ""}</div></div><button style={styles.primary} onClick={() => { const missionPool = content.typing.filter((d) => d.topicId === m.topicId); updateUser({ activeMissionId: m.id, currentFlow: "mission", activeTab: "train", currentDrillId: getRandomDrillId(missionPool), feedback: null }); }}>Start</button></div></div>; })}</div>
    <div style={styles.card}><button style={{ ...styles.button, width: "100%" }} onClick={() => setFlow("conversation")}>💬 Conversation Replies</button></div>
  </>;

  const Phrasebook = () => <>
    <div style={styles.card}><h2>My Phrasebook</h2><p style={styles.text}>Add real phrases you hear, then train them.</p><div style={{ display: "grid", gap: 10 }}><input style={styles.input} value={draftPhrase.idn} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrase({ ...draftPhrase, idn: e.target.value })} placeholder="Bahasa: Bisa datang sekarang?" /><input style={styles.input} value={draftPhrase.eng} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrase({ ...draftPhrase, eng: e.target.value })} placeholder="English: Can you come now?" /><textarea style={styles.textarea} value={draftPhrase.note} onChange={(e) => setDraftPhrase({ ...draftPhrase, note: e.target.value })} placeholder="Note or context" /><button style={styles.primary} onClick={() => addPhrase()}>Add to Training</button><button style={styles.button} onClick={() => setFlow("phrasebook")}>Train My Phrases</button></div>{feedback}</div>
    <div style={styles.card}><h3>Saved</h3>{user.phrasebook.length ? user.phrasebook.map((p) => <div key={p.id} style={{ ...styles.item, marginTop: 8 }}><strong style={{ color: "#86efac" }}>{p.idn}</strong><div>{p.eng}</div><div style={styles.row}><button style={styles.button} onClick={() => speak(p.idn)}>🔊</button><button style={styles.button} onClick={() => updateUser({ phrasebook: user.phrasebook.filter((x) => x.id !== p.id) })}>Delete</button></div></div>) : <div style={styles.muted}>No saved phrases yet.</div>}</div>
  </>;

  const Profile = () => <>
    <div style={styles.card}><h2>{activeProfile}</h2><div style={styles.grid3}><div style={styles.stat}><strong>{level.level}</strong><div style={styles.muted}>Level</div></div><div style={styles.stat}><strong>{user.score}</strong><div style={styles.muted}>XP</div></div><div style={styles.stat}><strong>{user.bestStreak}</strong><div style={styles.muted}>Best</div></div></div><div style={{ ...styles.progress, marginTop: 14 }}><div style={progressFill((user.score / level.next) * 100)} /></div><div style={{ display: "grid", gap: 8, marginTop: 14 }}><button style={styles.button} onClick={() => setShowProfileManager(true)}>Switch Profile</button><button style={styles.button} onClick={() => updateUser({ muted: !user.muted })}>{user.muted ? "Unmute Sounds" : "Mute Sounds"}</button><button style={styles.button} onClick={() => updateUser({ autoPlayAnswer: !user.autoPlayAnswer })}>{user.autoPlayAnswer ? "Auto-play Answer: On" : "Auto-play Answer: Off"}</button><button style={{ ...styles.button, ...styles.warn }} onClick={() => { setProfiles((prev) => ({ ...prev, [activeProfile]: blankUser() })); setShowProfileManager(true); }}>Reset Profile</button></div></div>
    <div style={styles.card}><h3>Best Daily Plan</h3><p style={styles.text}>1. Continue. 2. Practise the topic you need today. 3. Do one mission. 4. Add one real phrase to Phrasebook.</p></div>
  </>;

  const BottomNav = () => <div style={styles.bottomNav}><div style={styles.navInner}>{[["learn", "🏠", "Learn"], ["topics", "📚", "Topics"], ["speak", "💬", "Speak"], ["phrasebook", "⭐", "Phrases"], ["profile", "👤", "Profile"]].map(([tab, icon, label]) => <button key={tab} style={{ ...styles.navBtn, ...(user.activeTab === tab ? styles.navActive : {}) }} onClick={() => updateUser({ activeTab: tab })}><div style={{ fontSize: 20 }}>{icon}</div>{label}</button>)}</div></div>;

  if (showProfileManager) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Bali Bahasa</div><h1 style={styles.title}>Choose learner</h1><p style={styles.text}>Each profile keeps separate progress and phrasebook items.</p></div><div style={styles.card}>{Object.keys(profiles).map((name) => <button key={name} style={{ ...styles.choice, width: "100%", marginBottom: 8 }} onClick={() => { setActiveProfile(name); setShowProfileManager(false); }}>{name}<div style={styles.muted}>Level {getLevel(profiles[name]?.score || 0).level}</div></button>)}<div style={{ display: "flex", gap: 8 }}><input style={styles.input} value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New profile" /><button style={styles.primary} onClick={() => { const n = newProfileName.trim(); if (!n) return; setProfiles((prev) => ({ ...prev, [n]: blankUser() })); setActiveProfile(n); setNewProfileName(""); setShowProfileManager(false); }}>Add</button></div></div>{footer}</div></div>;

  if (!user.started) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Conversation-first</div><h1 style={styles.title}>Speak useful Bahasa faster</h1><p style={styles.text}>Now with Topic Practice and Survival Packs.</p><button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => updateUser({ started: true })}>Start</button></div>{footer}</div></div>;

  const screen = user.activeTab === "train" ? TrainingCard() : user.activeTab === "topics" ? <Topics /> : user.activeTab === "speak" ? <Speak /> : user.activeTab === "phrasebook" ? <Phrasebook /> : user.activeTab === "profile" ? <Profile /> : <Home />;
  const focus = user.activeTab === "train";

  return <div style={focus ? styles.focusPage : styles.page}><div style={styles.wrap}>{screen}{!focus ? footer : null}</div>{!focus ? <BottomNav /> : null}</div>;
}
