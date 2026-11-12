import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Modal,
} from '@/shared/components/ui';
import {
  Award,
  CheckCircle2,
  GitPullRequest,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from '@/shared/icons';

const DEFAULT_MENTOR = {
  name: 'Priya Nair',
  email: 'trainer@demo.dev',
  designation: 'Principal Systems Architect & Lead Engineering Mentor',
  organization: 'ALFRE Engineering Network',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
  bio: 'Senior engineer with 8+ years of production experience in enterprise software. Responsible for reviewing your GitHub code submissions, providing architectural guidance, and certifying production standards.',
  specialties: ['Code Review', 'Clean Architecture', 'GitHub Workflows', 'Enterprise Backend'],
  availability: 'Online for Daily Sprint Reviews',
};

/**
 * Dedicated Mentor Profile Card on the student's project dashboard.
 * Displays the assigned mentor's photo, full name, professional designation,
 * core responsibilities (code reviews, technical guidance, milestone sign-off),
 * and quick contact modalities to establish transparency and trust.
 */
export function MentorProfileCard({ mentor, _enrollment, className }) {
  const profile = mentor || DEFAULT_MENTOR;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        className={className}
        aria-labelledby="mentor-profile-heading"
      >
        <div className="flex flex-col gap-6 p-6 sm:p-7">
          {/* Header Row: Badge & Context */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2
                id="mentor-profile-heading"
                className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
              >
                Assigned Project Mentor
              </h2>
            </div>
            <Badge variant="brand" icon={ShieldCheck}>
              Verified Reviewer
            </Badge>
          </div>

          {/* Main Mentor Profile Section */}
          <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            {/* Mentor Photo */}
            <div className="relative mx-auto lg:mx-0">
              <Avatar
                name={profile.name}
                src={profile.avatarUrl}
                size="xl"
                className="h-20 w-20 ring-4 ring-amber-500/20 shadow-md sm:h-24 sm:w-24"
              />
              <span
                className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                title="Active for Sprint Reviews"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            {/* Profile Information & Bio */}
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name}
                </h3>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  {profile.organization || 'ALFRE Engineering Network'}
                </span>
              </div>

              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {profile.designation}
              </p>

              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {profile.bio}
              </p>

              {/* Specialties / Skills Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 lg:justify-start">
                {(profile.specialties || DEFAULT_MENTOR.specialties).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Contact */}
            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0 justify-center">
              <Button
                variant="primary"
                size="sm"
                leftIcon={MessageSquare}
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto shadow-sm"
              >
                Contact Mentor
              </Button>
              <Button
                as="a"
                href="#reviews"
                variant="outline"
                size="sm"
                leftIcon={GitPullRequest}
                onClick={(e) => {
                  e.preventDefault();
                  setModalOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                Review Guidance
              </Button>
            </div>
          </div>

          {/* Transparent Responsibilities Strip */}
          <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/75 p-4 text-xs dark:border-slate-800/70 dark:bg-slate-900/60 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  GitHub Code Reviews
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Reviews PRs against industry acceptance criteria.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Technical Guidance
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Provides actionable feedback to improve architecture.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Milestone Sign-Off
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Validates sprint tasks to unlock digital certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mentor Guidance & Contact Dialog */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Guidance with ${profile.name}`}
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <Avatar name={profile.name} src={profile.avatarUrl} size="md" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{profile.name}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400">{profile.designation}</p>
            </div>
          </div>

          <p>
            Your mentor actively inspects your code once you submit a task with your GitHub pull request link.
          </p>

          <div className="space-y-2 rounded-lg bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/60">
            <p className="font-semibold">How to get the best feedback:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Include your testing results and screenshots in the submission form.</li>
              <li>Add notes on any architectural decisions or edge cases you handled.</li>
              <li>Check acceptance criteria before submitting each attempt.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official contact email: <strong className="text-slate-700 dark:text-slate-200">{profile.email}</strong>
          </p>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MentorProfileCard;

