# HAIS — GitHub Pages Deploy নির্দেশিকা

## প্রয়োজনীয় ফাইলগুলো (সবগুলো একসাথে রাখুন)

```
HAIS-Deploy/
├── index.html       ← মূল অ্যাপ
├── manifest.json    ← PWA কনফিগ
├── sw.js            ← Auto-Update Service Worker
├── favicon.ico
├── icon-72.png
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-192.png
└── icon-512.png
```

---

## ধাপ ১ — GitHub Account তৈরি করুন

1. **https://github.com** যান
2. "Sign up" বাটন চাপুন
3. Email, Password দিয়ে account তৈরি করুন
4. Email verify করুন

---

## ধাপ ২ — নতুন Repository তৈরি করুন

1. GitHub-এ login করুন
2. ডান দিকে উপরে **"+"** বাটন চাপুন → **"New repository"**
3. নিচের মতো পূরণ করুন:
   - **Repository name:** `hais` (অথবা `heritage-school`)
   - **Visibility:** ✅ **Public** (Private হলে Pages কাজ করবে না)
   - বাকি সব default রাখুন
4. **"Create repository"** চাপুন

---

## ধাপ ৩ — ফাইলগুলো Upload করুন

1. Repository খোলা পাবেন, **"uploading an existing file"** লিংকে চাপুন
2. **সব ফাইল একসাথে** drag করে ছেড়ে দিন (HAIS-Deploy ফোল্ডারের ভেতরের সব)
3. নিচে **"Commit changes"** চাপুন

---

## ধাপ ৪ — GitHub Pages চালু করুন

1. Repository-তে **Settings** ট্যাবে যান
2. বাম দিকে **"Pages"** মেনুতে চাপুন
3. **"Source"** এর নিচে:
   - Branch: **main** বেছে নিন
   - Folder: **/ (root)** রাখুন
4. **"Save"** চাপুন
5. কিছুক্ষণ পর URL দেখাবে: `https://আপনার-নাম.github.io/hais/`

---

## ধাপ ৫ — অ্যাপ Install করুন (মোবাইলে)

### Android:
1. Chrome দিয়ে URL খুলুন
2. নিচে "Add to Home screen" popup আসবে → "Install" চাপুন
3. Home screen-এ HAIS আইকন দেখাবে

### iPhone:
1. Safari দিয়ে URL খুলুন
2. নিচে Share বাটন চাপুন (□↑)
3. "Add to Home Screen" চাপুন → "Add" চাপুন

---

## ভবিষ্যতে আপডেট করবেন যেভাবে

1. GitHub-এ গিয়ে `index.html` ফাইলে চাপুন
2. ✏️ (Edit) বাটন চাপুন
3. নতুন index.html এর content paste করুন
4. **"Commit changes"** চাপুন
5. **১-২ মিনিটের মধ্যে** সবার ডিভাইসে অটো আপডেট হয়ে যাবে! ✅

---

## Auto-Update কীভাবে কাজ করে?

```
আপনি index.html আপডেট করলেন
        ↓
GitHub Pages সাথে সাথে নতুন ভার্সন serve করে
        ↓
ব্যবহারকারী অ্যাপ খুললে বা ৩০ সেকেন্ড পর
Service Worker নতুন ভার্সন detect করে
        ↓
Toast notification দেখায়: "নতুন আপডেট পাওয়া গেছে"
        ↓
স্বয়ংক্রিয়ভাবে reload হয় — সবাই latest ভার্সন পায়! 🎉
```

---

**আপনার App URL হবে:**
`https://YOUR-GITHUB-USERNAME.github.io/hais/`

এই লিংকটি সবাইকে শেয়ার করুন — একবার Install করলেই হবে।
