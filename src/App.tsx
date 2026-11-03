import { useState } from 'react';
import Header from '@/components/Header';
import HeroSearch from '@/components/HeroSearch';
import LessonViewer from '@/components/LessonViewer';
import ResultsGrid from '@/components/ResultsGrid';
import SubjectChips from '@/components/SubjectChips';
import { useLessonSearch } from '@/hooks/useLessonSearch';
import type { SubjectFilter } from '@/services/lessonService';
import type { Lesson } from '@/types/lesson';

function App() {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const { results, status } = useLessonSearch(query, subjectFilter);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-rose-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-[420px] -right-32 h-[360px] w-[360px] rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-[900px] -left-32 h-[320px] w-[320px] rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative">
        <Header />

        <main className="mx-auto max-w-6xl px-4 sm:px-6">
          <section className="flex flex-col items-center gap-8 pt-12 pb-10 text-center sm:pt-20 animate-fade-up">
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
              باك آداب <span className="text-rose-600">بلس</span>
            </h1>

            <div className="w-full max-w-2xl">
              <HeroSearch value={query} onChange={setQuery} />
            </div>

            <SubjectChips value={subjectFilter} onChange={setSubjectFilter} />
          </section>

          <section className="space-y-6 pb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {query.trim() ? 'نتائج البحث' : 'الدروس والملخصات'}
              </h2>
              {status === 'ready' && results.length > 0 && (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-500 shadow-sm">
                  {results.length} نتيجة
                </span>
              )}
            </div>
            <ResultsGrid results={results} status={status} hasQuery={query.trim() !== ''} onOpen={setViewingLesson} />
          </section>
        </main>
      </div>

      {viewingLesson && <LessonViewer lesson={viewingLesson} onClose={() => setViewingLesson(null)} />}
    </div>
  );
}

export default App;
    
