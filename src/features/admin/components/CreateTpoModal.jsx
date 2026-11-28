import { useState } from 'react';
import {
  Button,
  CopyButton,
  FormField,
  Input,
  Modal,
  Switch,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  Percent,
  Phone,
  Sparkles,
  User,
} from '@/shared/icons';
import { rupeesToPaise } from '@/shared/utils/helpers';
import { useCreateTpo } from '../hooks/useAdminTpos';
import {
  buildTpoCredentialsWhatsAppUrl,
  buildTpoLoginLink,
  buildTpoRegistrationLink,
  buildWhatsAppShareUrl,
  formatTpoCommission,
} from '../utils/tpoShare';

const INITIAL_FORM = {
  name: '',
  college: '',
  email: '',
  phone: '',
  commissionType: 'FIXED',
  commissionInput: '200',
  createPortalAccount: true,
  password: '',
  sendEmail: true,
};

const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

export function CreateTpoModal({ open, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [createdTpo, setCreatedTpo] = useState(null);

  const createTpoMutation = useCreateTpo();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const name = formData.name.trim();
    const college = formData.college.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const rawCommission = formData.commissionInput === '' ? 0 : Number(formData.commissionInput);

    if (!name) {
      errors.name = 'TPO full name is required.';
    } else if (name.length < 2) {
      errors.name = 'TPO name must be at least 2 characters.';
    }

    if (!college) {
      errors.college = 'College or institution name is required.';
    } else if (college.length < 2) {
      errors.college = 'College name must be at least 2 characters.';
    }

    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!phone) {
      errors.phone = 'Phone / WhatsApp number is required.';
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = 'Enter a valid phone number (at least 7 digits).';
    }

    if (Number.isNaN(rawCommission) || rawCommission < 0) {
      errors.commissionValue = 'Enter a valid non-negative commission value.';
    } else if (formData.commissionType === 'PERCENTAGE' && rawCommission > 100) {
      errors.commissionValue = 'Percentage cannot exceed 100%.';
    } else if (formData.commissionType === 'FIXED' && rawCommission > 100000) {
      errors.commissionValue = 'Fixed commission cannot exceed ₹1,00,000.';
    }

    if (
      formData.createPortalAccount &&
      formData.password.trim() &&
      formData.password.trim().length < 8
    ) {
      errors.password = 'Custom password must be at least 8 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!validate()) return;

    const rawNum = formData.commissionInput === '' ? 0 : Number(formData.commissionInput);
    const commissionValue =
      formData.commissionType === 'PERCENTAGE'
        ? Math.round(rawNum * 100) // store percentage in basis points (10% -> 1000)
        : rupeesToPaise(rawNum); // store fixed INR in paise (₹200 -> 20000)

    try {
      const result = await createTpoMutation.mutateAsync({
        name: formData.name.trim(),
        college: formData.college.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        commissionType: formData.commissionType,
        commissionValue,
        portalEnabled: formData.createPortalAccount,
        createPortalAccount: formData.createPortalAccount,
        ...(formData.createPortalAccount && formData.password.trim()
          ? { password: formData.password.trim() }
          : {}),
        sendEmail: formData.sendEmail,
      });
      setCreatedTpo(result);
      toast.success(`Reference code ${result.referralCode} generated for ${result.name}!`);
    } catch (err) {
      const details = err?.details;
      if (Array.isArray(details) && details.length > 0) {
        const nextErrors = {};
        for (const item of details) {
          if (item?.field && item?.message) nextErrors[item.field] = item.message;
        }
        if (Object.keys(nextErrors).length > 0) {
          setFormErrors(nextErrors);
          return;
        }
      }
      toast.error(err?.message || 'Failed to generate TPO reference code.');
    }
  };

  const handleResetForAnother = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setCreatedTpo(null);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setCreatedTpo(null);
    onClose();
  };

  const registrationLink = createdTpo ? buildTpoRegistrationLink(createdTpo.referralCode) : '';
  const whatsappUrl = createdTpo ? buildWhatsAppShareUrl(createdTpo) : '';
  const credentials = createdTpo?.credentials || null;
  const credsWhatsappUrl =
    createdTpo && credentials ? buildTpoCredentialsWhatsAppUrl(createdTpo, credentials) : '';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={createdTpo ? 'TPO Reference Code Generated' : 'Add TPO & Generate Reference Code'}
      description={
        createdTpo
          ? 'Share the reference code for students, and send the private portal login confidentially to the TPO.'
          : 'Enter the Training & Placement Officer details, set their per-referral earning rate, and provision their private referral portal account.'
      }
      footer={
        createdTpo ? (
          <>
            <Button variant="outline" onClick={handleResetForAnother}>
              Add Another TPO
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={createTpoMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={Sparkles}
              onClick={handleSubmit}
              loading={createTpoMutation.isPending}
            >
              {createTpoMutation.isPending ? 'Generating Code…' : 'Generate Reference Code'}
            </Button>
          </>
        )
      }
    >
      {createdTpo ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  {createdTpo.name} — {createdTpo.college}
                </p>
                <p className="mt-0.5 text-xs text-emerald-800/80 dark:text-emerald-300/80">
                  {createdTpo.email} · {createdTpo.phone} · Commission:{' '}
                  <strong>
                    {formatTpoCommission(createdTpo.commissionType, createdTpo.commissionValue)}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Generated Reference Code (For Students)
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span
                data-testid="generated-tpo-code"
                className="font-mono text-xl font-bold tracking-wider text-brand-700 dark:text-brand-300"
              >
                {createdTpo.referralCode}
              </span>
              <CopyButton
                value={createdTpo.referralCode}
                label="Copy Code"
                copiedLabel="Copied"
                onCopy={() => toast.success('Reference code copied to clipboard.')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Direct Student Registration Link
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="min-w-0 flex-1 truncate text-xs text-slate-700 dark:text-slate-300">
                {registrationLink}
              </span>
              <CopyButton
                value={registrationLink}
                label="Copy Link"
                copiedLabel="Copied"
                onCopy={() => toast.success('Registration link copied to clipboard.')}
              />
            </div>
          </div>

          {credentials ? (
            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Confidential TPO Portal Credentials (Shown Once)
                </p>
                <CopyButton
                  value={`Login URL: ${buildTpoLoginLink()}\nEmail: ${credentials.email}\nPassword: ${credentials.password}`}
                  label="Copy Credentials"
                  copiedLabel="Copied"
                  size="sm"
                  onCopy={() => toast.success('Private TPO credentials copied.')}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-amber-200/80 dark:bg-slate-900 dark:ring-amber-900/50">
                  <span className="text-[11px] text-slate-500">Login Email</span>
                  <p className="font-mono font-semibold text-slate-900 dark:text-white">
                    {credentials.email}
                  </p>
                </div>
                <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-amber-200/80 dark:bg-slate-900 dark:ring-amber-900/50">
                  <span className="text-[11px] text-slate-500">Temporary Password</span>
                  <p
                    data-testid="generated-tpo-password"
                    className="font-mono font-semibold text-brand-700 dark:text-brand-300"
                  >
                    {credentials.password}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
                When this TPO logs in at <span className="font-mono">/login</span>, they are
                automatically directed to their private referral count &amp; earnings portal.
                Students cannot see or access this portal.
              </p>

              <a
                href={credsWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Send Confidential Login via WhatsApp (TPO Only)</span>
                <ExternalLink className="h-3 w-3 opacity-80" aria-hidden="true" />
              </a>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Share to TPO on WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="TPO Full Name" htmlFor="tpo-name" required error={formErrors.name}>
              <Input
                id="tpo-name"
                placeholder="e.g. Dr. Rahul Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={createTpoMutation.isPending}
                leftIcon={User}
              />
            </FormField>

            <FormField
              label="College / Institution"
              htmlFor="tpo-college"
              required
              error={formErrors.college}
            >
              <Input
                id="tpo-college"
                placeholder="e.g. Pune Institute of Technology"
                value={formData.college}
                onChange={(e) => handleChange('college', e.target.value)}
                disabled={createTpoMutation.isPending}
                leftIcon={Building2}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Email Address" htmlFor="tpo-email" required error={formErrors.email}>
              <Input
                id="tpo-email"
                type="email"
                placeholder="tpo@college.edu"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={createTpoMutation.isPending}
                leftIcon={Mail}
              />
            </FormField>

            <FormField
              label="Phone / WhatsApp Number"
              htmlFor="tpo-phone"
              required
              error={formErrors.phone}
              hint="Used to pre-fill the WhatsApp share chat."
            >
              <Input
                id="tpo-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={createTpoMutation.isPending}
                leftIcon={Phone}
              />
            </FormField>
          </div>

          {/* Commission Configuration */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Referral Commission Rate (Paid Enrollments Only)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="Commission Model" htmlFor="tpo-commission-type">
                <select
                  id="tpo-commission-type"
                  value={formData.commissionType}
                  onChange={(e) => handleChange('commissionType', e.target.value)}
                  disabled={createTpoMutation.isPending}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="FIXED">Fixed ₹ per paid student</option>
                  <option value="PERCENTAGE">Percentage (%) of paid fee</option>
                </select>
              </FormField>

              <FormField
                label={
                  formData.commissionType === 'PERCENTAGE'
                    ? 'Commission Percentage (%)'
                    : 'Fixed Amount (₹)'
                }
                htmlFor="tpo-commission-value"
                error={formErrors.commissionValue}
              >
                <Input
                  id="tpo-commission-value"
                  type="number"
                  min="0"
                  max={formData.commissionType === 'PERCENTAGE' ? '100' : '100000'}
                  step={formData.commissionType === 'PERCENTAGE' ? '0.5' : '1'}
                  placeholder={formData.commissionType === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 200'}
                  value={formData.commissionInput}
                  onChange={(e) => handleChange('commissionInput', e.target.value)}
                  disabled={createTpoMutation.isPending}
                  leftIcon={formData.commissionType === 'PERCENTAGE' ? Percent : IndianRupee}
                />
              </FormField>
            </div>
          </div>

          {/* Private TPO Portal Access */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Provision Private TPO Portal Access
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Creates a private TPO-role login so this TPO can check their referral count &amp;
                  earnings. Invisible to students.
                </p>
              </div>
              <Switch
                size="sm"
                checked={formData.createPortalAccount}
                onChange={(next) => handleChange('createPortalAccount', next)}
                aria-label="Provision private TPO portal access"
              />
            </div>

            {formData.createPortalAccount ? (
              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <FormField
                  label="Initial Password (Optional)"
                  htmlFor="tpo-portal-password"
                  error={formErrors.password}
                  hint="Leave blank to auto-generate a secure password."
                >
                  <Input
                    id="tpo-portal-password"
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    disabled={createTpoMutation.isPending}
                    leftIcon={KeyRound}
                  />
                </FormField>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Email credentials to TPO
                  </span>
                  <Switch
                    size="sm"
                    checked={formData.sendEmail}
                    onChange={(next) => handleChange('sendEmail', next)}
                    aria-label="Email credentials to TPO"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </form>
      )}
    </Modal>
  );
}

export default CreateTpoModal;
