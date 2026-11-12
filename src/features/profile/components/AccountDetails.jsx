import { useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  StatusBadge,
  StatusBanner,
  toast,
} from '@/shared/components/ui';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Camera,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Upload,
} from '@/shared/icons';
import { ROLE_LABELS } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';
import { getErrorMessage } from '@/shared/utils/errors';
import { formatDate, humanize } from '@/shared/utils/helpers';
import { useResendVerification, useUpdateProfile } from '../hooks/useProfile';

function VerificationBadge({ verified }) {
  return verified ? (
    <Badge variant="success" icon={BadgeCheck}>
      Verified
    </Badge>
  ) : (
    <Badge variant="warning" icon={AlertTriangle}>
      Unverified
    </Badge>
  );
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Account summary (GP11): interactive avatar with photo upload, name, headline,
 * email verification, roles, academic details, and member-since date.
 */
export function AccountDetails({ user, className }) {
  const resend = useResendVerification();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!user) return null;

  const verified = Boolean(user.emailVerified);
  const roles = Array.isArray(user.roles) ? user.roles : [];

  const handlePhotoFile = (file) => {
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

    setIsUploading(true);
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
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading the selected image file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(file);
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      await updateProfile.mutateAsync({ avatarUrl: null });
      toast.success('Profile picture removed', {
        description: 'Reverted to default initials avatar.',
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't remove photo. Please try again."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoFile(file);
  };

  const handleResend = () => {
    if (!user.email) return;
    resend.mutate(user.email, {
      onSuccess: () =>
        toast.success('Verification email sent', {
          description: `Check your inbox at ${user.email}.`,
        }),
      onError: (error) =>
        toast.error(getErrorMessage(error, "We couldn't send the email. Please try again.")),
    });
  };

  return (
    <Card padding="none" className={cn('overflow-hidden', className)}>
      {/* Hidden File Input for Picture Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-3 border-b border-slate-100 bg-gradient-to-b from-brand-50/70 via-white to-white px-5 pb-5 pt-6 text-center dark:border-slate-800 dark:from-brand-950/20 dark:via-slate-900 dark:to-slate-900">
        {/* Interactive Avatar with Hover & Camera Overlay */}
        <div
          className="relative group cursor-pointer"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          title="Click or drag to change profile photo"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload profile picture"
        >
          <Avatar
            name={user.name}
            src={user.avatarUrl}
            size="xl"
            aria-hidden="true"
            className={cn(
              'h-20 w-20 ring-4 ring-white shadow-md transition-all duration-200 dark:ring-slate-800',
              'group-hover:scale-105 group-hover:shadow-lg',
              isDragging && 'ring-brand-500 scale-105 ring-offset-2',
            )}
          />

          {/* Hover overlay with Camera icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[1px]">
            <Camera className="h-5 w-5 mb-0.5 text-white animate-in zoom-in-75 duration-150" />
            <span className="text-[10px] font-semibold tracking-wide">Change</span>
          </div>

          {/* Spinner during active upload */}
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-[2px]">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
            </div>
          ) : null}

          {/* Camera Action Badge on Corner */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow-md ring-2 ring-white transition-transform hover:bg-brand-700 hover:scale-110 active:scale-95 dark:ring-slate-900 cursor-pointer"
            title="Upload profile photo"
            aria-label="Upload profile photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Photo Action Buttons */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            leftIcon={Upload}
            loading={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] h-7 px-2.5 rounded-full"
          >
            {user.avatarUrl ? 'Change photo' : 'Upload photo'}
          </Button>

          {user.avatarUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              leftIcon={Trash2}
              disabled={isUploading}
              onClick={handleRemovePhoto}
              className="text-[11px] h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-full"
              title="Remove current photo"
            >
              Remove
            </Button>
          ) : null}
        </div>

        <div className="min-w-0 max-w-full">
          <h2 className="break-words text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {user.name}
          </h2>

          {user.headline ? (
            <p className="mt-0.5 break-words text-xs font-medium text-brand-600 dark:text-brand-400">
              {user.headline}
            </p>
          ) : null}

          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2">
            <span className="break-all text-sm text-slate-500 dark:text-slate-400">{user.email}</span>
            <VerificationBadge verified={verified} />
          </div>
        </div>

        {roles.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Roles">
            {roles.map((role) => (
              <li key={role}>
                <Badge variant="brand">{ROLE_LABELS[role] ?? humanize(role)}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <CardBody className="space-y-5">
        <DescriptionList
          items={[
            user.phone && {
              label: 'Phone',
              value: (
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {user.phone}
                </span>
              ),
            },
            user.college && {
              label: 'College / University',
              value: (
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {user.college}
                </span>
              ),
            },
            user.degree && {
              label: 'Degree & Program',
              value: (
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  {user.degree} {user.graduationYear ? `(${user.graduationYear})` : ''}
                </span>
              ),
            },
            user.location && {
              label: 'Location',
              value: (
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {user.location}
                </span>
              ),
            },
            user.status && {
              label: 'Account status',
              value: <StatusBadge status={user.status} />,
            },
            { label: 'Member since', value: formatDate(user.createdAt) },
          ]}
        />

        {!verified ? (
          <StatusBanner variant="warning" title="Verify your email address">
            <p>
              We sent a verification link to <span className="font-medium">{user.email}</span>.
              You need a verified email before you can pay for an internship.
            </p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Mail}
              loading={resend.isPending}
              onClick={handleResend}
              className="mt-3"
            >
              {resend.isSuccess ? 'Send again' : 'Resend verification email'}
            </Button>
          </StatusBanner>
        ) : null}
      </CardBody>
    </Card>
  );
}

export default AccountDetails;
