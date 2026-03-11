"use client";
import { useState, useRef } from "react";
import styles from "./FileUploader.module.css";

export default function FileUploader({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f.size > 50 * 1024 * 1024) {
      setError("File too large. Max 50MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
    setError("");
    // Reset the file input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiryDays", expiryDays);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUploadSuccess(data.url, data.record);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className={styles.hiddenInput}
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>{getFileEmoji(file.type)}</div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatSize(file.size)}</span>
            </div>
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              ✕
            </button>
          </div>
        ) : (
          <div className={styles.prompt}>
            <div className={styles.uploadIcon}>↑</div>
            <p className={styles.promptText}>Drop any file here</p>
            <p className={styles.promptSub}>or click to browse · max 50MB</p>
          </div>
        )}
      </div>

      {file && (
        <div className={styles.options}>
          <label className={styles.label}>
            <span>Expires in</span>
            <select
              className={styles.select}
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>

          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <span className={styles.spinner}>Uploading...</span>
            ) : (
              "Generate QR →"
            )}
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function getFileEmoji(type) {
  if (type.startsWith("image/")) return "🖼";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type === "application/pdf") return "📄";
  if (type.includes("zip") || type.includes("rar")) return "📦";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  return "📁";
}
