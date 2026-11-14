import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Modal,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Download,
  GithubIcon,
  Layers,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Upload,
} from '@/shared/icons';
import { generateDailyTasksForProject, WORKING_DAYS_BY_DURATION } from '../utils/projectTaskGenerator';
import { useUpdateProject } from '../hooks/useProjects';

const DURATIONS = [
  { value: 1, label: '1 Month', days: 20 },
  { value: 2, label: '2 Months', days: 40 },
  { value: 3, label: '3 Months', days: 60 },
  { value: 6, label: '6 Months', days: 120 },
];

export function ProjectTasksModal({ open, onClose, project }) {
  const fileInputRef = useRef(null);
  const updateProjectMutation = useUpdateProject();

  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState('web');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Edit slot modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    problemStatement: '',
    expectedOutcome: '',
    acceptanceCriteria: '',
    estimatedHours: 4,
    requiresTrainerReview: false,
  });

  const targetDayCount = WORKING_DAYS_BY_DURATION[selectedDuration] || 20;

  // Helper to create blank empty slot boxes for manual entry
  const createEmptySlots = (p, track, count) => {
    return Array.from({ length: count }, (_, i) => {
      const day = i + 1;
      return {
        _id: `task_${p?._id || 'new'}_${track}_day_${day}`,
        dayNumber: day,
        sequence: day,
        title: '',
        problemStatement: '',
        expectedOutcome: '',
        acceptanceCriteria: [],
        estimatedHours: 4,
        requiresTrainerReview: false,
        track: track === 'web' ? 'Web Development' : 'Mobile App Development',
      };
    });
  };

  // Initialize slots from saved taskTemplates or default to empty slots for manual insertion
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!project) return;
    const savedSet = project.taskTemplates?.[selectedTrack]?.[selectedDuration];
    if (Array.isArray(savedSet) && savedSet.length === targetDayCount) {
      setSlots(savedSet);
    } else {
      // Empty box slots by default so admin can insert tasks manually
      setSlots(createEmptySlots(project, selectedTrack, targetDayCount));
    }
    setIsDirty(false);
  }, [project, selectedTrack, selectedDuration, targetDayCount]);

  const configuredCount = useMemo(() => {
    return slots.filter((task) => Boolean(task.title?.trim())).length;
  }, [slots]);

  // Handle slot editing / manual insertion
  const handleOpenEdit = (task, index) => {
    setEditingTask({ ...task, slotIndex: index });
    setEditForm({
      title: task.title || '',
      problemStatement: task.problemStatement || '',
      expectedOutcome: task.expectedOutcome || '',
      acceptanceCriteria: Array.isArray(task.acceptanceCriteria)
        ? task.acceptanceCriteria.join('\n')
        : task.acceptanceCriteria || '',
      estimatedHours: task.estimatedHours || 4,
      requiresTrainerReview: Boolean(task.requiresTrainerReview),
    });
  };

  const handleSaveSlotEdit = (e) => {
    e.preventDefault();
    if (!editingTask) return;
    const index = editingTask.slotIndex;
    const isNewInsert = !editingTask.title?.trim();
    const criteriaList = editForm.acceptanceCriteria
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    setSlots((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        title: editForm.title.trim(),
        problemStatement: editForm.problemStatement.trim(),
        expectedOutcome: editForm.expectedOutcome.trim(),
        acceptanceCriteria: criteriaList.length > 0 ? criteriaList : ['Task code committed to student GitHub branch'],
        estimatedHours: Number(editForm.estimatedHours) || 4,
        requiresTrainerReview: editForm.requiresTrainerReview,
      };
      return next;
    });

    setIsDirty(true);
    setEditingTask(null);
    toast.success(
      isNewInsert ? `Day ${editingTask.dayNumber} Task Inserted` : `Day ${editingTask.dayNumber} Updated`,
      {
        description: 'Slot updated. Click "Save Template Set" at the top to persist your changes.',
      },
    );
  };

  // Optional: Pre-fill Blueprint if admin wants auto-filled starter tasks
  const handlePreFillBlueprint = () => {
    if (!project) return;
    const blueprintTasks = generateDailyTasksForProject(project, selectedDuration, selectedTrack);
    setSlots(blueprintTasks);
    setIsDirty(true);
    toast.info('Blueprint Loaded', {
      description: `Populated ${targetDayCount}-day blueprint curriculum. Click "Save Template Set" to keep them.`,
    });
  };

  // Clear all slots back to blank empty boxes
  const handleClearSlots = () => {
    if (!project) return;
    setSlots(createEmptySlots(project, selectedTrack, targetDayCount));
    setIsDirty(true);
    toast.info('Slots Cleared', {
      description: `Reset all ${targetDayCount} daily task slots to empty boxes for manual entry.`,
    });
  };

  // Save the current template set to project record in DB
  const handleSaveTemplateSet = () => {
    if (!project) return;
    const nextTemplates = {
      ...(project.taskTemplates || {}),
      [selectedTrack]: {
        ...(project.taskTemplates?.[selectedTrack] || {}),
        [selectedDuration]: slots,
      },
    };

    updateProjectMutation.mutate(
      {
        id: project._id,
        data: { taskTemplates: nextTemplates },
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          toast.success('Task Template Saved', {
            description: `Successfully saved ${configuredCount} of ${slots.length} ${selectedTrack === 'web' ? 'Web' : 'Mobile App'} tasks for ${selectedDuration} Month(s).`,
          });
        },
        onError: (err) => {
          toast.error('Failed to Save Template', {
            description: err?.message || 'Could not save project template.',
          });
        },
      },
    );
  };

  // Export CSV
  const handleExportCsv = () => {
    if (slots.length === 0) return;
    const header = ['Day', 'Title', 'Hours', 'ReviewRequired', 'ProblemStatement', 'ExpectedOutcome', 'Criteria'];
    const rows = slots.map((s) => [
      s.dayNumber,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      s.estimatedHours || 4,
      s.requiresTrainerReview ? 'YES' : 'NO',
      `"${(s.problemStatement || '').replace(/"/g, '""')}"`,
      `"${(s.expectedOutcome || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(s.acceptanceCriteria) ? s.acceptanceCriteria.join('; ') : '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.slug || 'project'}-${selectedTrack}-${selectedDuration}m-tasks.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV
  const handleImportCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) throw new Error('CSV is empty or missing data rows');

        // Parse CSV rows
        const parsedRows = lines.slice(1).map((line, idx) => {
          // Basic CSV quote-aware split
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
          const day = idx + 1;
          const clean = (val) => (val || '').replace(/^"|"$/g, '').trim();
          return {
            _id: `task_${project._id}_${selectedTrack}_day_${day}`,
            dayNumber: day,
            sequence: day,
            title: clean(matches[1]) || `Day ${day} Development Task`,
            estimatedHours: Number(clean(matches[2])) || 4,
            requiresTrainerReview: clean(matches[3])?.toUpperCase() === 'YES',
            problemStatement: clean(matches[4]) || `Core task requirement for Day ${day}`,
            expectedOutcome: clean(matches[5]) || `Verified working deliverable for Day ${day}`,
            acceptanceCriteria: clean(matches[6]) ? clean(matches[6]).split(';').map((s) => s.trim()).filter(Boolean) : ['Delivered to GitHub repo'],
            track: selectedTrack === 'web' ? 'Web Development' : 'Mobile App Development',
          };
        });

        // Ensure we fit exactly targetDayCount slots
        const paddedSlots = [...parsedRows];
        while (paddedSlots.length < targetDayCount) {
          const nextDay = paddedSlots.length + 1;
          paddedSlots.push({
            _id: `task_${project._id}_${selectedTrack}_day_${nextDay}`,
            dayNumber: nextDay,
            sequence: nextDay,
            title: `Sprint Feature Implementation - Day ${nextDay}`,
            estimatedHours: 4,
            problemStatement: `Develop and test assigned feature for Day ${nextDay}`,
            expectedOutcome: `Working deliverable committed to GitHub`,
            acceptanceCriteria: ['Code committed to student repository'],
            track: selectedTrack === 'web' ? 'Web Development' : 'Mobile App Development',
          });
        }

        setSlots(paddedSlots.slice(0, targetDayCount));
        setIsDirty(true);
        toast.success('CSV Imported', {
          description: `Loaded ${Math.min(parsedRows.length, targetDayCount)} tasks from CSV.`,
        });
      } catch (err) {
        toast.error('CSV Import Failed', {
          description: err?.message || 'Could not parse CSV file.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredSlots = useMemo(() => {
    if (!searchQuery.trim()) return slots;
    const q = searchQuery.trim().toLowerCase();
    return slots.filter(
      (s) =>
        String(s.dayNumber).includes(q) ||
        (s.title || '').toLowerCase().includes(q) ||
        (s.problemStatement || '').toLowerCase().includes(q),
    );
  }, [slots, searchQuery]);

  const searchInputId = useId();

  if (!project) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-brand-600" />
            <span>Project Task Template Manager</span>
          </div>
        }
        description={`Manage fixed daily task templates for ${project.title}. Tasks are divided separately for Web and Mobile App across 1M, 2M, 3M, and 6M durations. When a student is assigned this project, their duration's fixed task set is automatically allocated.`}
        size="xl"
      >
        <div className="space-y-5">
          {/* Project Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-base">{project.title}</span>
                <Badge variant="neutral" icon={Building2}>
                  {project.domain?.name || 'Domain'}
                </Badge>
                <Badge variant="brand" icon={Sparkles}>
                  Trainee Software Engineer
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Fixed Templates: <strong className="text-slate-700">1M (20)</strong> ·{' '}
                <strong className="text-slate-700">2M (40)</strong> ·{' '}
                <strong className="text-slate-700">3M (60)</strong> ·{' '}
                <strong className="text-slate-700">6M (120)</strong> tasks per track.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isDirty ? 'warning' : 'success'} size="md">
                {isDirty ? '● Unsaved Changes' : '✓ Template In Sync'}
              </Badge>
              <Button
                size="sm"
                variant="primary"
                leftIcon={Save}
                loading={updateProjectMutation.isPending}
                onClick={handleSaveTemplateSet}
              >
                Save Template Set
              </Button>
            </div>
          </div>

          {/* Track Switcher: Web vs Mobile App */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTrack('web')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${selectedTrack === 'web'
                    ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <Code2 className="h-4 w-4" />
                <span>Web Development Track (Track 1)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrack('app')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${selectedTrack === 'app'
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile App Development Track (Track 2)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <GithubIcon className="h-3.5 w-3.5 text-slate-400" />
              <span>Students submit daily commits to their personal GitHub repo</span>
            </div>
          </div>

          {/* Duration Tabs Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1">Internship Duration:</span>
              {DURATIONS.map((dur) => {
                const active = selectedDuration === dur.value;
                return (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() => setSelectedDuration(dur.value)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${active
                        ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-600/30'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{dur.label}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${active ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {dur.days} Fixed Tasks
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Template Actions Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="xs"
                variant="outline"
                leftIcon={RotateCcw}
                onClick={handleClearSlots}
                title="Reset all slots to empty boxes for manual entry"
              >
                Clear All
              </Button>
              <Button
                size="xs"
                variant="outline"
                leftIcon={Sparkles}
                onClick={handlePreFillBlueprint}
                title="Optional: Auto-populate slots with domain blueprint curriculum"
              >
                Pre-fill Blueprint
              </Button>
              <Button
                size="xs"
                variant="outline"
                leftIcon={Upload}
                onClick={() => fileInputRef.current?.click()}
                title="Upload CSV to populate slots"
              >
                Import CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportCsv}
              />
              <Button
                size="xs"
                variant="outline"
                leftIcon={Download}
                onClick={handleExportCsv}
                title="Download this template as CSV"
              >
                Export CSV
              </Button>
            </div>
          </div>

          {/* Slots Status Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">
                Template Slots: {configuredCount} / {targetDayCount} Tasks Configured
              </span>
              <Badge
                variant={
                  configuredCount === targetDayCount
                    ? 'success'
                    : configuredCount > 0
                      ? 'warning'
                      : 'neutral'
                }
                size="sm"
              >
                {configuredCount === targetDayCount
                  ? 'All Tasks Configured'
                  : configuredCount > 0
                    ? `${configuredCount} Entered · ${targetDayCount - configuredCount} Empty`
                    : 'All Slots Empty (Manual Entry)'}
              </Badge>
              <span className="text-[11px] text-slate-500">
                (Task 1 opens immediately; subsequent tasks unlock sequentially)
              </span>
            </div>

            <div className="w-full sm:w-64">
              <label htmlFor={searchInputId} className="sr-only">
                Filter by day number or feature title
              </label>
              <input
                id={searchInputId}
                type="text"
                placeholder="Filter by day # or feature title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Daily Task Slots Grid */}
          <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
            {filteredSlots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <Layers className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No matching daily tasks found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search query or click &quot;Insert Task&quot; on an empty slot.
                </p>
              </div>
            ) : (
              filteredSlots.map((task, idx) => {
                const isFirst = task.dayNumber === 1;
                const isFilled = Boolean(task.title?.trim());

                if (!isFilled) {
                  return (
                    <div
                      key={task._id || `task_${task.dayNumber}`}
                      className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition-all hover:border-brand-400 hover:bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center rounded-md bg-slate-200 border border-slate-300 px-2 py-0.5 text-xs font-bold text-slate-700">
                              Day {task.dayNumber}
                            </span>
                            <span className="text-sm italic font-medium text-slate-400">
                              Empty Slot — Ready for Manual Insertion
                            </span>
                            {isFirst ? (
                              <Badge variant="neutral" size="sm">
                                Open on Start
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                Prereq: Day {task.dayNumber - 1}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            No task entered for Day {task.dayNumber}. Click &quot;Insert Task&quot; to define title, problem statement, and deliverables.
                          </p>
                        </div>

                        <Button
                          size="xs"
                          variant="primary"
                          leftIcon={Plus}
                          onClick={() => handleOpenEdit(task, idx)}
                        >
                          Insert Task
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={task._id || `task_${task.dayNumber}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-brand-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center rounded-md bg-brand-50 border border-brand-200 px-2 py-0.5 text-xs font-bold text-brand-700">
                            Day {task.dayNumber}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{task.title}</span>
                          {isFirst ? (
                            <Badge variant="success" size="sm" icon={CheckCircle2}>
                              Open on Start
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Prereq: Day {task.dayNumber - 1}
                            </span>
                          )}
                          {task.requiresTrainerReview ? (
                            <Badge variant="warning" size="sm">
                              Trainer Review
                            </Badge>
                          ) : null}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{task.problemStatement}</p>

                        {task.expectedOutcome ? (
                          <div className="text-[11px] text-slate-500">
                            <strong className="text-slate-700">Expected Outcome:</strong> {task.expectedOutcome}
                          </div>
                        ) : null}

                        {Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {task.acceptanceCriteria.map((c, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium"
                              >
                                <Check className="h-3 w-3 text-emerald-600" />
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          ~{task.estimatedHours || 4} hrs
                        </span>
                        <Button
                          size="xs"
                          variant="outline"
                          leftIcon={Pencil}
                          onClick={() => handleOpenEdit(task, idx)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Slot Sub-Modal */}
      {editingTask ? (
        <Modal
          open={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          title={
            !editingTask.title?.trim()
              ? `Insert Task — Day ${editingTask.dayNumber} (${selectedTrack === 'web' ? 'Web Track' : 'Mobile App Track'})`
              : `Edit Task — Day ${editingTask.dayNumber} (${selectedTrack === 'web' ? 'Web Track' : 'Mobile App Track'})`
          }
          description={
            !editingTask.title?.trim()
              ? `Enter the requirements, expected outcome, and criteria for Day ${editingTask.dayNumber} of the ${selectedTrack === 'web' ? 'Web' : 'Mobile App'} template.`
              : `Customize the requirements, expected outcome, and criteria for Day ${editingTask.dayNumber} of the ${selectedTrack === 'web' ? 'Web' : 'Mobile App'} template.`
          }
          size="md"
        >
          <form onSubmit={handleSaveSlotEdit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Task Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Repository Setup, User Authentication, Checkout Flow..."
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={editForm.estimatedHours}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, estimatedHours: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requiresTrainerReview}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, requiresTrainerReview: e.target.checked }))
                    }
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <span>Requires Trainer Review</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Problem Statement & Requirements *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what the student must implement for this day..."
                value={editForm.problemStatement}
                onChange={(e) => setEditForm((prev) => ({ ...prev, problemStatement: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Expected Outcome
              </label>
              <textarea
                rows={2}
                placeholder="Deliverable after finishing this task (e.g. running component, unit tests passing)..."
                value={editForm.expectedOutcome}
                onChange={(e) => setEditForm((prev) => ({ ...prev, expectedOutcome: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Acceptance Criteria (1 item per line)
              </label>
              <textarea
                rows={3}
                placeholder="Dev server starts with zero errors&#10;Design tokens defined&#10;Clean commit pushed to feature branch"
                value={editForm.acceptanceCriteria}
                onChange={(e) => setEditForm((prev) => ({ ...prev, acceptanceCriteria: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit">
                {!editingTask.title?.trim() ? `Insert Day ${editingTask.dayNumber} Task` : 'Update Task Slot'}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export default ProjectTasksModal;
