import { useState } from 'react';
import { Button, Modal, toast } from '@/shared/components/ui';
import { TargetPicker } from '@/features/assignments/components/TargetPicker';
import { TargetTypeToggle } from '@/features/assignments/components/TargetTypeToggle';
import { TARGET_TYPE } from '@/features/assignments/utils/assignmentHelpers';
import { useAssignToTrainer } from '../hooks/useAdminTrainers';

export function AssignStudentGroupModal({ trainer, open, onClose }) {
  const [targetType, setTargetType] = useState(TARGET_TYPE.ENROLLMENT);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const assignMutation = useAssignToTrainer();

  if (!trainer) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedTarget) {
      toast.error('Please select a student enrollment or team.');
      return;
    }

    try {
      await assignMutation.mutateAsync({
        trainerId: trainer._id,
        enrollmentId: targetType === TARGET_TYPE.ENROLLMENT ? selectedTarget.id : undefined,
        teamId: targetType === TARGET_TYPE.TEAM ? selectedTarget.id : undefined,
      });
      toast.success(
        `Successfully assigned ${selectedTarget.name} to ${trainer.name}`,
      );
      setSelectedTarget(null);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create assignment');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Assign to ${trainer.name}`}
      description="Choose a student enrollment or group/team to assign to this trainer."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={assignMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!selectedTarget || assignMutation.isPending}
            loading={assignMutation.isPending}
            onClick={handleSubmit}
          >
            Assign Target
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Assignment Type
          </label>
          <TargetTypeToggle
            value={targetType}
            onChange={(next) => {
              setTargetType(next);
              setSelectedTarget(null);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Select {targetType === TARGET_TYPE.TEAM ? 'Group / Team' : 'Student Enrollment'}
          </label>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
            <TargetPicker
              key={targetType}
              type={targetType}
              selected={selectedTarget}
              onSelect={setSelectedTarget}
            />
          </div>
        </div>

        {selectedTarget && (
          <div className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900 border border-brand-100">
            <p className="font-medium">Selected:</p>
            <p>{selectedTarget.name} {selectedTarget.detail ? `(${selectedTarget.detail})` : ''}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AssignStudentGroupModal;

