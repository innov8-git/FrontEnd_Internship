import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from '@/shared/components/ui';
import { Loader2, Lock, ShieldCheck, ExternalLink } from '@/shared/icons';
import { formatMoney } from '@/shared/utils/helpers';
import { planLabel } from '../../utils/plans';

/**
 * HDFC SmartGateway Checkout Adapter (Enterprise Hosted Checkout).
 *
 * Reads the server-generated `payment_url` from the payment session order
 * and seamlessly redirects the student to HDFC SmartGateway's PCI-DSS compliant
 * hosted checkout page (cards, UPI, net banking).
 *
 * Adapter props (shared with all gateways): { order, enrollment, user, open, onClose, onComplete }.
 */
export function HdfcCheckout({ order, enrollment, user, open, onClose, onComplete }) {
  const [redirecting, setRedirecting] = useState(false);
  const callbacks = useRef({ onClose, onComplete });
  callbacks.current = { onClose, onComplete };

  const paymentUrl = order?.payment_url || order?.checkoutData?.payment_url;
  const amountText = order?.amount ? formatMoney(order.amount, order.currency || 'INR') : null;
  const planTitle = planLabel(enrollment?.plan) || 'Internship Enrollment';

  useEffect(() => {
    if (!open || !order) {
      setRedirecting(false);
      return undefined;
    }

    if (!paymentUrl) {
      toast.error('Unable to open HDFC SmartGateway', {
        description: 'Payment session URL was not received from the server. Please try again.',
      });
      callbacks.current.onClose?.();
      return undefined;
    }

    setRedirecting(true);
    let cancelled = false;

    // Small delay allows smooth rendering of the branded redirect modal
    const redirectTimer = setTimeout(() => {
      if (!cancelled) {
        if (typeof window !== 'undefined') {
          window.location.href = paymentUrl;
        }
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(redirectTimer);
      setRedirecting(false);
    };
  }, [open, order, paymentUrl]);

  if (!open || !redirecting || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hdfc-checkout-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 text-center">
        {/* Gateway Security Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>

        <h3 id="hdfc-checkout-title" className="text-lg font-bold text-slate-900">
          Redirecting to HDFC SmartGateway
        </h3>

        <p className="mt-1.5 text-sm text-slate-600">
          Connecting to HDFC Bank's secure 256-bit encrypted checkout.
        </p>

        {/* Order Details Preview */}
        <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-left text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Program</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px]">{planTitle}</span>
          </div>
          {amountText && (
            <div className="flex justify-between text-slate-600">
              <span>Payable Amount</span>
              <span className="font-bold text-emerald-600 text-sm">{amountText}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Order Reference</span>
            <span className="font-mono text-slate-700">{order?.orderId}</span>
          </div>
        </div>

        {/* Spinner & Warning Advisory */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2.5 text-sm font-medium text-brand-600">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Transferring to bank portal…</span>
          </div>
          <p className="text-xs text-slate-500">
            Please do not refresh or press back while we securely transfer you.
          </p>
        </div>

        {/* Fallback Direct Link */}
        {paymentUrl && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <a
              href={paymentUrl}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
              rel="noopener noreferrer"
            >
              <span>Click here if not redirected automatically</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span>PCI-DSS Level 1 Certified Bank Gateway</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HdfcCheckout;
