/**
 * Task definitions per schedule template (tickets GP1, MM10). Pure data: no imports.
 *
 * TASK_TEMPLATES[templateKey] = [{ key, dayNumber, title, problemStatement, expectedOutcome,
 *   acceptanceCriteria: string[], starterRepoUrl, estimatedHours, requiresTrainerReview,
 *   prerequisiteKeys: string[] }]
 * Keys are "T1".."Tn" (sequence = array order). prerequisiteKeys refer to keys in the same template
 * and contain no cycles. templateKey matches SCHEDULE_TEMPLATES[].key in ./schedules.js, and every
 * dayNumber exists in that template.
 */

const JAVA_BANKING_REPO = 'https://github.com/internship-portal/java-banking-starter';
const FULLSTACK_ECOMMERCE_REPO =
  'https://github.com/internship-portal/fullstack-ecommerce-starter';
const DEVOPS_TELECOM_REPO = 'https://github.com/internship-portal/devops-telecom-starter';
const DOTNET_HEALTHCARE_REPO = 'https://github.com/internship-portal/dotnet-healthcare-starter';

export const TASK_TEMPLATES = {
  'java-banking': [
    {
      key: 'T1',
      dayNumber: 1,
      title: 'Project Architecture, Workspace Setup & UI Tokens',
      problemStatement:
        'You are joining the engineering team building LedgerCore, the core banking and fund-transfer platform. Before building customer features, establish a robust, modular workspace with Tailwind CSS, design tokens for banking UI (brand colors, typography, spacing), ESLint rules, and initial Git repository setup.',
      expectedOutcome:
        'A running local development environment with clean modular architecture, design tokens, and initial commit pushed to your repository.',
      acceptanceCriteria: [
        'Local development server starts with zero build errors or warnings',
        'Design tokens for banking theme (brand colors, surface cards, typography) configured',
        'Directory structure separates components, services, hooks, and pages',
        'Initial commit pushed on your feature branch with conventional commit format',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 4,
      requiresTrainerReview: false,
      prerequisiteKeys: [],
    },
    {
      key: 'T2',
      dayNumber: 2,
      title: 'Customer Authentication & Protected Route Guards',
      problemStatement:
        'Build the customer authentication module for the banking portal, including Login, Register, and Forgot Password views. Secure private banking pages with client-side route guards so unauthenticated visitors are redirected to login with return-path preservation.',
      expectedOutcome:
        'A secure, production-ready authentication flow with input validation, error banners for invalid credentials, and protected routes.',
      acceptanceCriteria: [
        'Login and registration forms validate email format and password strength',
        'Unauthenticated access to /dashboard redirects to /login with session preservation',
        'Invalid credentials display clean, non-revealing error banners',
        'Successful login stores auth session and navigates to the dashboard',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T1'],
    },
    {
      key: 'T3',
      dayNumber: 3,
      title: 'Retail Banking Dashboard & Multi-Account Balance Cards',
      problemStatement:
        'Construct the primary retail banking dashboard showcasing customer accounts (Savings, Current, Fixed Deposit). Display available balances formatted in Indian Rupees (INR), quick-action shortcuts for transfers and statements, and recent account activity glance cards.',
      expectedOutcome:
        'An interactive, responsive dashboard giving the customer an immediate overview of their total net worth, individual account balances, and quick actions.',
      acceptanceCriteria: [
        'Account balance cards format amounts in INR with proper Indian digit grouping',
        'Quick-action buttons navigate to Fund Transfer, Beneficiaries, and Statements',
        'Skeleton loading states display while account balances are fetched',
        'Responsive layout adapts cleanly across mobile, tablet, and desktop viewports',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T4',
      dayNumber: 4,
      title: 'Fund Transfer Form with Double-Entry Balance Validation',
      problemStatement:
        'Build the core fund transfer interface supporting IMPS, NEFT, and RTGS payment rails. Implement recipient account number double-entry validation, IFSC lookup, transfer amount limits, and client-side balance sufficiency checks before initiating a transfer.',
      expectedOutcome:
        'A robust fund transfer form that prevents overdrawing, validates bank routing codes, and presents a clear transaction summary before execution.',
      acceptanceCriteria: [
        'Form validates recipient account number match and valid 11-character IFSC format',
        'Transfer amounts exceeding available balance are immediately blocked with a clear message',
        'Transfer rail selection (IMPS, NEFT, RTGS) updates transaction fee and estimated settlement time',
        'A confirmation step summarizes debit account, beneficiary details, amount, and charges',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T3'],
    },
    {
      key: 'T5',
      dayNumber: 5,
      title: 'OTP Two-Factor Transaction Authorization Modal',
      problemStatement:
        'Financial regulations require two-factor authentication for fund transfers. Implement a secure 6-digit OTP verification modal that opens upon transfer submission, complete with a 60-second countdown timer, resend button throttling, and instant visual validation.',
      expectedOutcome:
        'A high-security modal challenge that validates the 6-digit one-time passcode before the transfer payload is dispatched.',
      acceptanceCriteria: [
        'Modal opens with automatic focus on the first OTP digit input box',
        'Auto-advances focus across all 6 digit inputs and supports paste of 6-digit codes',
        '60-second countdown timer prevents spamming the Resend OTP action',
        'Submitting correct OTP triggers transfer execution and shows success receipt dialog',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T4'],
    },
    {
      key: 'T6',
      dayNumber: 6,
      title: 'Real-Time Transaction Ledger with Filter & Search',
      problemStatement:
        'Develop an interactive transaction ledger showing past deposits, withdrawals, and transfers. Provide debounced search by reference number or payee, date-range filtering, and status badges (Completed, Pending, Failed).',
      expectedOutcome:
        'A high-performance transaction table allowing customers to search, inspect, and filter historical banking records effortlessly.',
      acceptanceCriteria: [
        'Table displays transaction date, description/payee, reference ID, debit/credit amount, and status',
        'Debounced search filters records instantly as the customer types',
        'Filter pills toggle between All, Credits, Debits, and Pending transfers',
        'Clicking a transaction row opens a detailed transaction receipt sheet',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T5'],
    },
    {
      key: 'T7',
      dayNumber: 7,
      title: 'Beneficiary Management & Instant Payee Addition',
      problemStatement:
        'Create a beneficiary management interface where customers can view, search, add, and remove trusted payees. Include an Add Beneficiary modal with bank branch lookup, nickname assignment, and custom daily transfer limits.',
      expectedOutcome:
        'A comprehensive payee address book that integrates with the fund transfer module for rapid 1-click payments.',
      acceptanceCriteria: [
        'Beneficiary cards display payee name, bank name, masked account number, and nickname',
        'Add Beneficiary modal validates IFSC and sets maximum daily transfer limit',
        'Delete action prompts with a confirmation dialog before removing a payee',
        'Quick Pay button on any beneficiary card pre-populates the transfer form',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T6'],
    },
    {
      key: 'T8',
      dayNumber: 8,
      title: 'Define Transaction States and Validation Rules',
      problemStatement:
        'The bank is adding scheduled and instant transfers to LedgerCore, and the team needs agreed rules before writing transaction APIs. Define the lifecycle of a transfer, including allowed state transitions (INITIATED, PENDING, POSTED, FAILED, REVERSED), idempotency key requirements, and structured error responses.',
      expectedOutcome:
        'A comprehensive requirements specification with state models, validation rules, and error codes that the transaction APIs follow.',
      acceptanceCriteria: [
        'States INITIATED, PENDING, POSTED, FAILED and REVERSED are defined with valid transitions',
        'Each validation rule specifies limits, error codes, and HTTP status codes',
        'Unified JSON error format documented for consistent client error handling',
        'Retried requests handled safely via client-generated Idempotency-Key headers',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T7'],
    },
    {
      key: 'T9',
      dayNumber: 9,
      title: 'Build Transaction Processing & Fund Allocation APIs',
      problemStatement:
        'Build the REST endpoints that create a transfer, fetch transaction history, and retrieve account balance snapshots. Enforce atomic balance updates so that a debit and corresponding credit occur within a single atomic operation.',
      expectedOutcome:
        'Working transfer endpoints enforcing double-entry ledger bookkeeping with mock service fallbacks and automated integration tests.',
      acceptanceCriteria: [
        'Endpoints handle transfer creation, detail lookup, and paginated account history',
        'Repeated requests with the same Idempotency-Key return original result without duplicate charges',
        'Business rule violations return 422 with structured domain error details',
        'Atomic balance updates prevent race conditions during concurrent transfers',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T8'],
    },
    {
      key: 'T10',
      dayNumber: 10,
      title: 'Bank Statement PDF Generation & Multi-Format Data Export',
      problemStatement:
        'Customers frequently require official statements for tax and loan verification. Implement a client-side statement export generator that produces branded, printable PDF statements and raw CSV/Excel spreadsheets for any selected date range.',
      expectedOutcome:
        'Downloadable official bank statements with custom date filters, account summary headers, transaction tables, and opening/closing balances.',
      acceptanceCriteria: [
        'Date range selector supports custom periods (Last 30 Days, Current Financial Year, Custom Range)',
        'PDF export renders official bank logo, customer address, opening balance, and closing balance',
        'CSV export produces structured tabular data formatted for spreadsheet import',
        'Export action includes loading indicator and handles large transaction volumes cleanly',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T9'],
    },
    {
      key: 'T11',
      dayNumber: 12,
      title: 'Spending Analytics, Category Breakdown & Chart Visualization',
      problemStatement:
        'Help customers understand their financial habits by building an interactive spending analytics dashboard. Aggregate transactions into categories (Bills, Groceries, Shopping, Dining, Investments) and render visual breakdown charts.',
      expectedOutcome:
        'Interactive financial analytics displaying category donut charts, monthly spending trend graphs, and top expense highlights.',
      acceptanceCriteria: [
        'Donut/pie chart visualizes category spending percentages with hover tooltips',
        'Monthly bar chart compares total inflows (credits) versus total outflows (debits)',
        'Clicking any spending category filters the underlying transaction list',
        'Chart components render with accessible labels and fallback text summaries',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T10'],
    },
    {
      key: 'T12',
      dayNumber: 14,
      title: 'Production Build Optimization, Security Audit & Cloud Delivery',
      problemStatement:
        'Prepare LedgerCore for final production release. Audit sensitive data masking (account numbers, tokens), optimize client bundle sizes via code-splitting, run the full automated test suite, and generate production Docker deployment configurations.',
      expectedOutcome:
        'A production-ready release package passing all unit tests, security audits, and lighthouse performance benchmarks, ready for deployment.',
      acceptanceCriteria: [
        'Full test suite passes with zero errors and clean build output',
        'Sensitive account numbers are masked throughout UI and logs',
        'Bundle analysis verifies code-splitting with vendor chunk separation',
        'Comprehensive README documentation covers local running, testing, and production deployment',
      ],
      starterRepoUrl: JAVA_BANKING_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T11'],
    },
  ],

  'fullstack-ecommerce': [
    {
      key: 'T1',
      dayNumber: 1,
      title: 'Set up the storefront workspace',
      problemStatement:
        'BazaarLane, an online store for home and kitchen products, is rebuilding its storefront on the MERN stack. Set up the starter monorepo with the React client and the Express API connected to a local MongoDB instance. Configure environment variables, linting and formatting so that every developer works the same way. Document how to run the project and the branch and commit conventions.',
      expectedOutcome:
        'Both the client and the API run locally from documented commands, linting passes and the health check returns ok.',
      acceptanceCriteria: [
        'npm run dev starts the client and the API, and GET /api/health returns status ok',
        'Secrets live in git-ignored .env files, and .env.example files are committed',
        'npm run lint passes for the client and the server',
        'The setup notes describe scripts, ports and branch naming',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 3,
      requiresTrainerReview: false,
      prerequisiteKeys: [],
    },
    {
      key: 'T2',
      dayNumber: 3,
      title: 'Build the product catalogue',
      problemStatement:
        'Shoppers need to browse about 500 products across categories such as cookware, storage and lighting. Build a products API with search, category filter, price sort and pagination backed by MongoDB, and the React listing and product detail pages that use it. Pages must handle loading, empty and error states and work well on a phone. Prices are stored as integers in paise and formatted in rupees only in the interface.',
      expectedOutcome:
        'Shoppers can search, filter, sort and page through products and open a product detail page on any screen size.',
      acceptanceCriteria: [
        'GET /api/products supports search, category, sort and page and returns { items, page, limit, total }',
        'Query parameters are validated on the server and the page size is capped at 50',
        'Listing and detail pages show skeletons while loading and a clear message when nothing matches',
        'Prices are stored in paise and displayed in rupees with Indian digit grouping',
        'Pages have no horizontal scroll at 360 px width',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 10,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T1'],
    },
    {
      key: 'T3',
      dayNumber: 4,
      title: 'Implement the shopping cart',
      problemStatement:
        'Shoppers want to add products to a cart, change quantities and see the total update immediately. Build the cart in React with a reducer and context, and keep it across page refreshes. Quantities cannot go below one or above the available stock, and the server must confirm prices and stock before checkout. Show a mini-cart summary in the header on every page.',
      expectedOutcome:
        'A cart that survives refreshes, respects stock limits and always agrees with the server on the total.',
      acceptanceCriteria: [
        'Adding, removing and updating items change the header count and subtotal immediately',
        'The cart is restored after a page refresh',
        'Quantities are limited to between 1 and the available stock',
        'Unit tests cover the cart reducer for add, update, remove and clear',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T4',
      dayNumber: 5,
      title: 'Add customer sign-up and login',
      problemStatement:
        'Guests can browse, but placing an order requires an account. Add registration and login to the API with hashed passwords, short-lived JWT access tokens and a refresh token in an httpOnly cookie. In the React app, add sign-up and login pages and protect the checkout and order history routes. Return the same error for a wrong email and a wrong password so that attackers cannot discover registered emails.',
      expectedOutcome:
        'Customers can register, log in and stay signed in safely, and protected pages send guests to the login page.',
      acceptanceCriteria: [
        'Passwords are hashed with bcrypt and never returned by any endpoint',
        'A wrong email and a wrong password return the same 401 error',
        'Protected routes redirect to login and return to the original page after sign-in',
        'Login is rate limited to 5 attempts per minute per IP',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T5',
      dayNumber: 7,
      title: 'Build checkout and order placement',
      problemStatement:
        'BazaarLane is ready to take orders. Build a checkout that collects a delivery address with a valid Indian PIN code, recalculates the total on the server and creates an order in PENDING_PAYMENT. Integrate the mock payment gateway and mark the order PAID only when a signed webhook confirms the payment, never because the browser was redirected. Reduce stock only for paid orders.',
      expectedOutcome:
        'Customers can place an order and pay through the mock gateway, and order status changes only on verified payment events.',
      acceptanceCriteria: [
        'The server ignores prices sent by the browser and recalculates totals from the database',
        'Address validation rejects PIN codes that are not exactly 6 digits',
        'An order becomes PAID only after a valid webhook, and a replayed webhook changes nothing',
        'Stock is reduced exactly once per paid order',
        'The confirmation page shows the order number and its current status',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 12,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T3', 'T4'],
    },
    {
      key: 'T6',
      dayNumber: 10,
      title: 'Final review: deploy and demo the storefront',
      problemStatement:
        'Prepare BazaarLane for its launch review. Deploy the client and the API to a hosting platform of your choice with production environment variables and HTTPS. Run the end-to-end test that searches, adds to cart, logs in and places a paid order against the deployed build. Present a short demo to your trainer and list the known issues and next steps.',
      expectedOutcome:
        'A deployed storefront that passes the end-to-end purchase journey, with a demo and documentation ready for review.',
      acceptanceCriteria: [
        'The deployed URL serves the app over HTTPS with no console errors',
        'The end-to-end purchase test passes against the deployed build',
        'Secrets are configured on the hosting platform, not committed to the repository',
        'The README lists the live URL, setup steps and known limitations',
      ],
      starterRepoUrl: FULLSTACK_ECOMMERCE_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T5'],
    },
  ],

  'devops-telecom': [
    {
      key: 'T1',
      dayNumber: 1,
      title: 'Run the usage-billing service locally',
      problemStatement:
        'A mobile operator rates call detail records (CDRs) for calls, SMS and data with its usage-billing service, which produces monthly charges for about two million subscribers. Before automating anything you need to understand how the service is built, configured and run. Run it locally with its PostgreSQL database, import the sample CDR file and confirm the rated totals. Document the build steps, configuration variables, ports and health endpoints in a runbook.',
      expectedOutcome:
        'The service runs locally against PostgreSQL, rates the sample CDRs correctly and is documented well enough to automate.',
      acceptanceCriteria: [
        'npm test passes and the service starts on port 8080',
        'GET /healthz returns 200 and the sample CDR file produces the documented totals',
        'Every environment variable the service reads is listed with its purpose and default',
        'docs/runbook.md is committed on a feature branch',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 3,
      requiresTrainerReview: false,
      prerequisiteKeys: [],
    },
    {
      key: 'T2',
      dayNumber: 2,
      title: 'Build the CI pipeline',
      problemStatement:
        'Developers test the billing service only on their laptops, and broken code has reached the main branch twice this month. Build a GitHub Actions pipeline that runs on every pull request and on pushes to main: install dependencies, lint, run the tests and publish the test report. Cache dependencies so that the pipeline stays fast. Protect the main branch so that a pull request cannot be merged while the pipeline is failing.',
      expectedOutcome:
        'Every pull request is checked automatically, and failing changes cannot be merged into main.',
      acceptanceCriteria: [
        'The workflow runs on pull requests and on pushes to main',
        'Lint and test failures fail the pipeline with a readable log',
        'Dependency caching shortens repeat runs, shown by run timings in the submission',
        'Branch protection requires the pipeline to pass before merging',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T1'],
    },
    {
      key: 'T3',
      dayNumber: 3,
      title: 'Containerise the billing service',
      problemStatement:
        'The operations team wants the billing service to run the same way in every environment. Write a multi-stage Dockerfile that produces a small production image running as a non-root user, and a Docker Compose file that starts the service with PostgreSQL for local testing. Add a .dockerignore so that secrets and local files never enter the image. Scan the image for known vulnerabilities and fix any critical findings.',
      expectedOutcome:
        'A small, non-root production image that starts with Docker Compose and has no critical vulnerabilities.',
      acceptanceCriteria: [
        'The final image is under 200 MB and runs as a non-root user',
        'docker compose up starts the service and PostgreSQL, and /healthz returns 200',
        'The image contains no .env files, tests or .git folder',
        'The image scan reports no critical vulnerabilities',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 5,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T4',
      dayNumber: 5,
      title: 'Provision the environment with Terraform',
      problemStatement:
        'The staging infrastructure for the billing service was created by hand, and nobody knows its exact configuration. Describe it as code with Terraform: the network, a managed PostgreSQL database, the container registry and a Kubernetes namespace for staging. Store state in a remote backend with locking, and run terraform plan in the CI pipeline for every pull request that changes infrastructure.',
      expectedOutcome:
        'Staging infrastructure is reproducible from code, and every change is reviewed as a plan in CI before it is applied.',
      acceptanceCriteria: [
        'terraform fmt -check and terraform validate pass in CI',
        'State is stored in a remote backend with locking enabled',
        'A pull request that changes .tf files shows the terraform plan output in the pipeline',
        'No credentials or secrets appear in .tf files or in Git history',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T5',
      dayNumber: 7,
      title: 'Deploy to Kubernetes with zero-downtime updates',
      problemStatement:
        'Releases currently interrupt usage rating for several minutes. Deploy the billing service to the staging cluster with Deployment, Service, ConfigMap and Secret manifests or a Helm chart. Set resource requests and limits, readiness and liveness probes and a rolling-update strategy. Prove that a new release rolls out without failed requests and that a bad release can be rolled back with one command.',
      expectedOutcome:
        'The service runs in staging with health probes and rolling updates, and both a rollout and a rollback are demonstrated.',
      acceptanceCriteria: [
        'Pods run with resource requests, limits and readiness and liveness probes',
        'A rolling update completes while a load test shows no failed requests',
        'kubectl rollout undo restores the previous version',
        'Database credentials come from a Secret, not from the image or a plain manifest',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 10,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T3', 'T4'],
    },
    {
      key: 'T6',
      dayNumber: 10,
      title: 'Monitor the service and run an incident drill',
      problemStatement:
        'Billing runs every night, and the operations team usually learns about failures from customer complaints. Expose service metrics, build a dashboard for request rate, error rate, latency and CDR processing lag, and add alerts based on service-level objectives. Then run an incident drill: break a dependency in staging, follow the alert to the cause, recover and write a short post-incident report.',
      expectedOutcome:
        'Dashboards and SLO-based alerts that detect a real failure, and a post-incident report from the drill.',
      acceptanceCriteria: [
        '/metrics exposes request, error, latency and CDR lag metrics in Prometheus format',
        'The dashboard shows rate, errors, latency percentiles and saturation for the service',
        'An alert fires within five minutes of the simulated failure',
        'The post-incident report includes timeline, root cause, impact and follow-up actions',
      ],
      starterRepoUrl: DEVOPS_TELECOM_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T5'],
    },
  ],

  'dotnet-healthcare': [
    {
      key: 'T1',
      dayNumber: 1,
      title: 'Set up the clinic API solution',
      problemStatement:
        'A chain of multi-speciality clinics in Bengaluru and Hyderabad is replacing paper registers with an appointment and patient-record API. Set up the starter solution with the .NET 8 SDK, connect it to a local SQL Server container, and run the API and the tests. Review the solution layout and document how the projects depend on each other. Configure user secrets so that no connection string is ever committed.',
      expectedOutcome:
        'The solution builds, the tests pass and the API runs locally against SQL Server, with secrets kept out of the repository.',
      acceptanceCriteria: [
        'dotnet build and dotnet test succeed from the solution root',
        'The API starts and GET /health returns Healthy',
        'The connection string comes from user secrets or environment variables, not appsettings.json',
        'docs/setup.md explains the project layout and the run steps',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 3,
      requiresTrainerReview: true,
      prerequisiteKeys: [],
    },
    {
      key: 'T2',
      dayNumber: 3,
      title: 'Model patients and appointments with EF Core',
      problemStatement:
        'The clinics need to store patients, doctors, departments and appointments reliably. Design the entities and relationships, configure them with the EF Core fluent API and create the initial migration. Enforce the rules in the model and the database where possible: a unique patient registration number, required contact details and appointment times stored in UTC. Seed sample doctors and departments for development.',
      expectedOutcome:
        'A migrated database schema that represents patients, doctors and appointments with their rules, ready for the APIs.',
      acceptanceCriteria: [
        'dotnet ef database update creates the schema on an empty database',
        'Patient registration numbers are unique at database level',
        'Appointment times are stored in UTC',
        'Unit tests cover the rules that live in the domain entities',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 6,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T1'],
    },
    {
      key: 'T3',
      dayNumber: 4,
      title: 'Build the patient records API',
      problemStatement:
        'Reception staff need to register patients, update contact details and find a patient quickly by name, phone or registration number. Build the patient endpoints with request DTOs, validation and paginated search. List results must contain only the fields reception needs, never clinical notes. Deleting a patient must be a soft delete so that the medical history is preserved.',
      expectedOutcome:
        'Reception can register, update, search and archive patients through a validated, paginated API.',
      acceptanceCriteria: [
        'POST, GET, PUT and DELETE /api/patients work with validated DTOs',
        'Search by name, phone or registration number is paginated with a maximum page size of 50',
        'List results exclude clinical notes and other sensitive fields',
        'Deleting a patient archives the record instead of removing the row',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T4',
      dayNumber: 5,
      title: 'Implement appointment booking',
      problemStatement:
        'Patients often wait at the clinics because the same slot was booked twice. Build endpoints that show the free slots of a doctor and let a patient book, reschedule or cancel an appointment. Two bookings for the same doctor and time must never both succeed, even when they arrive at the same moment. Cancellations are allowed up to two hours before the appointment.',
      expectedOutcome:
        'Reliable booking with no double-booked slots and clear errors whenever a rule is broken.',
      acceptanceCriteria: [
        'GET /api/doctors/{id}/slots returns only free slots for the requested date',
        'Two concurrent bookings for the same slot result in one success and one 409 Conflict',
        'Cancelling less than two hours before the appointment returns 422 with a clear error code',
        'Integration tests cover booking, rescheduling and cancellation',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T2'],
    },
    {
      key: 'T5',
      dayNumber: 7,
      title: 'Enforce privacy rules and audit access',
      problemStatement:
        'Patient records are sensitive health data, and the clinics must be able to show who viewed or changed them. Restrict access by role: reception sees contact and appointment details, doctors see clinical notes only for their own patients, and administrators manage users but not clinical data. Record every read and change of a patient record in an audit log, mask phone and identity numbers wherever the full value is not needed, and keep personal data out of application logs.',
      expectedOutcome:
        'Role-based access to patient data, masked identifiers and a complete audit trail of every record access.',
      acceptanceCriteria: [
        'A doctor receives 403 when opening the clinical notes of a patient who is not under their care',
        'Every read and update of a patient record creates an audit entry with user, action and time',
        'Phone and identity numbers are masked in list responses and never appear in logs',
        'Integration tests cover the authorisation rules for each role',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 10,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T3', 'T4'],
    },
    {
      key: 'T6',
      dayNumber: 10,
      title: 'Final review: demo and acceptance tests',
      problemStatement:
        'The clinic chain wants to pilot the platform in one branch. Prepare the final release: run the acceptance tests supplied with the starter, containerise the API and document the configuration for the pilot environment. Demonstrate patient registration, booking and cancelling an appointment, and the audit trail to your trainer. Close with a short list of known limitations and privacy risks.',
      expectedOutcome:
        'A pilot-ready release that passes the acceptance tests, with a demo of the main journeys and documentation for deployment.',
      acceptanceCriteria: [
        'The acceptance test suite passes on the final tagged commit',
        'docker compose up starts the API and the database with documented settings',
        'The demo covers patient registration, booking, cancellation and the audit trail',
        'The README lists configuration, known limitations and privacy risks',
      ],
      starterRepoUrl: DOTNET_HEALTHCARE_REPO,
      estimatedHours: 8,
      requiresTrainerReview: true,
      prerequisiteKeys: ['T5'],
    },
  ],
};
