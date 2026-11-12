/**
 * Data-driven architecture for partner companies, domains, and internship positions.
 * Follows SOLID principles (SRP, OCP, DRY):
 * - Base role responsibilities & skills defined once and extended via pure factory functions.
 * - 4 Partner Companies, each assigned 2 industry domains (8 domains total).
 * - 2 Internship Roles per company:
 *     1. Trainee Software Engineer – Web Development
 *     2. Trainee Software Engineer – App Development
 */

/** 12 Common Standard Responsibilities for Web Development Internships */
export const BASE_WEB_RESPONSIBILITIES = Object.freeze([
  'Develop responsive and user-friendly web applications using modern frontend technologies.',
  'Design and implement interactive user interfaces using HTML, CSS, JavaScript, and modern frameworks.',
  'Develop backend functionality, business logic, and RESTful APIs.',
  'Work with databases to store, retrieve, update, and manage application data.',
  'Implement user authentication, authorization, and role-based access control.',
  'Integrate frontend applications with backend services and third-party APIs.',
  'Develop and maintain modules such as user management, dashboards, reports, payment workflows, and administrative panels.',
  'Perform application testing, debugging, and troubleshooting.',
  'Collaborate with team members to understand project requirements and implement solutions.',
  'Maintain technical documentation and follow software development best practices.',
  'Participate in project reviews, code reviews, and development activities.',
  'Work on domain-specific business requirements and implement real-world software solutions.',
]);

/** 13 Common Standard Responsibilities for App Development Internships */
export const BASE_APP_RESPONSIBILITIES = Object.freeze([
  'Design and develop user-friendly mobile applications for Android and cross-platform environments.',
  'Build interactive application interfaces with proper navigation and responsive layouts.',
  'Develop application functionality using Java, Kotlin, Flutter, or React Native.',
  'Integrate mobile applications with backend services and RESTful APIs.',
  'Implement user registration, login, authentication, and authorization functionalities.',
  'Integrate databases and manage application data efficiently.',
  'Implement features such as notifications, user profiles, dashboards, and transaction workflows.',
  'Integrate third-party services such as payment gateways, maps, and notification services.',
  'Perform application testing, debugging, and performance optimization.',
  'Ensure application compatibility across different devices and screen sizes.',
  'Collaborate with backend developers, UI/UX designers, and project team members.',
  'Prepare technical documentation and participate in project reviews.',
  'Understand domain-specific requirements and implement mobile solutions based on real-world business scenarios.',
]);

/** Common Technical Skills for Web Development */
export const BASE_WEB_SKILLS = Object.freeze([
  'HTML5, CSS3, and JavaScript.',
  'React.js / Angular / Vue.js (any one preferred).',
  'Core Java / Python / Node.js / PHP (any one preferred).',
  'SQL and database concepts (MySQL / PostgreSQL / MongoDB).',
  'REST API development and integration.',
  'Git and GitHub for version control.',
  'Responsive web design and UI/UX fundamentals.',
  'Basic knowledge of authentication and authorization.',
]);

/** Common Technical Skills for App Development */
export const BASE_APP_SKILLS = Object.freeze([
  'Core Java / Kotlin / Dart (any one preferred).',
  'Android Studio and Android development fundamentals.',
  'Flutter / React Native (any one preferred).',
  'XML and UI layout fundamentals.',
  'REST API integration.',
  'JSON data handling.',
  'Firebase / SQLite / Room Database / MySQL fundamentals.',
  'Git and GitHub.',
  'Mobile application architecture and navigation.',
  'Basic knowledge of debugging and application testing.',
]);

/**
 * DRY Factory function to assemble an internship role with common responsibilities
 * and explicit domain mentions in the Role Overview.
 */
function createInternshipRole({
  id,
  track, // 'web' | 'app'
  companyName,
  designation,
  roleTitle,
  domains,
  description,
  keyDeliverables = [],
  techStack = [],
  skills = [],
  applicantsCount = 130,
}) {
  const isWeb = track === 'web';
  const commonResp = isWeb ? BASE_WEB_RESPONSIBILITIES : BASE_APP_RESPONSIBILITIES;
  const commonSkills = isWeb ? BASE_WEB_SKILLS : BASE_APP_SKILLS;

  // Role Overview clearly mentions the domains offered by the company
  const roleOverview =
    description ||
    (isWeb
      ? `As a Trainee Software Engineer – Web Development Intern at ${companyName}, candidates will work on designing, developing, testing, and maintaining responsive web applications. Interns will gain practical experience by working on real-world projects across the ${domains.join(
          ' and ',
        )} domains offered by ${companyName}.`
      : `As a Trainee Software Engineer – App Development Intern at ${companyName}, candidates will participate in designing, developing, testing, and maintaining mobile applications for Android and cross-platform environments. Interns will gain practical experience by working on real-world mobile application projects across the ${domains.join(
          ' and ',
        )} domains offered by ${companyName}.`);

  return {
    id,
    track,
    trackLabel: isWeb ? 'Web Development' : 'App Development',
    designation,
    role: roleTitle,
    fullRoleName: `${designation} – ${domains.join(' & ')}`,
    trackType: isWeb ? 'Full Stack Web Engineering Track' : 'Mobile Application Engineering Track',
    domains,
    level: 'Undergraduate / Graduate',
    duration: '1 to 6 Months',
    durationsList: ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'],
    workMode: '100% Online Remote',
    applicantsCount,
    description: roleOverview,
    // Common standard responsibilities of web or app developer
    rolesAndResponsibilities: commonResp,
    baseResponsibilities: commonResp,
    keyDeliverables,
    techStack,
    skillsRequired: skills.length > 0 ? skills : commonSkills,
    perks: [
      'Official Internship Completion Letter',
      'Dedicated 1-on-1 Industry Mentor',
      'Placement Support & Interview Drives',
    ],
    eligibility: isWeb
      ? 'B.Tech / B.E / BCA / MCA (2025, 2026, 2027 batches) with core programming and web fundamentals.'
      : 'B.Tech / B.E / BCA / MCA (2025, 2026, 2027 batches) with mobile development or OOP fundamentals.',
  };
}

/**
 * 4 Partner Companies with 2 Assigned Domains each (8 Domains Total)
 * and 2 Roles per company (Web Development & App Development).
 */
export const PARTNER_COMPANIES = [
  {
    id: 'inlarge-software',
    name: 'Inlarge Software',
    slug: 'inlarge-software',
    domain: 'Banking & FinTech',
    domainSlug: 'banking',
    domainCategory: 'banking',
    assignedDomains: ['Banking', 'Finance'],
    assignedDomainSlugs: ['banking', 'finance'],
    tagline: 'Enterprise core banking, payment settlement & ledger infrastructure',
    location: '100% Online Remote',
    rating: '4.9',
    hiringBatch: 'Batch 2026 / 2027',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    accentBorder: 'border-emerald-500/30 hover:border-emerald-500',
    badgeTint:
      'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    logoBg: 'bg-emerald-600',
    logoInitials: 'IS',
    stats: {
      teamSize: '250+ Engineers',
      placementAssistance: 'Placement Support',
      mentors: 'Senior FinTech Architects',
    },
    roles: [
      createInternshipRole({
        id: 'inlarge-fintech-eng',
        track: 'web',
        companyName: 'Inlarge Software',
        designation: 'Trainee Software Engineer – Web Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Banking', 'Finance'],
        description:
          'As a Trainee Software Engineer – Web Development Intern at Inlarge Software, candidates will work on designing, developing, testing, and maintaining responsive web applications. Interns will gain practical experience by working on real-world projects across the Banking and Finance domains offered by Inlarge Software, including core banking portals, high-throughput payment settlement adapters, and ledger audits.',
        keyDeliverables: [
          'Develop responsive customer banking portals and ledger reconciliation dashboards.',
          'Implement secure user authentication, role-based access control, and payment gateway workflows.',
          'Build RESTful APIs and integrate databases with automated transaction testing and audit trails.',
        ],
        techStack: ['HTML5 / CSS3', 'JavaScript', 'React.js', 'Core Java', 'PostgreSQL', 'REST APIs', 'Git'],
        applicantsCount: 142,
      }),
      createInternshipRole({
        id: 'inlarge-fintech-app',
        track: 'app',
        companyName: 'Inlarge Software',
        designation: 'Trainee Software Engineer – App Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Banking', 'Finance'],
        description:
          'As a Trainee Software Engineer – App Development Intern at Inlarge Software, candidates will participate in designing, developing, testing, and maintaining mobile applications for Android and cross-platform environments. Interns will gain practical experience on real-world projects across the Banking and Finance domains offered by Inlarge Software, including mobile banking, biometric login, and transaction workflows.',
        keyDeliverables: [
          'Design and build interactive mobile banking apps with responsive layouts and smooth navigation.',
          'Implement biometric authentication, secure transaction workflows, and push notifications.',
          'Integrate RESTful banking services, local database caching (Room/SQLite), and third-party payment gateways.',
        ],
        techStack: ['Kotlin / Java', 'Flutter', 'Android Studio', 'Room DB', 'REST APIs', 'Firebase', 'Git'],
        applicantsCount: 128,
      }),
    ],
  },
  {
    id: 'couldinger',
    name: 'Couldinger',
    slug: 'couldinger',
    domain: 'Telecom & Networks',
    domainSlug: 'telecom',
    domainCategory: 'telecom',
    assignedDomains: ['Telecom', 'Ecom'],
    assignedDomainSlugs: ['telecom', 'ecom'],
    tagline: 'Next-gen telecom orchestration, 5G edge routing & e-commerce platforms',
    location: '100% Online Remote',
    rating: '4.8',
    hiringBatch: 'Batch 2026 / 2027',
    gradient: 'from-blue-600 via-indigo-600 to-sky-600',
    accentBorder: 'border-blue-500/30 hover:border-blue-500',
    badgeTint:
      'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    logoBg: 'bg-blue-600',
    logoInitials: 'CD',
    stats: {
      teamSize: '400+ Systems Engineers',
      placementAssistance: 'Placement Support',
      mentors: 'Principal Cloud Architects',
    },
    roles: [
      createInternshipRole({
        id: 'couldinger-cloud-devops',
        track: 'web',
        companyName: 'Couldinger',
        designation: 'Trainee Software Engineer – Web Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Telecom', 'E-commerce'],
        description:
          'As a Trainee Software Engineer – Web Development Intern at Couldinger, candidates will work on designing, developing, testing, and maintaining responsive web applications. Interns will gain practical experience by working on real-world projects across the Telecom and E-commerce domains offered by Couldinger, including subscriber self-care portals, 5G data telemetry dashboards, and online shopping checkouts.',
        keyDeliverables: [
          'Develop responsive subscriber self-care and retail shopping web portals using modern frameworks.',
          'Build backend REST APIs for subscriber billing, plan recharges, product catalogs, and cart checkouts.',
          'Work with databases and third-party APIs for payment gateways, SMS notifications, and telemetry reporting.',
        ],
        techStack: ['HTML5 / CSS3', 'JavaScript', 'React.js', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
        applicantsCount: 189,
      }),
      createInternshipRole({
        id: 'couldinger-mobile-app',
        track: 'app',
        companyName: 'Couldinger',
        designation: 'Trainee Software Engineer – App Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Telecom', 'E-commerce'],
        description:
          'As a Trainee Software Engineer – App Development Intern at Couldinger, candidates will participate in designing, developing, testing, and maintaining mobile applications for Android and cross-platform environments. Interns will gain practical experience on real-world projects across the Telecom and E-commerce domains offered by Couldinger, including telecom recharge apps, e-commerce stores, and push notifications.',
        keyDeliverables: [
          'Build mobile application interfaces for catalog shopping, instant mobile recharges, and order tracking.',
          'Integrate Google Maps SDK for store locations, push notifications for flash deals, and payment gateways.',
          'Manage offline caching with SQLite/Room and optimize app performance across Android devices.',
        ],
        techStack: ['Flutter / Dart', 'React Native', 'Android Studio', 'Firebase', 'SQLite', 'REST APIs', 'Git'],
        applicantsCount: 145,
      }),
    ],
  },
  {
    id: 'proton',
    name: 'Proton',
    slug: 'proton',
    domain: 'Healthcare & MedTech',
    domainSlug: 'healthcare',
    domainCategory: 'healthcare',
    assignedDomains: ['Healthcare', 'Insurance'],
    assignedDomainSlugs: ['healthcare', 'insurance'],
    tagline: 'HIPAA-compliant health tech, clinical telemetry & insurance claims',
    location: '100% Online Remote',
    rating: '4.9',
    hiringBatch: 'Batch 2026 / 2027',
    gradient: 'from-rose-600 via-pink-600 to-amber-600',
    accentBorder: 'border-rose-500/30 hover:border-rose-500',
    badgeTint:
      'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    logoBg: 'bg-rose-600',
    logoInitials: 'PR',
    stats: {
      teamSize: '180+ MedTech Engineers',
      placementAssistance: 'Placement Support',
      mentors: 'Healthcare IT Directors',
    },
    roles: [
      createInternshipRole({
        id: 'proton-healthcare-fullstack',
        track: 'web',
        companyName: 'Proton',
        designation: 'Trainee Software Engineer – Web Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Healthcare', 'Insurance'],
        description:
          'As a Trainee Software Engineer – Web Development Intern at Proton, candidates will work on designing, developing, testing, and maintaining responsive web applications. Interns will gain practical experience by working on real-world projects across the Healthcare and Insurance domains offered by Proton, including patient electronic health record (EHR) portals, clinical appointment scheduling, and automated medical insurance claim workflows.',
        keyDeliverables: [
          'Build accessible, responsive patient and doctor portals with strict data privacy and role-based access control.',
          'Develop backend REST APIs for health records, appointment scheduling, and insurance claim adjudication.',
          'Integrate third-party diagnostic APIs, laboratory reports, and encrypted databases (PostgreSQL/MongoDB).',
        ],
        techStack: ['HTML5 / CSS3', 'JavaScript', 'React.js', 'Node.js / Python', 'MongoDB', 'REST APIs', 'Git'],
        applicantsCount: 118,
      }),
      createInternshipRole({
        id: 'proton-healthcare-app',
        track: 'app',
        companyName: 'Proton',
        designation: 'Trainee Software Engineer – App Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['Healthcare', 'Insurance'],
        description:
          'As a Trainee Software Engineer – App Development Intern at Proton, candidates will participate in designing, developing, testing, and maintaining mobile applications for Android and cross-platform environments. Interns will gain practical experience on real-world projects across the Healthcare and Insurance domains offered by Proton, including mobile health monitoring, appointment booking, and insurance claim document uploads.',
        keyDeliverables: [
          'Develop mobile health interfaces for vital tracking, doctor video consult booking, and policy cards.',
          'Integrate camera document scanning for medical bills/prescriptions and offline-first medication reminders.',
          'Implement patient authentication, secure session handling, and push notifications for health alerts.',
        ],
        techStack: ['Kotlin / Java', 'Flutter', 'Android Studio', 'Room DB', 'CameraX', 'REST APIs', 'Git'],
        applicantsCount: 112,
      }),
    ],
  },
  {
    id: 'ady-nexes',
    name: 'Ady Nexes',
    slug: 'ady-nexes',
    domain: 'Enterprise Cloud & AI',
    domainSlug: 'enterprise-ai',
    domainCategory: 'enterprise',
    assignedDomains: ['ERP/CRM', 'Loan'],
    assignedDomainSlugs: ['erp-crm', 'loan'],
    tagline: 'Multi-tenant enterprise SaaS, CRM pipelines & loan management systems',
    location: '100% Online Remote',
    rating: '4.9',
    hiringBatch: 'Batch 2026 / 2027',
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    accentBorder: 'border-purple-500/30 hover:border-purple-500',
    badgeTint:
      'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    logoBg: 'bg-purple-600',
    logoInitials: 'AN',
    stats: {
      teamSize: '320+ Platform Developers',
      placementAssistance: 'Placement Support',
      mentors: 'Principal Enterprise Engineers',
    },
    roles: [
      createInternshipRole({
        id: 'ady-nexes-enterprise-ai',
        track: 'web',
        companyName: 'Ady Nexes',
        designation: 'Trainee Software Engineer – Web Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['ERP/CRM', 'Loan Management'],
        description:
          'As a Trainee Software Engineer – Web Development Intern at Ady Nexes, candidates will work on designing, developing, testing, and maintaining responsive web applications. Interns will gain practical experience by working on real-world projects across the ERP/CRM and Loan Management domains offered by Ady Nexes, including multi-tenant sales pipeline dashboards, inventory workflows, and loan application origination portals.',
        keyDeliverables: [
          'Develop responsive enterprise dashboards, CRM kanban lead funnels, and loan EMI calculation tools.',
          'Implement backend business logic, multi-tenant authentication, and RESTful APIs with relational databases.',
          'Build automated report generation, customer notification workflows, and administrative panels.',
        ],
        techStack: ['HTML5 / CSS3', 'JavaScript', 'React.js', 'Python / FastAPI', 'PostgreSQL', 'Docker', 'Git'],
        applicantsCount: 230,
      }),
      createInternshipRole({
        id: 'ady-nexes-mobile-app',
        track: 'app',
        companyName: 'Ady Nexes',
        designation: 'Trainee Software Engineer – App Development',
        roleTitle: 'Trainee Software Engineer',
        domains: ['ERP/CRM', 'Loan Management'],
        description:
          'As a Trainee Software Engineer – App Development Intern at Ady Nexes, candidates will participate in designing, developing, testing, and maintaining mobile applications for Android and cross-platform environments. Interns will gain practical experience on real-world projects across the ERP/CRM and Loan Management domains offered by Ady Nexes, including mobile field CRM, lead capture, and on-spot loan verification tools.',
        keyDeliverables: [
          'Design and build mobile apps for field agents with interactive EMI calculators and lead tracking.',
          'Implement offline draft synchronization with SQLite/Room and push notifications for assignment alerts.',
          'Integrate camera for KYC document capture, digital signature capture, and GPS location tagging.',
        ],
        techStack: ['Flutter / Dart', 'React Native', 'Android Studio', 'SQLite', 'Firebase', 'REST APIs', 'Git'],
        applicantsCount: 160,
      }),
    ],
  },
];

// Provide default `partner.internship` for backward compatibility with existing components & tests
PARTNER_COMPANIES.forEach((company) => {
  company.internship = company.roles[0];
});

/**
 * Filter tabs supporting all domains and partner organizations.
 */
export const ALL_DOMAINS = [
  { id: 'all', label: 'All Companies & Tracks', count: 8 },
  { id: 'banking', label: 'Banking & FinTech', company: 'Inlarge Software', domains: ['Banking', 'Finance'] },
  { id: 'telecom', label: 'Telecom & Networks', company: 'Couldinger', domains: ['Telecom', 'Ecom'] },
  { id: 'healthcare', label: 'Healthcare & MedTech', company: 'Proton', domains: ['Healthcare', 'Insurance'] },
  { id: 'enterprise', label: 'Enterprise Cloud & AI', company: 'Ady Nexes', domains: ['ERP/CRM', 'Loan'] },
];

/** The 8 individual domains with company mapping */
export const DOMAIN_CHIPS = [
  { id: 'all', label: 'All Domains' },
  { id: 'banking', label: 'Banking', companyId: 'inlarge-software' },
  { id: 'finance', label: 'Finance', companyId: 'inlarge-software' },
  { id: 'telecom', label: 'Telecom', companyId: 'couldinger' },
  { id: 'ecom', label: 'E-commerce', companyId: 'couldinger' },
  { id: 'healthcare', label: 'Healthcare', companyId: 'proton' },
  { id: 'insurance', label: 'Insurance', companyId: 'proton' },
  { id: 'erp-crm', label: 'ERP / CRM', companyId: 'ady-nexes' },
  { id: 'loan', label: 'Loan Management', companyId: 'ady-nexes' },
];

/** Track filter options */
export const TRACK_OPTIONS = [
  { id: 'all', label: 'All Tracks' },
  { id: 'web', label: 'Web Development' },
  { id: 'app', label: 'App Development' },
];
