/**
 * Dynamic Daily Task Division & Roadmap Generator for Capstone Projects.
 * Divides project tasks into separate roadmaps for Web and Mobile App Development across:
 * - 1 Month: 20 Working Days (Days 1 to 20)
 * - 2 Months: 40 Working Days (Days 1 to 40)
 * - 3 Months: 60 Working Days (Days 1 to 60)
 * - 6 Months: 120 Working Days (Days 1 to 120)
 *
 * Student connects and uploads their own GitHub repository during task submission.
 */

export const WORKING_DAYS_BY_DURATION = {
  1: 20,
  2: 40,
  3: 60,
  6: 120,
};

/**
 * 20-Day Core Syllabus for Web Development Track
 */
export const WEB_20_DAY_SYLLABUS = [
  {
    dayNumber: 1,
    title: 'Web Application Setup, Tooling & Modular Architecture',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Initialize modern frontend workspace (React/Vite/Next.js) with Tailwind CSS, ESLint, Git repository initialization, and environment variable configuration.',
    expectedOutcome:
      'Running local web server with clean folder structure, linting rules, and initial Git commit in student repository.',
  },
  {
    dayNumber: 2,
    title: 'Responsive Web Layout Shell, Header & Navigation Bar',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Build a fully responsive application shell featuring a top navbar, collapsible sidebar, breadcrumb hierarchy, and light/dark theme toggle.',
    expectedOutcome:
      'Fluid web shell adapting seamlessly across mobile, tablet, and desktop breakpoints.',
  },
  {
    dayNumber: 3,
    title: 'Domain API Client & HTTP Interceptor Architecture',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Establish centralized Axios/Fetch API client with request/response interceptors, automatic bearer token injection, and structured error normalization.',
    expectedOutcome:
      'Production-ready API abstraction layer with unified error handling and mock fallbacks.',
  },
  {
    dayNumber: 4,
    title: 'Web Authentication Flow & Protected Route Guards',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Implement Login, Register, and Forgot Password web views with client-side form validation and role-based client route protection.',
    expectedOutcome:
      'Secure authentication flow redirecting unauthorized visitors with session preservation.',
  },
  {
    dayNumber: 5,
    title: 'Domain KPI Metrics & Summary Statistics Dashboard',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Construct a high-impact dashboard view showcasing core domain KPIs, metric trend badges, and quick-action shortcuts.',
    expectedOutcome:
      'Interactive metrics dashboard displaying live domain numbers and status summaries.',
  },
  {
    dayNumber: 6,
    title: 'Domain Data Table with Live Search & Dynamic Filtering',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Build an accessible data table supporting multi-column sorting, debounced text search, and multi-parameter status/category filtering.',
    expectedOutcome:
      'High-performance data table filtering hundreds of domain records in under 16ms.',
  },
  {
    dayNumber: 7,
    title: 'Server-Side Pagination & Query Cache Synchronization',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Integrate server-side pagination controls and TanStack Query caching with optimistic updates and background refetching.',
    expectedOutcome:
      'Smooth page transitions with zero layout shift and automated cache invalidation on mutations.',
  },
  {
    dayNumber: 8,
    title: 'Create & Edit Domain Record Modal with Multi-Step Form',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Build an accessible dialog containing a multi-step form with schema validation (Zod), field error states, and dirty-state tracking.',
    expectedOutcome:
      'Polished creation/edit modal preventing accidental loss of unsaved changes.',
  },
  {
    dayNumber: 9,
    title: 'Drag-and-Drop File Upload & Document Attachment Pipeline',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Implement a drag-and-drop document uploader with file size/type validation, upload progress indicators, and preview cards.',
    expectedOutcome:
      'Secure document upload interface with client validation and cancelable uploads.',
  },
  {
    dayNumber: 10,
    title: 'Interactive Analytics Charts & Data Visualizations',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Render responsive analytical charts (Recharts / Chart.js) depicting monthly domain trends, breakdowns, and tooltips.',
    expectedOutcome:
      'Interactive chart widgets with hover inspections and date-range filters.',
  },
  {
    dayNumber: 11,
    title: 'Detailed Record Profile View & Activity Audit Timeline',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Create a dedicated domain entity detail page displaying metadata tabs, historical status timeline, and related child items.',
    expectedOutcome:
      'Comprehensive entity 360-degree view with chronological audit events.',
  },
  {
    dayNumber: 12,
    title: 'Real-Time Toast Notifications & User Feedback System',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Integrate an accessible notification toast queue with dismiss actions, auto-expiry, and status sounds/icons.',
    expectedOutcome:
      'Non-blocking user feedback system announcing API results and background updates.',
  },
  {
    dayNumber: 13,
    title: 'Report Generation & Data Export (CSV, Excel & PDF)',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Build client-side data export utilities allowing domain records to be downloaded as structured CSV and styled PDF reports.',
    expectedOutcome:
      'One-click export producing clean CSV/PDF files matching domain formatting rules.',
  },
  {
    dayNumber: 14,
    title: 'Role-Based Feature Toggles & Admin Action Permissions',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Enforce granular UI authorization hiding or disabling privileged buttons, tables, and settings based on user role.',
    expectedOutcome:
      'Context-aware UI showing administrative capabilities strictly to authorized personnel.',
  },
  {
    dayNumber: 15,
    title: 'Error Boundaries, Loading Skeletons & Graceful Empty States',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Wrap views in React Error Boundaries and build animated loading skeleton states and helpful empty illustrations.',
    expectedOutcome:
      'Resilient web application that never crashes to a white screen on unexpected failures.',
  },
  {
    dayNumber: 16,
    title: 'Web Accessibility (WCAG 2.1 AA) & Keyboard Navigation',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Audit and implement WCAG 2.1 AA accessibility: focus rings, screen reader ARIA labels, semantic HTML, and Esc/Tab navigation.',
    expectedOutcome:
      'Fully keyboard-navigable web platform validated with automated a11y tests.',
  },
  {
    dayNumber: 17,
    title: 'Performance Optimization & Lighthouse Audit (>90)',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Optimize web bundle with dynamic code splitting, route-based lazy loading, image webp formats, and tree-shaking.',
    expectedOutcome:
      'Google Lighthouse performance, accessibility, and best-practices scores exceeding 90.',
  },
  {
    dayNumber: 18,
    title: 'Automated Frontend Unit & Component Integration Tests',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Write comprehensive unit and component tests with Vitest and React Testing Library covering forms, tables, and API flows.',
    expectedOutcome:
      'Green test suite validating critical user flows with >80% code coverage.',
  },
  {
    dayNumber: 19,
    title: 'Cross-Browser Verification & End-to-End User Journeys',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Validate full customer journeys across Chrome, Firefox, Safari, and Edge. Fix layout quirks and CSS flex/grid discrepancies.',
    expectedOutcome:
      'Flawless cross-browser parity verified on all major desktop and mobile browser engines.',
  },
  {
    dayNumber: 20,
    title: 'Production Web Deployment & GitHub Release Submission',
    track: 'Web Development',
    estimatedHours: 4,
    problemStatement:
      'Configure production build pipelines, Dockerfile containerization, deploy live web application to cloud hosting, and push final release to GitHub.',
    expectedOutcome:
      'Live publicly accessible web URL with SSL certificate and GitHub release tag submitted for review.',
  },
];

/**
 * 20-Day Core Syllabus for Mobile App Development Track
 */
export const APP_20_DAY_SYLLABUS = [
  {
    dayNumber: 1,
    title: 'Mobile App Project Setup (React Native / Flutter) & Emulators',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Initialize mobile application project (React Native/Expo/Flutter) with device emulators (Android/iOS), Git repository, and native SDK tools.',
    expectedOutcome:
      'Running starter mobile application on Android/iOS simulator with initial Git commit in student repository.',
  },
  {
    dayNumber: 2,
    title: 'Mobile Navigation Architecture (Stack, Tabs & Drawer)',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Configure multi-tier mobile navigation: Native Stack Navigator for screen flows, Bottom Tab Bar for main sections, and side drawer for settings.',
    expectedOutcome:
      'Seamless mobile screen transitions with hardware back-button handling on Android and swipe-back on iOS.',
  },
  {
    dayNumber: 3,
    title: 'Safe Area Insets, Native Theming & Fluid Screen Scaling',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Implement responsive mobile styling respecting notch/island safe areas, dynamic device scaling, and system dark/light theme switching.',
    expectedOutcome:
      'Pixel-perfect mobile UI rendering cleanly across small phones, standard screens, and large phablets.',
  },
  {
    dayNumber: 4,
    title: 'Mobile Authentication Screens & Encrypted Device Storage',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Build native Login and Register mobile screens. Store JWT tokens and session data securely in EncryptedSharedPreferences / iOS Keychain.',
    expectedOutcome:
      'Secure mobile sign-in flow that survives app restart without exposing tokens to plain storage.',
  },
  {
    dayNumber: 5,
    title: 'Biometric Authentication (Fingerprint / Face ID Hardware Sensor)',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Integrate device biometric sensors (Fingerprint / Face ID / Touch ID) for instant app unlock and payment/transfer authorizations.',
    expectedOutcome:
      'Working biometric prompt with smooth fallback to device PIN / passcode.',
  },
  {
    dayNumber: 6,
    title: 'Mobile Dashboard with Interactive Swipable Card Carousel',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Construct the main mobile home screen featuring animated balance cards, quick-action circular buttons, and dynamic greeting headers.',
    expectedOutcome:
      'Smooth swipable carousel with fluid 60fps animations and active pagination dots.',
  },
  {
    dayNumber: 7,
    title: 'High-Performance Native FlatList with Pull-to-Refresh',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Implement an optimized virtualized FlatList with pull-to-refresh, infinite scroll pagination, and item separators for domain transactions.',
    expectedOutcome:
      'High-performance list rendering 1000+ items smoothly with zero frame drops.',
  },
  {
    dayNumber: 8,
    title: 'Touch Gestures, Swipe Actions & Native Haptic Vibration',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Add swipeable list items (swipe right to approve, swipe left to archive) and integrate native haptic feedback vibrations on touch.',
    expectedOutcome:
      'Tactile mobile interactions giving users physical haptic confirmation on actions.',
  },
  {
    dayNumber: 9,
    title: 'Camera Integration & Barcode / QR Code Scanner',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Request runtime camera permissions and implement a real-time QR/barcode scanner screen for instant domain data scanning.',
    expectedOutcome:
      'Fast camera scanner view with aiming frame overlay and audible scan confirmation.',
  },
  {
    dayNumber: 10,
    title: 'Location Services, GPS Coordinates & Native Interactive Map',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Integrate GPS location permissions, current device coordinates, and an interactive map view showing nearby domain branch/service markers.',
    expectedOutcome:
      'Live map with custom marker callouts, pinch-to-zoom, and distance calculations.',
  },
  {
    dayNumber: 11,
    title: 'Push Notifications (FCM / APNs) & Background Message Handlers',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Configure Firebase Cloud Messaging (FCM) / Apple Push Notifications (APNs) with foreground alerts, background handlers, and badge counts.',
    expectedOutcome:
      'Push notification alerts opening the exact target screen when tapped by the user.',
  },
  {
    dayNumber: 12,
    title: 'Offline Database Setup (SQLite / Room / WatermelonDB)',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Setup an embedded relational SQLite / Room database on the device with schema migrations for offline domain records.',
    expectedOutcome:
      'Local database tables created and queryable even when the device is completely offline.',
  },
  {
    dayNumber: 13,
    title: 'Offline Data Caching & Background Synchronisation When Online',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Implement an offline sync queue: save mutations locally when offline and automatically synchronize with backend APIs when network is restored.',
    expectedOutcome:
      'Full offline functionality with automatic conflict resolution and sync status indicators.',
  },
  {
    dayNumber: 14,
    title: 'Mobile Form Controls, Date Pickers & Modal Bottom Sheets',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Design clean mobile form screens using custom floating labels, native date/time pickers, and interactive slide-up bottom sheets.',
    expectedOutcome:
      'User-friendly mobile input forms with keyboard auto-avoiding views.',
  },
  {
    dayNumber: 15,
    title: 'System Share Dialogs, In-App Audio & File Storage Access',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Integrate native OS Share Sheet (to share receipts/reports via WhatsApp, Email) and access device file system for saving PDFs.',
    expectedOutcome:
      'Seamless integration with native OS sharing mechanisms and local file storage.',
  },
  {
    dayNumber: 16,
    title: 'Tablet / Foldable Screen Adaptation & Orientation Handling',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Optimize the application for tablets and foldable devices with dual-pane master-detail layouts and landscape orientation support.',
    expectedOutcome:
      'Adaptive layouts that transform into two columns on tablets and foldables.',
  },
  {
    dayNumber: 17,
    title: 'Mobile Memory Leak Profiling & Battery Consumption Audit',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Profile mobile app using Android Profiler / Xcode Instruments. Eliminate memory leaks, unmount listeners, and optimize battery drain.',
    expectedOutcome:
      'Consistently low memory footprint under 90MB and zero runaway background threads.',
  },
  {
    dayNumber: 18,
    title: 'Mobile Unit & Snapshot Tests with Jest / Testing Library',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Write unit tests for mobile hooks, state stores, and snapshot tests for screen components using React Native Testing Library.',
    expectedOutcome:
      'Automated test suite verifying mobile component rendering and state transitions.',
  },
  {
    dayNumber: 19,
    title: 'App Icons, Native Splash Screens & Permissions Hardening',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Generate adaptive app launcher icons for all Android mipmap densities and iOS asset sets. Configure native animated splash screens.',
    expectedOutcome:
      'Professional branded mobile launch experience with verified permission prompts.',
  },
  {
    dayNumber: 20,
    title: 'Signed Android Release APK / Bundle Build & GitHub Release',
    track: 'Mobile App Development',
    estimatedHours: 4,
    problemStatement:
      'Generate signed release APK / AAB bundles using release keystore, verify ProGuard code shrinking, and attach release binary to GitHub.',
    expectedOutcome:
      'Production-ready signed standalone APK package verified on physical device and committed to GitHub repository.',
  },
];

/**
 * Extends the daily syllabus smoothly across 20, 40, 60, or 120 working days
 * for either Web Development or Mobile App Development.
 */
export function generateDailyTasksForProject(
  project,
  durationMonths = 1,
  track = 'web',
) {
  const totalDays = WORKING_DAYS_BY_DURATION[durationMonths] || 20;
  const isAppTrack = track === 'app' || track === 'mobile' || track === 'mobile_app';
  const baseSyllabus = isAppTrack ? APP_20_DAY_SYLLABUS : WEB_20_DAY_SYLLABUS;
  const trackLabel = isAppTrack ? 'Mobile App Development' : 'Web Development';
  const projectTitle = project?.title || 'Capstone Project';
  const domainName = project?.domain?.name || 'Industry Domain';

  const tasks = [];
  for (let day = 1; day <= totalDays; day++) {
    const baseIndex = (day - 1) % baseSyllabus.length;
    const base = baseSyllabus[baseIndex];
    const cycle = Math.floor((day - 1) / baseSyllabus.length) + 1;

    const cyclePrefix =
      cycle > 1 ? `Sprint ${cycle} Advanced: ` : '';

    const phase =
      day <= Math.round(totalDays * 0.25)
        ? 'Phase 1: Environment & Architecture'
        : day <= Math.round(totalDays * 0.5)
        ? 'Phase 2: Core Domain Features & Business Processing'
        : day <= Math.round(totalDays * 0.75)
        ? 'Phase 3: Advanced Integrations, Offline & Real-time Scale'
        : 'Phase 4: Security Hardening, Production Deployment & QA';

    tasks.push({
      _id: `task_${project?._id || 'proj'}_${isAppTrack ? 'app' : 'web'}_day_${day}`,
      dayNumber: day,
      sequence: day,
      phase,
      title: `${cyclePrefix}${base.title}`,
      track: trackLabel,
      estimatedHours: base.estimatedHours,
      problemStatement: `[${domainName} - ${projectTitle}] Day ${day} (${trackLabel}): ${base.problemStatement}`,
      expectedOutcome: base.expectedOutcome,
      acceptanceCriteria: [
        `Code committed to student's GitHub repository branch for Day ${day}.`,
        `Functional test verification for ${trackLabel} deliverable.`,
        `Verified compliance with ${domainName} business scenario constraints.`,
      ],
      requiresTrainerReview: day % 5 === 0, // Every 5th working day requires mentor review
    });
  }

  return tasks;
}

export default generateDailyTasksForProject;
