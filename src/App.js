import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "bali-bahasa-codesandbox-ready-v1";

const drills = [
  {
    id: 1,
    type: "translate",
    category: "Warung",
    level: 1,
    prompt: "Where do you want to eat?",
    answers: ["mau makan di mana"],
    options: [
      "mau makan di mana",
      "dari mana mau makan",
      "makan dari mana",
      "di mana kamu makan",
    ],
    tip: "Use mau + verb + di mana.",
    explanation: "Natural Indonesian: Mau makan di mana?",
  },
  {
    id: 2,
    type: "translate",
    category: "Daily",
    level: 1,
    prompt: "I do not know, maybe later.",
    answers: [
      "tidak tahu mungkin nanti",
      "nggak tahu mungkin nanti",
      "saya tidak tahu mungkin nanti",
    ],
    options: [
      "nggak tahu mungkin nanti",
      "mungkin saya tidak tahu nanti",
      "saya mungkin tahu nanti",
      "nanti saya tidak mungkin",
    ],
    tip: "Maybe later = mungkin nanti.",
    explanation: "Natural version: Nggak tahu, mungkin nanti.",
  },
  {
    id: 3,
    type: "translate",
    category: "Shopping",
    level: 1,
    prompt: "How much is this?",
    answers: ["ini berapa", "berapa harganya"],
    options: [
      "ini berapa",
      "berapa ini harga",
      "ini harga mana",
      "berapa kamu",
    ],
    tip: "Ini berapa? is very common in Bali.",
    explanation: "Fast everyday version: Ini berapa?",
  },
  {
    id: 4,
    type: "translate",
    category: "Help",
    level: 1,
    prompt: "Can you help me?",
    answers: ["bisa bantu saya", "bisa bantu"],
    options: [
      "bisa bantu saya",
      "kamu bantu saya",
      "saya bantu kamu",
      "bantu saya bisa kamu",
    ],
    tip: "Bisa bantu? is natural and short.",
    explanation: "Natural version: Bisa bantu saya?",
  },
  {
    id: 5,
    type: "translate",
    category: "Warung",
    level: 1,
    prompt: "I want to order food.",
    answers: ["saya mau pesan makanan", "mau pesan makanan"],
    options: [
      "saya mau pesan makanan",
      "makanan saya mau",
      "pesan saya makanan mau",
      "mau saya makanan",
    ],
    tip: "Mau pesan... is a core pattern.",
    explanation: "Natural version: Saya mau pesan makanan.",
  },
  {
    id: 6,
    type: "translate",
    category: "Warung",
    level: 2,
    prompt: "What do you recommend?",
    answers: [
      "yang enak apa",
      "apa yang kamu sarankan",
      "apa yang anda sarankan",
    ],
    options: [
      "yang enak apa",
      "apa enak yang",
      "sarankan saya apa",
      "apa kamu enak",
    ],
    tip: "Yang enak apa? is simple and natural.",
    explanation: "Very natural Bali version: Yang enak apa?",
  },
  {
    id: 7,
    type: "translate",
    category: "Transport",
    level: 2,
    prompt: "I live in Sanur now.",
    answers: [
      "sekarang saya tinggal di sanur",
      "saya tinggal di sanur sekarang",
    ],
    options: [
      "sekarang saya tinggal di sanur",
      "saya tinggal sekarang sanur",
      "sanur tinggal saya sekarang",
      "saya sekarang dari sanur",
    ],
    tip: "Sekarang can go at the start or end.",
    explanation: "Natural version: Sekarang saya tinggal di Sanur.",
  },
  {
    id: 8,
    type: "translate",
    category: "Daily",
    level: 2,
    prompt: "I am a bit busy right now.",
    answers: [
      "sekarang lagi sibuk sedikit",
      "saya lagi sibuk sedikit sekarang",
      "sekarang saya lagi sibuk sedikit",
    ],
    options: [
      "sekarang lagi sibuk sedikit",
      "sibuk saya sedikit sekarang",
      "saya sekarang sibuk mana",
      "lagi sedikit saya sekarang",
    ],
    tip: "Lagi = currently doing or being.",
    explanation: "Natural version: Sekarang lagi sibuk sedikit.",
  },
  {
    id: 9,
    type: "translate",
    category: "Villa",
    level: 2,
    prompt: "Please wait a moment.",
    answers: ["sebentar ya", "tolong tunggu sebentar", "tunggu sebentar"],
    options: [
      "sebentar ya",
      "tunggu ya mana",
      "tolong sedikit tunggu mana",
      "sebentar kamu",
    ],
    tip: "Sebentar ya is friendly and common.",
    explanation: "Friendly version: Sebentar ya.",
  },
  {
    id: 10,
    type: "translate",
    category: "Warung",
    level: 2,
    prompt: "This one, please.",
    answers: ["yang ini ya", "ini ya", "yang ini tolong"],
    options: ["yang ini ya", "ini yang mana", "yang tolong ini", "ini kamu ya"],
    tip: "Yang ini ya is very usable in Bali.",
    explanation: "Natural version: Yang ini ya.",
  },
  {
    id: 11,
    type: "conversation",
    category: "Listening",
    level: 3,
    prompt: "Sudah makan?",
    answers: ["sudah terima kasih", "belum nanti", "belum makan"],
    options: [
      "Sudah, terima kasih",
      "Saya dari Australia",
      "Mau pesan makanan",
      "Ini berapa",
    ],
    tip: "Choose a natural short reply.",
    explanation: "Common replies: Sudah, terima kasih. Belum, nanti.",
  },
  {
    id: 12,
    type: "conversation",
    category: "Small Talk",
    level: 3,
    prompt: "Kamu dari mana?",
    answers: ["saya dari australia", "dari australia"],
    options: [
      "Saya dari Australia",
      "Saya tinggal di warung",
      "Ini berapa",
      "Nanti saja",
    ],
    tip: "Drop words to sound more natural.",
    explanation: "Natural version: Saya dari Australia.",
  },
  {
    id: 13,
    type: "translate",
    category: "Villa",
    level: 3,
    prompt: "Please turn off the air conditioner when you go out.",
    answers: [
      "tolong matikan ac kalau keluar",
      "kalau keluar tolong matikan ac",
    ],
    options: [
      "tolong matikan ac kalau keluar",
      "keluar ac tolong mati",
      "tolong ac keluar mati",
      "matikan keluar saya",
    ],
    tip: "Kalau = if or when.",
    explanation: "Natural version: Tolong matikan AC kalau keluar.",
  },
  {
    id: 14,
    type: "translate",
    category: "Driver",
    level: 3,
    prompt: "Can you pick us up at 7 tonight?",
    answers: [
      "bisa jemput kami jam 7 malam ini",
      "bisa jemput kita jam 7 malam ini",
    ],
    options: [
      "bisa jemput kami jam 7 malam ini",
      "jemput bisa malam kami",
      "jam 7 bisa kamu kami",
      "malam ini kamu dari mana",
    ],
    tip: "Jam 7 malam ini = at 7 tonight.",
    explanation: "Natural version: Bisa jemput kami jam 7 malam ini?",
  },
  {
    id: 15,
    type: "translate",
    category: "Staff",
    level: 3,
    prompt: "Have the guests arrived yet?",
    answers: ["tamunya sudah datang belum", "sudah datang belum tamunya"],
    options: [
      "tamunya sudah datang belum",
      "tamu datang dari mana",
      "sudah tamu di mana",
      "belum mana datang",
    ],
    tip: "Sudah ... belum is a very useful pattern.",
    explanation: "Natural version: Tamunya sudah datang belum?",
  },
  {
    id: 16,
    type: "listening",
    category: "Listening",
    level: 4,
    prompt: "Nanti saya kirim pesan ya, sekarang lagi sibuk sedikit.",
    answers: [
      "i will message later i am a bit busy right now",
      "ill message later im a bit busy right now",
    ],
    options: [
      "I will message later, I am a bit busy right now",
      "Where do you want to eat?",
      "How much is this?",
      "I am from Australia",
    ],
    tip: "Listen and choose the correct meaning.",
    explanation: "Meaning: I will message later, I am a bit busy right now.",
  },
  {
    id: 17,
    type: "listening",
    category: "Listening",
    level: 4,
    prompt: "Tolong tunggu sebentar ya.",
    answers: ["please wait a moment", "please wait a moment."],
    options: [
      "Please wait a moment",
      "Can you help me?",
      "Where are you from?",
      "This one please",
    ],
    tip: "Sebentar = a moment.",
    explanation: "Meaning: Please wait a moment.",
  },
  {
    id: 18,
    type: "listening",
    category: "Listening",
    level: 4,
    prompt: "Yang enak apa di sini?",
    answers: ["what is good here", "what do you recommend here"],
    options: [
      "What is good here?",
      "How much is this?",
      "I live in Sanur now",
      "We will go later",
    ],
    tip: "Enak = tasty / good.",
    explanation: "Meaning: What is good here?",
  },
];

const achievements = [
  {
    key: "firstWin",
    label: "First Win",
    desc: "Get your first correct answer",
  },
  { key: "streak5", label: "Hot Streak", desc: "Reach a streak of 5" },
  { key: "score100", label: "Century", desc: "Score 100 points" },
  { key: "level3", label: "Conversational Spark", desc: "Reach level 3" },
  {
    key: "dailyGoal",
    label: "Daily Discipline",
    desc: "Finish your daily goal",
  },
  { key: "survivor", label: "Survivor", desc: "Finish a run with lives left" },
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
    const stats = drillStats[item.id] || {
      seen: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      cooldown: 0,
    };
    const base = 1;
    const weaknessBoost =
      stats.wrong * 3 + Math.max(0, stats.seen - stats.correct) * 1.5;
    const masteryPenalty = Math.min(stats.streak * 0.6, 2.5);
    const cooldownPenalty = stats.cooldown || 0;
    const weight = Math.max(
      1,
      base + weaknessBoost - masteryPenalty - cooldownPenalty
    );
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
    background:
      "linear-gradient(135deg, #06111f 0%, #0f172a 45%, #062a27 100%)",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    padding: 16,
    boxSizing: "border-box",
  },
  wrap: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    paddingBottom: 28,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
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
    fontWeight: 700,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 1.08,
    margin: "8px 0 0",
    fontWeight: 800,
  },
  heroText: {
    color: "#b8c5d7",
    lineHeight: 1.5,
    margin: 0,
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  smallStat: {
    background: "rgba(15,23,42,0.75)",
    borderRadius: 18,
    padding: 12,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  button: {
    height: 46,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  buttonPrimary: {
    height: 48,
    borderRadius: 18,
    border: "none",
    background: "#10b981",
    color: "white",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  buttonActive: {
    background: "rgba(34,211,238,0.18)",
    border: "1px solid rgba(103,232,249,0.28)",
    color: "#d7fbff",
  },
  buttonWarn: {
    background: "rgba(245,158,11,0.14)",
    border: "1px solid rgba(245,158,11,0.22)",
    color: "#fde68a",
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
    boxSizing: "border-box",
  },
  progressTrack: {
    width: "100%",
    height: 9,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: (value) => ({
    width: `${Math.max(0, Math.min(100, value))}%`,
    height: "100%",
    background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
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
    fontWeight: 700,
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
    lineHeight: 1.35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    margin: 0,
  },
  muted: {
    color: "#94a3b8",
  },
  feedbackGood: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(52,211,153,0.24)",
    background: "rgba(16,185,129,0.12)",
  },
  feedbackBad: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(251,113,133,0.24)",
    background: "rgba(244,63,94,0.12)",
  },
  achievementRow: {
    borderRadius: 18,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.68)",
  },
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentDrillId, setCurrentDrillId] = useState(() =>
    getRandomDrillId(drills)
  );
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [unlocked, setUnlocked] = useState([]);
  const [mode, setMode] = useState("all");
  const [playMode, setPlayMode] = useState("typing");
  const [dailyGoal, setDailyGoal] = useState(10);
  const [completedToday, setCompletedToday] = useState(0);
  const [wrongIds, setWrongIds] = useState([]);
  const [showReviewOnly, setShowReviewOnly] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [drillStats, setDrillStats] = useState({});
  const recognitionRef = useRef(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      setStarted(Boolean(data.started));
      setCurrentDrillId(data.currentDrillId || getRandomDrillId(drills));
      setScore(data.score || 0);
      setStreak(data.streak || 0);
      setBestStreak(data.bestStreak || 0);
      setXp(data.xp || 0);
      setHearts(data.hearts || 3);
      setAnsweredIds(Array.isArray(data.answeredIds) ? data.answeredIds : []);
      setUnlocked(Array.isArray(data.unlocked) ? data.unlocked : []);
      setMode(data.mode || "all");
      setPlayMode(data.playMode || "typing");
      setDailyGoal(data.dailyGoal || 10);
      setCompletedToday(data.completedToday || 0);
      setWrongIds(Array.isArray(data.wrongIds) ? data.wrongIds : []);
      setShowReviewOnly(Boolean(data.showReviewOnly));
      setComboMultiplier(data.comboMultiplier || 1);
      setDrillStats(data.drillStats || {});
    } catch (e) {
      console.error("Failed to load saved progress", e);
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    const payload = {
      started,
      currentDrillId,
      score,
      streak,
      bestStreak,
      xp,
      hearts,
      answeredIds,
      unlocked,
      mode,
      playMode,
      dailyGoal,
      completedToday,
      wrongIds,
      showReviewOnly,
      comboMultiplier,
      drillStats,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    started,
    currentDrillId,
    score,
    streak,
    bestStreak,
    xp,
    hearts,
    answeredIds,
    unlocked,
    mode,
    playMode,
    dailyGoal,
    completedToday,
    wrongIds,
    showReviewOnly,
    comboMultiplier,
    drillStats,
  ]);

  const pool = useMemo(() => {
    let filtered = drills;
    if (mode !== "all")
      filtered = filtered.filter((d) => d.category.toLowerCase() === mode);
    if (showReviewOnly)
      filtered = filtered.filter((d) => wrongIds.includes(d.id));
    if (playMode === "listening") {
      filtered = filtered.filter(
        (d) => d.type === "listening" || d.category === "Listening"
      );
    }
    return filtered.length ? filtered : drills;
  }, [mode, showReviewOnly, wrongIds, playMode]);

  const current =
    pool.find((d) => d.id === currentDrillId) || pool[0] || drills[0];
  const levelData = getLevelData(score);
  const progressToNext = Math.min(100, xp % 100);
  const categories = [
    "all",
    ...Array.from(new Set(drills.map((d) => d.category.toLowerCase()))),
  ];

  useEffect(() => {
    const next = [];
    if (score > 0) next.push("firstWin");
    if (bestStreak >= 5) next.push("streak5");
    if (score >= 100) next.push("score100");
    if (levelData.level >= 3) next.push("level3");
    if (completedToday >= dailyGoal) next.push("dailyGoal");
    if (answeredIds.length >= 5 && hearts > 0) next.push("survivor");
    setUnlocked(next);
    setComboMultiplier(Math.min(3, 1 + Math.floor(streak / 3) * 0.5));
  }, [
    score,
    bestStreak,
    levelData.level,
    completedToday,
    dailyGoal,
    answeredIds.length,
    hearts,
    streak,
  ]);

  const updateDrillStats = (drillId, wasCorrect) => {
    setDrillStats((prev) => {
      const nextStats = {};
      Object.keys(prev).forEach((key) => {
        nextStats[key] = {
          ...prev[key],
          cooldown: Math.max(0, (prev[key].cooldown || 0) - 1),
        };
      });

      const existing = nextStats[drillId] || {
        seen: 0,
        correct: 0,
        wrong: 0,
        streak: 0,
        cooldown: 0,
      };
      nextStats[drillId] = {
        seen: existing.seen + 1,
        correct: existing.correct + (wasCorrect ? 1 : 0),
        wrong: existing.wrong + (wasCorrect ? 0 : 1),
        streak: wasCorrect ? existing.streak + 1 : 0,
        cooldown: wasCorrect ? 3 : 1,
      };
      return nextStats;
    });
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = current.type === "listening" ? "id-ID" : "id-ID";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSaveNotice("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results && event.results[0] && event.results[0][0]
          ? event.results[0][0].transcript
          : "";
      setInput(transcript);
      setSaveNotice(`Heard: ${transcript}`);
      setTimeout(() => setSaveNotice(""), 1800);
    };

    recognition.onerror = () => {
      setSaveNotice("Voice input did not work. Please try again.");
      setTimeout(() => setSaveNotice(""), 1800);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const moveToNextDrill = () => {
    const nextDrill = chooseAdaptiveDrill(pool, drillStats, current.id);
    setCurrentDrillId(
      nextDrill ? nextDrill.id : getRandomDrillId(pool.length ? pool : drills)
    );
  };

  const checkAnswer = (submitted) => {
    if (!current || hearts <= 0) return;
    const value = normalize(submitted);
    const isCorrect = current.answers.some((a) => normalize(a) === value);

    if (isCorrect) {
      updateDrillStats(current.id, true);
      const newStreak = streak + 1;
      const gained = Math.round(
        (10 + Math.min(newStreak * 2, 20)) * comboMultiplier
      );
      setScore((s) => s + gained);
      setXp((x) => x + 25);
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setCompletedToday((c) => c + 1);
      setAnsweredIds((prev) => [...prev, current.id]);
      setWrongIds((prev) => prev.filter((id) => id !== current.id));
      setFeedback({
        ok: true,
        text: `Correct. +${gained} points`,
        explanation: current.explanation,
      });
      setInput("");
      setTimeout(() => {
        setFeedback(null);
        moveToNextDrill();
      }, 900);
    } else {
      updateDrillStats(current.id, false);
      setHearts((h) => Math.max(h - 1, 0));
      setStreak(0);
      setWrongIds((prev) =>
        prev.includes(current.id) ? prev : [...prev, current.id]
      );
      setFeedback({
        ok: false,
        text: "Not quite",
        explanation: `${current.explanation} Tip: ${current.tip}`,
      });
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    checkAnswer(input);
  };

  const saveNow = () => {
    setSaveNotice("Progress saved.");
    setTimeout(() => setSaveNotice(""), 1200);
  };

  const clearSavedProgress = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSaveNotice("Saved progress cleared.");
    setTimeout(() => setSaveNotice(""), 1200);
    setStarted(false);
    setCurrentDrillId(getRandomDrillId(drills));
    setInput("");
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setXp(0);
    setHearts(3);
    setFeedback(null);
    setAnsweredIds([]);
    setUnlocked([]);
    setMode("all");
    setPlayMode("typing");
    setDailyGoal(10);
    setCompletedToday(0);
    setWrongIds([]);
    setShowReviewOnly(false);
    setComboMultiplier(1);
    setDrillStats({});
  };

  const buttonStyle = (active, warn) => ({
    ...styles.button,
    ...(active ? styles.buttonActive : {}),
    ...(warn ? styles.buttonWarn : {}),
  });

  if (!started) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.pill}>✨ Bali Bahasa Trainer</div>
          <h1 style={styles.heroTitle}>
            Learn Indonesian for{" "}
            <span style={{ color: "#86efac" }}>real Bali conversations</span>
          </h1>
          <p style={styles.heroText}>
            Full mobile-friendly trainer with adaptive drills, voice input,
            saved progress, achievements, review mode, listening practice, and
            Bali-specific conversation prompts.
          </p>

          <div style={styles.card}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div style={styles.smallStat}>
                <div style={{ fontSize: 20 }}>🏆</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>5</div>
                <div style={styles.muted}>Levels</div>
              </div>
              <div style={styles.smallStat}>
                <div style={{ fontSize: 20 }}>🔥</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>Streaks</div>
                <div style={styles.muted}>Momentum</div>
              </div>
              <div style={styles.smallStat}>
                <div style={{ fontSize: 20 }}>💬</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>Bali</div>
                <div style={styles.muted}>Focused</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div
                style={{ marginBottom: 8, color: "#cbd5e1", fontWeight: 700 }}
              >
                Daily goal
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {[5, 10, 20].map((goal) => (
                  <button
                    key={goal}
                    style={
                      goal === dailyGoal
                        ? { ...styles.buttonPrimary, height: 42 }
                        : { ...styles.button, height: 42 }
                    }
                    onClick={() => setDailyGoal(goal)}
                  >
                    {goal} drills
                  </button>
                ))}
              </div>
            </div>

            <button
              style={{ ...styles.buttonPrimary, width: "100%" }}
              onClick={() => setStarted(true)}
            >
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
              <div
                style={{
                  color: "#86efac",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {levelData.title}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>
                Level {levelData.level}
              </div>
            </div>
            <div
              style={{
                ...styles.badge,
                background: "rgba(251,191,36,0.14)",
                color: "#fde68a",
                borderColor: "rgba(251,191,36,0.22)",
              }}
            >
              {score} pts
            </div>
          </div>

          <div style={{ marginTop: 14, ...styles.progressTrack }}>
            <div style={styles.progressFill(progressToNext)} />
          </div>

          <div style={{ ...styles.statGrid, marginTop: 14 }}>
            <div style={styles.smallStat}>
              <div style={{ fontSize: 18 }}>🔥</div>
              <div style={{ fontWeight: 800 }}>{streak}</div>
              <div style={styles.muted}>Streak</div>
            </div>
            <div style={styles.smallStat}>
              <div style={{ fontSize: 18 }}>⭐</div>
              <div style={{ fontWeight: 800 }}>{bestStreak}</div>
              <div style={styles.muted}>Best</div>
            </div>
            <div style={styles.smallStat}>
              <div style={{ fontSize: 18 }}>❤️</div>
              <div style={{ fontWeight: 800 }}>{hearts}</div>
              <div style={styles.muted}>Lives</div>
            </div>
            <div style={styles.smallStat}>
              <div style={{ fontSize: 18 }}>⚔️</div>
              <div style={{ fontWeight: 800 }}>
                x{comboMultiplier.toFixed(1)}
              </div>
              <div style={styles.muted}>Combo</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ ...styles.row, marginBottom: 6 }}>
              <div style={styles.muted}>Daily goal</div>
              <div style={{ color: "#86efac", fontWeight: 700 }}>
                {completedToday}/{dailyGoal}
              </div>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={styles.progressFill((completedToday / dailyGoal) * 100)}
              />
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, padding: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <button style={buttonStyle(false, false)} onClick={saveNow}>
              💾 Save Progress
            </button>
            <button
              style={buttonStyle(false, true)}
              onClick={clearSavedProgress}
            >
              ↺ Reset Saved
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.button,
                  whiteSpace: "nowrap",
                  borderRadius: 999,
                  ...(mode === cat ? styles.buttonActive : {}),
                }}
                onClick={() => {
                  setMode(cat);
                  const nextPool =
                    cat === "all"
                      ? drills
                      : drills.filter((d) => d.category.toLowerCase() === cat);
                  setCurrentDrillId(
                    getRandomDrillId(nextPool.length ? nextPool : drills)
                  );
                  setFeedback(null);
                  setInput("");
                }}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            <button
              style={buttonStyle(playMode === "typing", false)}
              onClick={() => setPlayMode("typing")}
            >
              🧠 Typing
            </button>
            <button
              style={buttonStyle(playMode === "multiple", false)}
              onClick={() => setPlayMode("multiple")}
            >
              🎯 Multiple Choice
            </button>
            <button
              style={buttonStyle(playMode === "listening", false)}
              onClick={() => setPlayMode("listening")}
            >
              🎧 Listening
            </button>
            <button
              style={buttonStyle(showReviewOnly, true)}
              onClick={() => {
                setShowReviewOnly((v) => !v);
                setCurrentDrillId(getRandomDrillId(drills));
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
              <div
                style={{
                  ...styles.badge,
                  background: "transparent",
                  color: "#cbd5e1",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                Drill {answeredIds.length + 1}
              </div>
            </div>

            <h2
              style={{
                fontSize: 19,
                lineHeight: 1.35,
                marginTop: 14,
                marginBottom: 14,
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {current.prompt}
            </h2>

            {playMode === "typing" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Type your answer"
                />
                <button
                  style={{ ...styles.button, width: 50, padding: 0 }}
                  onClick={() =>
                    speak(
                      current.type === "listening"
                        ? current.prompt
                        : current.answers[0]
                    )
                  }
                >
                  🔊
                </button>
                {voiceSupported && (
                  <button
                    style={{
                      ...styles.button,
                      width: 50,
                      padding: 0,
                      background: isListening
                        ? "rgba(16,185,129,0.30)"
                        : "rgba(255,255,255,0.05)",
                    }}
                    onClick={startVoiceInput}
                  >
                    🎤
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {(current.options || []).map((option) => (
                  <button
                    key={option}
                    style={styles.answerButton}
                    onClick={() => checkAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
                <button
                  style={styles.button}
                  onClick={() =>
                    speak(
                      current.type === "listening"
                        ? current.prompt
                        : current.answers[0]
                    )
                  }
                >
                  🔊 Play Audio
                </button>
              </div>
            )}

            <div style={{ marginTop: 12, ...styles.muted }}>
              Tip: {current.tip}
            </div>
            {saveNotice ? (
              <div style={{ marginTop: 8, color: "#86efac", fontSize: 13 }}>
                {saveNotice}
              </div>
            ) : null}

            {playMode === "typing" ? (
              <button
                style={{
                  ...styles.buttonPrimary,
                  width: "100%",
                  marginTop: 14,
                }}
                onClick={handleSubmit}
              >
                Check Answer
              </button>
            ) : null}

            {feedback ? (
              <div
                style={{
                  marginTop: 14,
                  ...(feedback.ok ? styles.feedbackGood : styles.feedbackBad),
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: feedback.ok ? "#a7f3d0" : "#fecdd3",
                  }}
                >
                  {feedback.text}
                </div>
                <div
                  style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}
                >
                  {feedback.explanation}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{ textAlign: "center", fontSize: 42 }}>
              {hearts <= 0 ? "💀" : "🎉"}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 26,
                fontWeight: 800,
                marginTop: 6,
              }}
            >
              {hearts <= 0 ? "Run Over" : "Session Complete"}
            </div>
            <p style={{ textAlign: "center", color: "#cbd5e1" }}>
              {hearts <= 0
                ? "You ran out of lives. Reset and go again."
                : "Nice work. Keep building fast recall for Bali conversations."}
            </p>
            <button
              style={{ ...styles.buttonPrimary, width: "100%" }}
              onClick={() => {
                setCurrentDrillId(getRandomDrillId(drills));
                setInput("");
                setScore(0);
                setStreak(0);
                setBestStreak(0);
                setXp(0);
                setHearts(3);
                setFeedback(null);
                setAnsweredIds([]);
                setUnlocked([]);
                setCompletedToday(0);
                setWrongIds([]);
                setShowReviewOnly(false);
                setPlayMode("typing");
                setComboMultiplier(1);
              }}
            >
              Start New Run
            </button>
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🎯 Achievements</h3>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {achievements.map((a) => {
              const isUnlocked = unlocked.includes(a.key);
              return (
                <div
                  key={a.key}
                  style={{
                    ...styles.achievementRow,
                    background: isUnlocked
                      ? "rgba(251,191,36,0.10)"
                      : "rgba(15,23,42,0.68)",
                    borderColor: isUnlocked
                      ? "rgba(251,191,36,0.22)"
                      : "rgba(255,255,255,0.10)",
                  }}
                >
                  <div style={styles.row}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{a.label}</div>
                      <div
                        style={{ ...styles.muted, fontSize: 14, marginTop: 3 }}
                      >
                        {a.desc}
                      </div>
                    </div>
                    <div style={{ fontSize: 22 }}>
                      {isUnlocked ? "🏆" : "🔒"}
                    </div>
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
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                Current weakness review
              </div>
              <div style={styles.muted}>
                {wrongIds.length
                  ? `${wrongIds.length} phrase${
                      wrongIds.length > 1 ? "s" : ""
                    } saved for review mode.`
                  : "No saved mistakes yet. Keep going."}
              </div>
              <div style={{ ...styles.muted, fontSize: 12, marginTop: 8 }}>
                Adaptive mode now prioritizes phrases you miss more often and
                eases off on phrases you keep getting right.
              </div>
            </div>
            <div style={styles.achievementRow}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                Best use on your phone
              </div>
              <div style={styles.muted}>
                Do one 5 minute typing run, then one listening or multiple
                choice run while you are out and about in Bali.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
