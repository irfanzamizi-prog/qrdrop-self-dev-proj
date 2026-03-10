"use client";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import styles from "./QRDisplay.module.css";

const PRESETS = [
  { fg: "#f97316", bg: "#000000", label: "Orange" },
  { fg: "#ffffff", bg: "#000000", label: "Classic" },
  { fg: "#000000", bg: "#ffffff", label: "Minimal" },
  { fg: "#22c55e", bg: "#000000", label: "Matrix" },
  { fg: "#3b82f6", bg: "#0a0a0a", label: "Electric" },
  { fg: "#a855f7", bg: "#0a0a0a", label: "Violet" },
];

export default function QRDisplay({ url, fileName }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customFg, setCustomFg] = useState("#f97316");
  const [customBg, setCustomBg] = useState("#000000");
  const [useCustom, setUseCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const fg = useCustom ? customFg : PRESETS[selectedPreset].fg;
  const bg = useCustom ? customBg : PRESETS[selectedPreset].bg;

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "M",
    }).then(setQrDataUrl);
  }, [url, fg, bg]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrdrop-${fileName || "code"}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.qrSection}>
        <div className={styles.qrFrame} style={{ background: bg }}>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className={styles.qrImage} />
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <p className={styles.controlLabel}>STYLE</p>

        <div className={styles.presets}>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              className={`${styles.preset} ${!useCustom && selectedPreset === i ? styles.activePreset : ""}`}
              onClick={() => { setSelectedPreset(i); setUseCustom(false); }}
              title={p.label}
            >
              <span className={styles.presetDot} style={{ background: p.fg, boxShadow: `0 0 6px ${p.fg}` }} />
              <span className={styles.presetDot} style={{ background: p.bg, border: "1px solid #333" }} />
            </button>
          ))}

          <button
            className={`${styles.preset} ${useCustom ? styles.activePreset : ""}`}
            onClick={() => setUseCustom(true)}
            title="Custom"
          >
            <span className={styles.customIcon}>✦</span>
          </button>
        </div>

        {useCustom && (
          <div className={styles.colorPickers}>
            <label className={styles.colorLabel}>
              <span>Foreground</span>
              <div className={styles.colorRow}>
                <input type="color" value={customFg} onChange={(e) => setCustomFg(e.target.value)} className={styles.colorInput} />
                <span className={styles.colorHex}>{customFg}</span>
              </div>
            </label>
            <label className={styles.colorLabel}>
              <span>Background</span>
              <div className={styles.colorRow}>
                <input type="color" value={customBg} onChange={(e) => setCustomBg(e.target.value)} className={styles.colorInput} />
                <span className={styles.colorHex}>{customBg}</span>
              </div>
            </label>
          </div>
        )}

        <div className={styles.urlBox}>
          <span className={styles.urlText}>{url}</span>
          <button className={styles.copyBtn} onClick={handleCopyUrl}>
            {copied ? "✓ Copied" : "Copy link"}
          </button>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload}>
          ↓ Download QR Code
        </button>
      </div>
    </div>
  );
}
