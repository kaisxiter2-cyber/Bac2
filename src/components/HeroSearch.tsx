import { Search, X } from 'lucide-react';

interface HeroSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HeroSearch({ value, onChange }: HeroSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ابحث عن أي درس، ملخص، أو تمرين..."
        aria-label="ابحث عن أي درس، ملخص، أو تمرين"
        className="w-full rounded-2xl border border-slate-200 bg-white py-4 pr-14 pl-12 text-base text-slate-900 shadow-lg shadow-slate-900/5 outline-none transition-all placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 sm:py-5 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="مسح البحث"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
