import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  toast,
} from '@/shared/components/ui';
import { Award, Building2, Globe, Mail, Save, User } from '@/shared/icons';
import { SUPPORT_EMAIL } from '@/shared/constants';
import { EXPERIENCE_LEVELS, ResumeUpload, TRAINER_DOMAINS } from '@/features/auth';
import { getErrorMessage, getFieldErrors } from '@/shared/utils/errors';
import { useUpdateProfile } from '../hooks/useProfile';
import { trainerProfileSchema } from '../schemas/trainerProfileValidation';
import { PROFILE_NAME_MAX } from '../schemas/profileValidation';

/**
 * Build default form values from the trainer user object.
 */
function getTrainerFormDefaults(user) {
  const profile = user?.trainerProfile || {};
  return {
    name: user?.name ?? '',
    domain: profile.domain ?? '',
    experience: profile.experience ?? '',
    organization: profile.organization ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    resume: profile.resumeName
      ? { name: profile.resumeName, size: profile.resumeSize || 0 }
      : null,
  };
}

/**
 * Edit trainer profile details:
 *  - Personal info (name, read-only email)
 *  - Mentoring qualifications (domain, experience, organization, LinkedIn)
 *  - Resume / CV upload and replacement
 */
export function TrainerProfileForm({ user, className }) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(trainerProfileSchema),
    mode: 'onTouched',
    defaultValues: getTrainerFormDefaults(user),
  });

  const resume = watch('resume');

  // Sync external changes (e.g. fresh GET /auth/me) unless the trainer has uncommitted edits.
  useEffect(() => {
    if (!isDirty && user) {
      reset(getTrainerFormDefaults(user));
    }
  }, [user, isDirty, reset]);

  const onSubmit = async (values) => {
    if (updateProfile.isPending) return;

    try {
      const resumeName = values.resume?.name ? String(values.resume.name).trim() : '';
      const resumeSize = values.resume?.size ? Number(values.resume.size) : 0;

      const trainerProfilePayload = {
        domain: String(values.domain ?? '').trim(),
        experience: String(values.experience ?? '').trim(),
        organization: String(values.organization ?? '').trim(),
        linkedinUrl: String(values.linkedinUrl ?? '').trim(),
        resumeName,
        resumeSize,
      };

      await updateProfile.mutateAsync({
        name: values.name,
        trainerProfile: trainerProfilePayload,
      });

      reset({
        name: values.name,
        domain: values.domain,
        experience: values.experience,
        organization: values.organization,
        linkedinUrl: values.linkedinUrl,
        resume: resumeName ? { name: resumeName, size: resumeSize } : null,
      });

      toast.success('Trainer profile updated', {
        description: 'Your mentoring qualifications and resume have been saved.',
      });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors && typeof fieldErrors === 'object' && Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: String(msg) });
        });
      } else {
        toast.error(
          getErrorMessage(error, "We couldn't save your profile changes. Please try again."),
        );
      }
    }
  };

  const saving = isSubmitting || updateProfile.isPending;

  return (
    <Card padding="none" className={className}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-full flex-col">
        <CardHeader
          icon={Award}
          title="Trainer Profile"
          description="Manage your personal details, mentoring qualifications, organization, and resume."
        />

        <CardBody className="flex-1 space-y-6">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                required
                autoComplete="name"
                maxLength={PROFILE_NAME_MAX}
                leftIcon={User}
                error={errors.name?.message}
                hint={`2–${PROFILE_NAME_MAX} characters.`}
                {...register('name')}
              />

              <Input
                label="Email address"
                type="email"
                value={user?.email ?? ''}
                readOnly
                leftIcon={Mail}
                hint={`Sign-in email cannot be changed. Contact ${SUPPORT_EMAIL} for help.`}
              />
            </div>
          </div>

          {/* Section 2: Trainer Qualifications */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trainer Qualifications
            </h3>

            <Select
              label="Primary Mentoring Domain"
              placeholder="Select your domain of expertise"
              options={TRAINER_DOMAINS}
              error={errors.domain?.message}
              required
              {...register('domain')}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Years of Experience"
                placeholder="Select experience"
                options={EXPERIENCE_LEVELS}
                error={errors.experience?.message}
                required
                {...register('experience')}
              />

              <Input
                label="Current Organization"
                placeholder="Company / Institution"
                leftIcon={Building2}
                hint="e.g. Google, Infosys, Freelance"
                error={errors.organization?.message}
                {...register('organization')}
              />
            </div>

            <Input
              label="LinkedIn / Portfolio Profile URL"
              type="url"
              placeholder="https://linkedin.com/in/username"
              leftIcon={Globe}
              hint="Helps verify your background during reviews."
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />
          </div>

          {/* Section 3: Resume / Curriculum Vitae */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resume / Curriculum Vitae
            </h3>

            <ResumeUpload
              label="Trainer Resume / CV"
              hint="Upload or replace your PDF or Word document (max 5 MB)."
              value={resume}
              onChange={(file) =>
                setValue('resume', file, { shouldDirty: true, shouldValidate: true })
              }
              error={errors.resume?.message}
              disabled={saving}
            />
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-end gap-3">
          {isDirty ? (
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => reset(getTrainerFormDefaults(user))}
            >
              Cancel
            </Button>
          ) : null}

          <Button type="submit" leftIcon={Save} loading={saving} disabled={!isDirty}>
            Save changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default TrainerProfileForm;

