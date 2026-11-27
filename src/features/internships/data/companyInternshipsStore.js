import {
  BASE_APP_RESPONSIBILITIES,
  BASE_APP_SKILLS,
  BASE_WEB_RESPONSIBILITIES,
  BASE_WEB_SKILLS,
  PARTNER_COMPANIES,
} from './companyInternshipsData';

export const STORAGE_KEY_PARTNER_COMPANIES = 'alfre_partner_companies_v1';
export const EVENT_PARTNER_COMPANIES_UPDATED = 'alfre:partner-companies-updated';

export const PRICING_DURATIONS = Object.freeze([1, 2, 3, 6]);
export const DEFAULT_DURATION_PRICES = Object.freeze({
  1: 999,
  2: 1499,
  3: 1999,
  6: 2999,
});
export const DEFAULT_CONCESSION_PERCENT = 0;

export function parseDurationMonths(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  const matched = String(value || '').match(/\d+/);
  return matched ? parseInt(matched[0], 10) : 3;
}

function normalizeDurationMap(rawMap = {}, fallbackMap = DEFAULT_DURATION_PRICES) {
  const result = {};
  PRICING_DURATIONS.forEach((m) => {
    const key = String(m);
    const parsed = Number(rawMap?.[key] ?? rawMap?.[m]);
    result[key] = Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallbackMap[m] ?? 1999;
  });
  return result;
}

export function normalizePricing(rawPricing = {}, domains = []) {
  const rawConcession = Number(rawPricing?.concessionPercent);
  const concessionPercent = Number.isFinite(rawConcession)
    ? Math.min(100, Math.max(0, Math.round(rawConcession)))
    : DEFAULT_CONCESSION_PERCENT;

  const defaultPrices = normalizeDurationMap(rawPricing?.defaultPrices, DEFAULT_DURATION_PRICES);
  const domainPrices = {};
  const incomingDomains =
    rawPricing?.domainPrices && typeof rawPricing.domainPrices === 'object'
      ? rawPricing.domainPrices
      : {};

  Object.entries(incomingDomains).forEach(([domKey, map]) => {
    const clean = String(domKey || '').trim();
    if (clean && map && typeof map === 'object') {
      domainPrices[clean] = normalizeDurationMap(map, defaultPrices);
    }
  });

  (Array.isArray(domains) ? domains : []).forEach((dom) => {
    const clean = String(dom || '').trim();
    if (clean && !domainPrices[clean]) {
      domainPrices[clean] = { ...defaultPrices };
    }
  });

  const projectPrices = {};
  const incomingProjects =
    rawPricing?.projectPrices && typeof rawPricing.projectPrices === 'object'
      ? rawPricing.projectPrices
      : {};

  Object.entries(incomingProjects).forEach(([domKey, projMap]) => {
    const cleanDom = String(domKey || '').trim();
    if (!cleanDom || !projMap || typeof projMap !== 'object') return;
    const fallbackDom = domainPrices[cleanDom] || defaultPrices;
    const normalizedProjMap = {};
    Object.entries(projMap).forEach(([projKey, durMap]) => {
      const cleanProj = String(projKey || '').trim();
      if (cleanProj && durMap && typeof durMap === 'object') {
        normalizedProjMap[cleanProj] = normalizeDurationMap(durMap, fallbackDom);
      }
    });
    if (Object.keys(normalizedProjMap).length > 0) {
      projectPrices[cleanDom] = normalizedProjMap;
    }
  });

  return {
    concessionPercent,
    defaultPrices,
    domainPrices,
    projectPrices,
  };
}

function findDomainPriceMap(domainPrices, domainName) {
  if (!domainPrices || typeof domainPrices !== 'object' || !domainName) return null;
  const target = String(domainName).trim().toLowerCase();
  const matchedKey = Object.keys(domainPrices).find((k) => k.trim().toLowerCase() === target);
  return matchedKey ? domainPrices[matchedKey] : null;
}

function findProjectPriceMap(projectPrices, domainName, projectKeys = []) {
  if (!projectPrices || typeof projectPrices !== 'object') return null;
  const candidates = (Array.isArray(projectKeys) ? projectKeys : [projectKeys])
    .map((k) => String(k || '').trim().toLowerCase())
    .filter(Boolean);
  if (candidates.length === 0) return null;

  const domainMaps = domainName
    ? [findDomainPriceMap(projectPrices, domainName)].filter(Boolean)
    : Object.values(projectPrices).filter((m) => m && typeof m === 'object');

  for (const projMap of domainMaps) {
    for (const candidate of candidates) {
      const matchedKey = Object.keys(projMap).find((k) => k.trim().toLowerCase() === candidate);
      if (matchedKey) return projMap[matchedKey];
    }
  }
  return null;
}

export function calculateInternshipPrice({
  role,
  partner,
  domainName,
  projectId,
  projectTitle,
  projectSlug,
  duration,
}) {
  const dur = parseDurationMonths(duration);
  const durKey = String(dur);
  const projectKeys = [projectId, projectSlug, projectTitle];

  const rolePricing = role?.pricing;
  const partnerPricing = partner?.pricing;

  const roleProjectMap = findProjectPriceMap(rolePricing?.projectPrices, domainName, projectKeys);
  const partnerProjectMap = findProjectPriceMap(partnerPricing?.projectPrices, domainName, projectKeys);
  const roleDomainMap = findDomainPriceMap(rolePricing?.domainPrices, domainName);
  const partnerDomainMap = findDomainPriceMap(partnerPricing?.domainPrices, domainName);

  const rawBase =
    roleProjectMap?.[durKey] ??
    partnerProjectMap?.[durKey] ??
    roleDomainMap?.[durKey] ??
    partnerDomainMap?.[durKey] ??
    rolePricing?.defaultPrices?.[durKey] ??
    partnerPricing?.defaultPrices?.[durKey] ??
    DEFAULT_DURATION_PRICES[dur] ??
    1999;

  const basePrice = Math.max(0, Math.round(Number(rawBase) || 0));
  const rawConcession =
    rolePricing?.concessionPercent ??
    partnerPricing?.concessionPercent ??
    DEFAULT_CONCESSION_PERCENT;
  const concessionPercent = Math.min(100, Math.max(0, Math.round(Number(rawConcession) || 0)));
  const discountAmount = Math.round(basePrice * (concessionPercent / 100));
  const payableAmount = Math.max(0, basePrice - discountAmount);

  return {
    durationMonths: dur,
    domainName: domainName || partner?.assignedDomains?.[0] || partner?.domain || '',
    projectId: projectId || null,
    projectTitle: projectTitle || null,
    basePrice,
    concessionPercent,
    discountAmount,
    payableAmount,
    payablePaise: payableAmount * 100,
    currency: 'INR',
  };
}

export function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

/**
 * Deep clones partner companies array to prevent accidental mutations.
 */
function cloneCompanies(companies) {
  return JSON.parse(JSON.stringify(companies));
}

/**
 * Generates URL-safe and element-safe slugs from titles.
 */
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gets the stored partner companies from localStorage or defaults to PARTNER_COMPANIES.
 */
export function getStoredPartnerCompanies() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return cloneCompanies(PARTNER_COMPANIES);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PARTNER_COMPANIES);
    if (!raw) {
      return cloneCompanies(PARTNER_COMPANIES);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure each company has backward-compatible properties
      parsed.forEach((company) => {
        if (!company.internship && Array.isArray(company.roles) && company.roles[0]) {
          company.internship = company.roles[0];
        }
      });
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored partner companies, using defaults:', err);
  }

  return cloneCompanies(PARTNER_COMPANIES);
}

/**
 * Saves partner companies to localStorage and dispatches a broadcast event.
 */
export function saveStoredPartnerCompanies(companies) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(
      STORAGE_KEY_PARTNER_COMPANIES,
      JSON.stringify(companies),
    );
    window.dispatchEvent(
      new CustomEvent(EVENT_PARTNER_COMPANIES_UPDATED, { detail: companies }),
    );
  } catch (err) {
    console.error('Failed to save partner companies:', err);
  }
}

/**
 * Resets partner companies to the original baseline seed data.
 */
export function resetStoredPartnerCompanies() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY_PARTNER_COMPANIES);
  }
  const defaults = cloneCompanies(PARTNER_COMPANIES);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(EVENT_PARTNER_COMPANIES_UPDATED, { detail: defaults }),
    );
  }
  return defaults;
}

/**
 * Flattens partner companies into separate Web and App position cards.
 * Order: Web Development positions across all companies, followed by App Development positions.
 */
export function flattenCompanyPositions(companies = []) {
  const webList = [];
  const appList = [];
  const otherList = [];

  companies.forEach((partner) => {
    const roles = Array.isArray(partner.roles) && partner.roles.length > 0
      ? partner.roles
      : partner.internship
        ? [partner.internship]
        : [];

    roles.forEach((role) => {
      const positionCard = {
        id: `${partner.id}-${role.id}`,
        partner,
        role,
      };

      if (role.track === 'web') {
        webList.push(positionCard);
      } else if (role.track === 'app') {
        appList.push(positionCard);
      } else {
        otherList.push(positionCard);
      }
    });
  });

  return [...webList, ...appList, ...otherList];
}

/**
 * Color presets mapping for partner company logos and accents.
 */
export const COLOR_THEMES = {
  emerald: {
    label: 'Emerald (FinTech / Banking)',
    logoBg: 'bg-emerald-600',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    accentBorder: 'border-emerald-500/30 hover:border-emerald-500',
    badgeTint: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  blue: {
    label: 'Blue (Telecom / Cloud)',
    logoBg: 'bg-blue-600',
    gradient: 'from-blue-600 via-indigo-600 to-sky-600',
    accentBorder: 'border-blue-500/30 hover:border-blue-500',
    badgeTint: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  },
  rose: {
    label: 'Rose (Healthcare / MedTech)',
    logoBg: 'bg-rose-600',
    gradient: 'from-rose-600 via-pink-600 to-amber-600',
    accentBorder: 'border-rose-500/30 hover:border-rose-500',
    badgeTint: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  },
  purple: {
    label: 'Purple (Enterprise SaaS / AI)',
    logoBg: 'bg-purple-600',
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    accentBorder: 'border-purple-500/30 hover:border-purple-500',
    badgeTint: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  },
  amber: {
    label: 'Amber (Cybersecurity / Analytics)',
    logoBg: 'bg-amber-600',
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    accentBorder: 'border-amber-500/30 hover:border-amber-500',
    badgeTint: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  cyan: {
    label: 'Cyan (Robotics / IoT)',
    logoBg: 'bg-cyan-600',
    gradient: 'from-cyan-600 via-teal-600 to-blue-600',
    accentBorder: 'border-cyan-500/30 hover:border-cyan-500',
    badgeTint: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
  },
};

/**
 * Adds or updates an internship position in the stored partner companies.
 */
export function addOrUpdateCompanyInternship(formData, originalRoleId = null) {
  const currentCompanies = getStoredPartnerCompanies();
  const track = formData.track || 'web';
  const isWeb = track === 'web';

  const companyName = (formData.companyName || 'Partner Company').trim();
  const companySlug = slugify(companyName);
  const theme = COLOR_THEMES[formData.themeColor || 'blue'] || COLOR_THEMES.blue;

  const roleTitle = (formData.role || 'Trainee Software Engineer').trim();
  const designation = (formData.designation || `${roleTitle} – ${isWeb ? 'Web Development' : 'App Development'}`).trim();
  const trackLabel = isWeb ? 'Web Development' : 'App Development';
  const trackType = formData.trackType || (isWeb ? 'Full Stack Web Engineering Track' : 'Mobile Application Engineering Track');

  // Domains parsing
  const assignedDomains = Array.isArray(formData.assignedDomains)
    ? formData.assignedDomains
    : typeof formData.assignedDomains === 'string'
      ? formData.assignedDomains.split(',').map((d) => d.trim()).filter(Boolean)
      : ['General Tech'];

  const domainCategory = formData.domainCategory || slugify(assignedDomains[0] || 'tech');
  const domain = formData.domain || `${assignedDomains[0] || 'Tech'} Domain`;

  // Standard or custom responsibilities
  const responsibilities = Array.isArray(formData.rolesAndResponsibilities) && formData.rolesAndResponsibilities.length > 0
    ? formData.rolesAndResponsibilities
    : isWeb
      ? [...BASE_WEB_RESPONSIBILITIES]
      : [...BASE_APP_RESPONSIBILITIES];

  // Standard or custom skills
  const skills = Array.isArray(formData.skillsRequired) && formData.skillsRequired.length > 0
    ? formData.skillsRequired
    : isWeb
      ? [...BASE_WEB_SKILLS]
      : [...BASE_APP_SKILLS];

  const perks = Array.isArray(formData.perks) && formData.perks.length > 0
    ? formData.perks
    : [
        'Official Internship Completion Letter',
        'Dedicated 1-on-1 Industry Mentor',
        'Placement Support & Interview Drives',
      ];

  const keyDeliverables = Array.isArray(formData.keyDeliverables) && formData.keyDeliverables.length > 0
    ? formData.keyDeliverables
    : [
        `Develop responsive, scalable application modules across ${assignedDomains.join(' & ')}.`,
        'Implement authentication, state management, and modern API endpoints.',
        'Collaborate on git version control, code reviews, and production testing.',
      ];

  const techStack = Array.isArray(formData.techStack)
    ? formData.techStack
    : typeof formData.techStack === 'string'
      ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : isWeb
        ? ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'REST APIs', 'Git']
        : ['Kotlin / Java', 'Flutter', 'Android Studio', 'Firebase', 'REST APIs', 'Git'];

  const roleId = originalRoleId || `${companySlug}-${track}-${Date.now()}`;

  const assembledRole = {
    id: roleId,
    track,
    trackLabel,
    designation,
    role: roleTitle,
    fullRoleName: `${designation} – ${assignedDomains.join(' & ')}`,
    trackType,
    domains: assignedDomains,
    level: formData.level || 'Undergraduate / Graduate',
    duration: formData.duration || '1 to 6 Months',
    durationsList: formData.durationsList || ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'],
    workMode: formData.workMode || '100% Online Remote',
    applicantsCount: Number(formData.applicantsCount) || 120,
    description:
      formData.description ||
      `As a ${designation} Intern at ${companyName}, candidates will work on designing, developing, testing, and maintaining production applications across the ${assignedDomains.join(
        ' and ',
      )} domains.`,
    rolesAndResponsibilities: responsibilities,
    baseResponsibilities: responsibilities,
    keyDeliverables,
    techStack,
    skillsRequired: skills,
    perks,
    eligibility:
      formData.eligibility ||
      (isWeb
        ? 'B.Tech / B.E / BCA / MCA with core programming and web fundamentals.'
        : 'B.Tech / B.E / BCA / MCA with mobile development or OOP fundamentals.'),
    pricing: normalizePricing(formData.pricing, assignedDomains),
  };

  // If editing an existing role
  if (originalRoleId) {
    let roleUpdated = false;

    currentCompanies.forEach((company) => {
      const idx = company.roles?.findIndex((r) => r.id === originalRoleId);
      if (idx !== undefined && idx !== -1) {
        // Update role in place
        company.roles[idx] = assembledRole;
        // Also update parent company details if matching
        if (formData.companyName) company.name = companyName;
        if (formData.tagline) company.tagline = formData.tagline;
        if (formData.domain) company.domain = domain;
        if (formData.themeColor) {
          company.logoBg = theme.logoBg;
          company.gradient = theme.gradient;
          company.accentBorder = theme.accentBorder;
          company.badgeTint = theme.badgeTint;
        }
        if (formData.logoInitials) company.logoInitials = formData.logoInitials;
        if (formData.logoUrl !== undefined) {
          const trimmedLogoUrl = typeof formData.logoUrl === 'string' ? formData.logoUrl.trim() : '';
          if (trimmedLogoUrl) {
            company.logoUrl = trimmedLogoUrl;
          } else {
            delete company.logoUrl;
          }
        }
        company.assignedDomains = assignedDomains;
        company.domainCategory = domainCategory;
        company.internship = company.roles[0];
        roleUpdated = true;
      }
    });

    if (roleUpdated) {
      saveStoredPartnerCompanies(currentCompanies);
      return assembledRole;
    }
  }

  // If inserting a new role, check if the company already exists
  let targetCompany = currentCompanies.find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase() || c.id === companySlug,
  );

  if (targetCompany) {
    if (!Array.isArray(targetCompany.roles)) {
      targetCompany.roles = [];
    }
    // Check if role track already exists in this company
    const existingRoleIndex = targetCompany.roles.findIndex((r) => r.track === track);
    if (existingRoleIndex !== -1) {
      targetCompany.roles[existingRoleIndex] = assembledRole;
    } else {
      targetCompany.roles.push(assembledRole);
    }
    if (formData.logoUrl !== undefined) {
      const trimmedLogoUrl = typeof formData.logoUrl === 'string' ? formData.logoUrl.trim() : '';
      if (trimmedLogoUrl) {
        targetCompany.logoUrl = trimmedLogoUrl;
      } else {
        delete targetCompany.logoUrl;
      }
    }
    targetCompany.internship = targetCompany.roles[0];
  } else {
    // Create new company container
    const newCompany = {
      id: companySlug || `company-${Date.now()}`,
      name: companyName,
      slug: companySlug,
      domain,
      domainSlug: slugify(domainCategory),
      domainCategory,
      assignedDomains,
      assignedDomainSlugs: assignedDomains.map(slugify),
      tagline: formData.tagline || `Innovative solutions in ${assignedDomains.join(' & ')}`,
      location: formData.workMode || '100% Online Remote',
      rating: '4.9',
      hiringBatch: formData.hiringBatch || 'Batch 2026 / 2027',
      gradient: theme.gradient,
      accentBorder: theme.accentBorder,
      badgeTint: theme.badgeTint,
      logoBg: theme.logoBg,
      ...(typeof formData.logoUrl === 'string' && formData.logoUrl.trim()
        ? { logoUrl: formData.logoUrl.trim() }
        : {}),
      logoInitials:
        formData.logoInitials ||
        companyName
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      stats: {
        teamSize: '150+ Engineers',
        placementAssistance: 'Placement Support',
        mentors: 'Senior Technical Mentors',
      },
      roles: [assembledRole],
      internship: assembledRole,
    };
    currentCompanies.push(newCompany);
  }

  saveStoredPartnerCompanies(currentCompanies);
  return assembledRole;
}

/**
 * Deletes an internship position by role ID.
 */
export function deleteCompanyInternship(roleId) {
  const currentCompanies = getStoredPartnerCompanies();

  currentCompanies.forEach((company) => {
    if (Array.isArray(company.roles)) {
      company.roles = company.roles.filter((r) => r.id !== roleId);
      if (company.roles.length > 0) {
        company.internship = company.roles[0];
      }
    }
  });

  // Remove companies that have 0 roles left
  const filteredCompanies = currentCompanies.filter(
    (company) => Array.isArray(company.roles) && company.roles.length > 0,
  );

  saveStoredPartnerCompanies(filteredCompanies);
  return filteredCompanies;
}
