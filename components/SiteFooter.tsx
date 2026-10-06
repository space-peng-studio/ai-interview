import Link from "next/link";
import Logo from "./Logo";

const FOOTER_COLUMNS = [
  {
    title: "產品",
    links: [
      { href: "/interview", label: "開始練習" },
      { href: "/#features", label: "功能" },
      { href: "/#how", label: "運作方式" },
    ],
  },
  {
    title: "資源",
    links: [
      { href: "/#sample", label: "回饋範例" },
      { href: "/#faq", label: "常見問題" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            把每一次模擬面試，變成下一次真正面試的底氣。
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-ink">{column.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} AI Interview. All rights reserved.</p>
          <p>題目與評分由你選擇的 AI 模型（OpenAI / Gemini）產生，僅供練習參考。</p>
        </div>
      </div>
    </footer>
  );
}
