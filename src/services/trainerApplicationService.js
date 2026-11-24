import { api } from './api';

/**
 * Public trainer join request submission (multipart/form-data with resume file).
 */
export const submitTrainerApplication = ({
  fullName,
  email,
  phone,
  linkedinUrl,
  organization,
  domain,
  experience,
  bio,
  resume,
  website = '',
}) => {
  const form = new FormData();
  form.append('fullName', fullName ?? '');
  form.append('email', email ?? '');
  form.append('phone', phone ?? '');
  form.append('linkedinUrl', linkedinUrl ?? '');
  form.append('organization', organization ?? '');
  form.append('domain', domain ?? '');
  form.append('experience', experience ?? '');
  if (bio) form.append('bio', bio);
  if (website) form.append('website', website);
  if (resume) form.append('resume', resume);

  return api.post('/trainer-applications', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
