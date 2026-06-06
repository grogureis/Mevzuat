"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Markdown } from "./Markdown";
import { BELGELER, belgeBul } from "@/lib/belgeler";

const ORNEKLER = [
  { etiket: "Kabul", soru: "Adli vaka geldi ve hasta kimliğini ibraz edemiyor, ne yapmalıyım?" },
  { etiket: "Sevk", soru: "Stabil olmayan hastayı başka hastaneye sevk edebilir miyim?" },
  { etiket: "Süre", soru: "Acil serviste hasta kaç saat takip edilebilir, sonra ne olur?" },
  { etiket: "Nöbet", soru: "İcap nöbetçisi uzmanı çağırma usulü nedir?" },
];

const KAYNAK_RE = /<<\s*KAYNAK\s*:([^>]*)>>/i;

/** Mesajın tüm metnini birleştirir. */
function mesajMetni(m: UIMessage): string {
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");
}

export default function Sayfa() {
  const [girdi, setGirdi] = useState("");
  const [sheetAcik, setSheetAcik] = useState(false);
  const altRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages, regenerate } =
    useChat({
      transport: new DefaultChatTransport({ api: "/api/sor" }),
    });

  const calisiyor = status === "submitted" || status === "streaming";
  const sonMesaj = messages[messages.length - 1];
  // Cevap hiç gelmedi (bağlantı koptu): son mesaj kullanıcıdan ve iş bitti
  const cevapGelmedi = !calisiyor && sonMesaj?.role === "user";

  useEffect(() => {
    altRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function gonder(metin: string) {
    const temiz = metin.trim();
    if (!temiz || calisiyor) return;
    sendMessage({ text: temiz });
    setGirdi("");
  }

  return (
    <div className="flex min-h-dvh items-stretch justify-center sm:items-center sm:py-6">
      <div className="relative flex h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-white sm:h-[880px] sm:max-h-[94vh] sm:rounded-[2.2rem] sm:border sm:border-slate-200 sm:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)]">
        {/* ÜST BAŞLIK */}
        <header className="relative z-10 bg-white">
          <div className="flex items-center gap-3 px-4 pb-2.5 pt-4">
            <Amblem />
            <div className="flex-1">
              <h1 className="font-[family-name:var(--font-baslik)] text-[22px] font-extrabold leading-none tracking-tight text-slate-900">
                Mevzuat
              </h1>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-acil">
                Acil Servis Rehberi
              </p>
            </div>
            <button
              onClick={() => setSheetAcik(true)}
              title="Yüklü mevzuat"
              className="rounded-xl border border-slate-200 px-2.5 py-2 text-slate-500 transition hover:border-turkuaz hover:text-turkuaz"
            >
              <IkonKitap />
            </button>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                title="Yeni sohbet"
                className="rounded-xl border border-slate-200 px-2.5 py-2 text-slate-500 transition hover:border-acil hover:text-acil"
              >
                <IkonYeni />
              </button>
            )}
          </div>
          <div className="ekg-band" />
        </header>

        {/* MESAJLAR */}
        <main className="kaydirma flex-1 overflow-y-auto bg-slate-50/60 px-4 py-4">
          {messages.length === 0 ? (
            <Karsilama onSor={gonder} />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <Balon key={m.id} mesaj={m} />
              ))}
              {calisiyor &&
                messages[messages.length - 1]?.role === "user" && <Yaziyor />}
            </div>
          )}

          {(error || cevapGelmedi) && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-acil/30 bg-red-50 px-4 py-3 text-sm text-acil-koyu">
              <span>
                {error
                  ? "Cevap üretilemedi."
                  : "Cevap gelmedi (bağlantı kesilmiş olabilir)."}
              </span>
              <button
                onClick={() => regenerate()}
                className="shrink-0 rounded-lg bg-acil px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-acil-koyu"
              >
                Tekrar dene
              </button>
            </div>
          )}
          <div ref={altRef} />
        </main>

        {/* GİRİŞ */}
        <footer className="border-t border-slate-200 bg-white px-3 pb-3 pt-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              gonder(girdi);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={girdi}
              onChange={(e) => setGirdi(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  gonder(girdi);
                }
              }}
              rows={1}
              placeholder="Sorunuzu yazın…"
              className="max-h-32 flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-acil focus:bg-white focus:outline-none focus:ring-2 focus:ring-acil/15"
            />
            <button
              type="submit"
              disabled={calisiyor || !girdi.trim()}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-acil text-white shadow-sm transition hover:bg-acil-koyu disabled:cursor-not-allowed disabled:opacity-35"
              title="Sor"
            >
              <IkonGonder />
            </button>
          </form>
          <p className="mt-2 px-1 text-center text-[10.5px] leading-tight text-slate-400">
            Mevzuat yönlendirmesi yapar, tıbbi karar yerine geçmez. Acil
            durumlarda kurum protokollerinizi uygulayın.
          </p>
        </footer>

        {sheetAcik && <MevzuatSheet onKapat={() => setSheetAcik(false)} />}
      </div>
    </div>
  );
}

/* ---------- Karşılama ---------- */

function Karsilama({ onSor }: { onSor: (s: string) => void }) {
  return (
    <div className="belir flex flex-col items-center gap-6 px-1 py-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="nabiz">
          <AmblemBuyuk />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-baslik)] text-xl font-bold text-slate-900">
            Olay anında mevzuata sorun
          </h2>
          <p className="mx-auto mt-1.5 max-w-[19rem] text-sm leading-relaxed text-slate-500">
            Yataklı acil servis kurallarına dair sorunuzu yazın; kaynak gösteren,
            adım adım yönlendirme alın.
          </p>
        </div>
      </div>

      <div className="grid w-full gap-2.5">
        {ORNEKLER.map((o) => (
          <button
            key={o.soru}
            onClick={() => onSor(o.soru)}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-acil/40 hover:shadow-sm"
          >
            <span className="shrink-0 rounded-lg bg-acil/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-acil">
              {o.etiket}
            </span>
            <span className="text-[13.5px] leading-snug text-slate-700 group-hover:text-slate-900">
              {o.soru}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mesaj balonu ---------- */

function Balon({ mesaj }: { mesaj: UIMessage }) {
  const kullanici = mesaj.role === "user";
  const ham = mesajMetni(mesaj);

  if (kullanici) {
    return (
      <div className="belir flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-acil px-3.5 py-2.5 text-[15px] text-white shadow-sm">
          {ham}
        </div>
      </div>
    );
  }

  // Kaynak trailer'ını ayır
  const eslesme = ham.match(KAYNAK_RE);
  const sluglar = eslesme
    ? eslesme[1].split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  let metin = ham.replace(KAYNAK_RE, "").trim();

  const bulunamadi = metin.trimStart().startsWith("[BULUNAMADI]");
  if (bulunamadi) metin = metin.replace("[BULUNAMADI]", "").trim();

  if (bulunamadi) {
    return (
      <div className="belir flex justify-start">
        <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-amber-700">
            <span>⚠️</span> Mevzuatta bulunamadı
          </div>
          <Markdown>{metin}</Markdown>
        </div>
      </div>
    );
  }

  return (
    <div className="belir flex justify-start">
      <div className="group relative max-w-[92%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {metin ? (
          <>
            <Markdown>{metin}</Markdown>
            {sluglar.length > 0 && <KaynakRozetleri sluglar={sluglar} />}
            <KopyalaButonu metin={metin} />
          </>
        ) : (
          <span className="text-sm text-slate-400">…</span>
        )}
      </div>
    </div>
  );
}

/* ---------- Kaynak rozetleri ---------- */

function KaynakRozetleri({ sluglar }: { sluglar: string[] }) {
  const kayitlar = sluglar.map(belgeBul).filter(Boolean);
  if (kayitlar.length === 0) return null;
  return (
    <div className="mt-3 border-t border-slate-100 pt-2.5">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Kaynak
      </div>
      <div className="flex flex-wrap gap-1.5">
        {kayitlar.map((k) =>
          k!.resmiLink ? (
            <a
              key={k!.slug}
              href={k!.resmiLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-turkuaz/30 bg-turkuaz/5 px-2.5 py-1 text-[11.5px] font-medium text-turkuaz transition hover:border-turkuaz hover:bg-turkuaz/10"
            >
              {k!.kisaAd}
              <IkonLink />
            </a>
          ) : (
            <span
              key={k!.slug}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11.5px] font-medium text-slate-500"
            >
              {k!.kisaAd}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/* ---------- Kopyala butonu ---------- */

function KopyalaButonu({ metin }: { metin: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(metin);
          setKopyalandi(true);
          setTimeout(() => setKopyalandi(false), 1500);
        } catch {}
      }}
      title="Kopyala"
      className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
    >
      {kopyalandi ? <IkonOnay /> : <IkonKopya />}
    </button>
  );
}

/* ---------- Mevzuat alt sayfası (sheet) ---------- */

function MevzuatSheet({ onKapat }: { onKapat: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        onClick={onKapat}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        aria-label="Kapat"
      />
      <div className="belir relative max-h-[80%] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white px-5 pb-6 pt-4 sm:rounded-3xl sm:mx-3 sm:mb-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
        <h3 className="font-[family-name:var(--font-baslik)] text-lg font-bold text-slate-900">
          Yüklü Mevzuat
        </h3>
        <p className="mb-3 mt-0.5 text-[13px] text-slate-500">
          Cevaplar yalnızca aşağıdaki resmi kaynaklara dayanır.
        </p>
        <ul className="space-y-2">
          {BELGELER.map((b) => (
            <li key={b.slug}>
              {b.resmiLink ? (
                <a
                  href={b.resmiLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-turkuaz hover:bg-turkuaz/5"
                >
                  <span className="text-[13.5px] font-medium leading-snug text-slate-700">
                    {b.baslik}
                  </span>
                  <span className="shrink-0 text-turkuaz">
                    <IkonLink />
                  </span>
                </a>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                  <span className="text-[13.5px] font-medium leading-snug text-slate-700">
                    {b.baslik}
                  </span>
                  <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                    yerel belge
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={onKapat}
          className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

/* ---------- Yazıyor göstergesi ---------- */

function Yaziyor() {
  return (
    <div className="belir flex justify-start">
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acil [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acil [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acil" />
      </div>
    </div>
  );
}

/* ---------- Amblem (Türk kızıl hilal + ACİL) ---------- */

function Amblem() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-acil shadow-[0_6px_16px_-4px_rgba(227,10,23,0.5)]">
      <Hilal className="h-6 w-6 text-white" />
    </div>
  );
}

function AmblemBuyuk() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-acil shadow-[0_12px_30px_-8px_rgba(227,10,23,0.55)]">
      <Hilal className="h-9 w-9 text-white" />
    </div>
  );
}

/* Türk hilali: iki daire farkıyla oluşturulan "ters C" */
function Hilal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <mask id="hilal-mask">
          <rect width="24" height="24" fill="black" />
          <circle cx="12" cy="12" r="9" fill="white" />
          <circle cx="15.5" cy="12" r="7.4" fill="black" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="9" fill="currentColor" mask="url(#hilal-mask)" />
    </svg>
  );
}

/* ---------- İkonlar (inline SVG) ---------- */

function IkonGonder() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}
function IkonKitap() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}
function IkonYeni() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IkonLink() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  );
}
function IkonKopya() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IkonOnay() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-turkuaz" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
