import { BookOpen, Brain, Landmark, Languages, LayoutGrid, ScrollText, type LucideIcon } from 'lucide-react';
import { SUBJECTS, type SubjectId } from '@/data/subjects';
import type { SubjectFilter } from '@/services/lessonService';

const SUBJECT_ICONS: Record<SubjectId, LucideIcon> = {
  arabic: BookOpen,
  philosophy: Brain,
  history: Landmark,
  islamic: ScrollText,
  french: Languages,
  english: Languages,
};

interface SubjectChipsProps {
  value: SubjectFilter;
  onChange: (value: SubjectFilter) => void;
}

export default function SubjectChips({ value, onChange }: SubjectChipsProps) {
  const options: { id: SubjectFilter; label: string; Icon: LucideIcon }[] = [
    { id: 'all', label: 'الكل', Icon: LayoutGrid },
    ...SUBJECTS.map((subject) => ({ id: subject.id, label: subject.label, Icon: SUBJECT_ICONS[subject.id] })),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3" role="radiogroup" aria-label="اختر المادة">
      {options.map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? 'border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
