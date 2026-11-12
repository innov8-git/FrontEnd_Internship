import { cn } from '@/shared/utils/cn';
import { RobotMascotIcon } from './RobotMascotIcon';

/**
 * Enhanced chat message bubble with rich markdown styling,
 * mascot avatar, and related questions drawer below bot answers.
 */
export function ChatMessage({
  role,
  content,
  timestamp,
  relatedQuestions,
  onSelectQuestion,
  className,
}) {
  const isBot = role === 'bot';

  // Rich markdown parser for bold, numbered lists, and bullet points
  const renderFormattedContent = (text) => {
    const lines = String(text ?? '').split('\n');

    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();

      // Numbered list item: e.g. "1. Open the Registration page."
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        const num = numberedMatch[1];
        const rest = numberedMatch[2];
        return (
          <div key={lineIdx} className="my-1.5 flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {num}
            </span>
            <span className="flex-1 text-slate-700 dark:text-slate-200">
              {renderInlineStyles(rest)}
            </span>
          </div>
        );
      }

      // Bullet list item: e.g. "- Item" or "• Item"
      const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
      if (bulletMatch) {
        return (
          <div key={lineIdx} className="my-1 flex items-start gap-2 pl-1">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span className="flex-1 text-slate-700 dark:text-slate-200">
              {renderInlineStyles(bulletMatch[1])}
            </span>
          </div>
        );
      }

      // Empty line / paragraph break
      if (!trimmed) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Regular line
      return (
        <div key={lineIdx} className="leading-relaxed">
          {renderInlineStyles(line)}
        </div>
      );
    });
  };

  // Inline formatting helper for **bold** text
  const renderInlineStyles = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={idx}
            className={cn(
              'font-semibold',
              isBot
                ? 'text-slate-900 dark:text-white'
                : 'text-white underline decoration-white/30 decoration-1 underline-offset-2',
            )}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 text-sm',
        isBot ? 'justify-start' : 'justify-end',
        className,
      )}
    >
      {/* Bot Avatar */}
      {isBot ? (
        <div
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 shadow-2xs mt-1"
        >
          <RobotMascotIcon variant="dark" size={18} />
        </div>
      ) : null}

      {/* Message Column */}
      <div className={cn('flex flex-col', isBot ? 'items-start max-w-[88%]' : 'items-end max-w-[85%]')}>
        {/* Message Bubble */}
        <div
          className={cn(
            'w-full px-4 py-3 shadow-xs transition-all duration-150',
            isBot
              ? 'rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100'
              : 'rounded-2xl rounded-br-xs bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/15',
          )}
        >
          <div className="space-y-0.5 break-words text-[13.5px]">
            {renderFormattedContent(content)}
          </div>

          {/* Timestamp */}
          {timestamp ? (
            <div
              className={cn(
                'mt-1.5 flex items-center justify-end gap-1 text-[10px]',
                isBot ? 'text-slate-400 dark:text-slate-500' : 'text-white/70',
              )}
            >
              <span>{timestamp}</span>
              {!isBot ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-white/80"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* ── Related Questions Section Below Bot Answer ──────────────── */}
        {isBot && relatedQuestions && relatedQuestions.length > 0 ? (
          <div className="mt-2.5 w-full rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200 dark:border-slate-700 dark:bg-slate-950/95">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span className="text-sm">✨</span>
              <span>Tap a question to ask:</span>
            </p>
            <div className="mt-2 space-y-1">
              {relatedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onSelectQuestion?.(question)}
                  className="group flex w-full items-center justify-between rounded-xl bg-slate-800/90 px-3 py-2 text-left text-xs font-medium text-slate-100 shadow-2xs transition-all duration-150 hover:bg-slate-800 hover:text-amber-300 active:scale-[0.99] dark:bg-slate-900 dark:hover:bg-slate-800/90"
                >
                  <span className="line-clamp-1 flex-1 pr-2">{question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-amber-400"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChatMessage;
