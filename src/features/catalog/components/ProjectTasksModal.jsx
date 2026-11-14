import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Modal,
} from '@/shared/components/ui';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  GithubIcon,
  Layers,
  Plus,
  Smartphone,
  Sparkles,
} from '@/shared/icons';
import { generateDailyTasksForProject } from '../utils/projectTaskGenerator';

const DURATIONS = [
  { value: 1, label: '1 Month', days: 20 },
  { value: 2, label: '2 Months', days: 40 },
  { value: 3, label: '3 Months', days: 60 },
  { value: 6, label: '6 Months', days: 120 },
];

export function ProjectTasksModal({ open, onClose, project }) {
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState('web');
  const [searchDay, setSearchDay] = useState('');
  const [customTasks, setCustomTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProblem, setNewTaskProblem] = useState('');

  const baseTasks = useMemo(() => {
    if (!project) return [];
    return generateDailyTasksForProject(project, selectedDuration, selectedTrack);
  }, [project, selectedDuration, selectedTrack]);

  // Combine with custom tasks
  const allTasks = useMemo(() => {
    const combined = [...baseTasks];
    customTasks.forEach((ct) => {
      const idx = combined.findIndex((t) => t.dayNumber === ct.dayNumber);
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...ct };
      } else {
        combined.push(ct);
      }
    });
    return combined.sort((a, b) => a.dayNumber - b.dayNumber);
  }, [baseTasks, customTasks]);

  const filteredTasks = useMemo(() => {
    if (!searchDay.trim()) return allTasks;
    const q = searchDay.trim().toLowerCase();
    return allTasks.filter(
      (t) =>
        String(t.dayNumber).includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.phase?.toLowerCase().includes(q) ||
        t.track?.toLowerCase().includes(q),
    );
  }, [allTasks, searchDay]);

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const day = Number(newTaskDay) || allTasks.length + 1;
    const trackLabel = selectedTrack === 'app' ? 'Mobile App Development' : 'Web Development';
    const taskObj = {
      _id: `custom_task_${selectedTrack}_${Date.now()}`,
      dayNumber: day,
      sequence: day,
      phase: 'Custom Added Task',
      title: newTaskTitle.trim(),
      track: trackLabel,
      estimatedHours: 4,
      problemStatement: newTaskProblem.trim() || `Custom task for Day ${day}`,
      acceptanceCriteria: ["Task deliverable committed to student's GitHub repo and approved by mentor"],
      requiresTrainerReview: true,
    };
    setCustomTasks((prev) => [...prev, taskObj]);
    setNewTaskTitle('');
    setNewTaskDay('');
    setNewTaskProblem('');
    setShowAddForm(false);
  };

  if (!project) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-brand-600" />
          <span>Project Daily Tasks & Schedule</span>
        </div>
      }
      description={`Daily task breakdown for ${project.title}. Tasks are divided separately for Web and Mobile App development across your chosen internship duration.`}
      size="xl"
    >
      <div className="space-y-5">
        {/* Project Snapshot Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{project.title}</span>
              <Badge variant="neutral" icon={Building2}>
                {project.domain?.name || 'Domain'}
              </Badge>
              <Badge variant="brand" icon={Sparkles}>
                Trainee Software Engineer
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dual Track: <strong className="text-slate-700 dark:text-slate-300">Web Development</strong> & <strong className="text-slate-700 dark:text-slate-300">Mobile App Development</strong> ·
              Supported Durations:{' '}
              {(project.durationsSupported || [1, 2, 3, 6]).map((d) => `${d}m`).join(', ')}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={Plus}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Custom Task'}
          </Button>
        </div>

        {/* Track Switcher: Web vs Mobile App */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTrack('web')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedTrack === 'web'
                  ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Web Development Tasks</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTrack('app')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedTrack === 'app'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile App Development Tasks</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <GithubIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Students submit their own GitHub repo for each day's task</span>
          </div>
        </div>

        {/* Add custom task inline form */}
        {showAddForm ? (
          <form
            onSubmit={handleAddCustomTask}
            className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 space-y-3 dark:border-brand-900/60 dark:bg-brand-950/40"
          >
            <p className="text-xs font-bold text-brand-900 dark:text-brand-300 uppercase tracking-wide">
              Add New Daily Task to {project.title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Working Day #
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 21"
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Biometric Fingerprint Auth & Push Notification Handler"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Problem Statement & Deliverables
              </label>
              <textarea
                rows={2}
                placeholder="Describe what the intern needs to code, test, and deliver on this day for Web and Mobile..."
                value={newTaskProblem}
                onChange={(e) => setNewTaskProblem(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="xs" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button size="xs" variant="primary" type="submit">
                Save Task
              </Button>
            </div>
          </form>
        ) : null}

        {/* Duration Tabs Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Internship Span:</span>
            {DURATIONS.map((dur) => {
              const active = selectedDuration === dur.value;
              return (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setSelectedDuration(dur.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-600/30'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{dur.label}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                      active ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dur.days} Days
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-56">
            <input
              type="text"
              placeholder="Search day or task..."
              value={searchDay}
              onChange={(e) => setSearchDay(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Daily Tasks List View */}
        <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No tasks match your filter.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="group relative rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-brand-300 transition-colors dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-mono font-bold text-xs border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800">
                      D{task.dayNumber}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
                        {task.requiresTrainerReview ? (
                          <Badge variant="warning" size="sm">
                            Mentor Review Required
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                          <Layers className="h-3 w-3 text-slate-400" />
                          {task.phase}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.2 text-slate-700 font-medium dark:bg-slate-700 dark:text-slate-300">
                          {task.track.includes('App') ? (
                            <Smartphone className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Code2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          )}
                          {task.track}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          ~{task.estimatedHours}h
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {task.problemStatement}
                      </p>

                      {task.acceptanceCriteria?.length > 0 ? (
                        <div className="pt-1.5 space-y-1">
                          {task.acceptanceCriteria.map((crit, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span>{crit}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing {filteredTasks.length} daily tasks for{' '}
            <strong>{selectedDuration} Month(s)</strong>.
          </span>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectTasksModal;

