import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
        {/* 對話框 + 勾號 */}
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 5h16v11H9l-5 4V5z" />
          <path d="m9 10.5 2 2 4-4" />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-tight">
        AI Interview<span className="text-accent">.</span>
      </span>
    </Link>
  );
}
