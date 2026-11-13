import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, StatusBanner, Textarea, toast } from '@/shared/components/ui';
import { CheckCircle2, Plus, Save } from '@/shared/icons';
import { getErrorMessage } from '@/shared/utils/errors';
import { useCreateDomainQuestion, useUpdateDomainQuestion } from '../hooks/useDomainQuestions';
import {
  domainQuestionSchema,
  MAX_DOMAIN_QUESTIONS,
  OPTION_TEXT_MAX,
  QUESTION_TEXT_MAX,
} from '../schemas/questionValidation';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionEditorModal({
  open,
  onClose,
  domain,
  question,
  currentCount = 0,
}) {
  const isEdit = Boolean(question?._id);
  const domainId = domain?._id;

  const createMutation = useCreateDomainQuestion(domainId);
  const updateMutation = useUpdateDomainQuestion(domainId);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(domainQuestionSchema),
    defaultValues: {
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    },
  });

  const selectedCorrectIndex = watch('correctIndex');

  useEffect(() => {
    if (open) {
      if (question) {
        reset({
          text: question.text || '',
          options: question.options && question.options.length === 4
            ? [...question.options]
            : ['', '', '', ''],
          correctIndex: Number.isInteger(question.correctIndex) ? question.correctIndex : 0,
          explanation: question.explanation || '',
        });
      } else {
        reset({
          text: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: '',
        });
      }
    }
  }, [open, question, reset]);

  const onSubmit = (data) => {
    if (!domainId) return;

    if (!isEdit && currentCount >= MAX_DOMAIN_QUESTIONS) {
      toast.error('Limit reached', {
        description: `This domain already has the maximum of ${MAX_DOMAIN_QUESTIONS} questions.`,
      });
      return;
    }

    if (isEdit) {
      updateMutation.mutate(
        { questionId: question._id, data },
        {
          onSuccess: () => {
            toast.success('Question updated successfully');
            onClose();
          },
          onError: (err) => {
            toast.error('Could not update question', { description: getErrorMessage(err) });
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Question added to domain pool', {
            description: `Now ${currentCount + 1} / ${MAX_DOMAIN_QUESTIONS} questions in ${domain?.name || 'domain'}.`,
          });
          onClose();
        },
        onError: (err) => {
          toast.error('Could not add question', { description: getErrorMessage(err) });
        },
      });
    }
  };

  const title = isEdit ? 'Edit Assessment Question' : 'Add Question to Domain';
  const subtitle = domain?.name ? `${domain.name} Domain Question Bank` : 'Question Bank';

  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {!isEdit && currentCount >= MAX_DOMAIN_QUESTIONS && (
          <StatusBanner variant="error" title="Maximum Capacity Reached">
            This domain has reached its full capacity of {MAX_DOMAIN_QUESTIONS} questions. Delete or edit existing questions to manage the pool.
          </StatusBanner>
        )}

        {/* Question Text */}
        <div>
          <Textarea
            label="Question Text"
            required
            rows={3}
            placeholder="e.g. Which transactional isolation level prevents phantom reads during high-volume accounting reconciliation?"
            error={errors.text?.message}
            helperText={`Clear, unambiguous multiple-choice question (up to ${QUESTION_TEXT_MAX} chars).`}
            disabled={isPending}
            {...register('text')}
          />
        </div>

        {/* 4 Options and Correct Answer Selector */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Answer Options & Correct Key <span className="text-red-500">*</span>
            </legend>
            <span className="text-xs text-slate-500">Select the radio button for the correct answer</span>
          </div>

          {errors.options?.message && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {errors.options.message}
            </p>
          )}

          <div className="space-y-2.5">
            {OPTION_LABELS.map((label, index) => {
              const isSelected = Number(selectedCorrectIndex) === index;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                    isSelected
                      ? 'border-emerald-500/80 bg-emerald-50/50 dark:border-emerald-500/60 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <label
                    htmlFor={`correct-option-${index}`}
                    className="flex items-center gap-2 cursor-pointer shrink-0 pl-1"
                    title={`Mark Option ${label} as correct answer`}
                  >
                    <input
                      id={`correct-option-${index}`}
                      type="radio"
                      name="correctIndexGroup"
                      checked={isSelected}
                      onChange={() => setValue('correctIndex', index, { shouldValidate: true })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      disabled={isPending}
                    />
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md font-bold text-xs ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {label}
                    </span>
                  </label>

                  <div className="flex-1">
                    <Input
                      placeholder={`Enter Option ${label} (max ${OPTION_TEXT_MAX} chars)`}
                      className="text-sm py-1.5"
                      error={errors.options?.[index]?.message}
                      disabled={isPending}
                      {...register(`options.${index}`)}
                    />
                  </div>

                  {isSelected && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 pr-2 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Correct Answer
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Optional Explanation */}
        <div>
          <Textarea
            label="Explanation (Optional)"
            rows={2}
            placeholder="Explain why this option is correct for the assessment review."
            error={errors.explanation?.message}
            disabled={isPending}
            {...register('explanation')}
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Pool Capacity: <strong className="text-slate-800 dark:text-slate-200">{currentCount} / {MAX_DOMAIN_QUESTIONS}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isPending}
              leftIcon={isEdit ? Save : Plus}
              disabled={!isEdit && currentCount >= MAX_DOMAIN_QUESTIONS}
            >
              {isEdit ? 'Save Changes' : 'Add Question'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default QuestionEditorModal;

