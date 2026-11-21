import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Modal } from '@/shared/components/ui';
import {
  ArrowRight,
  Sparkles,
} from '@/shared/icons';
import { paths } from '@/shared/constants';

export function DomainSelectionModal({
  open,
  onClose,
  designation,
  availableDomains = [],
}) {
  const navigate = useNavigate();
  const [selectedDomainId, setSelectedDomainId] = useState(() => availableDomains[0]?._id || '');

  // Auto-select first domain if none selected
  const activeDomainId = selectedDomainId || availableDomains[0]?._id;
  const activeDomain = availableDomains.find((d) => d._id === activeDomainId) || availableDomains[0];

  const handleStart = () => {
    if (!designation?._id || !activeDomainId) return;
    onClose();
    navigate(paths.enroll({ designationId: designation._id }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select Your Domain Specialization"
      description={designation?.name ? `Applying for ${designation.name}` : 'Internship Enrollment'}
      size="lg"
    >
      <div className="space-y-6 pt-2">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Choose the industry domain you wish to build your project in. Your direct admission and platform discount will be configured for your chosen domain track.
        </p>

        {/* Domain Cards Selector */}
        <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
          {availableDomains.map((domain) => {
            const isSelected = domain._id === activeDomainId;
            return (
              <div
                key={domain._id}
                onClick={() => setSelectedDomainId(domain._id)}
                className={`relative flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 dark:border-brand-500/80 dark:bg-brand-950/20 ring-2 ring-brand-500/30 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="domainSelector"
                    id={`domain-choice-${domain._id}`}
                    checked={isSelected}
                    onChange={() => setSelectedDomainId(domain._id)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`domain-choice-${domain._id}`}
                      className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                    >
                      {domain.name}
                    </label>
                    {isSelected && (
                      <Badge variant="brand" size="sm">
                        Selected Track
                      </Badge>
                    )}
                  </div>
                  {domain.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {domain.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Admission Banner */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Direct Admission · Instant Enrollment · Direct Concession
            </span>
            <span className="text-slate-500">
              Direct platform charges & discount applied
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={!activeDomainId}
            rightIcon={ArrowRight}
          >
            Enroll in Track ({activeDomain?.name || 'Selected Domain'})
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DomainSelectionModal;

