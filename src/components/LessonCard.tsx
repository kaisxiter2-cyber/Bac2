import { FileText } from 'lucide-react';
import { getSubjectLabel } from '@/data/subjects';
import type { Lesson } from '@/types/lesson';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  onOpen: (lesson: Lesson) => void;
}

export default function LessonCard({ lesson, index, onOpen }: LessonCardProps) {
  return (
    <article
      className="group flex flex-col justify-between gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-900/5 animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{getSubjectLabel(lesson.subjectId)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{lesson.track}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-slate-900">{lesson.title}</h3>
        <p className="text-sm text-slate-500">{lesson.kind}</p>
      </div>

      <button
        type="button"
        onClick={() => onOpen(lesson)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
      >
        <FileText className="h-4 w-4" />
        عرض الملف
      </button>
    </article>
  );
}
