import { useState } from 'react';
import { Button, Modal, toast } from '@/shared/components/ui';
import { Download, ExternalLink, Eye, FileText, User } from '@/shared/icons';
import { fetchTrainerResumeBlob } from '@/services/adminService';

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function TrainerResumeModal({ trainer, open, onClose }) {
  const [busy, setBusy] = useState(false);

  if (!trainer) return null;

  const profile = trainer.trainerProfile;
  const hasRealResume = Boolean(profile?.resumeUrl);
  const resumeName = profile?.resumeName || `${trainer.name.replace(/\s+/g, '_')}_Resume.pdf`;
  const resumeSize = formatBytes(profile?.resumeSize);

  const handleResumeAction = async (download) => {
    if (!hasRealResume) return;
    setBusy(true);
    try {
      const blob = await fetchTrainerResumeBlob(trainer._id, { download });
      const blobUrl = URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = resumeName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      }
    } catch (err) {
      toast.error(err?.message || 'Unable to load trainer resume.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Trainer Profile & Resume: ${trainer.name}`}
      description="Trainer credentials, domain expertise, and uploaded resume document."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {hasRealResume ? (
            <Button
              variant="primary"
              leftIcon={Download}
              loading={busy}
              onClick={() => handleResumeAction(true)}
            >
              Download Resume
            </Button>
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        {/* Trainer Profile Highlights */}
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>Professional Details</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Domain Expertise</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {profile?.domain || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Experience</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {profile?.experience || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Company / College</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {profile?.organization || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mobile Number</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {trainer.phone || 'Not provided'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">LinkedIn Profile</p>
              {profile?.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                >
                  <span>{profile.linkedinUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">Not provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Resume File Card */}
        {hasRealResume ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {resumeName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {resumeSize ? `${resumeSize} · ` : ''}Uploaded resume
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(!profile?.resumeMimeType || profile.resumeMimeType === 'application/pdf') ? (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Eye}
                  loading={busy}
                  onClick={() => handleResumeAction(false)}
                >
                  View
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                leftIcon={Download}
                loading={busy}
                onClick={() => handleResumeAction(true)}
              >
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No resume file has been uploaded for this trainer yet.
          </div>
        )}
      </div>
    </Modal>
  );
}

export default TrainerResumeModal;
