import { ROUTES } from '@/shared/constants';
import { formatMoney } from '@/shared/utils/helpers';

/**
 * Formats TPO commission configuration cleanly for display.
 * - FIXED: value is integer paise (e.g. 20000 -> "₹200 / paid student")
 * - PERCENTAGE: value is basis points (e.g. 1000 -> "10% of fee", 1250 -> "12.5% of fee")
 */
export function formatTpoCommission(commissionType, commissionValue) {
  const value = Number(commissionValue || 0);
  if (!value) return 'Not set (₹0)';
  if (commissionType === 'PERCENTAGE') {
    const pct = value / 100;
    const formatted = Number.isInteger(pct) ? String(pct) : pct.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted}% of fee`;
  }
  return `${formatMoney(value)} / paid student`;
}

/**
 * Builds the internship portal URL pre-populated with a TPO reference code (for students).
 */
export function buildTpoRegistrationLink(referralCode) {
  const code = String(referralCode ?? '').trim().toUpperCase();
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  return `${origin}${ROUTES.CATALOG}?ref=${encodeURIComponent(code)}`;
}

/**
 * Builds the login URL for private TPO portal access.
 */
export function buildTpoLoginLink() {
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  return `${origin}${ROUTES.LOGIN}`;
}

/**
 * Normalizes a phone number for wa.me links.
 * 10-digit numbers default to India (+91); international numbers keep their country code.
 */
function sanitizeWhatsAppPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits;
}

/**
 * Builds a clean WhatsApp message ready for the admin to send to the TPO (student-shareable code).
 */
export function buildTpoWhatsAppMessage(tpo) {
  const name = tpo?.name || 'Sir/Madam';
  const code = tpo?.referralCode || '';
  const college = tpo?.college || '';
  const portalUrl = buildTpoRegistrationLink(code);

  return [
    `Hello ${name},`,
    '',
    `Your TPO Reference Code for the Internship Portal has been generated!`,
    '',
    `Reference Code: *${code}*`,
    college ? `College: ${college}` : null,
    `Internship Portal Link: ${portalUrl}`,
    '',
    `Please share this code with your students. They can enter it on the Payment & Enrollment screen before completing checkout so their verified referrals are tracked under your TPO profile.`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

/**
 * Returns a WhatsApp Web / mobile share URL pre-addressed to the TPO's phone number.
 */
export function buildWhatsAppShareUrl(tpo) {
  const phone = sanitizeWhatsAppPhone(tpo?.phone);
  const message = encodeURIComponent(buildTpoWhatsAppMessage(tpo));
  return phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`;
}

/**
 * Builds a SEPARATE confidential WhatsApp message containing the TPO's private login credentials.
 * Kept strictly separate from the student-shareable referral code message.
 */
export function buildTpoCredentialsWhatsAppUrl(tpo, credentials) {
  const phone = sanitizeWhatsAppPhone(tpo?.phone);
  const name = tpo?.name || 'Sir/Madam';
  const loginUrl = buildTpoLoginLink();
  const message = encodeURIComponent(
    [
      `Hello ${name},`,
      '',
      `Here is your *CONFIDENTIAL* private login to check your student referral count and reference earnings:`,
      '',
      `Login URL: ${loginUrl}`,
      `Email: ${credentials?.email || tpo?.email || ''}`,
      `Password: ${credentials?.password || ''}`,
      '',
      `Please keep these credentials strictly private (do not forward to students). Share only your reference code (*${tpo?.referralCode || ''}*) with students.`,
    ].join('\n'),
  );
  return phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`;
}
