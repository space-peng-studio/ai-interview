"use client";

import { useEffect, useRef, useState } from "react";
import { PROVIDERS, PROVIDER_IDS, type ProviderId } from "@/lib/providers";
import {
  DEFAULT_SETTINGS,
  clearAiSettings,
  maskKey,
  onOpenSettings,
  saveAiSettings,
  useAiSettings,
  type AiSettings,
} from "@/lib/ai-settings";

// 全站共用的設定視窗，任何地方呼叫 openSettings() 都會打開它
export default function SettingsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const saved = useAiSettings();
  const [draft, setDraft] = useState<AiSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(
    () =>
      onOpenSettings(() => {
        // 每次打開都從已儲存的設定開始編輯
        setDraft(saved ?? DEFAULT_SETTINGS);
        setShowKey(false);
        setSavedNotice(false);
        dialogRef.current?.showModal();
      }),
    [saved],
  );

  const provider = PROVIDERS[draft.provider];
  const currentKey = draft.keys[draft.provider];
  const savedKey = saved?.keys[draft.provider] ?? "";

  function setProvider(id: ProviderId) {
    setDraft({ ...draft, provider: id });
    setShowKey(false);
  }

  function setKey(value: string) {
    setDraft({ ...draft, keys: { ...draft.keys, [draft.provider]: value } });
    setSavedNotice(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveAiSettings({
      provider: draft.provider,
      keys: { openai: draft.keys.openai.trim(), gemini: draft.keys.gemini.trim() },
    });
    dialogRef.current?.close();
  }

  function handleClear() {
    clearAiSettings();
    setDraft(DEFAULT_SETTINGS);
    setSavedNotice(true);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="settings-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-line bg-surface p-0 text-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        // 點視窗外的背景就關閉
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <form onSubmit={handleSave} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Settings</p>
            <h2 id="settings-title" className="mt-2 font-serif text-2xl font-black">
              API 金鑰設定
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="關閉"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          AI Interview 使用你自己的 API 金鑰（BYOK）。費用直接由你的帳戶計算，金鑰只存在這個瀏覽器。
        </p>

        <p className="mt-6 text-sm font-semibold">AI 服務</p>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="AI 服務">
          {PROVIDER_IDS.map((id) => {
            const selected = draft.provider === id;
            const hasKey = (saved?.keys[id] ?? "") !== "";
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setProvider(id)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  selected ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                }`}
              >
                <span className="block text-sm font-semibold">{PROVIDERS[id].label}</span>
                <span className={`mt-0.5 block font-mono text-xs ${selected ? "opacity-70" : "text-muted"}`}>
                  {PROVIDERS[id].model}
                </span>
                <span className={`mt-2 block text-xs ${selected ? "opacity-70" : "text-muted"}`}>
                  {hasKey ? "● 已設定金鑰" : "○ 尚未設定"}
                </span>
              </button>
            );
          })}
        </div>

        <label htmlFor="api-key" className="mt-6 block text-sm font-semibold">
          {provider.label} API 金鑰
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={currentKey}
            onChange={(e) => setKey(e.target.value)}
            placeholder={provider.keyPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 py-3 font-mono text-sm outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent-soft"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="shrink-0 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {showKey ? "隱藏" : "顯示"}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          {savedKey ? `目前已儲存：${maskKey(savedKey)}` : "還沒有金鑰？"}{" "}
          <a href={provider.keyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline-offset-2 hover:underline">
            前往 {provider.label} 取得金鑰 ↗
          </a>
        </p>

        <div className="mt-6 rounded-xl bg-paper p-4 text-xs leading-relaxed text-muted">
          🔒 金鑰儲存在這個瀏覽器的 localStorage，只在你練習時隨請求送到我們的伺服器轉給 {provider.label}，伺服器不會儲存或記錄它。
          在公用電腦上使用後，記得按「清除所有金鑰」。
        </div>

        {savedNotice && <p className="mt-4 text-sm text-good">已清除這個瀏覽器中的所有金鑰。</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={handleClear} className="text-sm text-muted underline-offset-2 transition-colors hover:text-accent hover:underline">
            清除所有金鑰
          </button>
          <button
            type="submit"
            disabled={currentKey.trim() === ""}
            className="rounded-full bg-accent px-6 py-2.5 font-medium text-accent-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            儲存設定
          </button>
        </div>
      </form>
    </dialog>
  );
}
