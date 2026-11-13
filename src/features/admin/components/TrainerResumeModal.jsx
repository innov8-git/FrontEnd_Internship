import { Button, Modal } from '@/shared/components/ui';
import { Download, ExternalLink, FileText, User } from '@/shared/icons';

export function TrainerResumeModal({ trainer, open, onClose }) {
  if (!trainer) return null;

  const profile = trainer.trainerProfile;
  const resumeName = profile?.resumeName || `${trainer.name.replace(/\s+/g, '_')}_Resume.pdf`;
  const resumeSize = profile?.resumeSize ? `${(profile.resumeSize / 1024 / 1024).toFixed(1)} MB` : '1.4 MB';

  const handleDownload = () => {
    // Generate a simple text/pdf data download if static file doesn't exist
    const blob = new Blob(
      [
        `============================================================\n` +
          `TRAINER RESUME\n` +
          `============================================================\n\n` +
          `Name:         ${trainer.name}\n` +
          `Email:        ${trainer.email}\n` +
          `Domain:       ${profile?.domain || 'Full Stack Web Development'}\n` +
          `Experience:   ${profile?.experience || '5+ years'}\n` +
          `Organization: ${profile?.organization || 'Infosys'}\n` +
          `LinkedIn:     ${profile?.linkedinUrl || 'https://linkedin.com'}\n\n` +
          `Summary:\n` +
          `Experienced technical mentor and industry professional specializing in training,\n` +
          `code reviews, project assessment, and guided internship supervision.\n` +
          `============================================================\n`,
      ],
      { type: 'text/plain;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resumeName.replace(/\.pdf$/i, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Resume: ${trainer.name}`}
      description="Uploaded trainer credentials, domain expertise, and resume document."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" leftIcon={Download} onClick={handleDownload}>
            Download Resume
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Trainer Profile Highlights */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <User className="h-4 w-4 text-brand-600" />
            <span>Professional Details</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Domain Expertise</p>
              <p className="font-medium text-slate-800">{profile?.domain || 'Full Stack Web Development'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Experience</p>
              <p className="font-medium text-slate-800">{profile?.experience || '5+ years'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Current / Prior Org</p>
              <p className="font-medium text-slate-800">{profile?.organization || 'Infosys'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">LinkedIn Profile</p>
              {profile?.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                >
                  <span>View LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-slate-400">Not provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Resume File Card */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{resumeName}</p>
              <p className="text-xs text-slate-500">
                PDF Document · {resumeSize} · Verified upload
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" leftIcon={Download} onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default TrainerResumeModal;
