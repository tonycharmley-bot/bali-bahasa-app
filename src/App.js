import baliBahasaDataset from "./dataset";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

const APP_VERSION = "1.2.0";
const APP_VERSION_LABEL = "Version 1.2 — Photo Scan Mode";
const STORAGE_KEY = "bali-bahasa-profiles-v5";

const drills = [
  {
    id: 1,
    type: "translate",
    category: "Warung",
    scenario: "At a warung in Sanur",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Where do you want to eat?",
    answers: ["mau makan di mana"],
    options: ["mau makan di mana", "dari mana mau makan", "makan dari mana", "di mana kamu makan"],
    tip: "Use mau + verb + di mana.",
    explanation: "Natural Indonesian: Mau makan di mana? Mau means want, makan means eat, and di mana means where.",
    breakdown: [["mau", "want"], ["makan", "eat"], ["di mana", "where"]]
  },
  {
    id: 2,
    type: "translate",
    category: "Daily",
    scenario: "Replying to a local message",
    direction: "Translate into Bahasa Indonesia",
    prompt: "I do not know, maybe later.",
    answers: ["tidak tahu mungkin nanti", "nggak tahu mungkin nanti", "saya tidak tahu mungkin nanti"],
    options: ["nggak tahu mungkin nanti", "mungkin saya tidak tahu nanti", "saya mungkin tahu nanti", "nanti saya tidak mungkin"],
    tip: "Maybe later = mungkin nanti.",
    explanation: "Natural version: Nggak tahu, mungkin nanti. Nggak tahu means do not know. Mungkin nanti means maybe later.",
    breakdown: [["nggak tahu", "do not know"], ["mungkin", "maybe"], ["nanti", "later"]]
  },
  {
    id: 3,
    type: "translate",
    category: "Shopping",
    scenario: "At a market stall",
    direction: "Translate into Bahasa Indonesia",
    prompt: "How much is this?",
    answers: ["ini berapa", "berapa harganya"],
    options: ["ini berapa", "berapa ini harga", "ini harga mana", "berapa kamu"],
    tip: "Ini berapa? is very common in Bali.",
    explanation: "Fast everyday version: Ini berapa? Ini means this. Berapa means how much.",
    breakdown: [["ini", "this"], ["berapa", "how much"]]
  },
  {
    id: 4,
    type: "translate",
    category: "Help",
    scenario: "Asking someone for assistance",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Can you help me?",
    answers: ["bisa bantu saya", "bisa bantu"],
    options: ["bisa bantu saya", "kamu bantu saya", "saya bantu kamu", "bantu saya bisa kamu"],
    tip: "Bisa bantu? is natural and short.",
    explanation: "Natural version: Bisa bantu saya? Bisa means can. Bantu means help.",
    breakdown: [["bisa", "can"], ["bantu", "help"], ["saya", "me / I"]]
  },
  {
    id: 5,
    type: "translate",
    category: "Warung",
    scenario: "Ordering food",
    direction: "Translate into Bahasa Indonesia",
    prompt: "I want to order food.",
    answers: ["saya mau pesan makanan", "mau pesan makanan"],
    options: ["saya mau pesan makanan", "makanan saya mau", "pesan saya makanan mau", "mau saya makanan"],
    tip: "Mau pesan... is a core pattern.",
    explanation: "Natural version: Saya mau pesan makanan. Pesan means order. Makanan means food.",
    breakdown: [["saya", "I"], ["mau", "want"], ["pesan", "order"], ["makanan", "food"]]
  },
  {
    id: 6,
    type: "translate",
    category: "Warung",
    scenario: "Asking what is good on the menu",
    direction: "Translate into Bahasa Indonesia",
    prompt: "What do you recommend?",
    answers: ["yang enak apa", "apa yang kamu sarankan", "apa yang anda sarankan"],
    options: ["yang enak apa", "apa enak yang", "sarankan saya apa", "apa kamu enak"],
    tip: "Yang enak apa? is simple and natural.",
    explanation: "Very natural Bali version: Yang enak apa? Literally: what is tasty or good?",
    breakdown: [["yang", "the one / which"], ["enak", "tasty / good"], ["apa", "what"]]
  },
  {
    id: 7,
    type: "translate",
    category: "Transport",
    scenario: "Talking to a driver",
    direction: "Translate into Bahasa Indonesia",
    prompt: "I live in Sanur now.",
    answers: ["sekarang saya tinggal di sanur", "saya tinggal di sanur sekarang"],
    options: ["sekarang saya tinggal di sanur", "saya tinggal sekarang sanur", "sanur tinggal saya sekarang", "saya sekarang dari sanur"],
    tip: "Sekarang can go at the start or end.",
    explanation: "Natural version: Sekarang saya tinggal di Sanur. Tinggal means live or stay.",
    breakdown: [["sekarang", "now"], ["saya", "I"], ["tinggal", "live / stay"], ["di Sanur", "in Sanur"]]
  },
  {
    id: 8,
    type: "translate",
    category: "Daily",
    scenario: "Replying politely",
    direction: "Translate into Bahasa Indonesia",
    prompt: "I am a bit busy right now.",
    answers: ["sekarang lagi sibuk sedikit", "saya lagi sibuk sedikit sekarang", "sekarang saya lagi sibuk sedikit"],
    options: ["sekarang lagi sibuk sedikit", "sibuk saya sedikit sekarang", "saya sekarang sibuk mana", "lagi sedikit saya sekarang"],
    tip: "Lagi = currently doing or being.",
    explanation: "Natural version: Sekarang lagi sibuk sedikit. Lagi sibuk means currently busy.",
    breakdown: [["sekarang", "now"], ["lagi", "currently"], ["sibuk", "busy"], ["sedikit", "a little"]]
  },
  {
    id: 9,
    type: "translate",
    category: "Villa",
    scenario: "Speaking to guests or staff",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Please wait a moment.",
    answers: ["sebentar ya", "tolong tunggu sebentar", "tunggu sebentar"],
    options: ["sebentar ya", "tunggu ya mana", "tolong sedikit tunggu mana", "sebentar kamu"],
    tip: "Sebentar ya is friendly and common.",
    explanation: "Friendly version: Sebentar ya. Sebentar means a moment.",
    breakdown: [["sebentar", "a moment"], ["ya", "softener / okay"]]
  },
  {
    id: 10,
    type: "translate",
    category: "Warung",
    scenario: "Pointing at something on a menu",
    direction: "Translate into Bahasa Indonesia",
    prompt: "This one, please.",
    answers: ["yang ini ya", "ini ya", "yang ini tolong"],
    options: ["yang ini ya", "ini yang mana", "yang tolong ini", "ini kamu ya"],
    tip: "Yang ini ya is very usable in Bali.",
    explanation: "Natural version: Yang ini ya. Yang ini means this one.",
    breakdown: [["yang ini", "this one"], ["ya", "softener / okay"]]
  },
  {
    id: 11,
    type: "conversation",
    category: "Small Talk",
    scenario: "A local asks a casual question",
    direction: "Choose the best reply",
    prompt: "Sudah makan?",
    answers: ["sudah terima kasih", "belum nanti", "belum makan"],
    options: ["Sudah, terima kasih", "Saya dari Australia", "Mau pesan makanan", "Ini berapa"],
    tip: "Choose a natural short reply.",
    explanation: "Common replies: Sudah, terima kasih. Belum, nanti. Sudah makan? literally means have you eaten yet?",
    breakdown: [["sudah", "already"], ["makan", "eat"], ["belum", "not yet"]]
  },
  {
    id: 12,
    type: "conversation",
    category: "Small Talk",
    scenario: "Meeting someone new",
    direction: "Choose the best reply",
    prompt: "Kamu dari mana?",
    answers: ["saya dari australia", "dari australia"],
    options: ["Saya dari Australia", "Saya tinggal di warung", "Ini berapa", "Nanti saja"],
    tip: "Saya dari Australia is safe and natural.",
    explanation: "Natural version: Saya dari Australia. Dari mana? means where are you from?",
    breakdown: [["kamu", "you"], ["dari mana", "from where"], ["saya dari", "I am from"]]
  },
  {
    id: 13,
    type: "translate",
    category: "Villa",
    scenario: "Giving a house instruction",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Please turn off the air conditioner when you go out.",
    answers: ["tolong matikan ac kalau keluar", "kalau keluar tolong matikan ac"],
    options: ["tolong matikan ac kalau keluar", "keluar ac tolong mati", "tolong ac keluar mati", "matikan keluar saya"],
    tip: "Kalau = if or when.",
    explanation: "Natural version: Tolong matikan AC kalau keluar. Matikan means turn off.",
    breakdown: [["tolong", "please"], ["matikan", "turn off"], ["AC", "air conditioner"], ["kalau keluar", "when going out"]]
  },
  {
    id: 14,
    type: "translate",
    category: "Driver",
    scenario: "Arranging transport",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Can you pick us up at 7 tonight?",
    answers: ["bisa jemput kami jam 7 malam ini", "bisa jemput kita jam 7 malam ini"],
    options: ["bisa jemput kami jam 7 malam ini", "jemput bisa malam kami", "jam 7 bisa kamu kami", "malam ini kamu dari mana"],
    tip: "Jam 7 malam ini = at 7 tonight.",
    explanation: "Natural version: Bisa jemput kami jam 7 malam ini? Jemput means pick up.",
    breakdown: [["bisa", "can"], ["jemput", "pick up"], ["kami / kita", "us"], ["jam 7 malam ini", "7 tonight"]]
  },
  {
    id: 15,
    type: "translate",
    category: "Staff",
    scenario: "Checking on guests",
    direction: "Translate into Bahasa Indonesia",
    prompt: "Have the guests arrived yet?",
    answers: ["tamunya sudah datang belum", "sudah datang belum tamunya"],
    options: ["tamunya sudah datang belum", "tamu datang dari mana", "sudah tamu di mana", "belum mana datang"],
    tip: "Sudah ... belum is a useful pattern.",
    explanation: "Natural version: Tamunya sudah datang belum? This pattern means has X happened yet?",
    breakdown: [["tamunya", "the guests"], ["sudah", "already"], ["datang", "arrive / come"], ["belum", "not yet / yet"]]
  },
  {
    id: 16,
    type: "listening",
    category: "Listening",
    scenario: "Message from a local contact",
    direction: "Choose the correct meaning",
    prompt: "Nanti saya kirim pesan ya, sekarang lagi sibuk sedikit.",
    answers: ["i will message later i am a bit busy right now", "ill message later im a bit busy right now"],
    options: ["I will message later, I am a bit busy right now", "Where do you want to eat?", "How much is this?", "I am from Australia"],
    tip: "Listen and choose the correct meaning.",
    explanation: "Meaning: I will message later, I am a bit busy right now.",
    breakdown: [["nanti", "later"], ["saya kirim pesan", "I send a message"], ["lagi sibuk", "currently busy"], ["sedikit", "a little"]]
  },
  {
    id: 17,
    type: "listening",
    category: "Listening",
    scenario: "A polite everyday instruction",
    direction: "Choose the correct meaning",
    prompt: "Tolong tunggu sebentar ya.",
    answers: ["please wait a moment"],
    options: ["Please wait a moment", "Can you help me?", "Where are you from?", "This one please"],
    tip: "Sebentar = a moment.",
    explanation: "Meaning: Please wait a moment.",
    breakdown: [["tolong", "please"], ["tunggu", "wait"], ["sebentar", "a moment"], ["ya", "softener / okay"]]
  },
  {
    id: 18,
    type: "listening",
    category: "Listening",
    scenario: "At a restaurant or café",
    direction: "Choose the correct meaning",
    prompt: "Yang enak apa di sini?",
    answers: ["what is good here", "what do you recommend here"],
    options: ["What is good here?", "How much is this?", "I live in Sanur now", "We will go later"],
    tip: "Enak = tasty or good.",
    explanation: "Meaning: What is good here?",
    breakdown: [["yang enak", "the tasty/good one"], ["apa", "what"], ["di sini", "here"]]
  }
];

const conversationDrills = [
  {
    id: "c1",
    category: "Warung",
    scenario: "Ordering food at a warung",
    theySay: "Mau pesan apa?",
    prompt: "Choose a natural reply.",
    answers: ["saya mau pesan nasi goreng"],
    options: ["Saya mau pesan nasi goreng", "Saya dari Australia", "Jam 7 malam ini", "Tolong matikan AC"],
    explanation: "They ask what you want to order. A natural reply is: Saya mau pesan nasi goreng.",
    breakdown: [["mau pesan apa", "what do you want to order"], ["saya mau pesan", "I want to order"], ["nasi goreng", "fried rice"]]
  },
  {
    id: "c2",
    category: "Driver",
    scenario: "Talking to a driver",
    theySay: "Besok mau dijemput jam berapa?",
    prompt: "Choose a useful reply.",
    answers: ["jam 10 pagi bagus"],
    options: ["Jam 10 pagi bagus", "Ini berapa?", "Saya mau pesan makanan", "Sudah makan?"],
    explanation: "The driver asks what time you want to be picked up tomorrow. Jam 10 pagi bagus means 10am is good.",
    breakdown: [["besok", "tomorrow"], ["dijemput", "be picked up"], ["jam berapa", "what time"], ["jam 10 pagi", "10 in the morning"]]
  },
  {
    id: "c3",
    category: "Staff",
    scenario: "Villa staff asks about cleaning",
    theySay: "Besok cleaning jam berapa?",
    prompt: "Choose the best reply.",
    answers: ["jam 11 pagi ya"],
    options: ["Jam 11 pagi ya", "Yang enak apa?", "Saya tinggal di Sanur", "Tidak tahu mungkin nanti"],
    explanation: "They ask what time cleaning should be tomorrow. Jam 11 pagi ya means 11am, please/okay.",
    breakdown: [["besok", "tomorrow"], ["cleaning", "cleaning"], ["jam berapa", "what time"], ["jam 11 pagi", "11 in the morning"]]
  },
  {
    id: "c4",
    category: "Shopping",
    scenario: "Buying something at a shop",
    theySay: "Mau yang mana?",
    prompt: "Choose the natural reply.",
    answers: ["yang ini ya"],
    options: ["Yang ini ya", "Besok pagi", "Saya lagi sibuk", "Bisa jemput kami"],
    explanation: "They ask which one you want. Yang ini ya means this one, please/okay.",
    breakdown: [["mau", "want"], ["yang mana", "which one"], ["yang ini", "this one"]]
  },
  {
    id: "c5",
    category: "Small Talk",
    scenario: "Casual local small talk",
    theySay: "Sudah lama tinggal di Bali?",
    prompt: "Choose a simple reply.",
    answers: ["belum lama"],
    options: ["Belum lama", "Ini berapa?", "Mau pesan makanan", "Tolong tunggu sebentar"],
    explanation: "They ask if you have lived in Bali for a long time. Belum lama means not long yet.",
    breakdown: [["sudah lama", "for a long time already"], ["tinggal", "live / stay"], ["belum lama", "not long yet"]]
  }
];

const achievements = [
  { key: "firstWin", label: "First Win", desc: "Get your first correct answer" },
  { key: "streak5", label: "Hot Streak", desc: "Reach a streak of 5" },
  { key: "score100", label: "Century", desc: "Score 100 points" },
  { key: "level3", label: "Conversational Spark", desc: "Reach level 3" },
  { key: "dailyGoal", label: "Daily Discipline", desc: "Finish your daily goal" },
  { key: "survivor", label: "Survivor", desc: "Complete at least 5 drills with lives left" }
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLevelData(score) {
  if (score >= 550) return { level: 5, title: "Bali Conversation Flow" };
  if (score >= 300) return { level: 4, title: "Local Chat Mode" };
  if (score >= 180) return { level: 3, title: "Conversation Builder" };
  if (score >= 80) return { level: 2, title: "Pattern Starter" };
  return { level: 1, title: "First Steps" };
}

function getRandomDrillId(items) {
  if (!items.length) return drills[0].id;
  return items[Math.floor(Math.random() * items.length)].id;
}

function chooseAdaptiveDrill(items, stats, excludeId) {
  const candidates = items.filter((item) => item.id !== excludeId);
  const source = candidates.length ? candidates : items;
  if (!source.length) return drills[0];

  const weighted = source.map((item) => {
    const s = stats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    const weaknessBoost = s.wrong * 3 + Math.max(0, s.seen - s.correct) * 1.5;
    const masteryPenalty = Math.min(s.streak * 0.7, 2.5);
    return { item, weight: Math.max(1, 1 + weaknessBoost - masteryPenalty) };
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
    currentDrillId: getRandomDrillId(drills),
    currentConversationId: conversationDrills[0].id,
    shuffledOptions: {},
    input: "",
    score: 0,
    streak: 0,
    bestStreak: 0,
    xp: 0,
    hearts: 3,
    feedback: null,
    answeredIds: [],
    unlocked: [],
    mode: "all",
    playMode: "typing",
    dailyGoal: 10,
    completedToday: 0,
    wrongIds: [],
    showReviewOnly: false,
    comboMultiplier: 1,
    drillStats: {},
    phrasebook: [],
    scanText: "",
    scanStatus: "",
    scanImageName: ""
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #06111f 0%, #0f172a 45%, #062a27 100%)",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    padding: 16,
    boxSizing: "border-box"
  },
  wrap: { maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 28 },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: 16, boxShadow: "0 18px 50px rgba(0,0,0,0.25)", backdropFilter: "blur(12px)" },
  pill: { display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#9af3d4", border: "1px solid rgba(16,185,129,0.28)", fontSize: 13, fontWeight: 700 },
  heroTitle: { fontSize: 34, lineHeight: 1.08, margin: "8px 0 0", fontWeight: 800 },
  heroText: { color: "#b8c5d7", lineHeight: 1.5, margin: 0 },
  row: { display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  smallStat: { background: "rgba(15,23,42,0.75)", borderRadius: 18, padding: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" },
  button: { minHeight: 46, borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: "0 14px", cursor: "pointer", fontWeight: 700 },
  buttonPrimary: { minHeight: 48, borderRadius: 18, border: "none", background: "#10b981", color: "white", padding: "0 16px", cursor: "pointer", fontWeight: 800 },
  buttonActive: { background: "rgba(34,211,238,0.18)", border: "1px solid rgba(103,232,249,0.28)", color: "#d7fbff" },
  buttonWarn: { background: "rgba(245,158,11,0.14)", border: "1px solid rgba(245,158,11,0.22)", color: "#fde68a" },
  input: { flex: 1, minHeight: 50, background: "rgba(15,23,42,0.82)", border: "1px solid rgba(255,255,255,0.12)", color: "white", borderRadius: 18, padding: "0 16px", fontSize: 16, outline: "none", boxSizing: "border-box", minWidth: 0 },
  progressTrack: { width: "100%", height: 9, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" },
  badge: { display: "inline-flex", alignItems: "center", padding: "6px 10px", borderRadius: 999, background: "rgba(34,211,238,0.14)", color: "#c8fbff", border: "1px solid rgba(34,211,238,0.22)", fontSize: 12, fontWeight: 700 },
  answerButton: { textAlign: "left", minHeight: 50, padding: "12px 14px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(15,23,42,0.82)", color: "white", cursor: "pointer", fontWeight: 600, lineHeight: 1.35 },
  muted: { color: "#94a3b8" },
  sectionTitle: { fontSize: 18, fontWeight: 800, margin: 0 },
  feedbackGood: { borderRadius: 18, padding: 14, border: "1px solid rgba(52,211,153,0.24)", background: "rgba(16,185,129,0.12)" },
  feedbackBad: { borderRadius: 18, padding: 14, border: "1px solid rgba(251,113,133,0.24)", background: "rgba(244,63,94,0.12)" },
  achievementRow: { borderRadius: 18, padding: 12, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(15,23,42,0.68)" },
  profileButton: { minHeight: 54, borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(15,23,42,0.82)", color: "white", padding: "10px 14px", cursor: "pointer", fontWeight: 700, textAlign: "left" }
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
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUser = profiles[activeProfile] || blankUserState();

  const updateUser = (patch) => {
    setProfiles((prev) => ({
      ...prev,
      [activeProfile]: { ...blankUserState(), ...(prev[activeProfile] || {}), ...patch }
    }));
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.profiles) setProfiles(data.profiles);
      if (data.activeProfile) setActiveProfile(data.activeProfile);
      if (typeof data.showProfileManager === "boolean") setShowProfileManager(data.showProfileManager);
    } catch (error) {
      console.error("Could not load saved profile data", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeProfile, showProfileManager }));
  }, [profiles, activeProfile, showProfileManager]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error("Service worker registration failed", error));
    }
  }, []);

  useEffect(() => {
    const promptHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstallReady(true);
    };
    const installedHandler = () => {
      setIsInstalled(true);
      setInstallReady(false);
      setDeferredPrompt(null);
    };
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    window.addEventListener("beforeinstallprompt", promptHandler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const pool = useMemo(() => {
    if (currentUser.playMode === "conversation") return conversationDrills;
    let filtered = drills;
    if (currentUser.mode !== "all") filtered = filtered.filter((d) => d.category.toLowerCase() === currentUser.mode);
    if (currentUser.showReviewOnly) filtered = filtered.filter((d) => currentUser.wrongIds.includes(d.id));
    if (currentUser.playMode === "listening") filtered = filtered.filter((d) => d.type === "listening" || d.category === "Listening");
    return filtered.length ? filtered : drills;
  }, [currentUser.mode, currentUser.showReviewOnly, currentUser.wrongIds, currentUser.playMode]);

  const current = useMemo(() => {
    if (currentUser.playMode === "conversation") return conversationDrills.find((d) => d.id === currentUser.currentConversationId) || conversationDrills[0];
    return pool.find((d) => d.id === currentUser.currentDrillId) || pool[0] || drills[0];
  }, [pool, currentUser.currentDrillId, currentUser.currentConversationId, currentUser.playMode]);

  const currentOptions = useMemo(() => {
    const key = `${currentUser.playMode}-${current.id}`;
    const saved = currentUser.shuffledOptions?.[key];
    if (saved && saved.length) return saved;
    return shuffleArray(current.options || []);
  }, [current, currentUser.playMode, currentUser.shuffledOptions]);

  useEffect(() => {
    if (currentUser.playMode === "photo") return;
    const key = `${currentUser.playMode}-${current.id}`;
    if (!currentUser.shuffledOptions?.[key]) {
      updateUser({ shuffledOptions: { ...(currentUser.shuffledOptions || {}), [key]: shuffleArray(current.options || []) } });
    }
  }, [current.id, currentUser.playMode]);

  const levelData = getLevelData(currentUser.score);
  const categories = ["all", ...Array.from(new Set(drills.map((d) => d.category.toLowerCase())))];
  const progressToNext = Math.min(100, currentUser.xp % 100);

  useEffect(() => {
    const nextUnlocked = [];
    if (currentUser.score > 0) nextUnlocked.push("firstWin");
    if (currentUser.bestStreak >= 5) nextUnlocked.push("streak5");
    if (currentUser.score >= 100) nextUnlocked.push("score100");
    if (levelData.level >= 3) nextUnlocked.push("level3");
    if (currentUser.completedToday >= currentUser.dailyGoal) nextUnlocked.push("dailyGoal");
    if (currentUser.answeredIds.length >= 5 && currentUser.hearts > 0) nextUnlocked.push("survivor");
    const nextCombo = Math.min(3, 1 + Math.floor(currentUser.streak / 3) * 0.5);
    const sameUnlocked = JSON.stringify(currentUser.unlocked) === JSON.stringify(nextUnlocked);
    if (!sameUnlocked || currentUser.comboMultiplier !== nextCombo) updateUser({ unlocked: nextUnlocked, comboMultiplier: nextCombo });
  }, [currentUser.score, currentUser.bestStreak, currentUser.completedToday, currentUser.dailyGoal, currentUser.answeredIds.length, currentUser.hearts, currentUser.streak, currentUser.comboMultiplier, currentUser.unlocked, levelData.level]);

  const buttonStyle = (active, warn) => ({ ...styles.button, ...(active ? styles.buttonActive : {}), ...(warn ? styles.buttonWarn : {}) });
  const progressFill = (value) => ({ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)" });

  const updateDrillStats = (drillId, wasCorrect) => {
    const previousStats = currentUser.drillStats || {};
    const existing = previousStats[drillId] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    updateUser({ drillStats: { ...previousStats, [drillId]: { seen: existing.seen + 1, correct: existing.correct + (wasCorrect ? 1 : 0), wrong: existing.wrong + (wasCorrect ? 0 : 1), streak: wasCorrect ? existing.streak + 1 : 0 } } });
  };

  const moveToNextDrill = () => {
    if (currentUser.playMode === "conversation") {
      const available = conversationDrills.filter((item) => item.id !== current.id);
      const next = available[Math.floor(Math.random() * available.length)] || conversationDrills[0];
      updateUser({ currentConversationId: next.id, shuffledOptions: {} });
      return;
    }
    const next = chooseAdaptiveDrill(pool, currentUser.drillStats || {}, current.id);
    updateUser({ currentDrillId: next ? next.id : getRandomDrillId(pool), shuffledOptions: {} });
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => updateUser({ input: event.results?.[0]?.[0]?.transcript || "" });
    recognition.onerror = () => updateUser({ feedback: { ok: false, text: "Voice input did not work", explanation: "Please try again or type your answer manually." } });
    recognitionRef.current = recognition;
    recognition.start();
  };

  const checkAnswer = (submitted) => {
    if (!current || currentUser.hearts <= 0) return;
    const value = normalize(submitted);
    const isCorrect = current.answers.some((answer) => normalize(answer) === value);
    if (isCorrect) {
      updateDrillStats(current.id, true);
      const newStreak = currentUser.streak + 1;
      const gained = Math.round((10 + Math.min(newStreak * 2, 20)) * currentUser.comboMultiplier);
      updateUser({ score: currentUser.score + gained, xp: currentUser.xp + 25, streak: newStreak, bestStreak: Math.max(currentUser.bestStreak, newStreak), completedToday: currentUser.completedToday + 1, answeredIds: [...currentUser.answeredIds, current.id], wrongIds: currentUser.wrongIds.filter((id) => id !== current.id), feedback: { ok: true, text: `Correct. +${gained} points`, explanation: current.explanation }, input: "" });
      setTimeout(() => {
        updateUser({ feedback: null });
        moveToNextDrill();
      }, 900);
    } else {
      updateDrillStats(current.id, false);
      updateUser({ hearts: Math.max(currentUser.hearts - 1, 0), streak: 0, wrongIds: currentUser.wrongIds.includes(current.id) ? currentUser.wrongIds : [...currentUser.wrongIds, current.id], feedback: { ok: false, text: "Not quite", explanation: `Correct answer: ${current.answers[0]}. ${current.explanation}` } });
    }
  };

  const handleSubmit = () => {
    if (!currentUser.input.trim()) return;
    checkAnswer(currentUser.input);
  };

  const handlePhotoScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateUser({ scanStatus: "Reading photo... this may take a moment.", scanImageName: file.name, scanText: "" });
    try {
      const worker = await createWorker("ind+eng");
      const result = await worker.recognize(file);
      await worker.terminate();
      const text = result?.data?.text?.trim() || "";
      updateUser({ scanText: text || "No clear text found. Try a sharper photo.", scanStatus: text ? "Text extracted. Review it, then save useful phrases." : "No clear text found. Try a sharper photo." });
    } catch (error) {
      console.error("OCR failed", error);
      updateUser({ scanStatus: "Could not read the photo. Try a clearer image or better lighting." });
    }
  };

  const saveScannedPhrase = () => {
    const text = (currentUser.scanText || "").trim();
    if (!text) return;
    const newItem = { id: Date.now(), text, createdAt: new Date().toISOString(), source: currentUser.scanImageName || "photo" };
    updateUser({ phrasebook: [newItem, ...(currentUser.phrasebook || [])], feedback: { ok: true, text: "Saved to phrasebook", explanation: "You can review this phrase later and turn it into a drill." } });
  };

  const clearScan = () => {
    updateUser({ scanText: "", scanStatus: "", scanImageName: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhrasebookItem = (id) => updateUser({ phrasebook: (currentUser.phrasebook || []).filter((item) => item.id !== id) });

  const installApp = async () => {
    if (!deferredPrompt) {
      updateUser({ feedback: { ok: false, text: "Install prompt not ready", explanation: "In Chrome, use the browser menu and choose Add to Home screen." } });
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallReady(false);
    if (choice?.outcome === "accepted") {
      setIsInstalled(true);
      updateUser({ feedback: { ok: true, text: "App install started", explanation: "Open it from your home screen for the best full-screen experience." } });
    }
  };

  const createProfile = () => {
    const clean = newProfileName.trim();
    if (!clean) return;
    setProfiles((prev) => ({ ...prev, [clean]: prev[clean] || blankUserState() }));
    setActiveProfile(clean);
    setNewProfileName("");
    setShowProfileManager(false);
  };

  const resetProfile = () => {
    setProfiles((prev) => ({ ...prev, [activeProfile]: blankUserState() }));
    setShowProfileManager(true);
  };

  const renderBreakdown = (breakdown) => {
    if (!breakdown || !breakdown.length) return null;
    return (
      <div style={{ marginTop: 12, ...styles.achievementRow }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Phrase Breakdown</div>
        <div style={{ display: "grid", gap: 6 }}>
          {breakdown.map(([phrase, meaning]) => (
            <div key={`${phrase}-${meaning}`} style={{ color: "#cbd5e1", fontSize: 14 }}>
              <strong style={{ color: "#86efac" }}>{phrase}</strong> = {meaning}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPhotoMode = () => (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.badge}>Photo Scan</div>
        <div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.15)" }}>OCR phrase capture</div>
      </div>
      <h2 style={{ fontSize: 22, lineHeight: 1.25, marginTop: 14, marginBottom: 8, color: "#fff", fontWeight: 800 }}>Scan Indonesian text from a photo</h2>
      <p style={{ ...styles.muted, lineHeight: 1.5 }}>Use this for menus, signs, WhatsApp screenshots, receipts, or villa messages. The app extracts text, then you can save useful phrases to your phrasebook.</p>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoScan} style={{ display: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 14 }}>
        <button style={styles.buttonPrimary} onClick={() => fileInputRef.current?.click()}>📷 Take / Upload Photo</button>
        <button style={styles.button} onClick={clearScan}>Clear</button>
      </div>
      {currentUser.scanStatus ? <div style={{ marginTop: 12, color: "#86efac", fontSize: 14 }}>{currentUser.scanStatus}</div> : null}
      {currentUser.scanText ? (
        <div style={{ marginTop: 14, ...styles.achievementRow }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Extracted Text</div>
          <textarea value={currentUser.scanText} onChange={(event) => updateUser({ scanText: event.target.value })} style={{ width: "100%", minHeight: 130, resize: "vertical", borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(15,23,42,0.82)", color: "white", padding: 12, boxSizing: "border-box", fontSize: 15, lineHeight: 1.45 }} />
          <button style={{ ...styles.buttonPrimary, width: "100%", marginTop: 10 }} onClick={saveScannedPhrase}>Save to Phrasebook</button>
        </div>
      ) : null}
      <div style={{ marginTop: 16 }}>
        <h3 style={styles.sectionTitle}>📘 My Phrasebook</h3>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {(currentUser.phrasebook || []).length ? currentUser.phrasebook.map((item) => (
            <div key={item.id} style={styles.achievementRow}>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.45, color: "#e5edf7" }}>{item.text}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={styles.button} onClick={() => speak(item.text)}>🔊 Listen</button>
                <button style={buttonStyle(false, true)} onClick={() => removePhrasebookItem(item.id)}>Delete</button>
              </div>
            </div>
          )) : <div style={{ ...styles.muted, lineHeight: 1.5 }}>No saved phrases yet. Scan a menu, sign, or message to start building your own Bali phrasebook.</div>}
        </div>
      </div>
      {currentUser.feedback ? (
        <div style={{ marginTop: 14, ...(currentUser.feedback.ok ? styles.feedbackGood : styles.feedbackBad) }}>
          <div style={{ fontWeight: 800, color: currentUser.feedback.ok ? "#a7f3d0" : "#fecdd3" }}>{currentUser.feedback.text}</div>
          <div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{currentUser.feedback.explanation}</div>
        </div>
      ) : null}
    </div>
  );

  if (showProfileManager) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.pill}>👤 Choose a learner</div>
          <h1 style={styles.heroTitle}>Who is using the app?</h1>
          <p style={styles.heroText}>Each profile keeps separate progress, streaks, mistakes, phrasebook, and learning pace on this device.</p>
          <div style={styles.card}>
            <div style={{ display: "grid", gap: 10 }}>
              {Object.keys(profiles).map((name) => (
                <button key={name} style={styles.profileButton} onClick={() => { setActiveProfile(name); setShowProfileManager(false); }}>
                  <div style={{ fontWeight: 800 }}>{name}</div>
                  <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 13 }}>Level {getLevelData((profiles[name] || {}).score || 0).level} · {(profiles[name] || {}).score || 0} pts</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <input style={styles.input} value={newProfileName} onChange={(event) => setNewProfileName(event.target.value)} placeholder="Add a new profile name" />
              <button style={styles.buttonPrimary} onClick={createProfile}>Add</button>
            </div>
          </div>
          <div style={{ ...styles.muted, textAlign: "center", fontSize: 12 }}>{APP_VERSION_LABEL}</div>
        </div>
      </div>
    );
  }

  if (!currentUser.started) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.row}>
            <div style={styles.pill}>✨ Bali Bahasa Trainer</div>
            <button style={buttonStyle(false, false)} onClick={() => setShowProfileManager(true)}>{activeProfile}</button>
          </div>
          <h1 style={styles.heroTitle}>Learn Indonesian for <span style={{ color: "#86efac" }}>real Bali conversations</span></h1>
          <p style={styles.heroText}>Scenario-based practice for Bali life. Includes adaptive drills, phrase breakdowns, conversation mode, photo scan, voice input, and separate profiles.</p>
          <div style={styles.card}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontWeight: 800 }}>Real</div><div style={styles.muted}>Conversation</div></div>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>📷</div><div style={{ fontWeight: 800 }}>Photo</div><div style={styles.muted}>Scan</div></div>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>🔀</div><div style={{ fontWeight: 800 }}>Random</div><div style={styles.muted}>Answers</div></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ marginBottom: 8, color: "#cbd5e1", fontWeight: 700 }}>Daily goal</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[5, 10, 20].map((goal) => <button key={goal} style={goal === currentUser.dailyGoal ? { ...styles.buttonPrimary, minHeight: 42 } : { ...styles.button, minHeight: 42 }} onClick={() => updateUser({ dailyGoal: goal })}>{goal} drills</button>)}
              </div>
            </div>
            <button style={{ ...styles.buttonPrimary, width: "100%" }} onClick={() => updateUser({ started: true })}>Start Training</button>
          </div>
          <div style={{ ...styles.muted, textAlign: "center", fontSize: 12 }}>{APP_VERSION_LABEL}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={{ color: "#86efac", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 11, fontWeight: 800 }}>{levelData.title}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>Level {levelData.level}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={buttonStyle(false, false)} onClick={() => setShowProfileManager(true)}>{activeProfile}</button>
              <div style={{ ...styles.badge, background: "rgba(251,191,36,0.14)", color: "#fde68a", borderColor: "rgba(251,191,36,0.22)" }}>{currentUser.score} pts</div>
            </div>
          </div>
          <div style={{ marginTop: 14, ...styles.progressTrack }}><div style={progressFill(progressToNext)} /></div>
          <div style={{ ...styles.statGrid, marginTop: 14 }}>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>🔥</div><div style={{ fontWeight: 800 }}>{currentUser.streak}</div><div style={styles.muted}>Streak</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>⭐</div><div style={{ fontWeight: 800 }}>{currentUser.bestStreak}</div><div style={styles.muted}>Best</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>❤️</div><div style={{ fontWeight: 800 }}>{currentUser.hearts}</div><div style={styles.muted}>Lives</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>⚔️</div><div style={{ fontWeight: 800 }}>x{currentUser.comboMultiplier.toFixed(1)}</div><div style={styles.muted}>Combo</div></div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ ...styles.row, marginBottom: 6 }}><div style={styles.muted}>Daily goal</div><div style={{ color: "#86efac", fontWeight: 700 }}>{currentUser.completedToday}/{currentUser.dailyGoal}</div></div>
            <div style={styles.progressTrack}><div style={progressFill((currentUser.completedToday / currentUser.dailyGoal) * 100)} /></div>
          </div>
        </div>

        <div style={{ ...styles.card, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
            <button style={buttonStyle(false, false)} onClick={() => updateUser({ feedback: { ok: true, text: "Progress saved", explanation: "Your profile has been saved on this device." } })}>💾 Save</button>
            <button style={buttonStyle(installReady, false)} onClick={installApp}>{isInstalled ? "✅ Installed" : "📲 Install"}</button>
            <button style={buttonStyle(false, true)} onClick={resetProfile}>↺ Reset</button>
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 8 }}>
            {categories.map((cat) => (
              <button key={cat} style={{ ...styles.button, whiteSpace: "nowrap", borderRadius: 999, ...(currentUser.mode === cat ? styles.buttonActive : {}) }} onClick={() => {
                const nextPool = cat === "all" ? drills : drills.filter((d) => d.category.toLowerCase() === cat);
                updateUser({ mode: cat, currentDrillId: getRandomDrillId(nextPool.length ? nextPool : drills), feedback: null, input: "", shuffledOptions: {} });
              }}>{cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            <button style={buttonStyle(currentUser.playMode === "typing", false)} onClick={() => updateUser({ playMode: "typing", shuffledOptions: {} })}>🧠 Typing</button>
            <button style={buttonStyle(currentUser.playMode === "multiple", false)} onClick={() => updateUser({ playMode: "multiple", shuffledOptions: {} })}>🎯 Multiple Choice</button>
            <button style={buttonStyle(currentUser.playMode === "listening", false)} onClick={() => updateUser({ playMode: "listening", shuffledOptions: {} })}>🎧 Listening</button>
            <button style={buttonStyle(currentUser.playMode === "conversation", false)} onClick={() => updateUser({ playMode: "conversation", shuffledOptions: {} })}>💬 Conversation</button>
            <button style={buttonStyle(currentUser.playMode === "photo", false)} onClick={() => updateUser({ playMode: "photo", feedback: null })}>📷 Photo Scan</button>
            <button style={buttonStyle(currentUser.showReviewOnly, true)} onClick={() => updateUser({ showReviewOnly: !currentUser.showReviewOnly, currentDrillId: getRandomDrillId(drills), shuffledOptions: {} })}>🔁 Review Mistakes</button>
          </div>
        </div>

        {currentUser.playMode === "photo" ? renderPhotoMode() : currentUser.hearts > 0 ? (
          <div style={styles.card}>
            <div style={styles.row}>
              <div style={styles.badge}>{current.category}</div>
              <div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.15)" }}>Drill {currentUser.answeredIds.length + 1}</div>
            </div>
            <div style={{ marginTop: 14, marginBottom: 8, color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}><strong style={{ color: "#cbd5e1" }}>Scenario:</strong> {current.scenario}</div>
            <div style={{ marginBottom: 10, color: "#86efac", fontSize: 13, fontWeight: 700 }}>{current.direction}</div>

            {currentUser.playMode === "conversation" ? (
              <div style={{ ...styles.achievementRow, marginBottom: 12 }}><div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>They say:</div><div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35 }}>{current.theySay}</div><div style={{ marginTop: 8, color: "#cbd5e1" }}>{current.prompt}</div></div>
            ) : <h2 style={{ fontSize: 19, lineHeight: 1.35, marginTop: 0, marginBottom: 14, color: "#fff", fontWeight: 800 }}>{current.prompt}</h2>}

            {currentUser.playMode === "typing" ? (
              <>
                <div style={{ marginTop: -4, marginBottom: 12, color: "#cbd5e1", fontSize: 14, lineHeight: 1.45 }}>Type your answer in <strong>Bahasa Indonesia</strong>.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={styles.input} value={currentUser.input} onChange={(event) => updateUser({ input: event.target.value })} onKeyDown={(event) => event.key === "Enter" && handleSubmit()} placeholder="Type your answer in Bahasa Indonesia" />
                  <button style={{ ...styles.button, width: 50, padding: 0 }} onClick={() => speak(current.answers[0])}>🔊</button>
                  {voiceSupported ? <button style={{ ...styles.button, width: 50, padding: 0 }} onClick={startVoiceInput}>🎤</button> : null}
                </div>
              </>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {currentOptions.map((option) => <button key={option} style={styles.answerButton} onClick={() => checkAnswer(option)}>{option}</button>)}
                <button style={styles.button} onClick={() => speak(currentUser.playMode === "conversation" ? current.theySay : current.prompt)}>🔊 Play Audio</button>
              </div>
            )}

            <div style={{ marginTop: 12, ...styles.muted }}>{currentUser.playMode === "typing" ? `Translate into Bahasa Indonesia. Tip: ${current.tip}` : `Tip: ${current.tip}`}</div>
            {currentUser.playMode === "typing" ? <button style={{ ...styles.buttonPrimary, width: "100%", marginTop: 14 }} onClick={handleSubmit}>Check Answer</button> : null}
            {currentUser.feedback ? (
              <div style={{ marginTop: 14, ...(currentUser.feedback.ok ? styles.feedbackGood : styles.feedbackBad) }}>
                <div style={{ fontWeight: 800, color: currentUser.feedback.ok ? "#a7f3d0" : "#fecdd3" }}>{currentUser.feedback.text}</div>
                <div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{currentUser.feedback.explanation}</div>
                {renderBreakdown(current.breakdown)}
              </div>
            ) : null}
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{ textAlign: "center", fontSize: 42 }}>💀</div><div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginTop: 6 }}>Run Over</div>
            <p style={{ textAlign: "center", color: "#cbd5e1" }}>You ran out of lives. Reset and go again.</p>
            <button style={{ ...styles.buttonPrimary, width: "100%" }} onClick={() => updateUser(blankUserState())}>Start New Run</button>
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🎯 Achievements</h3>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {achievements.map((item) => {
              const unlockedNow = currentUser.unlocked.includes(item.key);
              return <div key={item.key} style={{ ...styles.achievementRow, background: unlockedNow ? "rgba(251,191,36,0.10)" : "rgba(15,23,42,0.68)", borderColor: unlockedNow ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.10)" }}><div style={styles.row}><div><div style={{ fontWeight: 800 }}>{item.label}</div><div style={{ ...styles.muted, fontSize: 14, marginTop: 3 }}>{item.desc}</div></div><div style={{ fontSize: 22 }}>{unlockedNow ? "🏆" : "🔒"}</div></div></div>;
            })}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🔐 Learning Focus</h3>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <div style={styles.achievementRow}><div style={{ fontWeight: 800, marginBottom: 6 }}>Current weakness review</div><div style={styles.muted}>{currentUser.wrongIds.length ? `${currentUser.wrongIds.length} phrase${currentUser.wrongIds.length > 1 ? "s" : ""} saved for review mode.` : "No saved mistakes yet. Keep going."}</div><div style={{ ...styles.muted, fontSize: 12, marginTop: 8 }}>Adaptive mode prioritizes phrases you miss more often and eases off on phrases you keep getting right.</div></div>
            <div style={styles.achievementRow}><div style={{ fontWeight: 800, marginBottom: 6 }}>Photo Scan</div><div style={styles.muted}>Use Photo Scan to capture phrases from menus, signs, screenshots, and messages into your personal phrasebook.</div></div>
            <div style={styles.achievementRow}><div style={{ fontWeight: 800, marginBottom: 6 }}>App version</div><div style={styles.muted}>{APP_VERSION_LABEL}</div><div style={{ ...styles.muted, fontSize: 12, marginTop: 4 }}>Build {APP_VERSION}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
