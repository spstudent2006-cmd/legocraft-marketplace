LEGOCRAFT MARKETPLACE - FULL BUY/SELL/ADMIN SITE
==================================================

A complete Flipkart-style marketplace for artisans, built with plain
HTML/Tailwind (CDN) on the front end and Node.js + Express on the back end.
Data is stored in a local JSON file (data/db.json) - no external database
required, so it runs anywhere Node runs.

FOLDERS
  public/            all website pages, styles and client-side JS
  public/uploads/     uploaded product images (created automatically)
  lib/                 server-side helpers (database, auth)
  data/db.json         auto-created on first run, holds all app data
  server.mjs           the Express server and all API routes

HOW TO RUN
  1. Extract this ZIP.
  2. Open a terminal in this folder.
  3. Copy .env.example to .env (optional - defaults work fine):
       cp .env.example .env
  4. Install dependencies:
       npm install
  5. Start the server:
       npm start
  6. Open http://localhost:3000

WHAT'S INCLUDED
  Buyer side
    - Browse/search products by category and keyword (products.html)
    - Product detail page with add-to-cart / buy-now (product.html)
    - Shopping cart stored in the browser (cart.html)
    - Checkout with delivery address, Cash-on-Delivery order placement (checkout.html)
    - Order history with live status per item (orders.html)
    - "Build Your Craft" puzzle: a 3-question guided quiz (material ->
      style -> purpose) that recommends matching products for shoppers
      who don't know what to search for (puzzle.html). Linked from the
      nav bar and from a homepage banner.

  Seller side
    - Register as a seller with a shop name, and choose EITHER an email
      address OR a phone number as their one contact method - only the
      chosen field is required (register.html / seller-register.html)
    - Log in with EITHER email or phone number (login.html)
    - Seller dashboard: add/edit/remove products with image upload,
      set Material / Style / Purpose tags (used by the puzzle),
      "Analyze with AI" button to auto-suggest a title and description
      from the product photo, an AI photo studio to auto-clean product
      images, a multilingual voice cataloger (speak in English or a
      regional Indian language, get an English + Hindi listing), and
      an AI dynamic pricing assistant - plus viewing and updating order
      status (seller-dashboard.html)

  Admin side
    - Admin dashboard: site-wide stats, manage (ban/unban) users,
      remove any product listing, view every order (admin-dashboard.html)
    - Admin login and password are unchanged from the original build.

DEMO LOGINS (seeded automatically on first run)
  Admin  : admin@legocraft.com  / Admin@123               (unchanged)
  Seller : seller@legocraft.com or 9800000001 / Seller@123

CONTACT INFO RULES (as of this build)
  - Admin: logs in with a Gmail-style email address (seeded account only,
    no public admin sign-up form).
  - Customer / Buyer: sign-up ALWAYS requires both a Gmail-style email
    address and a phone number. Log in with either one.
  - Seller: sign-up shows an "Email / Phone Number" toggle - the seller
    picks ONE contact method and only that field is required. Whichever
    one they choose, they can still log in with it afterwards.

PRODUCT IMAGES
  - If a product has no uploaded photo, a placeholder icon is shown
    instead of a broken image.
  - If an uploaded photo file goes missing (e.g. it was deleted, or the
    app is hosted somewhere with a temporary/ephemeral file system that
    wipes public/uploads on restart), the broken <img> now automatically
    falls back to the same placeholder icon rather than showing a
    broken-image glyph.
  - Uploaded images are served from public/uploads/, which the server
    creates automatically. If images still don't load after this fix,
    it almost always means the Node/Express server (server.mjs) isn't
    the thing actually serving the site - e.g. the public folder was
    deployed to a static-only host (Netlify/GitHub Pages) with no
    backend running, so /api/... and /uploads/... requests never
    reach this code at all. Run "npm start" and open the printed
    localhost URL (or deploy the whole project, not just /public,
    to a Node-capable host) to fix that.

THE "BUILD YOUR CRAFT" PUZZLE - HOW IT WORKS
  1. Shopper answers three questions in puzzle.html (material, style, purpose).
  2. The answers are POSTed to /api/puzzle (no login required).
  3. The server scores every active product: +3 for a material match,
     +2 for a style match, +2 for a purpose match, then returns the
     top 6 products sorted by score (see server.mjs for the exact logic).
  4. Sellers set a product's material/style/purpose in the "Add Product"
     form in the seller dashboard, so new listings automatically become
     eligible for puzzle recommendations.

AI PRODUCT IMAGE ANALYSIS (OPTIONAL)
  The seller dashboard's "Analyze with AI" button calls
  POST /api/seller/analyze-image, which sends the uploaded photo to
  Google's Gemini API (via the Interactions API) and returns a
  suggested title/description the seller can edit before saving. This
  requires a GEMINI_API_KEY in .env (see .env.example, get a free key
  at https://aistudio.google.com/apikey) - without a key, every other
  feature in the app still works, this one button will just show a
  clear error message. The route uses the model id "gemini-3.6-flash"
  - swap it in server.mjs (GEMINI_MODEL constant) for whichever model
  your API key has access to.

VOICE-TO-LISTING / MULTILINGUAL AUTO-CATALOGER (OPTIONAL)
  The seller dashboard's "Speak product details" button uses the
  browser's built-in Web Speech API (works best in Chrome) to convert
  the seller's spoken description - in English or a regional Indian
  language (Hindi, Bengali, Marathi, Gujarati, Tamil, Telugu, Kannada,
  Malayalam or Punjabi, picked from the dropdown next to the mic) -
  into text on the client. That transcript is POSTed to
  /api/seller/analyze-voice, which asks Gemini to translate it and
  generate SEO-friendly title/description, category, price, stock,
  material, style and purpose - in BOTH English and Hindi - and
  auto-fills the whole "Add Product" form. The seller can still
  review/edit everything, and toggle the description between English
  and Hindi ("देखें हिंदी में" / "Show in English") before saving.
  Shoppers see the same toggle on the product page if a Hindi
  description was saved. This shares the same GEMINI_API_KEY as the
  other AI features; no separate setup is needed. If the browser
  doesn't support speech recognition, the mic button is disabled with
  a message explaining why.

AI IMAGE ENHANCER & STUDIO (OPTIONAL)
  Next to each freshly-picked photo in the "Add Product" form, a small
  "✨ Enhance" button appears. Tapping it calls
  POST /api/seller/enhance-image, which sends that photo to Gemini's
  native image model (Nano Banana, model id "gemini-3.1-flash-image")
  with instructions to clean up the background, correct the lighting,
  and present the product in a professional, catalog-style studio
  shot - without altering the actual product. The enhanced photo is
  saved to public/uploads (like a normal upload) and swapped into the
  image picker in place of the raw phone photo; the seller can still
  remove it and use the original if they prefer. Requires the same
  GEMINI_API_KEY as the other AI features.

DYNAMIC PRICING ASSISTANT (OPTIONAL)
  The "💡 Suggest price with AI" button next to the Price field calls
  POST /api/seller/suggest-price with the current title, description,
  category, material, style (and the first freshly-picked photo, if
  any). The route asks Gemini - with Google Search grounding enabled
  via the "google_search" tool - to check what comparable handmade
  products currently sell for online and suggest a competitive price
  in INR, returning a suggested price, a typical price range, and a
  short plain-language reason a low-literacy seller can understand.
  The Price field is filled in automatically but stays fully editable.
  Requires the same GEMINI_API_KEY as the other AI features.

NOTES
  - Passwords are hashed with Node's built-in scrypt - never stored in plain text.
  - Sessions use secure httpOnly cookies, not localStorage.
  - Product images are stored under public/uploads and served statically.
  - This is a self-contained learning/demo project: payments are
    Cash-on-Delivery only (no real payment gateway is wired in).
    To go live you would add a payment gateway (Razorpay/Stripe) in
    the /api/orders route in server.mjs.
