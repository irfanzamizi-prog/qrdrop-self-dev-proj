"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import HistoryCard from "@/components/HistoryCard";
import styles from "./history.module.css";

export default function HistoryPage() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUploads(data || []);
    setLoading(false);
  };

  const handleDelete = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const filtered = uploads.filter((u) => {
    const isExpired = new Date(u.expires_at) < new Date();
    if (filter === "active") return !isExpired;
    if (filter === "expired") return isExpired;
    return true;
  });

  return (
    <main className={styles.main}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backBtn}>← Back</Link>
          <div className={styles.logo}>
            <span className={styles.logoMark}>◈</span>
            <span className={styles.logoText}>QRDrop</span>
          </div>
        </header>

        <section className={styles.hero}>
          <h1 className={styles.title}>Upload <span className={styles.accent}>History</span></h1>
          <p className={styles.subtitle}>{uploads.length} total uploads</p>
        </section>

        <div className={styles.filters}>
          {["all", "active", "expired"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {loading ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyIcon}>◈</p>
              <p className={styles.emptyText}>No uploads yet</p>
              <Link href="/" className={styles.emptyLink}>Upload your first file →</Link>
            </div>
          ) : (
            filtered.map((record) => (
              <HistoryCard key={record.id} record={record} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
