import { CATEGORIES, INTENTS } from '../data/chatbotIntents';

/**
 * Modern Quick Categories and interactive sample questions panel.
 */
export function QuickCategories({ onSelectQuestion, activeCategory, onSelectCategory }) {
  const categoryIntents = activeCategory
    ? INTENTS.filter((intent) => intent.category === activeCategory)
    : [];

  return (
    <div className="space-y-2.5 pt-1">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 text-brand-500"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          Popular Topics
        </span>
        {activeCategory ? (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-[11px] text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>

      {/* Category Pills Grid / Flow */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isActive ? null : cat.id)}
              className={`
                group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium
                transition-all duration-200 active:scale-95
                ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-500/20'
                    : 'bg-white text-slate-700 border border-slate-200/80 shadow-2xs hover:border-brand-300 hover:bg-brand-50/70 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:bg-slate-700/80'
                }
              `}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Suggested Questions Drawer */}
      {activeCategory && categoryIntents.length > 0 ? (
        <div className="mt-2 space-y-1.5 rounded-xl border border-brand-200/70 bg-gradient-to-br from-brand-50/60 to-amber-50/40 p-3 shadow-2xs dark:border-brand-900/40 dark:from-slate-800 dark:to-slate-800/80">
          <p className="flex items-center gap-1 text-[11px] font-semibold text-brand-800 dark:text-brand-300">
            <span>✨ Tap a question to ask:</span>
          </p>
          <div className="space-y-1">
            {categoryIntents.map((intent) =>
              (intent.sampleQuestions ?? []).map((question) => (
                <button
                  key={`${intent.id}-${question}`}
                  type="button"
                  onClick={() => onSelectQuestion(question)}
                  className="group flex w-full items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white hover:text-brand-700 hover:shadow-xs dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-brand-300"
                >
                  <span className="line-clamp-1 flex-1">{question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-400"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              )),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default QuickCategories;
