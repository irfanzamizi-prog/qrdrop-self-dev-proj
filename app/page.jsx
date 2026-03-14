"use client";
import { useState } from "react";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import QRDisplay from "@/components/QRDisplay";
import LinkQR from "@/components/LinkQR";
import styles from "./page.module.css";

export default function Home() {
  const [tab, setTab] = useState("file"); // "file" or "link"
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadedRecord, setUploadedRecord] = useState(null);
  const [linkQrUrl, setLinkQrUrl] = useState(null);

  const handleSuccess = (url, record) => {
    setUploadedUrl(url);
    setUploadedRecord(record);
  };

  const handleReset = () => {
    setUploadedUrl(null);
    setUploadedRecord(null);
    setLinkQrUrl(null);
  };

  const handleTabChange = (t) => {
    setTab(t);
    handleReset();
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>◈</span>
            <span className={styles.logoText}>QRDrop</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/history" className={styles.navLink}>History</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.badge}>Any file or link. Instant QR.</p>
          <h1 className={styles.title}>
            Drop a file or link.<br />
            <span className={styles.titleAccent}>Get a QR code.</span>
          </h1>
          <p className={styles.subtitle}>
            Upload any file or paste any URL — get a scannable QR code instantly.
          </p>
        </section>

        {/* Main card */}
        <div className={styles.card}>
          {/* Tabs */}
          {!uploadedUrl && !linkQrUrl && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === "file" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("file")}
                type="button"
              >
                📁 File Upload
              </button>
              <button
                className={`${styles.tab} ${tab === "link" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("link")}
                type="button"
              >
                🔗 Link to QR
              </button>
            </div>
          )}

          {/* File upload flow */}
          {tab === "file" && (
            uploadedUrl ? (
              <>
                <div className={styles.successHeader}>
                  <span className={styles.successBadge}>✓ File uploaded</span>
                  <button onClick={handleReset} className={styles.resetBtn} type="button">
                    Upload another
                  </button>
                </div>
                <QRDisplay url={uploadedUrl} fileName={uploadedRecord?.file_name} />
              </>
            ) : (
              <FileUploader onUploadSuccess={handleSuccess} />
            )
          )}

          {/* Link to QR flow */}
          {tab === "link" && (
            linkQrUrl ? (
              <>
                <div className={styles.successHeader}>
                  <span className={styles.successBadge}>✓ QR generated</span>
                  <button onClick={handleReset} className={styles.resetBtn} type="button">
                    Try another link
                  </button>
                </div>
                <QRDisplay url={linkQrUrl} fileName="link" />
              </>
            ) : (
              <LinkQR onGenerate={setLinkQrUrl} />
            )
          )}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerText}>
            Files auto-delete after expiry · Built with Next.js & Supabase
          </span>
        </footer>
      </div>
    </main>
  );
}
