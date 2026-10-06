import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/#features", label: "功能" },
  { href: "/#how", label: "運作方式" },
  { href: "/#sample", label: "回饋範例" },
  { href: "/#faq", label: "常見問題" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/interview"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
        >
          開始練習 →
        </Link>
      </div>
    </header>
  );
}
