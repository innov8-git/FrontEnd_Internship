import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Modal } from '@/shared/components/ui';
import { DomainAssessmentFlow } from '@/features/assessment/components/DomainAssessmentFlow';
import { AuthContext } from '@/shared/context/AuthContext';
import { ROUTES, paths } from '@/shared/constants';
import { getDomainProjects } from '@/services/projectService';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  FileText,
  FolderGit2,
  Globe,
  Loader2,
  Phone,
  Send,
  Sparkles,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

/**
 * ThemedSelect
 * Accessible dropdown styled with the platform's warm brand design system.
 * Replaces browser-native OS popups with themed floating option menus.
 */
function ThemedSelect({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => (typeof opt === 'object' ? opt.value : opt) === value);
  const selectedLabel =
    (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) ??
    value ??
    placeholder;

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          onClick={() => setIsOpen((prev) => !prev)}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 cursor-pointer"
        >
          {label}
        </label>
      )}

      {/* Accessible native select preserved for form submissions & test runners */}
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
      >
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>

      {/* Custom Themed Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-sm text-left shadow-xs transition-all',
          'dark:bg-slate-900',
          error
            ? 'border-rose-500 ring-1 ring-rose-500/50 text-slate-900 dark:text-white dark:border-rose-500'
            : isOpen
              ? 'border-brand-500 ring-2 ring-brand-500/20 text-slate-900 dark:text-white dark:border-brand-400 dark:ring-brand-400/20'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600',
        )}
      >
        <span className="truncate font-medium">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180 text-brand-600 dark:text-brand-400',
          )}
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}

      {/* Custom Themed Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-trigger`}
          className="absolute z-50 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
        >
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optValue === value;
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left',
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
              >
                <span>{optLabel}</span>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * InternshipDetailsModal
 * Modular modal displaying comprehensive role overviews, 12/13 roles and responsibilities,
 * skills required, real-world deliverables, and application workflows.
 * Supports switching between Web and App development tracks.
 */
export function InternshipDetailsModal({
  partner,
  initialRole,
  open,
  onClose,
  initialTab = 'details',
}) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [applyStep, setApplyStep] = useState(1);
  const [domainProjects, setDomainProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: '',
    college: '',
    selectedDomain: '',
    duration: '3 Months',
    graduationYear: '2026',
    githubUrl: '',
    preferredTrack: 'web',
  });

  const handleApplyTabClick = () => {
    if (auth && !auth.isAuthenticated) {
      navigate(paths.login(location.pathname === '/' ? ROUTES.CATALOG : location.pathname + location.search));
      return;
    }
    setErrors({});
    setApplyStep(1);
    setActiveTab('apply');
  };

  useEffect(() => {
    if (auth?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || auth.user.name || '',
        email: prev.email || auth.user.email || '',
      }));
    }
  }, [auth]);

  // Sync state when modal opens or partner/initialRole changes
  useEffect(() => {
    if (partner) {
      const defaultRole =
        initialRole ||
        partner.roles?.[0] ||
        partner.internship;
      setSelectedRole(defaultRole);
      const defaultDomain =
        partner.assignedDomains?.[0] || partner.domain || '';
      setFormData((prev) => ({
        ...prev,
        preferredTrack: defaultRole?.track || 'web',
        selectedDomain:
          partner.assignedDomains?.includes(prev.selectedDomain)
            ? prev.selectedDomain
            : defaultDomain,
        duration: prev.duration || '3 Months',
      }));
      setActiveTab(initialTab);
      setApplyStep(1);
      setSelectedProject(null);
      setDomainProjects([]);
      setSubmitted(false);
      setErrors({});
    }
  }, [partner, initialRole, initialTab, open]);

  // Fetch real backend projects under the selected domain when entering Step 2
  useEffect(() => {
    if (activeTab !== 'apply' || applyStep !== 2 || !formData.selectedDomain) return;
    let isCancelled = false;
    setLoadingProjects(true);

    getDomainProjects(formData.selectedDomain)
      .then((res) => {
        if (isCancelled) return;
        const items = res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
        setDomainProjects(items);
        if (items.length > 0) {
          const defaultProj = items.find((p) => p.isDefault) || items[0];
          setSelectedProject((prev) => {
            if (prev) {
              const prevId = prev.id || prev._id || prev.slug;
              const exists = items.find((p) => (p.id || p._id || p.slug) === prevId);
              if (exists) return exists;
            }
            return defaultProj;
          });
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.warn('Could not fetch domain projects from backend:', err);
        setDomainProjects([]);
      })
      .finally(() => {
        if (!isCancelled) setLoadingProjects(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeTab, applyStep, formData.selectedDomain]);

  if (!partner) return null;

  const currentRole = selectedRole || initialRole || partner.role || partner.roles?.[0] || partner.internship;

  const validate = () => {
    const errs = {};
    const fullName = String(formData.fullName ?? '').trim();
    const email = String(formData.email ?? '').trim();
    const phone = String(formData.phone ?? '').trim();
    const college = String(formData.college ?? '').trim();
    const selectedDomain = String(formData.selectedDomain ?? '').trim();
    const duration = String(formData.duration ?? '').trim();
    const githubUrl = String(formData.githubUrl ?? '').trim();

    if (!fullName) {
      errs.fullName = 'Please enter your full name.';
    } else if (fullName.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    } else if (!/[a-zA-Z]/.test(fullName)) {
      errs.fullName = 'Full name must contain letters and cannot be only numbers.';
    }

    if (!email) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!phone) {
      errs.phone = 'Please enter your contact phone number.';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(phone)) {
      errs.phone = 'Please enter a valid phone number (e.g. +91 98765 43210).';
    }

    if (!college) {
      errs.college = 'Please enter your college or university name.';
    } else if (/^\d+$/.test(college.replace(/[\s\-_,.]/g, '')) || !/[a-zA-Z]/.test(college)) {
      errs.college = 'College or university name cannot be only numbers. Please enter a valid institution name.';
    } else if (college.replace(/[^a-zA-Z]/g, '').length < 2) {
      errs.college = 'College or university name must contain at least 2 letters.';
    } else if (college.length < 2) {
      errs.college = 'Please enter a valid institution name.';
    }

    if (!selectedDomain) {
      errs.selectedDomain = 'Please select a domain.';
    }

    if (!duration) {
      errs.duration = 'Please select an internship duration.';
    }

    if (githubUrl && !/^(https?:\/\/)?([\w.-]+)+([/\w\-._~:?#[\]@!$&'()*+,;=.]*)*$/i.test(githubUrl)) {
      errs.githubUrl = 'Please enter a valid URL (e.g. https://github.com/username).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    const val = String(formData[field] ?? '').trim();
    if (!val) return;
    if (field === 'college') {
      if (/^\d+$/.test(val.replace(/[\s\-_,.]/g, '')) || !/[a-zA-Z]/.test(val)) {
        setErrors((prev) => ({
          ...prev,
          college: 'College or university name cannot be only numbers. Please enter a valid institution name.',
        }));
      } else if (val.replace(/[^a-zA-Z]/g, '').length < 2) {
        setErrors((prev) => ({
          ...prev,
          college: 'College or university name must contain at least 2 letters.',
        }));
      }
    } else if (field === 'fullName') {
      if (val.length < 2) {
        setErrors((prev) => ({ ...prev, fullName: 'Full name must be at least 2 characters.' }));
      } else if (!/[a-zA-Z]/.test(val)) {
        setErrors((prev) => ({ ...prev, fullName: 'Full name must contain letters and cannot be only numbers.' }));
      }
    } else if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      }
    } else if (field === 'phone') {
      if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(val)) {
        setErrors((prev) => ({ ...prev, phone: 'Please enter a valid phone number (e.g. +91 98765 43210).' }));
      }
    }
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setApplyStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setApplyStep(1);
    setSelectedProject(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleResetAndClose}
      size={submitted ? '2xl' : 'xl'}
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
              {partner.assignedDomains?.join(' & ') || partner.domain} · {partner.location}
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
          Program Overview & Responsibilities
        </button>
        <button
          type="button"
          onClick={handleApplyTabClick}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'apply'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {submitted ? (
            <>
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>{formData.selectedDomain || partner.domain} Enrollment</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Apply for this Role</span>
            </>
          )}
        </button>
      </div>

      <div className="py-4">
        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Header summary banner */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{currentRole.designation}</span>
                  </div>
                  <h3 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {currentRole.role}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentRole.trackType}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <FileText className="h-3.5 w-3.5" />
                    Internship Completion Letter
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    <Users className="h-3.5 w-3.5" />
                    1-on-1 Mentor
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                    <Phone className="h-3.5 w-3.5" />
                    Placement Support
                  </span>
                </div>
              </div>

              {/* Meta stats bar */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-3 sm:grid-cols-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Duration: {currentRole.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    100% Online Remote
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{currentRole.applicantsCount} candidates enrolled</span>
                </div>
              </div>
            </div>

            {/* About the role */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Role Overview
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {currentRole.description}
              </p>
            </div>

            {/* Roles and Responsibilities (12 points for Web, 13 points for App) */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Role Responsibilities & What You Will Build
                </h4>
                <span className="text-xs font-medium text-slate-400">
                  {currentRole.trackLabel} Track ({currentRole.rolesAndResponsibilities?.length || 12} Core Areas)
                </span>
              </div>
              <ul className="mt-3 space-y-2.5">
                {(currentRole.rolesAndResponsibilities || currentRole.keyDeliverables).map(
                  (item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Technical Skills Required */}
            {currentRole.skillsRequired && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Technical Skills Required
                </h4>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {currentRole.skillsRequired.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perks & Benefits */}
            <div className="rounded-xl border border-brand-200/60 bg-brand-50/40 p-4 dark:border-brand-900/40 dark:bg-brand-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
                Key Benefits & Career Outcomes
              </h4>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {currentRole.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <Button variant="outline" onClick={handleResetAndClose}>
                Close
              </Button>
              <Button
                variant="primary"
                rightIcon={Send}
                onClick={handleApplyTabClick}
              >
                Apply for {currentRole.designation}
              </Button>
            </div>
          </div>
        ) : (
          /* Apply Tab */
          <div>
            {submitted ? (
              <DomainAssessmentFlow
                candidate={formData}
                domain={formData.selectedDomain || partner.domain || 'Banking'}
                partner={partner}
                role={currentRole}
                project={selectedProject}
                onClose={handleResetAndClose}
              />
            ) : (
              <div className="space-y-5">
                {/* 2-Step Progress Indicator */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                        applyStep === 1
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'bg-emerald-600 text-white dark:bg-emerald-500',
                      )}
                    >
                      {applyStep > 1 ? <Check className="h-3.5 w-3.5" /> : '1'}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        applyStep === 1
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400',
                      )}
                    >
                      Step 1: Candidate Details
                    </span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-700">───</span>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                        applyStep === 2
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'border border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
                      )}
                    >
                      2
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        applyStep === 2
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400',
                      )}
                    >
                      Step 2: Assigned Project
                    </span>
                  </div>
                </div>

                {applyStep === 1 ? (
                  /* Step 1: Candidate Form */
                  <form onSubmit={handleStep1Next} className="space-y-4">
                    <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                      <p className="font-semibold">
                        Applying to: {partner.name} · {currentRole.designation}
                      </p>
                      <p className="text-[11px] text-blue-700 dark:text-blue-300">
                        Role: {currentRole.role} | Domains: {partner.assignedDomains?.join(' & ') || partner.domain} | Track: {currentRole.trackType}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Full Name"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        error={errors.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        error={errors.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Phone Number"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        error={errors.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                      />
                      <Input
                        label="College / University"
                        required
                        placeholder="e.g. IIT Bombay / NIT Trichy"
                        value={formData.college}
                        error={errors.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        onBlur={() => handleBlur('college')}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <ThemedSelect
                        id="apply-domain-select"
                        label={`Select Domain Offered by ${partner.name} *`}
                        value={formData.selectedDomain}
                        error={errors.selectedDomain}
                        onChange={(val) => handleInputChange('selectedDomain', val)}
                        options={
                          partner.assignedDomains && partner.assignedDomains.length > 0
                            ? partner.assignedDomains
                            : [partner.domain || 'General Engineering']
                        }
                      />
                      <ThemedSelect
                        id="apply-duration-select"
                        label="Select Duration *"
                        value={formData.duration}
                        error={errors.duration}
                        onChange={(val) => handleInputChange('duration', val)}
                        options={['1 Month', '2 Months', '3 Months', '6 Months']}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <ThemedSelect
                        id="apply-graduation-year"
                        label="Graduation Year"
                        value={formData.graduationYear}
                        onChange={(val) => handleInputChange('graduationYear', val)}
                        options={[
                          { value: '2025', label: '2025' },
                          { value: '2026', label: '2026' },
                          { value: '2027', label: '2027' },
                          { value: '2028', label: '2028' },
                          { value: 'Other', label: 'Already Graduated' },
                        ]}
                      />
                      <Input
                        label="GitHub Profile URL"
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        error={errors.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      <Button variant="outline" type="button" onClick={() => setActiveTab('details')}>
                        Back to Details
                      </Button>
                      <Button variant="primary" type="submit" rightIcon={ArrowRight}>
                        Next
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Assigned Domain Projects */
                  <div className="space-y-4">
                    <div className="rounded-xl border border-brand-200/80 bg-brand-50/60 p-3.5 text-xs text-brand-900 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-200">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <FolderGit2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        <span>Assigned Industry Project for {formData.selectedDomain}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        Select <strong>one</strong> project below for your {formData.selectedDomain} ({currentRole.trackType}) internship.
                      </p>
                    </div>

                    {loadingProjects ? (
                      <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
                        <span className="mt-2 text-xs">Loading admin assigned projects...</span>
                      </div>
                    ) : domainProjects.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {domainProjects.map((proj, idx) => {
                          const projId = proj.id || proj._id || proj.slug || `proj-${idx}`;
                          const selectedId = selectedProject?.id || selectedProject?._id || selectedProject?.slug;
                          const isSelected = Boolean(selectedId && selectedId === projId);
                          return (
                            <div
                              key={projId}
                              onClick={() => setSelectedProject(proj)}
                              className={cn(
                                'cursor-pointer rounded-xl border p-4 transition-all',
                                isSelected
                                  ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-brand-950/30'
                                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                      {proj.title}
                                    </h5>
                                    {proj.isDefault && (
                                      <Badge variant="primary" size="sm">
                                        Assigned Default
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                                    {proj.description || 'Enterprise production project with hands-on daily tasks.'}
                                  </p>
                                </div>
                                <div
                                  className={cn(
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition-all',
                                    isSelected
                                      ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500'
                                      : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800',
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  Tech Stack:
                                </span>
                                {(proj.webTechStack || ['React', 'Node.js', 'PostgreSQL']).slice(0, 4).map((tech, i) => (
                                  <span
                                    key={i}
                                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                <span className="ml-auto text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                                  {formData.duration} Tasks Included
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-5 text-center dark:border-slate-800 dark:bg-slate-900/50">
                        <FolderGit2 className="mx-auto h-7 w-7 text-slate-400" />
                        <h5 className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formData.selectedDomain} Core Enterprise System
                        </h5>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          Your domain track includes fixed daily engineering deliverables designed by industry leads.
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Pre-assigned Project Blueprint Verified</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        type="button"
                        leftIcon={ArrowLeft}
                        onClick={() => setApplyStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        type="button"
                        rightIcon={Send}
                        onClick={handleFinalSubmit}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
