# ◈ QRDrop

**Upload any file or paste any link. Get a scannable QR code instantly.**

QRDrop lets you upload any file — PDF, image, video, zip, and more — or paste any URL, and generates a QR code linked to it. Share the QR code with anyone and they can scan it to access your file or link directly.

🔗 **Live Demo:** [qrdrop-self-dev-proj.vercel.app](https://qrdrop-self-dev-proj.vercel.app)

---

## ✨ Features

- 📁 **Upload any file** — PDF, image, video, zip, documents, and more (up to 50MB)
- 🔗 **Link to QR** — paste any URL and instantly generate a QR code, no upload needed
- 🔳 **Instant QR code** — generated immediately after upload or link input
- 🎨 **Custom QR styles** — 6 color presets + full custom color picker
- 📋 **Upload history** — view all past uploads with expiry status
- 🗑️ **Delete uploads** — remove files from storage and history anytime
- ⏳ **Auto file expiry** — files auto-delete after 1, 3, 7, 14, or 30 days
- 🌙 **Dark UI** — clean, modern dark interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 14 (App Router) |
| Database + Storage | Supabase |
| QR Generation | qrcode (npm) |
| Deployment | Vercel |
| Styling | CSS Modules |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/irfanzamizi-prog/qrdrop-self-dev-proj.git
cd qrdrop-self-dev-proj
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a new Supabase project and run this in the SQL Editor:
```sql
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  qr_color TEXT DEFAULT '#f97316',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'qrdrop-files');
CREATE POLICY "Public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qrdrop-files');
CREATE POLICY "Public delete" ON storage.objects FOR DELETE USING (bucket_id = 'qrdrop-files');
```

Also create a **public storage bucket** named `qrdrop-files`.

4. **Configure environment variables**

Rename `.env.local.example` to `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
CRON_SECRET=any-random-string
```

5. **Run locally**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
qrdrop/
├── app/
│   ├── page.jsx                 ← Main page (File Upload + Link to QR tabs)
│   ├── history/page.jsx         ← Upload history page
│   └── api/
│       ├── upload/route.js      ← File upload handler
│       └── cleanup/route.js     ← Expired file cleanup (cron)
├── components/
│   ├── FileUploader.jsx         ← Drag & drop file uploader
│   ├── LinkQR.jsx               ← URL input for link to QR
│   ├── QRDisplay.jsx            ← QR code generator + color picker
│   └── HistoryCard.jsx          ← History list card with delete
├── lib/
│   └── supabase.js              ← Supabase client
└── vercel.json                  ← Cron job config (runs daily at 2AM)
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. Every push to `main` automatically triggers a new deployment.

The cleanup cron job (`/api/cleanup`) runs daily at 2:00 AM UTC via Vercel Cron Jobs, automatically deleting expired files from both Supabase Storage and the database.

---

## 👨‍💻 Author

**Irfan Muhaimin**
- GitHub: [@irfanzamizi-prog](https://github.com/irfanzamizi-prog)
- Diploma in Computer Science — Kolej Profesional MARA Indera Mahkota
