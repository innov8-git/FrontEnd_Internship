import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  PageLoader,
  StatCard,
  toast,
} from '@/shared/components/ui';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from '@/shared/icons';
import { ROUTES } from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import { getErrorMessage } from '@/shared/utils/errors';
import { useDomainQuestions, useDeleteDomainQuestion } from '../hooks/useDomainQuestions';
import { useDomains } from '@/features/internships/hooks/useDomains';
import { QuestionEditorModal } from '../components/QuestionEditorModal';
import { MAX_DOMAIN_QUESTIONS } from '../schemas/questionValidation';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function DomainQuestionsPage() {
  const { domainId } = useParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState({ open: false, question: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load domain details
  const domainsQuery = useDomains();
  const domain = useMemo(() => {
    const list = domainsQuery.data || [];
    return list.find((d) => d._id === domainId || d.slug === domainId);
  }, [domainsQuery.data, domainId]);

  useDocumentTitle(domain?.name ? `${domain.name} Question Bank · Admin` : 'Domain Question Bank');

  // Load questions for this domain
  const questionsQuery = useDomainQuestions(domain?._id || domainId, { search, page, limit: 15 });
  const deleteMutation = useDeleteDomainQuestion(domain?._id || domainId);

  const totalQuestions = questionsQuery.data?.totalQuestions ?? questionsQuery.data?.total ?? 0;
  const questionsList = questionsQuery.data?.items ?? questionsQuery.data?.questions ?? [];
  const totalPages = questionsQuery.data?.totalPages ?? Math.max(1, Math.ceil(totalQuestions / 15));
  const isAtCapacity = totalQuestions >= MAX_DOMAIN_QUESTIONS;
  const isAssessmentReady = totalQuestions >= 15;

  const handleOpenAdd = () => setModalState({ open: true, question: null });
  const handleOpenEdit = (q) => setModalState({ open: true, question: q });
  const handleCloseModal = () => setModalState({ open: false, question: null });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success('Question deleted');
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error('Failed to delete question', { description: getErrorMessage(err) });
      },
    });
  };

  if (domainsQuery.isLoading) {
    return <PageLoader message="Loading domain information…" />;
  }

  const breadcrumbs = [
    { label: 'Admin', to: ROUTES.ADMIN },
    { label: 'Domains', to: ROUTES.ADMIN_DOMAINS },
    { label: domain?.name ? `${domain.name} Questions` : 'Questions' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Question Repository"
        title={domain?.name ? `${domain.name} Question Bank` : 'Domain Question Bank'}
        description={
          domain?.description
            ? `${domain.description} Students selecting this domain for an internship will be served 15 questions randomly sampled from this bank.`
            : 'Add up to 100 questions for this domain. 15 questions will be randomly drawn for students during assessments.'
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              as={Link}
              to={ROUTES.ADMIN_DOMAINS}
              variant="outline"
              leftIcon={ArrowLeft}
              size="sm"
            >
              Back to Domains
            </Button>
            <Button
              variant="primary"
              leftIcon={Plus}
              onClick={handleOpenAdd}
              disabled={isAtCapacity}
              title={isAtCapacity ? `Domain reached maximum limit of ${MAX_DOMAIN_QUESTIONS} questions` : undefined}
            >
              Add Question ({totalQuestions}/{MAX_DOMAIN_QUESTIONS})
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Questions in Pool"
          value={`${totalQuestions} / ${MAX_DOMAIN_QUESTIONS}`}
          icon={FileQuestion}
          description={`${Math.round((totalQuestions / MAX_DOMAIN_QUESTIONS) * 100)}% capacity used`}
        />
        <StatCard
          label="Remaining Capacity"
          value={Math.max(0, MAX_DOMAIN_QUESTIONS - totalQuestions)}
          icon={HelpCircle}
          description={`Can add up to ${Math.max(0, MAX_DOMAIN_QUESTIONS - totalQuestions)} more questions`}
        />
        <StatCard
          label="Assessment Readiness"
          value={isAssessmentReady ? 'Ready (>=15)' : 'Needs >= 15'}
          icon={isAssessmentReady ? CheckCircle2 : AlertTriangle}
          description={
            isAssessmentReady
              ? 'Meets 15-question random sample requirement'
              : `Add at least ${15 - totalQuestions} more questions to activate assessments`
          }
        />
      </div>

      {/* Search and Filters Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search questions or options…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={Search}
                className="pr-8"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Showing {questionsList.length} of {totalQuestions} questions</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => questionsQuery.refetch()}
                isLoading={questionsQuery.isFetching}
                leftIcon={RefreshCw}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Questions List */}
      {questionsQuery.isLoading ? (
        <PageLoader message="Loading question bank…" />
      ) : questionsQuery.isError ? (
        <ErrorState
          title="Could not load questions"
          error={questionsQuery.error}
          onRetry={questionsQuery.refetch}
        />
      ) : questionsList.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title={search ? 'No matching questions found' : 'No questions in this domain yet'}
          description={
            search
              ? 'Try modifying your search query or clear the filter.'
              : `Start building the question pool for ${domain?.name || 'this domain'}. You can add up to ${MAX_DOMAIN_QUESTIONS} questions.`
          }
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear Search
              </Button>
            ) : (
              <Button variant="primary" leftIcon={Plus} onClick={handleOpenAdd}>
                Add First Question
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {questionsList.map((q, index) => {
            const questionNumber = (page - 1) * 15 + index + 1;
            return (
              <Card key={q._id || index} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 font-bold text-xs text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        #{questionNumber}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {q.text}
                        </h3>
                        {q.explanation && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 italic">
                            💡 Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Pencil}
                        onClick={() => handleOpenEdit(q)}
                        aria-label={`Edit question ${questionNumber}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        leftIcon={Trash2}
                        onClick={() => setDeleteTarget(q)}
                        aria-label={`Delete question ${questionNumber}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {(q.options || []).map((opt, optIdx) => {
                      const isCorrect = Number(q.correctIndex) === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                            isCorrect
                              ? 'border-emerald-500/80 bg-emerald-50/70 dark:border-emerald-500/60 dark:bg-emerald-950/30 font-medium text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/30'
                              : 'border-slate-200/80 bg-slate-50/50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-bold text-[10px] ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {OPTION_LETTERS[optIdx]}
                          </span>
                          <span className="flex-1 break-words">{opt}</span>
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question Editor Modal */}
      <QuestionEditorModal
        open={modalState.open}
        onClose={handleCloseModal}
        domain={domain}
        question={modalState.question}
        currentCount={totalQuestions}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action will permanently remove it from the domain's question bank."
        confirmLabel="Delete Question"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

