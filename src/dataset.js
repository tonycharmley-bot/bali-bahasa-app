// Bali Bahasa Dataset v1.3
// Purpose: topic-based Indonesian conversation content for Bali-focused learning.
// Structure: topics -> coreWords, phrases, conversationChains.
// Use this as a source dataset to generate drills, phrasebook items, multiple choice answers, and conversation mode content.

export const DATASET_VERSION = "1.3.0";

export const baliBahasaDataset = {
  meta: {
    name: "Bali Bahasa Conversation Dataset",
    version: DATASET_VERSION,
    designGoal: "Conversation-first Indonesian for daily life in Bali",
    levels: ["absolute_beginner", "beginner", "early_conversation", "conversation", "confident_speaker"],
    note: "This dataset prioritizes high-frequency words embedded in practical phrases rather than isolated vocabulary lists."
  },

  topics: [
    {
      id: "core_basics",
      label: "Core Basics",
      priority: 1,
      description: "Essential glue words, pronouns, common verbs, and daily patterns.",
      coreWords: [
        { id: "w001", idn: "saya", eng: "I / me", type: "pronoun", level: 1, tags: ["core", "pronoun"] },
        { id: "w002", idn: "aku", eng: "I / me informal", type: "pronoun", level: 2, tags: ["informal", "pronoun"] },
        { id: "w003", idn: "kamu", eng: "you", type: "pronoun", level: 1, tags: ["core", "pronoun"] },
        { id: "w004", idn: "dia", eng: "he / she", type: "pronoun", level: 1, tags: ["core", "pronoun"] },
        { id: "w005", idn: "kita", eng: "we / us inclusive", type: "pronoun", level: 2, tags: ["core", "pronoun"] },
        { id: "w006", idn: "kami", eng: "we / us exclusive", type: "pronoun", level: 3, tags: ["pronoun"] },
        { id: "w007", idn: "ini", eng: "this", type: "determiner", level: 1, tags: ["core"] },
        { id: "w008", idn: "itu", eng: "that", type: "determiner", level: 1, tags: ["core"] },
        { id: "w009", idn: "di", eng: "in / at / on", type: "preposition", level: 1, tags: ["core", "location"] },
        { id: "w010", idn: "ke", eng: "to", type: "preposition", level: 1, tags: ["core", "movement"] },
        { id: "w011", idn: "dari", eng: "from", type: "preposition", level: 1, tags: ["core"] },
        { id: "w012", idn: "dan", eng: "and", type: "connector", level: 1, tags: ["core"] },
        { id: "w013", idn: "tapi", eng: "but", type: "connector", level: 1, tags: ["core"] },
        { id: "w014", idn: "atau", eng: "or", type: "connector", level: 2, tags: ["core"] },
        { id: "w015", idn: "karena", eng: "because", type: "connector", level: 2, tags: ["reason"] },
        { id: "w016", idn: "mau", eng: "want", type: "verb", level: 1, tags: ["core", "verb"] },
        { id: "w017", idn: "bisa", eng: "can / able to", type: "verb", level: 1, tags: ["core", "verb"] },
        { id: "w018", idn: "ada", eng: "there is / have", type: "verb", level: 1, tags: ["core", "verb"] },
        { id: "w019", idn: "punya", eng: "have / own", type: "verb", level: 2, tags: ["verb"] },
        { id: "w020", idn: "pakai", eng: "use / wear", type: "verb", level: 2, tags: ["verb"] },
        { id: "w021", idn: "ambil", eng: "take / get", type: "verb", level: 2, tags: ["verb"] },
        { id: "w022", idn: "kasih", eng: "give", type: "verb", level: 2, tags: ["verb", "informal"] },
        { id: "w023", idn: "tahu", eng: "know", type: "verb", level: 1, tags: ["verb"] },
        { id: "w024", idn: "tidak", eng: "no / not", type: "negation", level: 1, tags: ["core"] },
        { id: "w025", idn: "nggak", eng: "no / not informal", type: "negation", level: 2, tags: ["informal", "spoken"] },
        { id: "w026", idn: "sudah", eng: "already", type: "aspect", level: 1, tags: ["core", "time"] },
        { id: "w027", idn: "belum", eng: "not yet", type: "aspect", level: 1, tags: ["core", "time"] },
        { id: "w028", idn: "lagi", eng: "currently / again", type: "aspect", level: 2, tags: ["spoken"] },
        { id: "w029", idn: "nanti", eng: "later", type: "time", level: 1, tags: ["core", "time"] },
        { id: "w030", idn: "sekarang", eng: "now", type: "time", level: 1, tags: ["core", "time"] },
        { id: "w031", idn: "besok", eng: "tomorrow", type: "time", level: 1, tags: ["time"] },
        { id: "w032", idn: "kemarin", eng: "yesterday", type: "time", level: 2, tags: ["time"] },
        { id: "w033", idn: "sedikit", eng: "a little", type: "quantity", level: 1, tags: ["core"] },
        { id: "w034", idn: "banyak", eng: "many / much", type: "quantity", level: 1, tags: ["core"] },
        { id: "w035", idn: "semua", eng: "all", type: "quantity", level: 2, tags: ["quantity"] },
        { id: "w036", idn: "saja", eng: "only / just", type: "particle", level: 2, tags: ["spoken"] },
        { id: "w037", idn: "ya", eng: "yes / okay / softener", type: "particle", level: 1, tags: ["spoken"] },
        { id: "w038", idn: "tolong", eng: "please / help", type: "politeness", level: 1, tags: ["polite"] },
        { id: "w039", idn: "maaf", eng: "sorry / excuse me", type: "politeness", level: 1, tags: ["polite"] },
        { id: "w040", idn: "terima kasih", eng: "thank you", type: "politeness", level: 1, tags: ["polite"] }
      ],
      phrases: [
        { id: "p001", idn: "Nama saya Tony", eng: "My name is Tony", level: 1, tags: ["intro"], pattern: "Nama saya + name", breakdown: [["nama", "name"], ["saya", "my / I"]] },
        { id: "p002", idn: "Saya dari Australia", eng: "I am from Australia", level: 1, tags: ["intro"], pattern: "Saya dari + place", breakdown: [["saya", "I"], ["dari", "from"]] },
        { id: "p003", idn: "Saya tinggal di Sanur", eng: "I live in Sanur", level: 1, tags: ["intro", "location"], pattern: "Saya tinggal di + place", breakdown: [["tinggal", "live / stay"], ["di", "in / at"]] },
        { id: "p004", idn: "Kamu dari mana?", eng: "Where are you from?", level: 1, tags: ["question", "intro"], pattern: "Kamu dari mana?", breakdown: [["kamu", "you"], ["dari mana", "from where"]] },
        { id: "p005", idn: "Kamu tinggal di mana?", eng: "Where do you live?", level: 1, tags: ["question", "location"], pattern: "Kamu tinggal di mana?", breakdown: [["tinggal", "live"], ["di mana", "where"]] },
        { id: "p006", idn: "Saya tidak tahu", eng: "I do not know", level: 1, tags: ["core"], pattern: "Saya tidak tahu", breakdown: [["tidak", "not"], ["tahu", "know"]] },
        { id: "p007", idn: "Nggak tahu, mungkin nanti", eng: "I do not know, maybe later", level: 1, tags: ["spoken", "daily"], pattern: "Nggak tahu, mungkin nanti", breakdown: [["nggak tahu", "do not know"], ["mungkin nanti", "maybe later"]] },
        { id: "p008", idn: "Bisa bantu saya?", eng: "Can you help me?", level: 1, tags: ["help"], pattern: "Bisa bantu saya?", breakdown: [["bisa", "can"], ["bantu", "help"], ["saya", "me"]] },
        { id: "p009", idn: "Tolong tunggu sebentar", eng: "Please wait a moment", level: 1, tags: ["polite"], pattern: "Tolong + verb", breakdown: [["tolong", "please"], ["tunggu", "wait"], ["sebentar", "a moment"]] },
        { id: "p010", idn: "Sekarang saya lagi sibuk sedikit", eng: "I am a little busy right now", level: 2, tags: ["daily", "message"], pattern: "Sekarang saya lagi + adjective", breakdown: [["sekarang", "now"], ["lagi sibuk", "currently busy"], ["sedikit", "a little"]] }
      ]
    },

    {
      id: "warung_food",
      label: "Warung & Food",
      priority: 2,
      description: "Ordering food, asking what is good, spice level, drinks, bills, and preferences.",
      coreWords: [
        { id: "w101", idn: "makan", eng: "eat", type: "verb", level: 1, tags: ["food", "verb"] },
        { id: "w102", idn: "minum", eng: "drink", type: "verb", level: 1, tags: ["food", "verb"] },
        { id: "w103", idn: "pesan", eng: "order", type: "verb", level: 1, tags: ["food", "verb"] },
        { id: "w104", idn: "nasi", eng: "rice", type: "noun", level: 1, tags: ["food"] },
        { id: "w105", idn: "mie", eng: "noodles", type: "noun", level: 1, tags: ["food"] },
        { id: "w106", idn: "ayam", eng: "chicken", type: "noun", level: 1, tags: ["food"] },
        { id: "w107", idn: "ikan", eng: "fish", type: "noun", level: 2, tags: ["food"] },
        { id: "w108", idn: "telur", eng: "egg", type: "noun", level: 1, tags: ["food"] },
        { id: "w109", idn: "sayur", eng: "vegetables", type: "noun", level: 2, tags: ["food"] },
        { id: "w110", idn: "air", eng: "water", type: "noun", level: 1, tags: ["drink"] },
        { id: "w111", idn: "kopi", eng: "coffee", type: "noun", level: 1, tags: ["drink"] },
        { id: "w112", idn: "teh", eng: "tea", type: "noun", level: 1, tags: ["drink"] },
        { id: "w113", idn: "gula", eng: "sugar", type: "noun", level: 2, tags: ["food"] },
        { id: "w114", idn: "es", eng: "ice", type: "noun", level: 2, tags: ["drink"] },
        { id: "w115", idn: "pedas", eng: "spicy", type: "adjective", level: 1, tags: ["food"] },
        { id: "w116", idn: "enak", eng: "tasty / good", type: "adjective", level: 1, tags: ["food"] },
        { id: "w117", idn: "manis", eng: "sweet", type: "adjective", level: 2, tags: ["food"] },
        { id: "w118", idn: "panas", eng: "hot", type: "adjective", level: 2, tags: ["food"] },
        { id: "w119", idn: "dingin", eng: "cold", type: "adjective", level: 2, tags: ["food"] },
        { id: "w120", idn: "bungkus", eng: "takeaway / wrap", type: "verb/noun", level: 2, tags: ["food", "practical"] }
      ],
      phrases: [
        { id: "p101", idn: "Mau makan di mana?", eng: "Where do you want to eat?", level: 1, tags: ["question", "food"], pattern: "Mau + verb + di mana?", breakdown: [["mau", "want"], ["makan", "eat"], ["di mana", "where"]] },
        { id: "p102", idn: "Saya mau pesan makanan", eng: "I want to order food", level: 1, tags: ["ordering"], pattern: "Saya mau pesan + noun", breakdown: [["saya mau", "I want"], ["pesan", "order"], ["makanan", "food"]] },
        { id: "p103", idn: "Mau pesan apa?", eng: "What would you like to order?", level: 1, tags: ["question", "ordering"], pattern: "Mau pesan apa?", breakdown: [["mau", "want"], ["pesan", "order"], ["apa", "what"]] },
        { id: "p104", idn: "Saya mau nasi goreng", eng: "I want fried rice", level: 1, tags: ["ordering"], pattern: "Saya mau + dish", breakdown: [["saya mau", "I want"], ["nasi goreng", "fried rice"]] },
        { id: "p105", idn: "Yang enak apa?", eng: "What is good?", level: 1, tags: ["recommendation"], pattern: "Yang enak apa?", breakdown: [["yang", "which one"], ["enak", "good / tasty"], ["apa", "what"]] },
        { id: "p106", idn: "Yang enak apa di sini?", eng: "What is good here?", level: 2, tags: ["recommendation"], pattern: "Yang enak apa di sini?", breakdown: [["di sini", "here"]] },
        { id: "p107", idn: "Pedas tidak?", eng: "Is it spicy?", level: 1, tags: ["food", "question"], pattern: "Adjective + tidak?", breakdown: [["pedas", "spicy"], ["tidak", "not"]] },
        { id: "p108", idn: "Jangan terlalu pedas", eng: "Not too spicy, please", level: 2, tags: ["food", "preference"], pattern: "Jangan terlalu + adjective", breakdown: [["jangan", "do not"], ["terlalu", "too"], ["pedas", "spicy"]] },
        { id: "p109", idn: "Sedikit pedas saja", eng: "Just a little spicy", level: 2, tags: ["food", "preference"], pattern: "Sedikit + adjective + saja", breakdown: [["sedikit", "a little"], ["saja", "just / only"]] },
        { id: "p110", idn: "Air putih satu", eng: "One water", level: 1, tags: ["drink", "ordering"], pattern: "Item + quantity", breakdown: [["air putih", "water"], ["satu", "one"]] },
        { id: "p111", idn: "Tanpa gula", eng: "Without sugar", level: 2, tags: ["drink", "preference"], pattern: "Tanpa + noun", breakdown: [["tanpa", "without"], ["gula", "sugar"]] },
        { id: "p112", idn: "Pakai es?", eng: "With ice?", level: 2, tags: ["drink", "question"], pattern: "Pakai + noun?", breakdown: [["pakai", "use / with"], ["es", "ice"]] },
        { id: "p113", idn: "Makan di sini", eng: "Eat here", level: 1, tags: ["food"], pattern: "Verb + di sini", breakdown: [["makan", "eat"], ["di sini", "here"]] },
        { id: "p114", idn: "Bungkus ya", eng: "Takeaway, please", level: 2, tags: ["food", "takeaway"], pattern: "Bungkus ya", breakdown: [["bungkus", "takeaway"], ["ya", "softener"]] },
        { id: "p115", idn: "Berapa semuanya?", eng: "How much is everything?", level: 2, tags: ["payment"], pattern: "Berapa semuanya?", breakdown: [["berapa", "how much"], ["semuanya", "everything"]] }
      ],
      conversationChains: [
        {
          id: "cc101",
          title: "Ordering Fried Rice",
          level: 1,
          turns: [
            { speaker: "staff", idn: "Mau pesan apa?", eng: "What would you like to order?" },
            { speaker: "user", idn: "Saya mau nasi goreng", eng: "I want fried rice" },
            { speaker: "staff", idn: "Pedas?", eng: "Spicy?" },
            { speaker: "user", idn: "Sedikit pedas saja", eng: "Just a little spicy" },
            { speaker: "staff", idn: "Minum apa?", eng: "What drink?" },
            { speaker: "user", idn: "Air putih satu", eng: "One water" }
          ]
        }
      ]
    },

    {
      id: "transport_driver",
      label: "Transport & Drivers",
      priority: 3,
      description: "Talking to drivers, pickup times, traffic, locations, and prices.",
      coreWords: [
        { id: "w201", idn: "jalan", eng: "road / go / walk", type: "noun/verb", level: 1, tags: ["transport"] },
        { id: "w202", idn: "jemput", eng: "pick up", type: "verb", level: 2, tags: ["driver"] },
        { id: "w203", idn: "antar", eng: "drop off / take", type: "verb", level: 2, tags: ["driver"] },
        { id: "w204", idn: "tunggu", eng: "wait", type: "verb", level: 1, tags: ["transport"] },
        { id: "w205", idn: "lokasi", eng: "location", type: "noun", level: 1, tags: ["location"] },
        { id: "w206", idn: "alamat", eng: "address", type: "noun", level: 2, tags: ["location"] },
        { id: "w207", idn: "dekat", eng: "near", type: "adjective", level: 1, tags: ["location"] },
        { id: "w208", idn: "jauh", eng: "far", type: "adjective", level: 1, tags: ["location"] },
        { id: "w209", idn: "macet", eng: "traffic jam", type: "adjective/noun", level: 2, tags: ["transport"] },
        { id: "w210", idn: "cepat", eng: "fast", type: "adjective", level: 2, tags: ["transport"] },
        { id: "w211", idn: "lama", eng: "long time", type: "adjective", level: 2, tags: ["time"] },
        { id: "w212", idn: "langsung", eng: "directly / straight away", type: "adverb", level: 3, tags: ["transport"] }
      ],
      phrases: [
        { id: "p201", idn: "Bisa jemput kami?", eng: "Can you pick us up?", level: 2, tags: ["driver", "pickup"], pattern: "Bisa + verb + object?", breakdown: [["bisa", "can"], ["jemput", "pick up"], ["kami", "us"]] },
        { id: "p202", idn: "Bisa jemput kami jam 7 malam ini?", eng: "Can you pick us up at 7 tonight?", level: 2, tags: ["driver", "pickup", "time"], pattern: "Bisa jemput + person + time?", breakdown: [["jam 7", "7 o'clock"], ["malam ini", "tonight"]] },
        { id: "p203", idn: "Saya kirim lokasi sekarang", eng: "I will send the location now", level: 2, tags: ["driver", "location"], pattern: "Saya kirim + noun + time", breakdown: [["kirim", "send"], ["lokasi", "location"], ["sekarang", "now"]] },
        { id: "p204", idn: "Di mana lokasinya?", eng: "Where is the location?", level: 1, tags: ["location", "question"], pattern: "Di mana + noun?", breakdown: [["di mana", "where"], ["lokasinya", "the location"]] },
        { id: "p205", idn: "Berapa lama ke sana?", eng: "How long to get there?", level: 2, tags: ["transport", "time"], pattern: "Berapa lama ke + place?", breakdown: [["berapa lama", "how long"], ["ke sana", "to there"]] },
        { id: "p206", idn: "Macet ya?", eng: "Traffic, yeah?", level: 2, tags: ["transport", "spoken"], pattern: "Adjective + ya?", breakdown: [["macet", "traffic jam"], ["ya", "yeah / softener"]] },
        { id: "p207", idn: "Kita berangkat sekarang", eng: "We leave now", level: 2, tags: ["transport"], pattern: "Kita + verb + time", breakdown: [["kita", "we"], ["berangkat", "leave"], ["sekarang", "now"]] },
        { id: "p208", idn: "Tolong tunggu sebentar", eng: "Please wait a moment", level: 1, tags: ["driver", "polite"], pattern: "Tolong tunggu + duration", breakdown: [["tolong", "please"], ["tunggu", "wait"], ["sebentar", "a moment"]] },
        { id: "p209", idn: "Bisa langsung ke villa?", eng: "Can we go directly to the villa?", level: 3, tags: ["driver", "villa"], pattern: "Bisa langsung ke + place?", breakdown: [["langsung", "directly"], ["ke villa", "to the villa"]] },
        { id: "p210", idn: "Berapa harganya?", eng: "How much is the price?", level: 1, tags: ["payment"], pattern: "Berapa harganya?", breakdown: [["berapa", "how much"], ["harganya", "the price"]] }
      ],
      conversationChains: [
        {
          id: "cc201",
          title: "Arrange Pickup",
          level: 2,
          turns: [
            { speaker: "user", idn: "Bisa jemput kami jam 7 malam ini?", eng: "Can you pick us up at 7 tonight?" },
            { speaker: "driver", idn: "Bisa. Lokasinya di mana?", eng: "Can. Where is the location?" },
            { speaker: "user", idn: "Saya kirim lokasi sekarang", eng: "I will send the location now" },
            { speaker: "driver", idn: "Oke, sampai nanti", eng: "Okay, see you later" }
          ]
        }
      ]
    },

    {
      id: "villa_staff",
      label: "Villa & Staff",
      priority: 4,
      description: "Housekeeping, maintenance, guest questions, AC, keys, cleaning, and polite instructions.",
      coreWords: [
        { id: "w301", idn: "villa", eng: "villa", type: "noun", level: 1, tags: ["villa"] },
        { id: "w302", idn: "kamar", eng: "room", type: "noun", level: 1, tags: ["villa"] },
        { id: "w303", idn: "kunci", eng: "key", type: "noun", level: 1, tags: ["villa"] },
        { id: "w304", idn: "pintu", eng: "door", type: "noun", level: 1, tags: ["villa"] },
        { id: "w305", idn: "AC", eng: "air conditioner", type: "noun", level: 1, tags: ["villa"] },
        { id: "w306", idn: "lampu", eng: "light", type: "noun", level: 1, tags: ["villa"] },
        { id: "w307", idn: "kolam", eng: "pool", type: "noun", level: 2, tags: ["villa"] },
        { id: "w308", idn: "bersih", eng: "clean", type: "adjective", level: 1, tags: ["villa"] },
        { id: "w309", idn: "kotor", eng: "dirty", type: "adjective", level: 2, tags: ["villa"] },
        { id: "w310", idn: "rusak", eng: "broken", type: "adjective", level: 2, tags: ["problem"] },
        { id: "w311", idn: "nyala", eng: "on / lit", type: "adjective/verb", level: 2, tags: ["problem"] },
        { id: "w312", idn: "mati", eng: "off / dead", type: "adjective/verb", level: 2, tags: ["problem"] },
        { id: "w313", idn: "matikan", eng: "turn off", type: "verb", level: 2, tags: ["instruction"] },
        { id: "w314", idn: "hidupkan", eng: "turn on", type: "verb", level: 3, tags: ["instruction"] },
        { id: "w315", idn: "perbaiki", eng: "fix", type: "verb", level: 3, tags: ["maintenance"] }
      ],
      phrases: [
        { id: "p301", idn: "Cleaning jam berapa?", eng: "What time is cleaning?", level: 1, tags: ["staff", "cleaning"], pattern: "Noun + jam berapa?", breakdown: [["cleaning", "cleaning"], ["jam berapa", "what time"]] },
        { id: "p302", idn: "Besok cleaning jam 11 pagi", eng: "Cleaning tomorrow at 11am", level: 2, tags: ["staff", "cleaning"], pattern: "Time + noun + time", breakdown: [["besok", "tomorrow"], ["jam 11 pagi", "11am"]] },
        { id: "p303", idn: "Tolong matikan AC kalau keluar", eng: "Please turn off the AC when going out", level: 2, tags: ["staff", "instruction"], pattern: "Tolong + verb + object + kalau + action", breakdown: [["matikan", "turn off"], ["kalau keluar", "when going out"]] },
        { id: "p304", idn: "Tolong tutup pintu", eng: "Please close the door", level: 1, tags: ["instruction"], pattern: "Tolong + verb + object", breakdown: [["tutup", "close"], ["pintu", "door"]] },
        { id: "p305", idn: "Kunci di mana?", eng: "Where is the key?", level: 1, tags: ["villa", "question"], pattern: "Noun + di mana?", breakdown: [["kunci", "key"], ["di mana", "where"]] },
        { id: "p306", idn: "AC tidak dingin", eng: "The AC is not cold", level: 2, tags: ["maintenance", "problem"], pattern: "Noun + tidak + adjective", breakdown: [["AC", "air conditioner"], ["tidak dingin", "not cold"]] },
        { id: "p307", idn: "Air panas tidak jalan", eng: "The hot water is not working", level: 3, tags: ["maintenance", "problem"], pattern: "Noun + tidak jalan", breakdown: [["air panas", "hot water"], ["tidak jalan", "not working"]] },
        { id: "p308", idn: "Bisa datang sekarang?", eng: "Can you come now?", level: 2, tags: ["staff", "request"], pattern: "Bisa + verb + time?", breakdown: [["bisa", "can"], ["datang", "come"], ["sekarang", "now"]] },
        { id: "p309", idn: "Tamu sudah datang", eng: "The guests have arrived", level: 2, tags: ["guests"], pattern: "Subject + sudah + verb", breakdown: [["tamu", "guest"], ["sudah datang", "have arrived"]] },
        { id: "p310", idn: "Tamunya sudah datang belum?", eng: "Have the guests arrived yet?", level: 3, tags: ["guests", "question"], pattern: "Subject + sudah + verb + belum?", breakdown: [["sudah", "already"], ["belum", "yet / not yet"]] }
      ],
      conversationChains: [
        {
          id: "cc301",
          title: "Arrange Cleaning",
          level: 2,
          turns: [
            { speaker: "staff", idn: "Besok cleaning jam berapa?", eng: "What time is cleaning tomorrow?" },
            { speaker: "user", idn: "Jam 11 pagi ya", eng: "11am please" },
            { speaker: "staff", idn: "Baik pak", eng: "Okay sir" },
            { speaker: "user", idn: "Terima kasih", eng: "Thank you" }
          ]
        }
      ]
    },

    {
      id: "shopping_bargaining",
      label: "Shopping & Bargaining",
      priority: 5,
      description: "Market shopping, asking prices, choosing items, bargaining, and polite refusal.",
      coreWords: [
        { id: "w401", idn: "harga", eng: "price", type: "noun", level: 1, tags: ["shopping"] },
        { id: "w402", idn: "mahal", eng: "expensive", type: "adjective", level: 1, tags: ["shopping"] },
        { id: "w403", idn: "murah", eng: "cheap", type: "adjective", level: 2, tags: ["shopping"] },
        { id: "w404", idn: "beli", eng: "buy", type: "verb", level: 1, tags: ["shopping"] },
        { id: "w405", idn: "jual", eng: "sell", type: "verb", level: 2, tags: ["shopping"] },
        { id: "w406", idn: "lihat", eng: "look / see", type: "verb", level: 1, tags: ["shopping"] },
        { id: "w407", idn: "kurang", eng: "less / reduce", type: "verb/adjective", level: 2, tags: ["bargaining"] },
        { id: "w408", idn: "lain", eng: "other", type: "adjective", level: 2, tags: ["shopping"] },
        { id: "w409", idn: "warna", eng: "color", type: "noun", level: 2, tags: ["shopping"] },
        { id: "w410", idn: "ukuran", eng: "size", type: "noun", level: 2, tags: ["shopping"] }
      ],
      phrases: [
        { id: "p401", idn: "Ini berapa?", eng: "How much is this?", level: 1, tags: ["shopping", "price"], pattern: "Ini berapa?", breakdown: [["ini", "this"], ["berapa", "how much"]] },
        { id: "p402", idn: "Berapa harganya?", eng: "How much is the price?", level: 1, tags: ["shopping", "price"], pattern: "Berapa harganya?", breakdown: [["harga", "price"]] },
        { id: "p403", idn: "Bisa kurang?", eng: "Can you reduce the price?", level: 2, tags: ["shopping", "bargaining"], pattern: "Bisa + verb?", breakdown: [["bisa", "can"], ["kurang", "reduce / less"]] },
        { id: "p404", idn: "Mahal sekali", eng: "Very expensive", level: 2, tags: ["shopping", "bargaining"], pattern: "Adjective + sekali", breakdown: [["mahal", "expensive"], ["sekali", "very"]] },
        { id: "p405", idn: "Saya lihat dulu", eng: "I will look first", level: 2, tags: ["shopping", "polite_refusal"], pattern: "Saya + verb + dulu", breakdown: [["lihat", "look"], ["dulu", "first"]] },
        { id: "p406", idn: "Ada warna lain?", eng: "Do you have another color?", level: 2, tags: ["shopping", "question"], pattern: "Ada + noun + lain?", breakdown: [["ada", "is there / have"], ["warna lain", "other color"]] },
        { id: "p407", idn: "Ada ukuran lain?", eng: "Do you have another size?", level: 2, tags: ["shopping", "question"], pattern: "Ada + noun + lain?", breakdown: [["ukuran", "size"], ["lain", "other"]] },
        { id: "p408", idn: "Saya mau yang ini", eng: "I want this one", level: 1, tags: ["shopping", "choosing"], pattern: "Saya mau yang + demonstrative", breakdown: [["yang ini", "this one"]] }
      ],
      conversationChains: [
        {
          id: "cc401",
          title: "Market Price",
          level: 2,
          turns: [
            { speaker: "user", idn: "Ini berapa?", eng: "How much is this?" },
            { speaker: "seller", idn: "Seratus ribu", eng: "One hundred thousand" },
            { speaker: "user", idn: "Bisa kurang?", eng: "Can you reduce it?" },
            { speaker: "seller", idn: "Bisa sedikit", eng: "A little" },
            { speaker: "user", idn: "Oke, saya mau yang ini", eng: "Okay, I want this one" }
          ]
        }
      ]
    },

    {
      id: "problems_help",
      label: "Problems & Help",
      priority: 6,
      description: "When something is wrong, broken, missing, unavailable, or needs urgent help.",
      coreWords: [
        { id: "w501", idn: "masalah", eng: "problem", type: "noun", level: 2, tags: ["problem"] },
        { id: "w502", idn: "rusak", eng: "broken", type: "adjective", level: 2, tags: ["problem"] },
        { id: "w503", idn: "hilang", eng: "lost / missing", type: "adjective", level: 2, tags: ["problem"] },
        { id: "w504", idn: "sakit", eng: "sick / painful", type: "adjective", level: 2, tags: ["health", "problem"] },
        { id: "w505", idn: "bahaya", eng: "danger", type: "noun/adjective", level: 3, tags: ["emergency"] },
        { id: "w506", idn: "cepat", eng: "quickly", type: "adverb/adjective", level: 2, tags: ["emergency"] },
        { id: "w507", idn: "perlu", eng: "need", type: "verb", level: 2, tags: ["problem"] },
        { id: "w508", idn: "obat", eng: "medicine", type: "noun", level: 3, tags: ["health"] },
        { id: "w509", idn: "dokter", eng: "doctor", type: "noun", level: 2, tags: ["health"] },
        { id: "w510", idn: "polisi", eng: "police", type: "noun", level: 3, tags: ["emergency"] }
      ],
      phrases: [
        { id: "p501", idn: "Ada masalah", eng: "There is a problem", level: 2, tags: ["problem"], pattern: "Ada + noun", breakdown: [["ada", "there is"], ["masalah", "problem"]] },
        { id: "p502", idn: "Ini tidak bisa", eng: "This cannot / this does not work", level: 1, tags: ["problem"], pattern: "Ini tidak bisa", breakdown: [["ini", "this"], ["tidak bisa", "cannot"]] },
        { id: "p503", idn: "Tidak jalan", eng: "It is not working", level: 2, tags: ["problem"], pattern: "Tidak jalan", breakdown: [["tidak", "not"], ["jalan", "work / run"]] },
        { id: "p504", idn: "Ini rusak", eng: "This is broken", level: 2, tags: ["problem"], pattern: "Ini + adjective", breakdown: [["rusak", "broken"]] },
        { id: "p505", idn: "Tolong bantu sekarang", eng: "Please help now", level: 2, tags: ["urgent"], pattern: "Tolong + verb + time", breakdown: [["tolong", "please"], ["bantu", "help"], ["sekarang", "now"]] },
        { id: "p506", idn: "Saya perlu dokter", eng: "I need a doctor", level: 3, tags: ["health"], pattern: "Saya perlu + noun", breakdown: [["perlu", "need"], ["dokter", "doctor"]] },
        { id: "p507", idn: "Saya sakit", eng: "I am sick / in pain", level: 2, tags: ["health"], pattern: "Saya + adjective", breakdown: [["sakit", "sick / painful"]] },
        { id: "p508", idn: "Bisa datang cepat?", eng: "Can you come quickly?", level: 3, tags: ["urgent"], pattern: "Bisa + verb + adverb?", breakdown: [["datang", "come"], ["cepat", "quickly"]] }
      ],
      conversationChains: [
        {
          id: "cc501",
          title: "Something Broken",
          level: 2,
          turns: [
            { speaker: "user", idn: "Ada masalah", eng: "There is a problem" },
            { speaker: "staff", idn: "Masalah apa?", eng: "What problem?" },
            { speaker: "user", idn: "AC tidak dingin", eng: "The AC is not cold" },
            { speaker: "staff", idn: "Baik, saya cek sekarang", eng: "Okay, I will check now" }
          ]
        }
      ]
    },

    {
      id: "time_numbers",
      label: "Time & Numbers",
      priority: 7,
      description: "Numbers, prices, times, dates, and daily scheduling.",
      coreWords: [
        { id: "w601", idn: "satu", eng: "one", type: "number", level: 1, tags: ["number"] },
        { id: "w602", idn: "dua", eng: "two", type: "number", level: 1, tags: ["number"] },
        { id: "w603", idn: "tiga", eng: "three", type: "number", level: 1, tags: ["number"] },
        { id: "w604", idn: "empat", eng: "four", type: "number", level: 1, tags: ["number"] },
        { id: "w605", idn: "lima", eng: "five", type: "number", level: 1, tags: ["number"] },
        { id: "w606", idn: "enam", eng: "six", type: "number", level: 1, tags: ["number"] },
        { id: "w607", idn: "tujuh", eng: "seven", type: "number", level: 1, tags: ["number"] },
        { id: "w608", idn: "delapan", eng: "eight", type: "number", level: 1, tags: ["number"] },
        { id: "w609", idn: "sembilan", eng: "nine", type: "number", level: 1, tags: ["number"] },
        { id: "w610", idn: "sepuluh", eng: "ten", type: "number", level: 1, tags: ["number"] },
        { id: "w611", idn: "seratus", eng: "one hundred", type: "number", level: 2, tags: ["number"] },
        { id: "w612", idn: "seribu", eng: "one thousand", type: "number", level: 2, tags: ["number"] },
        { id: "w613", idn: "jam", eng: "hour / o'clock", type: "time", level: 1, tags: ["time"] },
        { id: "w614", idn: "pagi", eng: "morning", type: "time", level: 1, tags: ["time"] },
        { id: "w615", idn: "siang", eng: "midday / afternoon", type: "time", level: 2, tags: ["time"] },
        { id: "w616", idn: "sore", eng: "late afternoon", type: "time", level: 2, tags: ["time"] },
        { id: "w617", idn: "malam", eng: "night", type: "time", level: 1, tags: ["time"] }
      ],
      phrases: [
        { id: "p601", idn: "Jam berapa?", eng: "What time?", level: 1, tags: ["time", "question"], pattern: "Jam berapa?", breakdown: [["jam", "hour / time"], ["berapa", "how much / what number"]] },
        { id: "p602", idn: "Jam 7 malam", eng: "7 at night", level: 1, tags: ["time"], pattern: "Jam + number + time of day", breakdown: [["jam 7", "7 o'clock"], ["malam", "night"]] },
        { id: "p603", idn: "Besok pagi", eng: "Tomorrow morning", level: 1, tags: ["time"], pattern: "Day + time", breakdown: [["besok", "tomorrow"], ["pagi", "morning"]] },
        { id: "p604", idn: "Nanti sore", eng: "Later this afternoon", level: 2, tags: ["time"], pattern: "Nanti + time", breakdown: [["nanti", "later"], ["sore", "late afternoon"]] },
        { id: "p605", idn: "Berapa lama?", eng: "How long?", level: 2, tags: ["time", "question"], pattern: "Berapa lama?", breakdown: [["berapa", "how much"], ["lama", "long time"]] }
      ]
    },

    {
      id: "social_smalltalk",
      label: "Social & Small Talk",
      priority: 8,
      description: "Friendly local conversations, family, work, daily life, and polite chat.",
      coreWords: [
        { id: "w701", idn: "apa kabar", eng: "how are you", type: "expression", level: 1, tags: ["social"] },
        { id: "w702", idn: "baik", eng: "good", type: "adjective", level: 1, tags: ["social"] },
        { id: "w703", idn: "keluarga", eng: "family", type: "noun", level: 2, tags: ["family"] },
        { id: "w704", idn: "anak", eng: "child", type: "noun", level: 2, tags: ["family"] },
        { id: "w705", idn: "istri", eng: "wife", type: "noun", level: 2, tags: ["family"] },
        { id: "w706", idn: "suami", eng: "husband", type: "noun", level: 2, tags: ["family"] },
        { id: "w707", idn: "kerja", eng: "work", type: "verb/noun", level: 1, tags: ["work"] },
        { id: "w708", idn: "libur", eng: "holiday / day off", type: "noun/verb", level: 2, tags: ["daily"] },
        { id: "w709", idn: "lama", eng: "long time", type: "adjective", level: 2, tags: ["time"] },
        { id: "w710", idn: "baru", eng: "new / just", type: "adjective", level: 2, tags: ["time"] }
      ],
      phrases: [
        { id: "p701", idn: "Apa kabar?", eng: "How are you?", level: 1, tags: ["social", "greeting"], pattern: "Apa kabar?", breakdown: [["apa", "what"], ["kabar", "news / condition"]] },
        { id: "p702", idn: "Baik, terima kasih", eng: "Good, thank you", level: 1, tags: ["social", "reply"], pattern: "Baik, terima kasih", breakdown: [["baik", "good"], ["terima kasih", "thank you"]] },
        { id: "p703", idn: "Sudah makan?", eng: "Have you eaten yet?", level: 1, tags: ["social", "daily"], pattern: "Sudah + verb?", breakdown: [["sudah", "already"], ["makan", "eat"]] },
        { id: "p704", idn: "Belum, nanti", eng: "Not yet, later", level: 1, tags: ["social", "reply"], pattern: "Belum, nanti", breakdown: [["belum", "not yet"], ["nanti", "later"]] },
        { id: "p705", idn: "Sudah lama tinggal di Bali?", eng: "Have you lived in Bali for a long time?", level: 3, tags: ["social", "question"], pattern: "Sudah lama + verb + place?", breakdown: [["sudah lama", "for a long time"], ["tinggal", "live / stay"]] },
        { id: "p706", idn: "Belum lama", eng: "Not long yet", level: 2, tags: ["social", "reply"], pattern: "Belum + adjective", breakdown: [["belum", "not yet"], ["lama", "long time"]] },
        { id: "p707", idn: "Kerja apa?", eng: "What work do you do?", level: 2, tags: ["work", "question"], pattern: "Noun/verb + apa?", breakdown: [["kerja", "work"], ["apa", "what"]] },
        { id: "p708", idn: "Saya kerja online", eng: "I work online", level: 2, tags: ["work", "reply"], pattern: "Saya kerja + place/method", breakdown: [["kerja", "work"], ["online", "online"]] }
      ],
      conversationChains: [
        {
          id: "cc701",
          title: "Friendly Small Talk",
          level: 2,
          turns: [
            { speaker: "local", idn: "Apa kabar?", eng: "How are you?" },
            { speaker: "user", idn: "Baik, terima kasih", eng: "Good, thank you" },
            { speaker: "local", idn: "Sudah lama tinggal di Bali?", eng: "Have you lived in Bali long?" },
            { speaker: "user", idn: "Belum lama", eng: "Not long yet" }
          ]
        }
      ]
    }
  ],

  recommendedConversationTopics: [
    { id: "ct001", label: "Introducing yourself", priority: 1, neededFor: "first conversations" },
    { id: "ct002", label: "Ordering food and drinks", priority: 2, neededFor: "daily life" },
    { id: "ct003", label: "Asking prices and paying", priority: 3, neededFor: "shopping and warungs" },
    { id: "ct004", label: "Talking to drivers", priority: 4, neededFor: "transport in Bali" },
    { id: "ct005", label: "Villa staff instructions", priority: 5, neededFor: "Tony's villa operations" },
    { id: "ct006", label: "Housekeeping and maintenance", priority: 6, neededFor: "villa operations" },
    { id: "ct007", label: "Small talk with locals", priority: 7, neededFor: "relationship building" },
    { id: "ct008", label: "Problems and urgent help", priority: 8, neededFor: "real-world safety" },
    { id: "ct009", label: "Directions and locations", priority: 9, neededFor: "moving around Bali" },
    { id: "ct010", label: "Family and daily routine", priority: 10, neededFor: "natural conversation" },
    { id: "ct011", label: "Time, days, appointments", priority: 11, neededFor: "planning" },
    { id: "ct012", label: "Polite refusal and negotiation", priority: 12, neededFor: "markets and tourist areas" }
  ],

  drillGenerationRules: {
    translate: "Use phrases where eng is shown and learner types idn.",
    multipleChoice: "Use phrases and generate distractors from same topic but different intent.",
    listening: "Use idn phrase as audio and learner chooses English meaning.",
    conversation: "Use conversationChains and ask learner to choose or type the user turn.",
    phraseBreakdown: "Show breakdown after feedback, not before answering.",
    adaptiveWeighting: "Increase weight for phrase IDs answered incorrectly; reduce after repeated correct answers."
  }
};

export default baliBahasaDataset;
