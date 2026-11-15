import { useState } from 'react';
import {
  Button,
  FormField,
  Input,
  Modal,
  PasswordInput,
  Select,
  Textarea,
  toast,
} from '@/shared/components/ui';
import { Mail, KeyRound, User, Phone, Sparkles, AlertCircle } from '@/shared/icons';
import { useCreateTrainer } from '../hooks/useAdminTrainers';

const DOMAIN_OPTIONS = [
  { value: 'Full Stack Web Development', label: 'Full Stack Web Development' },
  { value: 'Frontend Development (React / Next.js)', label: 'Frontend Development (React / Next.js)' },
  { value: 'Backend Development (Node.js / Express / Prisma)', label: 'Backend Development (Node.js / Express / Prisma)' },
  { value: 'AI / Machine Learning & Data Science', label: 'AI / Machine Learning & Data Science' },
  { value: 'DevOps & Cloud Computing (AWS / Docker)', label: 'DevOps & Cloud Computing (AWS / Docker)' },
  { value: 'Mobile App Development (Flutter / React Native)', label: 'Mobile App Development (Flutter / React Native)' },
  { value: 'Cybersecurity & Ethical Hacking', label: 'Cybersecurity & Ethical Hacking' },
  { value: 'General Mentorship & Soft Skills', label: 'General Mentorship & Soft Skills' },
];

const EXPERIENCE_OPTIONS = [
  { value: '1-3 years', label: '1 - 3 years' },
  { value: '3-5 years', label: '3 - 5 years' },
  { value: '5-8 years', label: '5 - 8 years' },
  { value: '8+ years', label: '8+ years' },
];

export function CreateTrainerModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: 'Full Stack Web Development',
    experience: '3-5 years',
    password: '',
    bio: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const createTrainerMutation = useCreateTrainer();

  const handleChange = (field, value) => {
    const val = value && typeof value === 'object' && 'target' in value ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure letters and numbers are present
    if (!/[A-Z]/.test(generated)) generated += 'A';
    if (!/\d/.test(generated)) generated += '9';
    handleChange('password', generated);
    toast.info('Generated strong temporary password');
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters if provided.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    try {
      await createTrainerMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        domain: formData.domain,
        experience: formData.experience,
        password: formData.password ? formData.password.trim() : undefined,
        bio: formData.bio.trim() || undefined,
      });

      toast.success(`Trainer ${formData.name} created! Welcome email dispatched with credentials.`);
      handleClose();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create trainer.';
      toast.error(message);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      domain: 'Full Stack Web Development',
      experience: '3-5 years',
      password: '',
      bio: '',
    });
    setFormErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title="Create Trainer Account"
      description="Add a new trainer or mentor. An automated welcome email containing their login credentials will be dispatched immediately."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={createTrainerMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={createTrainerMutation.isPending}
          >
            {createTrainerMutation.isPending ? 'Creating Trainer...' : 'Create Trainer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input
              placeholder="e.g. Dr. Alex Morgan"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={createTrainerMutation.isPending}
              leftIcon={User}
            />
          </FormField>

          <FormField label="Email Address" required error={formErrors.email}>
            <Input
              type="email"
              placeholder="alex.morgan@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={createTrainerMutation.isPending}
              leftIcon={Mail}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone Number (Optional)">
            <Input
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={createTrainerMutation.isPending}
              leftIcon={Phone}
            />
          </FormField>

          <FormField label="Mentorship Domain">
            <Select
              options={DOMAIN_OPTIONS}
              value={formData.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              disabled={createTrainerMutation.isPending}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Experience Level">
            <Select
              options={EXPERIENCE_OPTIONS}
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              disabled={createTrainerMutation.isPending}
            />
          </FormField>

          <FormField
            label="Temporary Password"
            hint="Leave blank to automatically generate a secure password."
            error={formErrors.password}
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <PasswordInput
                  placeholder="Auto-generated if left blank"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={createTrainerMutation.isPending}
                  leftIcon={KeyRound}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleGeneratePassword}
                disabled={createTrainerMutation.isPending}
                title="Generate secure password"
                leftIcon={Sparkles}
              >
                Generate
              </Button>
            </div>
          </FormField>
        </div>

        <FormField label="Short Bio or Specialization Notes (Optional)">
          <Textarea
            rows={2}
            placeholder="Brief background or notes regarding projects and domains this trainer specializes in..."
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            disabled={createTrainerMutation.isPending}
          />
        </FormField>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Notice:</span> A welcome email will be sent to the trainer with their login email and initial credentials. The email includes a notice advising them to log in and reset their password immediately.
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTrainerModal;
