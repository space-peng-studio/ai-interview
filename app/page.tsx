import Link from "next/link";

const FEATURES = [
  {
    title: "會追問的 AI 面試官",
    body: "每一題都根據你上一題的回答延伸，像真實面試一樣挖得更深，而不是一份固定題庫。",
    icon: <path d="M4 5h16v11H9l-5 4V5zM9 10h6" />,
  },
  {
    title: "任何職稱都能練",
    body: "前端工程師、產品經理、行銷企劃、護理師……輸入職稱，題目就會貼近那個角色。",
    icon: <path d="M4 7h16v12H4zM9 7V5h6v2M4 12h16" />,
  },
  {
    title: "逐題評分與精進步驟",
    body: "每題 1–10 分，告訴你哪裡好、哪裡不足，再給 3–5 個照著做就能進步的具體步驟。",
    icon: <path d="M5 19V9M12 19V5M19 19v-7" />,
  },
  {
    title: "示範回答",
    body: "用你自己的經歷改寫成更好的版本，讓你看見同一個故事可以怎麼說得更有說服力。",
    icon: <path d="M5 4h10l4 4v12H5zM9 12h6M9 16h4" />,
  },
];

const STEPS = [
  { title: "輸入職稱、選題數", body: "想應徵什麼職位就輸入什麼，再選 1 到 10 題，時間多寡由你決定。" },
  { title: "一題一題回答", body: "AI 面試官先從你的經歷切入，接著根據你的回答追問細節。" },
  { title: "拿到完整回饋", body: "總分、亮點、改進建議，加上每一題的精進步驟與示範回答。" },
];

const FAQS = [
  {
    q: "需要註冊帳號嗎？",
    a: "不需要。打開練習頁面、輸入職稱就能直接開始。",
  },
  {
    q: "我的回答會被保存嗎？",
    a: "我們的伺服器不會儲存你的回答。回答只會傳送給 OpenAI 用來產生下一題和評分，關掉頁面後紀錄就會消失。",
  },
  {
    q: "示範回答可以直接背下來用嗎？",
    a: "建議把它當成回答架構的參考。示範回答可能會補上一些你沒提到的細節，請換成你自己真實的經歷再使用。",
  },
  {
    q: "評分準確嗎？",
    a: "評分由 AI 模型依據回答的具體程度、邏輯與職位相關性給出，適合作為練習時的參考方向，而不是正式的錄取判斷。",
  },
];

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/interview"
      className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_8px_24px_-8px_var(--accent)] transition-transform hover:-translate-y-0.5"
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

// hero 右側的產品畫面示意
function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="rounded-2xl border border-line bg-surface p-5 pb-24 shadow-[0_30px_80px_-30px_rgba(22,20,15,0.35)] sm:p-6 sm:pb-24">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="rounded-full bg-paper px-2.5 py-1">前端工程師</span>
          <span className="font-mono">Q2 / 3</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-paper">
          <div className="h-1.5 w-1/3 rounded-full bg-accent" />
        </div>
        <p className="mt-5 font-serif text-lg font-semibold leading-relaxed">
          你剛提到把結帳頁載入時間從 4 秒降到 1.5 秒，當時主要做了哪些優化？怎麼判斷瓶頸在哪？
        </p>
        <div className="mt-4 rounded-xl bg-paper p-4 text-sm leading-relaxed text-muted">
          用 Lighthouse 和 Performance 面板找出 bundle 過大，做了 code splitting、圖片改 WebP，並移除沒用到的第三方套件…
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-ink" />
        </div>
      </div>

      <div className="absolute -bottom-10 -left-4 w-60 rounded-2xl border border-line bg-surface p-4 shadow-[0_20px_50px_-20px_rgba(22,20,15,0.4)] sm:-left-10 sm:w-64">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">第 2 題評分</span>
          <span className="rounded-full bg-good-soft px-2 py-0.5 font-mono text-sm font-semibold text-good">8 / 10</span>
        </div>
        <p className="mt-3 text-xs font-semibold">怎麼精進</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-xs text-muted">
          <li>補上優化前後的關鍵指標</li>
          <li>說明你做了哪些取捨</li>
        </ol>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 leading-relaxed text-muted">{body}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-28 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AI 面試官 · 不需註冊
            </span>
            <h1 className="mt-6 font-serif text-[2.6rem] font-black leading-[1.15] tracking-tight sm:text-6xl">
              下一場面試，
              <br />
              先在這裡
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">練過一次</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent-soft sm:h-4" />
              </span>
              。
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              輸入想應徵的職稱，AI 面試官會根據你的回答一路追問。結束後給你逐題評分、具體的精進步驟，還有示範回答。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaButton>免費開始模擬面試</CtaButton>
              <Link href="#how" className="px-2 py-3.5 text-sm font-medium text-muted transition-colors hover:text-ink">
                看看怎麼運作
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted">任何職稱 · 1–10 題自由選 · 約 5 分鐘完成一輪</p>
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionHeading
            eyebrow="Features"
            title="不只是出題，而是一位會帶你進步的教練"
            body="題庫背得再熟，遇到追問還是會卡住。AI Interview 模擬真實面試的節奏，並把回饋拆成你可以馬上行動的步驟。"
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-surface p-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionHeading eyebrow="How it works" title="三個步驟，完成一場模擬面試" />
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t-2 border-ink pt-6">
                <span className="font-serif text-5xl font-black text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sample feedback */}
      <section id="sample" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Sample feedback</p>
            <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">
              一個回答，三層回饋
            </h2>
            <p className="mt-4 leading-relaxed opacity-70">
              以「產品經理」的一題為例：你的回答被拿來逐句檢視，再給你步驟和示範，下一次就知道怎麼說。
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["哪裡好、哪裡不足的具體評語", "3–5 個照著做的精進步驟", "用你的經歷改寫的示範回答"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] text-accent-ink">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-surface p-6 text-ink sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="font-serif text-lg font-semibold">Q2. 你怎麼決定功能的優先順序？</p>
              <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 font-mono text-sm font-semibold text-accent">1 / 10</span>
            </div>
            <p className="mt-3 rounded-lg bg-paper px-4 py-3 text-sm text-muted">你的回答：看老闆要什麼就先做什麼。</p>
            <p className="mt-4 border-l-4 border-accent pl-3 text-sm leading-relaxed">
              回答只描述了服從指示，沒有展現優先排序的方法或取捨能力，而這正是產品經理的核心能力。
            </p>
            <p className="mt-5 text-sm font-semibold">怎麼精進</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted">
              <li>先說你的決策框架，例如 RICE 或影響度／成本矩陣。</li>
              <li>說明你如何結合數據、用戶痛點與商業目標排序。</li>
              <li>舉一個你在兩個需求衝突時做取捨的實例。</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading eyebrow="FAQ" title="常見問題" />
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {faq.q}
                  <span className="text-xl text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent px-6 py-16 text-center text-accent-ink sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <h2 className="relative font-serif text-3xl font-black sm:text-4xl">準備好了嗎？先來一場練習。</h2>
          <p className="relative mx-auto mt-4 max-w-md opacity-85">選一個職稱、回答幾個問題，五分鐘後你就知道下一場面試該加強什麼。</p>
          <Link
            href="/interview"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-transform hover:-translate-y-0.5"
          >
            開始模擬面試 →
          </Link>
        </div>
      </section>
    </main>
  );
}
