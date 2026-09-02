import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

// Lookup of Hindi/Tamil translations for the built-in demo products, keyed
// by their English title. Used both to seed a brand-new database and to
// patch/heal an already-existing data/db.json that was created before these
// translations existed (so users don't need to delete their local data
// after pulling an update).
const DEMO_PRODUCT_TRANSLATIONS = {
  "Hand-Carved Wooden Ganesha Idol": {
    titleHi: "हस्तनिर्मित लकड़ी की गणेश मूर्ति",
    titleTa: "கையால் செதுக்கப்பட்ட மர கணேச சிலை",
    descriptionHi: "एक तीसरी पीढ़ी के लकड़ी शिल्पकार द्वारा शीशम की एक ही लकड़ी से हाथ से तराशी गई, प्राकृतिक सागौन तेल पॉलिश के साथ तैयार।",
    descriptionTa: "மூன்றாம் தலைமுறை மரவேலைக் கலைஞரால் ஒரே சீசம் மரத் துண்டிலிருந்து கையால் செதுக்கப்பட்டு, இயற்கை தேக்கு எண்ணெய் மெருகூட்டலுடன் முடிக்கப்பட்டது."
  },
  "Hand-Painted Madhubani Wall Art": {
    titleHi: "हाथ से चित्रित मधुबनी वॉल आर्ट",
    titleTa: "கையால் வரையப்பட்ட மதுபனி சுவர் ஓவியம்",
    descriptionHi: "हस्तनिर्मित कागज पर पारंपरिक मधुबनी पेंटिंग, फ्रेम में तैयार और टांगने के लिए। हर टुकड़ा प्राकृतिक रंगों से हाथ से पेंट किया गया है।",
    descriptionTa: "கையால் செய்யப்பட்ட காகிதத்தில் பாரம்பரிய மதுபனி ஓவியம், சட்டமிடப்பட்டு தொங்கவிட தயார். ஒவ்வொரு படைப்பும் இயற்கை நிறமிகளால் கையால் வரையப்பட்டது."
  },
  "Terracotta Warrior Planter": {
    titleHi: "टेराकोटा वॉरियर प्लांटर",
    titleTa: "டெராகோட்டா வாரியர் தாவரக் கலம்",
    descriptionHi: "लकड़ी के भट्टे में पकाया गया हाथ से बना टेराकोटा प्लांटर। जल निकासी छेद सहित, रसीले पौधों और जड़ी-बूटियों के लिए उपयुक्त।",
    descriptionTa: "மர சூளையில் சுடப்பட்ட கையால் வடிவமைக்கப்பட்ட டெராகோட்டா தாவரக் கலம். வடிகால் துளையுடன், சாறுகொழுப்பு தாவரங்கள் மற்றும் மூலிகைகளுக்கு ஏற்றது."
  },
  "Handwoven Pashmina Stole": {
    titleHi: "हाथ से बुना पश्मीना स्टोल",
    titleTa: "கையால் நெய்யப்பட்ட பஷ்மினா ஸ்டோல்",
    descriptionHi: "100% शुद्ध पश्मीना ऊन, एक ही शिल्पकार परिवार द्वारा तीन सप्ताह में पारंपरिक करघे पर हाथ से बुना गया।",
    descriptionTa: "100% தூய பஷ்மினா கம்பளி, ஒரே கலைஞர் குடும்பத்தால் மூன்று வாரங்களில் பாரம்பரிய தறியில் கையால் நெய்யப்பட்டது."
  },
  "Brass Temple Bell": {
    titleHi: "पीतल की मंदिर घंटी",
    titleTa: "பித்தளை கோவில் மணி",
    descriptionHi: "हाथ से तराशे गए लकड़ी के हैंडल के साथ ढली हुई पीतल की घंटी, लॉस्ट-वैक्स कास्टिंग तकनीक से बनाई गई।",
    descriptionTa: "இழந்த மெழுகு வார்ப்பு முறையைப் பயன்படுத்தி செய்யப்பட்ட, கையால் செதுக்கப்பட்ட மரக் கைப்பிடியுடன் கூடிய பித்தளை மணி."
  },
  "Channapatna Wooden Toy Set": {
    titleHi: "चन्नापटना लकड़ी के खिलौनों का सेट",
    titleTa: "சன்னபட்டண மர பொம்மை தொகுப்பு",
    descriptionHi: "चन्नापटना खिलौना समूह से लाख से रंगा हुआ लकड़ी का खिलौना सेट, सीसा-मुक्त और बच्चों के लिए सुरक्षित।",
    descriptionTa: "சன்னபட்டண பொம்மை தயாரிப்பு பகுதியிலிருந்து வந்த, லேக்கர் பூசப்பட்ட, ஈயம் இல்லாத, குழந்தைகளுக்குப் பாதுகாப்பான மர பொம்மை தொகுப்பு."
  },
  "Block-Printed Cotton Bedsheet": {
    titleHi: "ब्लॉक-प्रिंटेड कॉटन बेडशीट",
    titleTa: "பிளாக் பிரிண்ட் பருத்தி படுக்கை விரிப்பு",
    descriptionHi: "सांस लेने योग्य सूती कपड़े पर प्राकृतिक रंगों से हाथ से ब्लॉक-प्रिंट, किंग साइज़ में दो तकिया कवर के साथ।",
    descriptionTa: "மூச்சுவிடக்கூடிய பருத்தி துணியில் இயற்கை சாயங்களால் கையால் பிளாக் பிரிண்ட் செய்யப்பட்டது, இரண்டு தலையணை உறைகளுடன் கிங் சைஸில்."
  },
  "Clay Diya Set (Pack of 12)": {
    titleHi: "मिट्टी के दीये का सेट (12 का पैक)",
    titleTa: "களிமண் தீபங்கள் தொகுப்பு (12 எண்ணிக்கை)",
    descriptionHi: "हाथ से बने मिट्टी के दीये, धूप में सुखाए और भट्टे में पकाए गए, त्योहारों की रोशनी के लिए एकदम सही।",
    descriptionTa: "கையால் வடிவமைக்கப்பட்டு, வெயிலில் காயவைத்து சூளையில் சுடப்பட்ட களிமண் தீபங்கள், பண்டிகை விளக்குகளுக்கு ஏற்றது."
  }
};

function seed() {
  const adminPw = hashPassword("Admin@123");
  const sellerPw = hashPassword("Seller@123");
  const now = new Date().toISOString();

  const sellerId = "seller-demo-1";

  // material: "Wood" | "Clay" | "Fabric" | "Metal" | "Other" - used by the "Build Your Craft" puzzle
  // style: "Simple" | "Colourful" | "Traditional" - used by the puzzle
  // purposes: any combination of "Gift" | "Home Decor" | "Personal Use" - used by the puzzle
  const products = [
    { title: "Hand-Carved Wooden Ganesha Idol", category: "Idols & Figurines", price: 1899, stock: 10, material: "Wood", style: "Traditional", purposes: ["Gift", "Home Decor"], description: "Hand-carved from a single block of sheesham wood by a third-generation woodcarver, finished with a natural teak oil polish." },
    { title: "Hand-Painted Madhubani Wall Art", category: "Wall Art", price: 1499, stock: 8, material: "Fabric", style: "Traditional", purposes: ["Gift", "Home Decor"], description: "Traditional Madhubani painting on handmade paper, framed and ready to hang. Every piece is painted by hand using natural pigments." },
    { title: "Terracotta Warrior Planter", category: "Pottery", price: 649, stock: 15, material: "Clay", style: "Traditional", purposes: ["Home Decor"], description: "Hand-thrown terracotta planter fired in a wood kiln. Drainage hole included, ideal for succulents and herbs." },
    { title: "Handwoven Pashmina Stole", category: "Textiles", price: 2999, stock: 5, material: "Fabric", style: "Simple", purposes: ["Gift", "Personal Use"], description: "100% pure pashmina wool, hand-woven on a traditional loom over three weeks by a single artisan family." },
    { title: "Brass Temple Bell", category: "Home Decor", price: 899, stock: 20, material: "Metal", style: "Traditional", purposes: ["Gift", "Home Decor"], description: "Cast brass bell with a hand-carved wooden handle, made using the lost-wax casting technique." },
    { title: "Channapatna Wooden Toy Set", category: "Toys", price: 799, stock: 30, material: "Wood", style: "Colourful", purposes: ["Gift", "Personal Use"], description: "Lacquered wooden toy set, lead-free and child-safe, from the Channapatna toy-making cluster." },
    { title: "Block-Printed Cotton Bedsheet", category: "Textiles", price: 1199, stock: 12, material: "Fabric", style: "Colourful", purposes: ["Home Decor", "Personal Use"], description: "Hand block-printed with natural dyes on breathable cotton, king size with two pillow covers." },
    { title: "Clay Diya Set (Pack of 12)", category: "Pottery", price: 349, stock: 40, material: "Clay", style: "Simple", purposes: ["Gift", "Home Decor"], description: "Hand-moulded clay diyas, sun-dried and kiln-fired, perfect for festive lighting." },
  ].map((p, i) => ({
    id: `prod-${i + 1}`,
    sellerId,
    image: null,
    images: [],
    status: "active",
    createdAt: now,
    ...(DEMO_PRODUCT_TRANSLATIONS[p.title] || {}),
    ...p
  }));

  return {
    users: [
      { id: "admin-1", name: "Legocraft Admin", email: "admin@legocraft.com", phone: null, role: "admin", status: "active", salt: adminPw.salt, hash: adminPw.hash, createdAt: now },
      { id: sellerId, name: "Kalaa Artisan Collective", email: "seller@legocraft.com", phone: "9800000001", role: "seller", status: "active", shopName: "Kalaa Artisan Collective", salt: sellerPw.salt, hash: sellerPw.hash, createdAt: now }
    ],
    sessions: {},
    categories: ["Wall Art", "Pottery", "Textiles", "Home Decor", "Toys", "Jewelry", "Idols & Figurines"],
    products,
    orders: []
  };
}

// Patches missing Hindi/Tamil translations onto an already-existing
// database (e.g. one created before this feature was added), matched by
// English title. Runs on every load; only writes back if something changed.
function healTranslations(db) {
  let changed = false;
  for (const p of db.products || []) {
    const t = DEMO_PRODUCT_TRANSLATIONS[p.title];
    if (!t) continue;
    if (!p.titleHi && t.titleHi) { p.titleHi = t.titleHi; changed = true; }
    if (!p.titleTa && t.titleTa) { p.titleTa = t.titleTa; changed = true; }
    if (!p.descriptionHi && t.descriptionHi) { p.descriptionHi = t.descriptionHi; changed = true; }
    if (!p.descriptionTa && t.descriptionTa) { p.descriptionTa = t.descriptionTa; changed = true; }
  }
  return changed;
}

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed(), null, 2));
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  if (healTranslations(db)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }
  return db;
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export const DB = {
  read: load,
  write: save,
  hashPassword,
  verifyPassword(password, salt, hash) {
    const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(hash));
  },
  id(prefix) {
    return `${prefix}-${crypto.randomBytes(6).toString("hex")}`;
  }
};
