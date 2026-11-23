import { useId } from 'react';
import { Badge, Button, Card } from '@/shared/components/ui';
import { BadgeCheck, Landmark, Lock, ShieldCheck, Zap } from '@/shared/icons';
import { formatMoney } from '@/shared/utils/helpers';

/**
 * The pay call-to-action on /payment/:enrollmentId (SN9, PAY-17).
 * Shows the server's payable amount, a "Pay ₹X" (or "Retry payment") button,
 * and bank security badges ("256-bit Bank Encryption", "Powered by HDFC SmartGateway").
 */
export function PayPanel({
  amount,
  currency = 'INR',
  isRetry = false,
  canPay = true,
  blockedReason,
  loading = false,
  onPay,
  isTestMode = false,
  className,
}) {
  const hintId = useId();
  const amountText = formatMoney(amount, currency);

  return (
    <Card padding="lg" className={className}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">Total payable</p>
        {isTestMode ? (
          <Badge variant="warning" icon={Zap}>
            Test mode
          </Badge>
        ) : null}
      </div>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{amountText}</p>
      <p className="mt-1 text-xs text-slate-500">Locked price, charged in {currency}.</p>

      <Button
        className="mt-5"
        fullWidth
        size="lg"
        leftIcon={Lock}
        loading={loading}
        disabled={!canPay}
        onClick={onPay}
        aria-describedby={blockedReason ? hintId : undefined}
      >
        {isRetry ? 'Retry payment' : `Pay ${amountText}`}
      </Button>
      {blockedReason ? (
        <p id={hintId} className="mt-2 text-center text-xs text-slate-500">
          {blockedReason}
        </p>
      ) : null}

      {/* Security & Bank Partner Badges (PAY-17) */}
      <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Landmark className="h-4 w-4 text-brand-600 shrink-0" aria-hidden="true" />
          <span>Powered by HDFC SmartGateway</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>256-bit Bank Grade SSL Encryption</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        <li className="flex gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>Payments are handled securely via HDFC. We never see or store your card or UPI credentials.</span>
        </li>
        <li className="flex gap-2">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          <span>Your internship starts immediately after the bank confirms the payment.</span>
        </li>
      </ul>
    </Card>
  );
}

export default PayPanel;
