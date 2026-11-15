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

  finance: [
    {
      text: 'In corporate valuation, what does the Discounted Cash Flow (DCF) model calculate?',
      options: [
        'The present value of expected future cash flows using an appropriate discount rate (WACC)',
        'The past total historical book value of physical factory equipment',
        'The daily intraday price volatility of liquid common stocks',
        'The sum total of all dividends paid out since company incorporation',
      ],
      correctIndex: 0,
      explanation: 'DCF discounts future cash flows back to present value using the Weighted Average Cost of Capital (WACC).',
    },
    {
      text: 'Under Basel III banking and financial regulations, what is the primary role of the Capital Adequacy Ratio (CAR)?',
      options: [
        'To ensure a financial institution holds adequate capital to absorb a reasonable amount of loss before insolvency',
        'To limit the maximum salary bonuses of investment banking analysts',
        'To determine daily foreign currency exchange fees at retail teller windows',
        'To set the annual subscription fees for financial data terminals',
      ],
      correctIndex: 0,
      explanation: 'CAR measures a bank capital relative to its risk-weighted assets to prevent systemic insolvency.',
    },
    {
      text: 'In the Capital Asset Pricing Model (CAPM), what does the Beta coefficient (β) represent?',
      options: [
        'A measure of an asset systematic volatility relative to the overall market portfolio',
        'The risk-free rate of return of government treasury bonds',
        'The company quarterly dividend yield percentage',
        'The bid-ask spread of illiquid fixed-income securities',
      ],
      correctIndex: 0,
      explanation: 'Beta measures systematic market risk; a Beta above 1 indicates higher volatility than the benchmark index.',
    },
    {
      text: 'In options derivative pricing, which Greek letter measures the rate of change of Delta with respect to changes in the underlying asset price?',
      options: ['Gamma', 'Theta', 'Vega', 'Rho'],
      correctIndex: 0,
      explanation: 'Gamma represents the convexity or rate of change of Delta per unit movement in the underlying price.',
    },
    {
      text: 'What is the difference between Enterprise Value (EV) and Market Capitalization of a firm?',
      options: [
        'EV includes market equity value plus total debt minus cash, reflecting total acquisition cost',
        'Market capitalization includes debt while EV only reflects shares owned by retail traders',
        'EV is always equal to total revenue multiplied by 10',
        'Market capitalization is calculated exclusively for privately held companies',
      ],
      correctIndex: 0,
      explanation: 'Enterprise Value reflects the total cost to acquire a firm: Market Cap + Total Debt - Cash & Cash Equivalents.',
    },
    {
      text: 'What does Value at Risk (VaR) measure in quantitative portfolio risk management?',
      options: [
        'The maximum expected monetary loss over a specified time horizon at a given statistical confidence level',
        'The guaranteed minimum daily profit generated by quantitative arbitrage algorithms',
        'The total brokerage commission charged per executed futures contract',
        'The cumulative sum of interest coupons paid across government bonds',
      ],
      correctIndex: 0,
      explanation: 'VaR estimates the maximum potential loss over a target timeframe (e.g. 1 day, 99% confidence).',
    },
    {
      text: 'Under international liquidity standards, what does the Liquidity Coverage Ratio (LCR) mandate for financial institutions?',
      options: [
        'Holding sufficient High-Quality Liquid Assets (HQLA) to survive a 30-day acute stress scenario',
        'Maintaining a 100% reserve on all long-term 30-year home mortgages',
        'Converting all foreign currency deposits to gold bullion within 24 hours',
        'Lending only to companies with AAA sovereign credit ratings',
      ],
      correctIndex: 0,
      explanation: 'LCR requires institutions to hold adequate unencumbered HQLA to withstand a 30-day liquidity stress event.',
    },
    {
      text: 'What typically happens when the government bond yield curve inverts (short-term yields exceed long-term yields)?',
      options: [
        'It is historically interpreted as a leading signal of economic slowdown or impending recession',
        'It guarantees instantaneous inflation rates drop to zero percent',
        'It forces all stock markets to halt trading for the remainder of the week',
        'It means commercial banks cease issuing credit cards entirely',
      ],
      correctIndex: 0,
      explanation: 'An inverted yield curve reflects investor expectations of future rate cuts due to anticipated economic contraction.',
    },
    {
      text: 'In electronic trading platforms, what is the primary architecture of a central Limit Order Book (LOB) matching engine?',
      options: [
        'Price-Time Priority (FIFO) queue for matching bid orders against ask orders at ultra-low latency',
        'Random selection of orders based on client alphabetical order',
        'Delayed batch processing once every 24 hours at midnight',
        'Executing only orders with values exceeding one million dollars',
      ],
      correctIndex: 0,
      explanation: 'Modern matching engines use Price-Time Priority to pair buy and sell limit orders deterministically.',
    },
    {
      text: 'In Modern Portfolio Theory (MPT) developed by Harry Markowitz, what is the "Efficient Frontier"?',
      options: [
        'The set of optimal portfolios that offer the highest expected return for a defined level of risk',
        'The maximum legal interest rate commercial banks are permitted to charge borrowers',
        'The list of stocks that have never experienced a quarterly price drop',
        'The geographical boundary between sovereign financial jurisdictions',
      ],
      correctIndex: 0,
      explanation: 'The Efficient Frontier plots portfolios that maximize expected return for a given risk level.',
    },
    {
      text: 'What is the distinction between Free Cash Flow to Firm (FCFF) and Free Cash Flow to Equity (FCFE)?',
      options: [
        'FCFF is available to all capital providers (debt + equity), while FCFE is available only to equity shareholders after debt obligations',
        'FCFF is used only by state-owned corporations while FCFE is used by non-profits',
        'FCFE includes cash generated by issuing corporate bonds, whereas FCFF excludes sales revenue',
        'There is no distinction; they are two identical mathematical formulas',
      ],
      correctIndex: 0,
      explanation: 'FCFF represents cash flow available to both equity and debt holders; FCFE is the residual cash for equity owners.',
    },
    {
      text: 'Which underlying assumption is made by the standard Black-Scholes-Merton option pricing model?',
      options: [
        'The risk-free rate and volatility of the underlying asset are constant over the option lifetime',
        'Stock prices move in discontinuous jumps without any random walk component',
        'Trading commissions and taxes scale linearly with market capitalisation',
        'European options can be exercised at any arbitrary time prior to expiration',
      ],
      correctIndex: 0,
      explanation: 'Black-Scholes assumes lognormal stock returns, constant risk-free rate, and constant asset volatility with no transaction costs.',
    },
    {
      text: 'What is a Credit Default Swap (CDS) used for in institutional credit markets?',
      options: [
        'A derivative contract that allows an investor to hedge or offset credit exposure to an issuer default',
        'A software swap of point-of-sale credit card readers between retail checkout registers',
        'An exchange of short-term interest rates between retail bank accounts',
        'A permanent cancellation of sovereign debt without legal notification',
      ],
      correctIndex: 0,
      explanation: 'A CDS functions like credit insurance: the buyer pays periodic premiums to transfer default risk to the seller.',
    },
    {
      text: 'In algorithmic trading execution, what does a VWAP (Volume-Weighted Average Price) algorithm do?',
      options: [
        'Executes large orders by slicing them into proportional slices based on historical volume distribution throughout the trading day',
        'Purchases all available shares in a single trade to trigger a price rally',
        'Sells off shares strictly when trading volume drops below zero',
        'Guarantees buying at the absolute lowest price recorded during the calendar year',
      ],
      correctIndex: 0,
      explanation: 'VWAP slices large parent orders into child orders matching intraday volume profiles to minimize market impact.',
    },
    {
      text: 'What does EBITDA stand for, and why do financial analysts utilize it when comparing cross-industry businesses?',
      options: [
        'Earnings Before Interest, Taxes, Depreciation, and Amortization; it isolates core operating profitability across varying capital structures',
        'Equity Based Income Through Direct Accountancy; it computes customer tax refunds',
        'Estimated Budget Target During Annual Audits; it sets corporate travel budgets',
        'Every Business Transaction Deducted Annually; it tracks invoice discounts',
      ],
      correctIndex: 0,
      explanation: 'EBITDA removes non-operating differences like debt financing structures and tax jurisdictions to measure pure operating efficiency.',
    },
  ],

  telecom: [
    {
      text: 'What is the primary role of the Session Initiation Protocol (SIP) in modern telecommunications architecture?',
      options: [
        'Signaling and controlling multimedia communication sessions such as voice and video calls over IP networks',
        'Encrypting cellular SIM card plastic packaging during warehouse storage',
        'Transmitting analog radio waves over optical fiber cables',
        'Calculating monthly roaming tariff rates for overseas tourist packages',
      ],
      correctIndex: 0,
      explanation: 'SIP is the dominant VoIP signaling protocol for creating, modifying, and terminating real-time communication sessions.',
    },
    {
      text: 'In 5G core network architecture, what is "Network Slicing"?',
      options: [
        'Multiplexing virtualized, independent logical networks on the same physical infrastructure customized for specific SLA demands',
        'Physically severing damaged underground fiber-optic cables for repair',
        'Dividing mobile subscribers into alphabetical billing rosters',
        'Restricting data download speeds to exactly half of network capacity',
      ],
      correctIndex: 0,
      explanation: 'Network Slicing allows telcos to create dedicated virtual networks tailored for IoT, autonomous vehicles (URLLC), or broadband (eMBB).',
    },
    {
      text: 'Why does real-time VoIP voice transmission typically utilize UDP (User Datagram Protocol) rather than TCP?',
      options: [
        'UDP avoids retransmission delays and head-of-line blocking, prioritizing low latency over late packet recovery',
        'TCP cannot transmit audio waveforms across digital switches',
        'UDP automatically encrypts all packets with quantum-resistant keys',
        'Cellular towers do not support TCP packet headers',
      ],
      correctIndex: 0,
      explanation: 'In live audio, retransmitting a late dropped packet causes noticeable jitter; UDP minimizes latency by streaming without retransmit delays.',
    },
    {
      text: 'What is the function of Quality of Service (QoS) and DSCP (Differentiated Services Code Point) in telecom routing?',
      options: [
        'Classifying and prioritizing latency-sensitive voice and video packets over bulk file download traffic during router congestion',
        'Generating digital watermarks on customer voice mailboxes',
        'Enforcing maximum character limits on SMS messaging portals',
        'Increasing Wi-Fi antenna broadcast ranges by ten times',
      ],
      correctIndex: 0,
      explanation: 'DSCP marks packets in the IP header to ensure network routers give voice and critical telemetry priority queueing.',
    },
    {
      text: 'In cellular telecommunications, what is the Authentication and Key Agreement (AKA) protocol responsible for?',
      options: [
        'Mutual cryptographic authentication between the SIM card (USIM) and the mobile core network to establish ciphering keys',
        'Distributing promotional SMS text vouchers to prepaid mobile customers',
        'Formatting GPS coordinate data inside map navigation applications',
        'Calibrating touch screen sensitivity on modern Android smartphones',
      ],
      correctIndex: 0,
      explanation: 'The AKA protocol verifies subscriber identity and derives session encryption keys (CK/IK) for secure wireless transmission.',
    },
    {
      text: 'What is the distinction between BSS (Business Support Systems) and OSS (Operations Support Systems) in telecom operations?',
      options: [
        'BSS manages customer-facing revenue activities (billing, CRM, orders), while OSS manages network infrastructure (inventory, fault, performance)',
        'OSS is used exclusively for landline phones while BSS is used for fiber optics',
        'BSS handles server room air conditioning while OSS computes payroll taxes',
        'There is no distinction; both terms refer to customer call center headsets',
      ],
      correctIndex: 0,
      explanation: 'BSS handles business and customer interactions (order taking, rating, billing); OSS handles network operations and maintenance.',
    },
    {
      text: 'Which cellular generation first replaced circuit-switched voice calls with an end-to-end IP multimedia subsystem (VoLTE)?',
      options: ['4G LTE', '2G GSM', '3G UMTS', '1G AMPS'],
      correctIndex: 0,
      explanation: '4G LTE is an all-IP network; Voice over LTE (VoLTE) migrated traditional circuit-switched calls into packet-switched IP telephony.',
    },
    {
      text: 'In 5G Radio Access Networks (RAN), what is the official designation for the next-generation cellular base station?',
      options: ['gNodeB (gNB)', 'eNodeB (eNB)', 'BTS (Base Transceiver Station)', 'BSC (Base Station Controller)'],
      correctIndex: 0,
      explanation: '5G introduces the gNodeB (Next-Generation NodeB), which interfaces with the 5G Core (5GC) network.',
    },
    {
      text: 'What are the three primary service classifications defined by 3GPP for 5G systems?',
      options: [
        'eMBB (Enhanced Mobile Broadband), URLLC (Ultra-Reliable Low-Latency Communication), and mMTC (Massive Machine-Type Communication)',
        'Voice, SMS, and Multimedia MMS messaging services only',
        'Standard 3G, High-speed 4G, and Satellite broadcast channels',
        'Personal, Business, and Enterprise corporate billing plans',
      ],
      correctIndex: 0,
      explanation: '5G defines eMBB (high speed), URLLC (sub-millisecond latency for mission-critical use), and mMTC (millions of IoT devices).',
    },
    {
      text: 'What is the primary architectural purpose of Mobile Edge Computing (MEC) in telecommunication networks?',
      options: [
        'Deploying compute and cloud resources at the cellular network edge near user equipment to minimize round-trip latency',
        'Replacing physical SIM cards with paper QR codes',
        'Increasing mobile battery longevity by lowering screen brightness',
        'Archiving telephone directories to offline magnetic tape drives',
      ],
      correctIndex: 0,
      explanation: 'MEC places computing nodes at local cellular hubs, enabling real-time edge processing for AR/VR, robotics, and connected cars.',
    },
    {
      text: 'In telecommunications billing mediation, what is a Call Detail Record (CDR)?',
      options: [
        'A standardized data record containing telecommunication transaction attributes (caller, recipient, duration, cell ID, timestamp)',
        'An audio recording of the conversation between callers stored forever',
        'The physical paper invoice mailed to post-paid residential customers',
        'The serial number of the customer smartphone battery',
      ],
      correctIndex: 0,
      explanation: 'CDRs capture raw usage metadata from network switches to feed billing rating engines and network monitoring tools.',
    },
    {
      text: 'What is "Carrier Aggregation" in LTE-Advanced and 5G wireless networks?',
      options: [
        'Combining multiple separate frequency spectrum bands simultaneously to increase user data throughput and bandwidth',
        'Merging competing telecom corporations into a single national monopoly',
        'Sharing customer marketing email lists across unrelated internet service providers',
        'Connecting two smartphone handset headsets to a single audio jack',
      ],
      correctIndex: 0,
      explanation: 'Carrier Aggregation bonds multiple radio carriers into a wider channel, substantially increasing overall peak data rates.',
    },
    {
      text: 'During a cellular voice call, what event is executed when a user travels from the coverage area of one cell tower into another?',
      options: [
        'Handover (or Handoff) between base stations without dropping the active call',
        'Immediate call termination requiring redialing by the subscriber',
        'Switching the subscriber handset into permanent airplane mode',
        'Reformatting the internal phone flash memory storage',
      ],
      correctIndex: 0,
      explanation: 'Handovers dynamically shift the radio channel from the old cell to the new cell seamlessly while maintaining session continuity.',
    },
    {
      text: 'What is an MVNO (Mobile Virtual Network Operator)?',
      options: [
        'A wireless communications provider that does not own the wireless network infrastructure over which it provides services to customers',
        'A video streaming video game console manufactured by telecom carriers',
        'A virtual reality headset used by radio tower maintenance technicians',
        'An artificial satellite that orbits exclusively over oceanic international waters',
      ],
      correctIndex: 0,
      explanation: 'MVNOs lease wholesale network capacity from established Mobile Network Operators (MNOs) to sell customized retail services.',
    },
    {
      text: 'What is the Diameter protocol predominantly used for in 4G LTE and IMS telecommunication networks?',
      options: [
        'Authentication, Authorization, and Accounting (AAA) as well as policy and charging rule enforcement (PCRF)',
        'Measuring the physical diameter of fiber optic glass cables',
        'Compressing high-definition video frames on consumer smartphones',
        'Converting text SMS messages into speech audio files',
      ],
      correctIndex: 0,
      explanation: 'Diameter is the successor to RADIUS, providing robust AAA and real-time charging/policy control across LTE and IMS networks.',
    },
  ],

  insurance: [
    {
      text: 'In property and casualty insurance, what does the term "Subrogation" mean?',
      options: [
        'The legal right of an insurer to pursue a third party that caused an insurance loss to recover compensation paid to the policyholder',
        'The cancellation of an active policy because of non-payment of premiums',
        'An automated discount applied when insuring multiple motor vehicles',
        'The physical replacement of a broken automotive windshield',
      ],
      correctIndex: 0,
      explanation: 'Subrogation allows the insurer to "step into the shoes" of the insured to recover claim payouts from responsible third parties.',
    },
    {
      text: 'In health and auto insurance policies, what is a "Deductible"?',
      options: [
        'The specific out-of-pocket amount the policyholder must pay before the insurance coverage begins paying for losses',
        'A tax deduction provided by the government for purchasing term insurance',
        'A reduction in the monthly premium achieved by installing a dashcam',
        'The total maximum monetary coverage ceiling stipulated in the contract',
      ],
      correctIndex: 0,
      explanation: 'A deductible is the upfront cost borne by the insured; the carrier covers covered expenses exceeding this threshold.',
    },
    {
      text: 'In actuarial science, what primary dataset is used to calculate life insurance policy pricing and risk premiums?',
      options: [
        'Mortality tables and life expectancy statistical distributions',
        'Quarterly gross domestic product growth reports',
        'Daily stock market benchmark closing prices',
        'Consumer credit card rewards program usage statistics',
      ],
      correctIndex: 0,
      explanation: 'Actuaries rely on empirical mortality and morbidity tables to model probabilities of death and survival across demographics.',
    },
    {
      text: 'What does "First Notice of Loss" (FNOL) signify in the insurance claims management lifecycle?',
      options: [
        'The initial report submitted by the policyholder or claimant to the insurer regarding an asset theft, damage, or injury event',
        'The final legal verdict issued by a court of law regarding insurance fraud',
        'A notification letter sent to a customer when an insurance policy lapses',
        'The payment disbursement receipt transferred to the repair workshop',
      ],
      correctIndex: 0,
      explanation: 'FNOL is the very first step in the claims processing workflow, triggering claim file creation, triage, and adjuster assignment.',
    },
    {
      text: 'What is the "Combined Ratio" in insurance underwriting profitability analysis?',
      options: [
        'The sum of incurred losses and operating expenses divided by earned premium; a ratio below 100% indicates an underwriting profit',
        'The ratio of male to female policyholders enrolled in group policies',
        'The percentage of claims that are contested in civil court arbitrations',
        'The proportion of investments allocated to government treasury bonds',
      ],
      correctIndex: 0,
      explanation: 'Combined ratio = (Losses + Expenses) / Earned Premium. A value < 100% means the insurer takes in more premiums than it pays out in claims and expenses.',
    },
    {
      text: 'What is the purpose of Reinsurance in the financial stability of insurance carriers?',
      options: [
        'Insurance purchased by an insurance company to protect against catastrophic accumulated losses and spread underwriting risk',
        'Mandatory health insurance provided to insurance sales executives',
        'Re-issuing an expired policy after receiving a late premium payment',
        'Buying back corporate stock shares from secondary public markets',
      ],
      correctIndex: 0,
      explanation: 'Reinsurance allows carriers to offload portions of their risk exposure (e.g. hurricanes, earthquakes) to global reinsurers like Swiss Re.',
    },
    {
      text: 'In insurance underwriting, what does "Adverse Selection" refer to?',
      options: [
        'The tendency of individuals with higher-than-average risk to purchase insurance more actively than individuals with lower risk',
        'An underwriter picking the wrong computer software platform',
        'An insurance agent choosing to sell policies in low-income zip codes',
        'A customer selecting the lowest deductible option available on a website',
      ],
      correctIndex: 0,
      explanation: 'Adverse selection occurs when high-risk applicants disproportionately seek coverage, distorting standard risk pool assumptions.',
    },
    {
      text: 'How does modern Telematics data enable Usage-Based Insurance (UBI) in automotive underwriting?',
      options: [
        'Sensors and mobile GPS stream real-time driving behavior (braking, acceleration, cornering, speed) to calculate dynamic risk premiums',
        'It plays promotional voice advertisements over the car radio speakers',
        'It allows the insurance company to remotely turn off the car engine if payments are late',
        'It automatically orders fast food delivery when the driver is stuck in highway traffic',
      ],
      correctIndex: 0,
      explanation: 'Telematics monitors driving habits (miles driven, smooth braking, nighttime driving) to offer personalized risk-based premiums.',
    },
    {
      text: 'What is "Straight-Through Processing" (STP) in modern insurance digital claims workflows?',
      options: [
        'Automated end-to-end claim adjudication and payment settlement without manual human intervention for eligible claims',
        'Driving an automobile straight through a physical inspection checkpoint',
        'Filing an insurance claim directly with the national police department',
        'Printing paper insurance certificates on continuous feeding printers',
      ],
      correctIndex: 0,
      explanation: 'STP utilizes rules engines and automated AI validations to process low-complexity claims instantly without human adjuster touches.',
    },
    {
      text: 'What is the difference between "Moral Hazard" and "Morale Hazard" in risk assessment?',
      options: [
        'Moral hazard involves intentional dishonest behavior (fraud), while morale hazard is carelessness caused by having insurance coverage',
        'Moral hazard applies only to life insurance, whereas morale hazard applies to commercial marine shipping',
        'Moral hazard is a legal term for bankruptcy; morale hazard measures company employee happiness',
        'There is no distinction; they are interchangeable legal terms',
      ],
      correctIndex: 0,
      explanation: 'Moral hazard involves deliberate fraud or staged losses; morale hazard occurs when being insured causes an attitude of indifference to risk.',
    },
    {
      text: 'What is the ACORD standard in insurance enterprise integration architecture?',
      options: [
        'A global non-profit association providing standardized electronic data formats and XML/JSON messaging schemas for insurance data exchange',
        'A musical tuning frequency used in insurance telephone customer support hold music',
        'A physical vault where paper legal insurance deeds are stored',
        'A standardized mathematical formula for calculating car mechanic hourly wages',
      ],
      correctIndex: 0,
      explanation: 'ACORD standards enable seamless data interchange across brokers, carriers, agents, and reinsurance partners.',
    },
    {
      text: 'In a modern Policy Administration System (PAS), what is the correct chronological sequence of states for a new insurance contract?',
      options: [
        'Lead / Quote -> Underwrite -> Bind -> Issue -> Endorse / Renew',
        'Issue -> Quote -> Cancel -> Underwrite -> Claim',
        'Claim -> Bind -> Underwrite -> Quote -> Issue',
        'Endorse -> Renew -> Quote -> Cancel -> Bind',
      ],
      correctIndex: 0,
      explanation: 'A customer receives a Quote, the application is Underwritten, Bound (coverage committed), Issued (policy active), and subsequently Endorsed or Renewed.',
    },
    {
      text: 'What is the primary role of Catastrophe (CAT) modeling software in property insurance?',
      options: [
        'Simulating thousands of historical and synthetic natural disasters (hurricanes, earthquakes, floods) to estimate portfolio financial exposure',
        'Designing computer graphics for emergency hospital evacuation route maps',
        'Tracking minor scratches on newly manufactured showroom motor vehicles',
        'Scheduling annual safety drills for corporate insurance office buildings',
      ],
      correctIndex: 0,
      explanation: 'CAT models combine meteorological, seismic, and engineering data to project financial losses from extreme catastrophe events.',
    },
    {
      text: 'What regulatory framework governs the capital adequacy and solvency requirements of insurance companies operating in the European Union?',
      options: ['Solvency II', 'Basel III', 'Dodd-Frank Title VII', 'Sarbanes-Oxley Act'],
      correctIndex: 0,
      explanation: 'Solvency II mandates harmonized capital requirements and enterprise risk governance for EU insurance undertakings.',
    },
    {
      text: 'How do machine learning algorithms assist insurance fraud detection units (SIU)?',
      options: [
        'By analyzing social graph networks, image metadata for recycled crash photos, and behavioral claim submission anomalies',
        'By automatically rejecting every claim submitted by customers on Mondays',
        'By generating synthetic fake insurance contracts to sell to competition',
        'By reducing the storage capacity of document scanning databases',
      ],
      correctIndex: 0,
      explanation: 'AI models detect fraud by finding organized ring networks, altered digital photos, and anomaly scores that warrant deeper investigation.',
    },
  ],

  'erp-crm': [
    {
      text: 'In multi-tenant SaaS ERP architectures, what is the key difference between a "Shared Database, Shared Schema" and a "Database per Tenant" model?',
      options: [
        'Shared schema separates customer data via a tenant_id column; database per tenant provides maximum physical data isolation at higher infrastructure overhead',
        'Shared schema can only host a maximum of two corporate customers simultaneously',
        'Database per tenant requires all users to share the exact same administrative login password',
        'Shared schema does not permit relational foreign keys between tables',
      ],
      correctIndex: 0,
      explanation: 'Shared schema uses a tenant_id discriminator column for high density; separate databases maximize compliance isolation at higher cost.',
    },
    {
      text: 'In customer relationship management (CRM) systems, what is the standard state machine lifecycle for a business sales pipeline?',
      options: [
        'Lead -> Marketing Qualified (MQL) -> Sales Qualified (SQL) -> Opportunity -> Closed Won / Lost',
        'Closed Lost -> Lead -> Opportunity -> Invoiced -> Customer',
        'Deal -> Lead -> Prospect -> Archive -> MQL',
        'Contact -> Invoiced -> Refunded -> Lead -> Won',
      ],
      correctIndex: 0,
      explanation: 'A contact begins as a raw Lead, is qualified by marketing/sales into an Opportunity, and reaches Closed Won or Closed Lost.',
    },
    {
      text: 'In enterprise inventory ERP systems, what is the Perpetual Inventory valuation method?',
      options: [
        'Continuously updating inventory balances, cost of goods sold, and general ledger accounts in real-time as transactions occur',
        'Counting physical items in the warehouse only once a year on December 31st',
        'Assuming inventory never decreases regardless of customer purchases',
        'Valuing all physical warehouse items at their original 1990 purchase price',
      ],
      correctIndex: 0,
      explanation: 'Perpetual inventory records purchases and sales immediately in real time, unlike periodic manual inventory counts.',
    },
    {
      text: 'What is the primary role of Role-Based Access Control (RBAC) and Field-Level Security in an enterprise CRM like Salesforce?',
      options: [
        'Restricting read and write permissions to specific data objects and individual record fields based on assigned employee job roles',
        'Changing the background font color of user profile avatars',
        'Preventing employees from opening the CRM in web browsers on laptops',
        'Restricting users to typing in capital letters only',
      ],
      correctIndex: 0,
      explanation: 'RBAC and field-level permissions ensure sales reps only see their territory leads and sensitive fields (e.g. credit scores) remain hidden.',
    },
    {
      text: 'When integrating an external billing gateway with an ERP, why must the webhook receiver endpoint be designed as "idempotent"?',
      options: [
        'To ensure duplicate payment notifications delivered by network retries do not record duplicate ledger revenue or double-credit the customer',
        'To force the webhook payload to be written in binary assembly code',
        'To automatically refund every customer payment within 60 seconds',
        'Because HTTP POST requests can only be sent once per calendar week',
      ],
      correctIndex: 0,
      explanation: 'Idempotency checks guarantee that receiving the exact same webhook payload multiple times results in only one state change.',
    },
    {
      text: 'In ERP manufacturing modules, what does Material Requirements Planning (MRP) calculate?',
      options: [
        'The required quantities and timing of raw material orders based on bill of materials (BOM), current inventory, and production schedules',
        'The ergonomic desk heights required for assembly line factory workers',
        'The retail selling price of scrap packaging cardboard boxes',
        'The average duration of employee lunch breaks during manufacturing shifts',
      ],
      correctIndex: 0,
      explanation: 'MRP analyzes the Bill of Materials (BOM) against inventory and demand forecasts to schedule raw material procurement and production.',
    },
    {
      text: 'What is a "Customer 360" view in modern enterprise CRM architectures?',
      options: [
        'A consolidated single pane of glass aggregating all customer touchpoints: purchases, support tickets, billing history, contracts, and interactions',
        'A 360-degree rotating webcam feed of the customer computer desk',
        'A requirement that sales calls last exactly 360 seconds',
        'A customer satisfaction rating scale ranging from 0 to 360 points',
      ],
      correctIndex: 0,
      explanation: 'Customer 360 integrates disparate ERP, CRM, marketing, and support data into one unified holistic customer profile.',
    },
    {
      text: 'In multi-user CRM systems, how does Optimistic Concurrency Control (OCC) prevent lost updates when two sales reps edit the same lead simultaneously?',
      options: [
        'By checking a version number or updated_at timestamp in the UPDATE query WHERE clause; if changed, the second write is rejected',
        'By completely locking the entire database table so only one user can log in per day',
        'By quietly overwriting the first sales rep notes without saving them',
        'By merging words from both sales reps into a single scrambled sentence',
      ],
      correctIndex: 0,
      explanation: 'OCC verifies that the record version hasn’t changed since it was loaded, preventing silent concurrent overwrite conflicts.',
    },
    {
      text: 'In enterprise Configure, Price, Quote (CPQ) software, what is the primary role of the rules engine?',
      options: [
        'Validating complex product compatibility configurations, applying dynamic discounting tiers, and generating legally binding quotes',
        'Generating randomized product serial numbers for factory machinery',
        'Calculating vehicle fuel reimbursement rates for executive travel',
        'Translating corporate marketing brochures into Spanish and French',
      ],
      correctIndex: 0,
      explanation: 'CPQ engines prevent incompatible feature combinations and enforce strict corporate discount approval matrices.',
    },
    {
      text: 'What is Master Data Management (MDM) designed to accomplish across fragmented corporate databases?',
      options: [
        'Creating a single authoritative, deduplicated source of truth for core corporate entities like Customers, Products, and Vendors',
        'Storing copies of all employee personal family photos',
        'Writing daily database backups to physical optical compact discs',
        'Replacing relational databases with simple unformatted spreadsheet files',
      ],
      correctIndex: 0,
      explanation: 'MDM removes duplicates, standardizes formats, and establishes a single trusted "Golden Record" across disconnected corporate systems.',
    },
    {
      text: 'In customer support CRM modules, how is a Service Level Agreement (SLA) escalation matrix automated?',
      options: [
        'Scheduled background workers monitor ticket response and resolution timers, escalating priority or reassigning tickets if SLA thresholds breach',
        'Customer service agents manually dial the corporate CEO whenever a ticket is submitted',
        'Customers are charged double their monthly subscription fee if they file a bug report',
        'Tickets are automatically closed and marked resolved after two hours without human review',
      ],
      correctIndex: 0,
      explanation: 'Automated SLA engines track resolution milestones and trigger automatic manager alerts or reassignment when deadlines approach.',
    },
    {
      text: 'In financial ERP general ledger modules, what fundamental constraint is enforced on posted journal vouchers?',
      options: [
        'Journal entries are immutable once posted; corrections must be handled through explicit reversing or adjusting entries',
        'Accountants can freely edit transaction amounts from three years ago in SQL directly',
        'Debits must only be entered on odd-numbered days of the calendar month',
        'Ledger balances are automatically deleted at the start of each fiscal year',
      ],
      correctIndex: 0,
      explanation: 'General ledgers require immutability and complete audit trails; posted entries are never modified or deleted, only reversed.',
    },
    {
      text: 'When migrating historical customer records into a new CRM, what is the function of an ETL (Extract, Transform, Load) pipeline?',
      options: [
        'Extracting legacy source data, cleansing and mapping it to the new target schema, and validating business rules before database insertion',
        'Compressing email attachments into encrypted ZIP archives',
        'Installing desktop CRM client software onto employee laptops',
        'Formatting the corporate intranet website with modern CSS styles',
      ],
      correctIndex: 0,
      explanation: 'ETL pipelines extract raw legacy data, transform/cleanse/deduplicate it to match target schema constraints, and load it reliably.',
    },
    {
      text: 'What does the abbreviation "ERP" stand for in enterprise software architecture?',
      options: ['Enterprise Resource Planning', 'Electronic Request Protocol', 'Emergency Recovery Plan', 'Extended Revenue Partition'],
      correctIndex: 0,
      explanation: 'ERP stands for Enterprise Resource Planning, integrating core business processes (finance, HR, supply chain, procurement) into one system.',
    },
    {
      text: 'Under data privacy regulations like GDPR, how must an enterprise CRM handle a customer "Right to Erasure" request?',
      options: [
        'Permanently delete or anonymize personal identifying data across all CRM tables and downstream integrated caches, while retaining legally mandated audit records',
        'Hide the contact record from the search bar while keeping all raw details intact',
        'Send an angry automated email notifying the customer their account is blocked',
        'Sell the customer data immediately to third-party telemarketing firms',
      ],
      correctIndex: 0,
      explanation: 'GDPR Article 17 requires complete anonymization/erasure of personal data, balanced against statutory accounting retention requirements.',
    },
  ],

  loan: [
    {
      text: 'When calculating the Equal Monthly Installment (EMI) for a fixed-rate amortizing term loan, which formula is utilized?',
      options: [
        'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months',
        'EMI = Principal divided by number of days in the calendar year plus annual tax',
        'EMI = Total loan amount multiplied by 12 divided by borrower age',
        'EMI = Interest rate multiplied by the borrower annual credit card limit',
      ],
      correctIndex: 0,
      explanation: 'The standard amortization formula calculates fixed periodic installments that cover both reducing principal and accrued interest.',
    },
    {
      text: 'What does the Loan-to-Value (LTV) ratio measure in secured mortgage and collateral lending?',
      options: [
        'The ratio of the borrowed loan amount relative to the appraised market value of the collateral asset; higher LTV indicates higher risk',
        'The total profit earned by the bank over the entire lifetime of the mortgage',
        'The percentage of the loan paid using digital bank transfers versus cash',
        'The ratio of the borrower salary to the total national debt',
      ],
      correctIndex: 0,
      explanation: 'LTV compares the loan principal to the collateral value; an 80% LTV on a $100k home means an $80k loan with a $20k down payment.',
    },
    {
      text: 'In credit underwriting, what does the Debt Service Coverage Ratio (DSCR) assess for commercial business loans?',
      options: [
        'The ratio of net operating income available to service annual debt interest and principal obligations; a DSCR > 1.25 indicates adequate cash cushion',
        'The number of customer service representatives assigned to a commercial account',
        'The total physical square footage of the corporate headquarters building',
        'The percentage of business revenue generated by cash sales instead of credit cards',
      ],
      correctIndex: 0,
      explanation: 'DSCR = Net Operating Income / Total Debt Service. A ratio above 1.0 means the business generates sufficient operational cash to service debt.',
    },
    {
      text: 'What is the primary architectural difference between a Loan Origination System (LOS) and a Loan Management System (LMS)?',
      options: [
        'LOS handles onboarding, credit checks, document verification, and underwriting decisioning; LMS manages servicing, EMI repayment schedules, accounting, and collections',
        'LOS is used only for personal loans, whereas LMS is used only for gold loans',
        'LMS creates marketing billboards, while LOS prints borrower passbooks',
        'There is no difference; they are redundant names for the same software service',
      ],
      correctIndex: 0,
      explanation: 'LOS captures and evaluates the application up to disbursement; LMS services the loan lifecycle (accounting, EMIs, statements, foreclosures) thereafter.',
    },
    {
      text: 'What is the difference between "Flat Interest Rate" and "Reducing Balance Interest Rate" in personal lending?',
      options: [
        'Flat rate calculates interest on the initial principal throughout the entire tenure; reducing balance calculates interest only on the outstanding remaining principal',
        'Flat rate changes every month with market inflation; reducing balance is fixed for 50 years',
        'Flat rate is used only for government subsidies; reducing balance is illegal in modern banking',
        'There is no mathematical difference; both yield the exact same total interest amount',
      ],
      correctIndex: 0,
      explanation: 'Under reducing balance, interest drops as principal is repaid. A 10% flat rate has a significantly higher effective APR than a 10% reducing rate.',
    },
    {
      text: 'In credit risk assessment, what primary factor accounts for the largest weighting in consumer FICO/CIBIL credit scores?',
      options: [
        'Payment history: whether past credit accounts and EMIs were paid on time without delinquencies',
        'The university or college the borrower graduated from',
        'The physical residential address zip code of the applicant',
        'The specific brand of mobile smartphone used during loan application',
      ],
      correctIndex: 0,
      explanation: 'Payment history typically constitutes approximately 35% of a credit score, reflecting past reliability in honoring debt schedules.',
    },
    {
      text: 'When a bank grants a secured loan against real estate, what legal instrument is recorded with the government land registry to secure the collateral?',
      options: [
        'Mortgage Deed and Lien / Charge registration',
        'An informal verbal understanding witnessed by neighbors',
        'A promissory note stored in a wooden bank safety box',
        'A simple utility water bill receipt signed by the borrower',
      ],
      correctIndex: 0,
      explanation: 'A formal mortgage and recorded public lien ensure the lender has first legal claim over the real estate if the borrower defaults.',
    },
    {
      text: 'What does "ACH" or "NACH" mandate enable in consumer loan management platforms?',
      options: [
        'Automated recurring electronic fund debits from the borrower primary bank account on designated EMI due dates',
        'Instant credit score improvement without paying back debt',
        'Automated cancellation of loan interest during holidays',
        'Sending free promotional SMS text messages to borrower contacts',
      ],
      correctIndex: 0,
      explanation: 'NACH / ACH mandates allow automated recurring direct debits from borrower checking accounts to ensure timely loan repayments.',
    },
    {
      text: 'Under standard regulatory norms (e.g. RBI / Federal Reserve), when is a delinquent loan officially classified as a Non-Performing Asset (NPA)?',
      options: [
        'When interest or principal installment remains overdue for a period exceeding 90 consecutive days',
        'Immediately after a borrower is 24 hours late on their first payment',
        'Only after the borrower passes away without legal heirs',
        'When the borrower requests a temporary payment holiday for vacations',
      ],
      correctIndex: 0,
      explanation: 'Loans are categorized as NPAs / Bad Loans when payments are past due for more than 90 days (substandard asset classification).',
    },
    {
      text: 'In loan securitization, what are "Tranches"?',
      options: [
        'Slices of pooled debt securities partitioned into different risk and maturity profiles (Senior, Mezzanine, Equity) to appeal to varying investor risk appetites',
        'The physical paper folders used by loan verification field agents',
        'The interest fees charged when paying EMIs with cash at teller counters',
        'The legal notices mailed to delinquent borrowers before auctioning property',
      ],
      correctIndex: 0,
      explanation: 'Tranches divide pooled loan cash flows into risk tiers: senior tranches get paid first with lower yields; equity tranches absorb first losses.',
    },
    {
      text: 'What is the "Annual Percentage Rate" (APR) and why is its disclosure mandatory under truth-in-lending laws?',
      options: [
        'The comprehensive annualized cost of credit including nominal interest, processing fees, documentation charges, and mandatory insurance',
        'The annual bonus percentage paid to the bank loan sales executive',
        'The percentage rate of inflation measured by national statistical bureaus',
        'The tax rate applied by corporate accountants on quarterly dividends',
      ],
      correctIndex: 0,
      explanation: 'APR reveals the true, all-in cost of borrowing per year, stopping lenders from disguising high costs behind low headline interest rates and hidden fees.',
    },
    {
      text: 'What is a "Balloon Payment" structure in commercial vehicle and equipment financing?',
      options: [
        'A repayment schedule featuring lower periodic installments throughout the loan tenure with a disproportionately large final payment at maturity',
        'A celebratory cash bonus gifted to borrowers who complete all EMIs',
        'An interest penalty assessed when borrowing during inflationary periods',
        'An emergency fund provided to borrowers facing unexpected hospital expenses',
      ],
      correctIndex: 0,
      explanation: 'Balloon loans reduce regular payments by deferring a large portion of principal to the final installment at the end of the loan term.',
    },
    {
      text: 'What legal responsibility is assumed by a "Co-signer" or "Guarantor" on a credit loan agreement?',
      options: [
        'Equal legal liability to repay the entire loan balance and accrued penalties if the primary borrower defaults',
        'No legal liability; the guarantor is merely an emergency telephone contact',
        'The right to confiscate and keep the borrower collateral asset immediately',
        'Receiving 50% of the disbursed loan amount as a non-refundable gift',
      ],
      correctIndex: 0,
      explanation: 'Guarantors and co-signers are legally liable for the full debt obligation should the primary borrower fail to make required payments.',
    },
    {
      text: 'In automated loan underwriting engines, what does "Alternative Credit Scoring" utilize for thin-file borrowers without credit bureau history?',
      options: [
        'Utility bill payments, telecommunications airtime recharges, bank account cash-flow aggregation, and digital transaction history',
        'Borrower horoscope astrology birth charts',
        'The number of social media followers the applicant possesses on Instagram',
        'The brand of sneakers worn by the applicant during the in-person interview',
      ],
      correctIndex: 0,
      explanation: 'Alternative data analyzes recurring rent/utility payments, mobile transaction velocity, and bank cash flow to evaluate creditworthiness without credit bureaus.',
    },
    {
      text: 'What does "Days Past Due" (DPD) track in credit collections and loan servicing software?',
      options: [
        'The exact number of calendar days elapsed since a scheduled EMI installment payment became delinquent',
        'The number of days remaining until the borrower next birthday',
        'The total number of days the bank corporate offices were closed for holidays',
        'The duration of the warranty on an automobile purchased with a vehicle loan',
      ],
      correctIndex: 0,
      explanation: 'DPD buckets (e.g. 1-30 DPD, 31-60 DPD, 61-90 DPD) drive collections workflows and determine statutory provisioning requirements.',
    },
  ],
};

/**
 * Maps raw domain labels or strings to the canonical question bank key.
 */
export function normalizeDomainSlug(domainSlug) {
  const raw = String(domainSlug ?? '').toLowerCase().trim();
  if (raw.includes('bank')) return 'banking';
  if (raw.includes('finan') || raw.includes('wealth')) return 'finance';
  if (raw.includes('telecom') || raw.includes('network')) return 'telecom';
  if (raw.includes('ecom') || raw.includes('commerce') || raw.includes('retail')) return 'e-commerce';
  if (raw.includes('health') || raw.includes('med')) return 'healthcare';
  if (raw.includes('insur')) return 'insurance';
  if (raw.includes('erp') || raw.includes('crm')) return 'erp-crm';
  if (raw.includes('loan') || raw.includes('credit') || raw.includes('lend')) return 'loan';
  return raw;
}

/**
 * Returns question bank for a domain slug (fallback to banking if not found).
 */
export function getQuestionsForDomain(domainSlug) {
  const normalized = normalizeDomainSlug(domainSlug);
  if (DOMAIN_QUESTION_BANK[normalized]) {
    return DOMAIN_QUESTION_BANK[normalized];
  }
  return DOMAIN_QUESTION_BANK.banking;
}

