import OpenAI from "openai";
import { API_KEY_HEADER, PROVIDER_HEADER, PROVIDERS, isProviderId } from "@/lib/providers";

const MAX_API_KEY_LENGTH = 300;
const REQUEST_TIMEOUT_MS = 90_000;
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 10;
const MAX_JOB_TITLE_LENGTH = 50;
const MAX_ANSWER_LENGTH = 2000;
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

type QA = { question: string; answer: string };

// 出題時要求 OpenAI 回傳的格式
const QUESTION_SCHEMA = {
  type: "object",
  properties: {
    question: { type: "string", description: "下一道面試題目" },
  },
  required: ["question"],
  additionalProperties: false,
};

// 評分時要求 OpenAI 回傳的格式
const EVALUATION_SCHEMA = {
  type: "object",
  properties: {
    overallScore: { type: "integer", description: "總分，0-100" },
    summary: { type: "string", description: "用 2-3 句話總結整體表現" },
    answers: {
      type: "array",
      description: "依題目順序，對每一題回答的評語",
      items: {
        type: "object",
        properties: {
          score: { type: "integer", description: "這一題的分數，1-10" },
          feedback: { type: "string", description: "這一題回答的優缺點，具體指出哪裡好、哪裡不足" },
          improvementSteps: {
            type: "array",
            items: { type: "string" },
            description: "3-5 個具體、可執行的精進步驟，例如要補充什麼資訊、用什麼回答架構、練習什麼",
          },
          sampleAnswer: {
            type: "string",
            description: "根據應徵者原本的經歷改寫成的示範回答，展示更好的回答方式，不要捏造過多新經歷",
          },
        },
        required: ["score", "feedback", "improvementSteps", "sampleAnswer"],
        additionalProperties: false,
      },
    },
    strengths: { type: "array", items: { type: "string" }, description: "2-3 個表現好的地方" },
    improvements: { type: "array", items: { type: "string" }, description: "2-3 個具體的改進建議" },
  },
  required: ["overallScore", "summary", "answers", "strengths", "improvements"],
  additionalProperties: false,
};

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status, headers: JSON_HEADERS });
}

// 把前面的問答整理成文字，讓 AI 看得到上下文
function formatHistory(history: QA[]) {
  return history
    .map((qa, i) => `第 ${i + 1} 題：${qa.question}\n應徵者回答：${qa.answer}`)
    .join("\n\n");
}

function parseHistory(value: unknown, totalQuestions: number): QA[] | null {
  if (!Array.isArray(value) || value.length > totalQuestions) return null;
  const history: QA[] = [];
  for (const item of value) {
    const question = typeof item?.question === "string" ? item.question.trim() : "";
    const answer = typeof item?.answer === "string" ? item.answer.trim() : "";
    if (question === "" || answer === "" || answer.length > MAX_ANSWER_LENGTH) return null;
    history.push({ question, answer });
  }
  return history;
}

// 把 AI 服務回傳的錯誤轉成給使用者看的訊息
// 不直接轉傳原始錯誤訊息，因為裡面可能包含部分金鑰
function providerErrorResponse(error: unknown) {
  if (error instanceof OpenAI.APIError) {
    const isBadKey =
      error.status === 401 || error.status === 403 || (error.status === 400 && /api key/i.test(error.message));
    if (isBadKey) return errorResponse("API 金鑰無效，請到「設定」重新確認金鑰", 401);
    if (error.status === 429) return errorResponse("API 額度不足或請求太頻繁，請檢查帳戶額度或稍後再試", 429);
    if (error.status === 404) return errorResponse("你的金鑰無法使用這個模型，請確認帳戶權限", 400);
    if (error.status !== undefined && error.status >= 500) {
      return errorResponse("AI 服務目前忙碌中，請稍後再試，或到「設定」換另一個 AI 服務", 503);
    }
  }
  return errorResponse("AI 面試官暫時無法回應，請稍後再試", 502);
}

// 用法：POST /api/interview
// headers：x-ai-provider 為 "openai" 或 "gemini"，x-ai-api-key 為使用者自己的金鑰
// body：{ "jobTitle": "前端工程師", "totalQuestions": 3, "history": [{ "question": "...", "answer": "..." }] }
// 回答未滿 totalQuestions 題時回傳 { type: "question", question }，滿了就回傳 { type: "evaluation", ... }
export async function POST(request: Request) {
  const provider = request.headers.get(PROVIDER_HEADER);
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim() ?? "";
  const body = await request.json().catch(() => ({}));
  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";
  const totalQuestions = body.totalQuestions;

  if (!isProviderId(provider)) {
    return errorResponse("請選擇 AI 服務（OpenAI 或 Gemini）", 400);
  }
  if (apiKey === "" || apiKey.length > MAX_API_KEY_LENGTH || /\s/.test(apiKey)) {
    return errorResponse("請先到「設定」輸入你的 API 金鑰", 401);
  }
  if (jobTitle === "") {
    return errorResponse("請輸入職稱", 400);
  }
  if (jobTitle.length > MAX_JOB_TITLE_LENGTH) {
    return errorResponse(`職稱不能超過 ${MAX_JOB_TITLE_LENGTH} 個字`, 400);
  }
  if (!Number.isInteger(totalQuestions) || totalQuestions < MIN_QUESTIONS || totalQuestions > MAX_QUESTIONS) {
    return errorResponse(`題數必須是 ${MIN_QUESTIONS} 到 ${MAX_QUESTIONS} 之間的整數`, 400);
  }

  const history = parseHistory(body.history ?? [], totalQuestions);
  if (history === null) {
    return errorResponse(`回答格式錯誤，每題回答不能是空的或超過 ${MAX_ANSWER_LENGTH} 個字`, 400);
  }

  // 使用者的金鑰只用在這一次請求，不會儲存也不會印到 log
  const { model, baseURL } = PROVIDERS[provider];
  // 服務忙碌時 SDK 預設會重試 2 次，等太久，這裡只重試 1 次
  const client = new OpenAI({ apiKey, baseURL, maxRetries: 1, timeout: REQUEST_TIMEOUT_MS });
  const isFinished = history.length === totalQuestions;

  const instructions = isFinished
    ? `你是一位資深的「${jobTitle}」面試官。根據下面的面試問答，客觀地評分。每一題除了指出優缺點，還要像教練一樣給出具體、可以照著做的精進步驟，並附上一段示範回答。請用繁體中文回答。`
    : `你是一位資深的「${jobTitle}」面試官，總共會問 ${totalQuestions} 題。` +
      "第一題請從應徵者的經歷或動機切入；之後的題目要根據應徵者前面的回答追問或延伸，讓題目前後相關。" +
      "一次只問一題，題目要簡潔明確。請用繁體中文回答。";
  const input = isFinished
    ? formatHistory(history)
    : history.length === 0
      ? "請問第 1 題。"
      : `${formatHistory(history)}\n\n請根據以上回答，問第 ${history.length + 1} 題。`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: input },
      ],
      response_format: {
        type: "json_schema",
        json_schema: isFinished
          ? { name: "interview_evaluation", schema: EVALUATION_SCHEMA, strict: true }
          : { name: "interview_question", schema: QUESTION_SCHEMA, strict: true },
      },
    });

    const content = completion.choices[0]?.message.content;
    if (!content) throw new Error("AI 沒有回傳內容");
    const data = { type: isFinished ? "evaluation" : "question", ...JSON.parse(content) };

    // 在跑 npm run dev 的終端機印出請求網址和回傳資料（不含金鑰）
    console.log(`[interview] ${request.method} ${request.url} (${provider})`, JSON.stringify(data, null, 2));

    return Response.json(data, { headers: JSON_HEADERS });
  } catch (error) {
    const status = error instanceof OpenAI.APIError ? error.status : undefined;
    console.error(`[interview] ${provider} 呼叫失敗`, status ?? (error instanceof Error ? error.message : error));
    return providerErrorResponse(error);
  }
}
