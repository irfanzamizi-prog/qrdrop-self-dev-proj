"use client";
import { useState } from "react";
import styles from "./LinkQR.module.css";

export default function LinkQR({ onGenerate }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (str) => {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleGenerate = () => {
    setError("");
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    // Auto-add https:// if missing
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    if (!isValidUrl(withProtocol)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    onGenerate(withProtocol);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>🔗</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Paste any URL here... (e.g. https://google.com)"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {input && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => { setInput(""); setError(""); }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={!input.trim()}
        >
          Generate QR →
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.examples}>
        <p className={styles.examplesLabel}>Try an example:</p>
        <div className={styles.exampleBtns}>
          {["https://google.com", "https://github.com", "https://youtube.com"].map((url) => (
            <button
              key={url}
              type="button"
              className={styles.exampleBtn}
              onClick={() => setInput(url)}
            >
              {url.replace("https://", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
