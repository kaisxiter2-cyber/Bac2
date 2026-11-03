import type { SubjectId } from '@/data/subjects';

export type LessonKind = 'درس' | 'ملخص' | 'تمرين';

export interface LessonSection {
  heading: string;
  body: string;
}

export interface Lesson {
  id: string;
  title: string;
  subjectId: SubjectId;
  track: string;
  kind: LessonKind;
  keywords: string[];
  sections: LessonSection[];
  fileName: string | null;
  fileUrl: string | null;
}
