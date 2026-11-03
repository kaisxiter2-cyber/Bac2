import { useEffect, useState } from 'react';
import { searchLessons, type SubjectFilter } from '@/services/lessonService';
import type { Lesson } from '@/types/lesson';

export type SearchStatus = 'loading' | 'ready' | 'error';

export function useLessonSearch(query: string, subjectFilter: SubjectFilter) {
  const [results, setResults] = useState<Lesson[]>([]);
  const [status, setStatus] = useState<SearchStatus>('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    const timer = window.setTimeout(() => {
      searchLessons(query, subjectFilter)
        .then((data) => {
          if (!active) return;
          setResults(data);
          setStatus('ready');
        })
        .catch(() => {
          if (active) setStatus('error');
        });
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, subjectFilter]);

  return { results, status };
}
