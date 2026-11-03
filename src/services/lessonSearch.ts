import { getSubjectLabel } from '@/data/subjects';
import type { Lesson } from '@/types/lesson';

const normalizeText = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase();

// Strips the "ال" article and common plural endings so "الدوال" matches "دالة" and "المتتاليات" matches "المتتالية".
const stem = (word: string) => {
  let result = word;
  if (result.length > 3 && result.startsWith('ال')) result = result.slice(2);
  if (result.length > 4 && /(ات|ون|ين)$/.test(result)) result = result.slice(0, -2);
  return result;
};

const tokenize = (text: string) =>
  normalizeText(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map(stem);

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

function wordMatchScore(queryWord: string, fieldWords: string[]) {
  let best = 0;
  for (const word of fieldWords) {
    if (word === queryWord) return 1;
    if (queryWord.length >= 2 && word.startsWith(queryWord)) {
      best = Math.max(best, 0.8);
    } else if (queryWord.length >= 4 && Math.abs(word.length - queryWord.length) <= 2) {
      const allowedTypos = queryWord.length >= 7 ? 2 : 1;
      if (editDistance(word, queryWord) <= allowedTypos) best = Math.max(best, 0.5);
    }
  }
  return best;
}

function indexLesson(lesson: Lesson) {
  return [
    { weight: 6, words: tokenize(lesson.title) },
    { weight: 5, words: lesson.keywords.flatMap(tokenize) },
    { weight: 3, words: tokenize(`${lesson.track} ${getSubjectLabel(lesson.subjectId)} ${lesson.kind}`) },
    { weight: 3, words: lesson.sections.flatMap((section) => tokenize(section.heading)) },
    { weight: 1, words: lesson.sections.flatMap((section) => tokenize(section.body)) },
  ];
}

export function rankLessons(lessons: Lesson[], query: string): Lesson[] {
  const queryWords = tokenize(query);
  if (queryWords.length === 0) return lessons;

  return lessons
    .map((lesson) => {
      const fields = indexLesson(lesson);
      const score = queryWords.reduce((total, queryWord) => {
        const best = Math.max(...fields.map((field) => wordMatchScore(queryWord, field.words) * field.weight));
        return total + best;
      }, 0);
      return { lesson, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ lesson }) => lesson);
}
