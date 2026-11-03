/*
# Expand lesson subjects to all Bac Lettres (آداب) subjects

1. Changes
- The `lessons.subject_id` check constraint now allows six subjects:
  arabic (اللغة العربية وآدابها), philosophy (الفلسفة), history (التاريخ والجغرافيا),
  islamic (التربية الإسلامية), french (اللغة الفرنسية), english (اللغة الإنجليزية).
- The former combined `foreign` subject is replaced by separate `french` and `english` subjects.

2. Notes
- No lesson rows exist at this point (sample lessons were cleared earlier), so no data is affected.
- Idempotent: the existing constraint is dropped if present before the new one is added.
- No columns, tables, or policies are changed.
*/

ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_subject_id_check;

ALTER TABLE lessons ADD CONSTRAINT lessons_subject_id_check
  CHECK (subject_id = ANY (ARRAY['arabic'::text, 'philosophy'::text, 'history'::text, 'islamic'::text, 'french'::text, 'english'::text]));
