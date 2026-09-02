/* ---------- Legocraft i18n ---------- */
const LC_LANG_KEY = "lc_lang";

const LC_LANGS = {
  en: { label: "English", native: "English" },
  hi: { label: "Hindi", native: "हिंदी" },
  ta: { label: "Tamil", native: "தமிழ்" }
};

const translations = {
  en: {
    "nav.shop": "Shop",
    "nav.puzzle": "🧩 Find My Craft",
    "nav.sell": "Sell on Legocraft",
    "nav.search": "Search for handmade products",
    "footer.tagline": "Connecting India's traditional artisans with the modern digital economy.",
    "footer.shop": "Shop",
    "footer.allProducts": "All products",
    "footer.trackOrder": "Track an order",
    "footer.sell": "Sell",
    "footer.becomeSeller": "Become a seller",
    "footer.sellerLogin": "Seller login",
    "footer.copyright": "© 2026 Legocraft. Crafted by hands.",
    "lang.choose": "Language",

    "common.addToCart": "Add to Cart",
    "common.addedToCart": "Added to cart",
    "common.buyNow": "Buy Now",
    "common.remove": "Remove",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.total": "Total",
    "common.outOfStock": "Out of stock",
    "common.inStock": "in stock",
    "common.viewAll": "View all →",
    "common.soldBy": "Sold by",
    "common.allCategories": "All Categories",
    "common.noProductsYet": "No products yet.",
    "common.noProductsFound": "No products found. Try a different search or category.",
    "common.ban": "Ban",
    "common.unban": "Unban",
    "common.delete": "Delete",
    "common.inUse": "In use",
    "common.noCategories": "No categories.",
    "common.noOrdersYet": "No orders yet.",

    "home.h1.line1": "Your Craft.",
    "home.h1.line2": "Your Story.",
    "home.h1.line3": "Your Marketplace.",
    "home.subtitle": "Buy directly from India's artisans, or start selling your own handmade work in minutes — no middlemen, no hidden fees.",
    "home.shopHandmade": "Shop Handmade",
    "home.startSelling": "Start Selling",
    "home.puzzleTitle": "Not sure what to buy?",
    "home.puzzleSubtitle": "Play the Build Your Craft puzzle — three quick questions and we'll find a handmade piece that fits.",
    "home.startPuzzle": "Start the Puzzle →",
    "home.featured": "Featured Products",
    "home.f1.title": "100% Handmade",
    "home.f1.desc": "Every item verified as authentic artisan work.",
    "home.f2.title": "Fair Pricing",
    "home.f2.desc": "Artisans set their own prices — no middleman markup.",
    "home.f3.title": "Tracked Delivery",
    "home.f3.desc": "Follow every order from workshop to doorstep.",

    "products.title": "Shop Handmade",
    "products.category": "Category",

    "product.notSpecified": "No product specified.",
    "product.readHindi": "हिंदी में पढ़ें (Read in Hindi)",
    "product.readEnglish": "Read in English",

    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty.",
    "cart.startShopping": "Start shopping →",
    "cart.proceedToCheckout": "Proceed to Checkout",

    "checkout.title": "Checkout",
    "checkout.loginPrompt1": "Please",
    "checkout.loginPrompt2": "log in",
    "checkout.loginPrompt3": "to complete your order.",
    "checkout.deliveryAddress": "Delivery Address",
    "checkout.addressPlaceholder": "Full name, house/street, city, state, pincode, phone number",
    "checkout.placeOrder": "Place Order (Cash on Delivery)",
    "checkout.cartEmpty": "Your cart is empty.",
    "checkout.enterAddress": "Please enter a delivery address.",
    "checkout.orderPlaced": "Order placed successfully!",

    "login.title": "Welcome Back",
    "login.subtitle": "Log in to your Legocraft account",
    "login.watchVideo": "New here? Watch how sign up works",
    "login.identifier": "Email or Phone Number",
    "login.identifierPlaceholder": "you@example.com or 9876543210",
    "login.password": "Password",
    "login.submit": "Log In",
    "login.noAccount": "No account?",
    "login.signUp": "Sign up",
    "login.demoAccounts": "Demo accounts",
    "video.skip": "Skip",
    "video.continue": "Continue",
    "video.howItWorks": "How signing up works",
    "video.unavailable": "The tutorial video isn't available yet.",

    "register.title": "Create Account",
    "register.subtitle": "Join Legocraft as a buyer or a seller",
    "register.watchVideo": "Watch how sign up works",
    "register.continueToSignup": "Continue to Sign Up",
    "register.wantBuy": "I want to Buy",
    "register.wantSell": "I want to Sell",
    "register.fullName": "Full Name",
    "register.shopName": "Shop / Brand Name",
    "register.email": "Email",
    "register.phone": "Phone Number",
    "register.phonePlaceholder": "e.g. 9876543210",
    "register.phoneHint": "Digits only. You can log in with either your email or this number.",
    "register.phoneHintDigits": "Digits only.",
    "register.contactWith": "Contact With",
    "register.password": "Password",
    "register.submit": "Create Account",
    "register.haveAccount": "Already have an account?",
    "register.login": "Log in",

    "sellerRegister.title": "Turn Your Craft Into an Online Business",
    "sellerRegister.subtitle": "List your products, reach buyers across the country, and manage your orders — all from one seller dashboard. No commission on your first 90 days.",
    "sellerRegister.f1.title": "Your Own Shop",
    "sellerRegister.f1.desc": "List unlimited products under your own shop name.",
    "sellerRegister.f2.title": "Simple Dashboard",
    "sellerRegister.f2.desc": "Track orders and update stock in real time.",
    "sellerRegister.f3.title": "You Set the Price",
    "sellerRegister.f3.desc": "No middleman — you decide what your work is worth.",
    "sellerRegister.registerBtn": "Register as a Seller",
    "sellerRegister.alreadySelling": "Already selling?",
    "sellerRegister.loginDashboard": "Log in to your dashboard",

    "orders.title": "My Orders",
    "orders.browse": "Browse products →",
    "orders.loginPrompt": "Please",
    "orders.loginToView": "log in",
    "orders.toSeeOrders": "to see your orders.",
    "orders.order": "Order #",

    "puzzle.title": "Build Your Craft",
    "puzzle.subtitle": "Not sure what to buy? Answer three quick questions and we'll find a handmade piece for you.",
    "puzzle.startOver": "↺ Start over",
    "puzzle.q1": "Which material do you prefer?",
    "puzzle.q2": "Which style do you like?",
    "puzzle.q3": "What is the purpose?",
    "puzzle.wood": "Wood", "puzzle.clay": "Clay", "puzzle.fabric": "Fabric",
    "puzzle.simple": "Simple", "puzzle.colourful": "Colourful", "puzzle.traditional": "Traditional",
    "puzzle.gift": "Gift", "puzzle.homeDecor": "Home Decor", "puzzle.personalUse": "Personal Use",
    "puzzle.finding": "Great! 🎉 Let me find the perfect craft for you…",
    "puzzle.error": "Sorry, something went wrong:",

    "404.text": "This page doesn't exist.",
    "404.back": "Back to Legocraft",

    "admin.title": "Admin Dashboard",
    "admin.buyers": "Buyers",
    "admin.sellers": "Sellers",
    "admin.activeProducts": "Active Products",
    "admin.orders": "Orders",
    "admin.tabUsers": "Users",
    "admin.tabProducts": "Products",
    "admin.tabOrders": "Orders",
    "admin.tabCategories": "Categories",
    "admin.categoryHint": "Categories with 0 active products can be deleted — useful for cleaning up typos like a stray \"C\".",
    "admin.noProducts": "No products.",
    "admin.noOrders": "No orders yet.",

    "seller.title": "Seller Dashboard",
    "seller.myProducts": "My Products",
    "seller.orders": "Orders",
    "seller.addProduct": "Add Product",
    "seller.editProduct": "Edit Product",
    "seller.title.field": "Title",
    "seller.category": "Category",
    "seller.description": "Description",
    "seller.stock": "Stock",
    "seller.productImages": "Product Images",
    "seller.speakDetails": "Speak product details",
    "seller.noOrdersYet": "No orders yet."
  },

  hi: {
    "nav.shop": "खरीदारी",
    "nav.puzzle": "🧩 मेरी कारीगरी खोजें",
    "nav.sell": "Legocraft पर बेचें",
    "nav.search": "हस्तनिर्मित उत्पाद खोजें",
    "footer.tagline": "भारत के पारंपरिक कारीगरों को आधुनिक डिजिटल अर्थव्यवस्था से जोड़ना।",
    "footer.shop": "खरीदारी",
    "footer.allProducts": "सभी उत्पाद",
    "footer.trackOrder": "ऑर्डर ट्रैक करें",
    "footer.sell": "बेचें",
    "footer.becomeSeller": "विक्रेता बनें",
    "footer.sellerLogin": "विक्रेता लॉगिन",
    "footer.copyright": "© 2026 Legocraft. हाथों से बनाया गया।",
    "lang.choose": "भाषा",

    "common.addToCart": "कार्ट में डालें",
    "common.addedToCart": "कार्ट में डाल दिया गया",
    "common.buyNow": "अभी खरीदें",
    "common.remove": "हटाएं",
    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.edit": "संपादित करें",
    "common.total": "कुल",
    "common.outOfStock": "स्टॉक में नहीं है",
    "common.inStock": "स्टॉक में उपलब्ध",
    "common.viewAll": "सभी देखें →",
    "common.soldBy": "विक्रेता",
    "common.allCategories": "सभी श्रेणियां",
    "common.noProductsYet": "अभी कोई उत्पाद नहीं है।",
    "common.noProductsFound": "कोई उत्पाद नहीं मिला। कोई दूसरी खोज या श्रेणी आज़माएं।",
    "common.ban": "प्रतिबंधित करें",
    "common.unban": "प्रतिबंध हटाएं",
    "common.delete": "हटाएं",
    "common.inUse": "उपयोग में है",
    "common.noCategories": "कोई श्रेणी नहीं है।",
    "common.noOrdersYet": "अभी कोई ऑर्डर नहीं है।",

    "home.h1.line1": "आपकी कारीगरी।",
    "home.h1.line2": "आपकी कहानी।",
    "home.h1.line3": "आपका बाज़ार।",
    "home.subtitle": "भारत के कारीगरों से सीधे खरीदें, या मिनटों में अपना हस्तनिर्मित काम बेचना शुरू करें — कोई बिचौलिया नहीं, कोई छिपा शुल्क नहीं।",
    "home.shopHandmade": "हस्तनिर्मित खरीदें",
    "home.startSelling": "बेचना शुरू करें",
    "home.puzzleTitle": "पक्का नहीं कि क्या खरीदें?",
    "home.puzzleSubtitle": "बिल्ड योर क्राफ्ट पहेली खेलें — तीन आसान सवाल और हम आपके लिए सही हस्तनिर्मित चीज़ ढूंढ देंगे।",
    "home.startPuzzle": "पहेली शुरू करें →",
    "home.featured": "चुनिंदा उत्पाद",
    "home.f1.title": "100% हस्तनिर्मित",
    "home.f1.desc": "हर वस्तु असली कारीगरी के रूप में सत्यापित है।",
    "home.f2.title": "उचित मूल्य",
    "home.f2.desc": "कारीगर खुद अपनी कीमत तय करते हैं — कोई बिचौलिया मार्कअप नहीं।",
    "home.f3.title": "ट्रैक की गई डिलीवरी",
    "home.f3.desc": "हर ऑर्डर को वर्कशॉप से दरवाज़े तक ट्रैक करें।",

    "products.title": "हस्तनिर्मित खरीदारी",
    "products.category": "श्रेणी",

    "product.notSpecified": "कोई उत्पाद निर्दिष्ट नहीं है।",
    "product.readHindi": "हिंदी में पढ़ें",
    "product.readEnglish": "अंग्रेज़ी में पढ़ें (Read in English)",

    "cart.title": "आपका कार्ट",
    "cart.empty": "आपका कार्ट खाली है।",
    "cart.startShopping": "खरीदारी शुरू करें →",
    "cart.proceedToCheckout": "चेकआउट पर जाएं",

    "checkout.title": "चेकआउट",
    "checkout.loginPrompt1": "कृपया",
    "checkout.loginPrompt2": "लॉग इन करें",
    "checkout.loginPrompt3": "अपना ऑर्डर पूरा करने के लिए।",
    "checkout.deliveryAddress": "डिलीवरी पता",
    "checkout.addressPlaceholder": "पूरा नाम, घर/सड़क, शहर, राज्य, पिनकोड, फ़ोन नंबर",
    "checkout.placeOrder": "ऑर्डर करें (डिलीवरी पर नकद भुगतान)",
    "checkout.cartEmpty": "आपका कार्ट खाली है।",
    "checkout.enterAddress": "कृपया डिलीवरी का पता दर्ज करें।",
    "checkout.orderPlaced": "ऑर्डर सफलतापूर्वक दिया गया!",

    "login.title": "वापसी पर स्वागत है",
    "login.subtitle": "अपने Legocraft खाते में लॉग इन करें",
    "login.watchVideo": "यहां नए हैं? देखें साइन अप कैसे काम करता है",
    "login.identifier": "ईमेल या फ़ोन नंबर",
    "login.identifierPlaceholder": "you@example.com या 9876543210",
    "login.password": "पासवर्ड",
    "login.submit": "लॉग इन करें",
    "login.noAccount": "खाता नहीं है?",
    "login.signUp": "साइन अप करें",
    "login.demoAccounts": "डेमो खाते",
    "video.skip": "छोड़ें",
    "video.continue": "जारी रखें",
    "video.howItWorks": "साइन अप कैसे काम करता है",
    "video.unavailable": "ट्यूटोरियल वीडियो अभी उपलब्ध नहीं है।",

    "register.title": "खाता बनाएं",
    "register.subtitle": "खरीदार या विक्रेता के रूप में Legocraft से जुड़ें",
    "register.watchVideo": "देखें साइन अप कैसे काम करता है",
    "register.continueToSignup": "साइन अप जारी रखें",
    "register.wantBuy": "मुझे खरीदना है",
    "register.wantSell": "मुझे बेचना है",
    "register.fullName": "पूरा नाम",
    "register.shopName": "दुकान / ब्रांड का नाम",
    "register.email": "ईमेल",
    "register.phone": "फ़ोन नंबर",
    "register.phonePlaceholder": "उदा. 9876543210",
    "register.phoneHint": "केवल अंक। आप अपने ईमेल या इस नंबर से लॉग इन कर सकते हैं।",
    "register.phoneHintDigits": "केवल अंक।",
    "register.contactWith": "संपर्क का तरीका",
    "register.password": "पासवर्ड",
    "register.submit": "खाता बनाएं",
    "register.haveAccount": "पहले से खाता है?",
    "register.login": "लॉग इन करें",

    "sellerRegister.title": "अपनी कारीगरी को ऑनलाइन व्यवसाय बनाएं",
    "sellerRegister.subtitle": "अपने उत्पाद सूचीबद्ध करें, देशभर के खरीदारों तक पहुंचें, और अपने ऑर्डर एक ही सेलर डैशबोर्ड से प्रबंधित करें। पहले 90 दिनों पर कोई कमीशन नहीं।",
    "sellerRegister.f1.title": "आपकी अपनी दुकान",
    "sellerRegister.f1.desc": "अपने दुकान के नाम के तहत असीमित उत्पाद सूचीबद्ध करें।",
    "sellerRegister.f2.title": "सरल डैशबोर्ड",
    "sellerRegister.f2.desc": "ऑर्डर ट्रैक करें और स्टॉक को वास्तविक समय में अपडेट करें।",
    "sellerRegister.f3.title": "आप कीमत तय करें",
    "sellerRegister.f3.desc": "कोई बिचौलिया नहीं — आप तय करते हैं कि आपका काम कितने का है।",
    "sellerRegister.registerBtn": "विक्रेता के रूप में पंजीकरण करें",
    "sellerRegister.alreadySelling": "पहले से बेच रहे हैं?",
    "sellerRegister.loginDashboard": "अपने डैशबोर्ड में लॉग इन करें",

    "orders.title": "मेरे ऑर्डर",
    "orders.browse": "उत्पाद देखें →",
    "orders.loginPrompt": "कृपया",
    "orders.loginToView": "लॉग इन करें",
    "orders.toSeeOrders": "अपने ऑर्डर देखने के लिए।",
    "orders.order": "ऑर्डर #",

    "puzzle.title": "अपनी कारीगरी बनाएं",
    "puzzle.subtitle": "पक्का नहीं कि क्या खरीदें? तीन आसान सवालों के जवाब दें और हम आपके लिए एक हस्तनिर्मित चीज़ ढूंढ देंगे।",
    "puzzle.startOver": "↺ फिर से शुरू करें",
    "puzzle.q1": "आप कौन सी सामग्री पसंद करते हैं?",
    "puzzle.q2": "आपको कौन सी शैली पसंद है?",
    "puzzle.q3": "उद्देश्य क्या है?",
    "puzzle.wood": "लकड़ी", "puzzle.clay": "मिट्टी", "puzzle.fabric": "कपड़ा",
    "puzzle.simple": "सादा", "puzzle.colourful": "रंगीन", "puzzle.traditional": "पारंपरिक",
    "puzzle.gift": "उपहार", "puzzle.homeDecor": "घर की सजावट", "puzzle.personalUse": "निजी उपयोग",
    "puzzle.finding": "बढ़िया! 🎉 आपके लिए सही कारीगरी खोज रहे हैं…",
    "puzzle.error": "क्षमा करें, कुछ गलत हो गया:",

    "404.text": "यह पेज मौजूद नहीं है।",
    "404.back": "Legocraft पर वापस जाएं",

    "admin.title": "एडमिन डैशबोर्ड",
    "admin.buyers": "खरीदार",
    "admin.sellers": "विक्रेता",
    "admin.activeProducts": "सक्रिय उत्पाद",
    "admin.orders": "ऑर्डर",
    "admin.tabUsers": "उपयोगकर्ता",
    "admin.tabProducts": "उत्पाद",
    "admin.tabOrders": "ऑर्डर",
    "admin.tabCategories": "श्रेणियां",
    "admin.categoryHint": "0 सक्रिय उत्पादों वाली श्रेणियों को हटाया जा सकता है — जैसे गलती से बनी \"C\" जैसी श्रेणी को साफ़ करने के लिए उपयोगी।",
    "admin.noProducts": "कोई उत्पाद नहीं है।",
    "admin.noOrders": "अभी कोई ऑर्डर नहीं है।",

    "seller.title": "विक्रेता डैशबोर्ड",
    "seller.myProducts": "मेरे उत्पाद",
    "seller.orders": "ऑर्डर",
    "seller.addProduct": "उत्पाद जोड़ें",
    "seller.editProduct": "उत्पाद संपादित करें",
    "seller.title.field": "शीर्षक",
    "seller.category": "श्रेणी",
    "seller.description": "विवरण",
    "seller.stock": "स्टॉक",
    "seller.productImages": "उत्पाद की तस्वीरें",
    "seller.speakDetails": "उत्पाद विवरण बोलें",
    "seller.noOrdersYet": "अभी कोई ऑर्डर नहीं है।"
  },

  ta: {
    "nav.shop": "கடை",
    "nav.puzzle": "🧩 எனக்கான கைவினை தேடு",
    "nav.sell": "Legocraft-இல் விற்பனை செய்யுங்கள்",
    "nav.search": "கைவினைப் பொருட்களைத் தேடுங்கள்",
    "footer.tagline": "இந்தியாவின் பாரம்பரிய கைவினைஞர்களை நவீன டிஜிட்டல் பொருளாதாரத்துடன் இணைக்கிறது.",
    "footer.shop": "கடை",
    "footer.allProducts": "அனைத்து பொருட்கள்",
    "footer.trackOrder": "ஆர்டரைக் கண்காணிக்கவும்",
    "footer.sell": "விற்பனை",
    "footer.becomeSeller": "விற்பனையாளராகுங்கள்",
    "footer.sellerLogin": "விற்பனையாளர் உள்நுழைவு",
    "footer.copyright": "© 2026 Legocraft. கைகளால் உருவாக்கப்பட்டது.",
    "lang.choose": "மொழி",

    "common.addToCart": "கார்ட்டில் சேர்",
    "common.addedToCart": "கார்ட்டில் சேர்க்கப்பட்டது",
    "common.buyNow": "இப்போது வாங்கு",
    "common.remove": "நீக்கு",
    "common.cancel": "ரத்து செய்",
    "common.save": "சேமி",
    "common.edit": "திருத்து",
    "common.total": "மொத்தம்",
    "common.outOfStock": "கையிருப்பில் இல்லை",
    "common.inStock": "கையிருப்பில் உள்ளது",
    "common.viewAll": "அனைத்தையும் காண →",
    "common.soldBy": "விற்பனையாளர்",
    "common.allCategories": "அனைத்து வகைகள்",
    "common.noProductsYet": "இன்னும் பொருட்கள் இல்லை.",
    "common.noProductsFound": "பொருட்கள் இல்லை. வேறு தேடல் அல்லது வகையை முயற்சிக்கவும்.",
    "common.ban": "தடை செய்",
    "common.unban": "தடை நீக்கு",
    "common.delete": "நீக்கு",
    "common.inUse": "பயன்பாட்டில் உள்ளது",
    "common.noCategories": "வகைகள் இல்லை.",
    "common.noOrdersYet": "இன்னும் ஆர்டர்கள் இல்லை.",

    "home.h1.line1": "உங்கள் கைவினை.",
    "home.h1.line2": "உங்கள் கதை.",
    "home.h1.line3": "உங்கள் சந்தை.",
    "home.subtitle": "இந்தியாவின் கைவினைஞர்களிடமிருந்து நேரடியாக வாங்குங்கள், அல்லது சில நிமிடங்களில் உங்கள் கைவினைப் பொருட்களை விற்கத் தொடங்குங்கள் — இடைத்தரகர் இல்லை, மறைமுக கட்டணம் இல்லை.",
    "home.shopHandmade": "கைவினைப் பொருட்களை வாங்கு",
    "home.startSelling": "விற்பனையைத் தொடங்கு",
    "home.puzzleTitle": "என்ன வாங்குவது என்று தெரியவில்லையா?",
    "home.puzzleSubtitle": "Build Your Craft புதிரை விளையாடுங்கள் — மூன்று எளிய கேள்விகள், உங்களுக்கான கைவினைப் பொருளை நாங்கள் கண்டறிவோம்.",
    "home.startPuzzle": "புதிரைத் தொடங்கு →",
    "home.featured": "சிறப்புப் பொருட்கள்",
    "home.f1.title": "100% கைவினை",
    "home.f1.desc": "ஒவ்வொரு பொருளும் உண்மையான கைவினைப் பணியாக சரிபார்க்கப்பட்டது.",
    "home.f2.title": "நியாயமான விலை",
    "home.f2.desc": "கைவினைஞர்களே தங்கள் விலையை நிர்ணயிக்கிறார்கள் — இடைத்தரகர் கூடுதல் இல்லை.",
    "home.f3.title": "கண்காணிக்கப்பட்ட டெலிவரி",
    "home.f3.desc": "ஒவ்வொரு ஆர்டரையும் பட்டறையிலிருந்து வீட்டு வாசல் வரை பின்தொடரவும்.",

    "products.title": "கைவினைப் பொருட்கள் வாங்குதல்",
    "products.category": "வகை",

    "product.notSpecified": "பொருள் குறிப்பிடப்படவில்லை.",
    "product.readHindi": "हिंदी में पढ़ें (இந்தியில் படிக்க)",
    "product.readEnglish": "ஆங்கிலத்தில் படிக்க (Read in English)",

    "cart.title": "உங்கள் கார்ட்",
    "cart.empty": "உங்கள் கார்ட் காலியாக உள்ளது.",
    "cart.startShopping": "கடையைத் தொடங்கு →",
    "cart.proceedToCheckout": "செக்அவுட் செல்லவும்",

    "checkout.title": "செக்அவுட்",
    "checkout.loginPrompt1": "தயவுசெய்து",
    "checkout.loginPrompt2": "உள்நுழையவும்",
    "checkout.loginPrompt3": "உங்கள் ஆர்டரை முடிக்க.",
    "checkout.deliveryAddress": "டெலிவரி முகவரி",
    "checkout.addressPlaceholder": "முழு பெயர், வீடு/தெரு, நகரம், மாநிலம், பின்கோடு, தொலைபேசி எண்",
    "checkout.placeOrder": "ஆர்டர் செய் (டெலிவரி நேரத்தில் பணம்)",
    "checkout.cartEmpty": "உங்கள் கார்ட் காலியாக உள்ளது.",
    "checkout.enterAddress": "தயவுசெய்து டெலிவரி முகவரியை உள்ளிடவும்.",
    "checkout.orderPlaced": "ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது!",

    "login.title": "மீண்டும் வரவேற்கிறோம்",
    "login.subtitle": "உங்கள் Legocraft கணக்கில் உள்நுழையவும்",
    "login.watchVideo": "இங்கே புதிதாக வந்திருக்கிறீர்களா? பதிவு செய்யும் முறை எப்படி என்று பாருங்கள்.",
    "login.identifier": "மின்னஞ்சல் அல்லது தொலைபேசி எண்",
    "login.identifierPlaceholder": "you@example.com அல்லது 9876543210",
    "login.password": "கடவுச்சொல்",
    "login.submit": "உள்நுழை",
    "login.noAccount": "கணக்கு இல்லையா?",
    "login.signUp": "பதிவு செய்யவும்",
    "login.demoAccounts": "டெமோ கணக்குகள்",
    "video.skip": "தவிர்",
    "video.continue": "தொடரவும்",
    "video.howItWorks": "பதிவு எப்படி வேலை செய்கிறது",
    "video.unavailable": "பயிற்சி வீடியோ இன்னும் கிடைக்கவில்லை.",

    "register.title": "கணக்கை உருவாக்கு",
    "register.subtitle": "வாங்குபவராகவோ விற்பவராகவோ Legocraft-இல் இணையுங்கள்",
    "register.watchVideo": "பதிவு எப்படி வேலை செய்கிறது என்று பாருங்கள்",
    "register.continueToSignup": "பதிவைத் தொடரவும்",
    "register.wantBuy": "நான் வாங்க விரும்புகிறேன்",
    "register.wantSell": "நான் விற்க விரும்புகிறேன்",
    "register.fullName": "முழு பெயர்",
    "register.shopName": "கடை / பிராண்ட் பெயர்",
    "register.email": "மின்னஞ்சல்",
    "register.phone": "தொலைபேசி எண்",
    "register.phonePlaceholder": "எ.கா. 9876543210",
    "register.phoneHint": "எண்கள் மட்டும். உங்கள் மின்னஞ்சல் அல்லது இந்த எண்ணைக் கொண்டு உள்நுழையலாம்.",
    "register.phoneHintDigits": "எண்கள் மட்டும்.",
    "register.contactWith": "தொடர்பு முறை",
    "register.password": "கடவுச்சொல்",
    "register.submit": "கணக்கை உருவாக்கு",
    "register.haveAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "register.login": "உள்நுழை",

    "sellerRegister.title": "உங்கள் கைவினையை ஆன்லைன் தொழிலாக மாற்றுங்கள்",
    "sellerRegister.subtitle": "உங்கள் பொருட்களை பட்டியலிடுங்கள், நாடு முழுவதும் வாங்குபவர்களை அடையுங்கள், ஒரே விற்பனையாளர் டாஷ்போர்டில் உங்கள் ஆர்டர்களை நிர்வகிக்கவும். முதல் 90 நாட்களில் கமிஷன் இல்லை.",
    "sellerRegister.f1.title": "உங்கள் சொந்தக் கடை",
    "sellerRegister.f1.desc": "உங்கள் கடை பெயரில் வரம்பற்ற பொருட்களை பட்டியலிடுங்கள்.",
    "sellerRegister.f2.title": "எளிய டாஷ்போர்டு",
    "sellerRegister.f2.desc": "ஆர்டர்களைக் கண்காணித்து கையிருப்பை உடனுக்குடன் புதுப்பிக்கவும்.",
    "sellerRegister.f3.title": "நீங்களே விலையை நிர்ணயிக்கவும்",
    "sellerRegister.f3.desc": "இடைத்தரகர் இல்லை — உங்கள் வேலையின் மதிப்பை நீங்களே தீர்மானிக்கவும்.",
    "sellerRegister.registerBtn": "விற்பனையாளராக பதிவு செய்யவும்",
    "sellerRegister.alreadySelling": "ஏற்கனவே விற்கிறீர்களா?",
    "sellerRegister.loginDashboard": "உங்கள் டாஷ்போர்டில் உள்நுழையவும்",

    "orders.title": "எனது ஆர்டர்கள்",
    "orders.browse": "பொருட்களைப் பார்வையிடு →",
    "orders.loginPrompt": "தயவுசெய்து",
    "orders.loginToView": "உள்நுழையவும்",
    "orders.toSeeOrders": "உங்கள் ஆர்டர்களைப் பார்க்க.",
    "orders.order": "ஆர்டர் #",

    "puzzle.title": "உங்கள் கைவினையை உருவாக்குங்கள்",
    "puzzle.subtitle": "என்ன வாங்குவது என்று தெரியவில்லையா? மூன்று எளிய கேள்விகளுக்கு பதிலளிக்கவும், உங்களுக்கான கைவினைப் பொருளை நாங்கள் கண்டறிவோம்.",
    "puzzle.startOver": "↺ மீண்டும் தொடங்கு",
    "puzzle.q1": "நீங்கள் எந்த பொருளை விரும்புகிறீர்கள்?",
    "puzzle.q2": "உங்களுக்கு எந்த பாணி பிடிக்கும்?",
    "puzzle.q3": "நோக்கம் என்ன?",
    "puzzle.wood": "மரம்", "puzzle.clay": "களிமண்", "puzzle.fabric": "துணி",
    "puzzle.simple": "எளிமை", "puzzle.colourful": "வண்ணமயமான", "puzzle.traditional": "பாரம்பரியம்",
    "puzzle.gift": "பரிசு", "puzzle.homeDecor": "வீட்டு அலங்காரம்", "puzzle.personalUse": "தனிப்பட்ட பயன்பாடு",
    "puzzle.finding": "அருமை! 🎉 உங்களுக்கான சரியான கைவினைப் பொருளைத் தேடுகிறோம்…",
    "puzzle.error": "மன்னிக்கவும், ஏதோ தவறு நடந்தது:",

    "404.text": "இந்தப் பக்கம் இல்லை.",
    "404.back": "Legocraft-க்குத் திரும்பு",

    "admin.title": "நிர்வாக டாஷ்போர்டு",
    "admin.buyers": "வாங்குபவர்கள்",
    "admin.sellers": "விற்பனையாளர்கள்",
    "admin.activeProducts": "செயலில் உள்ள பொருட்கள்",
    "admin.orders": "ஆர்டர்கள்",
    "admin.tabUsers": "பயனர்கள்",
    "admin.tabProducts": "பொருட்கள்",
    "admin.tabOrders": "ஆர்டர்கள்",
    "admin.tabCategories": "வகைகள்",
    "admin.categoryHint": "0 செயலில் உள்ள பொருட்களுடன் இருக்கும் வகைகளை நீக்கலாம் — தவறான \"C\" போன்ற வகைகளை சுத்தம் செய்ய பயனுள்ளது.",
    "admin.noProducts": "பொருட்கள் இல்லை.",
    "admin.noOrders": "இன்னும் ஆர்டர்கள் இல்லை.",

    "seller.title": "விற்பனையாளர் டாஷ்போர்டு",
    "seller.myProducts": "எனது பொருட்கள்",
    "seller.orders": "ஆர்டர்கள்",
    "seller.addProduct": "பொருள் சேர்",
    "seller.editProduct": "பொருளைத் திருத்து",
    "seller.title.field": "தலைப்பு",
    "seller.category": "வகை",
    "seller.description": "விளக்கம்",
    "seller.stock": "கையிருப்பு",
    "seller.productImages": "பொருள் படங்கள்",
    "seller.speakDetails": "பொருள் விவரங்களைப் பேசு",
    "seller.noOrdersYet": "இன்னும் ஆர்டர்கள் இல்லை."
  }
};

function lcGetLang() {
  return localStorage.getItem(LC_LANG_KEY) || "en";
}

function lcSetLang(lang) {
  localStorage.setItem(LC_LANG_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent("lc-lang-changed", { detail: { lang } }));
}

// Translate a key. Falls back to English, then to the key itself.
function t(key) {
  const lang = lcGetLang();
  return (translations[lang] && translations[lang][key])
    || translations.en[key]
    || key;
}

function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  scope.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  scope.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
  });
  scope.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
  });
}

// Renders a small language switcher; call after the header is injected.
function renderLangSwitcher(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const current = lcGetLang();
  el.innerHTML = `
    <div class="relative">
      <button id="lc-lang-btn" type="button" class="flex items-center gap-1 text-on-surface hover:text-primary text-sm">
        <span class="material-symbols-outlined text-[20px]">translate</span>
        <span class="hidden sm:inline">${LC_LANGS[current].native}</span>
      </button>
      <div id="lc-lang-menu" class="hidden absolute right-0 mt-2 w-36 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg overflow-hidden z-50">
        ${Object.keys(LC_LANGS).map(code => `
          <button data-lang="${code}" class="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low ${code === current ? "text-primary font-medium" : "text-on-surface"}">
            ${LC_LANGS[code].native}
          </button>`).join("")}
      </div>
    </div>`;
  const btn = document.getElementById("lc-lang-btn");
  const menu = document.getElementById("lc-lang-menu");
  btn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); };
  document.addEventListener("click", () => menu.classList.add("hidden"));
  menu.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => {
    lcSetLang(b.dataset.lang);
    renderLangSwitcher(containerId);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = lcGetLang();
  applyTranslations();
});
