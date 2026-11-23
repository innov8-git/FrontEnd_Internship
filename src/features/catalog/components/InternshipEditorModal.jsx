import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, toast } from '@/shared/components/ui';
import {
  BASE_APP_RESPONSIBILITIES,
  BASE_APP_SKILLS,
  BASE_WEB_RESPONSIBILITIES,
  BASE_WEB_SKILLS,
} from '@/features/internships/data/companyInternshipsData';
import { COLOR_THEMES } from '@/features/internships/data/companyInternshipsStore';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
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

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [logoInitials, setLogoInitials] = useState('');
  const [themeColor, setThemeColor] = useState('blue');
  const [tagline, setTagline] = useState('');
  const [domainCategory, setDomainCategory] = useState('Banking & FinTech');
  const [assignedDomains, setAssignedDomains] = useState('Banking, Finance');
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

  const [errors, setErrors] = useState({});

  // Reset or Populate on open / change
  useEffect(() => {
    if (!open) return;

    if (existingRole && existingPartner) {
      setCompanyName(existingPartner.name || '');
      setLogoInitials(existingPartner.logoInitials || '');
      // Find theme color key if possible
      const foundTheme = Object.keys(COLOR_THEMES).find(
        (key) => COLOR_THEMES[key].logoBg === existingPartner.logoBg,
      ) || 'blue';
      setThemeColor(foundTheme);
      setTagline(existingPartner.tagline || '');
      setDomainCategory(existingPartner.domain || 'Banking & FinTech');
      setAssignedDomains(
        existingPartner.assignedDomains ? existingPartner.assignedDomains.join(', ') : 'Banking, Finance',
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
    } else {
      // New Internship Defaults
      setCompanyName('');
      setLogoInitials('');
      setThemeColor('blue');
      setTagline('');
      setDomainCategory('Cloud & Systems');
      setAssignedDomains('Cloud, Systems');
      setWorkMode('100% Online Remote');

      setTrack('web');
      setRoleTitle('Trainee Software Engineer');
      setDesignation('Trainee Software Engineer – Web Development');
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
    }

    setErrors({});
    setActiveTab('company');
  }, [open, existingRole, existingPartner]);

  // Handle Track switch: auto-update designation and trackType if untouched
  const handleTrackChange = (newTrack) => {
    setTrack(newTrack);
    const isWeb = newTrack === 'web';
    if (!isEdit || designation.includes('Software Engineer')) {
      setDesignation(`Trainee Software Engineer – ${isWeb ? 'Web Development' : 'App Development'}`);
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
    if (!isEdit || designation.includes('Software Engineer')) {
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

    const payload = {
      companyName: companyName.trim(),
      logoInitials:
        logoInitials.trim() ||
        companyName
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      themeColor,
      tagline: tagline.trim(),
      domainCategory: domainCategory.trim(),
      domain: domainCategory.trim(),
      assignedDomains: assignedDomains.split(',').map((d) => d.trim()).filter(Boolean),
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
              <Input
                label="Logo Initials (1-3 letters)"
                value={logoInitials}
                onChange={(e) => setLogoInitials(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="e.g. IS"
                maxLength={3}
              />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Industry Domain Category *"
                value={domainCategory}
                onChange={(e) => setDomainCategory(e.target.value)}
                placeholder="e.g. Banking & FinTech"
              />
              <Input
                label="Assigned Sub-Domains (Comma-separated) *"
                value={assignedDomains}
                onChange={(e) => setAssignedDomains(e.target.value)}
                placeholder="e.g. Banking, Finance"
                error={errors.assignedDomains}
              />
            </div>

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
