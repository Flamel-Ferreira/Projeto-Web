import ReactMarkdown from 'react-markdown';
import { cn } from '../../utils/cn.js';

const COMPONENTS = {
  h1: ({ children }) => (
    <h2 className="text-[26px] font-semibold leading-tight text-text">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="text-[22px] font-semibold leading-tight text-text">{children}</h3>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold leading-tight text-text">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[17px] font-semibold text-text">{children}</h4>
  ),
  p: ({ children }) => <p className="leading-[1.75]">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  em: ({ children }) => <em className="italic text-text">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary-light underline decoration-primary/40 underline-offset-2 hover:text-text"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-primary-light">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 pl-5 marker:text-primary-light">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-[1.75]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-4 text-text-secondary italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => (
    <code
      className={cn(
        'rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-primary-light',
        className,
      )}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-border bg-[#0D0D0E] p-4 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-border" />,
};

export default function MarkdownView({ content, className }) {
  return (
    <div
      className={cn(
        'space-y-4 break-words text-[15px] leading-[1.75] text-[#C9C9CE]',
        className,
      )}
    >
      <ReactMarkdown components={COMPONENTS}>{content || ''}</ReactMarkdown>
    </div>
  );
}
