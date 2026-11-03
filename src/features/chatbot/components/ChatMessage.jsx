import { cn } from '@/shared/utils/cn';
import { RobotMascotIcon } from './RobotMascotIcon';

/**
 * Enhanced single chat message bubble with rich formatting,
 * avatar icons, and modern card styling.
 */
export function ChatMessage({ role, content, timestamp, className }) {
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
        'flex items-end gap-2 text-sm',
        isBot ? 'justify-start' : 'justify-end',
        className,
      )}
    >
      {/* Bot Avatar */}
      {isBot ? (
        <div
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
        >
          <RobotMascotIcon variant="dark" size={18} />
        </div>
      ) : null}

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 shadow-xs transition-all duration-150',
          isBot
            ? 'rounded-2xl rounded-bl-xs border border-slate-200/80 bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100'
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
    </div>
  );
}

export default ChatMessage;
