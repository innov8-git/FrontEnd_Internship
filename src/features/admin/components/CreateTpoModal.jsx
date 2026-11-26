import { useState } from 'react';
import {
  Button,
  CopyButton,
  FormField,
  Input,
  Modal,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from '@/shared/icons';
import { useCreateTpo } from '../hooks/useAdminTpos';
import { buildTpoRegistrationLink, buildWhatsAppShareUrl } from '../utils/tpoShare';

const INITIAL_FORM = {
  name: '',
  college: '',
  email: '',
  phone: '',
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!validate()) return;

    try {
      const result = await createTpoMutation.mutateAsync({
        name: formData.name.trim(),
        college: formData.college.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={createdTpo ? 'TPO Reference Code Generated' : 'Add TPO & Generate Reference Code'}
      description={
        createdTpo
          ? 'Share this unique code or direct registration link with the TPO via WhatsApp.'
          : 'Enter the Training & Placement Officer details. A unique reference code incorporating the TPO initials will be generated automatically.'
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
                  {createdTpo.email} · {createdTpo.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Generated Reference Code
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
        </form>
      )}
    </Modal>
  );
}

export default CreateTpoModal;
