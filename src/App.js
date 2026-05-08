import React, { useEffect, useMemo, useRef, useState } from "react";
import baliBahasaDataset from "./dataset";

const APP_VERSION = "2.0.1";
const APP_VERSION_LABEL = "Version 2.0.1 — Keyboard Fixed";
const STORAGE_KEY = "bali-bahasa-profiles-v12";

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
  variants.add(base.replace(/\btidak\b/g, "nggak"));
  variants.add(base.replace(/\bnggak\b/g, "tidak"));
  variants.add(base.replace(/^saya /, ""));
  variants.add(base.replace(/^aku /, ""));
  variants.add(base.replace(/\bsaya\b/g, "aku"));
  variants.add(base.replace(/\baku\b/g, "saya"));
  return Array.from(variants).filter(Boolean);
}

function isAnswerCorrect(submitted, answers) {
  const value = normalize(submitted);
  return answers.flatMap(expandVariants).some((answer) => answer === value);
}

function shuffleArray(items) {
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
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getLevelData(score) {
  if (score >= 1200) return { level: 6, title: "Confident Local Chat", next: 1600 };
  if (score >= 850) return { level: 5, title: "Bali Conversation Flow", next: 1200 };
  if (score >= 550) return { level: 4, title: "Local Chat Mode", next: 850 };
  if (score >= 300) return { level: 3, title: "Conversation Builder", next: 550 };
  if (score >= 120) return { level: 2, title: "Pattern Starter", next: 300 };
  return { level: 1, title: "First Steps", next: 120 };
}

function flattenPhrases(dataset) {
  const all = [];
  (dataset?.topics || []).forEach((topic) => {
    (topic.phrases || []).forEach((phrase) => {
      all.push({ ...phrase, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 });
    });
  });
  return all;
}

function flattenWords(dataset) {
  const all = [];
  (dataset?.topics || []).forEach((topic) => {
    (topic.coreWords || []).forEach((word) => {
      all.push({ ...word, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 });
    });
  });
  return all;
}

function flattenConversationChains(dataset) {
  const chains = [];
  (dataset?.topics || []).forEach((topic) => {
    (topic.conversationChains || []).forEach((chain) => {
      chains.push({ ...chain, topicId: topic.id, category: topic.label, topicPriority: topic.priority || 99 });
    });
  });
  return chains;
}

function createDistractors(correctPhrase, allPhrases, count = 3, field = "idn") {
  const sameTopic = allPhrases.filter((item) => item.id !== correctPhrase.id && item.topicId === correctPhrase.topicId);
  const otherTopics = allPhrases.filter((item) => item.id !== correctPhrase.id && item.topicId !== correctPhrase.topicId);
  return shuffleArray([...sameTopic, ...otherTopics]).slice(0, count).map((item) => item[field]);
}

function createTranslationDrills(dataset) {
  const phrases = flattenPhrases(dataset);
  return phrases.map((phrase, index) => ({
    id: `p-${phrase.id || index}`,
    sourceId: phrase.id,
    type: "typing",
    skill: "recall",
    category: phrase.category,
    topicId: phrase.topicId,
    scenario: phrase.category,
    instruction: "Say this in Bahasa Indonesia",
    prompt: phrase.eng,
    answers: [phrase.idn],
    options: shuffleArray([phrase.idn, ...createDistractors(phrase, phrases)]),
    tip: phrase.pattern || "Focus on the phrase pattern.",
    explanation: `${phrase.idn} = ${phrase.eng}`,
    breakdown: phrase.breakdown || [],
    level: phrase.level || 1,
    tags: phrase.tags || []
  }));
}

function createChoiceDrills(dataset) {
  const phrases = flattenPhrases(dataset);
  return phrases.map((phrase, index) => ({
    id: `mc-${phrase.id || index}`,
    sourceId: phrase.id,
    type: "choice",
    skill: "recognition",
    category: phrase.category,
    topicId: phrase.topicId,
    scenario: phrase.category,
    instruction: "Choose the Bahasa Indonesia phrase",
    prompt: phrase.eng,
    answers: [phrase.idn],
    options: shuffleArray([phrase.idn, ...createDistractors(phrase, phrases)]),
    tip: phrase.pattern || "Choose the matching phrase.",
    explanation: `${phrase.idn} = ${phrase.eng}`,
    breakdown: phrase.breakdown || [],
    level: phrase.level || 1,
    tags: phrase.tags || []
  }));
}

function createListeningDrills(dataset) {
  const phrases = flattenPhrases(dataset);
  return phrases.map((phrase, index) => ({
    id: `l-${phrase.id || index}`,
    sourceId: phrase.id,
    type: "listening",
    skill: "listening",
    category: phrase.category,
    topicId: phrase.topicId,
    scenario: phrase.category,
    instruction: "Listen and choose the meaning",
    prompt: phrase.idn,
    answers: [phrase.eng],
    options: shuffleArray([phrase.eng, ...createDistractors(phrase, phrases, 3, "eng")]),
    tip: "Listen for the key words.",
    explanation: `${phrase.idn} = ${phrase.eng}`,
    breakdown: phrase.breakdown || [],
    level: phrase.level || 1,
    tags: phrase.tags || []
  }));
}

function createWordDrills(dataset) {
  const words = flattenWords(dataset);
  return words.map((word, index) => ({
    id: `w-${word.id || index}`,
    sourceId: word.id,
    type: "word",
    skill: "vocab",
    category: word.category,
    topicId: word.topicId,
    scenario: word.category,
    instruction: "Choose the meaning",
    prompt: word.idn,
    answers: [word.eng],
    options: shuffleArray([word.eng, ...shuffleArray(words.filter((item) => item.id !== word.id)).slice(0, 3).map((item) => item.eng)]),
    tip: `${word.type || "word"} · ${word.tags?.join(", ") || "core vocabulary"}`,
    explanation: `${word.idn} = ${word.eng}`,
    breakdown: [[word.idn, word.eng]],
    level: word.level || 1,
    tags: word.tags || []
  }));
}

function createBuilderDrills(dataset) {
  const phrases = flattenPhrases(dataset).filter((phrase) => phrase.idn.split(" ").length >= 3 && phrase.idn.split(" ").length <= 7);
  return phrases.map((phrase, index) => ({
    id: `b-${phrase.id || index}`,
    sourceId: phrase.id,
    type: "builder",
    skill: "structure",
    category: phrase.category,
    topicId: phrase.topicId,
    scenario: phrase.category,
    instruction: "Build the sentence",
    prompt: phrase.eng,
    answers: [phrase.idn],
    tiles: shuffleArray(phrase.idn.split(" ")),
    tip: phrase.pattern || "Tap words in order.",
    explanation: `${phrase.idn} = ${phrase.eng}`,
    breakdown: phrase.breakdown || [],
    level: phrase.level || 1,
    tags: phrase.tags || []
  }));
}

function createConversationDrills(dataset) {
  const chains = flattenConversationChains(dataset);
  const turns = [];
  chains.forEach((chain) => {
    (chain.turns || []).forEach((turn, index) => {
      if (turn.speaker !== "user") return;
      const previousTurn = chain.turns[index - 1];
      const otherUserTurns = chains.flatMap((otherChain) =>
        (otherChain.turns || []).filter((item) => item.speaker === "user" && item.idn !== turn.idn).map((item) => item.idn)
      );
      turns.push({
        id: `c-${chain.id}-${index}`,
        sourceId: chain.id,
        type: "conversation",
        skill: "conversation",
        category: chain.category,
        topicId: chain.topicId,
        scenario: chain.title || chain.category,
        instruction: "Choose the best reply",
        theySay: previousTurn?.idn || chain.title || "Conversation",
        prompt: previousTurn ? previousTurn.idn : chain.title,
        answers: [turn.idn],
        options: shuffleArray([turn.idn, ...shuffleArray(otherUserTurns).slice(0, 3)]),
        tip: turn.eng,
        explanation: `${turn.idn} = ${turn.eng}`,
        breakdown: [],
        level: chain.level || 1,
        tags: ["conversation", chain.topicId]
      });
    });
  });
  return turns;
}

function createPhrasebookDrills(phrasebook) {
  const items = (phrasebook || []).filter((item) => item.idn && item.eng);
  const typing = items.map((item) => ({
    id: `pb-t-${item.id}`,
    sourceId: item.id,
    type: "typing",
    skill: "phrasebook",
    category: "My Phrasebook",
    topicId: "phrasebook",
    scenario: "Personal phrasebook",
    instruction: "Say this in Bahasa Indonesia",
    prompt: item.eng,
    answers: [item.idn],
    options: shuffleArray([item.idn, ...shuffleArray(items.filter((other) => other.id !== item.id)).slice(0, 3).map((other) => other.idn)]),
    tip: item.note || "Personal phrase saved by you.",
    explanation: `${item.idn} = ${item.eng}`,
    breakdown: [[item.idn, item.eng]],
    level: 1,
    tags: ["phrasebook", item.kind || "phrase"]
  }));
  const listening = items.map((item) => ({
    id: `pb-l-${item.id}`,
    sourceId: item.id,
    type: "listening",
    skill: "phrasebook_listening",
    category: "My Phrasebook",
    topicId: "phrasebook",
    scenario: "Personal phrasebook listening",
    instruction: "Listen and choose the meaning",
    prompt: item.idn,
    answers: [item.eng],
    options: shuffleArray([item.eng, ...shuffleArray(items.filter((other) => other.id !== item.id)).slice(0, 3).map((other) => other.eng)]),
    tip: item.note || "Listen and choose the meaning.",
    explanation: `${item.idn} = ${item.eng}`,
    breakdown: [[item.idn, item.eng]],
    level: 1,
    tags: ["phrasebook", item.kind || "phrase"]
  }));
  const builder = items.filter((item) => item.idn.split(" ").length >= 2).map((item) => ({
    id: `pb-b-${item.id}`,
    sourceId: item.id,
    type: "builder",
    skill: "phrasebook_builder",
    category: "My Phrasebook",
    topicId: "phrasebook",
    scenario: "Personal phrasebook builder",
    instruction: "Build your saved phrase",
    prompt: item.eng,
    answers: [item.idn],
    tiles: shuffleArray(item.idn.split(" ")),
    tip: item.note || "Build your saved phrase.",
    explanation: `${item.idn} = ${item.eng}`,
    breakdown: [[item.idn, item.eng]],
    level: 1,
    tags: ["phrasebook", "builder"]
  }));
  return { typing, listening, builder, all: [...typing, ...listening, ...builder] };
}

function buildBaseDrills(dataset) {
  return {
    typing: createTranslationDrills(dataset),
    choice: createChoiceDrills(dataset),
    listening: createListeningDrills(dataset),
    words: createWordDrills(dataset),
    builder: createBuilderDrills(dataset),
    conversation: createConversationDrills(dataset)
  };
}

const baseContent = buildBaseDrills(baliBahasaDataset);

const missions = [
  { id: "mission-warung", label: "Order Food", topicId: "warung_food", goal: 5, description: "Ordering, spice, drinks, and paying." },
  { id: "mission-driver", label: "Talk to Driver", topicId: "transport_driver", goal: 5, description: "Pickup, location, time, and traffic." },
  { id: "mission-villa", label: "Villa Staff", topicId: "villa_staff", goal: 5, description: "Cleaning, AC, keys, and maintenance." },
  { id: "mission-smalltalk", label: "Small Talk", topicId: "social_smalltalk", goal: 5, description: "Friendly local chat." }
];

const topicList = [
  { id: "all", label: "All" },
  { id: "phrasebook", label: "My Phrasebook" },
  ...(baliBahasaDataset?.topics || []).map((topic) => ({ id: topic.id, label: topic.label }))
];

function getRandomDrillId(items) {
  if (!items.length) return "";
  return items[Math.floor(Math.random() * items.length)].id;
}

function chooseAdaptiveDrill(items, stats, excludeId, schedule = {}, onlyDue = false) {
  const today = todayKey();
  let candidates = items.filter((item) => item.id !== excludeId);
  if (onlyDue) {
    const due = candidates.filter((item) => !schedule[item.id]?.nextReview || schedule[item.id].nextReview <= today);
    if (due.length) candidates = due;
  }
  const source = candidates.length ? candidates : items;
  if (!source.length) return null;
  const weighted = source.map((item) => {
    const s = stats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    const dueBoost = !schedule[item.id]?.nextReview || schedule[item.id].nextReview <= today ? 3 : 0;
    const weaknessBoost = s.wrong * 3 + Math.max(0, s.seen - s.correct) * 1.5;
    const masteryPenalty = Math.min(s.streak * 0.7, 2.5);
    return { item, weight: Math.max(1, 1 + dueBoost + weaknessBoost - masteryPenalty) };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function blankUserState() {
  return {
    started: false,
    activeTab: "learn",
    currentDrillId: getRandomDrillId(baseContent.typing),
    currentFlow: "smart",
    shuffledOptions: {},
    builderAnswer: [],
    score: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    xp: 0,
    hearts: 3,
    feedback: null,
    answeredIds: [],
    unlocked: [],
    mode: "all",
    dailyGoal: 10,
    completedToday: 0,
    wrongIds: [],
    comboMultiplier: 1,
    drillStats: {},
    reviewSchedule: {},
    phrasebook: [],
    phrasebookForm: { idn: "", eng: "", note: "", kind: "phrase" },
    muted: false,
    lastCorrectAnswer: "",
    lastLevel: 1,
    activeMissionId: "",
    missionProgress: {}
  };
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#06111f 0%,#0f172a 55%,#062a27 100%)", color: "#fff", fontFamily: "Inter, Arial, sans-serif", padding: "14px 14px 92px", boxSizing: "border-box" },
  wrap: { maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  card: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: 16, boxShadow: "0 18px 50px rgba(0,0,0,0.24)", backdropFilter: "blur(12px)" },
  hero: { background: "linear-gradient(135deg,rgba(16,185,129,.22),rgba(34,211,238,.12))", border: "1px solid rgba(134,239,172,.25)", borderRadius: 28, padding: 18 },
  title: { fontSize: 31, lineHeight: 1.05, margin: "8px 0", fontWeight: 900 },
  text: { color: "#b8c5d7", lineHeight: 1.5, margin: 0 },
  pill: { display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: 999, background: "rgba(16,185,129,.12)", color: "#9af3d4", border: "1px solid rgba(16,185,129,.28)", fontSize: 13, fontWeight: 800 },
  row: { display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
  stat: { background: "rgba(15,23,42,.72)", borderRadius: 18, padding: 12, textAlign: "center", border: "1px solid rgba(255,255,255,.07)" },
  button: { minHeight: 46, borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.055)", color: "#fff", padding: "0 14px", cursor: "pointer", fontWeight: 800 },
  primary: { minHeight: 52, borderRadius: 18, border: "none", background: "#10b981", color: "white", padding: "0 16px", cursor: "pointer", fontWeight: 900, fontSize: 16 },
  active: { background: "rgba(34,211,238,.18)", border: "1px solid rgba(103,232,249,.28)", color: "#d7fbff" },
  warn: { background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.22)", color: "#fde68a" },
  input: { width: "100%", minHeight: 52, background: "rgba(15,23,42,.82)", border: "1px solid rgba(255,255,255,.14)", color: "white", borderRadius: 18, padding: "0 16px", fontSize: 16, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: 86, background: "rgba(15,23,42,.82)", border: "1px solid rgba(255,255,255,.14)", color: "white", borderRadius: 18, padding: 14, fontSize: 16, outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.45 },
  progress: { width: "100%", height: 9, background: "rgba(255,255,255,.08)", borderRadius: 999, overflow: "hidden" },
  badge: { display: "inline-flex", alignItems: "center", padding: "6px 10px", borderRadius: 999, background: "rgba(34,211,238,.14)", color: "#c8fbff", border: "1px solid rgba(34,211,238,.22)", fontSize: 12, fontWeight: 800 },
  choice: { textAlign: "left", minHeight: 54, padding: "12px 14px", borderRadius: 18, border: "1px solid rgba(255,255,255,.10)", background: "rgba(15,23,42,.82)", color: "white", cursor: "pointer", fontWeight: 700, lineHeight: 1.35 },
  muted: { color: "#94a3b8" },
  sectionTitle: { fontSize: 18, fontWeight: 900, margin: 0 },
  good: { borderRadius: 18, padding: 14, border: "1px solid rgba(52,211,153,.24)", background: "rgba(16,185,129,.12)" },
  bad: { borderRadius: 18, padding: 14, border: "1px solid rgba(251,113,133,.24)", background: "rgba(244,63,94,.12)" },
  item: { borderRadius: 18, padding: 12, border: "1px solid rgba(255,255,255,.10)", background: "rgba(15,23,42,.68)" },
  bottomNav: { position: "fixed", left: 0, right: 0, bottom: 0, background: "rgba(2,6,23,.92)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255,255,255,.10)", padding: "8px 8px 12px", zIndex: 20 },
  navInner: { maxWidth: 520, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 },
  navBtn: { border: "none", borderRadius: 16, minHeight: 52, background: "transparent", color: "#94a3b8", fontWeight: 800, fontSize: 11, cursor: "pointer" },
  navActive: { background: "rgba(16,185,129,.16)", color: "#a7f3d0" },
  footer: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.45)", padding: "8px 0 18px" }
};

export default function App() {
  const [profiles, setProfiles] = useState({ Tony: blankUserState() });
  const [activeProfile, setActiveProfile] = useState("Tony");
  const [showProfileManager, setShowProfileManager] = useState(true);
  const [newProfileName, setNewProfileName] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installReady, setInstallReady] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [draftInput, setDraftInput] = useState("");
  const [draftPhrasebookForm, setDraftPhrasebookForm] = useState({ idn: "", eng: "", note: "", kind: "phrase" });
  const recognitionRef = useRef(null);

  const currentUser = profiles[activeProfile] || blankUserState();
  const phrasebookContent = useMemo(() => createPhrasebookDrills(currentUser.phrasebook || []), [currentUser.phrasebook]);
  const combined = useMemo(() => ({
    typing: [...baseContent.typing, ...phrasebookContent.typing],
    choice: baseContent.choice,
    listening: [...baseContent.listening, ...phrasebookContent.listening],
    words: baseContent.words,
    builder: [...baseContent.builder, ...phrasebookContent.builder],
    conversation: baseContent.conversation,
    phrasebook: phrasebookContent.all
  }), [phrasebookContent]);

  const updateUser = (patch) => setProfiles((prev) => ({ ...prev, [activeProfile]: { ...blankUserState(), ...(prev[activeProfile] || {}), ...patch } }));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.profiles) setProfiles(data.profiles);
      if (data.activeProfile) setActiveProfile(data.activeProfile);
      if (typeof data.showProfileManager === "boolean") setShowProfileManager(data.showProfileManager);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeProfile, showProfileManager })); }, [profiles, activeProfile, showProfileManager]);
  useEffect(() => { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; setVoiceSupported(Boolean(SR)); }, []);
  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {}); }, []);
  useEffect(() => {
    const promptHandler = (event) => { event.preventDefault(); setDeferredPrompt(event); setInstallReady(true); };
    const installedHandler = () => { setIsInstalled(true); setInstallReady(false); setDeferredPrompt(null); };
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    window.addEventListener("beforeinstallprompt", promptHandler);
    window.addEventListener("appinstalled", installedHandler);
    return () => { window.removeEventListener("beforeinstallprompt", promptHandler); window.removeEventListener("appinstalled", installedHandler); };
  }, []);

  useEffect(() => {
    setDraftInput("");
  }, [currentUser.currentDrillId, activeProfile]);

  useEffect(() => {
    setDraftPhrasebookForm(currentUser.phrasebookForm || { idn: "", eng: "", note: "", kind: "phrase" });
  }, [activeProfile, currentUser.activeTab]);

  const dueItems = useMemo(() => {
    const today = todayKey();
    return combined.typing.filter((d) => currentUser.reviewSchedule?.[d.id]?.nextReview <= today);
  }, [combined.typing, currentUser.reviewSchedule]);

  const weakItems = useMemo(() => combined.typing.filter((d) => currentUser.wrongIds.includes(d.id)), [combined.typing, currentUser.wrongIds]);
  const activeMission = missions.find((m) => m.id === currentUser.activeMissionId);

  const smartPool = useMemo(() => {
    if (dueItems.length) return dueItems;
    if (weakItems.length >= 3) return weakItems;
    const mix = [...combined.builder.slice(0, 20), ...combined.typing.slice(0, 40), ...combined.listening.slice(0, 20)];
    return mix.length ? mix : combined.typing;
  }, [dueItems, weakItems, combined]);

  const pool = useMemo(() => {
    if (currentUser.currentFlow === "smart") return smartPool;
    if (currentUser.currentFlow === "review") return dueItems;
    if (currentUser.currentFlow === "weak") return weakItems;
    if (currentUser.currentFlow === "choice") return combined.choice;
    if (currentUser.currentFlow === "listening") return combined.listening;
    if (currentUser.currentFlow === "words") return combined.words;
    if (currentUser.currentFlow === "builder") return combined.builder;
    if (currentUser.currentFlow === "conversation") return combined.conversation;
    if (currentUser.currentFlow === "phrasebook") return combined.phrasebook;
    if (currentUser.currentFlow === "mission" && activeMission) return combined.typing.filter((d) => d.topicId === activeMission.topicId);
    let filtered = combined.typing;
    if (currentUser.mode === "phrasebook") filtered = combined.phrasebook.filter((d) => d.type === "typing");
    if (currentUser.mode !== "all" && currentUser.mode !== "phrasebook") filtered = filtered.filter((d) => d.topicId === currentUser.mode);
    return filtered.length ? filtered : combined.typing;
  }, [currentUser.currentFlow, currentUser.mode, smartPool, dueItems, weakItems, combined, activeMission]);

  const current = useMemo(() => pool.find((d) => d.id === currentUser.currentDrillId) || pool[0] || combined.typing[0], [pool, currentUser.currentDrillId, combined.typing]);
  const currentOptions = useMemo(() => {
    const key = `${currentUser.currentFlow}-${current?.id}`;
    const saved = currentUser.shuffledOptions?.[key];
    if (saved && saved.length) return saved;
    return shuffleArray(current?.options || []);
  }, [current, currentUser.currentFlow, currentUser.shuffledOptions]);

  useEffect(() => {
    if (!current || current.type === "builder") return;
    const key = `${currentUser.currentFlow}-${current.id}`;
    if (!currentUser.shuffledOptions?.[key] && current.options) updateUser({ shuffledOptions: { ...(currentUser.shuffledOptions || {}), [key]: shuffleArray(current.options || []) } });
  }, [current?.id, currentUser.currentFlow]);

  const levelData = getLevelData(currentUser.score);
  const xpProgress = Math.min(100, (currentUser.score / levelData.next) * 100);

  const playSound = (type) => {
    if (currentUser.muted) return;
    try { const audio = new Audio(`/sounds/${type}.mp3`); audio.volume = 0.45; audio.play().catch(() => {}); } catch (e) {}
  };

  const buttonStyle = (active, warn) => ({ ...styles.button, ...(active ? styles.active : {}), ...(warn ? styles.warn : {}) });
  const progressFill = (value) => ({ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: "linear-gradient(90deg,#34d399 0%,#10b981 100%)" });

  const setFlow = (flow, explicitPool) => {
    const nextPool = explicitPool || ({ smart: smartPool, review: dueItems, weak: weakItems, choice: combined.choice, listening: combined.listening, words: combined.words, builder: combined.builder, conversation: combined.conversation, phrasebook: combined.phrasebook }[flow] || combined.typing);
    if (["review", "weak", "phrasebook"].includes(flow) && !nextPool.length) {
      const msg = flow === "review" ? ["No reviews due", "Come back after you have practised more phrases."] : flow === "weak" ? ["No weak phrases", "Mistakes will appear here for focused practice."] : ["Add phrases first", "My Training uses only your manually added words and phrases."];
      updateUser({ activeTab: flow === "phrasebook" ? "phrasebook" : "learn", feedback: { ok: false, text: msg[0], explanation: msg[1] } });
      return;
    }
    updateUser({ currentFlow: flow, activeTab: "train", currentDrillId: getRandomDrillId(nextPool), shuffledOptions: {}, builderAnswer: [], feedback: null, lastCorrectAnswer: "" });
    setDraftInput("");
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const updateDrillStats = (drillId, ok) => {
    const previousStats = currentUser.drillStats || {};
    const existing = previousStats[drillId] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    const currentSchedule = currentUser.reviewSchedule?.[drillId] || { interval: 0, nextReview: todayKey() };
    const nextInterval = ok ? Math.min(Math.max(1, currentSchedule.interval || 0) * 2, 30) : 1;
    const nextReview = ok ? addDays(nextInterval) : addDays(1);
    return {
      drillStats: { ...previousStats, [drillId]: { seen: existing.seen + 1, correct: existing.correct + (ok ? 1 : 0), wrong: existing.wrong + (ok ? 0 : 1), streak: ok ? existing.streak + 1 : 0 } },
      reviewSchedule: { ...(currentUser.reviewSchedule || {}), [drillId]: { interval: nextInterval, nextReview, lastResult: ok ? "correct" : "wrong" } }
    };
  };

  const nextDrill = () => {
    const onlyDue = currentUser.currentFlow === "review";
    const next = chooseAdaptiveDrill(pool, currentUser.drillStats || {}, current?.id, currentUser.reviewSchedule || {}, onlyDue);
    updateUser({ currentDrillId: next ? next.id : getRandomDrillId(pool), shuffledOptions: {}, builderAnswer: [], feedback: null, lastCorrectAnswer: "" });
    setDraftInput("");
  };

  const submitAnswer = (submitted) => {
    if (!current) return;
    const ok = isAnswerCorrect(submitted, current.answers);
    const isPhrasebook = current.topicId === "phrasebook";
    const statsPatch = updateDrillStats(current.id, ok);
    if (ok) {
      playSound("correct");
      const newStreak = currentUser.streak + 1;
      const gained = Math.round((10 + Math.min(newStreak * 2, 20)) * currentUser.comboMultiplier);
      const coinsGained = Math.max(1, Math.round(gained / 5));
      if (currentUser.completedToday + 1 === currentUser.dailyGoal) playSound("daily-goal");
      const activeProgress = activeMission && currentUser.currentFlow === "mission" ? currentUser.missionProgress?.[activeMission.id] || { count: 0, completed: false } : null;
      const missionPatch = activeProgress ? { missionProgress: { ...(currentUser.missionProgress || {}), [activeMission.id]: { count: activeProgress.count + 1, completed: activeProgress.count + 1 >= activeMission.goal } } } : {};
      updateUser({ ...statsPatch, ...missionPatch, score: currentUser.score + gained, coins: currentUser.coins + coinsGained, xp: currentUser.xp + 25, streak: newStreak, bestStreak: Math.max(currentUser.bestStreak, newStreak), completedToday: currentUser.completedToday + 1, answeredIds: [...currentUser.answeredIds, current.id], wrongIds: currentUser.wrongIds.filter((id) => id !== current.id), feedback: { ok: true, text: `Correct · +${gained} XP · +${coinsGained} coins`, explanation: current.explanation }, builderAnswer: [], lastCorrectAnswer: current.answers[0] });
      setDraftInput("");
      setTimeout(nextDrill, 2200);
    } else {
      playSound("wrong");
      updateUser({ ...statsPatch, hearts: isPhrasebook ? currentUser.hearts : Math.max(currentUser.hearts - 1, 0), streak: 0, wrongIds: currentUser.wrongIds.includes(current.id) ? currentUser.wrongIds : [...currentUser.wrongIds, current.id], feedback: { ok: false, text: "Not quite", explanation: `Correct: ${current.answers[0]}` }, lastCorrectAnswer: current.answers[0] });
    }
  };

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return updateUser({ feedback: { ok: false, text: "Voice input unavailable", explanation: "Please type your answer manually." } });
    if (recognitionRef.current) recognitionRef.current.stop();
    const rec = new SR();
    rec.lang = "id-ID"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (event) => setDraftInput(event.results?.[0]?.[0]?.transcript || "");
    rec.onerror = () => updateUser({ feedback: { ok: false, text: "Voice input unavailable", explanation: "Try Chrome with microphone permission, or type manually." } });
    recognitionRef.current = rec; rec.start();
  };

  const addPhrasebookItem = () => {
    const f = draftPhrasebookForm || {};
    const idn = (f.idn || "").trim();
    const eng = (f.eng || "").trim();
    if (!idn || !eng) return updateUser({ feedback: { ok: false, text: "Missing phrase or meaning", explanation: "Add both Bahasa Indonesia and English." } });
    const item = { id: Date.now(), idn, eng, note: (f.note || "").trim(), kind: f.kind || "phrase", createdAt: new Date().toISOString() };
    playSound("correct");
    updateUser({ phrasebook: [item, ...(currentUser.phrasebook || [])], phrasebookForm: { idn: "", eng: "", note: "", kind: "phrase" }, feedback: { ok: true, text: "Added to training", explanation: "It now appears in your personalised training." } });
    setDraftPhrasebookForm({ idn: "", eng: "", note: "", kind: "phrase" });
  };

  const removePhrasebookItem = (id) => updateUser({ phrasebook: (currentUser.phrasebook || []).filter((item) => item.id !== id) });

  const installApp = async () => {
    if (!deferredPrompt) return updateUser({ feedback: { ok: false, text: "Install prompt not ready", explanation: "Use Chrome menu → Add to Home screen." } });
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null); setInstallReady(false);
    if (choice?.outcome === "accepted") setIsInstalled(true);
  };

  const createProfile = () => {
    const clean = newProfileName.trim();
    if (!clean) return;
    setProfiles((prev) => ({ ...prev, [clean]: prev[clean] || blankUserState() }));
    setActiveProfile(clean); setNewProfileName(""); setShowProfileManager(false);
  };

  const resetProfile = () => { setProfiles((prev) => ({ ...prev, [activeProfile]: blankUserState() })); setShowProfileManager(true); };
  const footer = <div style={styles.footer}>Created by Tony Charmley · {APP_VERSION_LABEL}</div>;

  const feedbackBlock = currentUser.feedback ? <div style={{ marginTop: 14, ...(currentUser.feedback.ok ? styles.good : styles.bad) }}><div style={{ fontWeight: 900 }}>{currentUser.feedback.text}</div><div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{currentUser.feedback.explanation}</div></div> : null;

  const TrainingCard = () => {
    if (!current) return <div style={styles.card}>No drill available.</div>;
    const isTyping = ["typing", "smart", "review", "weak", "mission"].includes(currentUser.currentFlow) && current.type === "typing";
    const isBuilder = current.type === "builder";
    const audioText = current.type === "listening" || current.type === "word" ? current.prompt : current.type === "conversation" ? current.theySay : current.answers?.[0];
    return <div style={styles.card}><div style={styles.row}><div style={styles.badge}>{current.category}</div><div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1" }}>{current.instruction}</div></div><div style={{ marginTop: 18, ...styles.muted, fontSize: 13 }}>{current.scenario}</div>{current.type === "conversation" ? <div style={{ ...styles.item, marginTop: 12 }}><div style={styles.muted}>They say:</div><div style={{ fontSize: 22, fontWeight: 900, marginTop: 5 }}>{current.theySay}</div><div style={{ marginTop: 8, color: "#cbd5e1" }}>{current.tip}</div></div> : <h2 style={{ fontSize: 25, lineHeight: 1.18, margin: "10px 0 16px", fontWeight: 900 }}>{current.prompt}</h2>}{isTyping ? <><div style={{ ...styles.muted, marginBottom: 10 }}>Type your answer in Bahasa Indonesia.</div><div style={{ display: "flex", gap: 8 }}><input style={styles.input} value={draftInput} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitAnswer(draftInput)} placeholder="Type Bahasa Indonesia" /><button style={{ ...styles.button, width: 52, padding: 0 }} onClick={() => speak(current.answers?.[0])}>🔊</button>{voiceSupported ? <button style={{ ...styles.button, width: 52, padding: 0 }} onClick={startVoiceInput}>🎤</button> : null}</div><button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer(draftInput)}>Check</button></> : isBuilder ? <><div style={{ ...styles.item, minHeight: 58, marginBottom: 10 }}>{(currentUser.builderAnswer || []).length ? currentUser.builderAnswer.map((word, idx) => <button key={`${word}-${idx}`} style={{ ...styles.button, margin: 4 }} onClick={() => updateUser({ builderAnswer: currentUser.builderAnswer.filter((_, i) => i !== idx) })}>{word}</button>) : <div style={styles.muted}>Tap words below to build the sentence.</div>}</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(current.tiles || []).map((word, idx) => <button key={`${word}-${idx}`} style={styles.button} onClick={() => updateUser({ builderAnswer: [...(currentUser.builderAnswer || []), word] })}>{word}</button>)}</div><button style={{ ...styles.primary, width: "100%", marginTop: 12 }} onClick={() => submitAnswer((currentUser.builderAnswer || []).join(" "))}>Check Sentence</button><button style={{ ...styles.button, width: "100%", marginTop: 8 }} onClick={() => updateUser({ builderAnswer: [] })}>Clear</button></> : <div style={{ display: "grid", gap: 8 }}>{currentOptions.map((option) => <button key={option} style={styles.choice} onClick={() => submitAnswer(option)}>{option}</button>)}<button style={styles.button} onClick={() => speak(audioText)}>🔊 Play Bahasa</button></div>}<div style={{ ...styles.muted, marginTop: 12 }}>Tip: {current.tip}</div>{currentUser.lastCorrectAnswer ? <button style={{ ...styles.button, width: "100%", marginTop: 10 }} onClick={() => speak(currentUser.lastCorrectAnswer)}>🔊 Play Correct Answer</button> : null}{feedbackBlock}{current.breakdown?.length ? <details style={{ marginTop: 12 }}><summary style={{ cursor: "pointer", color: "#86efac", fontWeight: 800 }}>Phrase Breakdown</summary><div style={{ display: "grid", gap: 6, marginTop: 10 }}>{current.breakdown.map(([p, m]) => <div key={`${p}-${m}`} style={{ color: "#cbd5e1" }}><strong style={{ color: "#86efac" }}>{p}</strong> = {m}</div>)}</div></details> : null}</div>;
  };

  const BottomNav = () => <div style={styles.bottomNav}><div style={styles.navInner}>{[["learn", "🏠", "Learn"], ["review", "🔁", "Review"], ["speak", "💬", "Speak"], ["phrasebook", "⭐", "Phrases"], ["profile", "👤", "Profile"]].map(([tab, icon, label]) => <button key={tab} style={{ ...styles.navBtn, ...(currentUser.activeTab === tab ? styles.navActive : {}) }} onClick={() => updateUser({ activeTab: tab })}><div style={{ fontSize: 20 }}>{icon}</div>{label}</button>)}</div></div>;

  const Home = () => <><div style={styles.hero}><div style={styles.pill}>Continue Learning</div><h1 style={styles.title}>{dueItems.length ? `${dueItems.length} reviews due` : weakItems.length ? "Strengthen weak phrases" : "Ready for today?"}</h1><p style={styles.text}>Fast path: review, build sentences, then complete one Bali mission.</p><button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => setFlow("smart")}>Continue</button></div><div style={styles.grid3}><div style={styles.stat}><div>🔥</div><strong>{currentUser.streak}</strong><div style={styles.muted}>Streak</div></div><div style={styles.stat}><div>🔁</div><strong>{dueItems.length}</strong><div style={styles.muted}>Due</div></div><div style={styles.stat}><div>🪙</div><strong>{currentUser.coins}</strong><div style={styles.muted}>Coins</div></div></div><div style={styles.card}><h3 style={styles.sectionTitle}>Quick Practice</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 12 }}><button style={styles.button} onClick={() => setFlow("builder")}>🧩 Sentence Builder</button><button style={styles.button} onClick={() => setFlow("listening")}>🎧 Listening</button><button style={styles.button} onClick={() => setFlow("review")}>🔁 Due Review</button><button style={styles.button} onClick={() => setFlow("weak")}>🎯 Weak Phrases</button></div></div></>;

  const Review = () => <><div style={styles.card}><h2 style={styles.sectionTitle}>Review</h2><p style={styles.text}>Spaced repetition keeps important phrases coming back at the right time.</p><div style={{ display: "grid", gap: 8, marginTop: 12 }}><button style={styles.primary} onClick={() => setFlow("review")}>Review Due Items ({dueItems.length})</button><button style={styles.button} onClick={() => setFlow("weak")}>Practise Weak Phrases ({weakItems.length})</button><button style={styles.button} onClick={() => setFlow("words")}>Core Words</button></div></div><div style={styles.card}><h3 style={styles.sectionTitle}>Topic Filter</h3><div style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 12 }}>{topicList.map((topic) => <button key={topic.id} style={{ ...styles.button, whiteSpace: "nowrap", ...(currentUser.mode === topic.id ? styles.active : {}) }} onClick={() => updateUser({ mode: topic.id })}>{topic.label}</button>)}</div></div></>;

  const Speak = () => <><div style={styles.card}><h2 style={styles.sectionTitle}>Real Bali Missions</h2><p style={styles.text}>Practise real situations, not random words.</p><div style={{ display: "grid", gap: 8, marginTop: 12 }}>{missions.map((m) => { const p = currentUser.missionProgress?.[m.id] || { count: 0, completed: false }; return <div key={m.id} style={styles.item}><div style={styles.row}><div><strong>{m.label}</strong><div style={{ ...styles.muted, fontSize: 13, marginTop: 3 }}>{m.description}</div><div style={{ ...styles.muted, fontSize: 13, marginTop: 5 }}>{Math.min(p.count, m.goal)}/{m.goal} complete {p.completed ? "✅" : ""}</div></div><button style={styles.primary} onClick={() => { const missionPool = combined.typing.filter((d) => d.topicId === m.topicId); updateUser({ activeMissionId: m.id, currentFlow: "mission", activeTab: "train", currentDrillId: getRandomDrillId(missionPool), feedback: null }); setDraftInput(""); }}>Start</button></div></div>; })}</div></div><div style={styles.card}><button style={{ ...styles.button, width: "100%" }} onClick={() => setFlow("conversation")}>💬 Conversation Replies</button></div></>;

  const Phrasebook = () => <><div style={styles.card}><h2 style={styles.sectionTitle}>My Phrasebook</h2><p style={styles.text}>Add phrases from real life and train them immediately.</p><div style={{ display: "grid", gap: 10, marginTop: 14 }}><input style={styles.input} value={draftPhrasebookForm.idn || ""} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrasebookForm({ ...draftPhrasebookForm, idn: e.target.value })} placeholder="Bahasa: Bisa datang sekarang?" /><input style={styles.input} value={draftPhrasebookForm.eng || ""} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrasebookForm({ ...draftPhrasebookForm, eng: e.target.value })} placeholder="English: Can you come now?" /><textarea style={styles.textarea} value={draftPhrasebookForm.note || ""} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setDraftPhrasebookForm({ ...draftPhrasebookForm, note: e.target.value })} placeholder="Note or context" /><button style={styles.primary} onClick={addPhrasebookItem}>Add to Training</button><button style={styles.button} onClick={() => setFlow("phrasebook")}>Train My Phrases</button></div>{feedbackBlock}</div><div style={styles.card}><h3 style={styles.sectionTitle}>Saved</h3><div style={{ display: "grid", gap: 8, marginTop: 12 }}>{(currentUser.phrasebook || []).length ? currentUser.phrasebook.map((item) => <div key={item.id} style={styles.item}><strong style={{ color: "#86efac" }}>{item.idn}</strong><div style={{ marginTop: 4 }}>{item.eng}</div>{item.note ? <div style={{ ...styles.muted, marginTop: 5 }}>{item.note}</div> : null}<div style={{ display: "flex", gap: 8, marginTop: 10 }}><button style={styles.button} onClick={() => speak(item.idn)}>🔊</button><button style={styles.button} onClick={() => removePhrasebookItem(item.id)}>Delete</button></div></div>) : <div style={styles.muted}>No saved phrases yet.</div>}</div></div></>;

  const Profile = () => <><div style={styles.card}><h2 style={styles.sectionTitle}>{activeProfile}</h2><div style={styles.grid3}><div style={styles.stat}><strong>{levelData.level}</strong><div style={styles.muted}>Level</div></div><div style={styles.stat}><strong>{currentUser.score}</strong><div style={styles.muted}>XP</div></div><div style={styles.stat}><strong>{currentUser.bestStreak}</strong><div style={styles.muted}>Best</div></div></div><div style={{ marginTop: 14, ...styles.progress }}><div style={progressFill(xpProgress)} /></div><div style={{ display: "grid", gap: 8, marginTop: 14 }}><button style={styles.button} onClick={() => setShowProfileManager(true)}>Switch Profile</button><button style={styles.button} onClick={installApp}>{isInstalled ? "Installed" : installReady ? "Install App" : "Add to Home Screen"}</button><button style={styles.button} onClick={() => updateUser({ muted: !currentUser.muted })}>{currentUser.muted ? "Unmute Sounds" : "Mute Sounds"}</button><button style={{ ...styles.button, ...styles.warn }} onClick={resetProfile}>Reset Profile</button></div></div><div style={styles.card}><h3 style={styles.sectionTitle}>Fastest Daily Plan</h3><p style={styles.text}>1. Continue. 2. Sentence Builder. 3. One Mission. 4. Add any real phrase you heard today.</p></div></>;

  if (showProfileManager) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Bali Bahasa</div><h1 style={styles.title}>Choose learner</h1><p style={styles.text}>Each profile keeps separate progress and phrasebook items.</p></div><div style={styles.card}><div style={{ display: "grid", gap: 10 }}>{Object.keys(profiles).map((name) => <button key={name} style={styles.choice} onClick={() => { setActiveProfile(name); setShowProfileManager(false); }}>{name}<div style={{ ...styles.muted, marginTop: 4 }}>Level {getLevelData((profiles[name] || {}).score || 0).level} · {(profiles[name] || {}).score || 0} XP</div></button>)}</div><div style={{ display: "flex", gap: 8, marginTop: 14 }}><input style={styles.input} value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New profile" /><button style={styles.primary} onClick={createProfile}>Add</button></div></div>{footer}</div></div>;

  if (!currentUser.started) return <div style={styles.page}><div style={styles.wrap}><div style={styles.hero}><div style={styles.pill}>Conversation-first</div><h1 style={styles.title}>Speak useful Bahasa faster</h1><p style={styles.text}>Guided practice for Bali: review, sentence building, real missions, and your own phrasebook.</p><button style={{ ...styles.primary, width: "100%", marginTop: 16 }} onClick={() => updateUser({ started: true })}>Start</button></div>{footer}</div></div>;

  const screen = currentUser.activeTab === "train" ? <TrainingCard /> : currentUser.activeTab === "review" ? <Review /> : currentUser.activeTab === "speak" ? <Speak /> : currentUser.activeTab === "phrasebook" ? <Phrasebook /> : currentUser.activeTab === "profile" ? <Profile /> : <Home />;

  const BottomNav = () => <div style={styles.bottomNav}><div style={styles.navInner}>{[["learn", "🏠", "Learn"], ["review", "🔁", "Review"], ["speak", "💬", "Speak"], ["phrasebook", "⭐", "Phrases"], ["profile", "👤", "Profile"]].map(([tab, icon, label]) => <button key={tab} style={{ ...styles.navBtn, ...(currentUser.activeTab === tab ? styles.navActive : {}) }} onClick={() => updateUser({ activeTab: tab })}><div style={{ fontSize: 20 }}>{icon}</div>{label}</button>)}</div></div>;

  return <div style={styles.page}><div style={styles.wrap}>{screen}{footer}</div><BottomNav /></div>;
}
