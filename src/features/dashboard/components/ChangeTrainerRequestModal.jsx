import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  Textarea,
  toast,
} from '@/shared/components/ui';
import { RefreshCw, Send, User, Phone } from '@/shared/icons';
import { useAuth } from '@/shared/hooks';
import { submitChangeTrainerRequest } from '@/services/trainerService';

/**
 * Modal allowing a student to submit a "Change Trainer" request.
 * Student name & mobile are auto-filled from the user profile.
 * The student must provide a reason for the change.
 */
export function ChangeTrainerRequestModal({ open, onClose, enrollment }) {
  const { user } = useAuth();
  const [mobile, setMobile] = useState('');
  const [reason, setReason] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setMobile('');
      setReason('');
      setMobileError('');
      setReasonError('');
    }
  }, [open]);

  const validateMobile = (value) => {
    if (!value.trim()) return 'Mobile number is required.';
    if (!/^\d{10}$/.test(value.trim())) return 'Enter a valid 10-digit mobile number.';
    return '';
  };

  const validateReason = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please provide a reason for changing your trainer.';
    if (trimmed.length < 10) return 'Reason must be at least 10 characters long.';
    if (!/[a-zA-Z]{3,}/.test(trimmed)) return 'Reason must contain meaningful text, not just numbers or symbols.';
    return '';
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const mErr = validateMobile(mobile);
      const rErr = validateReason(reason);
      setMobileError(mErr);
      setReasonError(rErr);
      if (mErr || rErr) return;

      setSubmitting(true);
      try {
        await submitChangeTrainerRequest({
          enrollmentId: enrollment?._id,
          mobile: mobile.trim(),
          reason: reason.trim(),
        });
        toast.success(
          'Your request to change trainer has been submitted. The admin will review it shortly.',
        );
        onClose();
      } catch (err) {
        toast.error(err?.message || 'Failed to submit change trainer request. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [mobile, reason, enrollment, onClose],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Trainer Change"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Submit a request to change your assigned trainer. The admin will review your request and
          assign a new trainer.
        </p>

        {/* Auto-filled student name */}
        <Input
          label="Student Name"
          leftIcon={User}
          value={user?.name || ''}
          disabled
          readOnly
        />

        {/* Student fills mobile number */}
        <Input
          label="Mobile Number"
          leftIcon={Phone}
          placeholder="Enter your 10-digit mobile number"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            if (mobileError) setMobileError(validateMobile(e.target.value));
          }}
          error={mobileError || undefined}
          required
        />

        {/* Current trainer (read-only) */}
        {enrollment?.mentor?.name ? (
          <Input
            label="Current Trainer"
            leftIcon={RefreshCw}
            value={enrollment.mentor.name}
            disabled
            readOnly
          />
        ) : null}

        {/* Reason for change */}
        <Textarea
          label="Reason for Changing Trainer"
          placeholder="Please describe why you would like to change your assigned trainer..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (reasonError) setReasonError(validateReason(e.target.value));
          }}
          error={reasonError || undefined}
          required
          minLength={10}
          maxLength={500}
          rows={4}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={Send}
            loading={submitting}
            disabled={!mobile.trim() || !reason.trim() || submitting}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ChangeTrainerRequestModal;

