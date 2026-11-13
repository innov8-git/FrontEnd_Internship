import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Badge,
  Button,
  Input,
  Modal,
  Select,
  StatusBanner,
  Textarea,
  toast,
} from '@/shared/components/ui';
import {
  Code2,
  GithubIcon,
  Plus,
  Save,
  Smartphone,
  Sparkles,
} from '@/shared/icons';
import { getErrorMessage, getFieldErrors } from '@/shared/utils/errors';
import { slugify } from '@/shared/utils/helpers';
import { useCatalogOptions } from '../hooks/useCatalogAdmin';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import { projectSchema } from '../schemas/projectValidation';
import { FormActions } from './FormActions';

const DURATION_CHOICES = [
  { value: 1, label: '1 Month (20 Working Days)' },
  { value: 2, label: '2 Months (40 Working Days)' },
  { value: 3, label: '3 Months (60 Working Days)' },
  { value: 6, label: '6 Months (120 Working Days)' },
];

const HOME_DOMAIN_ORDER = [
  'banking',
  'finance',
  'telecom',
  'e-commerce',
  'healthcare',
  'insurance',
  'erp-crm',
  'loan',
];

export function ProjectDialog({ open, onClose, project }) {
  const isEdit = Boolean(project);
  const domainsQuery = useCatalogOptions('domain');
  const designationsQuery = useCatalogOptions('designation');
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const [formError, setFormError] = useState(null);

  // All 8 domains from the home page in order
  const domainOptions = useMemo(
    () =>
      (domainsQuery.data ?? [])
        .map((d) => ({
          value: d._id,
          label: d.name,
          slug: d.slug,
        }))
        .sort((a, b) => {
          const idxA = HOME_DOMAIN_ORDER.indexOf(a.slug);
          const idxB = HOME_DOMAIN_ORDER.indexOf(b.slug);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.label.localeCompare(b.label);
        }),
    [domainsQuery.data],
  );

  // Target designation defaults to Trainee Software Engineer
  const designationOptions = useMemo(
    () =>
      (designationsQuery.data ?? [])
        .map((d) => ({
          value: d._id,
          label: d.name,
        }))
        .sort((a, b) => {
          if (a.label.toLowerCase() === 'trainee software engineer') return -1;
          if (b.label.toLowerCase() === 'trainee software engineer') return 1;
          return a.label.localeCompare(b.label);
        }),
    [designationsQuery.data],
  );

  const defaultDesignationId = designationOptions[0]?.value || 'trainee-software-engineer';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(projectSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      slug: '',
      domainId: '',
      designationId: '',
      description: '',
      technologies: '',
      webTechStack: '',
      webDeliverables: '',
      appTechStack: '',
      appDeliverables: '',
      durationsSupported: [1, 2, 3, 6],
      isDefault: false,
      status: 'PUBLISHED',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title ?? '',
        slug: project.slug ?? '',
        domainId: project.domainId ?? '',
        designationId: project.designationId || defaultDesignationId,
        description: project.description ?? '',
        technologies: Array.isArray(project.technologies)
          ? project.technologies.join(', ')
          : project.technologies ?? '',
        webTechStack: Array.isArray(project.webTechStack)
          ? project.webTechStack.join(', ')
          : project.webTechStack ?? (Array.isArray(project.technologies) ? project.technologies.join(', ') : ''),
        webDeliverables: project.webDeliverables ?? '',
        appTechStack: Array.isArray(project.appTechStack)
          ? project.appTechStack.join(', ')
          : project.appTechStack ?? '',
        appDeliverables: project.appDeliverables ?? '',
        durationsSupported: Array.isArray(project.durationsSupported)
          ? project.durationsSupported
          : [1, 2, 3, 6],
        isDefault: Boolean(project.isDefault),
        status: project.status ?? 'PUBLISHED',
      });
    } else {
      reset({
        title: '',
        slug: '',
        domainId: '',
        designationId: defaultDesignationId,
        description: '',
        technologies: '',
        webTechStack: '',
        webDeliverables: '',
        appTechStack: '',
        appDeliverables: '',
        durationsSupported: [1, 2, 3, 6],
        isDefault: false,
        status: 'PUBLISHED',
      });
    }
    setFormError(null);
  }, [project, open, reset, defaultDesignationId]);

  const selectedDurations = watch('durationsSupported') || [];
  const titleValue = watch('title');
  const slugValue = watch('slug') || (titleValue ? slugify(titleValue) : '');

  const toggleDuration = (val) => {
    const current = new Set(selectedDurations);
    if (current.has(val)) {
      current.delete(val);
    } else {
      current.add(val);
    }
    setValue('durationsSupported', Array.from(current), { shouldValidate: true, shouldDirty: true });
  };

  const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values) => {
    setFormError(null);
    const webStackArray = typeof values.webTechStack === 'string'
      ? values.webTechStack.split(',').map((s) => s.trim()).filter(Boolean)
      : values.webTechStack ?? [];

    const appStackArray = typeof values.appTechStack === 'string'
      ? values.appTechStack.split(',').map((s) => s.trim()).filter(Boolean)
      : values.appTechStack ?? [];

    const combinedTechnologies = Array.from(new Set([...webStackArray, ...appStackArray]));

    const payload = {
      ...values,
      designationId: values.designationId || defaultDesignationId,
      slug: slugValue,
      technologies: combinedTechnologies.length > 0 ? combinedTechnologies : ['Web & App Development'],
      webTechStack: webStackArray,
      webDeliverables: values.webDeliverables || '',
      appTechStack: appStackArray,
      appDeliverables: values.appDeliverables || '',
      durationsSupported: values.durationsSupported.map(Number),
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: project._id, data: payload });
        toast.success('Project updated', {
          description: `${payload.title} was saved successfully.`,
        });
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Project created', {
          description: `${payload.title} is now available in the domain.`,
        });
      }
      onClose();
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        fieldErrors.forEach(({ field, message }) => {
          setError(field, { type: 'server', message });
        });
      } else {
        setFormError(getErrorMessage(err));
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={isBusy ? undefined : onClose}
      title={isEdit ? `Edit ${project?.title || 'Project'}` : 'New Domain Project'}
      description="Define a real-world project under a domain with distinct daily task divisions for Web and Mobile App development."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formError ? <StatusBanner variant="error">{formError}</StatusBanner> : null}

        {/* Single unified designation for Web & App */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Internship Role & Designation
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              Trainee Software Engineer
            </p>
          </div>
          <Badge variant="brand" icon={Sparkles}>
            Supports Web & App Development
          </Badge>
        </div>

        <Select
          label="Domain"
          placeholder="Select a domain"
          {...register('domainId')}
          options={domainOptions}
          error={errors.domainId?.message}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Project Title"
            placeholder="e.g. LedgerCore — Retail Banking & Fund Transfer Engine"
            {...register('title')}
            error={errors.title?.message}
            required
          />

          <Input
            label="Web Slug"
            value={slugValue}
            onChange={(e) => setValue('slug', e.target.value, { shouldDirty: true })}
            helperText="Identifier used in links and API payloads."
          />
        </div>

        <Textarea
          label="Overall Project Problem Statement & Business Scenario"
          rows={2}
          placeholder="Describe the real-world business scenario, customer problem, and systems the student will build..."
          {...register('description')}
          error={errors.description?.message}
        />

        {/* Informational callout for student GitHub repos */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <GithubIcon className="h-4 w-4 text-slate-500 shrink-0" />
          <span>
            <strong>Student Git Repositories:</strong> Each student will link and upload their personal GitHub repository URL as they execute and submit their daily tasks.
          </span>
        </div>

        {/* Track 1: Web Development Track Specification */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Track 1: Web Development Specification
              </h4>
              <p className="text-[11px] text-slate-500">
                Technologies and scope for students assigned as Web Developers.
              </p>
            </div>
          </div>

          <Input
            label="Web Tech Stack"
            placeholder="e.g. React.js, Next.js, Tailwind CSS, TypeScript, Axios"
            {...register('webTechStack')}
            helperText="Technologies the web developer will use (comma separated)."
          />

          <Textarea
            label="Web Scope & Deliverables"
            rows={2}
            placeholder="e.g. Responsive banking portal, KYC onboarding forms, ledger transaction table, CSV statement download..."
            {...register('webDeliverables')}
          />
        </div>

        {/* Track 2: Mobile App Development Track Specification */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Track 2: Mobile App Development Specification
              </h4>
              <p className="text-[11px] text-slate-500">
                Technologies and scope for students assigned as Mobile App Developers.
              </p>
            </div>
          </div>

          <Input
            label="Mobile App Tech Stack"
            placeholder="e.g. React Native / Flutter, Expo, SQLite, Biometrics"
            {...register('appTechStack')}
            helperText="Technologies the mobile app developer will use (comma separated)."
          />

          <Textarea
            label="Mobile App Scope & Deliverables"
            rows={2}
            placeholder="e.g. iOS/Android native app, biometric login, offline SQLite storage, push notifications, release APK..."
            {...register('appDeliverables')}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Supported Internship Durations <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DURATION_CHOICES.map((choice) => {
              const active = selectedDurations.includes(choice.value);
              return (
                <button
                  type="button"
                  key={choice.value}
                  onClick={() => toggleDuration(choice.value)}
                  className={`flex items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all ${active
                      ? 'border-brand-600 bg-brand-50 text-brand-900 ring-2 ring-brand-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          {errors.durationsSupported ? (
            <p className="text-xs text-rose-600">{errors.durationsSupported.message}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-800">
                Default project for this domain
              </p>
              <p className="text-xs text-slate-500">
                Automatically assigned when students select this domain during enrollment.
              </p>
            </div>
          </label>

          <div className="w-36">
            <Select
              label=""
              size="sm"
              {...register('status')}
              options={[
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
              ]}
            />
          </div>
        </div>

        <FormActions inDialog>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={isEdit ? Save : Plus}
            loading={isBusy}
            disabled={isBusy || (isEdit && !isDirty)}
          >
            {isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
}

export default ProjectDialog;

