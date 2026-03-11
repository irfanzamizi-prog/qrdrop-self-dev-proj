"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import styles from "./HistoryCard.module.css";

export default function HistoryCard({ record, onDelete }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(record.file_url, {
      width: 120,
      margin: 1,
      color: { dark: "#f97316", light: "#000000" },
    }).then(setQrDataUrl);
  }, [record.file_url]);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      // Delete from storage
      await supabase.storage.from("qrdrop-files").remove([record.storage_path]);
      // Delete from DB
      await supabase.from("uploads").delete().eq("id", record.id);
      onDelete(record.id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isExpired = new Date(record.expires_at) < new Date();
  const daysLeft = Math.ceil((new Date(record.expires_at) - new Date()) / (1000 * 60 * 60 * 24));

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrdrop-${record.file_name}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className={`${styles.card} ${isExpired ? styles.expired : ""}`}>
      <div className={styles.top}>
        <div className={styles.qrThumb} style={{ background: "#000" }}>
          {qrDataUrl && <img src={qrDataUrl} alt="QR" className={styles.qrImg} />}
        </div>

        <div className={styles.info}>
          <p className={styles.fileName}>{record.file_name}</p>
          <p className={styles.meta}>
            {formatSize(record.file_size)} · {formatDate(record.created_at)}
          </p>
          <p className={`${styles.expiry} ${isExpired ? styles.expiryExpired : daysLeft <= 1 ? styles.expirySoon : ""}`}>
            {isExpired ? "Expired" : `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className={styles.actions}>
          {!isExpired && (
            <a href={record.file_url} target="_blank" rel="noopener noreferrer" className={styles.openBtn}>
              ↗
            </a>
          )}
          <button className={styles.dlBtn} onClick={handleDownload} title="Download QR">
            ↓
          </button>
          <button
            className={`${styles.deleteBtn} ${confirmDelete ? styles.confirmBtn : ""}`}
            onClick={handleDelete}
            disabled={deleting}
            title={confirmDelete ? "Click again to confirm" : "Delete file"}
          >
            {deleting ? "..." : confirmDelete ? "Sure?" : "🗑"}
          </button>
        </div>
      </div>
    </div>
  );
}
