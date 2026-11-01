import { useState } from 'react';
import { Badge, Button, Input, Modal } from '@/shared/components/ui';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Globe,
  Phone,
  Send,
  Users,
} from '@/shared/icons';

export function InternshipDetailsModal({ partner, open, onClose, initialTab = 'details' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    graduationYear: '2026',
    githubUrl: '',
  });

  if (!partner) return null;

  const { internship } = partner;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleResetAndClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm shadow-md ${partner.logoBg}`}
          >
            {partner.logoInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">{partner.name}</span>
              <Badge variant="success" className="inline-flex items-center gap-1 text-[11px] py-0 px-1.5">
                <BadgeCheck className="h-3 w-3" />
                Verified Partner
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {partner.domain} · {partner.location}
            </p>
          </div>
        </div>
      }
      description={null}
    >
      {/* Navigation tabs inside modal */}
      <div className="mt-2 flex border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveTab('details');
            setSubmitted(false);
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Code2 className="h-4 w-4" />
          Program Overview & Projects
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'apply'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Send className="h-4 w-4" />
          Apply for this Role
        </button>
      </div>

      <div className="py-4">
        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Header summary banner */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {internship.role}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{internship.trackType}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <FileText className="h-3.5 w-3.5" />
                    Experience Letter
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    <Users className="h-3.5 w-3.5" />
                    1-on-1 Mentor
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                    <Phone className="h-3.5 w-3.5" />
                    Placement Calls
                  </span>
                </div>
              </div>

              {/* Meta stats bar */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-3 sm:grid-cols-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Duration: {internship.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    100% Online Remote
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{internship.applicantsCount} candidates enrolled</span>
                </div>
              </div>
            </div>

            {/* About the role */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                About the Internship & Track
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {internship.description}
              </p>
            </div>

            {/* Real Production Deliverables & Role Responsibilities */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Role Responsibilities & What You Will Build
              </h4>
              <ul className="mt-3 space-y-2.5">
                {internship.keyDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Technologies & Tools You Will Use
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {internship.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Perks & Benefits */}
            <div className="rounded-xl border border-brand-200/60 bg-brand-50/40 p-4 dark:border-brand-900/40 dark:bg-brand-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
                Key Benefits & Career Outcomes
              </h4>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {internship.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal action bar */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row pt-2">
              <Button variant="outline" onClick={handleResetAndClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() => setActiveTab('apply')}>
                Apply for {internship.role}
              </Button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  Application Submitted to {partner.name}!
                </h3>
                <p className="mt-2 max-w-md mx-auto text-sm text-slate-600 dark:text-slate-300">
                  Thank you, <strong className="text-slate-900 dark:text-white">{formData.fullName || 'Candidate'}</strong>!
                  Your application for the <strong className="text-slate-900 dark:text-white">{internship.role}</strong> ({partner.domain})
                  has been received. You will be scheduled for placement screening and interview drives. Confirmation sent to{' '}
                  <span className="text-brand-600 dark:text-brand-400">{formData.email || 'your email'}</span>.
                </p>
                <div className="mt-6">
                  <Button variant="primary" onClick={handleResetAndClose}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  Applying for <strong>{internship.role}</strong> at <strong>{partner.name}</strong> ({partner.domain})
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name" required>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Phone Number" required>
                    <Input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </FormField>

                  <FormField label="College / University" required>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. IIT Bombay / Anna University"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Graduation Year" required>
                    <select
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="Other">Already Graduated</option>
                    </select>
                  </FormField>

                  <FormField label="GitHub / Portfolio Link">
                    <Input
                      type="url"
                      placeholder="https://github.com/yourhandle"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                  >
                    Back to Details
                  </Button>
                  <Button type="submit" variant="primary">
                    Submit Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
