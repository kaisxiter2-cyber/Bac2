export const SUBJECTS = [
  { id: 'arabic', label: 'اللغة العربية وآدابها' },
  { id: 'philosophy', label: 'الفلسفة' },
  { id: 'history', label: 'التاريخ والجغرافيا' },
  { id: 'islamic', label: 'التربية الإسلامية' },
  { id: 'french', label: 'اللغة الفرنسية' },
  { id: 'english', label: 'اللغة الإنجليزية' },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]['id'];

export const getSubjectLabel = (subjectId: SubjectId) =>
  SUBJECTS.find((subject) => subject.id === subjectId)?.label ?? '';
