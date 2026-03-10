"use client";
import { useState } from "react";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import QRDisplay from "@/components/QRDisplay";
import styles from "./page.module.css";

export default function Home() {
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadedRecord, setUploadedRecord] = useState(null);

  const handleSuccess = (url, record) => {
    setUploadedUrl(url);
    setUploadedRecord(record);
  };

  const handleReset = () => {
    setUploadedUrl(null);
    setUploadedRecord(null);
  };

  return (
    <main className={styles.main}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>◈</span>
            <span className={styles.logoText}>QRDrop</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/history" className={styles.navLink}>
              History
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.badge}>Any file. Instant QR.</p>
          <h1 className={styles.title}>
            Drop a file.<br />
            <span className={styles.titleAccent}>Get a QR code.</span>
          </h1>
          <p className={styles.subtitle}>
            Upload any file — PDF, image, video, zip — and get a scannable QR code linked to it.
          </p>
        </section>

        {/* Main card */}
        <div className={styles.card}>
          {uploadedUrl ? (
            <>
              <div className={styles.successHeader}>
                <span className={styles.successBadge}>✓ File uploaded</span>
                <button onClick={handleReset} className={styles.resetBtn}>
                  Upload another
                </button>
              </div>
              <QRDisplay url={uploadedUrl} fileName={uploadedRecord?.file_name} />
            </>
          ) : (
            <FileUploader onUploadSuccess={handleSuccess} />
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
