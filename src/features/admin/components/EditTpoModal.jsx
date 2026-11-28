import { useEffect, useState } from 'react';
import { Button, FormField, Input, Modal, Switch, toast } from '@/shared/components/ui';
import { Building2, IndianRupee, Mail, Percent, Phone, User } from '@/shared/icons';
import { paiseToRupees, rupeesToPaise } from '@/shared/utils/helpers';
import { useUpdateTpo } from '../hooks/useAdminTpos';

const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

export function EditTpoModal({ tpo, open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    phone: '',
    commissionType: 'FIXED',
    commissionInput: '0',
    portalEnabled: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const updateTpoMutation = useUpdateTpo();

  useEffect(() => {
    if (tpo && open) {
      const type = tpo.commissionType || 'FIXED';
      const val = Number(tpo.commissionValue || 0);
      const displayVal = type === 'PERCENTAGE' ? String(val / 100) : String(paiseToRupees(val));
      setFormData({
        name: tpo.name || '',
        college: tpo.college || '',
        email: tpo.email || '',
        phone: tpo.phone || '',
        commissionType: type,
        commissionInput: displayVal,
        portalEnabled: tpo.portalEnabled !== false,
      });
      setFormErrors({});
    }
  }, [tpo, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const rawCommission = formData.commissionInput === '' ? 0 : Number(formData.commissionInput);

    if (formData.name.trim().length < 2) errors.name = 'TPO name must be at least 2 characters.';
    if (formData.college.trim().length < 2) errors.college = 'College name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = 'Enter a valid phone number.';
    }
    if (Number.isNaN(rawCommission) || rawCommission < 0) {
      errors.commissionValue = 'Enter a valid non-negative commission value.';
    } else if (formData.commissionType === 'PERCENTAGE' && rawCommission > 100) {
      errors.commissionValue = 'Percentage cannot exceed 100%.';
    } else if (formData.commissionType === 'FIXED' && rawCommission > 100000) {
      errors.commissionValue = 'Fixed commission cannot exceed ₹1,00,000.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!tpo || !validate()) return;

    const rawNum = formData.commissionInput === '' ? 0 : Number(formData.commissionInput);
    const commissionValue =
      formData.commissionType === 'PERCENTAGE'
        ? Math.round(rawNum * 100)
        : rupeesToPaise(rawNum);

    try {
      await updateTpoMutation.mutateAsync({
        id: tpo._id,
        payload: {
          name: formData.name.trim(),
          college: formData.college.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          commissionType: formData.commissionType,
          commissionValue,
          portalEnabled: formData.portalEnabled,
        },
      });
      toast.success(`Updated details for ${formData.name.trim()}.`);
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Failed to update TPO details.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Edit TPO Details & Commission"
      description={
        tpo
          ? `Reference code ${tpo.referralCode} remains unchanged. Commission edits apply only to future paid enrollments.`
          : undefined
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={updateTpoMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={updateTpoMutation.isPending}
          >
            {updateTpoMutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="TPO Full Name" htmlFor="edit-tpo-name" required error={formErrors.name}>
            <Input
              id="edit-tpo-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={updateTpoMutation.isPending}
              leftIcon={User}
            />
          </FormField>

          <FormField
            label="College / Institution"
            htmlFor="edit-tpo-college"
            required
            error={formErrors.college}
          >
            <Input
              id="edit-tpo-college"
              value={formData.college}
              onChange={(e) => handleChange('college', e.target.value)}
              disabled={updateTpoMutation.isPending}
              leftIcon={Building2}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Email Address"
            htmlFor="edit-tpo-email"
            required
            error={formErrors.email}
          >
            <Input
              id="edit-tpo-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={updateTpoMutation.isPending}
              leftIcon={Mail}
            />
          </FormField>

          <FormField
            label="Phone / WhatsApp Number"
            htmlFor="edit-tpo-phone"
            required
            error={formErrors.phone}
          >
            <Input
              id="edit-tpo-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={updateTpoMutation.isPending}
              leftIcon={Phone}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 sm:grid-cols-2">
          <FormField label="Commission Model" htmlFor="edit-tpo-commission-type">
            <select
              id="edit-tpo-commission-type"
              value={formData.commissionType}
              onChange={(e) => handleChange('commissionType', e.target.value)}
              disabled={updateTpoMutation.isPending}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="FIXED">Fixed ₹ per paid student</option>
              <option value="PERCENTAGE">Percentage (%) of paid fee</option>
            </select>
          </FormField>

          <FormField
            label={
              formData.commissionType === 'PERCENTAGE'
                ? 'Commission Percentage (%)'
                : 'Fixed Amount (₹)'
            }
            htmlFor="edit-tpo-commission-value"
            error={formErrors.commissionValue}
          >
            <Input
              id="edit-tpo-commission-value"
              type="number"
              min="0"
              max={formData.commissionType === 'PERCENTAGE' ? '100' : '100000'}
              step={formData.commissionType === 'PERCENTAGE' ? '0.5' : '1'}
              value={formData.commissionInput}
              onChange={(e) => handleChange('commissionInput', e.target.value)}
              disabled={updateTpoMutation.isPending}
              leftIcon={formData.commissionType === 'PERCENTAGE' ? Percent : IndianRupee}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Private TPO Portal Access
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Disable to immediately revoke this TPO&apos;s access to check referrals &amp; earnings.
            </p>
          </div>
          <Switch
            size="sm"
            checked={formData.portalEnabled}
            onChange={(next) => handleChange('portalEnabled', next)}
            aria-label="Enable private TPO portal access"
          />
        </div>
      </form>
    </Modal>
  );
}

export default EditTpoModal;
