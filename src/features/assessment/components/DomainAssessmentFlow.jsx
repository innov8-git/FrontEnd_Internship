import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Skeleton,
  SkeletonCard,
} from '@/shared/components/ui';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  ListChecks,
  Percent,
  RefreshCw,
  Send,
  Sparkles,
  XCircle,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { fetchAssessmentQuestionsByDomain } from '@/services/assessmentService';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function DomainAssessmentFlow({
  candidate = {},
  domain = 'Banking',
  partner = {},
  role = {},
  onComplete,
  onClose,
}) {
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Phases: 'intro' | 'questions' | 'review' | 'result'
  const [phase, setPhase] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedScore, setSubmittedScore] = useState(null);

  // Fetch domain questions dynamically from database / service
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(null);

    fetchAssessmentQuestionsByDomain(domain, role?.id || partner?.id || 'domain-test')
      .then((data) => {
        if (isMounted) {
          setAssessmentData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err?.message || 'Failed to fetch assessment questions.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [domain, role?.id, partner?.id]);

  const questions = useMemo(
    () => (Array.isArray(assessmentData?.questions) ? assessmentData.questions : []),
    [assessmentData],
  );
  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => questions.reduce((acc, q) => (answers[q._id] !== undefined ? acc + 1 : acc), 0),
    [questions, answers],
  );
  const unansweredCount = Math.max(0, total - answeredCount);
  const progressPercent = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  // Option selection
  const handleSelectOption = useCallback((optionIndex) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: optionIndex,
    }));
  }, [currentQuestion]);

  // Keyboard navigation: 1-4 for options
  useEffect(() => {
    if (phase !== 'questions' || !currentQuestion) return;

    const handleKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (optIdx < (currentQuestion.options?.length || 0)) {
          handleSelectOption(optIdx);
        }
      } else if (e.key === 'ArrowRight' && currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentQuestion, currentIndex, total, handleSelectOption]);

  // Scoring
  const handleSubmitAssessment = () => {
    let score = 0;
    questions.forEach((q) => {
      const selected = answers[q._id];
      if (selected !== undefined && selected === q.correctIndex) {
        score += 1;
      }
    });

    setSubmittedScore(score);
    setPhase('result');
    if (onComplete) {
      onComplete({
        score,
        total,
        percentage: Math.round((score / total) * 100),
        domain,
        answers,
        candidate,
      });
    }
  };

  // Calculate scholarship discount percentage based on score
  const scholarshipTier = useMemo(() => {
    if (submittedScore === null) return { percent: 0, label: 'Standard' };
    const ratio = total > 0 ? submittedScore / total : 0;
    if (ratio >= 0.8) {
      return { percent: 30, label: '30% Merit Scholarship Unlocked', variant: 'success' };
    }
    if (ratio >= 0.6) {
      return { percent: 20, label: '20% Merit Scholarship Unlocked', variant: 'brand' };
    }
    if (ratio >= 0.4) {
      return { percent: 10, label: '10% Merit Scholarship Unlocked', variant: 'info' };
    }
    return { percent: 5, label: 'Qualifier Pass Granted', variant: 'outline' };
  }, [submittedScore, total]);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Loading {domain} Domain Assessment
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Fetching 15 curated technical questions for {domain} from the database…
          </p>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3 mx-auto" />
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (loadError || questions.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Unable to Load Assessment
        </h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {loadError || 'No questions available for the selected domain.'}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setLoading(true);
              fetchAssessmentQuestionsByDomain(domain, role?.id).then((d) => {
                setAssessmentData(d);
                setLoading(false);
              });
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ==================== PHASE 1: INTRO ====================
  if (phase === 'intro') {
    return (
      <div className="space-y-6 py-2">
        {/* Applicant Header */}
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-4 sm:p-5 dark:border-blue-900/50 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                <Sparkles className="h-3.5 w-3.5" />
                Step 2: Technical Qualification Assessment
              </span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {domain} Domain Skill Assessment
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Application received for <span className="font-semibold text-slate-900 dark:text-white">{candidate.fullName || 'Candidate'}</span> · {partner.name || 'Partner Company'}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="brand" className="text-xs px-2.5 py-1">
                {domain} Track
              </Badge>
              <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Role: {role.designation || 'Trainee Software Engineer'}
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Guidelines */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {total} Multiple-Choice Questions
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                Real-world engineering questions specific to the {domain} industry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Merit Scholarship Unlocked
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                Your performance determines your scholarship tier (up to 30% fee waiver).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Self-Paced / No Rush
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                Take your time to read each prompt. Most candidates finish in 15 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Keyboard Shortcuts Enabled
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                Press keys 1, 2, 3, 4 to select options A, B, C, D instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Save & Exit
          </Button>
          <Button
            variant="primary"
            size="lg"
            rightIcon={ArrowRight}
            onClick={() => setPhase('questions')}
            className="shadow-md"
          >
            Start {domain} Assessment
          </Button>
        </div>
      </div>
    );
  }

  // ==================== PHASE 2: QUESTIONS ====================
  if (phase === 'questions') {
    const selectedOption = currentQuestion ? answers[currentQuestion._id] : undefined;

    return (
      <div className="space-y-5 py-1">
        {/* Progress & Top Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Badge variant="brand" className="text-[11px] py-0 px-2">
                {domain}
              </Badge>
              <span className="font-semibold text-slate-900 dark:text-white">
                Question {currentIndex + 1} of {total}
              </span>
            </span>
            <span>
              {answeredCount} of {total} answered ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Technical Question #{currentIndex + 1}
              </span>
              <span className="text-[11px]">Use keys 1–4 to pick</span>
            </div>

            <h3 className="mt-4 text-base font-semibold leading-relaxed text-slate-900 dark:text-white sm:text-lg">
              {currentQuestion.text}
            </h3>

            {/* Options List */}
            <div className="mt-5 space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const letter = OPTION_LETTERS[idx] || `${idx + 1}`;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      'group flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40',
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 shadow-sm dark:border-brand-500 dark:bg-brand-950/60 dark:text-brand-100'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                        isSelected
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300',
                      )}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 pt-0.5 leading-snug">{option}</span>
                    {isSelected && (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Navigator Grid */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Jump to Question:</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Answered
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" /> Skipped
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = answers[q._id] !== undefined;
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q._id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-all',
                    isCurrent
                      ? 'ring-2 ring-brand-500 ring-offset-1 bg-brand-600 text-white'
                      : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400',
                  )}
                  aria-label={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhase('review')}
            >
              Review ({answeredCount}/{total})
            </Button>

            {currentIndex < total - 1 ? (
              <Button
                variant="primary"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                rightIcon={Send}
                onClick={() => setPhase('review')}
              >
                Review & Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== PHASE 3: REVIEW ====================
  if (phase === 'review') {
    return (
      <div className="space-y-5 py-2">
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Review Your {domain} Answers
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Check your answers before submitting. You have answered{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {answeredCount}
            </span>{' '}
            of <span className="font-semibold">{total}</span> questions.
            {unansweredCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                {' '}
                ({unansweredCount} unanswered questions will count as 0).
              </span>
            )}
          </p>
        </div>

        {/* Question checklist */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {questions.map((q, idx) => {
            const chosen = answers[q._id];
            const isAnswered = chosen !== undefined;

            return (
              <div
                key={q._id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Q{idx + 1}.
                    </span>
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {q.text}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {isAnswered ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Selected: Option {OPTION_LETTERS[chosen]} ({q.options[chosen]})
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Not answered
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs py-1 h-7"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setPhase('questions');
                  }}
                >
                  {isAnswered ? 'Change' : 'Answer'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            leftIcon={ArrowLeft}
            onClick={() => setPhase('questions')}
          >
            Back to Questions
          </Button>

          <Button
            variant="primary"
            size="lg"
            rightIcon={CheckCircle2}
            onClick={handleSubmitAssessment}
            className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Submit Final Assessment
          </Button>
        </div>
      </div>
    );
  }

  // ==================== PHASE 4: RESULT ====================
  if (phase === 'result') {
    const percentage = total > 0 ? Math.round((submittedScore / total) * 100) : 0;

    return (
      <div className="space-y-6 py-2 text-center">
        {/* Celebration Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950/60 dark:text-emerald-400">
          <Award className="h-9 w-9" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Assessment Successfully Completed
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {submittedScore} / {total} Correct ({percentage}%)
          </h2>
          <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
            {scholarshipTier.label}
          </p>
        </div>

        {/* Application & Assessment Record Details */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left text-xs dark:border-slate-800 dark:bg-slate-900/60 sm:p-5">
          <h4 className="border-b border-slate-200/80 pb-2 font-bold uppercase tracking-wider text-slate-900 dark:border-slate-800 dark:text-white">
            Official Application & Evaluation Summary
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Applicant:</span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {candidate.fullName || 'Candidate'}
              </p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Email Address:</span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {candidate.email || 'Registered Email'}
              </p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Partner & Role:</span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {partner.name} · {role.designation}
              </p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Evaluated Domain:</span>
              <p className="font-semibold text-brand-600 dark:text-brand-400">
                {domain} Industry Track
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Accordion / Preview */}
        <div className="text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Question-by-Question Review
          </h4>
          <div className="mt-2.5 max-h-56 overflow-y-auto space-y-2 pr-1">
            {questions.map((q, idx) => {
              const selected = answers[q._id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q._id}
                  className={cn(
                    'rounded-xl border p-3 text-xs transition-colors',
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                      : 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20',
                  )}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Q{idx + 1}: {q.text}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                        <span className="text-slate-600 dark:text-slate-400">
                          Your Answer:{' '}
                          <span className={isCorrect ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'font-semibold text-rose-700 dark:text-rose-300'}>
                            {selected !== undefined ? q.options[selected] : 'Skipped'}
                          </span>
                        </span>
                        {!isCorrect && (
                          <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                            Correct: {q.options[q.correctIndex]}
                          </span>
                        )}
                      </div>
                      {q.explanation && (
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Done & Return to Internships
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
