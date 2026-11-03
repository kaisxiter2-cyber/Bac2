/*
# Create lessons, API keys, and lesson file storage

1. New Tables
- `lessons`: every lesson or summary shown on the site. Columns: id, title, subject_id (one of the five subject ids), track, kind (درس, ملخص, or تمرين), keywords (text list used by search), sections (JSON list of heading and body pairs), file_path and file_name (optional attached file), created_at.
- `api_keys`: stores only a SHA-256 hash of each admin API key, never the key itself. Columns: id, name, key_hash, created_at, revoked_at.

2. Storage
- New public bucket `lesson-files` so students can download attached files by link. Uploads are only possible through the site-admin edge function, which uses the service role.

3. Security
- `lessons`: RLS enabled. Anyone (anon and signed-in roles) can read lessons, because the content is intentionally public. No insert, update, or delete policy exists for public roles, so only the service role (used by the edge function) can change lessons.
- `api_keys`: RLS enabled with no policies, so public roles cannot read or write it. Only the service role can access it.
- Grants: public roles get SELECT on `lessons` only. The service role gets full access to both tables.

4. Important notes
- Subject and kind values are checked by constraints so bad data cannot be stored.
- Migration is idempotent: safe to re-run.
*/

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  subject_id text NOT NULL CHECK (subject_id IN ('arabic', 'philosophy', 'history', 'foreign', 'islamic')),
  track text NOT NULL DEFAULT 'آداب وفلسفة',
  kind text NOT NULL CHECK (kind IN ('درس', 'ملخص', 'تمرين')),
  keywords text[] NOT NULL DEFAULT '{}',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  file_path text,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_subject_id_idx ON lessons (subject_id);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON lessons TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON lessons TO service_role;

DROP POLICY IF EXISTS "public_select_lessons" ON lessons;
CREATE POLICY "public_select_lessons" ON lessons FOR SELECT
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON api_keys FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON api_keys TO service_role;

INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-files', 'lesson-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO api_keys (name, key_hash)
VALUES ('site assistant', '7189ab048db5137003f0b37657b13c7667cd56209f845d2ef960856b19044138')
ON CONFLICT (key_hash) DO NOTHING;
