import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// This route is called by Vercel Cron Jobs daily
// Protect it with a secret token
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all expired records
    const { data: expiredFiles, error: fetchError } = await supabase
      .from("uploads")
      .select("id, storage_path")
      .lt("expires_at", new Date().toISOString());

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredFiles || expiredFiles.length === 0) {
      return NextResponse.json({ message: "No expired files to clean up" });
    }

    // Delete files from storage
    const paths = expiredFiles.map((f) => f.storage_path);
    const { error: storageError } = await supabase.storage
      .from("qrdrop-files")
      .remove(paths);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
    }

    // Delete records from DB
    const ids = expiredFiles.map((f) => f.id);
    const { error: dbError } = await supabase
      .from("uploads")
      .delete()
      .in("id", ids);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Cleaned up ${expiredFiles.length} expired files`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
