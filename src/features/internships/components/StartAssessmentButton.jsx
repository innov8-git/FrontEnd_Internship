import { Link } from 'react-router-dom';
import { Button, Tooltip } from '@/shared/components/ui';
import { useAuth } from '@/shared/hooks';
import { ROLES, paths } from '@/shared/constants';
import { ArrowRight, GraduationCap, Users } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const STUDENTS_ONLY_MESSAGE = 'Only student accounts can enroll in internships.';

/** A focusable, visibly disabled button whose reason is available on hover and focus. */
function UnavailableButton({ children, size, variant = 'primary', leftIcon, className }) {
  return (
    <Tooltip content={STUDENTS_ONLY_MESSAGE}>
      <Button
        size={size}
        variant={variant}
        leftIcon={leftIcon}
        aria-disabled="true"
        className={className}
        onClick={(event) => event.preventDefault()}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

/**
 * Primary CTA of a designation:
 * - signed out: "Enroll now" -> register/login (then directly to enrollment);
 * - student: "Enroll now" -> opens enrollment page for the designation;
 * - trainer/admin: disabled with an explanation.
 */
export function StartAssessmentButton({
  designationId,
  size = 'lg',
  showSecondary = true,
  onStartAssessment,
  className,
}) {
  const { isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const isStudent = isAuthenticated && hasRole(ROLES.STUDENT);
  const enrollPath = paths.enroll({ designationId });

  const wrapperClass = cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', className);

  if (authLoading) {
    return (
      <div className={wrapperClass}>
        <Button size={size} loading>
          Loading…
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={wrapperClass}>
        <Button
          as={Link}
          to={paths.login(enrollPath)}
          size={size}
          rightIcon={ArrowRight}
        >
          Enroll now
        </Button>
        {showSecondary ? (
          <Button
            as={Link}
            to={paths.register(enrollPath)}
            size={size}
            variant="outline"
          >
            Create an account
          </Button>
        ) : null}
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <div className="flex flex-wrap items-center gap-3">
          <UnavailableButton size={size} leftIcon={GraduationCap}>
            Enroll now
          </UnavailableButton>
        </div>
        <p className="text-sm text-slate-500">{STUDENTS_ONLY_MESSAGE}</p>
      </div>
    );
  }

  if (onStartAssessment) {
    return (
      <div className={wrapperClass}>
        <Button onClick={onStartAssessment} size={size} rightIcon={ArrowRight}>
          Enroll now
        </Button>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <Button as={Link} to={enrollPath} size={size} rightIcon={ArrowRight}>
        Enroll now
      </Button>
    </div>
  );
}

/**
 * Secondary CTA: start a team for this designation (SN10). Signed-out visitors register first and
 * come back to the team form; non-students see it disabled.
 */
export function JoinTeamButton({
  designationId,
  planId,
  size = 'lg',
  variant = 'outline',
  className,
  children,
}) {
  const { isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const teamPath = paths.teamNew({ designationId, planId });
  const label = children ?? 'Join as a team';

  if (authLoading) {
    return (
      <Button size={size} variant={variant} leftIcon={Users} disabled className={className}>
        {label}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        as={Link}
        to={paths.login(teamPath)}
        size={size}
        variant={variant}
        leftIcon={Users}
        className={className}
      >
        {label}
      </Button>
    );
  }

  if (!hasRole(ROLES.STUDENT)) {
    return (
      <UnavailableButton size={size} variant={variant} leftIcon={Users} className={className}>
        {label}
      </UnavailableButton>
    );
  }

  return (
    <Button
      as={Link}
      to={teamPath}
      size={size}
      variant={variant}
      leftIcon={Users}
      className={className}
    >
      {label}
    </Button>
  );
}

export default StartAssessmentButton;
