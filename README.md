# ◈ QRDrop — File to QR Code Generator

Upload any file and get a shareable QR code. Built with Next.js 14 + Supabase.

---

## 🚀 Setup Guide (Step by Step)

### STEP 1 — Install dependencies

Open this folder in VS Code, open the terminal, and run:

```bash
npm install
```

---

### STEP 2 — Create Supabase project

1. Go to https://supabase.com and sign up (free)
2. Click "New Project" → give it a name like `qrdrop`
3. Wait for it to finish setting up (~1 min)

---

### STEP 3 — Set up Supabase database table

In your Supabase project, go to **SQL Editor** and run this:

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
```

---

### STEP 4 — Set up Supabase Storage bucket

1. In Supabase, go to **Storage** → click "New bucket"
2. Name it exactly: `qrdrop-files`
3. Check **"Public bucket"** → click Save
4. Go to **Policies** → Add policy → For "SELECT": Allow public access
5. Add another policy for "INSERT": Allow all inserts (or set to authenticated only later)

Quick policy SQL (run in SQL Editor):
```sql
-- Allow public read
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'qrdrop-files');

-- Allow public upload
CREATE POLICY "Public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qrdrop-files');

-- Allow public delete (for cleanup cron)
CREATE POLICY "Public delete" ON storage.objects FOR DELETE USING (bucket_id = 'qrdrop-files');
```

---

### STEP 5 — Get your Supabase keys

1. In Supabase, go to **Settings → API**
2. Copy:
   - `Project URL` (looks like https://xxxx.supabase.co)
   - `anon public` key

---

### STEP 6 — Set up environment variables

1. Rename `.env.local.example` to `.env.local`
2. Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
CRON_SECRET=make-up-any-random-string-here
```

---

### STEP 7 — Run locally

```bash
npm run dev
```

Open http://localhost:3000 — you should see QRDrop! 🎉

---

### STEP 8 — Deploy to Vercel

1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/qrdrop.git
   git push -u origin main
   ```

2. Go to https://vercel.com → "New Project" → Import your GitHub repo

3. During import, add your environment variables (same as .env.local)

4. Click Deploy → Done! 🚀

5. Your cleanup cron job (auto-delete expired files) runs daily at 2AM automatically because of `vercel.json`.

---

## 📁 Project Structure

```
qrdrop/
├── app/
│   ├── page.jsx              ← Main upload + QR page
│   ├── history/page.jsx      ← Upload history
│   └── api/
│       ├── upload/route.js   ← File upload handler
│       └── cleanup/route.js  ← Expired file cleanup (cron)
├── components/
│   ├── FileUploader.jsx      ← Drag & drop uploader
│   ├── QRDisplay.jsx         ← QR code with color picker
│   └── HistoryCard.jsx       ← History list item
├── lib/
│   └── supabase.js           ← Supabase client
└── vercel.json               ← Cron job config
```

---

## ✨ Features

- Upload any file (PDF, image, video, zip, etc.) — max 50MB
- Auto-generates QR code linked to uploaded file
- Custom QR color themes + color picker
- Upload history with expiry tracking
- Files auto-delete after chosen expiry period (1–30 days)
- Daily cleanup cron job runs on Vercel

---

Built by Irfan · Powered by Next.js + Supabase + Vercel
