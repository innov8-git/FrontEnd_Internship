import { useState } from 'react';
import { Button, PageHeader } from '@/shared/components/ui';
import { useDocumentTitle } from '@/shared/hooks';
import { UserPlus } from '@/shared/icons';
import { TrainerAssignmentsPanel } from '../components/TrainerAssignmentsPanel';
import { TrainerSummaryCards } from '../components/TrainerSummaryCards';

/** /admin/assignments (KD11): who reviews which student enrollment or team. */
export function AssignmentsPage() {
  useDocumentTitle('Trainer assignments');
  const [dialog, setDialog] = useState({ open: false, target: null });

  const openAssign = (target = null) => setDialog({ open: true, target });
  const closeAssign = () => setDialog({ open: false, target: null });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer assignments"
        description="Choose who reviews each student's and team's work. Reassigning keeps the history."
        actions={
          <Button leftIcon={UserPlus} onClick={() => openAssign()}>
            Assign trainer
          </Button>
        }
      />

      <TrainerSummaryCards />

      <TrainerAssignmentsPanel
        dialog={dialog}
        onOpenAssign={openAssign}
        onCloseAssign={closeAssign}
      />
    </div>
  );
}

export default AssignmentsPage;
