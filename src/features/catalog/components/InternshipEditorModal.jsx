import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Select, toast } from '@/shared/components/ui';
import { uploadPartnerLogo } from '@/services/internshipService';
import { PartnerLogo } from '@/features/internships/components/PartnerLogo';
import { useCatalogOptions } from '../hooks/useCatalogAdmin';
import {
  BASE_APP_RESPONSIBILITIES,
  BASE_APP_SKILLS,
  BASE_WEB_RESPONSIBILITIES,
  BASE_WEB_SKILLS,
} from '@/features/internships/data/companyInternshipsData';
import {
  COLOR_THEMES,
  DEFAULT_CONCESSION_PERCENT,
  DEFAULT_DURATION_PRICES,
  PRICING_DURATIONS,
  formatInr,
  normalizePricing,
} from '@/features/internships/data/companyInternshipsStore';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  IndianRupee,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  X,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

export function InternshipEditorModal({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const isEdit = Boolean(initialData?.role?.id);
  const existingRole = initialData?.role;
  const existingPartner = initialData?.partner;

  const [activeTab, setActiveTab] = useState('company');

  // Dynamic Catalog Options from backend (Domains & Designations)
  const domainsQuery = useCatalogOptions('domain');
  const designationsQuery = useCatalogOptions('designation');

  const catalogDomains = useMemo(() => {
    return (domainsQuery.data ?? [])
      .filter((d) => d.status === 'PUBLISHED')
      .map((d) => d.name)
      .filter(Boolean);
  }, [domainsQuery.data]);

  const catalogDesignations = useMemo(() => {
    return (designationsQuery.data ?? [])
      .filter((d) => d.status === 'PUBLISHED')
      .map((d) => d.name)
      .filter(Boolean);
  }, [designationsQuery.data]);

  const defaultDesignationRef = useRef('Trainee Software Engineer');
  defaultDesignationRef.current = catalogDesignations[0] || 'Trainee Software Engineer';

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);
  const [themeColor, setThemeColor] = useState('blue');
  const [tagline, setTagline] = useState('');
  const [assignedDomains, setAssignedDomains] = useState('');
  const [workMode, setWorkMode] = useState('100% Online Remote');

  const [track, setTrack] = useState('web');
  const [roleTitle, setRoleTitle] = useState('Trainee Software Engineer');
  const [designation, setDesignation] = useState('Trainee Software Engineer – Web Development');
  const [trackType, setTrackType] = useState('Full Stack Web Engineering Track');
  const [duration, setDuration] = useState('1 to 6 Months');
  const [applicantsCount, setApplicantsCount] = useState(130);
  const [description, setDescription] = useState('');

  const [responsibilities, setResponsibilities] = useState([]);
  const [newRespInput, setNewRespInput] = useState('');

  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [perks, setPerks] = useState([
    'Official Internship Completion Letter',
    'Dedicated 1-on-1 Industry Mentor',
    'Placement Support & Interview Drives',
  ]);
  const [techStack, setTechStack] = useState('HTML5, CSS3, JavaScript, React.js, Node.js, REST APIs, Git');
  const [pricing, setPricing] = useState(() => normalizePricing({}, []));

  const [errors, setErrors] = useState({});

  // Reset or Populate on open / change
  useEffect(() => {
    if (!open) return;

    if (existingRole && existingPartner) {
      setCompanyName(existingPartner.name || '');
      setLogoUrl(existingPartner.logoUrl || '');
      // Find theme color key if possible
      const foundTheme = Object.keys(COLOR_THEMES).find(
        (key) => COLOR_THEMES[key].logoBg === existingPartner.logoBg,
      ) || 'blue';
      setThemeColor(foundTheme);
      setTagline(existingPartner.tagline || '');
      setAssignedDomains(
        existingPartner.assignedDomains?.length
          ? existingPartner.assignedDomains.join(', ')
          : existingPartner.domain || '',
      );
      setWorkMode(existingRole.workMode || existingPartner.location || '100% Online Remote');

      setTrack(existingRole.track || 'web');
      setRoleTitle(existingRole.role || 'Trainee Software Engineer');
      setDesignation(existingRole.designation || 'Trainee Software Engineer – Web Development');
      setTrackType(existingRole.trackType || 'Full Stack Web Engineering Track');
      setDuration(existingRole.duration || '1 to 6 Months');
      setApplicantsCount(existingRole.applicantsCount || 130);
      setDescription(existingRole.description || '');

      setResponsibilities(
        existingRole.rolesAndResponsibilities?.length
          ? [...existingRole.rolesAndResponsibilities]
          : existingRole.track === 'web'
            ? [...BASE_WEB_RESPONSIBILITIES]
            : [...BASE_APP_RESPONSIBILITIES],
      );

      setSkills(
        existingRole.skillsRequired?.length
          ? [...existingRole.skillsRequired]
          : existingRole.track === 'web'
            ? [...BASE_WEB_SKILLS]
            : [...BASE_APP_SKILLS],
      );

      setPerks(
        existingRole.perks?.length
          ? [...existingRole.perks]
          : [
              'Official Internship Completion Letter',
              'Dedicated 1-on-1 Industry Mentor',
              'Placement Support & Interview Drives',
            ],
      );

      setTechStack(
        Array.isArray(existingRole.techStack)
          ? existingRole.techStack.join(', ')
          : 'HTML5, CSS3, JavaScript, React.js, Node.js',
      );
      const initialDomains = existingPartner.assignedDomains?.length
        ? existingPartner.assignedDomains
        : existingPartner.domain
          ? [existingPartner.domain]
          : [];
      setPricing(normalizePricing(existingRole.pricing || existingPartner.pricing || {}, initialDomains));
    } else {
      // New Internship Defaults
      setCompanyName('');
      setLogoUrl('');
      setThemeColor('blue');
      setTagline('');
      setAssignedDomains('');
      setWorkMode('100% Online Remote');

      setTrack('web');
      const defaultRole = defaultDesignationRef.current;
      setRoleTitle(defaultRole);
      setDesignation(`${defaultRole} – Web Development`);
      setTrackType('Full Stack Web Engineering Track');
      setDuration('1 to 6 Months');
      setApplicantsCount(100);
      setDescription('');

      setResponsibilities([...BASE_WEB_RESPONSIBILITIES]);
      setSkills([...BASE_WEB_SKILLS]);
      setPerks([
        'Official Internship Completion Letter',
        'Dedicated 1-on-1 Industry Mentor',
        'Placement Support & Interview Drives',
      ]);
      setTechStack('HTML5, CSS3, JavaScript, React.js, Node.js, REST APIs, Git');
      setPricing(normalizePricing({}, []));
    }

    setErrors({});
    setActiveTab('company');
  }, [open, existingRole, existingPartner]);

  // Handle Track switch: auto-update designation and trackType if untouched
  const handleTrackChange = (newTrack) => {
    setTrack(newTrack);
    const isWeb = newTrack === 'web';
    if (!isEdit || designation.includes('Development')) {
      const baseRole = roleTitle.trim() || catalogDesignations[0] || 'Trainee Software Engineer';
      setDesignation(`${baseRole} – ${isWeb ? 'Web Development' : 'App Development'}`);
      setTrackType(isWeb ? 'Full Stack Web Engineering Track' : 'Mobile Application Engineering Track');
    }
    if (responsibilities.length === 0) {
      setResponsibilities(isWeb ? [...BASE_WEB_RESPONSIBILITIES] : [...BASE_APP_RESPONSIBILITIES]);
    }
    if (skills.length === 0) {
      setSkills(isWeb ? [...BASE_WEB_SKILLS] : [...BASE_APP_SKILLS]);
    }
  };

  // Handle Role Title change: keeps designation synchronized if default
  const handleRoleTitleChange = (val) => {
    setRoleTitle(val);
    const isWeb = track === 'web';
    if (!isEdit || designation.includes('Development')) {
      setDesignation(`${val} – ${isWeb ? 'Web Development' : 'App Development'}`);
    }
  };

  // Responsibility helpers
  const handleAddResponsibility = () => {
    if (!newRespInput.trim()) return;
    setResponsibilities((prev) => [...prev, newRespInput.trim()]);
    setNewRespInput('');
  };

  const handleRemoveResponsibility = (idx) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLoadStandardResponsibilities = () => {
    setResponsibilities(track === 'web' ? [...BASE_WEB_RESPONSIBILITIES] : [...BASE_APP_RESPONSIBILITIES]);
    toast.success('Loaded standard responsibilities');
  };

  // Skills helpers
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setSkills((prev) => [...prev, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (idx) => {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLoadStandardSkills = () => {
    setSkills(track === 'web' ? [...BASE_WEB_SKILLS] : [...BASE_APP_SKILLS]);
    toast.success('Loaded standard technical skills');
  };

  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please choose a PNG, JPG, WEBP, or SVG image.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    setIsUploadingLogo(true);
    try {
      const response = await uploadPartnerLogo(file);
      const uploadedUrl = response?.data?.logoUrl || response?.logoUrl || '';
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no logo URL was returned.');
      }
      setLogoUrl(uploadedUrl);
      toast.success('Company logo uploaded');
    } catch (err) {
      toast.error(err?.message || 'Failed to upload company logo');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  // Submit & Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required.';
    }
    if (!roleTitle.trim()) {
      newErrors.roleTitle = 'Role title is required.';
    }
    if (!assignedDomains.trim()) {
      newErrors.assignedDomains = 'At least one domain is required.';
    }
    if (!description.trim()) {
      newErrors.description = 'Role overview description is required.';
    }
    if (responsibilities.length === 0) {
      newErrors.responsibilities = 'At least one responsibility is required.';
    }
    if (skills.length === 0) {
      newErrors.skills = 'At least one technical skill is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.companyName || newErrors.assignedDomains) {
        setActiveTab('company');
      } else if (newErrors.roleTitle || newErrors.description) {
        setActiveTab('role');
      } else {
        setActiveTab('responsibilities');
      }
      toast.error('Please resolve the highlighted fields.');
      return;
    }

    const domainList = assignedDomains.split(',').map((d) => d.trim()).filter(Boolean);
    const primaryDomain = domainList[0] || assignedDomains.trim();

    const payload = {
      companyName: companyName.trim(),
      logoUrl: logoUrl.trim(),
      logoInitials:
        existingPartner?.logoInitials ||
        companyName
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      themeColor,
      tagline: tagline.trim(),
      domainCategory: primaryDomain,
      domain: primaryDomain,
      assignedDomains: domainList,
      workMode: workMode.trim(),
      track,
      role: roleTitle.trim(),
      designation: designation.trim(),
      trackType: trackType.trim(),
      duration: duration.trim(),
      applicantsCount: Number(applicantsCount) || 120,
      description: description.trim(),
      rolesAndResponsibilities: responsibilities,
      skillsRequired: skills,
      perks,
      techStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      pricing: normalizePricing(pricing, domainList),
    };

    onSave(payload, existingRole?.id || null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="2xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isEdit ? `Edit Internship: ${existingPartner?.name} (${existingRole?.trackLabel})` : 'Post New Partner Internship'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure partner profile, track specifications, responsibilities, and outcomes.
            </p>
          </div>
        </div>
      }
      description={null}
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              activeTab === 'company'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            <Building2 className="h-4 w-4" />
            Company &amp; Domain
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('role')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              activeTab === 'role'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            <Code2 className="h-4 w-4" />
            Role &amp; Track
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('responsibilities')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              activeTab === 'responsibilities'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            <FileText className="h-4 w-4" />
            Responsibilities &amp; Skills ({responsibilities.length}/{skills.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outcomes')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              activeTab === 'outcomes'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            <Sparkles className="h-4 w-4" />
            Outcomes &amp; Perks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              activeTab === 'pricing'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            <IndianRupee className="h-4 w-4" />
            Pricing &amp; Fees
          </button>
        </div>

        {/* TAB 1: COMPANY & DOMAIN */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Partner Company Name *"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Inlarge Software"
                error={errors.companyName}
              />
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Company Logo
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40">
                  <PartnerLogo
                    partner={{
                      name: companyName || 'Partner',
                      logoUrl,
                      logoBg: COLOR_THEMES[themeColor]?.logoBg,
                    }}
                    size="sm"
                  />
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoFileChange}
                  />
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      {isUploadingLogo ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    {logoUrl && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setLogoUrl('')}
                        aria-label="Remove company logo"
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP, SVG (max 2 MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Color Theme & Gradient"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                options={Object.entries(COLOR_THEMES).map(([key, t]) => ({
                  value: key,
                  label: t.label,
                }))}
              />

              <Input
                label="Company Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Enterprise core banking & ledger infrastructure"
              />
            </div>

            <Input
              label="Domain *"
              value={assignedDomains}
              onChange={(e) => setAssignedDomains(e.target.value)}
              placeholder="Select a domain below or type e.g. Banking, Finance"
              error={errors.assignedDomains}
            />

            {catalogDomains.length > 0 && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Select from Listed Catalog Domains:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {catalogDomains.map((dom) => {
                    const currentList = assignedDomains
                      .split(',')
                      .map((d) => d.trim().toLowerCase())
                      .filter(Boolean);
                    const isSelected = currentList.includes(dom.toLowerCase());
                    return (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => {
                          const existing = assignedDomains
                            .split(',')
                            .map((d) => d.trim())
                            .filter(Boolean);
                          const next = isSelected
                            ? existing.filter((d) => d.toLowerCase() !== dom.toLowerCase())
                            : [...existing, dom];
                          setAssignedDomains(next.join(', '));
                        }}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                          isSelected
                            ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-700 dark:bg-brand-500'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                        )}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3 opacity-60" />
                        )}
                        <span>{dom}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Input
              label="Location / Work Mode"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              placeholder="e.g. 100% Online Remote"
            />
          </div>
        )}

        {/* TAB 2: ROLE & TRACK */}
        {activeTab === 'role' && (
          <div className="space-y-4">
            {/* Track Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Engineering Track *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTrackChange('web')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold text-xs transition-all',
                    track === 'web'
                      ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/30 dark:bg-brand-950/60 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                  )}
                >
                  <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Web Development</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTrackChange('app')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold text-xs transition-all',
                    track === 'app'
                      ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/30 dark:bg-brand-950/60 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                  )}
                >
                  <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>App Development</span>
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Role Title *"
                value={roleTitle}
                onChange={(e) => handleRoleTitleChange(e.target.value)}
                placeholder="e.g. Trainee Software Engineer"
                error={errors.roleTitle}
              />
              <Input
                label="Full Designation Label *"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Trainee Software Engineer – Web Development"
              />
            </div>

            {catalogDesignations.length > 0 && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Choose from Listed Catalog Designations:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {catalogDesignations.map((desigName) => {
                    const isSelected = roleTitle.toLowerCase() === desigName.toLowerCase();
                    return (
                      <button
                        key={desigName}
                        type="button"
                        onClick={() => {
                          handleRoleTitleChange(desigName);
                        }}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                          isSelected
                            ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-700 dark:bg-brand-500'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                        )}
                      >
                        {isSelected ? <CheckCircle2 className="h-3 w-3" /> : null}
                        <span>{desigName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  label="Track Subtitle"
                  value={trackType}
                  onChange={(e) => setTrackType(e.target.value)}
                  placeholder="e.g. Full Stack Web Engineering Track"
                />
              </div>
              <Input
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 1 to 6 Months"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Candidates Enrolled Count"
                type="number"
                value={applicantsCount}
                onChange={(e) => setApplicantsCount(e.target.value)}
                placeholder="e.g. 142"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Role Overview / Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive role overview describing what the candidate will work on at the partner company..."
                className={cn(
                  'w-full rounded-xl border bg-white p-3 text-sm leading-relaxed transition-all dark:bg-slate-900 dark:text-white',
                  errors.description
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
                )}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RESPONSIBILITIES & SKILLS */}
        {activeTab === 'responsibilities' && (
          <div className="space-y-6">
            {/* Responsibilities list */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Role Responsibilities &amp; What You Will Build ({responsibilities.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Displayed as numbered core areas in the internship details modal.
                  </p>
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  leftIcon={RotateCcw}
                  onClick={handleLoadStandardResponsibilities}
                >
                  Reset to Standard
                </Button>
              </div>

              <div className="mt-3 max-h-52 overflow-y-auto space-y-2 pr-1">
                {responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-[10px] text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{resp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 shrink-0 p-1"
                      title="Remove responsibility"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add responsibility input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newRespInput}
                  onChange={(e) => setNewRespInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                  placeholder="Enter a new responsibility..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={Plus}
                  onClick={handleAddResponsibility}
                >
                  Add
                </Button>
              </div>
              {errors.responsibilities && (
                <p className="mt-1 text-xs text-rose-500">{errors.responsibilities}</p>
              )}
            </div>

            {/* Technical Skills list */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Technical Skills Required ({skills.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Displayed in the 2-column skills grid in the details modal.
                  </p>
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  leftIcon={RotateCcw}
                  onClick={handleLoadStandardSkills}
                >
                  Reset to Standard
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Enter required skill (e.g. React.js / Node.js)..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={Plus}
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
              </div>
              {errors.skills && (
                <p className="mt-1 text-xs text-rose-500">{errors.skills}</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: OUTCOMES & TECH STACK */}
        {activeTab === 'outcomes' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Key Benefits &amp; Career Outcomes (3 Standard Perks)
              </h4>
              <div className="space-y-2">
                {perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <input
                      type="text"
                      value={perk}
                      onChange={(e) => {
                        const next = [...perks];
                        next[idx] = e.target.value;
                        setPerks(next);
                      }}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Input
                label="Tech Stack Badges (Comma-separated tags)"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. HTML5, CSS3, JavaScript, React.js, PostgreSQL, Git"
              />
            </div>
          </div>
        )}

        {/* TAB 5: PRICING & FEES (BY DOMAIN & DURATION) */}
        {activeTab === 'pricing' && (() => {
          const activeDomains = assignedDomains
            .split(',')
            .map((d) => d.trim())
            .filter(Boolean);
          const concession = Number(pricing?.concessionPercent ?? DEFAULT_CONCESSION_PERCENT);
          const rowsToEdit = activeDomains.length > 0 ? activeDomains : ['Default'];

          const handleConcessionChange = (val) => {
            const num = val === '' ? 0 : Math.min(100, Math.max(0, Number(val) || 0));
            setPricing((prev) => ({ ...prev, concessionPercent: num }));
          };

          const handleDomainPriceChange = (domKey, dur, rawVal) => {
            const num = rawVal === '' ? 0 : Math.max(0, Math.round(Number(rawVal) || 0));
            const durKey = String(dur);
            setPricing((prev) => {
              if (domKey === 'Default' && activeDomains.length === 0) {
                return {
                  ...prev,
                  defaultPrices: {
                    ...(prev.defaultPrices || DEFAULT_DURATION_PRICES),
                    [durKey]: num,
                  },
                };
              }
              const currentDomMap =
                prev.domainPrices?.[domKey] ||
                prev.defaultPrices ||
                { ...DEFAULT_DURATION_PRICES };
              return {
                ...prev,
                domainPrices: {
                  ...(prev.domainPrices || {}),
                  [domKey]: {
                    ...currentDomMap,
                    [durKey]: num,
                  },
                },
              };
            });
          };

          return (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 items-end rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <Input
                  label="Direct Platform Concession (%)"
                  type="number"
                  min={0}
                  max={100}
                  value={concession}
                  onChange={(e) => handleConcessionChange(e.target.value)}
                  helperText="Percentage discount applied automatically on the Demo Payment step."
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Set base platform infrastructure fees (₹) for <strong>1, 2, 3, and 6 months</strong> per domain. Students will see the exact payable amount automatically.
                </p>
              </div>

              <div className="space-y-3">
                {rowsToEdit.map((domKey) => {
                  const isFallbackRow = domKey === 'Default' && activeDomains.length === 0;
                  const priceMap = isFallbackRow
                    ? pricing.defaultPrices || DEFAULT_DURATION_PRICES
                    : pricing.domainPrices?.[domKey] || pricing.defaultPrices || DEFAULT_DURATION_PRICES;

                  return (
                    <div
                      key={domKey}
                      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                          {isFallbackRow ? 'Default Pricing (All Domains)' : `${domKey} Domain`}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Concession: {concession}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {PRICING_DURATIONS.map((dur) => {
                          const base = Number(priceMap[String(dur)] ?? priceMap[dur] ?? DEFAULT_DURATION_PRICES[dur]);
                          const discount = Math.round(base * (concession / 100));
                          const payable = Math.max(0, base - discount);
                          return (
                            <div key={dur} className="space-y-1">
                              <Input
                                label={`${dur} ${dur === 1 ? 'Month' : 'Months'} (₹)`}
                                type="number"
                                min={0}
                                value={base}
                                onChange={(e) => handleDomainPriceChange(domKey, dur, e.target.value)}
                              />
                              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                Payable: {formatInr(payable)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" leftIcon={Save} className="font-bold">
            {isEdit ? 'Update Internship' : 'Create Internship'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default InternshipEditorModal;
