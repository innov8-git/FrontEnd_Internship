import { ROUTES } from '@/shared/constants';

/**
 * Builds the internship portal URL pre-populated with a TPO reference code.
 */
export function buildTpoRegistrationLink(referralCode) {
  const code = String(referralCode ?? '').trim().toUpperCase();
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  return `${origin}${ROUTES.CATALOG}?ref=${encodeURIComponent(code)}`;
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
 * Builds a clean WhatsApp message ready for the admin to send to the TPO.
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
