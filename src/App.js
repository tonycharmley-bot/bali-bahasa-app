import React, { useEffect, useMemo, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import baliBahasaDataset from "./dataset";

const APP_VERSION = "1.3.0";
const APP_VERSION_LABEL = "Version 1.3 — Dataset Connected";
const STORAGE_KEY = "bali-bahasa-profiles-v6";

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
  if (score >= 1000) return { level: 5, title: "Bali Conversation Flow" };
  if (score >= 650) return { level: 4, title: "Local Chat Mode" };
  if (score >= 350) return { level: 3, title: "Conversation Builder" };
  if (score >= 120) return { level: 2, title: "Pattern Starter" };
  return { level: 1, title: "First Steps" };
}

function flattenPhrases(dataset) {
  const topics = dataset?.topics || [];
  const all = [];
  topics.forEach((topic) => {
    (topic.phrases || []).forEach((phrase) => {
      all.push({
        ...phrase,
        topicId: topic.id,
        category: topic.label,
        topicPriority: topic.priority || 99
      });
    });
  });
  return all;
}

function flattenWords(dataset) {
  const topics = dataset?.topics || [];
  const all = [];
  topics.forEach((topic) => {
    (topic.coreWords || []).forEach((word) => {
      all.push({
        ...word,
        topicId: topic.id,
        category: topic.label,
        topicPriority: topic.priority || 99
      });
    });
  });
  return all;
}

function flattenConversationChains(dataset) {
  const topics = dataset?.topics || [];
  const chains = [];
  topics.forEach((topic) => {
    (topic.conversationChains || []).forEach((chain) => {
      chains.push({
        ...chain,
        topicId: topic.id,
        category: topic.label,
        topicPriority: topic.priority || 99
      });
    });
  });
  return chains;
}

function createDistractors(correctPhrase, allPhrases, count = 3) {
  const sameTopic = allPhrases.filter(
    (item) => item.id !== correctPhrase.id && item.topicId === correctPhrase.topicId
  );
  const otherTopics = allPhrases.filter(
    (item) => item.id !== correctPhrase.id && item.topicId !== correctPhrase.topicId
  );
  return shuffleArray([...sameTopic, ...otherTopics])
    .slice(0, count)
    .map((item) => item.idn);
}

function createTranslationDrills(dataset) {
  const phrases = flattenPhrases(dataset);
  return phrases.map((phrase, index) => {
    const distractors = createDistractors(phrase, phrases, 3);
    return {
      id: `p-${phrase.id || index}`,
      sourceId: phrase.id,
      type: "translate",
      category: phrase.category,
      topicId: phrase.topicId,
      scenario: phrase.category,
      direction: "Translate into Bahasa Indonesia",
      prompt: phrase.eng,
      answers: [phrase.idn],
      options: shuffleArray([phrase.idn, ...distractors]),
      tip: phrase.pattern || "Focus on the phrase pattern.",
      explanation: `${phrase.idn} = ${phrase.eng}`,
      breakdown: phrase.breakdown || [],
      level: phrase.level || 1,
      tags: phrase.tags || []
    };
  });
}

function createListeningDrills(dataset) {
  const phrases = flattenPhrases(dataset);
  return phrases.map((phrase, index) => {
    const distractors = shuffleArray(phrases.filter((item) => item.id !== phrase.id))
      .slice(0, 3)
      .map((item) => item.eng);
    return {
      id: `l-${phrase.id || index}`,
      sourceId: phrase.id,
      type: "listening",
      category: phrase.category,
      topicId: phrase.topicId,
      scenario: phrase.category,
      direction: "Choose the correct meaning",
      prompt: phrase.idn,
      answers: [normalize(phrase.eng)],
      options: shuffleArray([phrase.eng, ...distractors]),
      tip: "Listen and choose the English meaning.",
      explanation: `${phrase.idn} = ${phrase.eng}`,
      breakdown: phrase.breakdown || [],
      level: phrase.level || 1,
      tags: phrase.tags || []
    };
  });
}

function createWordDrills(dataset) {
  const words = flattenWords(dataset);
  return words.map((word, index) => {
    const distractors = shuffleArray(words.filter((item) => item.id !== word.id))
      .slice(0, 3)
      .map((item) => item.eng);
    return {
      id: `w-${word.id || index}`,
      sourceId: word.id,
      type: "word",
      category: word.category,
      topicId: word.topicId,
      scenario: word.category,
      direction: "Choose the correct meaning",
      prompt: word.idn,
      answers: [normalize(word.eng)],
      options: shuffleArray([word.eng, ...distractors]),
      tip: `${word.type || "word"} · ${word.tags?.join(", ") || "core vocabulary"}`,
      explanation: `${word.idn} = ${word.eng}`,
      breakdown: [[word.idn, word.eng]],
      level: word.level || 1,
      tags: word.tags || []
    };
  });
}

function createConversationDrills(dataset) {
  const chains = flattenConversationChains(dataset);
  const userTurns = [];

  chains.forEach((chain) => {
    (chain.turns || []).forEach((turn, index) => {
      if (turn.speaker !== "user") return;
      const previousTurn = chain.turns[index - 1];
      const otherUserTurns = chains.flatMap((otherChain) =>
        (otherChain.turns || [])
          .filter((item) => item.speaker === "user" && item.idn !== turn.idn)
          .map((item) => item.idn)
      );

      userTurns.push({
        id: `c-${chain.id}-${index}`,
        sourceId: chain.id,
        type: "conversation",
        category: chain.category,
        topicId: chain.topicId,
        scenario: chain.title || chain.category,
        direction: "Choose the best reply",
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

  return userTurns;
}

function buildDrills(dataset) {
  const translate = createTranslationDrills(dataset);
  const listening = createListeningDrills(dataset);
  const words = createWordDrills(dataset);
  const conversation = createConversationDrills(dataset);
  return { translate, listening, words, conversation, all: [...translate, ...listening, ...words] };
}

const generatedContent = buildDrills(baliBahasaDataset);
const topicList = [
  { id: "all", label: "All" },
  ...(baliBahasaDataset?.topics || []).map((topic) => ({ id: topic.id, label: topic.label }))
];

function getRandomDrillId(items) {
  if (!items.length) return "";
  return items[Math.floor(Math.random() * items.length)].id;
}

function chooseAdaptiveDrill(items, stats, excludeId) {
  const candidates = items.filter((item) => item.id !== excludeId);
  const source = candidates.length ? candidates : items;
  if (!source.length) return null;

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
    currentDrillId: getRandomDrillId(generatedContent.translate),
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
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #0f172a 45%, #062a27 100%)", color: "#fff", fontFamily: "Inter, Arial, sans-serif", padding: 16, boxSizing: "border-box" },
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
    setProfiles((prev) => ({ ...prev, [activeProfile]: { ...blankUserState(), ...(prev[activeProfile] || {}), ...patch } }));
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
    if (currentUser.playMode === "conversation") return generatedContent.conversation;
    if (currentUser.playMode === "listening") return generatedContent.listening;
    if (currentUser.playMode === "words") return generatedContent.words;

    let filtered = generatedContent.translate;
    if (currentUser.mode !== "all") filtered = filtered.filter((d) => d.topicId === currentUser.mode);
    if (currentUser.showReviewOnly) filtered = filtered.filter((d) => currentUser.wrongIds.includes(d.id));
    return filtered.length ? filtered : generatedContent.translate;
  }, [currentUser.mode, currentUser.showReviewOnly, currentUser.wrongIds, currentUser.playMode]);

  const current = useMemo(() => pool.find((d) => d.id === currentUser.currentDrillId) || pool[0] || generatedContent.translate[0], [pool, currentUser.currentDrillId]);

  const currentOptions = useMemo(() => {
    const key = `${currentUser.playMode}-${current?.id}`;
    const saved = currentUser.shuffledOptions?.[key];
    if (saved && saved.length) return saved;
    return shuffleArray(current?.options || []);
  }, [current, currentUser.playMode, currentUser.shuffledOptions]);

  useEffect(() => {
    if (!current || currentUser.playMode === "photo") return;
    const key = `${currentUser.playMode}-${current.id}`;
    if (!currentUser.shuffledOptions?.[key]) {
      updateUser({ shuffledOptions: { ...(currentUser.shuffledOptions || {}), [key]: shuffleArray(current.options || []) } });
    }
  }, [current?.id, currentUser.playMode]);

  const levelData = getLevelData(currentUser.score);
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

  const switchMode = (playMode) => {
    const pools = { typing: generatedContent.translate, multiple: generatedContent.translate, listening: generatedContent.listening, words: generatedContent.words, conversation: generatedContent.conversation };
    const nextPool = pools[playMode] || generatedContent.translate;
    updateUser({ playMode, currentDrillId: getRandomDrillId(nextPool), shuffledOptions: {}, feedback: null, input: "" });
  };

  const updateDrillStats = (drillId, wasCorrect) => {
    const previousStats = currentUser.drillStats || {};
    const existing = previousStats[drillId] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
    updateUser({ drillStats: { ...previousStats, [drillId]: { seen: existing.seen + 1, correct: existing.correct + (wasCorrect ? 1 : 0), wrong: existing.wrong + (wasCorrect ? 0 : 1), streak: wasCorrect ? existing.streak + 1 : 0 } } });
  };

  const moveToNextDrill = () => {
    const next = chooseAdaptiveDrill(pool, currentUser.drillStats || {}, current?.id);
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
    updateUser({ phrasebook: [newItem, ...(currentUser.phrasebook || [])], feedback: { ok: true, text: "Saved to phrasebook", explanation: "You can review this phrase later." } });
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
            <div key={`${phrase}-${meaning}`} style={{ color: "#cbd5e1", fontSize: 14 }}><strong style={{ color: "#86efac" }}>{phrase}</strong> = {meaning}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderPhotoMode = () => (
    <div style={styles.card}>
      <div style={styles.row}><div style={styles.badge}>Photo Scan</div><div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.15)" }}>OCR phrase capture</div></div>
      <h2 style={{ fontSize: 22, lineHeight: 1.25, marginTop: 14, marginBottom: 8, color: "#fff", fontWeight: 800 }}>Scan Indonesian text from a photo</h2>
      <p style={{ ...styles.muted, lineHeight: 1.5 }}>Use this for menus, signs, WhatsApp screenshots, receipts, or villa messages.</p>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoScan} style={{ display: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 14 }}><button style={styles.buttonPrimary} onClick={() => fileInputRef.current?.click()}>📷 Take / Upload Photo</button><button style={styles.button} onClick={clearScan}>Clear</button></div>
      {currentUser.scanStatus ? <div style={{ marginTop: 12, color: "#86efac", fontSize: 14 }}>{currentUser.scanStatus}</div> : null}
      {currentUser.scanText ? <div style={{ marginTop: 14, ...styles.achievementRow }}><div style={{ fontWeight: 800, marginBottom: 8 }}>Extracted Text</div><textarea value={currentUser.scanText} onChange={(event) => updateUser({ scanText: event.target.value })} style={{ width: "100%", minHeight: 130, resize: "vertical", borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(15,23,42,0.82)", color: "white", padding: 12, boxSizing: "border-box", fontSize: 15, lineHeight: 1.45 }} /><button style={{ ...styles.buttonPrimary, width: "100%", marginTop: 10 }} onClick={saveScannedPhrase}>Save to Phrasebook</button></div> : null}
      <div style={{ marginTop: 16 }}><h3 style={styles.sectionTitle}>📘 My Phrasebook</h3><div style={{ display: "grid", gap: 8, marginTop: 12 }}>{(currentUser.phrasebook || []).length ? currentUser.phrasebook.map((item) => <div key={item.id} style={styles.achievementRow}><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.45, color: "#e5edf7" }}>{item.text}</div><div style={{ display: "flex", gap: 8, marginTop: 10 }}><button style={styles.button} onClick={() => speak(item.text)}>🔊 Listen</button><button style={buttonStyle(false, true)} onClick={() => removePhrasebookItem(item.id)}>Delete</button></div></div>) : <div style={{ ...styles.muted, lineHeight: 1.5 }}>No saved phrases yet. Scan a menu, sign, or message to start building your phrasebook.</div>}</div></div>
    </div>
  );

  if (showProfileManager) {
    return (
      <div style={styles.page}><div style={styles.wrap}><div style={styles.pill}>👤 Choose a learner</div><h1 style={styles.heroTitle}>Who is using the app?</h1><p style={styles.heroText}>Each profile keeps separate progress, streaks, mistakes, phrasebook, and learning pace on this device.</p><div style={styles.card}><div style={{ display: "grid", gap: 10 }}>{Object.keys(profiles).map((name) => <button key={name} style={styles.profileButton} onClick={() => { setActiveProfile(name); setShowProfileManager(false); }}><div style={{ fontWeight: 800 }}>{name}</div><div style={{ color: "#94a3b8", marginTop: 4, fontSize: 13 }}>Level {getLevelData((profiles[name] || {}).score || 0).level} · {(profiles[name] || {}).score || 0} pts</div></button>)}</div><div style={{ display: "flex", gap: 8, marginTop: 14 }}><input style={styles.input} value={newProfileName} onChange={(event) => setNewProfileName(event.target.value)} placeholder="Add a new profile name" /><button style={styles.buttonPrimary} onClick={createProfile}>Add</button></div></div><div style={{ ...styles.muted, textAlign: "center", fontSize: 12 }}>{APP_VERSION_LABEL}</div></div></div>
    );
  }

  if (!currentUser.started) {
    return (
      <div style={styles.page}><div style={styles.wrap}><div style={styles.row}><div style={styles.pill}>✨ Bali Bahasa Trainer</div><button style={buttonStyle(false, false)} onClick={() => setShowProfileManager(true)}>{activeProfile}</button></div><h1 style={styles.heroTitle}>Learn Indonesian for <span style={{ color: "#86efac" }}>real Bali conversations</span></h1><p style={styles.heroText}>Now powered by your structured topic dataset: words, phrases, conversation chains, photo scan, voice input, and profiles.</p><div style={styles.card}><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}><div style={styles.smallStat}><div style={{ fontSize: 20 }}>📚</div><div style={{ fontWeight: 800 }}>{flattenPhrases(baliBahasaDataset).length}</div><div style={styles.muted}>Phrases</div></div><div style={styles.smallStat}><div style={{ fontSize: 20 }}>🔤</div><div style={{ fontWeight: 800 }}>{flattenWords(baliBahasaDataset).length}</div><div style={styles.muted}>Words</div></div><div style={styles.smallStat}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontWeight: 800 }}>{flattenConversationChains(baliBahasaDataset).length}</div><div style={styles.muted}>Chains</div></div></div><div style={{ marginBottom: 14 }}><div style={{ marginBottom: 8, color: "#cbd5e1", fontWeight: 700 }}>Daily goal</div><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{[5, 10, 20].map((goal) => <button key={goal} style={goal === currentUser.dailyGoal ? { ...styles.buttonPrimary, minHeight: 42 } : { ...styles.button, minHeight: 42 }} onClick={() => updateUser({ dailyGoal: goal })}>{goal} drills</button>)}</div></div><button style={{ ...styles.buttonPrimary, width: "100%" }} onClick={() => updateUser({ started: true })}>Start Training</button></div><div style={{ ...styles.muted, textAlign: "center", fontSize: 12 }}>{APP_VERSION_LABEL}</div></div></div>
    );
  }

  return (
    <div style={styles.page}><div style={styles.wrap}>
      <div style={styles.card}><div style={styles.row}><div><div style={{ color: "#86efac", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 11, fontWeight: 800 }}>{levelData.title}</div><div style={{ fontSize: 28, fontWeight: 800 }}>Level {levelData.level}</div></div><div style={{ display: "flex", gap: 8, alignItems: "center" }}><button style={buttonStyle(false, false)} onClick={() => setShowProfileManager(true)}>{activeProfile}</button><div style={{ ...styles.badge, background: "rgba(251,191,36,0.14)", color: "#fde68a", borderColor: "rgba(251,191,36,0.22)" }}>{currentUser.score} pts</div></div></div><div style={{ marginTop: 14, ...styles.progressTrack }}><div style={progressFill(progressToNext)} /></div><div style={{ ...styles.statGrid, marginTop: 14 }}><div style={styles.smallStat}><div style={{ fontSize: 18 }}>🔥</div><div style={{ fontWeight: 800 }}>{currentUser.streak}</div><div style={styles.muted}>Streak</div></div><div style={styles.smallStat}><div style={{ fontSize: 18 }}>⭐</div><div style={{ fontWeight: 800 }}>{currentUser.bestStreak}</div><div style={styles.muted}>Best</div></div><div style={styles.smallStat}><div style={{ fontSize: 18 }}>❤️</div><div style={{ fontWeight: 800 }}>{currentUser.hearts}</div><div style={styles.muted}>Lives</div></div><div style={styles.smallStat}><div style={{ fontSize: 18 }}>⚔️</div><div style={{ fontWeight: 800 }}>x{currentUser.comboMultiplier.toFixed(1)}</div><div style={styles.muted}>Combo</div></div></div><div style={{ marginTop: 14 }}><div style={{ ...styles.row, marginBottom: 6 }}><div style={styles.muted}>Daily goal</div><div style={{ color: "#86efac", fontWeight: 700 }}>{currentUser.completedToday}/{currentUser.dailyGoal}</div></div><div style={styles.progressTrack}><div style={progressFill((currentUser.completedToday / currentUser.dailyGoal) * 100)} /></div></div></div>

      <div style={{ ...styles.card, padding: 12 }}><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}><button style={buttonStyle(false, false)} onClick={() => updateUser({ feedback: { ok: true, text: "Progress saved", explanation: "Your profile has been saved on this device." } })}>💾 Save</button><button style={buttonStyle(installReady, false)} onClick={installApp}>{isInstalled ? "✅ Installed" : "📲 Install"}</button><button style={buttonStyle(false, true)} onClick={resetProfile}>↺ Reset</button></div><div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 8 }}>{topicList.map((topic) => <button key={topic.id} style={{ ...styles.button, whiteSpace: "nowrap", borderRadius: 999, ...(currentUser.mode === topic.id ? styles.buttonActive : {}) }} onClick={() => updateUser({ mode: topic.id, currentDrillId: getRandomDrillId(generatedContent.translate.filter((d) => topic.id === "all" || d.topicId === topic.id)), feedback: null, input: "", shuffledOptions: {} })}>{topic.label}</button>)}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}><button style={buttonStyle(currentUser.playMode === "typing", false)} onClick={() => switchMode("typing")}>🧠 Typing</button><button style={buttonStyle(currentUser.playMode === "multiple", false)} onClick={() => switchMode("multiple")}>🎯 Multiple Choice</button><button style={buttonStyle(currentUser.playMode === "listening", false)} onClick={() => switchMode("listening")}>🎧 Listening</button><button style={buttonStyle(currentUser.playMode === "words", false)} onClick={() => switchMode("words")}>🔤 Words</button><button style={buttonStyle(currentUser.playMode === "conversation", false)} onClick={() => switchMode("conversation")}>💬 Conversation</button><button style={buttonStyle(currentUser.playMode === "photo", false)} onClick={() => updateUser({ playMode: "photo", feedback: null })}>📷 Photo Scan</button><button style={buttonStyle(currentUser.showReviewOnly, true)} onClick={() => updateUser({ showReviewOnly: !currentUser.showReviewOnly, currentDrillId: getRandomDrillId(generatedContent.translate), shuffledOptions: {} })}>🔁 Review Mistakes</button></div></div>

      {currentUser.playMode === "photo" ? renderPhotoMode() : currentUser.hearts > 0 ? <div style={styles.card}><div style={styles.row}><div style={styles.badge}>{current?.category}</div><div style={{ ...styles.badge, background: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.15)" }}>Drill {currentUser.answeredIds.length + 1}</div></div><div style={{ marginTop: 14, marginBottom: 8, color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}><strong style={{ color: "#cbd5e1" }}>Scenario:</strong> {current?.scenario}</div><div style={{ marginBottom: 10, color: "#86efac", fontSize: 13, fontWeight: 700 }}>{current?.direction}</div>{currentUser.playMode === "conversation" ? <div style={{ ...styles.achievementRow, marginBottom: 12 }}><div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>They say:</div><div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35 }}>{current?.theySay}</div><div style={{ marginTop: 8, color: "#cbd5e1" }}>{current?.tip}</div></div> : <h2 style={{ fontSize: 19, lineHeight: 1.35, marginTop: 0, marginBottom: 14, color: "#fff", fontWeight: 800 }}>{current?.prompt}</h2>}{currentUser.playMode === "typing" ? <><div style={{ marginTop: -4, marginBottom: 12, color: "#cbd5e1", fontSize: 14, lineHeight: 1.45 }}>Type your answer in <strong>Bahasa Indonesia</strong>.</div><div style={{ display: "flex", gap: 8 }}><input style={styles.input} value={currentUser.input} onChange={(event) => updateUser({ input: event.target.value })} onKeyDown={(event) => event.key === "Enter" && handleSubmit()} placeholder="Type your answer in Bahasa Indonesia" /><button style={{ ...styles.button, width: 50, padding: 0 }} onClick={() => speak(current?.answers?.[0])}>🔊</button>{voiceSupported ? <button style={{ ...styles.button, width: 50, padding: 0 }} onClick={startVoiceInput}>🎤</button> : null}</div></> : <div style={{ display: "grid", gap: 8 }}>{currentOptions.map((option) => <button key={option} style={styles.answerButton} onClick={() => checkAnswer(option)}>{option}</button>)}<button style={styles.button} onClick={() => speak(current?.prompt || current?.theySay)}>🔊 Play Audio</button></div>}<div style={{ marginTop: 12, ...styles.muted }}>{currentUser.playMode === "typing" ? `Translate into Bahasa Indonesia. Tip: ${current?.tip}` : `Tip: ${current?.tip}`}</div>{currentUser.playMode === "typing" ? <button style={{ ...styles.buttonPrimary, width: "100%", marginTop: 14 }} onClick={handleSubmit}>Check Answer</button> : null}{currentUser.feedback ? <div style={{ marginTop: 14, ...(currentUser.feedback.ok ? styles.feedbackGood : styles.feedbackBad) }}><div style={{ fontWeight: 800, color: currentUser.feedback.ok ? "#a7f3d0" : "#fecdd3" }}>{currentUser.feedback.text}</div><div style={{ marginTop: 6, color: "#d6deea", lineHeight: 1.45 }}>{currentUser.feedback.explanation}</div>{renderBreakdown(current?.breakdown)}</div> : null}</div> : <div style={styles.card}><div style={{ textAlign: "center", fontSize: 42 }}>💀</div><div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginTop: 6 }}>Run Over</div><p style={{ textAlign: "center", color: "#cbd5e1" }}>You ran out of lives. Reset and go again.</p><button style={{ ...styles.buttonPrimary, width: "100%" }} onClick={() => updateUser(blankUserState())}>Start New Run</button></div>}

      <div style={styles.card}><h3 style={styles.sectionTitle}>🔐 Learning Focus</h3><div style={{ display: "grid", gap: 10, marginTop: 12 }}><div style={styles.achievementRow}><div style={{ fontWeight: 800, marginBottom: 6 }}>Dataset active</div><div style={styles.muted}>{flattenPhrases(baliBahasaDataset).length} phrases, {flattenWords(baliBahasaDataset).length} words, {flattenConversationChains(baliBahasaDataset).length} conversation chains loaded from src/dataset.js.</div></div><div style={styles.achievementRow}><div style={{ fontWeight: 800, marginBottom: 6 }}>App version</div><div style={styles.muted}>{APP_VERSION_LABEL}</div><div style={{ ...styles.muted, fontSize: 12, marginTop: 4 }}>Build {APP_VERSION}</div></div></div></div>
    </div></div>
  );
}
