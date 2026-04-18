import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "bali-bahasa-codesandbox-ready-v2";

const drills = [
  {
    id: 1,
    type: "translate",
    category: "Warung",
    scenario: "At a warung in Sanur",
    direction: "Translate into Bahasa Indonesia",
    level: 1,
    prompt: "Where do you want to eat?",
    answers: ["mau makan di mana"],
    options: ["mau makan di mana", "dari mana mau makan", "makan dari mana", "di mana kamu makan"],
    tip: "Use mau + verb + di mana.",
    explanation: "Natural Indonesian: Mau makan di mana? 'Mau' means want, 'makan' means eat, and 'di mana' means where."
  },
  {
    id: 2,
    type: "translate",
    category: "Daily",
    scenario: "Replying to a local message",
    direction: "Translate into Bahasa Indonesia",
    level: 1,
    prompt: "I do not know, maybe later.",
    answers: ["tidak tahu mungkin nanti", "nggak tahu mungkin nanti", "saya tidak tahu mungkin nanti"],
    options: ["nggak tahu mungkin nanti", "mungkin saya tidak tahu nanti", "saya mungkin tahu nanti", "nanti saya tidak mungkin"],
    tip: "Maybe later = mungkin nanti.",
    explanation: "Natural version: Nggak tahu, mungkin nanti. 'Nggak tahu' means don't know, and 'mungkin nanti' means maybe later."
  },
  {
    id: 3,
    type: "translate",
    category: "Shopping",
    scenario: "At a market stall",
    direction: "Translate into Bahasa Indonesia",
    level: 1,
    prompt: "How much is this?",
    answers: ["ini berapa", "berapa harganya"],
    options: ["ini berapa", "berapa ini harga", "ini harga mana", "berapa kamu"],
    tip: "Ini berapa? is very common in Bali.",
    explanation: "Fast everyday version: Ini berapa? 'Ini' means this, and 'berapa' means how much."
  },
  {
    id: 4,
    type: "translate",
    category: "Help",
    scenario: "Asking someone for assistance",
    direction: "Translate into Bahasa Indonesia",
    level: 1,
    prompt: "Can you help me?",
    answers: ["bisa bantu saya", "bisa bantu"],
    options: ["bisa bantu saya", "kamu bantu saya", "saya bantu kamu", "bantu saya bisa kamu"],
    tip: "Bisa bantu? is natural and short.",
    explanation: "Natural version: Bisa bantu saya? 'Bisa' means can, and 'bantu' means help."
  },
  {
    id: 5,
    type: "translate",
    category: "Warung",
    scenario: "Ordering food",
    direction: "Translate into Bahasa Indonesia",
    level: 1,
    prompt: "I want to order food.",
    answers: ["saya mau pesan makanan", "mau pesan makanan"],
    options: ["saya mau pesan makanan", "makanan saya mau", "pesan saya makanan mau", "mau saya makanan"],
    tip: "Mau pesan... is a core pattern.",
    explanation: "Natural version: Saya mau pesan makanan. 'Pesan' means order, and 'makanan' means food."
  },
  {
    id: 6,
    type: "translate",
    category: "Warung",
    scenario: "Asking what is good on the menu",
    direction: "Translate into Bahasa Indonesia",
    level: 2,
    prompt: "What do you recommend?",
    answers: ["yang enak apa", "apa yang kamu sarankan", "apa yang anda sarankan"],
    options: ["yang enak apa", "apa enak yang", "sarankan saya apa", "apa kamu enak"],
    tip: "Yang enak apa? is simple and natural.",
    explanation: "Very natural Bali version: Yang enak apa? Literally: what is tasty or good?"
  },
  {
    id: 7,
    type: "translate",
    category: "Transport",
    scenario: "Talking to a driver",
    direction: "Translate into Bahasa Indonesia",
    level: 2,
    prompt: "I live in Sanur now.",
    answers: ["sekarang saya tinggal di sanur", "saya tinggal di sanur sekarang"],
    options: ["sekarang saya tinggal di sanur", "saya tinggal sekarang sanur", "sanur tinggal saya sekarang", "saya sekarang dari sanur"],
    tip: "Sekarang can go at the start or end.",
    explanation: "Natural version: Sekarang saya tinggal di Sanur. 'Tinggal' means live or stay."
  },
  {
    id: 8,
    type: "translate",
    category: "Daily",
    scenario: "Replying to someone politely",
    direction: "Translate into Bahasa Indonesia",
    level: 2,
    prompt: "I am a bit busy right now.",
    answers: ["sekarang lagi sibuk sedikit", "saya lagi sibuk sedikit sekarang", "sekarang saya lagi sibuk sedikit"],
    options: ["sekarang lagi sibuk sedikit", "sibuk saya sedikit sekarang", "saya sekarang sibuk mana", "lagi sedikit saya sekarang"],
    tip: "Lagi = currently doing or being.",
    explanation: "Natural version: Sekarang lagi sibuk sedikit. 'Lagi sibuk' means currently busy."
  },
  {
    id: 9,
    type: "translate",
    category: "Villa",
    scenario: "Speaking to guests or staff",
    direction: "Translate into Bahasa Indonesia",
    level: 2,
    prompt: "Please wait a moment.",
    answers: ["sebentar ya", "tolong tunggu sebentar", "tunggu sebentar"],
    options: ["sebentar ya", "tunggu ya mana", "tolong sedikit tunggu mana", "sebentar kamu"],
    tip: "Sebentar ya is friendly and common.",
    explanation: "Friendly version: Sebentar ya. 'Sebentar' means a moment."
  },
  {
    id: 10,
    type: "translate",
    category: "Warung",
    scenario: "Pointing at something on a menu",
    direction: "Translate into Bahasa Indonesia",
    level: 2,
    prompt: "This one, please.",
    answers: ["yang ini ya", "ini ya", "yang ini tolong"],
    options: ["yang ini ya", "ini yang mana", "yang tolong ini", "ini kamu ya"],
    tip: "Yang ini ya is very usable in Bali.",
    explanation: "Natural version: Yang ini ya. 'Yang ini' means this one."
  },
  {
    id: 11,
    type: "conversation",
    category: "Listening",
    scenario: "A local asks a casual question",
    direction: "Choose the best reply",
    level: 3,
    prompt: "Sudah makan?",
    answers: ["sudah terima kasih", "belum nanti", "belum makan"],
    options: ["Sudah, terima kasih", "Saya dari Australia", "Mau pesan makanan", "Ini berapa"],
    tip: "Choose a natural short reply.",
    explanation: "Common replies: Sudah, terima kasih. Belum, nanti. 'Sudah makan?' literally means have you eaten yet?"
  },
  {
    id: 12,
    type: "conversation",
    category: "Small Talk",
    scenario: "Meeting someone new",
    direction: "Choose the best reply",
    level: 3,
    prompt: "Kamu dari mana?",
    answers: ["saya dari australia", "dari australia"],
    options: ["Saya dari Australia", "Saya tinggal di warung", "Ini berapa", "Nanti saja"],
    tip: "Drop words to sound more natural.",
    explanation: "Natural version: Saya dari Australia. 'Dari mana?' means where are you from?"
  },
  {
    id: 13,
    type: "translate",
    category: "Villa",
    scenario: "Giving a house instruction",
    direction: "Translate into Bahasa Indonesia",
    level: 3,
    prompt: "Please turn off the air conditioner when you go out.",
    answers: ["tolong matikan ac kalau keluar", "kalau keluar tolong matikan ac"],
    options: ["tolong matikan ac kalau keluar", "keluar ac tolong mati", "tolong ac keluar mati", "matikan keluar saya"],
    tip: "Kalau = if or when.",
    explanation: "Natural version: Tolong matikan AC kalau keluar. 'Matikan' means turn off."
  },
  {
    id: 14,
    type: "translate",
    category: "Driver",
    scenario: "Arranging transport",
    direction: "Translate into Bahasa Indonesia",
    level: 3,
    prompt: "Can you pick us up at 7 tonight?",
    answers: ["bisa jemput kami jam 7 malam ini", "bisa jemput kita jam 7 malam ini"],
    options: ["bisa jemput kami jam 7 malam ini", "jemput bisa malam kami", "jam 7 bisa kamu kami", "malam ini kamu dari mana"],
    tip: "Jam 7 malam ini = at 7 tonight.",
    explanation: "Natural version: Bisa jemput kami jam 7 malam ini? 'Jemput' means pick up."
  },
  {
    id: 15,
    type: "translate",
    category: "Staff",
    scenario: "Checking on guests",
    direction: "Translate into Bahasa Indonesia",
    level: 3,
    prompt: "Have the guests arrived yet?",
    answers: ["tamunya sudah datang belum", "sudah datang belum tamunya"],
    options: ["tamunya sudah datang belum", "tamu datang dari mana", "sudah tamu di mana", "belum mana datang"],
    tip: "Sudah ... belum is a very useful pattern.",
    explanation: "Natural version: Tamunya sudah datang belum? This pattern means has X happened yet?"
  },
  {
    id: 16,
    type: "listening",
    category: "Listening",
    scenario: "Message from a local contact",
    direction: "Choose the correct meaning",
    level: 4,
    prompt: "Nanti saya kirim pesan ya, sekarang lagi sibuk sedikit.",
    answers: ["i will message later i am a bit busy right now", "ill message later im a bit busy right now"],
    options: ["I will message later, I am a bit busy right now", "Where do you want to eat?", "How much is this?", "I am from Australia"],
    tip: "Listen and choose the correct meaning.",
    explanation: "Meaning: I will message later, I am a bit busy right now."
  },
  {
    id: 17,
    type: "listening",
    category: "Listening",
    scenario: "A polite everyday instruction",
    direction: "Choose the correct meaning",
    level: 4,
    prompt: "Tolong tunggu sebentar ya.",
    answers: ["please wait a moment", "please wait a moment."],
    options: ["Please wait a moment", "Can you help me?", "Where are you from?", "This one please"],
    tip: "Sebentar = a moment.",
    explanation: "Meaning: Please wait a moment."
  },
  {
    id: 18,
    type: "listening",
    category: "Listening",
    scenario: "At a restaurant or café",
    direction: "Choose the correct meaning",
    level: 4,
    prompt: "Yang enak apa di sini?",
    answers: ["what is good here", "what do you recommend here"],
    options: ["What is good here?", "How much is this?", "I live in Sanur now", "We will go later"],
    tip: "Enak = tasty / good.",
    explanation: "Meaning: What is good here?"
  }
];

const achievements = [
  { key: "firstWin", label: "First Win", desc: "Get your first correct answer" },
  { key: "streak5", label: "Hot Streak", desc: "Reach a streak of 5" },
  { key: "score100", label: "Century", desc: "Score 100 points" },
  { key: "level3", label: "Conversational Spark", desc: "Reach level 3" },
  { key: "dailyGoal", label: "Daily Discipline", desc: "Finish your daily goal" },
  { key: "survivor", label: "Survivor", desc: "Finish a run with lives left" }
];

const normalize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getLevelData = (score) => {
  if (score >= 550) return { level: 5, title: "Bali Conversation Flow" };
  if (score >= 300) return { level: 4, title: "Local Chat Mode" };
  if (score >= 180) return { level: 3, title: "Conversation Builder" };
  if (score >= 80) return { level: 2, title: "Pattern Starter" };
  return { level: 1, title: "First Steps" };
};

const getRandomDrillId = (items) => {
  if (!items.length) return 0;
  return items[Math.floor(Math.random() * items.length)].id;
};

const chooseAdaptiveDrill = (items, drillStats, excludeId = null) => {
  const candidates = items.filter((item) => item.id !== excludeId);
  const source = candidates.length ? candidates : items;
  if (!source.length) return null;

  const weighted = source.map((item) => {
    const stats = drillStats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0, cooldown: 0 };
    const base = 1;
    const weaknessBoost = stats.wrong * 3 + Math.max(0, stats.seen - stats.correct) * 1.5;
    const masteryPenalty = Math.min(stats.streak * 0.6, 2.5);
    const cooldownPenalty = stats.cooldown || 0;
    const weight = Math.max(1, base + weaknessBoost - masteryPenalty - cooldownPenalty);
    return { item, weight };
  });

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;

  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }

  return weighted[weighted.length - 1].item;
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #06111f 0%, #0f172a 45%, #062a27 100%)",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    padding: 16,
    boxSizing: "border-box"
  },
  wrap: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    paddingBottom: 28
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)"
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.12)",
    color: "#9af3d4",
    border: "1px solid rgba(16,185,129,0.28)",
    fontSize: 13,
    fontWeight: 700
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 1.08,
    margin: "8px 0 0",
    fontWeight: 800
  },
  heroText: {
    color: "#b8c5d7",
    lineHeight: 1.5,
    margin: 0
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between"
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10
  },
  smallStat: {
    background: "rgba(15,23,42,0.75)",
    borderRadius: 18,
    padding: 12,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.06)"
  },
  button: {
    height: 46,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 700
  },
  buttonPrimary: {
    height: 48,
    borderRadius: 18,
    border: "none",
    background: "#10b981",
    color: "white",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 800
  },
  buttonActive: {
    background: "rgba(34,211,238,0.18)",
    border: "1px solid rgba(103,232,249,0.28)",
    color: "#d7fbff"
  },
  buttonWarn: {
    background: "rgba(245,158,11,0.14)",
    border: "1px solid rgba(245,158,11,0.22)",
    color: "#fde68a"
  },
  input: {
    flex: 1,
    height: 50,
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    borderRadius: 18,
    padding: "0 16px",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box"
  },
  progressTrack: {
    width: "100%",
    height: 9,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: (value) => ({
    width: `${Math.max(0, Math.min(100, value))}%`,
    height: "100%",
    background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)"
  }),
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(34,211,238,0.14)",
    color: "#c8fbff",
    border: "1px solid rgba(34,211,238,0.22)",
    fontSize: 12,
    fontWeight: 700
  },
  answerButton: {
    textAlign: "left",
    minHeight: 50,
    padding: "12px 14px",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.82)",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
    lineHeight: 1.35
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    margin: 0
  },
  muted: {
    color: "#94a3b8"
  },
  feedbackGood: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(52,211,153,0.24)",
    background: "rgba(16,185,129,0.12)"
  },
  feedbackBad: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(251,113,133,0.24)",
    background: "rgba(244,63,94,0.12)"
  },
  achievementRow: {
    borderRadius: 18,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.68)"
  },
  profileButton: {
    minHeight: 54,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.82)",
    color: "white",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "left"
  }
};

const defaultUserState = () => ({
  started: false,
  currentDrillId: getRandomDrillId(drills),
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
  drillStats: {}
});

const profileStorageToState = (stored) => ({
  ...defaultUserState(),
  ...stored
});

export default function App() {
  const [profiles, setProfiles] = useState({ Tony: defaultUserState() });
  const [activeProfile, setActiveProfile] = useState("Tony");
  const [newProfileName, setNewProfileName] = useState("");
  const [showProfileManager, setShowProfileManager] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installReady, setInstallReady] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      const loadedProfiles = data.profiles || { Tony: defaultUserState() };
      const restored = {};
      Object.keys(loadedProfiles).forEach((key) => {
        restored[key] = profileStorageToState(loadedProfiles[key]);
      });
      setProfiles(restored);
      setActiveProfile(data.activeProfile || Object.keys(restored)[0] || "Tony");
      setShowProfileManager(data.showProfileManager !== undefined ? data.showProfileManager : true);
    } catch (e) {
      console.error("Failed to load saved progress", e);
    }
  }, []);

  useEffect(() => {
    const payload = {
      profiles,
      activeProfile,
      showProfileManager
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [profiles, activeProfile, showProfileManager]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("Service worker registration failed", err);
        });
      });
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallReady(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setInstallReady(false);
      setDeferredPrompt(null);
    };

    const standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    if (standalone || window.navigator.standalone) {
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const user = profiles[activeProfile] || defaultUserState();
  const {
    started,
    currentDrillId,
    input,
    score,
    streak,
    bestStreak,
    xp,
    hearts,
    feedback,
    answeredIds,
    unlocked,
    mode,
    playMode,
    dailyGoal,
    completedToday,
    wrongIds,
    showReviewOnly,
    comboMultiplier,
    drillStats
  } = user;

  const updateUser = (patch) => {
    setProfiles((prev) => ({
      ...prev,
      [activeProfile]: {
        ...profileStorageToState(prev[activeProfile] || defaultUserState()),
        ...patch
      }
    }));
  };

  const pool = useMemo(() => {
    let filtered = drills;
    if (mode !== "all") filtered = filtered.filter((d) => d.category.toLowerCase() === mode);
    if (showReviewOnly) filtered = filtered.filter((d) => wrongIds.includes(d.id));
    if (playMode === "listening") {
      filtered = filtered.filter((d) => d.type === "listening" || d.category === "Listening");
    }
    return filtered.length ? filtered : drills;
  }, [mode, showReviewOnly, wrongIds, playMode]);

  const current = pool.find((d) => d.id === currentDrillId) || pool[0] || drills[0];
  const levelData = getLevelData(score);
  const progressToNext = Math.min(100, xp % 100);
  const categories = ["all", ...Array.from(new Set(drills.map((d) => d.category.toLowerCase())))];

  useEffect(() => {
    const next = [];
    if (score > 0) next.push("firstWin");
    if (bestStreak >= 5) next.push("streak5");
    if (score >= 100) next.push("score100");
    if (levelData.level >= 3) next.push("level3");
    if (completedToday >= dailyGoal) next.push("dailyGoal");
    if (answeredIds.length >= 5 && hearts > 0) next.push("survivor");
    updateUser({
      unlocked: next,
      comboMultiplier: Math.min(3, 1 + Math.floor(streak / 3) * 0.5)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

  const updateDrillStats = (drillId, wasCorrect) => {
    const nextStats = {};
    Object.keys(drillStats || {}).forEach((key) => {
      nextStats[key] = {
        ...drillStats[key],
        cooldown: Math.max(0, (drillStats[key].cooldown || 0) - 1)
      };
    });

    const existing = nextStats[drillId] || { seen: 0, correct: 0, wrong: 0, streak: 0, cooldown: 0 };
    nextStats[drillId] = {
      seen: existing.seen + 1,
      correct: existing.correct + (wasCorrect ? 1 : 0),
      wrong: existing.wrong + (wasCorrect ? 0 : 1),
      streak: wasCorrect ? existing.streak + 1 : 0,
      cooldown: wasCorrect ? 3 : 1
    };
    updateUser({ drillStats: nextStats });
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

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      updateUser({ feedback: null });
    };

    recognition.onresult = (event) => {
      const transcript = event.results && event.results[0] && event.results[0][0] ? event.results[0][0].transcript : "";
      updateUser({ input: transcript });
    };

    recognition.onerror = () => {
      updateUser({ feedback: { ok: false, text: "Voice input did not work", explanation: "Please try again or type your answer manually." } });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const moveToNextDrill = () => {
    const nextDrill = chooseAdaptiveDrill(pool, drillStats, current.id);
    updateUser({ currentDrillId: nextDrill ? nextDrill.id : getRandomDrillId(pool.length ? pool : drills) });
  };

  const checkAnswer = (submitted) => {
    if (!current || hearts <= 0) return;
    const value = normalize(submitted);
    const isCorrect = current.answers.some((a) => normalize(a) === value);

    if (isCorrect) {
      updateDrillStats(current.id, true);
      const newStreak = streak + 1;
      const gained = Math.round((10 + Math.min(newStreak * 2, 20)) * comboMultiplier);
      updateUser({
        score: score + gained,
        xp: xp + 25,
        streak: newStreak,
        bestStreak: Math.max(bestStreak, newStreak),
        completedToday: completedToday + 1,
        answeredIds: [...answeredIds, current.id],
        wrongIds: wrongIds.filter((id) => id !== current.id),
        feedback: { ok: true, text: `Correct. +${gained} points`, explanation: current.explanation },
        input: ""
      });
      setTimeout(() => {
        updateUser({ feedback: null });
        moveToNextDrill();
      }, 1000);
    } else {
      updateDrillStats(current.id, false);
      updateUser({
        hearts: Math.max(hearts - 1, 0),
        streak: 0,
        wrongIds: wrongIds.includes(current.id) ? wrongIds : [...wrongIds, current.id],
        feedback: {
          ok: false,
          text: "Not quite",
          explanation: `Correct answer: ${current.answers[0]}. ${current.explanation}`
        }
      });
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    checkAnswer(input);
  };

  const saveNow = () => {
    updateUser({ feedback: { ok: true, text: "Progress saved", explanation: "Your progress for this profile has been saved on this device." } });
    setTimeout(() => updateUser({ feedback: null }), 1200);
  };

  const installApp = async () => {
    if (!deferredPrompt) {
      updateUser({ feedback: { ok: false, text: "Install prompt not ready", explanation: "In Chrome, use the browser menu and choose Add to Home screen." } });
      setTimeout(() => updateUser({ feedback: null }), 2200);
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallReady(false);
    if (choice && choice.outcome === "accepted") {
      setIsInstalled(true);
      updateUser({ feedback: { ok: true, text: "App install started", explanation: "Open it from your home screen for the best full-screen experience." } });
    }
  };

  const clearSavedProgress = () => {
    setProfiles((prev) => ({ ...prev, [activeProfile]: defaultUserState() }));
    setShowProfileManager(true);
  };

  const createProfile = () => {
    const clean = newProfileName.trim();
    if (!clean) return;
    if (profiles[clean]) {
      setActiveProfile(clean);
      setShowProfileManager(false);
      setNewProfileName("");
      return;
    }
    setProfiles((prev) => ({ ...prev, [clean]: defaultUserState() }));
    setActiveProfile(clean);
    setShowProfileManager(false);
    setNewProfileName("");
  };

  const buttonStyle = (active, warn) => ({
    ...styles.button,
    ...(active ? styles.buttonActive : {}),
    ...(warn ? styles.buttonWarn : {})
  });

  if (showProfileManager) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.pill}>👤 Choose a learner</div>
          <h1 style={styles.heroTitle}>Who is using the app?</h1>
          <p style={styles.heroText}>Each profile keeps separate progress, streaks, mistakes, and learning pace on this device.</p>
          <div style={styles.card}>
            <div style={{ display: "grid", gap: 10 }}>
              {Object.keys(profiles).map((name) => (
                <button
                  key={name}
                  style={styles.profileButton}
                  onClick={() => {
                    setActiveProfile(name);
                    setShowProfileManager(false);
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{name}</div>
                  <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 13 }}>Level {getLevelData((profiles[name] || {}).score || 0).level} · {(profiles[name] || {}).score || 0} pts</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <input
                style={styles.input}
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Add a new profile name"
              />
              <button style={styles.buttonPrimary} onClick={createProfile}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.row}>
            <div style={styles.pill}>✨ Bali Bahasa Trainer</div>
            <button style={buttonStyle(false, false)} onClick={() => setShowProfileManager(true)}>{activeProfile}</button>
          </div>
          <h1 style={styles.heroTitle}>
            Learn Indonesian for <span style={{ color: "#86efac" }}>real Bali conversations</span>
          </h1>
          <p style={styles.heroText}>
            Scenario-based practice for Bali life. Short drills, adaptive repetition, voice input, and clear corrections focused on real conversation.
          </p>

          <div style={styles.card}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>🏆</div><div style={{ fontWeight: 800, marginTop: 6 }}>5</div><div style={styles.muted}>Levels</div></div>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>🔥</div><div style={{ fontWeight: 800, marginTop: 6 }}>Streaks</div><div style={styles.muted}>Momentum</div></div>
              <div style={styles.smallStat}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontWeight: 800, marginTop: 6 }}>Bali</div><div style={styles.muted}>Focused</div></div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ marginBottom: 8, color: "#cbd5e1", fontWeight: 700 }}>Daily goal</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[5, 10, 20].map((goal) => (
                  <button key={goal} style={goal === dailyGoal ? { ...styles.buttonPrimary, height: 42 } : { ...styles.button, height: 42 }} onClick={() => updateUser({ dailyGoal: goal })}>
                    {goal} drills
                  </button>
                ))}
              </div>
            </div>

            <button style={{ ...styles.buttonPrimary, width: "100%" }} onClick={() => updateUser({ started: true })}>
              Start Training
            </button>
          </div>
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
              <div style={{ ...styles.badge, background: "rgba(251,191,36,0.14)", color: "#fde68a", borderColor: "rgba(251,191,36,0.22)" }}>{score} pts</div>
            </div>
          </div>

          <div style={{ marginTop: 14, ...styles.progressTrack }}><div style={styles.progressFill(progressToNext)} /></div>

          <div style={{ ...styles.statGrid, marginTop: 14 }}>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>🔥</div><div style={{ fontWeight: 800 }}>{streak}</div><div style={styles.muted}>Streak</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>⭐</div><div style={{ fontWeight: 800 }}>{bestStreak}</div><div style={styles.muted}>Best</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>❤️</div><div style={{ fontWeight: 800 }}>{hearts}</div><div style={styles.muted}>Lives</div></div>
            <div style={styles.smallStat}><div style={{ fontSize: 18 }}>⚔️</div><div style={{ fontWeight: 800 }}>x{comboMultiplier.toFixed(1)}</div><div style={styles.muted}>Combo</div></div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ ...styles.row, marginBottom: 6 }}>
              <div style={styles.muted}>Daily goal</div>
              <div style={{ color: "#86efac", fontWeight: 700 }}>{completedToday}/{dailyGoal}</div>
            </div>
            <div style={styles.progressTrack}><div style={styles.progressFill((completedToday / dailyGoal) * 100)} /></div>
          </div>
        </div>

        <div style={{ ...styles.card, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
            <button style={buttonStyle(false, false)} onClick={saveNow}>💾 Save</button>
            <button style={buttonStyle(installReady, false)} onClick={installApp}>{isInstalled ? "✅ Installed" : "📲 Install"}</button>
            <button style={buttonStyle(false, true)} onClick={clearSavedProgress}>↺ Reset</button>
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 8 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                style={{ ...styles.button, whiteSpace: "nowrap", borderRadius: 999, ...(mode === cat ? styles.buttonActive : {}) }}
                onClick={() => {
                  const nextPool = cat === "all" ? drills : drills.filter((d) => d.category.toLowerCase() === cat);
                  updateUser({
                    mode: cat,
                    currentDrillId: getRandomDrillId(nextPool.length ? nextPool : drills),
                    feedback: null,
                    input: ""
                  });
                }}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            <button style={buttonStyle(playMode === "typing", false)} onClick={() => updateUser({ playMode: "typing" })}>🧠 Typing</button>
            <button style={buttonStyle(playMode === "multiple", false)} onClick={() => updateUser({ playMode: "multiple" })}>🎯 Multiple Choice</button>
            <button style={buttonStyle(playMode === "listening", false)} onClick={() => updateUser({ playMode: "listening" })}>🎧 Listening</button>
            <button
              style={buttonStyle(showReviewOnly, true)}
              onClick={() => {
                updateUser({
                  showReviewOnly: !showReviewOnly,
                  currentDrillId: getRandomDrillId(drills)
                });
              }}
            >
              🔁 Review Mistakes
            </button>
          </div>
        </div>

        {current && hearts > 0 ? (
          <div style={styles.card}>
            <div style={styles.row}>
              <div style={styles.badge}>{current.category}</div>
              <div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.15)" }}>Drill {answeredIds.length + 1}</div>
            </div>

            {current.scenario ? (
              <div style={{ marginTop: 14, marginBottom: 8, color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}>
                <strong style={{ color: "#cbd5e1" }}>Scenario:</strong> {current.scenario}
              </div>
            ) : null}
            {current.direction ? (
              <div style={{ marginBottom: 10, color: "#86efac", fontSize: 13, fontWeight: 700 }}>
                {current.direction}
              </div>
            ) : null}

            <h2 style={{ fontSize: 19, lineHeight: 1.35, marginTop: 0, marginBottom: 14, color: "#fff", fontWeight: 800 }}>{current.prompt}</h2>

            {playMode === "typing" ? (
              <div style={{ marginTop: -4, marginBottom: 12, color: "#cbd5e1", fontSize: 14, lineHeight: 1.45 }}>
                Type your answer in <strong>Bahasa Indonesia</strong>.
              </div>
            ) : null}

            {playMode === "typing" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={styles.input}
                  value={input}
                  onChange={(e) => updateUser({ input: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Type your answer in Bahasa Indonesia"
                />
                <button style={{ ...styles.button, width: 50, padding: 0 }} onClick={() => speak(current.type === "listening" ? current.prompt : current.answers[0])}>🔊</button>
                {voiceSupported && (
                  <button style={{ ...styles.button, width: 50, padding: 0 }} onClick={startVoiceInput}>🎤</button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {(current.options || []).map((option) => (
                  <button key={option} style={styles.answerButton} onClick={() => checkAnswer(option)}>{option}</button>
                ))}
                <button style={styles.button} onClick={() => speak(current.type === "listening" ? current.prompt : current.answers[0])}>🔊 Play Audio</button>
              </div>
            )}

            <div style={{ marginTop: 12, ...styles.muted }}>
              {playMode === "typing" ? `Translate into Bahasa Indonesia. Tip: ${current.tip}` : `Tip: ${current.tip}`}
            </div>

            {playMode === "typing" ? (
              <button style={{ ...styles.buttonPrimary, width: "100%", marginTop: 14 }} onClick={handleSubmit}>Check Answer</button>
            ) : null}

            {feedback ? (
              <div style={{ marginTop: 14, ...(feedback.ok ? styles.feedbackGood : styles.feedbackBad) }}>
                <div style={{ fontWeight: 800, color: feedback.ok ? "#a7f3d0" : "#fecdd3" }}>{feedback.text}</div>
                <div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{feedback.explanation}</div>
              </div>
            ) : null}
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{ textAlign: "center", fontSize: 42 }}>{hearts <= 0 ? "💀" : "🎉"}</div>
            <div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginTop: 6 }}>{hearts <= 0 ? "Run Over" : "Session Complete"}</div>
            <p style={{ textAlign: "center", color: "#cbd5e1" }}>
              {hearts <= 0 ? "You ran out of lives. Reset and go again." : "Nice work. Keep building fast recall for Bali conversations."}
            </p>
            <button
              style={{ ...styles.buttonPrimary, width: "100%" }}
              onClick={() => updateUser(defaultUserState())}
            >
              Start New Run
            </button>
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🎯 Achievements</h3>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {achievements.map((a) => {
              const unlockedNow = unlocked.includes(a.key);
              return (
                <div key={a.key} style={{ ...styles.achievementRow, background: unlockedNow ? "rgba(251,191,36,0.10)" : "rgba(15,23,42,0.68)", borderColor: unlockedNow ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.10)" }}>
                  <div style={styles.row}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{a.label}</div>
                      <div style={{ ...styles.muted, fontSize: 14, marginTop: 3 }}>{a.desc}</div>
                    </div>
                    <div style={{ fontSize: 22 }}>{unlockedNow ? "🏆" : "🔒"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🔐 Learning Focus</h3>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <div style={styles.achievementRow}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Current weakness review</div>
              <div style={styles.muted}>{wrongIds.length ? `${wrongIds.length} phrase${wrongIds.length > 1 ? "s" : ""} saved for review mode.` : "No saved mistakes yet. Keep going."}</div>
              <div style={{ ...styles.muted, fontSize: 12, marginTop: 8 }}>Adaptive mode now prioritizes phrases you miss more often and eases off on phrases you keep getting right.</div>
            </div>
            <div style={styles.achievementRow}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Best use on your phone</div>
              <div style={styles.muted}>Do one 5 minute typing run, then one listening or multiple choice run while you are out and about in Bali.</div>
            </div>
            <div style={styles.achievementRow}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Install note</div>
              <div style={styles.muted}>If the Install button does not appear, open this site in Chrome and use the browser menu to add it to your home screen. Proper app icons also need to be uploaded into the public folder as icon-192.png and icon-512.png.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
