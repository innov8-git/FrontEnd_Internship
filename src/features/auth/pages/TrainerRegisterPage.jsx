import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  FormField,
  Input,
  Select,
  Textarea,
  toast,
} from '@/shared/components/ui';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  LinkIcon,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UploadCloud,
  User,
} from '@/shared/icons';
import { ROUTES } from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import { submitTrainerApplication } from '@/services/trainerApplicationService';
import { shortId } from '@/shared/utils/helpers';

const DOMAIN_OPTIONS = [
  { value: 'Full Stack Web Development', label: 'Full Stack Web Development' },
  { value: 'Frontend Development (React / Next.js)', label: 'Frontend Development (React / Next.js)' },
  { value: 'Backend Development (Node.js / Express / Java / .NET)', label: 'Backend Development (Node.js / Express / Java / .NET)' },
  { value: 'Mobile App Development (Flutter / React Native / Android)', label: 'Mobile App Development (Flutter / React Native / Android)' },
  { value: 'AI / Machine Learning & Data Science', label: 'AI / Machine Learning & Data Science' },
  { value: 'DevOps & Cloud Computing (AWS / Docker)', label: 'DevOps & Cloud Computing (AWS / Docker)' },
  { value: 'Cybersecurity & Ethical Hacking', label: 'Cybersecurity & Ethical Hacking' },
  { value: 'General Mentorship & Soft Skills', label: 'General Mentorship & Soft Skills' },
  { value: '__OTHER__', label: 'Other (specify below)' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'Less than 1 year', label: 'Less than 1 year' },
  { value: '1-3 years', label: '1 - 3 years' },
  { value: '3-5 years', label: '3 - 5 years' },
  { value: '5-8 years', label: '5 - 8 years' },
  { value: '8-12 years', label: '8 - 12 years' },
  { value: '12+ years', label: '12+ years' },
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const LINKEDIN_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function TrainerRegisterPage() {
  useDocumentTitle('Register as Trainer');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    organization: '',
    domain: 'Full Stack Web Development',
    customDomain: '',
    experience: '3-5 years',
    bio: '',
    website: '', // honeypot
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  const handleChange = (field, rawValue) => {
    const value =
      rawValue && typeof rawValue === 'object' && 'target' in rawValue
        ? rawValue.target.value
        : rawValue;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    if (serverError) setServerError('');
  };

  const handleFilePick = (file) => {
    if (!file) return;
    const name = file.name || '';
    const dotIdx = name.lastIndexOf('.');
    const ext = dotIdx >= 0 ? name.slice(dotIdx).toLowerCase() : '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Only PDF, DOC, and DOCX files are accepted.',
      }));
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Resume file must be 5 MB or smaller.',
      }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: null }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Enter your full name (at least 2 characters).';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Enter your mobile number.';
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      nextErrors.phone = 'Enter a valid mobile number (7-20 digits).';
    }
    if (!formData.linkedinUrl.trim()) {
      nextErrors.linkedinUrl = 'Enter your LinkedIn profile URL.';
    } else if (!LINKEDIN_REGEX.test(formData.linkedinUrl.trim())) {
      nextErrors.linkedinUrl = 'Enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname).';
    }
    if (!formData.organization.trim() || formData.organization.trim().length < 2) {
      nextErrors.organization = 'Enter your company or college name.';
    }
    const resolvedDomain =
      formData.domain === '__OTHER__' ? formData.customDomain.trim() : formData.domain.trim();
    if (!resolvedDomain || resolvedDomain.length < 2) {
      nextErrors.domain = 'Specify your primary mentoring domain.';
    }
    if (!formData.experience.trim()) {
      nextErrors.experience = 'Select your experience level.';
    }
    if (!resumeFile) {
      nextErrors.resume = 'Please upload your resume (PDF, DOC, or DOCX, max 5 MB).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedDomain =
      formData.domain === '__OTHER__' ? formData.customDomain.trim() : formData.domain.trim();

    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await submitTrainerApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        organization: formData.organization.trim(),
        domain: resolvedDomain,
        experience: formData.experience.trim(),
        bio: formData.bio.trim() || undefined,
        resume: resumeFile,
        website: formData.website,
      });

      setSubmittedApp(result);
      toast.success('Trainer application submitted! Our admin team will review it shortly.');
    } catch (err) {
      const details = Array.isArray(err?.details) ? err.details : [];
      if (details.length > 0) {
        const mapped = {};
        for (const item of details) {
          if (item?.field && item?.message) mapped[item.field] = item.message;
        }
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      setServerError(err?.message || 'Could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedApp) {
    return (
      <section className="bg-slate-50 py-14 dark:bg-slate-950">
        <div className="container-page max-w-xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Application Submitted!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Thank you, <span className="font-semibold text-slate-900 dark:text-white">{submittedApp.fullName || formData.fullName}</span>. Your request to join ALFRE as a trainer has been sent to our admin team.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-800/60">
              <dl className="space-y-2">
                {submittedApp._id ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">Reference ID</dt>
                    <dd className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      #{shortId(submittedApp._id)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{submittedApp.email || formData.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">Domain</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{submittedApp.domain}</dd>
                </div>
                {submittedApp.resumeName ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">Resume</dt>
                    <dd className="truncate font-medium text-slate-900 dark:text-slate-100">{submittedApp.resumeName}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="mt-5 rounded-lg border border-brand-200 bg-brand-50/70 p-3.5 text-left text-xs leading-relaxed text-brand-900 dark:border-brand-800/50 dark:bg-brand-950/30 dark:text-brand-200">
              <span className="font-semibold">What happens next?</span> Once an administrator reviews and approves your application, your trainer account and login credentials will be created and sent to{' '}
              <span className="font-semibold">{submittedApp.email || formData.email}</span>.
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to={ROUTES.HOME} variant="outline" leftIcon={ArrowLeft}>
                Back to Home
              </Button>
              <Button as={Link} to={ROUTES.LOGIN}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-10 sm:py-14 dark:bg-slate-950">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          {/* Header Banner */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-7 text-white sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Join the Mentorship Team</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Register as a Trainer
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-indigo-100">
              Share your profile and resume to mentor aspiring engineers on real production projects.
              Once approved by our admin team, you will receive your trainer portal login credentials.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6 sm:p-8">
            {serverError ? (
              <Alert variant="danger" title="Submission failed">
                {serverError}
              </Alert>
            ) : null}

            {/* Hidden anti-spam honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="trainer-website">Website</label>
              <input
                id="trainer-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Full Name" htmlFor="app-fullName" required error={errors.fullName}>
                <Input
                  id="app-fullName"
                  placeholder="e.g. Priya Sharma"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  disabled={isSubmitting}
                  leftIcon={User}
                  autoComplete="name"
                />
              </FormField>

              <FormField
                label="Email Address"
                htmlFor="app-email"
                required
                hint="Used to send your trainer login credentials upon approval."
                error={errors.email}
              >
                <Input
                  id="app-email"
                  type="email"
                  placeholder="priya.sharma@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isSubmitting}
                  leftIcon={Mail}
                  autoComplete="email"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Mobile Number" htmlFor="app-phone" required error={errors.phone}>
                <Input
                  id="app-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={isSubmitting}
                  leftIcon={Phone}
                  autoComplete="tel"
                />
              </FormField>

              <FormField
                label="LinkedIn Profile"
                htmlFor="app-linkedinUrl"
                required
                error={errors.linkedinUrl}
              >
                <Input
                  id="app-linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  disabled={isSubmitting}
                  leftIcon={LinkIcon}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Company / College Name"
                htmlFor="app-organization"
                required
                error={errors.organization}
              >
                <Input
                  id="app-organization"
                  placeholder="e.g. Infosys / IIT Bombay"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  disabled={isSubmitting}
                  leftIcon={Building2}
                  autoComplete="organization"
                />
              </FormField>

              <FormField label="Experience" htmlFor="app-experience" required error={errors.experience}>
                <Select
                  id="app-experience"
                  options={EXPERIENCE_OPTIONS}
                  value={formData.experience}
                  onChange={(val) => handleChange('experience', val)}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Primary Domain"
                htmlFor="app-domain"
                required
                error={errors.domain}
                className={formData.domain === '__OTHER__' ? '' : 'sm:col-span-2'}
              >
                <Select
                  id="app-domain"
                  options={DOMAIN_OPTIONS}
                  value={formData.domain}
                  onChange={(val) => handleChange('domain', val)}
                  disabled={isSubmitting}
                />
              </FormField>

              {formData.domain === '__OTHER__' ? (
                <FormField label="Specify Domain" htmlFor="app-customDomain" required error={errors.domain}>
                  <Input
                    id="app-customDomain"
                    placeholder="e.g. Embedded Systems / QA Automation"
                    value={formData.customDomain}
                    onChange={(e) => handleChange('customDomain', e.target.value)}
                    disabled={isSubmitting}
                    leftIcon={Briefcase}
                  />
                </FormField>
              ) : null}
            </div>

            {/* Resume File Upload */}
            <FormField
              label="Resume (PDF, DOC, or DOCX — Max 5 MB)"
              htmlFor="app-resume"
              required
              error={errors.resume}
            >
              <input
                ref={fileInputRef}
                id="app-resume"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                disabled={isSubmitting}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFilePick(file);
                  e.target.value = '';
                }}
              />

              {resumeFile ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatBytes(resumeFile.size)} · Ready to upload
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove resume"
                      disabled={isSubmitting}
                      onClick={() => setResumeFile(null)}
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer?.files?.[0];
                    if (file) handleFilePick(file);
                  }}
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-brand-500"
                >
                  <UploadCloud className="h-8 w-8 text-brand-500" />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    Click to upload your resume or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    PDF, DOC, or DOCX up to 5 MB
                  </p>
                </button>
              )}
            </FormField>

            <FormField
              label="Short Bio / Mentoring Experience (Optional)"
              htmlFor="app-bio"
              error={errors.bio}
            >
              <Textarea
                id="app-bio"
                rows={3}
                placeholder="Tell us briefly about your technical background, teaching/mentoring experience, or key skills..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              <span>
                Your resume and contact details are kept private and visible only to ALFRE
                administrators for trainer onboarding review.
              </span>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <p className="text-center text-sm text-slate-600 sm:text-left dark:text-slate-400">
                Already have trainer credentials?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Log in
                </Link>
              </p>
              <Button type="submit" size="lg" loading={isSubmitting} leftIcon={GraduationCap}>
                {isSubmitting ? 'Submitting Application…' : 'Submit Trainer Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default TrainerRegisterPage;
