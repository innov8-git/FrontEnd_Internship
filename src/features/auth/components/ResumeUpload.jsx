import { useId, useRef, useState } from 'react';
import { FormField } from '@/shared/components/ui/FormField';
import { CheckCircle2, FileText, Trash2, UploadCloud } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_SIZE_BYTES = DEFAULT_MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Format bytes into human-readable string (e.g., "1.4 MB", "340 KB").
 */
function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Validates a file against allowed extensions and max size.
 */
function validateResumeFile(file, maxSizeBytes = DEFAULT_MAX_SIZE_BYTES) {
  if (!file) return null;

  const fileName = file.name || '';
  const lastDotIndex = fileName.lastIndexOf('.');
  const fileExt = lastDotIndex !== -1 ? fileName.slice(lastDotIndex).toLowerCase() : '';
  const isExtensionValid = ACCEPTED_EXTENSIONS.includes(fileExt);

  if (!isExtensionValid) {
    return 'Please upload a PDF, DOC, or DOCX document.';
  }

  if (file.size > maxSizeBytes) {
    return `File size exceeds ${Math.round(maxSizeBytes / (1024 * 1024))} MB. Please choose a smaller file.`;
  }

  return null;
}

/**
 * ResumeUpload — clean, accessible, drag-and-drop resume uploader for trainer onboarding.
 * Follows Single Responsibility Principle (SRP) and DRY conventions.
 */
export function ResumeUpload({
  label = 'Resume / CV',
  hint = 'Upload PDF or Word document (max 5 MB).',
  value = null,
  onChange,
  error,
  disabled = false,
  required = false,
  className,
}) {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(null);

  const displayError = localError || error;

  const handleFile = (file) => {
    if (!file) return;

    const validationErr = validateResumeFile(file);
    if (validationErr) {
      setLocalError(validationErr);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLocalError(null);
    onChange?.(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange?.(null);
  };

  const handleClickDropzone = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={displayError}
      required={required}
      className={className}
    >
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={[...ACCEPTED_EXTENSIONS, ...ACCEPTED_MIME_TYPES].join(',')}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        data-testid="resume-file-input"
        aria-label={label}
      />

      {value ? (
        /* Selected File Card */
        <div
          data-testid="resume-file-card"
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-700/80 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {value.name || 'Resume Document'}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {value.size ? <span>{formatFileSize(value.size)}</span> : null}
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleClickDropzone}
              disabled={disabled}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove resume"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Area */
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleClickDropzone}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClickDropzone();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="resume-dropzone"
          aria-label="Upload resume: click or drag and drop your file here"
          className={cn(
            'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-150',
            disabled && 'cursor-not-allowed opacity-60',
            isDragging
              ? 'border-brand-500 bg-brand-50/60 dark:border-brand-400 dark:bg-brand-950/30'
              : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/20 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600',
            displayError && 'border-rose-300 dark:border-rose-800',
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 group-hover:scale-105 group-hover:bg-brand-100 transition-transform dark:bg-brand-950/60 dark:text-brand-400">
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
            <span className="font-semibold text-brand-600 dark:text-brand-400">Click to upload</span> or drag and drop
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            PDF, DOC, DOCX up to 5 MB
          </p>
        </div>
      )}
    </FormField>
  );
}

export default ResumeUpload;