import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { GREETING_MESSAGE } from '../data/chatbotIntents';
import { getChatbotResponse } from '../utils/intentMatcher';
import { ChatMessage } from './ChatMessage';
import { QuickCategories } from './QuickCategories';
import { RobotMascotIcon } from './RobotMascotIcon';

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const BOT_TYPING_DELAY_MS = 380;

/**
 * Modern floating FAQ chatbot widget with attractive glassmorphic styling,
 * smooth animations, categorized topic suggestions, and zero-hallucination answers.
 */
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'greeting', role: 'bot', content: GREETING_MESSAGE, time: formatTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = String(text ?? '').trim();
      if (!trimmed || isTyping) return;

      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = getChatbotResponse(trimmed);
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: botResponse,
          time: formatTime(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, BOT_TYPING_DELAY_MS);
    },
    [isTyping],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([
      { id: 'greeting', role: 'bot', content: GREETING_MESSAGE, time: formatTime() },
    ]);
    setActiveCategory(null);
  };

  const handleQuestionClick = (question) => {
    sendMessage(question);
  };

  return (
    <>
      {/* ── Floating Action Launcher Button ─────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!open ? (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need help? Ask AI</span>
          </div>
        ) : null}

        <div className="relative flex items-center justify-center">
          {/* Subtle Ambient Radar Waves (Active when chat is closed) */}
          {!open ? (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-14 w-14 rounded-full border border-amber-400/50 bg-brand-500/15 animate-sonar-wave"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-14 w-14 rounded-full border border-amber-400/40 bg-brand-500/10 animate-sonar-wave-delayed-1"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-14 w-14 rounded-full border border-amber-400/30 bg-brand-500/5 animate-sonar-wave-delayed-2"
              />
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              'group relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 active:scale-95',
              'focus:outline-none focus:ring-4 focus:ring-brand-500/30',
              open
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/40 hover:bg-slate-800'
                : 'bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 text-white shadow-xl shadow-brand-900/30 ring-1 ring-white/30 hover:shadow-2xl hover:shadow-brand-900/40 animate-bot-float',
            )}
            aria-label={open ? 'Close chatbot assistant' : 'Open chatbot assistant'}
          >
            {open ? (
              // Close icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 transition-transform duration-200 rotate-90 scale-100"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Crisp Vector Robot Mascot
              <RobotMascotIcon
                variant="light"
                size={34}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </button>
        </div>
      </div>

      {/* ── Chat Modal / Panel ─────────────────────────────────────────── */}
      {open ? (
        <div
          role="dialog"
          aria-label="Internship Assistant Chatbot"
          className={cn(
            'fixed bottom-24 right-6 z-50 flex w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden',
            'rounded-3xl border border-slate-200/90 bg-white shadow-2xl backdrop-blur-xl',
            'h-[580px] max-h-[calc(100vh-8rem)] transition-all duration-300 animate-in fade-in zoom-in-95',
            'dark:border-slate-700/80 dark:bg-slate-900',
          )}
        >
          {/* ── Modern Premium Header ───────────────────────────────────── */}
          <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 px-5 py-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 p-1 border border-white/20 shadow-inner">
                <RobotMascotIcon variant="light" size={26} />
                {/* Status Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-slate-950">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white">ALFRE Assistant</h2>
                  <span className="rounded-md bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-brand-400/30">
                    24/7 AI
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Ready to help
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                title="Reset conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                title="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Messages Stream ─────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950/80 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.time}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping ? (
              <div className="flex items-end gap-2 text-sm justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                  <RobotMascotIcon variant="dark" size={18} />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs border border-slate-200/80 bg-white px-4 py-3 shadow-xs dark:border-slate-700 dark:bg-slate-800">
                  <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.3s]" />
                  <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.15s]" />
                  <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-brand-500" />
                </div>
              </div>
            ) : null}

            {/* Quick Categories (shown on greeting or few messages) */}
            {messages.length <= 2 && !isTyping ? (
              <QuickCategories
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onSelectQuestion={handleQuestionClick}
              />
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ──────────────────────────────────────────────── */}
          <div className="border-t border-slate-200/80 bg-white/95 p-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 pl-4 pr-1.5 py-1.5 transition-all shadow-2xs focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question (e.g. fees, assessment, mentor)..."
                disabled={isTyping}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95',
                  input.trim() && !isTyping
                    ? 'bg-gradient-to-tr from-brand-600 to-amber-500 text-white shadow-sm shadow-brand-500/30 hover:scale-105 hover:opacity-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500',
                )}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ChatBot;
