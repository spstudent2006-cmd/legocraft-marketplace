import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { DB } from "./lib/db.mjs";
import {
  createSession, destroySession, getUserFromRequest,
  setSessionCookie, clearSessionCookie, requireAuth, SESSION_COOKIE
} from "./lib/auth.mjs";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const UPLOADS = path.join(PUBLIC, "uploads");

fs.mkdirSync(UPLOADS, { recursive: true });

app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(PUBLIC, { etag: false, maxAge: 0 }));

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, DB.id("img") + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const MAX_PRODUCT_IMAGES = 6;

function publicUser(u) {
  if (!u) return null;
  const { salt, hash, ...safe } = u;
  return safe;
}

/* ---------------- AUTH ---------------- */

const PHONE_RE = /^[0-9]{7,15}$/;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/register", (req, res) => {
  const { name, email, phone, password, role, shopName, contactMethod } = req.body || {};
  const chosenRole = role === "seller" ? "seller" : "buyer";
  if (!name || !password) return res.status(400).json({ error: "Name and password are required." });
  if (chosenRole === "seller" && !shopName) return res.status(400).json({ error: "Shop name is required for sellers." });

  const cleanPhone = phone ? String(phone).replace(/\D/g, "") : "";
  const cleanEmail = email ? String(email).trim() : "";

  let finalEmail = null;
  let finalPhone = null;

  if (chosenRole === "buyer") {
    // Buyers (customers) must always provide BOTH a Gmail/email address and a phone number.
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) return res.status(400).json({ error: "A valid email address is required." });
    if (!cleanPhone || !PHONE_RE.test(cleanPhone)) return res.status(400).json({ error: "A valid phone number is required." });
    finalEmail = cleanEmail;
    finalPhone = cleanPhone;
  } else {
    // Sellers choose ONE contact method: email OR phone number.
    const method = contactMethod === "phone" ? "phone" : "email";
    if (method === "email") {
      if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) return res.status(400).json({ error: "A valid email address is required." });
      finalEmail = cleanEmail;
    } else {
      if (!cleanPhone || !PHONE_RE.test(cleanPhone)) return res.status(400).json({ error: "A valid phone number is required." });
      finalPhone = cleanPhone;
    }
  }

  const db = DB.read();
  const emailTaken = finalEmail && db.users.some(u => u.email && u.email.toLowerCase() === finalEmail.toLowerCase());
  const phoneTaken = finalPhone && db.users.some(u => u.phone === finalPhone);
  if (emailTaken) return res.status(409).json({ error: "An account with this email already exists." });
  if (phoneTaken) return res.status(409).json({ error: "An account with this phone number already exists." });

  const { salt, hash } = DB.hashPassword(password);
  const user = {
    id: DB.id("user"),
    name, email: finalEmail, phone: finalPhone, role: chosenRole, status: "active",
    shopName: chosenRole === "seller" ? shopName : undefined,
    salt, hash,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  DB.write(db);

  const token = createSession(user.id);
  setSessionCookie(res, token);
  res.json({ user: publicUser(user) });
});

// Works for every role (buyer, seller, admin). "identifier" can be an email
// address or a phone number - this is what lets sellers log in with either.
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body || {};
  const value = String(identifier || "").trim().toLowerCase();
  const digitsOnly = value.replace(/\D/g, "");
  const db = DB.read();
  const user = db.users.find(u =>
    (u.email && u.email.toLowerCase() === value) ||
    (u.phone && digitsOnly && u.phone === digitsOnly)
  );
  if (!user || !DB.verifyPassword(password || "", user.salt, user.hash)) {
    return res.status(401).json({ error: "Incorrect email/phone or password." });
  }
  if (user.status === "banned") return res.status(403).json({ error: "This account has been suspended." });
  const token = createSession(user.id);
  setSessionCookie(res, token);
  res.json({ user: publicUser(user) });
});

app.post("/api/logout", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) destroySession(token);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/me", (req, res) => {
  res.json({ user: getUserFromRequest(req) });
});

/* ---------------- PUBLIC CATALOG ---------------- */

app.get("/api/categories", (req, res) => {
  res.json({ categories: DB.read().categories });
});

app.get("/api/products", (req, res) => {
  const db = DB.read();
  const { search = "", category = "" } = req.query;
  let items = db.products.filter(p => p.status === "active");
  if (category) items = items.filter(p => p.category === category);
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  const withShop = items.map(p => ({
    ...p,
    shopName: db.users.find(u => u.id === p.sellerId)?.shopName || "Legocraft Seller"
  }));
  res.json({ products: withShop });
});

app.get("/api/products/:id", (req, res) => {
  const db = DB.read();
  const product = db.products.find(p => p.id === req.params.id && p.status === "active");
  if (!product) return res.status(404).json({ error: "Product not found." });
  const shop = db.users.find(u => u.id === product.sellerId);
  res.json({ product: { ...product, shopName: shop?.shopName || "Legocraft Seller" } });
});

/* ---------------- "BUILD YOUR CRAFT" PUZZLE ---------------- */
/* No login required - this is how undecided shoppers discover what to buy.
   Rule-based scoring (not a black box): material match counts most, then
   style, then purpose, so the closest matches always float to the top. */
app.post("/api/puzzle", (req, res) => {
  const { material, style, purpose } = req.body || {};
  const db = DB.read();
  const scored = db.products
    .filter(p => p.status === "active")
    .map(p => {
      let score = 0;
      if (material && p.material === material) score += 3;
      if (style && p.style === style) score += 2;
      if (purpose && Array.isArray(p.purposes) && p.purposes.includes(purpose)) score += 2;
      return { p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = (scored.length ? scored : db.products.filter(p => p.status === "active").map(p => ({ p, score: 0 })))
    .slice(0, 6)
    .map(({ p }) => ({ ...p, shopName: db.users.find(u => u.id === p.sellerId)?.shopName || "Legocraft Seller" }));

  const bestMatch = top[0];
  const summary = bestMatch
    ? `Based on your choices, we found a ${style ? style + " " : ""}Handmade ${material ? material + " " : ""}${purpose === "Gift" ? "Gift" : purpose === "Home Decor" ? "Home Decor Piece" : "Product"} that matches your preferences.`
    : "We couldn't find an exact match, but here are some popular handmade picks.";

  res.json({ summary, products: top });
});

/* ---------------- BUYER ORDERS ---------------- */

app.post("/api/orders", requireAuth(), (req, res) => {
  const { items, address } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Your cart is empty." });
  if (!address || !address.trim()) return res.status(400).json({ error: "Delivery address is required." });

  const db = DB.read();
  const orderItems = [];
  for (const it of items) {
    const product = db.products.find(p => p.id === it.id && p.status === "active");
    if (!product) continue;
    const qty = Math.max(1, Number(it.qty || 1));
    orderItems.push({
      productId: product.id, title: product.title, price: product.price,
      qty, sellerId: product.sellerId, status: "placed"
    });
    product.stock = Math.max(0, product.stock - qty);
  }
  if (orderItems.length === 0) return res.status(400).json({ error: "None of the items in your cart are available." });

  const order = {
    id: DB.id("order"),
    buyerId: req.user.id,
    buyerName: req.user.name,
    items: orderItems,
    total: orderItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    address,
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  DB.write(db);
  res.json({ order });
});

app.get("/api/orders", requireAuth(), (req, res) => {
  const db = DB.read();
  const orders = db.orders.filter(o => o.buyerId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders });
});

/* ---------------- SELLER ---------------- */

app.get("/api/seller/products", requireAuth(["seller"]), (req, res) => {
  const db = DB.read();
  const products = db.products.filter(p => p.sellerId === req.user.id);
  res.json({ products });
});

const MATERIALS = ["Wood", "Clay", "Fabric", "Metal", "Other"];
const STYLES = ["Simple", "Colourful", "Traditional"];
const PURPOSES = ["Gift", "Home Decor", "Personal Use"];

function parsePurposes(raw) {
  if (Array.isArray(raw)) return raw.filter(p => PURPOSES.includes(p));
  if (typeof raw === "string" && raw) return raw.split(",").map(s => s.trim()).filter(p => PURPOSES.includes(p));
  return [];
}

app.post("/api/seller/products", requireAuth(["seller"]), upload.array("images", MAX_PRODUCT_IMAGES), (req, res) => {
  let { title, titleHi, titleTa, description, descriptionHi, descriptionTa, category, price, stock, material, style, purposes } = req.body || {};
  category = String(category || "").trim();
  if (!title || !description || !category || !price) {
    return res.status(400).json({ error: "Title, description, category and price are required." });
  }
  if (category.length < 3) {
    return res.status(400).json({ error: "Category must be at least 3 characters (e.g. \"Pottery\", not \"C\")." });
  }
  const db = DB.read();
  // Reuse an existing category with matching text regardless of case, so
  // "pottery" and "Pottery" don't become two separate categories.
  const existing = db.categories.find(c => c.toLowerCase() === category.toLowerCase());
  if (existing) category = existing;
  const images = (req.files || []).slice(0, MAX_PRODUCT_IMAGES).map(f => `/uploads/${f.filename}`);
  const product = {
    id: DB.id("prod"),
    sellerId: req.user.id,
    title, description, category,
    titleHi: titleHi || null,
    titleTa: titleTa || null,
    descriptionHi: descriptionHi || null,
    descriptionTa: descriptionTa || null,
    price: Math.max(0, Number(price)),
    stock: Math.max(0, Number(stock || 0)),
    material: MATERIALS.includes(material) ? material : "Other",
    style: STYLES.includes(style) ? style : "Simple",
    purposes: parsePurposes(purposes),
    images,
    image: images[0] || null,
    status: "active",
    createdAt: new Date().toISOString()
  };
  db.products.push(product);
  if (!existing) db.categories.push(category);
  DB.write(db);
  res.json({ product });
});

app.put("/api/seller/products/:id", requireAuth(["seller"]), upload.array("images", MAX_PRODUCT_IMAGES), (req, res) => {
  const db = DB.read();
  const product = db.products.find(p => p.id === req.params.id && p.sellerId === req.user.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  let { title, titleHi, titleTa, description, descriptionHi, descriptionTa, category, price, stock, status, material, style, purposes, existingImages } = req.body || {};
  if (title) product.title = title;
  if (titleHi !== undefined) product.titleHi = titleHi || null;
  if (titleTa !== undefined) product.titleTa = titleTa || null;
  if (description) product.description = description;
  if (descriptionHi !== undefined) product.descriptionHi = descriptionHi || null;
  if (descriptionTa !== undefined) product.descriptionTa = descriptionTa || null;
  if (category !== undefined && category !== "") {
    category = String(category).trim();
    if (category.length < 3) return res.status(400).json({ error: "Category must be at least 3 characters (e.g. \"Pottery\", not \"C\")." });
    const existing = db.categories.find(c => c.toLowerCase() === category.toLowerCase());
    product.category = existing || category;
    if (!existing) db.categories.push(category);
  }
  if (price !== undefined) product.price = Math.max(0, Number(price));
  if (stock !== undefined) product.stock = Math.max(0, Number(stock));
  if (status && ["active", "removed"].includes(status)) product.status = status;
  if (material && MATERIALS.includes(material)) product.material = material;
  if (style && STYLES.includes(style)) product.style = style;
  if (purposes !== undefined) product.purposes = parsePurposes(purposes);

  if (existingImages !== undefined || (req.files && req.files.length)) {
    let kept = [];
    try { kept = JSON.parse(existingImages || "[]"); } catch { kept = []; }
    if (!Array.isArray(kept)) kept = [];
    const uploaded = (req.files || []).map(f => `/uploads/${f.filename}`);
    const combined = [...kept, ...uploaded].slice(0, MAX_PRODUCT_IMAGES);
    product.images = combined;
    product.image = combined[0] || null;
  }

  DB.write(db);
  res.json({ product });
});

/* ---------------- GEMINI HELPERS ----------------
   All AI-assisted features below (photo analysis, AI image studio,
   multilingual voice cataloger, dynamic pricing) call Google's Gemini
   Interactions API directly over HTTPS, so no extra SDK/package is
   required - just fetch(). Requires GEMINI_API_KEY in .env; if it's
   missing, the routes return a clear error instead of crashing the
   server. Docs: https://ai.google.dev/gemini-api/docs/interactions-overview */
const GEMINI_MODEL = "gemini-3.6-flash";
// NOTE: "gemini-3.1-flash-image" (Nano Banana 2) has NO free API quota - it
// returns "limit: 0" quota-exceeded errors on any key without billing
// enabled on its Google Cloud project. "gemini-2.5-flash-image" is the
// model that actually has a working free tier, so we use that here. If you
// enable billing on your Google AI Studio project, you can switch this back
// to "gemini-3.1-flash-image" for higher quality output.
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const GEMINI_INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

/* Turns any error (including Google's very long, multi-line quota/billing
   error dumps) into a short, user-safe message. We never forward the raw
   provider error text to the browser - besides being unreadable, it can be
   thousands of characters long and blow up the UI (see the toast fix in
   public/js/app.js). */
function friendlyGeminiError(err, fallback) {
  const raw = String(err?.message || err || "");
  if (/quota|rate.?limit|resource_exhausted|429/i.test(raw)) {
    if (/free_tier|limit:\s*0/i.test(raw)) {
      return "This AI feature needs billing enabled on the Gemini API key's Google Cloud project (its free tier doesn't cover this model). See https://ai.google.dev/gemini-api/docs/rate-limits.";
    }
    return "The AI service is temporarily rate-limited. Please wait a moment and try again.";
  }
  if (/api key|permission|unauthenticated|401|403/i.test(raw)) {
    return "The AI service rejected the request (check that GEMINI_API_KEY in .env is valid).";
  }
  // Fall back to the original message, but keep it short so it can never
  // take over the screen.
  const trimmed = raw.split("\n")[0].slice(0, 180);
  return trimmed || fallback;
}

/* Text/JSON calls (catalog copy, voice parsing, price suggestions). */
async function callGemini(input, { tools } = {}) {
  const resp = await fetch(GEMINI_INTERACTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      input,
      // Ask for a plain JSON object back so we can parse it directly.
      response_format: { type: "text", mime_type: "application/json" },
      ...(tools ? { tools } : {})
    })
  });
  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(json?.error?.message || "Gemini request failed.");
  }
  // Response shape depends on API revision: default responses use
  // `outputs`, newer opt-in revisions use a `steps` timeline. Handle both.
  let text = "";
  if (Array.isArray(json.outputs)) {
    text = json.outputs.filter(o => o.type === "text").map(o => o.text || "").join("");
  } else if (Array.isArray(json.steps)) {
    const modelStep = json.steps.filter(s => s.type === "model_output").pop();
    text = (modelStep?.content || []).filter(c => c.type === "text").map(c => c.text || "").join("");
  }
  let data;
  try { data = JSON.parse(text); }
  catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("AI returned an unexpected response.");
    data = JSON.parse(m[0]);
  }
  return data;
}

/* Image-in/image-out calls (AI Image Enhancer & Studio), using Gemini's
   native image generation ("Nano Banana") model via the same Interactions
   API. Returns { data: base64String, mimeType }. */
async function callGeminiImage(input) {
  const resp = await fetch(GEMINI_INTERACTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({ model: GEMINI_IMAGE_MODEL, input })
  });
  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(json?.error?.message || "Gemini image request failed.");
  }
  let items = [];
  if (Array.isArray(json.outputs)) {
    items = json.outputs;
  } else if (Array.isArray(json.steps)) {
    const modelStep = json.steps.filter(s => s.type === "model_output").pop();
    items = modelStep?.content || [];
  }
  const image = items.find(o => o.type === "image");
  if (!image || !image.data) throw new Error("AI did not return an edited image. Please try a different photo.");
  return { data: image.data, mimeType: image.mime_type || "image/png" };
}

/* AI-assisted product photo analysis: seller uploads an image, AI suggests a
   title/description/keywords the seller can edit before saving the listing.
   Requires GEMINI_API_KEY in .env - if it's missing, this route returns a
   clear error instead of crashing the server. */
app.post("/api/seller/analyze-image", requireAuth(["seller"]), upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Please choose an image first." });
  if (!process.env.GEMINI_API_KEY) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "AI image analysis is not configured. Add GEMINI_API_KEY to .env to enable it." });
  }
  try {
    const imageBase64 = fs.readFileSync(req.file.path).toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    const data = await callGemini([
      { type: "text", text: `You are Legocraft's product catalog assistant. Look at this handmade artisan product photo and suggest e-commerce listing copy.
Return ONLY valid JSON, no markdown fences:
{"title":"short product title","description":"2-3 sentence professional description","keywords":["five","seo","keywords","for","search"]}` },
      { type: "image", data: imageBase64, mime_type: mime }
    ]);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: friendlyGeminiError(e, "Image analysis failed.") });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

/* AI Background Remover: seller uploads a raw product photo taken on their
   phone, and Gemini's native image model removes the existing background
   and replaces it with a solid white background, leaving the product
   itself untouched. The result is saved to /uploads like a normal upload,
   so the seller can pick it (or the original) for the listing. Requires
   GEMINI_API_KEY in .env. */
app.post("/api/seller/enhance-image", requireAuth(["seller"]), upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Please choose an image first." });
  if (!process.env.GEMINI_API_KEY) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "AI photo enhancement is not configured. Add GEMINI_API_KEY to .env to enable it." });
  }
  try {
    const imageBase64 = fs.readFileSync(req.file.path).toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    const { data: outBase64, mimeType: outMime } = await callGeminiImage([
      { type: "text", text: `This is a photo of a handmade artisan product (e.g. pottery, textile, woodwork, jewelry) taken by a small-scale seller, often against a cluttered or uneven background.

Remove the existing background completely and replace it with a solid, pure white background (#FFFFFF), like a standard e-commerce product photo.
- Keep the product itself completely unchanged - same shape, size, position, color, pattern, material, lighting and details. Do not invent, add, remove, recolor or alter any part of the actual product.
- Do not add shadows, reflections, props, text or any new elements - just a clean, flat, pure white background behind the exact same product.
Return only the edited photo.` },
      { type: "image", data: imageBase64, mime_type: mime }
    ]);
    const ext = outMime === "image/png" ? ".png" : outMime === "image/webp" ? ".webp" : ".jpg";
    const filename = DB.id("img") + "-enhanced" + ext;
    fs.writeFileSync(path.join(UPLOADS, filename), Buffer.from(outBase64, "base64"));
    res.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: friendlyGeminiError(e, "Photo enhancement failed.") });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

/* Multilingual Auto-Cataloger: the browser's Web Speech API converts the
   seller's spoken description - in English or a regional Indian language -
   into text on the client, and this route asks Gemini to translate and
   turn that transcript into structured, SEO-friendly product fields in
   English, Hindi and Tamil, which the seller can review and edit before
   saving. Requires GEMINI_API_KEY in .env. */
app.post("/api/seller/analyze-voice", requireAuth(["seller"]), async (req, res) => {
  const { transcript, language } = req.body || {};
  if (!transcript || !String(transcript).trim()) {
    return res.status(400).json({ error: "No speech was captured. Please try recording again." });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Voice-to-listing is not configured. Add GEMINI_API_KEY to .env to enable it." });
  }
  try {
    const spokenLanguage = language && String(language).trim() ? String(language).trim() : "English";
    const data = await callGemini([{
      type: "text", text: `You are Legocraft's multilingual product catalog assistant. A seller of handmade artisan goods spoke aloud a description of a product they want to list, in ${spokenLanguage}. Here is the speech-to-text transcript (it may contain transcription errors - use your best judgement):
"""${String(transcript).trim()}"""

Translate and extract listing details from it. Write SEO-friendly, professional e-commerce copy - do not just translate word-for-word, make it read naturally as a product listing. Return ONLY valid JSON, no markdown fences, matching exactly this shape (use null for any field the seller didn't mention - do not guess numbers):
{
  "title": "short product title in English, or null",
  "titleHi": "the same short product title translated into Hindi (Devanagari script), or null",
  "titleTa": "the same short product title translated into Tamil (Tamil script), or null",
  "description": "2-3 sentence professional SEO-friendly description in English, written from what the seller said, or null",
  "descriptionHi": "the same description translated and written naturally in Hindi (Devanagari script), or null",
  "descriptionTa": "the same description translated and written naturally in Tamil (Tamil script), or null",
  "category": "a short category like Pottery, Woodwork, Textiles, or null",
  "price": number in Indian rupees or null,
  "stock": integer quantity or null,
  "material": one of "Wood","Clay","Fabric","Metal","Other" or null,
  "style": one of "Simple","Colourful","Traditional" or null,
  "purposes": array made up of any of "Gift","Home Decor","Personal Use" that were mentioned, or empty array
}`
    }]);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: friendlyGeminiError(e, "Voice analysis failed.") });
  }
});

/* Dynamic Pricing Assistant: analyzes the listing's title/description/
   category/material/style (and optionally a product photo) alongside a
   live web search for comparable products, and suggests a competitive
   selling price range with a short rationale. Requires GEMINI_API_KEY in
   .env. */
app.post("/api/seller/suggest-price", requireAuth(["seller"]), upload.single("image"), async (req, res) => {
  const { title, description, category, material, style } = req.body || {};
  if (!title && !description && !category) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "Add a title, description or category first so the AI has something to price." });
  }
  if (!process.env.GEMINI_API_KEY) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "Dynamic pricing is not configured. Add GEMINI_API_KEY to .env to enable it." });
  }
  try {
    const parts = [{
      type: "text", text: `You are Legocraft's dynamic pricing assistant for a handmade artisan marketplace in India. Suggest a competitive selling price in Indian rupees (INR) for this listing, based on current market trends for similar handmade products and typical raw material/labour costs. Use web search to check what comparable handmade items sell for online in India.

Listing details:
- Title: ${title || "(not given)"}
- Description: ${description || "(not given)"}
- Category: ${category || "(not given)"}
- Material: ${material || "(not given)"}
- Style: ${style || "(not given)"}

Return ONLY valid JSON, no markdown fences:
{"suggestedPrice": number in INR, "priceMin": number in INR, "priceMax": number in INR, "reasoning": "1-2 sentence plain-language explanation a low-literacy seller can understand"}` }
    ];
    if (req.file) {
      parts.push({ type: "image", data: fs.readFileSync(req.file.path).toString("base64"), mime_type: req.file.mimetype || "image/jpeg" });
    }
    const data = await callGemini(parts, { tools: [{ type: "google_search", search_types: ["web_search"] }] });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: friendlyGeminiError(e, "Price suggestion failed.") });
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
  }
});

app.delete("/api/seller/products/:id", requireAuth(["seller"]), (req, res) => {
  const db = DB.read();
  const product = db.products.find(p => p.id === req.params.id && p.sellerId === req.user.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  product.status = "removed";
  DB.write(db);
  res.json({ ok: true });
});

app.get("/api/seller/orders", requireAuth(["seller"]), (req, res) => {
  const db = DB.read();
  const orders = db.orders
    .map(o => ({ ...o, items: o.items.filter(it => it.sellerId === req.user.id) }))
    .filter(o => o.items.length > 0)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders });
});

app.put("/api/seller/orders/:id/items/:productId/status", requireAuth(["seller"]), (req, res) => {
  const { status } = req.body || {};
  const allowed = ["placed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status." });
  const db = DB.read();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  const item = order.items.find(it => it.productId === req.params.productId && it.sellerId === req.user.id);
  if (!item) return res.status(404).json({ error: "Order item not found." });
  item.status = status;
  DB.write(db);
  res.json({ ok: true });
});

/* ---------------- ADMIN ---------------- */

app.get("/api/admin/stats", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  res.json({
    totalUsers: db.users.filter(u => u.role !== "admin").length,
    totalSellers: db.users.filter(u => u.role === "seller").length,
    totalBuyers: db.users.filter(u => u.role === "buyer").length,
    totalProducts: db.products.filter(p => p.status === "active").length,
    totalOrders: db.orders.length,
    totalRevenue: db.orders.reduce((s, o) => s + o.total, 0)
  });
});

app.get("/api/admin/users", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  res.json({ users: db.users.filter(u => u.role !== "admin").map(publicUser) });
});

app.put("/api/admin/users/:id/status", requireAuth(["admin"]), (req, res) => {
  const { status } = req.body || {};
  if (!["active", "banned"].includes(status)) return res.status(400).json({ error: "Invalid status." });
  const db = DB.read();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  user.status = status;
  DB.write(db);
  res.json({ ok: true });
});

app.get("/api/admin/products", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  const products = db.products.map(p => ({
    ...p,
    shopName: db.users.find(u => u.id === p.sellerId)?.shopName || "Unknown"
  }));
  res.json({ products });
});

app.delete("/api/admin/products/:id", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  product.status = "removed";
  DB.write(db);
  res.json({ ok: true });
});

app.get("/api/admin/orders", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  const orders = [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders });
});

/* Category cleanup: a category can only be deleted if no ACTIVE product is
   still using it (so removing "C" won't silently orphan a real listing). */
app.get("/api/admin/categories", requireAuth(["admin"]), (req, res) => {
  const db = DB.read();
  const categories = db.categories.map(name => ({
    name,
    productCount: db.products.filter(p => p.status === "active" && p.category === name).length
  }));
  res.json({ categories });
});

app.delete("/api/admin/categories/:name", requireAuth(["admin"]), (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const db = DB.read();
  const inUse = db.products.some(p => p.status === "active" && p.category === name);
  if (inUse) return res.status(400).json({ error: "This category still has active products. Reassign or remove them first." });
  if (!db.categories.includes(name)) return res.status(404).json({ error: "Category not found." });
  db.categories = db.categories.filter(c => c !== name);
  DB.write(db);
  res.json({ ok: true });
});

/* ---------------- SPA-safe fallback for unknown routes ---------------- */
app.use((req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found." });
  res.sendFile(path.join(PUBLIC, "404.html"), err => {
    if (err) res.status(404).send("Page not found.");
  });
});

app.listen(PORT, () => {
  console.log(`Legocraft Marketplace running at http://localhost:${PORT}`);
  console.log(`Admin login -> admin@legocraft.com / Admin@123`);
  console.log(`Demo seller login -> seller@legocraft.com / Seller@123`);
});
