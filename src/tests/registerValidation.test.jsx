import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { registerSchema } from '@/features/auth/schemas/authValidation';

describe('Registration Form & Validation', () => {
  describe('registerSchema unit tests', () => {
    const validStudentData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      role: 'STUDENT',
    };

    const validTrainerData = {
      name: 'Dr. Jane Smith',
      email: 'jane.smith@university.edu',
      password: 'TrainerPass1',
      confirmPassword: 'TrainerPass1',
      role: 'TRAINER',
      domain: 'AI & Machine Learning',
      experience: '5-8 years',
      organization: 'Tech Institute',
      linkedinUrl: 'https://linkedin.com/in/janesmith',
    };

    it('passes validation for student without trainer-specific fields', () => {
      const result = registerSchema.safeParse(validStudentData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('STUDENT');
      }
    });

    it('fails validation when confirmPassword does not match password', () => {
      const result = registerSchema.safeParse({
        ...validStudentData,
        confirmPassword: 'DifferentPassword2',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(
          issues.some((i) => i.path.includes('confirmPassword') && i.message === "Passwords don't match."),
        ).toBe(true);
      }
    });

    it('fails validation when confirmPassword is empty', () => {
      const result = registerSchema.safeParse({
        ...validStudentData,
        confirmPassword: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('confirmPassword'))).toBe(true);
      }
    });

    it('fails validation when trainer omits domain or experience', () => {
      const result = registerSchema.safeParse({
        ...validTrainerData,
        domain: '',
        experience: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('domain'))).toBe(true);
        expect(issues.some((i) => i.path.includes('experience'))).toBe(true);
      }
    });

    it('fails validation when trainer provides an invalid LinkedIn URL', () => {
      const result = registerSchema.safeParse({
        ...validTrainerData,
        linkedinUrl: 'not-a-valid-url',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('linkedinUrl'))).toBe(true);
      }
    });

    it('passes validation for valid trainer with domain, experience, and linkedin URL', () => {
      const result = registerSchema.safeParse(validTrainerData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('TRAINER');
        expect(result.data.domain).toBe('AI & Machine Learning');
        expect(result.data.experience).toBe('5-8 years');
      }
    });
  });

  describe('RegisterForm component', () => {
    it('renders role toggle defaulting to Student without trainer fields', () => {
      render(
        <MemoryRouter>
          <RegisterForm onSubmit={vi.fn()} />
        </MemoryRouter>,
      );

      const studentBtn = screen.getByTestId('role-student');
      const trainerBtn = screen.getByTestId('role-trainer');

      expect(studentBtn).toBeInTheDocument();
      expect(trainerBtn).toBeInTheDocument();
      expect(studentBtn).toHaveAttribute('aria-checked', 'true');
      expect(trainerBtn).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByTestId('trainer-review-note')).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/primary mentoring domain/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('toggles to Trainer role and reveals trainer fields and review note', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <RegisterForm onSubmit={vi.fn()} />
        </MemoryRouter>,
      );

      const trainerBtn = screen.getByTestId('role-trainer');
      await user.click(trainerBtn);

      expect(trainerBtn).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('trainer-review-note')).toBeInTheDocument();
      expect(screen.getByLabelText(/primary mentoring domain/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current organization/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/linkedin \/ portfolio profile url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/resume \/ cv link/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register as trainer/i })).toBeInTheDocument();
    });

    it('allows entering a Google Drive link for trainer CV', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <RegisterForm onSubmit={vi.fn()} />
        </MemoryRouter>,
      );

      await user.click(screen.getByTestId('role-trainer'));
      const resumeInput = screen.getByLabelText(/resume \/ cv link/i);
      expect(resumeInput).toBeInTheDocument();

      await user.type(resumeInput, 'https://drive.google.com/file/d/12345/view');
      expect(resumeInput).toHaveValue('https://drive.google.com/file/d/12345/view');
    });

    it('validates invalid URL format for resume link', async () => {
      const parseResult = registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'TRAINER',
        domain: 'Full Stack Web Development',
        experience: '3-5 years',
        resumeUrl: 'not-a-valid-url',
      });
      expect(parseResult.success).toBe(false);
    });

    it('validates password matching on form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <MemoryRouter>
          <RegisterForm onSubmit={handleSubmit} />
        </MemoryRouter>,
      );

      await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass1');
      await user.type(screen.getByLabelText(/confirm password/i), 'WrongPass2');

      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('successfully submits form with matching confirmPassword and trainer details', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockResolvedValue({});

      render(
        <MemoryRouter>
          <RegisterForm onSubmit={handleSubmit} />
        </MemoryRouter>,
      );

      await user.click(screen.getByTestId('role-trainer'));
      await user.type(screen.getByLabelText(/full name/i), 'Prof. Smith');
      await user.type(screen.getByLabelText(/email address/i), 'smith@university.edu');

      // Select domain and experience
      await user.selectOptions(
        screen.getByLabelText(/primary mentoring domain/i),
        'AI & Machine Learning',
      );
      await user.selectOptions(screen.getByLabelText(/years of experience/i), '5-8 years');
      await user.type(screen.getByLabelText(/current organization/i), 'Tech Institute');
      await user.type(
        screen.getByLabelText(/linkedin \/ portfolio profile url/i),
        'https://linkedin.com/in/smith',
      );

      // Enter Google Drive resume link
      await user.type(
        screen.getByLabelText(/resume \/ cv link/i),
        'https://drive.google.com/file/d/mock-cv-link',
      );

      await user.type(screen.getByLabelText(/^password/i), 'TrainerPass1');
      await user.type(screen.getByLabelText(/confirm password/i), 'TrainerPass1');

      await user.click(screen.getByRole('button', { name: /register as trainer/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedValues = handleSubmit.mock.calls[0][0];
      expect(submittedValues.name).toBe('Prof. Smith');
      expect(submittedValues.email).toBe('smith@university.edu');
      expect(submittedValues.password).toBe('TrainerPass1');
      expect(submittedValues.confirmPassword).toBe('TrainerPass1');
      expect(submittedValues.role).toBe('TRAINER');
      expect(submittedValues.domain).toBe('AI & Machine Learning');
      expect(submittedValues.experience).toBe('5-8 years');
      expect(submittedValues.organization).toBe('Tech Institute');
      expect(submittedValues.linkedinUrl).toBe('https://linkedin.com/in/smith');
      expect(submittedValues.resumeUrl).toBe('https://drive.google.com/file/d/mock-cv-link');
    });
  });
});
