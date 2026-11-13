/**
 * Domain Capstone Projects.
 * Pre-seeded demo projects for testing Admin Project Management,
 * Project Assignments, and Daily Task Roadmaps.
 */

export const SEED_PROJECTS = [
  {
    title: 'LedgerCore — Retail Banking & Fund Transfer Engine',
    slug: 'ledgercore-banking',
    domainSlug: 'banking',
    designationSlug: 'trainee-software-engineer',
    starterRepoUrl: 'https://github.com/internship-portal/java-banking-starter',
    technologies: ['React.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Axios', 'Chart.js'],
    webTechStack: ['React.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Axios', 'Chart.js'],
    webDeliverables:
      'Responsive customer web portal with real-time multi-account dashboard, fund transfer forms with 2-step OTP confirmation, downloadable PDF statements, and spending analytics charts.',
    appTechStack: ['React Native', 'Expo', 'Redux Toolkit', 'Biometric Auth', 'Axios'],
    appDeliverables:
      'Cross-platform mobile banking app featuring fingerprint/FaceID login, instant UPI and P2P transfers, balance inquiry cards, and real-time push transaction alerts.',
    durationsSupported: [1, 2, 3, 6],
    isDefault: true,
    status: 'PUBLISHED',
    description:
      'Enterprise retail banking and core fund transfer platform supporting multi-account management, atomic double-entry bookkeeping, real-time balance calculations, audit logs, and fraud detection flags.',
  },
  {
    title: 'ApexPay — Digital UPI & Merchant Settlement Platform',
    slug: 'apexpay-merchant-platform',
    domainSlug: 'banking',
    designationSlug: 'trainee-software-engineer',
    starterRepoUrl: 'https://github.com/internship-portal/apexpay-starter',
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'AG Grid', 'Socket.io', 'Axios'],
    webTechStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'AG Grid', 'Socket.io', 'Axios'],
    webDeliverables:
      'Merchant web dashboard with real-time transaction ticker, payment link generator, daily settlement payout schedules, and chargeback dispute management.',
    appTechStack: ['Flutter', 'Dart', 'Provider', 'QR Code Scanner Plugin', 'Local Auth'],
    appDeliverables:
      'Merchant soundbox companion mobile app with live audio payment alerts, dynamic QR code billing, offline transaction caching, and daily collection reports.',
    durationsSupported: [1, 2, 3, 6],
    isDefault: false,
    status: 'PUBLISHED',
    description:
      'High-throughput digital payment processing gateway handling instant UPI QR collections, batch merchant payouts, settlement disputes, and real-time ledger reconciliation.',
  },
];

export default SEED_PROJECTS;
