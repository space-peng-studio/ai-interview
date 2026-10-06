"use client";

import { useSyncExternalStore } from "react";
import { API_KEY_HEADER, PROVIDER_HEADER, isProviderId, type ProviderId } from "./providers";

// 使用者自己的 API 金鑰設定，只存在這個瀏覽器的 localStorage
export type AiSettings = {
  provider: ProviderId;
  keys: Record<ProviderId, string>;
};

const STORAGE_KEY = "ai-interview:settings";
const CHANGE_EVENT = "ai-interview:settings-change";
const OPEN_EVENT = "ai-interview:open-settings";

export const DEFAULT_SETTINGS: AiSettings = { provider: "openai", keys: { openai: "", gemini: "" } };

// 無痕模式或瀏覽器封鎖儲存時，退回只存在記憶體（重新整理頁面就會消失）
let memoryRaw: string | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

function parse(raw: string | null): AiSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data = JSON.parse(raw);
    return {
      provider: isProviderId(data.provider) ? data.provider : DEFAULT_SETTINGS.provider,
      keys: {
        openai: typeof data.keys?.openai === "string" ? data.keys.openai : "",
        gemini: typeof data.keys?.gemini === "string" ? data.keys.gemini : "",
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// useSyncExternalStore 需要每次拿到同一個物件，內容沒變就重用上一次的結果
let cachedRaw: string | null | undefined;
let cachedSettings: AiSettings = DEFAULT_SETTINGS;

function getSnapshot(): AiSettings {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSettings = parse(raw);
  }
  return cachedSettings;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// 伺服器端沒有 localStorage，回傳 null 代表「還不知道」
export function useAiSettings(): AiSettings | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function saveAiSettings(settings: AiSettings) {
  memoryRaw = JSON.stringify(settings);
  try {
    localStorage.setItem(STORAGE_KEY, memoryRaw);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearAiSettings() {
  memoryRaw = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function hasApiKey(settings: AiSettings | null) {
  return settings !== null && settings.keys[settings.provider].trim() !== "";
}

// 呼叫 /api/interview 時要帶的 headers
export function aiHeaders(settings: AiSettings): Record<string, string> {
  return {
    [PROVIDER_HEADER]: settings.provider,
    [API_KEY_HEADER]: settings.keys[settings.provider].trim(),
  };
}

export function openSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenSettings(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

export function maskKey(key: string) {
  const trimmed = key.trim();
  if (trimmed.length <= 8) return "•".repeat(trimmed.length);
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
}
