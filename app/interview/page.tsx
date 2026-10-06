"use client";

import { useState } from "react";

const QUESTION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const JOB_SUGGESTIONS = ["前端工程師", "產品經理", "UI/UX 設計師", "行銷企劃", "資料分析師"];

type QA = { question: string; answer: string };

type Evaluation = {
  overallScore: number;
  summary: string;
  answers: { score: number; feedback: string; improvementSteps: string[]; sampleAnswer: string }[];
  strengths: string[];
  improvements: string[];
};

type Stage = "start" | "interview" | "result";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-shadow placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent-soft";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink shadow-[0_8px_24px_-10px_var(--accent)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none";

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />;
}

// 總分的圓環
function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--line)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-serif text-4xl font-black">{score}</p>
          <p className="text-xs text-muted">/ 100</p>
        </div>
      </div>
    </div>
  );
}

function scoreBadgeClass(score: number) {
  if (score >= 8) return "bg-good-soft text-good";
  if (score >= 5) return "bg-warn-soft text-warn";
  return "bg-accent-soft text-accent";
}

export default function InterviewPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [jobTitle, setJobTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [history, setHistory] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 把職稱和目前的問答送給 API，拿回下一題或最後的評分
  async function callInterview(nextHistory: QA[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, totalQuestions, history: nextHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤，請稍後再試");

      setHistory(nextHistory);
      setAnswer("");
      if (data.type === "evaluation") {
        setEvaluation(data);
        setStage("result");
      } else {
        setCurrentQuestion(data.question);
        setStage("interview");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (jobTitle.trim() === "") return;
    callInterview([]);
  }

  function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (answer.trim() === "") return;
    callInterview([...history, { question: currentQuestion, answer: answer.trim() }]);
  }

  function handleRestart() {
    setStage("start");
    setHistory([]);
    setCurrentQuestion("");
    setAnswer("");
    setEvaluation(null);
    setError("");
  }

  const isLastQuestion = history.length + 1 === totalQuestions;

  return (
    <main className="relative flex-1">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-96 opacity-50" />
      <div className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {stage === "start" && (
          <div className="animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Mock interview</p>
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight sm:text-5xl">這次想練習哪個職位？</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              AI 面試官會一題一題問你，並根據你的回答追問。全部答完後，你會拿到總分、逐題評分、精進步驟與示範回答。
            </p>

            <form onSubmit={handleStart} className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(22,20,15,0.35)] sm:p-8">
              <label htmlFor="jobTitle" className="text-sm font-semibold">
                職稱
              </label>
              <input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                maxLength={50}
                placeholder="例如：前端工程師"
                className={`mt-2 ${inputClass}`}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {JOB_SUGGESTIONS.map((job) => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => setJobTitle(job)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      jobTitle === job ? "border-accent bg-accent-soft text-accent" : "border-line text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {job}
                  </button>
                ))}
              </div>

              <p className="mt-8 text-sm font-semibold">題數</p>
              <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-10" role="radiogroup" aria-label="題數">
                {QUESTION_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={totalQuestions === n}
                    onClick={() => setTotalQuestions(n)}
                    className={`rounded-xl border py-2.5 font-mono text-sm transition-colors ${
                      totalQuestions === n ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">每題大約 1–2 分鐘，{totalQuestions} 題約需 {totalQuestions * 2} 分鐘。</p>

              <button type="submit" disabled={loading || jobTitle.trim() === ""} className={`mt-8 w-full ${primaryButtonClass}`}>
                {loading ? (
                  <>
                    <Spinner />
                    面試官準備題目中…
                  </>
                ) : (
                  "開始面試 →"
                )}
              </button>
            </form>
          </div>
        )}

        {stage === "interview" && (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="rounded-full border border-line bg-surface px-3 py-1 text-muted">{jobTitle}</span>
              <span className="font-mono text-muted">
                Q{history.length + 1} / {totalQuestions}
              </span>
            </div>
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < history.length ? "bg-ink" : i === history.length ? "bg-accent" : "bg-line"
                  }`}
                />
              ))}
            </div>

            <form key={history.length} onSubmit={handleAnswer} className="animate-rise mt-8 rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(22,20,15,0.35)] sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Question {history.length + 1}</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-relaxed">{currentQuestion}</h2>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={2000}
                rows={7}
                placeholder="用你自己的經歷回答，越具體越好…"
                className={`mt-6 resize-y leading-relaxed ${inputClass}`}
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-muted">{answer.length} / 2000</span>
                <button type="submit" disabled={loading || answer.trim() === ""} className={primaryButtonClass}>
                  {loading ? (
                    <>
                      <Spinner />
                      {isLastQuestion ? "評分中…" : "產生下一題…"}
                    </>
                  ) : isLastQuestion ? (
                    "送出並查看評分"
                  ) : (
                    "送出回答 →"
                  )}
                </button>
              </div>
            </form>

            {history.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-semibold text-muted">已回答</p>
                <ol className="mt-3 space-y-3">
                  {history.map((qa, i) => (
                    <li key={i} className="rounded-xl border border-line bg-surface/60 p-4 text-sm">
                      <p className="font-medium">
                        <span className="mr-2 font-mono text-muted">Q{i + 1}</span>
                        {qa.question}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-muted">{qa.answer}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {stage === "result" && evaluation && (
          <div className="animate-rise space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Your report</p>
              <h1 className="mt-3 font-serif text-4xl font-black leading-tight">{jobTitle} 面試報告</h1>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
              <ScoreRing score={evaluation.overallScore} />
              <p className="leading-relaxed">{evaluation.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-good-soft p-6">
                <h2 className="font-semibold text-good">表現亮點</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-good">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-warn-soft p-6">
                <h2 className="font-semibold text-warn">改進建議</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-warn">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-black">逐題回饋</h2>
              <ol className="mt-4 space-y-5">
                {history.map((qa, i) => {
                  const result = evaluation.answers[i];
                  return (
                    <li key={i} className="rounded-2xl border border-line bg-surface p-6">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-serif text-lg font-semibold leading-relaxed">
                          <span className="mr-2 font-mono text-sm text-muted">Q{i + 1}</span>
                          {qa.question}
                        </p>
                        {result && (
                          <span className={`shrink-0 rounded-full px-3 py-1 font-mono text-sm font-semibold ${scoreBadgeClass(result.score)}`}>
                            {result.score} / 10
                          </span>
                        )}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap rounded-lg bg-paper px-4 py-3 text-sm text-muted">你的回答：{qa.answer}</p>
                      {result && (
                        <>
                          <p className="mt-4 border-l-4 border-accent pl-3 text-sm leading-relaxed">{result.feedback}</p>
                          <div className="mt-5">
                            <h3 className="text-sm font-semibold">怎麼精進</h3>
                            <ol className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                              {result.improvementSteps.map((step, j) => (
                                <li key={j} className="flex gap-3">
                                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">{j + 1}</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <details className="group mt-5 rounded-xl border border-line bg-paper p-4 text-sm">
                            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-accent">
                              看示範回答
                              <span className="text-lg transition-transform group-open:rotate-45">+</span>
                            </summary>
                            <p className="mt-3 whitespace-pre-wrap leading-relaxed">{result.sampleAnswer}</p>
                            <p className="mt-3 text-xs text-muted">示範回答僅供參考架構，請換成你自己的真實經歷。</p>
                          </details>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <button onClick={handleRestart} className={`w-full ${primaryButtonClass}`}>
              再練習一次
            </button>
          </div>
        )}

        {error && <p className="mt-6 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{error}</p>}
      </div>
    </main>
  );
}
