import { Check, Copy, KeyRound, Loader2, Lock, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  createApiToken,
  listApiTokens,
  revokeApiToken,
  type ApiTokenRecord,
} from '@/services/adminTokenService';

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'حدث خطأ غير متوقع');

export default function AdminTokensPage() {
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);

  const [tokens, setTokens] = useState<ApiTokenRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const refreshTokens = async (code: string) => {
    setLoadError(null);
    try {
      setTokens(await listApiTokens(code));
    } catch (err) {
      setLoadError(errorMessage(err));
    }
  };

  useEffect(() => {
    if (adminCode) void refreshTokens(adminCode);
  }, [adminCode]);

  const handleUnlock = async (event: FormEvent) => {
    event.preventDefault();
    const code = codeInput.trim();
    if (!code) return;
    setCheckingCode(true);
    setCodeError(null);
    try {
      await listApiTokens(code);
      setAdminCode(code);
    } catch {
      setCodeError('كود الأدمن غير صحيح');
    } finally {
      setCheckingCode(false);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!adminCode) return;
    const name = tokenName.trim();
    if (!name) return;
    setCreating(true);
    setCreateError(null);
    setCopied(false);
    try {
      const { token } = await createApiToken(adminCode, name);
      setNewToken(token);
      setTokenName('');
      await refreshTokens(adminCode);
    } catch (err) {
      setCreateError(errorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (token: ApiTokenRecord) => {
    if (!adminCode) return;
    if (!window.confirm(`هل تريد إلغاء الرمز "${token.name}"؟ لن يعمل بعد ذلك.`)) return;
    setRevokingId(token.id);
    try {
      await revokeApiToken(adminCode, token.id);
      await refreshTokens(adminCode);
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
  };

  if (!adminCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm space-y-5 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-rose-900/5"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">لوحة الأدمن</h1>
            <p className="text-sm text-slate-500">أدخل كود الأدمن لإدارة رموز الربط.</p>
          </div>
          <input
            type="password"
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value)}
            placeholder="كود الأدمن"
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
          {codeError && <p className="text-sm font-medium text-red-600">{codeError}</p>}
          <button
            type="submit"
            disabled={checkingCode || !codeInput.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
          >
            {checkingCode && <Loader2 className="h-4 w-4 animate-spin" />}
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4 py-12 sm:px-6">
      <main className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">رموز الربط</h1>
            <p className="text-sm text-slate-500">أنشئ رمزاً لكل مساعد أو خدمة تريد ربطها بالموقع.</p>
          </div>
        </header>

        <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={tokenName}
              onChange={(event) => setTokenName(event.target.value)}
              placeholder="اسم الرمز، مثل: مساعد طيار"
              maxLength={80}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
            <button
              type="submit"
              disabled={creating || !tokenName.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              إنشاء رمز
            </button>
          </form>
          {createError && <p className="text-sm font-medium text-red-600">{createError}</p>}

          {newToken && (
            <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                انسخ الرمز الآن. لن يظهر مرة أخرى بعد إغلاق هذه الصفحة.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <code className="flex-1 break-all rounded-xl bg-white px-4 py-3 font-mono text-sm text-slate-900" dir="ltr">
                  {newToken}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:text-rose-600"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">الرموز الحالية</h2>
          {loadError && <p className="text-sm font-medium text-red-600">{loadError}</p>}
          {!loadError && tokens.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center text-sm text-slate-500">
              لا توجد رموز بعد.
            </p>
          )}
          <ul className="space-y-3">
            {tokens.map((token) => {
              const revoked = token.revoked_at !== null;
              return (
                <li
                  key={token.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-semibold text-slate-900">{token.name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(token.created_at).toLocaleDateString('ar')}
                      {' · '}
                      <span className={revoked ? 'text-red-600' : 'text-emerald-600'}>
                        {revoked ? 'ملغى' : 'فعّال'}
                      </span>
                    </p>
                  </div>
                  {!revoked && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(token)}
                      disabled={revokingId === token.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {revokingId === token.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      إلغاء
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
