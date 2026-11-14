import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Modal,
  StatusBanner,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Code2,
  FolderGit2,
  Layers,
  Smartphone,
  User,
} from '@/shared/icons';
import { PUBLISH_STATUS } from '@/shared/constants';
import { getErrorMessage } from '@/shared/utils/errors';
import {
  useAdminProjects,
  useAssignProject,
  useUnassignProject,
} from '../hooks/useProjects';

export function AssignProjectDialog({ open, onClose, assignment }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [actionError, setActionError] = useState(null);

  const assignMutation = useAssignProject();
  const unassignMutation = useUnassignProject();

  const domainId = assignment?.domain?._id;

  // Query ONLY projects matching the student's enrolled domain
  const { data: projectsData, isLoading } = useAdminProjects({
    domainId,
    status: PUBLISH_STATUS.PUBLISHED,
  });

  const domainProjects = useMemo(
    () => projectsData?.items ?? [],
    [projectsData?.items],
  );

  useEffect(() => {
    if (assignment) {
      setSelectedProjectId(assignment.projectId || (domainProjects[0]?._id ?? ''));
      setActionError(null);
    }
  }, [assignment, domainProjects]);

  if (!assignment) return null;

  const isAssigned = Boolean(assignment.projectId);
  const isBusy = assignMutation.isPending || unassignMutation.isPending;
  const isWebTrack = (assignment.track || 'web').toLowerCase() === 'web';

  const handleAssign = () => {
    if (!selectedProjectId) {
      setActionError('Please select a capstone project to assign.');
      return;
    }
    setActionError(null);
    assignMutation.mutate(
      { enrollmentId: assignment.enrollmentId, projectId: selectedProjectId },
      {
        onSuccess: (res) => {
          toast.success('Project Assigned Successfully', {
            description: `${res.project?.title || 'Capstone project'} assigned to ${assignment.student?.name}.`,
          });
          onClose();
        },
        onError: (err) => {
          setActionError(getErrorMessage(err));
        },
      },
    );
  };

  const handleUnassign = () => {
    setActionError(null);
    unassignMutation.mutate(assignment.enrollmentId, {
      onSuccess: () => {
        toast.info('Project Unassigned', {
          description: `Removed project assignment from ${assignment.student?.name}.`,
        });
        onClose();
      },
      onError: (err) => {
        setActionError(getErrorMessage(err));
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={isBusy ? undefined : onClose}
      title={isAssigned ? 'Change Capstone Project Assignment' : 'Assign Capstone Project'}
      description="Select and allocate the domain-specific capstone project for this student."
      size="lg"
    >
      <div className="space-y-5">
        {actionError ? <StatusBanner variant="error">{actionError}</StatusBanner> : null}

        {/* Student Enrollment Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold dark:bg-brand-950/60 dark:text-brand-300">
                {assignment.student?.name ? assignment.student.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{assignment.student?.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{assignment.student?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="brand" icon={Building2}>
                Domain: {assignment.domain?.name}
              </Badge>
              <Badge variant="neutral" icon={isWebTrack ? Code2 : Smartphone}>
                {isWebTrack ? 'Web Development Track' : 'Mobile App Track'}
              </Badge>
              <Badge variant="outline" icon={CalendarDays}>
                {assignment.durationMonths} Months ({assignment.workingDays} Working Days)
              </Badge>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <span>
              Internship Role: <strong>Trainee Software Engineer</strong>
            </span>
            <span>
              Current Status:{' '}
              {isAssigned ? (
                <strong className="text-emerald-700 dark:text-emerald-400">Assigned ({assignment.project?.title})</strong>
              ) : (
                <strong className="text-amber-700 dark:text-amber-400">Pending Allocation</strong>
              )}
            </span>
          </div>
        </div>

        {/* Domain Projects Selection List */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FolderGit2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Available Projects for {assignment.domain?.name} Domain ({domainProjects.length})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Only projects registered under the <strong>{assignment.domain?.name}</strong> domain are eligible.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Loading available domain projects...
            </div>
          ) : domainProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-white dark:bg-slate-900 space-y-2">
              <Layers className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No published projects found for {assignment.domain?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Create a project under the {assignment.domain?.name} domain in the Projects tab before assigning.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {domainProjects.map((p) => {
                const isSelected = selectedProjectId === p._id;
                const isCurrentlyActive = assignment.projectId === p._id;

                const webStack = Array.isArray(p.webTechStack) && p.webTechStack.length > 0
                  ? p.webTechStack
                  : Array.isArray(p.technologies) ? p.technologies : [];
                const appStack = Array.isArray(p.appTechStack) ? p.appTechStack : [];

                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProjectId(p._id)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-150 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-400/30 dark:bg-brand-950/40 dark:border-brand-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedProject"
                          checked={isSelected}
                          onChange={() => setSelectedProjectId(p._id)}
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.isDefault ? (
                          <Badge variant="warning" size="sm">
                            Domain Default
                          </Badge>
                        ) : null}
                        {isCurrentlyActive ? (
                          <Badge variant="success" size="sm" icon={CheckCircle2}>
                            Currently Assigned
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    {p.description ? (
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 ml-6 leading-relaxed">
                        {p.description}
                      </p>
                    ) : null}

                    {/* Track-Specific Tech Stack Breakdown */}
                    <div className="mt-2.5 ml-6 grid gap-2 sm:grid-cols-2 text-[11px]">
                      <div className={`rounded-lg border p-2 ${isWebTrack ? 'border-sky-300 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/40' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60'}`}>
                        <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Code2 className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                            Web Track Stack
                          </span>
                          {isWebTrack ? <Badge variant="brand" size="xs">Student Track</Badge> : null}
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                          {webStack.length > 0 ? webStack.join(', ') : 'React, TypeScript, CSS'}
                        </p>
                      </div>

                      <div className={`rounded-lg border p-2 ${!isWebTrack ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-900/60 dark:bg-indigo-950/40' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60'}`}>
                        <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            App Track Stack
                          </span>
                          {!isWebTrack ? <Badge variant="brand" size="xs">Student Track</Badge> : null}
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                          {appStack.length > 0 ? appStack.join(', ') : 'React Native / Flutter'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div>
            {isAssigned ? (
              <Button
                variant="danger-outline"
                size="sm"
                onClick={handleUnassign}
                disabled={isBusy}
              >
                Unassign Current Project
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAssign}
              disabled={isBusy || domainProjects.length === 0 || !selectedProjectId}
              loading={assignMutation.isPending}
            >
              {isAssigned ? 'Update Assignment' : 'Confirm Project Assignment'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AssignProjectDialog;
