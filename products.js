// ===== দোকানের সেটিংস (এখানে নিজের তথ্য দিন) =====
const SHOP = {
  name: "EyakubShop",
  whatsapp: "8801XXXXXXXXX",   // নিজের নম্বর দিন, দেশের কোডসহ (যেমন 8801712345678), + ছাড়া
  phone: "01XXXXXXXXX",
  facebook: "https://facebook.com/",
  currency: "৳",
  deliveryInside: 60,          // ঢাকার ভিতরে ডেলিভারি চার্জ
  deliveryOutside: 120         // ঢাকার বাইরে
};

// ===== ক্যাটাগরি =====
const CATEGORIES = [
  { id: "all", name: "সব পণ্য", icon: "🛍️" },
  { id: "shoes", name: "জুতা", icon: "👟" },
  { id: "fashion", name: "ফ্যাশন", icon: "👕" },
  { id: "electronics", name: "ইলেকট্রনিক্স", icon: "🎧" },
  { id: "home", name: "হোম ও লাইফস্টাইল", icon: "🏠" },
  { id: "beauty", name: "বিউটি", icon: "💄" },
  { id: "bags", name: "ব্যাগ", icon: "🎒" }
];

// ===== পণ্যের তালিকা =====
// নতুন পণ্য যোগ করতে নিচের মতো একটি { ... } ব্লক কপি করে যোগ করুন।
// image: ছবির লিংক বা images/ ফোল্ডারের ফাইল (যেমন "images/shoe1.jpg")
// oldPrice: আগের দাম (ছাড় দেখাতে), না থাকলে 0
const PRODUCTS = [
  { id: 1, name: "পুরুষদের স্পোর্টস রানিং শু", category: "shoes", price: 1450, oldPrice: 1990, rating: 4.5, sold: 320, stock: 25, sizes: ["39","40","41","42","43"], image: "https://placehold.co/500x500/ff6a00/ffffff?text=Running+Shoe", desc: "হালকা ওজন, আরামদায়ক সোল, প্রতিদিনের ব্যবহারের জন্য সেরা।" },
  { id: 2, name: "পুরুষদের ফরমাল লেদার শু", category: "shoes", price: 2200, oldPrice: 2800, rating: 4.7, sold: 210, stock: 18, sizes: ["40","41","42","43","44"], image: "https://placehold.co/500x500/3a2a1a/ffffff?text=Leather+Shoe", desc: "অফিস ও অনুষ্ঠানের জন্য প্রিমিয়াম ফিনিশিং লেদার জুতা।" },
  { id: 3, name: "মহিলাদের ফ্যাশনেবল স্যান্ডেল", category: "shoes", price: 850, oldPrice: 1100, rating: 4.3, sold: 540, stock: 40, sizes: ["36","37","38","39","40"], image: "https://placehold.co/500x500/e91e63/ffffff?text=Sandal", desc: "নরম ফুটবেড, স্টাইলিশ ডিজাইন।" },
  { id: 4, name: "ক্যাজুয়াল স্নিকার্স", category: "shoes", price: 1650, oldPrice: 0, rating: 4.4, sold: 150, stock: 30, sizes: ["39","40","41","42","43"], image: "https://placehold.co/500x500/009688/ffffff?text=Sneakers", desc: "জিন্সের সাথে দারুণ মানায়। টেকসই ও আরামদায়ক।" },
  { id: 5, name: "কটন পোলো টি-শার্ট", category: "fashion", price: 450, oldPrice: 650, rating: 4.2, sold: 800, stock: 100, sizes: ["M","L","XL","XXL"], image: "https://placehold.co/500x500/2196f3/ffffff?text=Polo+Tshirt", desc: "১০০% কটন, নরম ও ঘাম শোষণকারী।" },
  { id: 6, name: "স্লিম ফিট জিন্স প্যান্ট", category: "fashion", price: 1100, oldPrice: 1500, rating: 4.4, sold: 430, stock: 60, sizes: ["30","32","34","36"], image: "https://placehold.co/500x500/1a237e/ffffff?text=Jeans", desc: "স্ট্রেচেবল ফ্যাব্রিক, দীর্ঘস্থায়ী রঙ।" },
  { id: 7, name: "ওয়্যারলেস ব্লুটুথ হেডফোন", category: "electronics", price: 1250, oldPrice: 1800, rating: 4.1, sold: 690, stock: 45, sizes: [], image: "https://placehold.co/500x500/212121/ffffff?text=Headphone", desc: "গভীর বেস, ২০ ঘণ্টা ব্যাটারি ব্যাকআপ।" },
  { id: 8, name: "স্মার্ট ওয়াচ", category: "electronics", price: 1990, oldPrice: 2900, rating: 4.0, sold: 380, stock: 22, sizes: [], image: "https://placehold.co/500x500/37474f/ffffff?text=Smart+Watch", desc: "হার্টরেট, স্টেপ কাউন্টার, কল ও মেসেজ নোটিফিকেশন।" },
  { id: 9, name: "ইলেকট্রিক কেটলি ১.৫ লিটার", category: "home", price: 780, oldPrice: 1050, rating: 4.3, sold: 260, stock: 35, sizes: [], image: "https://placehold.co/500x500/795548/ffffff?text=Kettle", desc: "অটো পাওয়ার অফ, স্টেইনলেস স্টিল বডি।" },
  { id: 10, name: "ফেস ওয়াশ ও ময়েশ্চারাইজার কম্বো", category: "beauty", price: 520, oldPrice: 700, rating: 4.5, sold: 910, stock: 70, sizes: [], image: "https://placehold.co/500x500/f06292/ffffff?text=Skin+Care", desc: "সব ধরনের ত্বকের জন্য উপযোগী।" },
  { id: 11, name: "স্টাইলিশ ব্যাকপ্যাক", category: "bags", price: 990, oldPrice: 1400, rating: 4.4, sold: 330, stock: 50, sizes: [], image: "https://placehold.co/500x500/455a64/ffffff?text=Backpack", desc: "ল্যাপটপ কম্পার্টমেন্টসহ ওয়াটারপ্রুফ ব্যাগ।" },
  { id: 12, name: "লেডিস হ্যান্ডব্যাগ", category: "bags", price: 1350, oldPrice: 1800, rating: 4.6, sold: 270, stock: 28, sizes: [], image: "https://placehold.co/500x500/880e4f/ffffff?text=Handbag", desc: "প্রিমিয়াম মানের, সব পোশাকের সাথে মানানসই।" }
];

const DISTRICTS = ["ঢাকা","চট্টগ্রাম","সিলেট","রাজশাহী","খুলনা","বরিশাল","রংপুর","ময়মনসিংহ","কুমিল্লা","গাজীপুর","নারায়ণগঞ্জ","বগুড়া","যশোর","অন্যান্য"];
