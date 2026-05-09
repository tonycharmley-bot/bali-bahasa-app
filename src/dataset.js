// Bali Bahasa Dataset v2.2 Expanded
// Replace your existing src/dataset.js with this file.
// Compatible with Bali Bahasa App v2.1.1+

export const DATASET_VERSION = "2.2.0";

const makePhrase = (id, idn, eng, level = 1, tags = [], pattern = "", breakdown = []) => ({
  id,
  idn,
  eng,
  level,
  tags,
  pattern,
  breakdown
});

const makeWord = (id, idn, eng, type = "word", level = 1, tags = []) => ({
  id,
  idn,
  eng,
  type,
  level,
  tags
});

const buildPatternPhrases = (prefix, patternIdn, patternEng, slots, level, tags) =>
  slots.map((slot, index) =>
    makePhrase(
      `${prefix}${String(index + 1).padStart(3, "0")}`,
      patternIdn.replace("___", slot.idn),
      patternEng.replace("___", slot.eng),
      level,
      tags,
      `${patternIdn} = ${patternEng}`,
      [[slot.idn, slot.eng]]
    )
  );

const foodItems = [
  { idn: "nasi goreng", eng: "fried rice" },
  { idn: "mie goreng", eng: "fried noodles" },
  { idn: "ayam goreng", eng: "fried chicken" },
  { idn: "ikan bakar", eng: "grilled fish" },
  { idn: "sate ayam", eng: "chicken satay" },
  { idn: "gado-gado", eng: "gado-gado" },
  { idn: "capcay", eng: "stir-fried vegetables" },
  { idn: "bakso", eng: "meatball soup" },
  { idn: "soto ayam", eng: "chicken soup" },
  { idn: "nasi campur", eng: "mixed rice" },
  { idn: "ayam betutu", eng: "Balinese spiced chicken" },
  { idn: "lalapan", eng: "fresh vegetables with sambal" },
  { idn: "tempe", eng: "tempeh" },
  { idn: "tahu", eng: "tofu" },
  { idn: "telur dadar", eng: "omelette" },
  { idn: "sambal", eng: "chilli sauce" }
];

const drinks = [
  { idn: "air putih", eng: "water" },
  { idn: "kopi", eng: "coffee" },
  { idn: "teh", eng: "tea" },
  { idn: "es teh", eng: "iced tea" },
  { idn: "jus mangga", eng: "mango juice" },
  { idn: "jus alpukat", eng: "avocado juice" },
  { idn: "kelapa muda", eng: "young coconut" },
  { idn: "soda", eng: "soda" }
];

const places = [
  { idn: "villa", eng: "the villa" },
  { idn: "pantai", eng: "the beach" },
  { idn: "bandara", eng: "the airport" },
  { idn: "restoran", eng: "the restaurant" },
  { idn: "warung", eng: "the warung" },
  { idn: "supermarket", eng: "the supermarket" },
  { idn: "apotek", eng: "the pharmacy" },
  { idn: "ATM", eng: "the ATM" },
  { idn: "hotel", eng: "the hotel" },
  { idn: "Sanur", eng: "Sanur" },
  { idn: "Ubud", eng: "Ubud" },
  { idn: "Canggu", eng: "Canggu" },
  { idn: "Seminyak", eng: "Seminyak" },
  { idn: "Uluwatu", eng: "Uluwatu" }
];

const staffTasks = [
  { idn: "bersihkan kamar", eng: "clean the room" },
  { idn: "bersihkan dapur", eng: "clean the kitchen" },
  { idn: "ganti handuk", eng: "change the towels" },
  { idn: "ganti seprai", eng: "change the sheets" },
  { idn: "matikan AC", eng: "turn off the AC" },
  { idn: "hidupkan lampu", eng: "turn on the light" },
  { idn: "tutup pintu", eng: "close the door" },
  { idn: "buka pintu", eng: "open the door" },
  { idn: "cek kolam", eng: "check the pool" },
  { idn: "buang sampah", eng: "take out the rubbish" },
  { idn: "beli air galon", eng: "buy a water gallon" },
  { idn: "cek kamar mandi", eng: "check the bathroom" }
];

const problems = [
  { idn: "AC tidak dingin", eng: "the AC is not cold" },
  { idn: "air panas tidak jalan", eng: "the hot water is not working" },
  { idn: "lampu mati", eng: "the light is off / not working" },
  { idn: "wifi tidak jalan", eng: "the wifi is not working" },
  { idn: "pintu tidak bisa dibuka", eng: "the door cannot be opened" },
  { idn: "kunci hilang", eng: "the key is missing" },
  { idn: "toilet mampet", eng: "the toilet is blocked" },
  { idn: "air bocor", eng: "water is leaking" },
  { idn: "listrik mati", eng: "the electricity is off" },
  { idn: "ada bau tidak enak", eng: "there is a bad smell" },
  { idn: "ada nyamuk", eng: "there are mosquitoes" },
  { idn: "ada semut", eng: "there are ants" }
];

const times = [
  { idn: "sekarang", eng: "now" },
  { idn: "nanti", eng: "later" },
  { idn: "besok pagi", eng: "tomorrow morning" },
  { idn: "besok sore", eng: "tomorrow afternoon" },
  { idn: "malam ini", eng: "tonight" },
  { idn: "jam tujuh", eng: "at seven o'clock" },
  { idn: "jam delapan", eng: "at eight o'clock" },
  { idn: "jam sembilan", eng: "at nine o'clock" },
  { idn: "jam sepuluh", eng: "at ten o'clock" },
  { idn: "setelah makan", eng: "after eating" },
  { idn: "sebelum berangkat", eng: "before leaving" }
];

const verbs = [
  { idn: "makan", eng: "eat" },
  { idn: "minum", eng: "drink" },
  { idn: "pergi", eng: "go" },
  { idn: "datang", eng: "come" },
  { idn: "tidur", eng: "sleep" },
  { idn: "belajar", eng: "study" },
  { idn: "kerja", eng: "work" },
  { idn: "beli", eng: "buy" },
  { idn: "bayar", eng: "pay" },
  { idn: "tunggu", eng: "wait" },
  { idn: "lihat", eng: "look" },
  { idn: "cari", eng: "look for" },
  { idn: "pakai", eng: "use / wear" },
  { idn: "ambil", eng: "take / get" },
  { idn: "kirim", eng: "send" },
  { idn: "bantu", eng: "help" }
];

const adjectives = [
  { idn: "baik", eng: "good" },
  { idn: "enak", eng: "tasty / good" },
  { idn: "mahal", eng: "expensive" },
  { idn: "murah", eng: "cheap" },
  { idn: "dekat", eng: "near" },
  { idn: "jauh", eng: "far" },
  { idn: "cepat", eng: "fast" },
  { idn: "lama", eng: "long time" },
  { idn: "panas", eng: "hot" },
  { idn: "dingin", eng: "cold" },
  { idn: "bersih", eng: "clean" },
  { idn: "kotor", eng: "dirty" },
  { idn: "ramai", eng: "busy / crowded" },
  { idn: "sepi", eng: "quiet" },
  { idn: "mudah", eng: "easy" },
  { idn: "susah", eng: "difficult" }
];

const people = [
  { idn: "saya", eng: "I / me" },
  { idn: "aku", eng: "I / me informal" },
  { idn: "kamu", eng: "you" },
  { idn: "dia", eng: "he / she" },
  { idn: "kita", eng: "we / us inclusive" },
  { idn: "kami", eng: "we / us exclusive" },
  { idn: "mereka", eng: "they" },
  { idn: "tamu", eng: "guest" },
  { idn: "supir", eng: "driver" },
  { idn: "staf", eng: "staff" },
  { idn: "anak", eng: "child" },
  { idn: "keluarga", eng: "family" }
];

const numbers = [
  ["satu", "one"], ["dua", "two"], ["tiga", "three"], ["empat", "four"], ["lima", "five"],
  ["enam", "six"], ["tujuh", "seven"], ["delapan", "eight"], ["sembilan", "nine"], ["sepuluh", "ten"],
  ["sebelas", "eleven"], ["dua belas", "twelve"], ["dua puluh", "twenty"], ["lima puluh", "fifty"],
  ["seratus", "one hundred"], ["seribu", "one thousand"], ["sepuluh ribu", "ten thousand"], ["seratus ribu", "one hundred thousand"]
];

const coreBasicsPhrases = [
  makePhrase("core001", "Nama saya Tony", "My name is Tony", 1, ["intro"], "Nama saya + name", [["nama", "name"], ["saya", "I / my"]]),
  makePhrase("core002", "Saya dari Australia", "I am from Australia", 1, ["intro"], "Saya dari + place", [["dari", "from"]]),
  makePhrase("core003", "Saya tinggal di Sanur", "I live in Sanur", 1, ["intro", "location"], "Saya tinggal di + place", [["tinggal", "live"], ["di", "in / at"]]),
  makePhrase("core004", "Kamu dari mana?", "Where are you from?", 1, ["question"], "Kamu dari mana?", [["dari mana", "from where"]]),
  makePhrase("core005", "Kamu tinggal di mana?", "Where do you live?", 1, ["question"], "Kamu tinggal di mana?", [["di mana", "where"]]),
  makePhrase("core006", "Saya tidak tahu", "I do not know", 1, ["core"], "Saya tidak tahu", [["tidak", "not"], ["tahu", "know"]]),
  makePhrase("core007", "Saya belum tahu", "I do not know yet", 2, ["core"], "Saya belum tahu", [["belum", "not yet"]]),
  makePhrase("core008", "Bisa bantu saya?", "Can you help me?", 1, ["help"], "Bisa + verb?", [["bisa", "can"], ["bantu", "help"]]),
  makePhrase("core009", "Tolong ulangi", "Please repeat", 1, ["classroom", "help"], "Tolong + verb", [["tolong", "please"], ["ulangi", "repeat"]]),
  makePhrase("core010", "Pelan-pelan ya", "Slowly please", 1, ["listening"], "Pelan-pelan ya", [["pelan-pelan", "slowly"]]),
  makePhrase("core011", "Apa artinya?", "What does it mean?", 1, ["learning"], "Apa artinya?", [["arti", "meaning"]]),
  makePhrase("core012", "Bagaimana cara bilang ini?", "How do you say this?", 3, ["learning"], "Bagaimana cara bilang + object", [["bagaimana", "how"], ["bilang", "say"]]),
  makePhrase("core013", "Saya sedang belajar Bahasa Indonesia", "I am learning Indonesian", 2, ["learning"], "Saya sedang + verb", [["sedang", "currently"]]),
  makePhrase("core014", "Saya mengerti sedikit", "I understand a little", 2, ["learning"], "Saya mengerti + amount", [["mengerti", "understand"], ["sedikit", "a little"]]),
  makePhrase("core015", "Saya belum mengerti", "I do not understand yet", 2, ["learning"], "Saya belum + verb", [["belum", "not yet"], ["mengerti", "understand"]])
];

const warungPhrases = [
  makePhrase("food001", "Mau makan di mana?", "Where do you want to eat?", 1, ["food", "question"], "Mau + verb + di mana?"),
  makePhrase("food002", "Saya mau pesan makanan", "I want to order food", 1, ["food", "ordering"], "Saya mau + verb + object"),
  makePhrase("food003", "Mau pesan apa?", "What would you like to order?", 1, ["food", "question"], "Mau pesan apa?"),
  makePhrase("food004", "Yang enak apa?", "What is good?", 1, ["food", "recommendation"], "Yang enak apa?"),
  makePhrase("food005", "Yang paling enak apa?", "What is the best?", 2, ["food", "recommendation"], "Yang paling + adjective + apa?"),
  makePhrase("food006", "Pedas tidak?", "Is it spicy?", 1, ["food", "question"], "Adjective + tidak?"),
  makePhrase("food007", "Jangan terlalu pedas", "Not too spicy please", 2, ["food", "preference"], "Jangan terlalu + adjective"),
  makePhrase("food008", "Sedikit pedas saja", "Just a little spicy", 2, ["food", "preference"], "Sedikit + adjective + saja"),
  makePhrase("food009", "Tidak pakai sambal", "No sambal", 2, ["food", "preference"], "Tidak pakai + noun"),
  makePhrase("food010", "Tanpa gula", "Without sugar", 2, ["drink", "preference"], "Tanpa + noun"),
  makePhrase("food011", "Pakai es?", "With ice?", 2, ["drink", "question"], "Pakai + noun?"),
  makePhrase("food012", "Makan di sini", "Eat here", 1, ["food"], "Makan di sini"),
  makePhrase("food013", "Bungkus ya", "Takeaway please", 2, ["food", "takeaway"], "Bungkus ya"),
  makePhrase("food014", "Berapa semuanya?", "How much is everything?", 2, ["payment"], "Berapa semuanya?"),
  makePhrase("food015", "Bisa bayar pakai kartu?", "Can I pay by card?", 2, ["payment"], "Bisa bayar pakai + method?"),
  makePhrase("food016", "Bisa bayar tunai?", "Can I pay cash?", 2, ["payment"], "Bisa bayar + method?"),
  makePhrase("food017", "Ada menu bahasa Inggris?", "Is there an English menu?", 2, ["food", "question"], "Ada + noun?"),
  makePhrase("food018", "Saya alergi kacang", "I am allergic to peanuts", 3, ["food", "health"], "Saya alergi + noun"),
  makePhrase("food019", "Saya tidak makan babi", "I do not eat pork", 2, ["food", "preference"], "Saya tidak makan + noun"),
  makePhrase("food020", "Ini sudah termasuk pajak?", "Does this include tax?", 3, ["payment", "question"], "Ini sudah termasuk + noun?"),
  ...buildPatternPhrases("foodMau", "Saya mau ___", "I want ___", [...foodItems, ...drinks], 1, ["food", "ordering", "pattern:saya_mau"]),
  ...buildPatternPhrases("foodAda", "Ada ___?", "Do you have ___?", [...foodItems, ...drinks], 2, ["food", "question", "pattern:ada"])
];

const transportPhrases = [
  makePhrase("trans001", "Bisa jemput kami?", "Can you pick us up?", 2, ["driver", "pickup"], "Bisa + verb + object?"),
  makePhrase("trans002", "Bisa jemput kami jam tujuh?", "Can you pick us up at seven?", 2, ["driver", "pickup", "time"], "Bisa jemput + person + time?"),
  makePhrase("trans003", "Saya kirim lokasi sekarang", "I will send the location now", 2, ["driver", "location"], "Saya kirim + object + time"),
  makePhrase("trans004", "Di mana lokasinya?", "Where is the location?", 1, ["location"], "Di mana + noun?"),
  makePhrase("trans005", "Berapa lama ke sana?", "How long to get there?", 2, ["transport", "time"], "Berapa lama ke + place?"),
  makePhrase("trans006", "Macet ya?", "Traffic, yeah?", 2, ["transport", "spoken"], "Macet ya?"),
  makePhrase("trans007", "Kita berangkat sekarang", "We leave now", 2, ["transport"], "Kita + verb + time"),
  makePhrase("trans008", "Tolong tunggu sebentar", "Please wait a moment", 1, ["driver", "polite"], "Tolong + verb + duration"),
  makePhrase("trans009", "Bisa langsung ke villa?", "Can we go directly to the villa?", 3, ["driver", "villa"], "Bisa langsung ke + place?"),
  makePhrase("trans010", "Berapa harganya?", "How much is the price?", 1, ["payment"], "Berapa harganya?"),
  makePhrase("trans011", "Tolong pelan-pelan", "Please go slowly", 2, ["driver", "safety"], "Tolong + adverb"),
  makePhrase("trans012", "Tolong hati-hati", "Please be careful", 2, ["driver", "safety"], "Tolong + adjective"),
  makePhrase("trans013", "Bisa berhenti di sini?", "Can you stop here?", 2, ["driver"], "Bisa + verb + location?"),
  makePhrase("trans014", "Kita hampir sampai?", "Are we almost there?", 2, ["driver", "question"], "Kita hampir + verb?"),
  makePhrase("trans015", "Lewat jalan mana?", "Which road are we taking?", 3, ["driver", "question"], "Lewat jalan mana?"),
  ...buildPatternPhrases("goTo", "Saya mau ke ___", "I want to go to ___", places, 1, ["transport", "pattern:saya_mau_ke"]),
  ...buildPatternPhrases("fromPlace", "Saya dari ___", "I am from ___", places, 1, ["transport", "location", "pattern:saya_dari"]),
  ...buildPatternPhrases("howLong", "Berapa lama ke ___?", "How long to ___?", places, 2, ["transport", "time", "pattern:berapa_lama"])
];

const villaPhrases = [
  makePhrase("villa001", "Cleaning jam berapa?", "What time is cleaning?", 1, ["villa", "cleaning"], "Noun + jam berapa?"),
  makePhrase("villa002", "Besok cleaning jam sebelas pagi", "Cleaning tomorrow at eleven in the morning", 2, ["villa", "cleaning"], "Time + activity + time"),
  makePhrase("villa003", "Tolong matikan AC kalau keluar", "Please turn off the AC when going out", 2, ["villa", "instruction"], "Tolong + verb + kalau + action"),
  makePhrase("villa004", "Tolong tutup pintu", "Please close the door", 1, ["villa", "instruction"], "Tolong + verb + object"),
  makePhrase("villa005", "Kunci di mana?", "Where is the key?", 1, ["villa", "question"], "Noun + di mana?"),
  makePhrase("villa006", "Tamu sudah datang", "The guests have arrived", 2, ["villa", "guests"], "Subject + sudah + verb"),
  makePhrase("villa007", "Tamunya sudah datang belum?", "Have the guests arrived yet?", 3, ["villa", "guests"], "Subject + sudah + verb + belum?"),
  makePhrase("villa008", "Tolong siapkan kamar", "Please prepare the room", 2, ["villa", "instruction"], "Tolong + verb + object"),
  makePhrase("villa009", "Tolong cek semuanya", "Please check everything", 2, ["villa", "instruction"], "Tolong + verb + object"),
  makePhrase("villa010", "Tolong kirim foto setelah selesai", "Please send a photo after finishing", 3, ["villa", "whatsapp"], "Tolong + verb + object + time"),
  makePhrase("villa011", "Saya akan datang sebentar lagi", "I will come soon", 2, ["villa", "message"], "Saya akan + verb + time"),
  makePhrase("villa012", "Bisa datang sekarang?", "Can you come now?", 2, ["villa", "request"], "Bisa + verb + time?"),
  makePhrase("villa013", "Jangan lupa kunci pintu", "Do not forget to lock the door", 2, ["villa", "instruction"], "Jangan lupa + verb + object"),
  makePhrase("villa014", "Tolong kabari saya", "Please update me", 2, ["villa", "whatsapp"], "Tolong kabari + person"),
  makePhrase("villa015", "Sudah selesai belum?", "Is it finished yet?", 2, ["villa", "question"], "Sudah + adjective + belum?"),
  ...buildPatternPhrases("villaTask", "Tolong ___", "Please ___", staffTasks, 1, ["villa", "instruction", "pattern:tolong"]),
  ...buildPatternPhrases("villaCan", "Bisa ___ sekarang?", "Can you ___ now?", staffTasks.slice(0, 8), 2, ["villa", "request", "pattern:bisa"]),
  ...buildPatternPhrases("villaProblem", "Ada masalah, ___", "There is a problem, ___", problems, 2, ["villa", "problem", "pattern:ada_masalah"])
];

const shoppingPhrases = [
  makePhrase("shop001", "Ini berapa?", "How much is this?", 1, ["shopping", "price"], "Ini berapa?"),
  makePhrase("shop002", "Berapa harganya?", "How much is the price?", 1, ["shopping", "price"], "Berapa harganya?"),
  makePhrase("shop003", "Bisa kurang?", "Can you reduce the price?", 2, ["shopping", "bargaining"], "Bisa + verb?"),
  makePhrase("shop004", "Mahal sekali", "Very expensive", 2, ["shopping", "bargaining"], "Adjective + sekali"),
  makePhrase("shop005", "Saya lihat dulu", "I will look first", 2, ["shopping", "polite_refusal"], "Saya + verb + dulu"),
  makePhrase("shop006", "Ada warna lain?", "Do you have another color?", 2, ["shopping", "question"], "Ada + noun + lain?"),
  makePhrase("shop007", "Ada ukuran lain?", "Do you have another size?", 2, ["shopping", "question"], "Ada + noun + lain?"),
  makePhrase("shop008", "Saya mau yang ini", "I want this one", 1, ["shopping", "choosing"], "Saya mau yang + demonstrative"),
  makePhrase("shop009", "Saya tidak jadi", "I changed my mind / I will not buy", 2, ["shopping", "polite_refusal"], "Saya tidak jadi"),
  makePhrase("shop010", "Nanti saya kembali", "I will come back later", 2, ["shopping", "polite_refusal"], "Nanti saya + verb"),
  makePhrase("shop011", "Boleh coba?", "May I try it?", 2, ["shopping", "question"], "Boleh + verb?"),
  makePhrase("shop012", "Ada yang lebih murah?", "Is there a cheaper one?", 2, ["shopping", "question"], "Ada yang lebih + adjective?"),
  makePhrase("shop013", "Terlalu mahal untuk saya", "Too expensive for me", 3, ["shopping", "bargaining"], "Terlalu + adjective + untuk saya"),
  makePhrase("shop014", "Harga pas berapa?", "What is the final price?", 3, ["shopping", "bargaining"], "Harga pas berapa?"),
  makePhrase("shop015", "Saya bayar sekarang", "I will pay now", 1, ["shopping", "payment"], "Saya bayar + time")
];

const problemPhrases = [
  makePhrase("prob001", "Ada masalah", "There is a problem", 2, ["problem"], "Ada + noun"),
  makePhrase("prob002", "Ini tidak bisa", "This cannot / this does not work", 1, ["problem"], "Ini tidak bisa"),
  makePhrase("prob003", "Tidak jalan", "It is not working", 2, ["problem"], "Tidak jalan"),
  makePhrase("prob004", "Ini rusak", "This is broken", 2, ["problem"], "Ini + adjective"),
  makePhrase("prob005", "Tolong bantu sekarang", "Please help now", 2, ["urgent"], "Tolong + verb + time"),
  makePhrase("prob006", "Saya perlu dokter", "I need a doctor", 3, ["health"], "Saya perlu + noun"),
  makePhrase("prob007", "Saya sakit", "I am sick / in pain", 2, ["health"], "Saya + adjective"),
  makePhrase("prob008", "Bisa datang cepat?", "Can you come quickly?", 3, ["urgent"], "Bisa + verb + adverb?"),
  makePhrase("prob009", "Ini darurat", "This is urgent / an emergency", 3, ["emergency"], "Ini + noun/adjective"),
  makePhrase("prob010", "Saya butuh bantuan", "I need help", 2, ["problem"], "Saya butuh + noun"),
  makePhrase("prob011", "Bisa telepon saya?", "Can you call me?", 2, ["problem", "phone"], "Bisa + verb + person?"),
  makePhrase("prob012", "Tolong kirim lokasi", "Please send the location", 2, ["problem", "location"], "Tolong + verb + object"),
  ...problems.map((p, i) => makePhrase(`probX${String(i + 1).padStart(3, "0")}`, p.idn, p.eng, 2, ["problem", "villa"], "Problem phrase", [[p.idn, p.eng]]))
];

const timeNumberPhrases = [
  makePhrase("time001", "Jam berapa?", "What time?", 1, ["time"], "Jam berapa?"),
  makePhrase("time002", "Berapa lama?", "How long?", 2, ["time"], "Berapa lama?"),
  makePhrase("time003", "Besok pagi", "Tomorrow morning", 1, ["time"], "Day + time"),
  makePhrase("time004", "Nanti sore", "Later this afternoon", 2, ["time"], "Nanti + time"),
  makePhrase("time005", "Hari ini", "Today", 1, ["time"], "Time phrase"),
  makePhrase("time006", "Minggu depan", "Next week", 2, ["time"], "Time phrase"),
  makePhrase("time007", "Bulan depan", "Next month", 2, ["time"], "Time phrase"),
  makePhrase("time008", "Sebentar lagi", "Soon", 2, ["time"], "Time phrase"),
  makePhrase("time009", "Terlambat sedikit", "A little late", 2, ["time"], "Adjective + amount"),
  makePhrase("time010", "Tepat waktu", "On time", 2, ["time"], "Time phrase"),
  ...buildPatternPhrases("timeAt", "Saya datang ___", "I will come ___", times, 2, ["time", "pattern:saya_datang"]),
  ...buildPatternPhrases("timeCan", "Bisa ___?", "Can it be ___?", times, 2, ["time", "pattern:bisa"])
];

const socialPhrases = [
  makePhrase("soc001", "Apa kabar?", "How are you?", 1, ["social", "greeting"], "Apa kabar?"),
  makePhrase("soc002", "Baik, terima kasih", "Good, thank you", 1, ["social", "reply"], "Baik, terima kasih"),
  makePhrase("soc003", "Sudah makan?", "Have you eaten yet?", 1, ["social", "daily"], "Sudah + verb?"),
  makePhrase("soc004", "Belum, nanti", "Not yet, later", 1, ["social", "reply"], "Belum, nanti"),
  makePhrase("soc005", "Sudah lama tinggal di Bali?", "Have you lived in Bali for a long time?", 3, ["social", "question"], "Sudah lama + verb + place?"),
  makePhrase("soc006", "Belum lama", "Not long yet", 2, ["social", "reply"], "Belum + adjective"),
  makePhrase("soc007", "Kerja apa?", "What work do you do?", 2, ["work", "question"], "Kerja apa?"),
  makePhrase("soc008", "Saya kerja online", "I work online", 2, ["work", "reply"], "Saya kerja + method"),
  makePhrase("soc009", "Keluarga kamu di mana?", "Where is your family?", 3, ["family", "question"], "Noun + kamu + di mana?"),
  makePhrase("soc010", "Anak kamu berapa?", "How many children do you have?", 3, ["family", "question"], "Noun + kamu + berapa?"),
  makePhrase("soc011", "Saya punya dua anak", "I have two children", 2, ["family"], "Saya punya + number + noun"),
  makePhrase("soc012", "Bali sangat indah", "Bali is very beautiful", 2, ["social"], "Subject + sangat + adjective"),
  makePhrase("soc013", "Saya suka tinggal di Bali", "I like living in Bali", 2, ["social"], "Saya suka + verb"),
  makePhrase("soc014", "Cuaca panas hari ini", "The weather is hot today", 2, ["weather"], "Noun + adjective + time"),
  makePhrase("soc015", "Hujan sebentar lagi", "It will rain soon", 2, ["weather"], "Weather + time"),
  ...buildPatternPhrases("socAlready", "Sudah ___?", "Have you ___ yet?", verbs.slice(0, 8), 1, ["social", "pattern:sudah"]),
  ...buildPatternPhrases("socWant", "Mau ___?", "Do you want to ___?", verbs.slice(0, 10), 1, ["social", "pattern:mau"])
];

const directionsPhrases = [
  makePhrase("dir001", "Di mana toilet?", "Where is the toilet?", 1, ["direction"], "Di mana + noun?"),
  makePhrase("dir002", "Di mana pintu masuk?", "Where is the entrance?", 2, ["direction"], "Di mana + noun?"),
  makePhrase("dir003", "Di mana pintu keluar?", "Where is the exit?", 2, ["direction"], "Di mana + noun?"),
  makePhrase("dir004", "Belok kiri", "Turn left", 1, ["direction"], "Direction phrase"),
  makePhrase("dir005", "Belok kanan", "Turn right", 1, ["direction"], "Direction phrase"),
  makePhrase("dir006", "Jalan lurus", "Go straight", 1, ["direction"], "Direction phrase"),
  makePhrase("dir007", "Di depan", "In front", 1, ["direction"], "Location phrase"),
  makePhrase("dir008", "Di belakang", "Behind", 1, ["direction"], "Location phrase"),
  makePhrase("dir009", "Di sebelah kiri", "On the left side", 2, ["direction"], "Location phrase"),
  makePhrase("dir010", "Di sebelah kanan", "On the right side", 2, ["direction"], "Location phrase"),
  makePhrase("dir011", "Dekat sini?", "Is it near here?", 1, ["direction"], "Adjective + sini?"),
  makePhrase("dir012", "Jauh dari sini?", "Is it far from here?", 2, ["direction"], "Jauh dari + place?"),
  ...buildPatternPhrases("wherePlace", "Di mana ___?", "Where is ___?", places, 1, ["direction", "pattern:di_mana"])
];

const whatsappPhrases = [
  makePhrase("wa001", "Halo, selamat pagi", "Hello, good morning", 1, ["whatsapp", "greeting"], "Greeting"),
  makePhrase("wa002", "Maaf baru balas", "Sorry for the late reply", 2, ["whatsapp"], "Maaf baru + verb"),
  makePhrase("wa003", "Saya cek dulu", "I will check first", 2, ["whatsapp"], "Saya + verb + dulu"),
  makePhrase("wa004", "Saya kabari nanti", "I will update you later", 2, ["whatsapp"], "Saya kabari + time"),
  makePhrase("wa005", "Bisa kirim foto?", "Can you send a photo?", 2, ["whatsapp"], "Bisa + verb + object?"),
  makePhrase("wa006", "Bisa kirim lokasi?", "Can you send the location?", 2, ["whatsapp"], "Bisa + verb + object?"),
  makePhrase("wa007", "Saya sudah kirim", "I already sent it", 2, ["whatsapp"], "Saya sudah + verb"),
  makePhrase("wa008", "Saya belum terima", "I have not received it yet", 3, ["whatsapp"], "Saya belum + verb"),
  makePhrase("wa009", "Tolong balas kalau sudah selesai", "Please reply when finished", 3, ["whatsapp"], "Tolong + verb + kalau + condition"),
  makePhrase("wa010", "Terima kasih banyak", "Thank you very much", 1, ["whatsapp", "polite"], "Terima kasih + amount"),
  makePhrase("wa011", "Baik, saya tunggu", "Okay, I will wait", 2, ["whatsapp"], "Baik, saya + verb"),
  makePhrase("wa012", "Tidak apa-apa", "No problem / it is okay", 1, ["whatsapp"], "Fixed phrase"),
  makePhrase("wa013", "Sampai nanti", "See you later", 1, ["whatsapp"], "Fixed phrase"),
  makePhrase("wa014", "Sampai besok", "See you tomorrow", 1, ["whatsapp"], "Fixed phrase"),
  makePhrase("wa015", "Saya sedang di jalan", "I am on the way", 2, ["whatsapp", "transport"], "Saya sedang + location/activity")
];

const appointmentPhrases = [
  makePhrase("appt001", "Bisa buat janji?", "Can I make an appointment?", 2, ["appointment"], "Bisa + verb + noun?"),
  makePhrase("appt002", "Ada waktu besok?", "Is there time tomorrow?", 2, ["appointment"], "Ada waktu + time?"),
  makePhrase("appt003", "Jam berapa tersedia?", "What time is available?", 3, ["appointment"], "Jam berapa + adjective?"),
  makePhrase("appt004", "Saya mau booking", "I want to book", 2, ["appointment"], "Saya mau + verb"),
  makePhrase("appt005", "Bisa ubah jadwal?", "Can we change the schedule?", 3, ["appointment"], "Bisa + verb + object?"),
  makePhrase("appt006", "Saya terlambat sedikit", "I am a little late", 2, ["appointment"], "Saya + adjective + amount"),
  makePhrase("appt007", "Saya datang tepat waktu", "I will come on time", 2, ["appointment"], "Saya datang + time phrase"),
  makePhrase("appt008", "Bisa mulai sekarang?", "Can we start now?", 2, ["appointment"], "Bisa + verb + time?"),
  makePhrase("appt009", "Bisa selesai jam lima?", "Can it finish at five?", 3, ["appointment"], "Bisa selesai + time?"),
  makePhrase("appt010", "Konfirmasi untuk besok", "Confirming for tomorrow", 3, ["appointment", "whatsapp"], "Konfirmasi untuk + time")
];

const topicCoreWords = {
  core_basics: [
    ...people.map((p, i) => makeWord(`cwP${i}`, p.idn, p.eng, "pronoun/person", 1, ["core"])),
    ...verbs.map((v, i) => makeWord(`cwV${i}`, v.idn, v.eng, "verb", i < 8 ? 1 : 2, ["verb"])),
    ...adjectives.map((a, i) => makeWord(`cwA${i}`, a.idn, a.eng, "adjective", i < 8 ? 1 : 2, ["adjective"])),
    makeWord("cw001", "di", "in / at / on", "preposition", 1, ["core"]),
    makeWord("cw002", "ke", "to", "preposition", 1, ["core"]),
    makeWord("cw003", "dari", "from", "preposition", 1, ["core"]),
    makeWord("cw004", "dan", "and", "connector", 1, ["core"]),
    makeWord("cw005", "tapi", "but", "connector", 1, ["core"]),
    makeWord("cw006", "atau", "or", "connector", 2, ["core"]),
    makeWord("cw007", "karena", "because", "connector", 2, ["core"]),
    makeWord("cw008", "sudah", "already", "aspect", 1, ["core"]),
    makeWord("cw009", "belum", "not yet", "aspect", 1, ["core"]),
    makeWord("cw010", "sedang", "currently", "aspect", 2, ["core"]),
    makeWord("cw011", "akan", "will", "future marker", 2, ["core"]),
    makeWord("cw012", "mungkin", "maybe", "adverb", 2, ["core"]),
    makeWord("cw013", "tolong", "please / help", "politeness", 1, ["core"]),
    makeWord("cw014", "maaf", "sorry / excuse me", "politeness", 1, ["core"]),
    makeWord("cw015", "terima kasih", "thank you", "politeness", 1, ["core"])
  ],
  warung_food: [
    ...foodItems.map((f, i) => makeWord(`fwF${i}`, f.idn, f.eng, "food", 1, ["food"])),
    ...drinks.map((d, i) => makeWord(`fwD${i}`, d.idn, d.eng, "drink", 1, ["drink"])),
    makeWord("fw001", "pedas", "spicy", "adjective", 1, ["food"]),
    makeWord("fw002", "manis", "sweet", "adjective", 2, ["food"]),
    makeWord("fw003", "asin", "salty", "adjective", 2, ["food"]),
    makeWord("fw004", "bungkus", "takeaway", "verb/noun", 2, ["food"]),
    makeWord("fw005", "menu", "menu", "noun", 1, ["food"])
  ],
  transport_driver: [
    makeWord("tw001", "jemput", "pick up", "verb", 2, ["driver"]),
    makeWord("tw002", "antar", "drop off / take", "verb", 2, ["driver"]),
    makeWord("tw003", "lokasi", "location", "noun", 1, ["location"]),
    makeWord("tw004", "alamat", "address", "noun", 2, ["location"]),
    makeWord("tw005", "macet", "traffic jam", "noun/adjective", 2, ["transport"]),
    makeWord("tw006", "langsung", "directly", "adverb", 3, ["transport"]),
    makeWord("tw007", "berangkat", "leave", "verb", 2, ["transport"]),
    makeWord("tw008", "sampai", "arrive", "verb", 2, ["transport"]),
    ...places.map((p, i) => makeWord(`twP${i}`, p.idn, p.eng, "place", 1, ["place"]))
  ],
  villa_staff: [
    ...staffTasks.map((t, i) => makeWord(`vwT${i}`, t.idn, t.eng, "staff task", 2, ["villa"])),
    makeWord("vw001", "kamar", "room", "noun", 1, ["villa"]),
    makeWord("vw002", "kunci", "key", "noun", 1, ["villa"]),
    makeWord("vw003", "pintu", "door", "noun", 1, ["villa"]),
    makeWord("vw004", "AC", "air conditioner", "noun", 1, ["villa"]),
    makeWord("vw005", "kolam", "pool", "noun", 2, ["villa"]),
    makeWord("vw006", "tamu", "guest", "noun", 1, ["villa"]),
    makeWord("vw007", "sampah", "rubbish", "noun", 2, ["villa"])
  ],
  shopping_bargaining: [
    makeWord("sw001", "harga", "price", "noun", 1, ["shopping"]),
    makeWord("sw002", "mahal", "expensive", "adjective", 1, ["shopping"]),
    makeWord("sw003", "murah", "cheap", "adjective", 2, ["shopping"]),
    makeWord("sw004", "beli", "buy", "verb", 1, ["shopping"]),
    makeWord("sw005", "jual", "sell", "verb", 2, ["shopping"]),
    makeWord("sw006", "warna", "color", "noun", 2, ["shopping"]),
    makeWord("sw007", "ukuran", "size", "noun", 2, ["shopping"]),
    makeWord("sw008", "kurang", "less / reduce", "verb/adjective", 2, ["shopping"])
  ],
  problems_help: problems.map((p, i) => makeWord(`pw${i}`, p.idn, p.eng, "problem phrase", 2, ["problem"])),
  time_numbers: [
    ...numbers.map(([idn, eng], i) => makeWord(`nw${i}`, idn, eng, "number", i < 10 ? 1 : 2, ["number"])),
    ...times.map((t, i) => makeWord(`twTime${i}`, t.idn, t.eng, "time", 1, ["time"]))
  ],
  social_smalltalk: [
    makeWord("socw001", "apa kabar", "how are you", "expression", 1, ["social"]),
    makeWord("socw002", "keluarga", "family", "noun", 2, ["family"]),
    makeWord("socw003", "anak", "child", "noun", 2, ["family"]),
    makeWord("socw004", "istri", "wife", "noun", 2, ["family"]),
    makeWord("socw005", "suami", "husband", "noun", 2, ["family"]),
    makeWord("socw006", "kerja", "work", "verb/noun", 1, ["work"]),
    makeWord("socw007", "libur", "holiday / day off", "noun/verb", 2, ["daily"]),
    makeWord("socw008", "cuaca", "weather", "noun", 2, ["weather"]),
    makeWord("socw009", "hujan", "rain", "noun/verb", 2, ["weather"])
  ],
  directions_locations: places.map((p, i) => makeWord(`dw${i}`, p.idn, p.eng, "place", 1, ["direction"])),
  whatsapp_messages: [
    makeWord("waw001", "kirim", "send", "verb", 1, ["whatsapp"]),
    makeWord("waw002", "balas", "reply", "verb", 2, ["whatsapp"]),
    makeWord("waw003", "foto", "photo", "noun", 1, ["whatsapp"]),
    makeWord("waw004", "pesan", "message / order", "noun/verb", 1, ["whatsapp"]),
    makeWord("waw005", "kabari", "update / let know", "verb", 2, ["whatsapp"])
  ],
  appointments_services: [
    makeWord("appw001", "janji", "appointment", "noun", 2, ["appointment"]),
    makeWord("appw002", "jadwal", "schedule", "noun", 2, ["appointment"]),
    makeWord("appw003", "booking", "booking", "noun/verb", 1, ["appointment"]),
    makeWord("appw004", "tersedia", "available", "adjective", 3, ["appointment"]),
    makeWord("appw005", "konfirmasi", "confirmation", "noun/verb", 3, ["appointment"])
  ]
};

const conversations = {
  warung_food: [
    {
      id: "ccFood001",
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
    },
    {
      id: "ccFood002",
      title: "Asking Recommendation",
      level: 2,
      turns: [
        { speaker: "user", idn: "Yang paling enak apa?", eng: "What is the best?" },
        { speaker: "staff", idn: "Nasi campur enak", eng: "The mixed rice is good" },
        { speaker: "user", idn: "Oke, saya mau nasi campur", eng: "Okay, I want mixed rice" }
      ]
    }
  ],
  transport_driver: [
    {
      id: "ccTrans001",
      title: "Arrange Pickup",
      level: 2,
      turns: [
        { speaker: "user", idn: "Bisa jemput kami jam tujuh?", eng: "Can you pick us up at seven?" },
        { speaker: "driver", idn: "Bisa. Lokasinya di mana?", eng: "Can. Where is the location?" },
        { speaker: "user", idn: "Saya kirim lokasi sekarang", eng: "I will send the location now" },
        { speaker: "driver", idn: "Oke, sampai nanti", eng: "Okay, see you later" }
      ]
    },
    {
      id: "ccTrans002",
      title: "Traffic Delay",
      level: 2,
      turns: [
        { speaker: "driver", idn: "Maaf, jalan macet", eng: "Sorry, traffic is bad" },
        { speaker: "user", idn: "Tidak apa-apa, hati-hati", eng: "No problem, be careful" },
        { speaker: "driver", idn: "Saya datang sebentar lagi", eng: "I will arrive soon" }
      ]
    }
  ],
  villa_staff: [
    {
      id: "ccVilla001",
      title: "Arrange Cleaning",
      level: 2,
      turns: [
        { speaker: "staff", idn: "Besok cleaning jam berapa?", eng: "What time is cleaning tomorrow?" },
        { speaker: "user", idn: "Jam sebelas pagi ya", eng: "Eleven in the morning please" },
        { speaker: "staff", idn: "Baik pak", eng: "Okay sir" },
        { speaker: "user", idn: "Terima kasih", eng: "Thank you" }
      ]
    },
    {
      id: "ccVilla002",
      title: "Fix AC",
      level: 2,
      turns: [
        { speaker: "user", idn: "Ada masalah, AC tidak dingin", eng: "There is a problem, the AC is not cold" },
        { speaker: "staff", idn: "Baik, saya cek sekarang", eng: "Okay, I will check now" },
        { speaker: "user", idn: "Tolong kabari saya", eng: "Please update me" }
      ]
    }
  ],
  shopping_bargaining: [
    {
      id: "ccShop001",
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
  ],
  problems_help: [
    {
      id: "ccProb001",
      title: "Ask for Help",
      level: 2,
      turns: [
        { speaker: "user", idn: "Tolong bantu sekarang", eng: "Please help now" },
        { speaker: "staff", idn: "Ada masalah apa?", eng: "What problem is there?" },
        { speaker: "user", idn: "Air bocor", eng: "Water is leaking" },
        { speaker: "staff", idn: "Saya datang cepat", eng: "I will come quickly" }
      ]
    }
  ],
  social_smalltalk: [
    {
      id: "ccSoc001",
      title: "Friendly Small Talk",
      level: 2,
      turns: [
        { speaker: "local", idn: "Apa kabar?", eng: "How are you?" },
        { speaker: "user", idn: "Baik, terima kasih", eng: "Good, thank you" },
        { speaker: "local", idn: "Sudah lama tinggal di Bali?", eng: "Have you lived in Bali long?" },
        { speaker: "user", idn: "Belum lama", eng: "Not long yet" }
      ]
    },
    {
      id: "ccSoc002",
      title: "Family Chat",
      level: 3,
      turns: [
        { speaker: "local", idn: "Anak kamu berapa?", eng: "How many children do you have?" },
        { speaker: "user", idn: "Saya punya dua anak", eng: "I have two children" },
        { speaker: "local", idn: "Keluarga kamu di Bali?", eng: "Is your family in Bali?" }
      ]
    }
  ],
  whatsapp_messages: [
    {
      id: "ccWa001",
      title: "WhatsApp Update",
      level: 2,
      turns: [
        { speaker: "staff", idn: "Sudah selesai pak", eng: "It is finished, sir" },
        { speaker: "user", idn: "Tolong kirim foto", eng: "Please send a photo" },
        { speaker: "staff", idn: "Baik, saya kirim sekarang", eng: "Okay, I will send it now" },
        { speaker: "user", idn: "Terima kasih banyak", eng: "Thank you very much" }
      ]
    }
  ],
  appointments_services: [
    {
      id: "ccApp001",
      title: "Make Appointment",
      level: 3,
      turns: [
        { speaker: "user", idn: "Bisa buat janji besok?", eng: "Can I make an appointment tomorrow?" },
        { speaker: "staff", idn: "Jam berapa?", eng: "What time?" },
        { speaker: "user", idn: "Jam sepuluh pagi", eng: "Ten in the morning" }
      ]
    }
  ]
};

const topics = [
  {
    id: "core_basics",
    label: "Core Basics",
    priority: 1,
    description: "Pronouns, glue words, common verbs, sentence patterns, and survival phrases.",
    coreWords: topicCoreWords.core_basics,
    phrases: [
      ...coreBasicsPhrases,
      ...buildPatternPhrases("coreCan", "Bisa ___?", "Can you ___?", verbs.slice(0, 12), 1, ["core", "pattern:bisa"]),
      ...buildPatternPhrases("coreWant", "Saya mau ___", "I want to ___", verbs.slice(0, 12), 1, ["core", "pattern:saya_mau"]),
      ...buildPatternPhrases("coreAlready", "Saya sudah ___", "I have already ___", verbs.slice(0, 10), 2, ["core", "pattern:sudah"]),
      ...buildPatternPhrases("coreNotYet", "Saya belum ___", "I have not ___ yet", verbs.slice(0, 10), 2, ["core", "pattern:belum"]),
      ...buildPatternPhrases("coreNeed", "Saya perlu ___", "I need ___", places.slice(0, 8), 2, ["core", "pattern:perlu"])
    ],
    conversationChains: []
  },
  {
    id: "warung_food",
    label: "Warung & Food",
    priority: 2,
    description: "Ordering food, drinks, spice level, preferences, bills, and recommendations.",
    coreWords: topicCoreWords.warung_food,
    phrases: warungPhrases,
    conversationChains: conversations.warung_food
  },
  {
    id: "transport_driver",
    label: "Transport & Drivers",
    priority: 3,
    description: "Pickup times, locations, traffic, prices, directions, and driver messages.",
    coreWords: topicCoreWords.transport_driver,
    phrases: transportPhrases,
    conversationChains: conversations.transport_driver
  },
  {
    id: "villa_staff",
    label: "Villa & Staff",
    priority: 4,
    description: "Housekeeping, guest arrivals, maintenance, AC, cleaning, and WhatsApp instructions.",
    coreWords: topicCoreWords.villa_staff,
    phrases: villaPhrases,
    conversationChains: conversations.villa_staff
  },
  {
    id: "shopping_bargaining",
    label: "Shopping & Bargaining",
    priority: 5,
    description: "Prices, bargaining, choosing items, polite refusal, colors, and sizes.",
    coreWords: topicCoreWords.shopping_bargaining,
    phrases: shoppingPhrases,
    conversationChains: conversations.shopping_bargaining
  },
  {
    id: "problems_help",
    label: "Problems & Help",
    priority: 6,
    description: "Broken things, urgent help, health, missing items, and emergency phrases.",
    coreWords: topicCoreWords.problems_help,
    phrases: problemPhrases,
    conversationChains: conversations.problems_help
  },
  {
    id: "time_numbers",
    label: "Time & Numbers",
    priority: 7,
    description: "Numbers, appointments, delays, scheduling, and time expressions.",
    coreWords: topicCoreWords.time_numbers,
    phrases: timeNumberPhrases,
    conversationChains: []
  },
  {
    id: "social_smalltalk",
    label: "Social & Small Talk",
    priority: 8,
    description: "Friendly local conversations, family, work, weather, and daily life.",
    coreWords: topicCoreWords.social_smalltalk,
    phrases: socialPhrases,
    conversationChains: conversations.social_smalltalk
  },
  {
    id: "directions_locations",
    label: "Directions & Locations",
    priority: 9,
    description: "Asking where things are, giving basic directions, and finding places.",
    coreWords: topicCoreWords.directions_locations,
    phrases: directionsPhrases,
    conversationChains: []
  },
  {
    id: "whatsapp_messages",
    label: "WhatsApp Messages",
    priority: 10,
    description: "Short, natural messages for staff, drivers, services, and daily coordination.",
    coreWords: topicCoreWords.whatsapp_messages,
    phrases: whatsappPhrases,
    conversationChains: conversations.whatsapp_messages
  },
  {
    id: "appointments_services",
    label: "Appointments & Services",
    priority: 11,
    description: "Booking, rescheduling, confirming, arriving late, and service appointments.",
    coreWords: topicCoreWords.appointments_services,
    phrases: appointmentPhrases,
    conversationChains: conversations.appointments_services
  }
];

export const baliBahasaDataset = {
  meta: {
    name: "Bali Bahasa Conversation Dataset",
    version: DATASET_VERSION,
    designGoal: "Fast, practical Indonesian for daily Bali life",
    contentStyle: "Conversation-first, pattern-heavy, Bali-context focused",
    estimatedItems: topics.reduce((sum, topic) => sum + topic.phrases.length + topic.coreWords.length + (topic.conversationChains || []).length, 0),
    levels: ["absolute_beginner", "beginner", "early_conversation", "conversation", "confident_speaker"]
  },
  topics,
  recommendedConversationTopics: [
    { id: "ct001", label: "Introducing yourself", priority: 1, neededFor: "first conversations" },
    { id: "ct002", label: "Ordering food and drinks", priority: 2, neededFor: "daily life" },
    { id: "ct003", label: "Talking to drivers", priority: 3, neededFor: "transport in Bali" },
    { id: "ct004", label: "Villa staff instructions", priority: 4, neededFor: "Tony's villa operations" },
    { id: "ct005", label: "Asking prices and bargaining", priority: 5, neededFor: "markets and shopping" },
    { id: "ct006", label: "Problems and urgent help", priority: 6, neededFor: "real-world safety" },
    { id: "ct007", label: "Time, scheduling, and appointments", priority: 7, neededFor: "planning" },
    { id: "ct008", label: "Small talk with locals", priority: 8, neededFor: "relationship building" },
    { id: "ct009", label: "Directions and locations", priority: 9, neededFor: "moving around Bali" },
    { id: "ct010", label: "WhatsApp-style messages", priority: 10, neededFor: "daily coordination" }
  ],
  drillGenerationRules: {
    translate: "Show English, learner types Bahasa Indonesia.",
    multipleChoice: "Use same-topic distractors first, then other-topic distractors.",
    listening: "Play or show Indonesian phrase, learner chooses English meaning.",
    builder: "Break Indonesian phrase into word tiles and rebuild the sentence.",
    conversation: "Show previous speaker turn and ask learner for the best reply.",
    patternTraining: "Prioritise reusable patterns: Saya mau, Bisa, Tolong, Di mana, Sudah belum, Berapa."
  }
};

export default baliBahasaDataset;
