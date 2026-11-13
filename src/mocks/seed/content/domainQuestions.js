/**
 * Domain-specific Question Bank Seed for Assessments.
 * Each domain has a curated pool of questions.
 * When taking an assessment, 15 questions are sampled randomly from the student's selected domain.
 * Admin can manually add, edit, or delete questions up to a cap of 100 per domain.
 */

export const DOMAIN_QUESTION_BANK = {
  banking: [
    {
      text: 'Which property of ACID transactions guarantees that money deducted from one account is always credited to another or completely rolled back?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctIndex: 0,
      explanation: 'Atomicity ensures that all operations within a financial transaction succeed or all fail together.',
    },
    {
      text: 'In core banking architecture, what is the primary role of an idempotent payment API endpoint?',
      options: [
        'To speed up database index searches',
        'To prevent duplicate debits when client retries network requests',
        'To bypass double-entry ledger bookkeeping',
        'To compress transaction receipt payloads',
      ],
      correctIndex: 1,
      explanation: 'Idempotency prevents duplicate charges or transfers when network retries occur.',
    },
    {
      text: 'Which isolation level prevents phantom reads during high-volume ledger reconciliations?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctIndex: 3,
      explanation: 'Serializable isolation prevents dirty reads, non-repeatable reads, and phantom reads entirely.',
    },
    {
      text: 'In double-entry banking ledgers, what invariant must always hold true for any posted journal entry?',
      options: [
        'Total credits must exceed total debits by the transaction fee',
        'Total debits must equal total credits',
        'Debits must only apply to asset accounts and never liabilities',
        'All accounts involved must belong to the same branch currency',
      ],
      correctIndex: 1,
      explanation: 'Double-entry accounting requires that total debits always equal total credits.',
    },
    {
      text: 'What is the primary cryptographic purpose of a Hardware Security Module (HSM) in payment processing?',
      options: [
        'To securely generate, store, and manage PIN/card encryption keys',
        'To render HTML banking web pages faster',
        'To act as a load balancer for ATM incoming requests',
        'To store customer profile pictures and identity documents',
      ],
      correctIndex: 0,
      explanation: 'HSMs provide tamper-resistant hardware for PIN encryption and cryptographic key protection.',
    },
    {
      text: 'Which regulatory standard governs security controls for storing and processing cardholder data?',
      options: ['ISO 9001', 'PCI-DSS', 'HIPAA', 'SOC 1 Type 1 only'],
      correctIndex: 1,
      explanation: 'PCI-DSS sets standards for credit/debit card data protection.',
    },
    {
      text: 'In real-time banking transfers (such as IMPS/UPI/SEPA), what is the primary reason for using an Outbox pattern?',
      options: [
        'To reliably publish ledger events without two-phase commit overhead',
        'To store unsent promotional customer emails',
        'To bypass database schema migrations',
        'To eliminate the need for primary keys',
      ],
      correctIndex: 0,
      explanation: 'The Transactional Outbox pattern ensures guaranteed message delivery alongside local database transactions.',
    },
    {
      text: 'When calculating interest on daily savings balances, which precision data type should be used in enterprise banking systems?',
      options: ['IEEE 754 float (32-bit)', 'IEEE 754 double (64-bit)', 'Arbitrary-precision Decimal (e.g. BigDecimal)', 'Integer truncated to nearest rupee/dollar'],
      correctIndex: 2,
      explanation: 'Floating point numbers suffer from binary rounding errors; arbitrary precision decimals (BigDecimal) must be used.',
    },
    {
      text: 'What type of lock is typically acquired on an account record during an online withdrawal to prevent concurrent overdraft?',
      options: ['Optimistic lock via version column or Pessimistic write lock (SELECT FOR UPDATE)', 'Table-level read lock', 'Non-blocking dirty read lock', 'File-system exclusive lock'],
      correctIndex: 0,
      explanation: 'Pessimistic write locking or optimistic version checks ensure two concurrent withdrawals cannot both succeed past the balance.',
    },
    {
      text: 'Which messaging protocol or standard is globally adopted by modern cross-border banking networks (SWIFT MX)?',
      options: ['ISO 20022 XML', 'SOAP RPC with binary ASN.1', 'GraphQL over HTTP/2', 'Protobuf v2'],
      correctIndex: 0,
      explanation: 'ISO 20022 is the international standard for electronic data interchange between financial institutions.',
    },
    {
      text: 'In anti-money laundering (AML) monitoring, what does CTR stand for in banking compliance?',
      options: ['Currency Transaction Report', 'Credit Transfer Registry', 'Central Trading Route', 'Card Tokenization Request'],
      correctIndex: 0,
      explanation: 'CTR (Currency Transaction Report) is filed for transactions exceeding legal statutory thresholds.',
    },
    {
      text: 'Why do banking architectures separate the OLTP (transactional) database from the OLAP (data warehouse) database?',
      options: [
        'To ensure heavy regulatory reporting queries do not degrade online transaction latency',
        'Because OLTP databases cannot store more than 1,000 records',
        'To avoid encrypting banking customer data',
        'Because OLAP databases do not support SQL syntax',
      ],
      correctIndex: 0,
      explanation: 'Separating operational systems from analytics prevents analytical queries from locking transactional ledger tables.',
    },
    {
      text: 'What is a "chargeback" in retail banking and card payment processing?',
      options: [
        'A fee charged by the bank for maintaining a dormant savings account',
        'A cardholder-disputed transaction where funds are forcefully reversed from the merchant',
        'An automated interest bonus credited to corporate accounts',
        'A tax deduction applied by national regulatory authorities',
      ],
      correctIndex: 1,
      explanation: 'A chargeback occurs when a customer disputes a transaction with their issuing bank.',
    },
    {
      text: 'Which mechanism ensures bank statements cannot be tampered with once generated at the close of a financial day?',
      options: [
        'Cryptographic hashing / digital signatures and append-only audit logs',
        'Storing statements as plain text files in a public shared folder',
        'Allowing branch managers to manually overwrite balances',
        'Truncating previous records to save disk space',
      ],
      correctIndex: 0,
      explanation: 'Cryptographic hashing, digital signatures, and immutable write-once logs ensure statement auditability.',
    },
    {
      text: 'What is "KYC" and at which stage in the retail banking lifecycle is it mandatorily conducted?',
      options: [
        'Know Your Customer; conducted during customer onboarding and periodically refreshed',
        'Keep Your Cash; conducted only when an account is closed',
        'Key Yield Calculation; conducted at daily end-of-day batch processing',
        'Knowledge Yield Control; conducted when issuing new checkbooks',
      ],
      correctIndex: 0,
      explanation: 'KYC (Know Your Customer) verifies customer identity during account opening and periodic reviews.',
    },
    {
      text: 'In distributed banking microservices, how is consistency maintained across multiple distinct service databases during a loan disbursement?',
      options: ['Saga Pattern (Choreographed or Orchestrated with compensating transactions)', 'Shared single root database table without foreign keys', 'Ignoring failures and letting nightly batch sync fix balances', 'Using client-side browser cookies to coordinate commits'],
      correctIndex: 0,
      explanation: 'The Saga pattern handles distributed transactions across microservices through sequences of local transactions and compensating rollbacks.',
    },
  ],

  healthcare: [
    {
      text: 'Which US healthcare regulation establishes national standards for the protection of electronic protected health information (ePHI)?',
      options: ['HIPAA', 'PCI-DSS', 'SOX', 'GDPR Article 8 only'],
      correctIndex: 0,
      explanation: 'HIPAA sets the standard for protecting sensitive patient health information.',
    },
    {
      text: 'What is HL7 FHIR in modern healthcare software architecture?',
      options: [
        'Fast Healthcare Interoperability Resources, a standard for exchanging electronic health data via RESTful APIs',
        'A hardware fire suppression protocol for hospital server rooms',
        'A proprietary database format used only for radiology images',
        'A medical billing formula used exclusively for inpatient surgery claims',
      ],
      correctIndex: 0,
      explanation: 'FHIR is the modern REST-based standard for healthcare data interoperability.',
    },
    {
      text: 'Which standard protocol is used for storing, viewing, and transmitting medical imaging files such as CT scans and MRIs?',
      options: ['DICOM', 'MP4', 'HL7 v2 pipe-delimited text', 'JSON-LD'],
      correctIndex: 0,
      explanation: 'DICOM is the international standard for medical images.',
    },
    {
      text: 'When building a hospital Electronic Health Record (EHR) system, why must patient audit logs be strictly append-only?',
      options: [
        'To prove who accessed, viewed, or modified sensitive medical records for compliance and forensic investigations',
        'To prevent patients from ever reading their own prescriptions',
        'Because hard drives cannot overwrite text files',
        'To automatically bill insurance providers for each audit log entry',
      ],
      correctIndex: 0,
      explanation: 'Immutable audit logs provide a verifiable record of every access and change to private health data.',
    },
    {
      text: 'What is the primary purpose of a Master Patient Index (MPI) across a network of regional clinics?',
      options: [
        'To uniquely identify and link a patient across disparate clinical systems and avoid duplicate or fragmented records',
        'To rank doctors based on patient satisfaction survey scores',
        'To store pharmacy inventory drug expiration dates',
        'To index public healthcare articles for patient education',
      ],
      correctIndex: 0,
      explanation: 'An MPI maintains a consistent master identifier for each patient across all facilities and clinical departments.',
    },
    {
      text: 'In clinical decision support systems, what does the SNOMED-CT terminology provide?',
      options: [
        'A comprehensive multilingual clinical healthcare terminology covering diseases, clinical findings, and procedures',
        'A standard for ambulance siren frequencies',
        'A database of hospital employee shift rosters',
        'A financial credit rating for health insurance companies',
      ],
      correctIndex: 0,
      explanation: 'SNOMED CT is the most comprehensive clinical healthcare terminology in the world.',
    },
    {
      text: 'What is Telehealth architecture primarily concerned with regarding network protocols?',
      options: [
        'Low-latency secure WebRTC video streaming with end-to-end encryption and adaptive bitrate',
        'FTP transfers of raw camera video files',
        'Unencrypted UDP broadcasts to public networks',
        'Serial COM port connections over dial-up modems',
      ],
      correctIndex: 0,
      explanation: 'Telehealth uses secure WebRTC with end-to-end encryption for doctor-patient consultations.',
    },
    {
      text: 'Which technique is used to share healthcare datasets with research universities while protecting patient identities?',
      options: ['De-identification and anonymization (e.g. removing 18 HIPAA Safe Harbor identifiers)', 'Password-protecting the Excel spreadsheet with a simple PIN', 'Sharing unencrypted records under verbal confidentiality agreement', 'Renaming the files with patient initials'],
      correctIndex: 0,
      explanation: 'HIPAA Safe Harbor de-identification removes direct and indirect identifiers before datasets are shared.',
    },
    {
      text: 'In healthcare billing, what is an ICD-10 code used to describe?',
      options: [
        'The patient diagnosis, symptoms, and medical conditions',
        'The doctor personal bank account routing number',
        'The model number of the hospital ultrasound machine',
        'The brand name of the hospital operating room bed',
      ],
      correctIndex: 0,
      explanation: 'ICD-10 classifies diseases and medical conditions for medical coding.',
    },
    {
      text: 'What is the role of a Prescription Drug Monitoring Program (PDMP) database?',
      options: [
        'To track prescribing and dispensing of controlled substances to prevent drug abuse and dangerous interactions',
        'To calculate pharmacy retail profit margins on generic medications',
        'To automate hospital cafeteria dietary orders',
        'To schedule doctor attendance at medical conferences',
      ],
      correctIndex: 0,
      explanation: 'PDMPs track controlled substance prescriptions to curb prescription misuse.',
    },
    {
      text: 'What does "EMR" stand for in medical software?',
      options: ['Electronic Medical Record', 'Emergency Medicine Routine', 'Encrypted Medication Registry', 'External Medical Report'],
      correctIndex: 0,
      explanation: 'EMR stands for Electronic Medical Record.',
    },
    {
      text: 'How should patient medical data be encrypted at rest in cloud healthcare applications?',
      options: [
        'Using AES-256 encryption with customer-managed cryptographic keys and role-based key access policies',
        'Base64 encoding saved in plain JSON files',
        'MD5 hashing with no decryption ability',
        'Zip compression without passwords',
      ],
      correctIndex: 0,
      explanation: 'AES-256 encryption at rest with strict key management ensures compliance with healthcare security mandates.',
    },
    {
      text: 'In laboratory information systems (LIS), what standard is used to interface diagnostic analyzers with the server?',
      options: ['ASTM / HL7 interface standards', 'Direct Bluetooth file sharing', 'Simple SMTP email messages', 'RSS feed polling'],
      correctIndex: 0,
      explanation: 'ASTM standards and HL7 messaging are standard for connecting medical analyzer devices to LIS backends.',
    },
    {
      text: 'What is the consequence of clinical alert fatigue in electronic prescribing systems?',
      options: [
        'Clinicians overlook critical drug-drug interaction alerts because of excessive trivial warnings',
        'The pharmacy printer runs out of paper faster',
        'The database crashes due to alert index fragmentation',
        'The patient receives discounted prescription pricing',
      ],
      correctIndex: 0,
      explanation: 'Alert fatigue causes medical personnel to habitually dismiss pop-up warnings, risking patient safety.',
    },
    {
      text: 'What is the primary role of a PACS in a hospital radiology department?',
      options: [
        'Picture Archiving and Communication System; stores and retrieves medical imaging studies',
        'Patient Admission and Check-in Service; handles front desk appointments',
        'Public Address and Communication Siren; alerts emergency rooms',
        'Pharmacy Automatic Capsule Sorter; dispenses pills into bottles',
      ],
      correctIndex: 0,
      explanation: 'PACS is used to store, manage, and distribute diagnostic images.',
    },
  ],

  'e-commerce': [
    {
      text: 'How should inventory decrement be handled during flash sales to prevent overselling while maintaining high throughput?',
      options: [
        'Atomic conditional update in database (e.g. UPDATE inventory SET stock = stock - qty WHERE id = ? AND stock >= qty) or Redis atomic Lua scripts',
        'Read stock in application memory, subtract in JavaScript, then overwrite the database row',
        'Allow stock to go negative and cancel customer orders manually the next day',
        'Lock the entire products table with an exclusive table lock for the duration of the sale',
      ],
      correctIndex: 0,
      explanation: 'Atomic conditional database updates or Redis atomic decrements prevent race conditions during high-concurrency checkouts.',
    },
    {
      text: 'In an e-commerce checkout flow, why should pricing calculations always be executed strictly on the server side?',
      options: [
        'To prevent client-side price tampering and ensure discounts, taxes, and shipping are authoritatively validated',
        'Because JavaScript in browsers cannot perform arithmetic addition',
        'To hide the names of products from the customer receipt',
        'To avoid calculating shipping costs until after delivery',
      ],
      correctIndex: 0,
      explanation: 'Client-side prices can be modified via developer tools; the server must always compute and verify final payable amounts.',
    },
    {
      text: 'What is the primary role of an order state machine in an e-commerce backend?',
      options: [
        'To enforce valid deterministic transitions between order statuses (e.g. PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED)',
        'To generate 3D animated images of products on the product detail page',
        'To compress database backup dumps',
        'To automatically post order updates to public social media accounts',
      ],
      correctIndex: 0,
      explanation: 'State machines ensure orders only transition through valid, authorized business lifecycles.',
    },
    {
      text: 'Which caching strategy is most effective for high-traffic Product Detail Pages (PDP) with frequent inventory changes?',
      options: [
        'Cache product metadata on CDN/Redis with long TTL, and fetch live stock/price via dynamic lightweight micro-endpoint',
        'Never cache anything and query the relational database for every single pageview',
        'Cache the entire HTML page for 30 days with no invalidation mechanism',
        'Store all product data inside localStorage in every visitor browser permanently',
      ],
      correctIndex: 0,
      explanation: 'Splitting static product content from dynamic stock/pricing gives the best balance of speed and freshness.',
    },
    {
      text: 'How does an e-commerce platform securely handle credit card information without being subject to heavy PCI-DSS audit scope?',
      options: [
        'Using hosted payment fields or iframes (e.g. Stripe Elements / Razorpay Checkout) that send card tokens directly to the payment gateway',
        'Saving the raw card numbers and CVVs into an encrypted MySQL table',
        'Asking customers to email photographs of their credit cards',
        'Encoding credit card details into URL query parameters',
      ],
      correctIndex: 0,
      explanation: 'Tokenization via hosted iframes ensures raw card numbers never touch the merchant server, minimizing PCI compliance burdens.',
    },
    {
      text: 'In shopping cart architectures, how should abandoned carts be tracked and retargeted effectively?',
      options: [
        'Persist cart items with user/session identifiers and trigger automated notifications if inactive past a configured threshold',
        'Delete the cart immediately whenever the user navigates to another page',
        'Block the user from opening the website again until they finish the checkout',
        'Store carts only in browser session cookies that expire immediately on tab close',
      ],
      correctIndex: 0,
      explanation: 'Persistent cart storage allows automated recovery workflows such as email reminders.',
    },
    {
      text: 'What is a webhook used for in payment gateway integrations (e.g. Razorpay, Stripe, PayPal)?',
      options: [
        'An asynchronous server-to-server HTTP notification to confirm payment success or failure independently of the user browser status',
        'A CSS animation effect when hovering over the payment button',
        'A browser cookie used to store the user credit card number',
        'A cron job that sends promotional SMS messages to customers',
      ],
      correctIndex: 0,
      explanation: 'Webhooks ensure reliable order fulfillment even if the customer closes their browser before the redirect returns.',
    },
    {
      text: 'Which search technology is standard for high-performance product catalog faceted filtering (brand, size, color, price range)?',
      options: ['Elasticsearch / OpenSearch', 'SQLite memory mode', 'Plain text file searching with grep', 'Scanning JSON files on AWS S3'],
      correctIndex: 0,
      explanation: 'Search engines like Elasticsearch provide sub-second inverted index search, typo tolerance, and faceted aggregations.',
    },
    {
      text: 'What is SKU in inventory management?',
      options: ['Stock Keeping Unit', 'Standard Knowledge Utility', 'Store Keyed User', 'Sales Knowledge Uniform'],
      correctIndex: 0,
      explanation: 'SKU is a unique alphanumeric code assigned to a distinct product variant for inventory tracking.',
    },
    {
      text: 'What is the purpose of rate-limiting checkout endpoints in an e-commerce API?',
      options: [
        'To prevent automated bot carding attacks and inventory hoarding scripts',
        'To reduce the font size of the checkout page during sales',
        'To force users to read the terms and conditions slowly',
        'To prevent more than one customer from buying per minute',
      ],
      correctIndex: 0,
      explanation: 'Rate limiting protects payment gateways and stock reservation endpoints from fraudulent automated bot attacks.',
    },
    {
      text: 'When a customer applies a coupon code, how do you prevent race condition abuse (e.g. applying a one-time code concurrently across multiple tabs)?',
      options: [
        'Atomic database lock on the coupon usage table or a distributed Redis lock per coupon code and user ID',
        'Rely on frontend disabled buttons after clicking',
        'Allow the discount on all orders and adjust invoices manually later',
        'Limit coupon codes to words with more than 10 characters',
      ],
      correctIndex: 0,
      explanation: 'Distributed locking or atomic conditional updates guarantee that a one-time discount code is consumed only once.',
    },
    {
      text: 'What does 3D Secure (3DS2) provide in card transaction flows?',
      options: [
        'Two-factor authentication with the issuing bank to reduce payment fraud and shift merchant liability',
        'Renders a 3D visual preview of the product inside the checkout iframe',
        'Encrypts the shipping address before writing it on the cardboard box',
        'A three-day delivery guarantee provided by courier partners',
      ],
      correctIndex: 0,
      explanation: '3DS provides an additional security layer for online card transactions.',
    },
    {
      text: 'Why do large e-commerce platforms decouple order placement from fulfillment using message queues (e.g. RabbitMQ, Kafka)?',
      options: [
        'To immediately acknowledge customer orders in milliseconds while dispatching warehouse packaging, invoicing, and logistics asynchronously',
        'Because database servers cannot write more than 5 rows per second',
        'To make invoices invisible to accountants',
        'To avoid sending confirmation emails to customers',
      ],
      correctIndex: 0,
      explanation: 'Asynchronous event streaming decouples instant checkout confirmation from downstream processing.',
    },
    {
      text: 'What is dynamic pricing in modern retail e-commerce algorithms?',
      options: [
        'Algorithmic price adjustment based on competitor prices, current inventory levels, demand velocity, and seasonality',
        'Randomly changing the price for every page refresh to confuse buyers',
        'Charging different currencies without converting the numbers',
        'Offering free shipping on all orders regardless of weight',
      ],
      correctIndex: 0,
      explanation: 'Dynamic pricing optimizes revenue by analyzing real-time market conditions and inventory stock levels.',
    },
    {
      text: 'What is the primary function of a reverse logistics subsystem in e-commerce?',
      options: [
        'Managing customer returns, quality inspections, refund disbursements, and restocking of returned goods',
        'Delivering packages in reverse alphabetical order of customer names',
        'Printing return address shipping labels backwards',
        'Exporting customer database rows into CSV format',
      ],
      correctIndex: 0,
      explanation: 'Reverse logistics handles the entire return lifecycle from customer pickup to inspection and refund.',
    },
  ],
};

/**
 * Returns question bank for a domain slug (fallback to banking if not found).
 */
export function getQuestionsForDomain(domainSlug) {
  const normalized = String(domainSlug ?? '').toLowerCase().trim();
  if (DOMAIN_QUESTION_BANK[normalized]) {
    return DOMAIN_QUESTION_BANK[normalized];
  }
  return DOMAIN_QUESTION_BANK.banking;
}

