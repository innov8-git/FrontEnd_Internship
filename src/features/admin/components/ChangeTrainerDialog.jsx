import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Select, toast } from '@/shared/components/ui';
import { GraduationCap, UserCheck, UserCog, UserX } from '@/shared/icons';
import { useTrainerOptions } from '@/features/assignments/hooks/useAssignments';
import { useUpdateStudentTrainer } from '../hooks/useAdminUsers';

export function ChangeTrainerDialog({ student, open, onClose }) {
  const trainersQuery = useTrainerOptions();
  const updateMutation = useUpdateStudentTrainer();

  const currentAssignment = student?.assignedTrainer;
  const currentTrainer = currentAssignment?.trainer;
  const isAssigned = Boolean(currentAssignment?.assigned && currentTrainer);

  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedTrainerId(currentAssignment?.trainerId || '');
      setError(null);
    }
  }, [open, currentAssignment]);

  const trainers = useMemo(() => trainersQuery.data ?? [], [trainersQuery.data]);

  const trainerOptions = useMemo(() => {
    return trainers.map((t) => ({
      value: t._id,
      label: `${t.name}${t.email ? ` (${t.email})` : ''}`,
    }));
  }, [trainers]);

  if (!student) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedTrainerId) {
      setError('Please select a trainer.');
      return;
    }
    if (selectedTrainerId === currentAssignment?.trainerId) {
      setError('Please choose a different trainer to reassign.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: student._id,
        trainerId: selectedTrainerId,
      });
      const chosenTrainer = trainers.find((t) => t._id === selectedTrainerId);
      toast.success(
        isAssigned
          ? `Trainer changed to ${chosenTrainer?.name || 'new trainer'} for ${student.name}`
          : `Trainer ${chosenTrainer?.name || ''} assigned to ${student.name}`,
      );
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update trainer');
    }
  };

  const handleUnassign = async () => {
    try {
      await updateMutation.mutateAsync({
        id: student._id,
        unassign: true,
      });
      toast.success(`Trainer unassigned from ${student.name}`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to unassign trainer');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isAssigned ? `Change Trainer: ${student.name}` : `Assign Trainer: ${student.name}`}
      description="Update or reassign the dedicated trainer responsible for reviewing this student's submissions."
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {isAssigned && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                loading={updateMutation.isPending}
                onClick={handleUnassign}
              >
                <UserX className="h-4 w-4 mr-1.5" />
                Unassign Trainer
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={UserCheck}
              loading={updateMutation.isPending}
              disabled={!selectedTrainerId || selectedTrainerId === currentAssignment?.trainerId}
              onClick={handleSubmit}
            >
              {isAssigned ? 'Save & Reassign' : 'Assign Trainer'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Student summary card */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{student.name}</p>
            <p className="truncate text-xs text-slate-500">{student.email}</p>
          </div>
        </div>

        {/* Current trainer status card */}
        <div className="rounded-lg border border-slate-200 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Current Assigned Trainer
          </p>
          {isAssigned ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-brand-600" />
                <span className="font-medium text-slate-900">{currentTrainer.name}</span>
                <span className="text-xs text-slate-500">({currentTrainer.email})</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Assigned
              </span>
            </div>
          ) : (
            <p className="text-slate-500 italic">No trainer is currently assigned to this student.</p>
          )}
        </div>

        {/* Trainer selection */}
        <div>
          <Select
            label="Select New Trainer"
            placeholder="Choose an active trainer…"
            options={trainerOptions}
            value={selectedTrainerId}
            error={error}
            onChange={(e) => {
              setSelectedTrainerId(e.target.value);
              setError(null);
            }}
          />
          {isAssigned && selectedTrainerId === currentAssignment?.trainerId && (
            <p className="mt-1 text-xs text-slate-500">
              This trainer is currently assigned. Select another trainer to change.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ChangeTrainerDialog;

