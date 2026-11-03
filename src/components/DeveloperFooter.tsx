import { Instagram, Skull } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/bimo___444?obrf=eTFmbjg3amhra3ky';
const HACKER_AVATAR_URL =
  'https://images.pexels.com/photos/33342192/pexels-photo-33342192.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const NEON_RED_GLOW = {
  textShadow: '0 0 6px rgba(239,68,68,0.9), 0 0 18px rgba(239,68,68,0.6)',
};

const SCANLINES = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
};

export default function DeveloperFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-red-900/60 bg-black text-green-400">
      <div className="pointer-events-none absolute inset-0" style={SCANLINES} />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-500/80">حقوق المطور</p>

        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <img
              src={HACKER_AVATAR_URL}
              alt="صورة مصغرة لشخصية هاكر"
              loading="lazy"
              className="h-20 w-20 rounded-full border-2 border-red-600 object-cover grayscale contrast-125 shadow-[0_0_24px_rgba(239,68,68,0.55)]"
            />
          </div>

          <div className="flex items-center gap-4">
            <h3 className="neon-flicker flex items-center gap-3 text-4xl font-extrabold tracking-wide text-red-500" style={NEON_RED_GLOW}>
              kais
              <Skull className="h-8 w-8 text-red-500" aria-hidden="true" />
            </h3>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="انستغرام kais"
              className="group flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/60 bg-green-500/5 text-green-400 transition-all duration-300 hover:scale-110 hover:border-green-400 hover:bg-green-400/10 hover:text-green-300 hover:shadow-[0_0_22px_rgba(74,222,128,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              <Instagram className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
            </a>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-green-300">
            للتواصل أو اقتراح تحديث للموقع، راسلني عبر انستغرام.
          </p>
        </div>

        <p className="font-mono text-xs text-green-600">© باك آداب بلس - جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
