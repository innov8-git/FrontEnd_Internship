import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  DescriptionList,
  Drawer,
  toast,
} from '@/shared/components/ui';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Trash2,
} from '@/shared/icons';
import { fetchTrainerApplicationResumeBlob } from '@/services/adminService';
import { formatDateTime, formatRelativeTime } from '@/shared/utils/helpers';
import { DetailSection } from './DetailSection';

function formatBytes(bytes) {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Opens or downloads a trainer application's resume via authenticated admin API. */
// eslint-disable-next-line react-refresh/only-export-components
export async function openApplicationResume(application, { download = false } = {}) {
  const blob = await fetchTrainerApplicationResumeBlob(application._id, { download });
  const blobUrl = URL.createObjectURL(blob);
  if (download) {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = application.resumeName || `${application.fullName}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  } else {
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }
}

export function TrainerApplicationDrawer({ application, onClose, onAccept, onDelete }) {
  const [shown, setShown] = useState(application);
  const [resumeBusy, setResumeBusy] = useState(false);

  if (application && application !== shown) setShown(application);
  const item = shown;

  const handleResumeAction = async (download) => {
    if (!item) return;
    setResumeBusy(true);
    try {
      await openApplicationResume(item, { download });
    } catch (err) {
      toast.error(err?.message || 'Unable to load resume file.');
    } finally {
      setResumeBusy(false);
    }
  };

  return (
    <Drawer
      open={Boolean(application)}
      onClose={onClose}
      size="lg"
      title={item ? item.fullName : 'Trainer Join Request'}
      description={
        item
          ? `Submitted ${formatDateTime(item.createdAt)} (${formatRelativeTime(item.createdAt)})`
          : undefined
      }
      footer={
        item ? (
          <div className="flex w-full items-center justify-between gap-3">
            <Button
              variant="outline"
              leftIcon={Trash2}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
              onClick={() => onDelete?.(item)}
            >
              Delete Request
            </Button>
            <Button leftIcon={CheckCircle2} onClick={() => onAccept?.(item)}>
              Accept &amp; Set Credentials
            </Button>
          </div>
        ) : null
      }
    >
      {item ? (
        <div className="space-y-6">
          {item.existingUser ? (
            <Alert variant="warning" title="Existing account found">
              This email already belongs to{' '}
              <span className="font-semibold">{item.existingUser.name}</span> (roles:{' '}
              {(item.existingUser.roles || []).join(', ') || 'None'}). Accepting will grant Trainer
              privileges to this account and attach this resume.
            </Alert>
          ) : null}

          <DetailSection title="Applicant Information">
            <DescriptionList
              items={[
                { label: 'Full Name', value: item.fullName },
                { label: 'Email Address', value: item.email },
                { label: 'Mobile Number', value: item.phone },
                { label: 'Company / College', value: item.organization },
                { label: 'Primary Domain', value: <Badge variant="info">{item.domain}</Badge> },
                { label: 'Experience', value: item.experience },
                {
                  label: 'LinkedIn Profile',
                  span: 2,
                  value: item.linkedinUrl ? (
                    <a
                      href={item.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    >
                      <span>{item.linkedinUrl}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    'Not provided'
                  ),
                },
              ]}
            />
          </DetailSection>

          {item.bio ? (
            <DetailSection title="Bio / Mentoring Notes">
              <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                {item.bio}
              </p>
            </DetailSection>
          ) : null}

          <DetailSection title="Uploaded Resume">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {item.resumeName || 'Resume.pdf'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(item.resumeSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.resumeMimeType === 'application/pdf' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Eye}
                    loading={resumeBusy}
                    onClick={() => handleResumeAction(false)}
                  >
                    View PDF
                  </Button>
                ) : null}
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Download}
                  loading={resumeBusy}
                  onClick={() => handleResumeAction(true)}
                >
                  Download
                </Button>
              </div>
            </div>
          </DetailSection>
        </div>
      ) : null}
    </Drawer>
  );
}

export default TrainerApplicationDrawer;
