import { GraduationCap, KeyRound } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/25">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold text-slate-900">
            باك آداب <span className="text-rose-600">بلس</span>
          </span>
        </a>
        <a
          href="/admin"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <KeyRound className="h-4 w-4" />
          <span>الأدمن</span>
        </a>
      </div>
    </header>
  );
}
