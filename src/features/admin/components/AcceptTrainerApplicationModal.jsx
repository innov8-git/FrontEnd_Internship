import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  CopyButton,
  FormField,
  Input,
  Modal,
  Switch,
  Textarea,
  toast,
} from '@/shared/components/ui';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
} from '@/shared/icons';
import { ROUTES } from '@/shared/constants';
import { useAcceptTrainerApplication } from '../hooks/useAdminTrainers';

function generateStrongPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '@#$%&*!';
  const all = upper + lower + digits + symbols;
  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
  const parts = [pick(upper), pick(upper), pick(lower), pick(lower), pick(digits), pick(digits), pick(symbols)];
  while (parts.length < 12) parts.push(pick(all));
  return parts.sort(() => Math.random() - 0.5).join('');
}

export function AcceptTrainerApplicationModal({ application, open, onClose }) {
  const acceptMutation = useAcceptTrainerApplication();
  const isExistingUser = Boolean(application?.existingUser);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [domain, setDomain] = useState('');
  const [experience, setExperience] = useState('');
  const [organization, setOrganization] = useState('');
  const [bio, setBio] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [createdResult, setCreatedResult] = useState(null);

  useEffect(() => {
    if (open && application) {
      setDomain(application.domain || '');
      setExperience(application.experience || '');
      setOrganization(application.organization || '');
      setBio(application.bio || '');
      setPassword(application.existingUser ? '' : generateStrongPassword());
      setShowPassword(true);
      setSendEmail(true);
      setPasswordError('');
      setCreatedResult(null);
    }
  }, [open, application]);

  const handleClose = () => {
    setCreatedResult(null);
    setPasswordError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!application) return;

    const trimmedPassword = password.trim();
    if (!isExistingUser && trimmedPassword.length < 8) {
      setPasswordError('Enter a password of at least 8 characters (or click Generate).');
      return;
    }
    if (isExistingUser && trimmedPassword && trimmedPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters, or leave blank to keep existing password.');
      return;
    }

    try {
      const res = await acceptMutation.mutateAsync({
        id: application._id,
        payload: {
          password: trimmedPassword || undefined,
          sendEmail,
          domain: domain.trim() || undefined,
          experience: experience.trim() || undefined,
          organization: organization.trim() || undefined,
          bio: bio.trim() || undefined,
          upgradeExistingUser: isExistingUser,
        },
      });

      toast.success(`${application.fullName} is now an active trainer!`);
      setCreatedResult(res);
    } catch (err) {
      toast.error(err?.message || 'Failed to accept trainer request.');
    }
  };

  if (!application) return null;

  const loginUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.LOGIN}` : ROUTES.LOGIN;

  if (createdResult) {
    const creds = createdResult.credentials || {};
    const copyBundle = creds.password
      ? `ALFRE Trainer Login Credentials\nLogin URL: ${loginUrl}\nEmail: ${creds.email}\nPassword: ${creds.password}`
      : `ALFRE Trainer Access Activated\nLogin URL: ${loginUrl}\nEmail: ${creds.email}\n(Use your existing account password)`;

    return (
      <Modal
        open={open}
        onClose={handleClose}
        size="md"
        title="Trainer Approved & Credentials Ready"
        description="Save or share these credentials now. The password will not be shown again."
        footer={
          <>
            <CopyButton value={copyBundle} label="Copy all details" variant="outline" />
            <Button onClick={handleClose}>Done</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-sm text-emerald-900 dark:text-emerald-200">
              <p className="font-semibold">{application.fullName} has been added to Active Trainers.</p>
              <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                {creds.emailSent
                  ? `A welcome email with login credentials has been dispatched to ${creds.email}.`
                  : 'Automatic email was disabled — share these credentials directly with the trainer.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Login Email</p>
                <p className="font-mono font-semibold text-slate-900 dark:text-white">{creds.email}</p>
              </div>
              <CopyButton value={creds.email || ''} iconOnly label="Copy email" variant="ghost" />
            </div>

            {creds.password ? (
              <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Password</p>
                  <p className="font-mono font-semibold text-brand-700 dark:text-brand-300">
                    {creds.password}
                  </p>
                </div>
                <CopyButton value={creds.password} iconOnly label="Copy password" variant="ghost" />
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
                Existing account password was kept unchanged.
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Login Portal</p>
                <p className="truncate font-mono text-xs text-slate-700 dark:text-slate-300">{loginUrl}</p>
              </div>
              <CopyButton value={loginUrl} iconOnly label="Copy login URL" variant="ghost" />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={`Accept Request: ${application.fullName}`}
      description="Provide login credentials to onboard this applicant as an active trainer."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={acceptMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={acceptMutation.isPending}
            leftIcon={CheckCircle2}
          >
            {acceptMutation.isPending
              ? 'Creating Trainer…'
              : isExistingUser
                ? 'Grant Trainer Role'
                : 'Accept & Create Credentials'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isExistingUser ? (
          <Alert variant="warning" title="Existing User Account Detected">
            An account for <span className="font-semibold">{application.email}</span> already exists.
            Accepting will grant them the Trainer role and attach their submitted resume. Leave the
            password blank to keep their current password, or enter a new password to reset it.
          </Alert>
        ) : null}

        {/* Read-only applicant summary */}
        <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Applicant</span>
            <p className="font-medium text-slate-900 dark:text-white">{application.fullName}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Login Email</span>
            <p className="font-mono text-xs font-medium text-slate-900 dark:text-white">{application.email}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Mobile</span>
            <p className="text-slate-800 dark:text-slate-200">{application.phone}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Resume</span>
            <p className="truncate text-slate-800 dark:text-slate-200">{application.resumeName}</p>
          </div>
        </div>

        {/* Credentials Section */}
        <FormField
          label={isExistingUser ? 'Reset Password (Optional)' : 'Trainer Login Password'}
          htmlFor="accept-trainer-password"
          required={!isExistingUser}
          hint={
            isExistingUser
              ? 'Leave blank to keep their existing password.'
              : 'Minimum 8 characters. Edit manually or click Generate for a strong password.'
          }
          error={passwordError}
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="accept-trainer-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isExistingUser ? 'Keep existing password' : 'Enter password (min 8 chars)'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={acceptMutation.isPending}
                leftIcon={KeyRound}
                className="font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              disabled={acceptMutation.isPending}
              onClick={() => {
                setPassword(generateStrongPassword());
                setShowPassword(true);
                setPasswordError('');
              }}
            >
              Generate
            </Button>
          </div>
        </FormField>

        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <Switch
            checked={sendEmail}
            onChange={setSendEmail}
            disabled={acceptMutation.isPending}
            label="Email login credentials to trainer automatically"
            description="Sends the welcome email containing their email and password right after approval."
          />
        </div>

        {/* Editable profile fields carried from application */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Primary Domain" htmlFor="accept-domain">
            <Input
              id="accept-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={acceptMutation.isPending}
            />
          </FormField>
          <FormField label="Experience" htmlFor="accept-experience">
            <Input
              id="accept-experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              disabled={acceptMutation.isPending}
            />
          </FormField>
        </div>

        <FormField label="Company / College Name" htmlFor="accept-org">
          <Input
            id="accept-org"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            disabled={acceptMutation.isPending}
          />
        </FormField>

        <FormField label="Bio / Notes (Optional)" htmlFor="accept-bio">
          <Textarea
            id="accept-bio"
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={acceptMutation.isPending}
          />
        </FormField>
      </form>
    </Modal>
  );
}

export default AcceptTrainerApplicationModal;
