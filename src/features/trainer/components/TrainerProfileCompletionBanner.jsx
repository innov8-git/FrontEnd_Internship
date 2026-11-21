import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { ArrowRight, CheckCircle2, Circle, Sparkles, X } from '@/shared/icons';
import { isTrainerProfileComplete } from '../utils/profileCompletion';

/**
 * Banner shown on the Trainer Dashboard prompting them to complete
 * their organization, LinkedIn profile, and resume after initial onboarding.
 */
export function TrainerProfileCompletionBanner({ user }) {
  const [dismissed, setDismissed] = useState(false);
  const trainerProfile = user?.trainerProfile || {};

  if (dismissed || isTrainerProfileComplete(trainerProfile)) {
    return null;
  }

  const hasDomain = Boolean(trainerProfile.domain && trainerProfile.domain.trim());
  const hasOrg = Boolean(trainerProfile.organization && trainerProfile.organization.trim());
  const hasLinkedin = Boolean(trainerProfile.linkedinUrl && trainerProfile.linkedinUrl.trim());
  const hasResume = Boolean(
    trainerProfile.resumeName ||
    trainerProfile.resumeUrl ||
    trainerProfile.resume
  );

  const steps = [
    { label: 'Mentoring Domain', completed: hasDomain, detail: trainerProfile.domain || 'Assigned by admin' },
    { label: 'Organization & Company', completed: hasOrg, detail: hasOrg ? trainerProfile.organization : 'Pending' },
    { label: 'LinkedIn Profile', completed: hasLinkedin, detail: hasLinkedin ? 'Connected' : 'Pending' },
    { label: 'Resume / CV', completed: hasResume, detail: hasResume ? 'Uploaded' : 'Pending' },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div
      role="region"
      aria-label="Trainer profile completion notice"
      className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50/30 p-5 shadow-sm dark:border-amber-800/50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/30"
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-amber-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:hover:bg-amber-900/40 dark:hover:text-slate-200"
        aria-label="Dismiss profile completion reminder"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 pr-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Complete your trainer profile ({completedCount} of {steps.length} completed)
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Welcome to the mentoring team! Your account was initialized by an administrator. Please add your organization, LinkedIn profile, and resume so your credentials are fully visible for review allocations.
          </p>
        </div>

        <div className="shrink-0 pt-1 sm:pt-0">
          <Button
            as={Link}
            to={ROUTES.PROFILE}
            size="sm"
            rightIcon={ArrowRight}
            className="shadow-sm"
          >
            Complete Profile
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/40">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2 text-xs">
            {step.completed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-400 shrink-0" />
            )}
            <div className="min-w-0">
              <span className={`font-medium block truncate ${step.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {step.label}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                {step.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerProfileCompletionBanner;
