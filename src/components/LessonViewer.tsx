import Modal from '@/components/Modal';
import { getSubjectLabel } from '@/data/subjects';
import { Download } from 'lucide-react';
import type { Lesson } from '@/types/lesson';

interface LessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function LessonViewer({ lesson, onClose }: LessonViewerProps) {
  return (
    <Modal title={lesson.title} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{getSubjectLabel(lesson.subjectId)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{lesson.track}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{lesson.kind}</span>
        </div>

        {lesson.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">{section.heading}</h3>
            <p className="leading-relaxed text-slate-700">{section.body}</p>
          </section>
        ))}

        {lesson.fileUrl && (
          <a
            href={lesson.fileUrl}
            download={lesson.fileName ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-600"
          >
            <Download className="h-4 w-4" />
            تحميل الملف
          </a>
        )}
      </div>
    </Modal>
  );
}
