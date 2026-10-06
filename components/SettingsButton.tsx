"use client";

import { hasApiKey, openSettings, useAiSettings } from "@/lib/ai-settings";

export default function SettingsButton() {
  const settings = useAiSettings();
  const ready = hasApiKey(settings);

  return (
    <button
      type="button"
      onClick={openSettings}
      aria-label="API 金鑰設定"
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="15" r="4" />
        <path d="m10.85 12.15 7.65-7.65M16 7l2.5 2.5M18.5 4.5 21 7" />
      </svg>
      {/* 小圓點：綠色代表已設定金鑰，朱紅色代表還沒設定 */}
      {settings !== null && (
        <span className={`absolute right-0.5 top-0.5 h-2 w-2 rounded-full ring-2 ring-paper ${ready ? "bg-good" : "bg-accent"}`} />
      )}
    </button>
  );
}
