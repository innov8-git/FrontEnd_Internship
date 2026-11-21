/**
 * Checks whether a trainer's extended profile is complete.
 * A newly created trainer starts with domain/experience set by admin,
 * but needs organization, LinkedIn profile, and resume to be fully complete.
 *
 * @param {object} trainerProfile
 * @returns {boolean}
 */
export function isTrainerProfileComplete(trainerProfile) {
  if (!trainerProfile) return false;
  const hasOrg = Boolean(trainerProfile.organization && trainerProfile.organization.trim());
  const hasLinkedin = Boolean(trainerProfile.linkedinUrl && trainerProfile.linkedinUrl.trim());
  const hasResume = Boolean(
    trainerProfile.resumeName ||
    trainerProfile.resumeUrl ||
    trainerProfile.resume
  );
  return hasOrg && hasLinkedin && hasResume;
}
