import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Trash2,
  Upload,
  User,
} from '@/shared/icons';
import { SUPPORT_EMAIL } from '@/shared/constants';
import { getErrorMessage, getFieldErrors } from '@/shared/utils/errors';
import { useUpdateProfile } from '../hooks/useProfile';
import { PROFILE_NAME_MAX, profileSchema } from '../schemas/profileValidation';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/**
 * Edit student profile details (GP11):
 * Name, headline, contact phone, education, location, links, and bio.
 * Also supports direct profile photo uploads.
 */
export function ProfileForm({ user, className }) {
  const updateProfile = useUpdateProfile();
  const photoInputRef = useRef(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? '',
      headline: user?.headline ?? '',
      phone: user?.phone ?? '',
      college: user?.college ?? '',
      degree: user?.degree ?? '',
      graduationYear: user?.graduationYear ?? '',
      location: user?.location ?? '',
      linkedinUrl: user?.linkedinUrl ?? '',
      portfolioUrl: user?.portfolioUrl ?? '',
      bio: user?.bio ?? '',
    }),
    [user],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues,
  });

  // Follow outside changes (fresh /auth/me) unless student is actively editing
  useEffect(() => {
    if (!isDirty) reset(defaultValues);
  }, [defaultValues, isDirty, reset]);

  const handlePhotoUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP, or GIF).');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      toast.error('Image is too large', {
        description: 'Please upload an image smaller than 5MB.',
      });
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const avatarUrl = e.target?.result;
      try {
        await updateProfile.mutateAsync({ avatarUrl });
        toast.success('Profile picture updated', {
          description: 'Your photo has been saved successfully.',
        });
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't save your profile picture. Please try again."));
      } finally {
        setIsUploadingPhoto(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading the selected image file.');
      setIsUploadingPhoto(false);
    };

    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload(file);
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (isUploadingPhoto) return;
    setIsUploadingPhoto(true);
    try {
      await updateProfile.mutateAsync({ avatarUrl: null });
      toast.success('Profile picture removed', {
        description: 'Reverted to default initials avatar.',
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't remove photo. Please try again."));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (values) => {
    if (updateProfile.isPending) return;
    try {
      const payload = {
        name: values.name.trim(),
        headline: values.headline?.trim() || '',
        phone: values.phone?.trim() || '',
        college: values.college?.trim() || '',
        degree: values.degree?.trim() || '',
        graduationYear: values.graduationYear?.trim() || '',
        location: values.location?.trim() || '',
        linkedinUrl: values.linkedinUrl?.trim() || '',
        portfolioUrl: values.portfolioUrl?.trim() || '',
        bio: values.bio?.trim() || '',
      };
      const updated = await updateProfile.mutateAsync(payload);
      reset({
        name: updated?.name ?? payload.name,
        headline: updated?.headline ?? payload.headline,
        phone: updated?.phone ?? payload.phone,
        college: updated?.college ?? payload.college,
        degree: updated?.degree ?? payload.degree,
        graduationYear: updated?.graduationYear ?? payload.graduationYear,
        location: updated?.location ?? payload.location,
        linkedinUrl: updated?.linkedinUrl ?? payload.linkedinUrl,
        portfolioUrl: updated?.portfolioUrl ?? payload.portfolioUrl,
        bio: updated?.bio ?? payload.bio,
      });
      toast.success('Profile updated', { description: 'Your profile changes have been saved.' });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message });
        });
      } else {
        toast.error(getErrorMessage(error, "We couldn't save your changes. Please try again."));
      }
    }
  };

  const saving = isSubmitting || updateProfile.isPending;

  return (
    <Card padding="none" className={className}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-full flex-col">
        <CardHeader
          icon={User}
          title="Student Profile"
          description="Manage your personal details, academic background, and professional links."
        />

        <CardBody className="flex-1 space-y-6">
          {/* ── Profile Picture Upload Banner ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-3.5">
              <Avatar
                name={user?.name}
                src={user?.avatarUrl}
                size="lg"
                aria-hidden="true"
                className="h-14 w-14 ring-2 ring-white shadow-xs dark:ring-slate-700"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile Photo</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WEBP or GIF up to 5MB.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                className="sr-only"
                onChange={handlePhotoChange}
                tabIndex={-1}
                aria-hidden="true"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={Upload}
                loading={isUploadingPhoto}
                onClick={() => photoInputRef.current?.click()}
              >
                {user?.avatarUrl ? 'Change photo' : 'Upload photo'}
              </Button>
              {user?.avatarUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  leftIcon={Trash2}
                  disabled={isUploadingPhoto}
                  onClick={handleRemovePhoto}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>

          {/* ── Section 1: Personal Details ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                required
                autoComplete="name"
                maxLength={PROFILE_NAME_MAX}
                error={errors.name?.message}
                hint={`Used on your certificate (2–${PROFILE_NAME_MAX} chars).`}
                leftIcon={User}
                {...register('name')}
              />

              <Input
                label="Professional headline"
                placeholder="e.g. Final Year CS Undergrad | Full Stack Intern"
                error={errors.headline?.message}
                hint="Your title or career aspiration."
                leftIcon={Sparkles}
                {...register('headline')}
              />

              <Input
                label="Phone number"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                autoComplete="tel"
                error={errors.phone?.message}
                hint="For mentor communication."
                leftIcon={Phone}
                {...register('phone')}
              />

              <Input
                label="Email"
                type="email"
                value={user?.email ?? ''}
                readOnly
                leftIcon={Mail}
                hint={`Contact ${SUPPORT_EMAIL} to change your sign-in email.`}
              />
            </div>
          </div>

          {/* ── Section 2: Academic & Education ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Background</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  label="College / University"
                  placeholder="e.g. National Institute of Technology"
                  error={errors.college?.message}
                  hint="Your current or graduated institution."
                  leftIcon={Building2}
                  {...register('college')}
                />
              </div>

              <div>
                <Input
                  label="Graduation year"
                  placeholder="e.g. 2026"
                  maxLength={4}
                  error={errors.graduationYear?.message}
                  hint="4-digit completion year."
                  leftIcon={Calendar}
                  {...register('graduationYear')}
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  label="Degree & Branch"
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  error={errors.degree?.message}
                  hint="Your degree program and specialization."
                  leftIcon={GraduationCap}
                  {...register('degree')}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Location & Web Links ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <Globe className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Location & Links</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Input
                  label="Current location"
                  placeholder="e.g. Bengaluru, India"
                  error={errors.location?.message}
                  hint="City or region."
                  leftIcon={MapPin}
                  {...register('location')}
                />
              </div>

              <div>
                <Input
                  label="LinkedIn profile"
                  placeholder="https://linkedin.com/in/username"
                  error={errors.linkedinUrl?.message}
                  hint="Your LinkedIn profile link."
                  leftIcon={Globe}
                  {...register('linkedinUrl')}
                />
              </div>

              <div>
                <Input
                  label="Portfolio / Website"
                  placeholder="https://myportfolio.dev"
                  error={errors.portfolioUrl?.message}
                  hint="Your personal site or blog."
                  leftIcon={ExternalLink}
                  {...register('portfolioUrl')}
                />
              </div>
            </div>
          </div>

          {/* ── Section 4: About Me ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">About Me</h3>
            </div>

            <Textarea
              label="Bio / Summary"
              placeholder="Tell your mentors and team members about your technical background, current projects, interests, and what you aim to achieve during this internship..."
              rows={3}
              maxLength={600}
              showCount
              error={errors.bio?.message}
              hint="A short introduction visible on your student profile."
              {...register('bio')}
            />
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div>
            {isDirty ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                • You have unsaved changes
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                All details are up to date
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDirty ? (
              <Button
                type="button"
                variant="ghost"
                disabled={saving}
                onClick={() => reset(defaultValues)}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              leftIcon={Save}
              loading={saving}
              disabled={!isDirty}
            >
              Save changes
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ProfileForm;
