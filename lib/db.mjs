import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

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

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
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
