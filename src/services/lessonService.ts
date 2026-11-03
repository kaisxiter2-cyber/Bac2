import { supabase } from '@/lib/supabase';
import { rankLessons } from '@/services/lessonSearch';
import type { SubjectId } from '@/data/subjects';
import type { Lesson, LessonKind, LessonSection } from '@/types/lesson';

export type SubjectFilter = SubjectId | 'all';

interface LessonRow {
  id: string;
  title: string;
  subject_id: SubjectId;
  track: string;
  kind: LessonKind;
  keywords: string[];
  sections: LessonSection[];
  file_path: string | null;
  file_name: string | null;
}

function toLesson(row: LessonRow): Lesson {
  const fileUrl = row.file_path
    ? supabase.storage.from('lesson-files').getPublicUrl(row.file_path).data.publicUrl
    : null;

  return {
    id: row.id,
    title: row.title,
    subjectId: row.subject_id,
    track: row.track,
    kind: row.kind,
    keywords: row.keywords,
    sections: row.sections,
    fileName: row.file_name,
    fileUrl,
  };
}

export async function searchLessons(query: string, subjectFilter: SubjectFilter): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, subject_id, track, kind, keywords, sections, file_path, file_name')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const lessons = (data as LessonRow[]).map(toLesson);
  const inSubject = subjectFilter === 'all'
    ? lessons
    : lessons.filter((lesson) => lesson.subjectId === subjectFilter);

  return rankLessons(inSubject, query);
}
