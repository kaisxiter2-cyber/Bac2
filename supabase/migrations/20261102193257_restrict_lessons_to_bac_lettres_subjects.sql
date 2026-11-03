/*
# Restrict lesson subjects to Bac Lettres (آداب)

1. Changes
- The `lessons.subject_id` check constraint now allows only the four literature subjects: arabic, philosophy, history, foreign.
- The `islamic` subject is no longer accepted.

2. Notes
- This migration runs after the sample lessons were cleared, so no existing rows are affected.
- Idempotent: the old constraint is dropped if present before the new one is added.
- No columns, tables, or policies are changed.
*/

ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_subject_id_check;

ALTER TABLE lessons ADD CONSTRAINT lessons_subject_id_check
  CHECK (subject_id = ANY (ARRAY['arabic'::text, 'philosophy'::text, 'history'::text, 'foreign'::text]));
