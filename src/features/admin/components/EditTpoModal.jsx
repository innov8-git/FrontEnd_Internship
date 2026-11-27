import { useEffect, useState } from 'react';
import { Button, FormField, Input, Modal, toast } from '@/shared/components/ui';
import { Building2, Mail, Phone, User } from '@/shared/icons';
import { useUpdateTpo } from '../hooks/useAdminTpos';

const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

export function EditTpoModal({ tpo, open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const updateTpoMutation = useUpdateTpo();

  useEffect(() => {
    if (tpo && open) {
      setFormData({
        name: tpo.name || '',
        college: tpo.college || '',
        email: tpo.email || '',
        phone: tpo.phone || '',
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
    if (formData.name.trim().length < 2) errors.name = 'TPO name must be at least 2 characters.';
    if (formData.college.trim().length < 2) errors.college = 'College name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = 'Enter a valid phone number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!tpo || !validate()) return;

    try {
      await updateTpoMutation.mutateAsync({
        id: tpo._id,
        payload: {
          name: formData.name.trim(),
          college: formData.college.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
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
      title="Edit TPO Details"
      description={
        tpo
          ? `Reference code ${tpo.referralCode} remains unchanged so existing links keep working.`
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
      </form>
    </Modal>
  );
}

export default EditTpoModal;
