import { useEffect, useState } from 'react';
import { Button, Drawer, Skeleton, toast } from '@/shared/components/ui';
import { GraduationCap, Trash2, UserPlus, Users } from '@/shared/icons';
import { formatDate } from '@/shared/utils/helpers';
import { useTrainerAssignments, useUnassignFromTrainer } from '../hooks/useAdminTrainers';

export function TrainerAssignmentsDrawer({ trainer, initialTab = 'all', open, onClose, onOpenAssign }) {
  const unassignMutation = useUnassignFromTrainer();
  const [unassigningId, setUnassigningId] = useState(null);

  const actualTrainer = trainer?.trainer || trainer;
  const trainerId = actualTrainer?._id || actualTrainer?.id;

  const [activeTab, setActiveTab] = useState(trainer?.initialTab || initialTab || 'all');

  const assignmentsQuery = useTrainerAssignments(trainerId, {
    enabled: Boolean(open && trainerId),
  });

  useEffect(() => {
    if (open) {
      setActiveTab(trainer?.initialTab || initialTab || 'all');
    }
  }, [open, trainer, initialTab]);

  if (!actualTrainer) return null;

  const rawAssignments =
    assignmentsQuery.data?.items ?? assignmentsQuery.data ?? actualTrainer.assignments ?? [];
  const assignments = Array.isArray(rawAssignments) ? rawAssignments : [];
  const studentAssignments = assignments.filter((a) => Boolean(a.enrollmentId));
  const teamAssignments = assignments.filter((a) => Boolean(a.teamId));

  const handleUnassign = async (assignmentId) => {
    try {
      setUnassigningId(assignmentId);
      await unassignMutation.mutateAsync({
        trainerId,
        assignmentId,
      });
      toast.success('Assignment removed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to remove assignment');
    } finally {
      setUnassigningId(null);
    }
  };

  const showStudents = activeTab === 'all' || activeTab === 'students';
  const showGroups = activeTab === 'all' || activeTab === 'groups';

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={`Assignments: ${actualTrainer.name}`}
      description="Manage all students and student groups assigned to this trainer."
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            leftIcon={UserPlus}
            disabled={!actualTrainer.isTrainer}
            onClick={() => onOpenAssign?.(actualTrainer)}
          >
            Assign Student or Group
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick summary banner with filter tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-700 dark:text-slate-300 mr-1">View:</span>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <GraduationCap className="inline h-3.5 w-3.5 mr-1" />
              {studentAssignments.length} Students
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('groups')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Users className="inline h-3.5 w-3.5 mr-1" />
              {teamAssignments.length} Groups
            </button>
          </div>
          {!actualTrainer.isTrainer && (
            <span className="text-xs text-amber-600 font-medium">
              (Trainer privileges revoked)
            </span>
          )}
        </div>

        {assignmentsQuery.isLoading && assignments.length === 0 ? (
          <div className="space-y-3 p-2">
            <Skeleton className="h-12 w-full" rounded="lg" />
            <Skeleton className="h-12 w-full" rounded="lg" />
            <Skeleton className="h-12 w-full" rounded="lg" />
          </div>
        ) : (
          <>
            {/* Assigned Individual Students Section */}
            {showStudents && (
              <div>
                <div className="flex items-center justify-between pb-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <GraduationCap className="h-4 w-4 text-sky-600" />
                    <span>Assigned Students ({studentAssignments.length})</span>
                  </h3>
                </div>

                {studentAssignments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    No individual students assigned to this trainer yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {studentAssignments.map((assignment) => (
                      <li
                        key={assignment._id}
                        className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {assignment.student?.name || 'Student Enrollment'}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {assignment.student?.email || 'Individual'} · Assigned {formatDate(assignment.assignedAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                          loading={unassigningId === assignment._id}
                          onClick={() => handleUnassign(assignment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Unassign</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Assigned Student Groups (Teams) Section */}
            {showGroups && (
              <div>
                <div className="flex items-center justify-between pb-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Assigned Groups / Teams ({teamAssignments.length})</span>
                  </h3>
                </div>

                {teamAssignments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    No student groups or teams assigned to this trainer yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {teamAssignments.map((assignment) => (
                      <li
                        key={assignment._id}
                        className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {assignment.teamName || 'Student Group'}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            Team · Assigned {formatDate(assignment.assignedAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                          loading={unassigningId === assignment._id}
                          onClick={() => handleUnassign(assignment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Unassign</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}

export default TrainerAssignmentsDrawer;
