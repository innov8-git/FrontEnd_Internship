import { Stepper } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

/** The student's journey from application to learning, shown on enrollment screens. */
export const ENROLLMENT_STEPS = Object.freeze([
  { label: 'Application & Project', description: 'Domain & project selection' },
  { label: 'Payment', description: 'Demo checkout' },
  { label: 'Start learning', description: 'Day-wise tasks unlock' },
]);

/** 0-based step indexes for `current`. */
export const ENROLLMENT_STEP = Object.freeze({
  ASSESSMENT: 0,
  PLAN: 0,
  PAYMENT: 1,
  LEARN: 2,
});

/**
 * Journey stepper: Assessment → Plan & terms → Payment → Start learning.
 * `current` is the step the student is on; earlier steps show as complete.
 */
export function EnrollmentStepper({ current = ENROLLMENT_STEP.ASSESSMENT, className }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white px-3 py-4 shadow-card sm:px-6',
        className,
      )}
    >
      <Stepper steps={ENROLLMENT_STEPS} current={current} aria-label="Enrollment progress" />
    </div>
  );
}

export default EnrollmentStepper;
