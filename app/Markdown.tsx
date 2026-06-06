"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Model cevaplarındaki markdown'ı (başlık, liste, tablo, kalın, alıntı) klinik açık temada render eder. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-2 mt-1 font-[family-name:var(--font-baslik)] text-[17px] font-bold text-slate-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-1.5 mt-3 flex items-center gap-2 font-[family-name:var(--font-baslik)] text-[15px] font-bold text-slate-900 before:h-4 before:w-1 before:rounded-full before:bg-acil">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 mt-2.5 text-sm font-semibold text-slate-800">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2 ml-0.5 list-none space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 ml-5 list-decimal space-y-1.5 marker:font-semibold marker:text-acil">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative pl-5 before:absolute before:left-0 before:top-[2px] before:font-bold before:text-acil before:content-['▸'] [ol_&]:pl-1 [ol_&]:before:content-['']">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-turkuaz underline underline-offset-2 hover:text-acil"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 flex gap-2 rounded-r-lg border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2 text-[14px] text-amber-900">
              <span aria-hidden className="select-none">⚠️</span>
              <div className="[&>p]:mb-0">{children}</div>
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-slate-200" />,
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-acil-koyu">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-[13px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 text-left text-slate-600">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-2.5 py-1.5 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-slate-100 px-2.5 py-1.5 align-top">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
