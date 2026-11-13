import { useState } from 'react';
import { Badge, Button, Drawer, toast } from '@/shared/components/ui';
import { GraduationCap, Trash2, UserPlus, Users } from '@/shared/icons';
import { formatDate } from '@/shared/utils/helpers';
import { useUnassignFromTrainer } from '../hooks/useAdminTrainers';

export function TrainerAssignmentsDrawer({ trainer, open, onClose, onOpenAssign }) {
  const unassignMutation = useUnassignFromTrainer();
  const [unassigningId, setUnassigningId] = useState(null);

  if (!trainer) return null;

  const assignments = trainer.assignments || [];
  const studentAssignments = assignments.filter((a) => Boolean(a.enrollmentId));
  const teamAssignments = assignments.filter((a) => Boolean(a.teamId));

  const handleUnassign = async (assignmentId) => {
    try {
      setUnassigningId(assignmentId);
      await unassignMutation.mutateAsync({
        trainerId: trainer._id,
        assignmentId,
      });
      toast.success('Assignment removed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to remove assignment');
    } finally {
      setUnassigningId(null);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={`Assignments: ${trainer.name}`}
      description="Manage all students and student groups assigned to this trainer."
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            leftIcon={UserPlus}
            disabled={!trainer.isTrainer}
            onClick={() => onOpenAssign?.(trainer)}
          >
            Assign Student or Group
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick summary banner */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Total assigned:</span>
            <Badge variant="neutral">{studentAssignments.length} Students</Badge>
            <Badge variant="purple">{teamAssignments.length} Groups</Badge>
          </div>
          {!trainer.isTrainer && (
            <span className="text-xs text-amber-600 font-medium">
              (Trainer privileges revoked)
            </span>
          )}
        </div>

        {/* Assigned Individual Students Section */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <GraduationCap className="h-4 w-4 text-sky-600" />
              <span>Assigned Students ({studentAssignments.length})</span>
            </h3>
          </div>

          {studentAssignments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
              No individual students assigned to this trainer yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
              {studentAssignments.map((assignment) => (
                <li
                  key={assignment._id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {assignment.student?.name || 'Student Enrollment'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {assignment.student?.email || 'Individual'} · Assigned {formatDate(assignment.assignedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
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

        {/* Assigned Student Groups (Teams) Section */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Users className="h-4 w-4 text-purple-600" />
              <span>Assigned Groups / Teams ({teamAssignments.length})</span>
            </h3>
          </div>

          {teamAssignments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
              No student groups or teams assigned to this trainer yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
              {teamAssignments.map((assignment) => (
                <li
                  key={assignment._id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {assignment.teamName || 'Student Group'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      Team · Assigned {formatDate(assignment.assignedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
      </div>
    </Drawer>
  );
}

export default TrainerAssignmentsDrawer;
