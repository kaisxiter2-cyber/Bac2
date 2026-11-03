import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Api-Key, X-Admin-Code",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SUBJECTS = ["arabic", "philosophy", "history", "islamic", "french", "english"];
const ADMIN_KEY_NAME = "site assistant";
const KINDS = ["درس", "ملخص", "تمرين"];
const BUCKET = "lesson-files";
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

interface LessonInput {
  title: string;
  subject_id: string;
  track: string;
  kind: string;
  keywords: string[];
  sections: { heading: string; body: string }[];
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function isAuthorized(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!key) return false;
  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", await sha256Hex(key))
    .is("revoked_at", null)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

async function isAdmin(req: Request) {
  const code = req.headers.get("x-admin-code");
  if (!code) return false;
  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", await sha256Hex(code))
    .eq("name", ADMIN_KEY_NAME)
    .is("revoked_at", null)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

async function listTokens() {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, created_at, revoked_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return json({ tokens: data });
}

async function createToken(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (name.length < 1 || name.length > 80) return json({ error: "name must be 1-80 characters" }, 400);

  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = `bp_${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;

  const { data, error } = await supabase
    .from("api_keys")
    .insert({ name, key_hash: await sha256Hex(token) })
    .select("id, name, created_at")
    .single();
  if (error) throw error;

  return json({ token, record: data }, 201);
}

async function revokeToken(id: string) {
  const { data, error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .is("revoked_at", null)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return json({ error: "Token not found or already revoked" }, 404);
  return json({ revoked: id });
}

function validateLesson(body: unknown): { ok: true; value: LessonInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Body must be a JSON object" };
  const input = body as Record<string, unknown>;

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (title.length < 1 || title.length > 200) return { ok: false, error: "title must be 1-200 characters" };

  if (typeof input.subject_id !== "string" || !SUBJECTS.includes(input.subject_id)) {
    return { ok: false, error: `subject_id must be one of: ${SUBJECTS.join(", ")}` };
  }

  if (typeof input.kind !== "string" || !KINDS.includes(input.kind)) {
    return { ok: false, error: `kind must be one of: ${KINDS.join(", ")}` };
  }

  const track = typeof input.track === "string" && input.track.trim() ? input.track.trim() : "آداب وفلسفة";

  const keywords = input.keywords ?? [];
  if (!Array.isArray(keywords) || keywords.length > 30 || !keywords.every((k) => typeof k === "string" && k.length <= 60)) {
    return { ok: false, error: "keywords must be a list of up to 30 short strings" };
  }

  const sections = input.sections ?? [];
  if (
    !Array.isArray(sections) ||
    sections.length > 20 ||
    !sections.every(
      (s) =>
        s && typeof s === "object" &&
        typeof (s as { heading?: unknown }).heading === "string" &&
        typeof (s as { body?: unknown }).body === "string" &&
        (s as { heading: string }).heading.length <= 120 &&
        (s as { body: string }).body.length <= 4000,
    )
  ) {
    return { ok: false, error: "sections must be a list of up to 20 items with heading and body text" };
  }

  return {
    ok: true,
    value: {
      title,
      subject_id: input.subject_id,
      track,
      kind: input.kind,
      keywords: keywords as string[],
      sections: sections as { heading: string; body: string }[],
    },
  };
}

async function listLessons() {
  const { data, error } = await supabase.from("lessons").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return json({ lessons: data });
}

async function createLesson(req: Request) {
  const parsed = validateLesson(await req.json().catch(() => null));
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const { data, error } = await supabase.from("lessons").insert(parsed.value).select("*").single();
  if (error) throw error;
  return json({ lesson: data }, 201);
}

async function getLessonRow(id: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, file_path")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function uploadLessonFile(id: string, req: Request) {
  const lesson = await getLessonRow(id);
  if (!lesson) return json({ error: "Lesson not found" }, 404);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "Send the file in a form field named 'file'" }, 400);
  if (file.size === 0 || file.size > MAX_FILE_BYTES) return json({ error: "File must be between 1 byte and 20 MB" }, 400);
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return json({ error: "Allowed file types: PDF, Word (.doc/.docx), PNG, JPG" }, 400);
  }

  const extension = (file.name.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const storagePath = `${id}/${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("lessons")
    .update({ file_path: storagePath, file_name: file.name })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;

  if (lesson.file_path) {
    await supabase.storage.from(BUCKET).remove([lesson.file_path]);
  }

  return json({ lesson: data });
}

async function deleteLesson(id: string) {
  const lesson = await getLessonRow(id);
  if (!lesson) return json({ error: "Lesson not found" }, 404);

  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;

  if (lesson.file_path) {
    await supabase.storage.from(BUCKET).remove([lesson.file_path]);
  }

  return json({ deleted: id });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const segments = new URL(req.url).pathname.split("/").filter(Boolean);

    if (segments.includes("tokens")) {
      if (!(await isAdmin(req))) return json({ error: "Invalid admin code" }, 401);
      const tokenIndex = segments.indexOf("tokens");
      const tokenId = segments[tokenIndex + 1];
      if (!tokenId) {
        if (req.method === "GET") return await listTokens();
        if (req.method === "POST") return await createToken(req);
      } else if (req.method === "DELETE") {
        return await revokeToken(tokenId);
      }
      return json({ error: "Method or route not supported" }, 405);
    }

    if (!(await isAuthorized(req))) {
      return json({ error: "Invalid or missing API key" }, 401);
    }

    const start = segments.indexOf("lessons");
    const [id, action] = start >= 0 ? segments.slice(start + 1) : [];

    if (start < 0) return json({ error: "Not found" }, 404);

    if (!id) {
      if (req.method === "GET") return await listLessons();
      if (req.method === "POST") return await createLesson(req);
    } else if (!action) {
      if (req.method === "DELETE") return await deleteLesson(id);
    } else if (action === "file" && req.method === "POST") {
      return await uploadLessonFile(id, req);
    }

    return json({ error: "Method or route not supported" }, 405);
  } catch (err) {
    console.error("site-admin error", err);
    return json({ error: "Something went wrong on the server" }, 500);
  }
});
