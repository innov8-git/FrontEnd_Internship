import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Badge,
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
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  User,
} from '@/shared/icons';
import { getErrorMessage, getFieldErrors } from '@/shared/utils/errors';
import { useUpdateProfile } from '../hooks/useProfile';
import { adminProfileSchema } from '../schemas/adminProfileValidation';
import { PROFILE_NAME_MAX } from '../schemas/profileValidation';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Edit administrator profile details:
 * - Personal info (name, headline, read-only email, phone)
 * - Administrative info (department, organization, location, linkedin)
 * - Bio and notes
 * - Profile photo upload and removal with instant preview and feedback
 */
export function AdminProfileForm({ user, className }) {
  const updateProfile = useUpdateProfile();
  const photoInputRef = useRef(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? '',
      headline: user?.headline ?? '',
      phone: user?.phone ?? '',
      department: user?.department ?? '',
      organization: user?.organization ?? '',
      location: user?.location ?? '',
      linkedinUrl: user?.linkedinUrl ?? '',
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
    resolver: zodResolver(adminProfileSchema),
    mode: 'onTouched',
    defaultValues,
  });

  // Sync external changes (e.g. fresh GET /auth/me) unless admin has uncommitted form edits
  useEffect(() => {
    if (!isDirty && user) {
      reset(defaultValues);
    }
  }, [user, defaultValues, isDirty, reset]);

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
        department: values.department?.trim() || '',
        organization: values.organization?.trim() || '',
        location: values.location?.trim() || '',
        linkedinUrl: values.linkedinUrl?.trim() || '',
        bio: values.bio?.trim() || '',
      };

      const updated = await updateProfile.mutateAsync(payload);
      reset({
        name: updated?.name ?? payload.name,
        headline: updated?.headline ?? payload.headline,
        phone: updated?.phone ?? payload.phone,
        department: updated?.department ?? payload.department,
        organization: updated?.organization ?? payload.organization,
        location: updated?.location ?? payload.location,
        linkedinUrl: updated?.linkedinUrl ?? payload.linkedinUrl,
        bio: updated?.bio ?? payload.bio,
      });
      toast.success('Profile updated', { description: 'Your administrator details have been saved.' });
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
          icon={ShieldCheck}
          title="Administrator Profile"
          description="Manage your system administrator details, security role, and contact information."
        />

        <CardBody className="flex-1 space-y-6">
          {/* Profile Picture Upload Banner */}
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

          {/* Section 1: Personal & Identity Information */}
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
                hint={`Your display name (2–${PROFILE_NAME_MAX} characters).`}
                leftIcon={User}
                {...register('name')}
              />

              <Input
                label="Professional title / Headline"
                placeholder="e.g. Senior Platform Administrator"
                error={errors.headline?.message}
                hint="Your title or primary administrative role."
                leftIcon={Sparkles}
                {...register('headline')}
              />

              <Input
                label="Email address"
                value={user?.email ?? ''}
                readOnly
                disabled
                leftIcon={Mail}
                hint="System administrator email cannot be modified directly."
              />

              <Input
                label="Contact phone number"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                autoComplete="tel"
                error={errors.phone?.message}
                hint="Direct line for emergency operations."
                leftIcon={Phone}
                {...register('phone')}
              />
            </div>
          </div>

          {/* Section 2: Department & Administration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <Building2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organization & Location</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Department"
                placeholder="e.g. Platform Engineering / Operations"
                error={errors.department?.message}
                hint="Internal department or team."
                leftIcon={Building2}
                {...register('department')}
              />

              <Input
                label="Organization"
                placeholder="e.g. ALFRE Education"
                error={errors.organization?.message}
                hint="Company or educational institution."
                leftIcon={Building2}
                {...register('organization')}
              />

              <Input
                label="Office / Location"
                placeholder="e.g. Bengaluru, India or Remote"
                error={errors.location?.message}
                hint="City, region or remote status."
                leftIcon={MapPin}
                {...register('location')}
              />

              <Input
                label="LinkedIn profile"
                placeholder="https://linkedin.com/in/username"
                error={errors.linkedinUrl?.message}
                hint="Optional public professional link."
                leftIcon={Globe}
                {...register('linkedinUrl')}
              />
            </div>
          </div>

          {/* Role & Privileges Notice */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Role & Access Level:</span>
                  <Badge variant="brand">ADMIN</Badge>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  You possess full administrative authorization across all portal domains: user management, trainer assignments, catalog & curriculum configuration, payment operations, and security audit logs.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Bio / About */}
          <div className="space-y-2">
            <Textarea
              label="About / Bio"
              rows={3}
              placeholder="Brief administrative summary or operational notes..."
              maxLength={600}
              error={errors.bio?.message}
              hint="Visible to other platform administrators and staff (max 600 characters)."
              {...register('bio')}
            />
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isDirty ? (
              <span className="font-medium text-amber-600 dark:text-amber-400">You have unsaved changes.</span>
            ) : (
              <span>All changes saved.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isDirty || saving}
              onClick={() => reset(defaultValues)}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={Save}
              loading={saving}
              disabled={!isDirty || saving}
            >
              Save changes
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default AdminProfileForm;

