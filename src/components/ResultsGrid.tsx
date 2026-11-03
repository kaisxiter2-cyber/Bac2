import { AlertCircle, Loader2, SearchX, Sparkles } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import type { SearchStatus } from '@/hooks/useLessonSearch';
import type { Lesson } from '@/types/lesson';

interface ResultsGridProps {
  results: Lesson[];
  status: SearchStatus;
  hasQuery: boolean;
  onOpen: (lesson: Lesson) => void;
}

export default function ResultsGrid({ results, status, hasQuery, onOpen }: ResultsGridProps) {
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
        <span className="text-sm font-medium">جاري البحث...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-100 bg-red-50/60 px-6 py-12 text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="font-semibold text-slate-900">تعذر تحميل النتائج</p>
        <p className="text-sm text-slate-600">حاول مرة أخرى بعد قليل.</p>
      </div>
    );
  }

  if (results.length === 0) {
    if (hasQuery) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
          <SearchX className="h-8 w-8 text-slate-400" />
          <p className="font-semibold text-slate-900">لا توجد نتائج مطابقة</p>
          <p className="text-sm text-slate-500">جرب كلمة أخرى، أو اختر مادة مختلفة.</p>
        </div>
      );
    }

    return (
      <div
        id="lessons-feed"
        className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-rose-200 bg-white/60 px-6 py-16 text-center"
      >
        <Sparkles className="h-8 w-8 text-rose-400" />
        <p className="font-semibold text-slate-900">الدروس قيد الإضافة</p>
        <p className="max-w-sm text-sm text-slate-500">
          ستظهر هنا الدروس والملخصات والتمارين فور إضافتها إلى الموقع، ويمكنك البحث عنها من الشريط أعلاه.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((lesson, index) => (
        <LessonCard key={lesson.id} lesson={lesson} index={index} onOpen={onOpen} />
      ))}
    </div>
  );
}
