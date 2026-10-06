// 前後端共用的 AI 服務設定
export const PROVIDERS = {
  openai: {
    label: "OpenAI",
    model: "gpt-5.4-mini",
    baseURL: undefined,
    keyPlaceholder: "sk-...",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  gemini: {
    label: "Google Gemini",
    model: "gemini-3.5-flash",
    // Gemini 提供和 OpenAI 相容的 API，可以直接用 openai 套件呼叫
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    keyPlaceholder: "AIza...",
    keyUrl: "https://aistudio.google.com/apikey",
  },
} as const;

export type ProviderId = keyof typeof PROVIDERS;

export const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];

export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === "string" && value in PROVIDERS;
}

// 呼叫 /api/interview 時用來帶金鑰的 header 名稱
export const PROVIDER_HEADER = "x-ai-provider";
export const API_KEY_HEADER = "x-ai-api-key";
