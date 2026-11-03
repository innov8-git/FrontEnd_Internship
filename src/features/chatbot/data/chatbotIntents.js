/**
 * Chatbot intent definitions: keywords, sample questions, and predefined answers.
 * Each intent belongs to a category. The matcher scores user input against keywords.
 *
 * IMPORTANT RESPONSE RULES:
 * 1. Never invent payment confirmation, assessment scores, discounts or certificate status.
 * 2. For account-specific queries, retrieve actual student info from the authenticated backend.
 * 3. Never expose another student's account, payment, project or certificate details.
 * 4. Do not reveal assessment answer keys.
 * 5. Do not promise a job or placement unless explicitly guaranteed.
 * 6. If the chatbot cannot answer confidently, offer human support.
 * 7. Do not claim that SOPs are impossible to copy or screenshot.
 * 8. Do not disclose internal administrative information.
 * 9. Give concise answers first; provide details when requested.
 * 10. Always direct the student to the relevant dashboard page when appropriate.
 */

// ─── Categories ──────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'registration', label: '🔐 Registration & Login' },
  { id: 'designations', label: '💼 Internship Designations' },
  { id: 'assessment', label: '📝 Assessment' },
  { id: 'discounts', label: '💰 Discounts & Pricing' },
  { id: 'duration', label: '⏱️ Internship Duration' },
  { id: 'domains', label: '🏢 Project Domains' },
  { id: 'payment', label: '💳 Payment & Terms' },
  { id: 'schedule', label: '📅 Schedule & SOP' },
  { id: 'tasks', label: '📋 Tasks & Submissions' },
  { id: 'mentorship', label: '👨‍🏫 Mentorship & Support' },
  { id: 'certificate', label: '🎓 Certificate' },
  { id: 'general', label: '❓ General' },
];

// ─── Intents ─────────────────────────────────────────────────────────────────

export const INTENTS = [
  // ── Category 1: Registration & Login ──────────────────────────────────────
  {
    id: 'USER_REGISTRATION',
    category: 'registration',
    keywords: [
      'register', 'registration', 'sign up', 'signup', 'create account',
      'new user', 'join', 'enroll account', 'new student', 'how to join',
    ],
    sampleQuestions: [
      'How can I register?',
      'How do I create an account?',
      'I am a new student. How can I join?',
    ],
    answer: `Welcome to our Internship Portal!

**To register:**
1. Open the **Registration** page.
2. Enter your full name, email address and required details.
3. Create your password.
4. Verify your email address if prompted.
5. Log in to your student dashboard.

Once registered, you can explore internship designations and begin your assessment.`,
  },
  {
    id: 'LOGIN_ISSUE',
    category: 'registration',
    keywords: [
      'login', 'log in', 'sign in', 'signin', 'unable to login', 'cannot login',
      'password incorrect', 'wrong password', 'account access', 'can\'t login',
      'login problem', 'access denied',
    ],
    sampleQuestions: [
      'I cannot log in.',
      'My password is incorrect.',
      'Why am I unable to access my account?',
    ],
    answer: `Please check your registered email address and password.

**If you have forgotten your password:**
1. Select **Forgot Password**.
2. Enter your registered email.
3. Follow the password-reset instructions.

If the issue continues, contact our support team.`,
  },
  {
    id: 'PASSWORD_RESET',
    category: 'registration',
    keywords: [
      'forgot password', 'reset password', 'change password', 'recover account',
      'password recovery', 'new password',
    ],
    sampleQuestions: [
      'I forgot my password.',
      'How do I reset my password?',
    ],
    answer: `You can reset your password using the **Forgot Password** option on the login page.

A password-reset link or verification code will be sent to your registered email, depending on the portal configuration.`,
  },

  // ── Category 2: Internship Designations ───────────────────────────────────
  {
    id: 'AVAILABLE_DESIGNATIONS',
    category: 'designations',
    keywords: [
      'designation', 'internship role', 'technology', 'course', 'java',
      'full stack', 'dotnet', '.net', 'devops', 'career track', 'available internship',
      'which internship', 'internship tracks', 'technologies',
    ],
    sampleQuestions: [
      'Which internships are available?',
      'Do you provide Java internships?',
      'Is DevOps internship available?',
      'Can I select Full Stack Development?',
    ],
    answer: `We offer technical internship tracks across multiple IT designations, including:

1. **Java Developer**
2. **Full Stack Developer**
3. **.NET Developer**
4. **DevOps Engineer**
5. Other technical designations as published in the internship catalog.

You can explore available designations from the **Internship Catalog** and select the track that matches your career interests.`,
  },
  {
    id: 'DESIGNATION_SELECTION',
    category: 'designations',
    keywords: [
      'select designation', 'choose technology', 'change designation',
      'internship role selection', 'pick designation', 'switch designation',
    ],
    sampleQuestions: [
      'How do I select a designation?',
      'Can I change my selected technology?',
    ],
    answer: `You can select your preferred designation after logging in.

Once selected, you will be directed to a designation-specific assessment consisting of **15 questions**. Your assessment result will determine your eligible discount according to the current discount policy.

Please review your selection before starting the assessment.`,
  },

  // ── Category 3: Assessment ────────────────────────────────────────────────
  {
    id: 'ASSESSMENT_DETAILS',
    category: 'assessment',
    keywords: [
      'assessment', 'test', 'exam', 'questions', '15 questions', 'aptitude',
      'technical test', 'quiz', 'assessment details', 'how many questions',
    ],
    sampleQuestions: [
      'How many questions are there?',
      'Is the assessment mandatory?',
      'What type of questions will be asked?',
    ],
    answer: `Our internship assessment consists of **15 questions** based on your selected technical designation.

The assessment is designed to evaluate your basic understanding of the selected technology.

Your score determines your eligible internship discount.`,
  },
  {
    id: 'ASSESSMENT_SCORING',
    category: 'assessment',
    keywords: [
      'score', 'marks', 'result', 'discount score', 'assessment result',
      'percentage', 'scoring', 'how scoring works', 'grading',
    ],
    sampleQuestions: [
      'How is my score calculated?',
      'What score do I need for a discount?',
    ],
    answer: `Your assessment contains **15 questions**. Your final score determines your discount according to the admin-configured discount slabs.

**Illustrative default slabs:**
- **15/15:** 20% discount
- **10–14/15:** 10% discount
- **8–9/15:** 5% discount
- **0–7/15:** No discount

The applicable discount will be displayed on your result page.`,
  },
  {
    id: 'ASSESSMENT_RETAKE',
    category: 'assessment',
    keywords: [
      'retake', 'retry', 'reattempt', 'second attempt', 'test again',
      'redo assessment', 'another chance', 'multiple attempts',
    ],
    sampleQuestions: [
      'Can I retake the assessment?',
      'How many attempts do I get?',
    ],
    answer: `Assessment attempts are controlled by the portal's assessment policy. By default, **one attempt** is allowed for each designation.

Please contact support if you believe your attempt was interrupted by a technical issue.`,
  },
  {
    id: 'ASSESSMENT_TECHNICAL_ISSUE',
    category: 'assessment',
    keywords: [
      'test crashed', 'assessment disconnected', 'internet issue',
      'question not loading', 'submission failed', 'assessment error',
      'test not working', 'assessment stuck',
    ],
    sampleQuestions: [
      'My assessment crashed during the test.',
      'The questions are not loading.',
    ],
    answer: `We are sorry for the inconvenience.

Please **do not** repeatedly submit the assessment. Contact support with your:
- Registered email
- Selected designation
- Description of the issue

Our team will verify your assessment status and guide you.`,
  },

  // ── Category 4: Discounts & Pricing ───────────────────────────────────────
  {
    id: 'DISCOUNT_ELIGIBILITY',
    category: 'discounts',
    keywords: [
      'discount', 'scholarship', 'offer', 'concession', 'discount eligibility',
      'score discount', 'how to get discount', 'merit discount',
    ],
    sampleQuestions: [
      'How can I get a discount?',
      'Is there any scholarship?',
      'How much discount will I receive?',
    ],
    answer: `You can qualify for an internship discount by completing the **15-question assessment**.

Your eligible discount is calculated automatically based on your score and the current discount policy.

The final discount will be visible on your result and payment pages.`,
  },
  {
    id: 'INTERNSHIP_FEES',
    category: 'discounts',
    keywords: [
      'fees', 'price', 'cost', 'charges', 'internship amount', 'payment amount',
      'how much', 'pricing', 'tuition', 'fee structure',
    ],
    sampleQuestions: [
      'What are the internship fees?',
      'How much does the internship cost?',
    ],
    answer: `Internship fees depend on your selected designation, duration and applicable pricing configuration.

Your eligible assessment discount will be deducted from the applicable base price.

You can view the **final payable amount** before proceeding to payment.`,
  },
  {
    id: 'DISCOUNT_NOT_APPLIED',
    category: 'discounts',
    keywords: [
      'discount missing', 'discount not applied', 'wrong price', 'incorrect amount',
      'offer not showing', 'discount issue', 'price wrong',
    ],
    sampleQuestions: [
      'My discount is not showing.',
      'The price seems incorrect.',
    ],
    answer: `Please check your assessment result and selected internship plan.

If the discount is still not reflected, contact support with your:
- Assessment result
- Enrollment details

Our team will verify the pricing calculation.`,
  },

  // ── Category 5: Internship Duration ───────────────────────────────────────
  {
    id: 'AVAILABLE_DURATION',
    category: 'duration',
    keywords: [
      'duration', 'internship period', 'one month', 'two months', 'three months',
      'four months', 'six months', 'how long', 'internship length', 'months',
    ],
    sampleQuestions: [
      'What internship durations are available?',
      'Can I choose a six-month internship?',
      'Is a one-month internship available?',
    ],
    answer: `We offer the following internship durations:

- **1 Month**
- **2 Months**
- **3 Months**
- **4 Months**
- **6 Months**

The available plans and pricing are displayed in the internship selection section.`,
  },
  {
    id: 'EARLY_COMPLETION',
    category: 'duration',
    keywords: [
      'early completion', 'finish early', 'fast track', 'complete quickly',
      'accelerated', 'ahead of schedule', 'complete faster',
    ],
    sampleQuestions: [
      'Can I finish the internship early?',
      'Is fast-track completion possible?',
    ],
    answer: `Yes! Our internship workflow supports completion based on task progress and successful validation.

You can complete eligible tasks **ahead of their nominal schedule**, provided all mandatory prerequisites, submissions, validations and reviews are completed.

The certificate will be issued only after all required completion criteria are satisfied.`,
  },
  {
    id: 'CHANGE_DURATION',
    category: 'duration',
    keywords: [
      'change duration', 'upgrade plan', 'extend internship', 'modify period',
      'switch plan', 'extend duration',
    ],
    sampleQuestions: [
      'Can I change my internship duration?',
      'How do I extend my internship?',
    ],
    answer: `Duration changes are subject to enrollment and administrative policies.

Please contact support with your **Enrollment ID** and requested duration change. Our team will check the available options.`,
  },

  // ── Category 6: Project Domains ───────────────────────────────────────────
  {
    id: 'AVAILABLE_DOMAINS',
    category: 'domains',
    keywords: [
      'domain', 'project domain', 'banking', 'healthcare', 'telecom',
      'insurance', 'lms', 'industry project', 'which domain', 'available domains',
    ],
    sampleQuestions: [
      'Which domains are available?',
      'Do you provide banking projects?',
      'Can I select healthcare?',
    ],
    answer: `Our internship projects are designed around practical business domains, including:

1. **Banking**
2. **Healthcare**
3. **Telecom**
4. **Insurance**
5. **Learning Management System (LMS)**
6. Additional domains as published in the portal.

You can select your preferred domain while configuring your internship plan.`,
  },
  {
    id: 'DOMAIN_VS_DESIGNATION',
    category: 'domains',
    keywords: [
      'difference between domain and designation', 'technology vs domain',
      'domain designation difference', 'project selection',
    ],
    sampleQuestions: [
      'What is the difference between domain and designation?',
      'How do domain and technology differ?',
    ],
    answer: `A **designation** defines your technical role, whereas a **domain** defines the business environment in which you will apply your skills.

**Example:**
- **Designation:** Java Developer
- **Domain:** Banking
- **Project:** Banking Transaction Management System

This combination allows you to gain both technical and domain-specific experience.`,
  },

  // ── Category 7: Payment & Terms ───────────────────────────────────────────
  {
    id: 'PAYMENT_PROCESS',
    category: 'payment',
    keywords: [
      'payment', 'online payment', 'pay fees', 'checkout', 'payment gateway',
      'transaction', 'how to pay', 'make payment',
    ],
    sampleQuestions: [
      'How do I make a payment?',
      'What is the payment process?',
    ],
    answer: `Once you select your internship duration and domain:

1. Review your final internship price.
2. Read and accept the **Terms and Conditions**.
3. Proceed to the payment gateway.
4. Complete the transaction.
5. Wait for payment verification.

Once your payment is successfully verified, your internship schedule and learning resources will be unlocked.`,
  },
  {
    id: 'PAYMENT_FAILED',
    category: 'payment',
    keywords: [
      'payment failed', 'transaction failed', 'money deducted', 'payment error',
      'pending payment', 'payment stuck', 'double charged',
    ],
    sampleQuestions: [
      'My payment failed.',
      'Money was deducted but enrollment is not active.',
    ],
    answer: `If your payment has failed or the amount has been deducted without enrollment activation, please **avoid making repeated payments** immediately.

Share the following with support:
- Registered email address
- Enrollment or order ID
- Transaction reference
- Payment date and approximate time

Our team will verify the payment status with the payment provider.`,
  },
  {
    id: 'PAYMENT_SUCCESS_BUT_LOCKED',
    category: 'payment',
    keywords: [
      'payment successful', 'schedule locked', 'payment done', 'not activated',
      'access denied after payment', 'paid but locked',
    ],
    sampleQuestions: [
      'I paid successfully but my schedule is locked.',
      'Payment is done but internship is not activated.',
    ],
    answer: `Your payment may still be undergoing verification or enrollment activation.

Please **refresh your dashboard** after a short interval.

If the schedule remains locked, contact support with your **payment order ID**. Our team will verify the transaction.`,
  },
  {
    id: 'REFUND_POLICY',
    category: 'payment',
    keywords: [
      'refund', 'cancellation', 'money back', 'refund request', 'no refund',
      'cancellation policy', 'cancel enrollment',
    ],
    sampleQuestions: [
      'Can I get a refund?',
      'What is the cancellation policy?',
    ],
    answer: `Please review the **Terms and Conditions** displayed before payment.

The applicable refund and cancellation policy will be presented there before you confirm your purchase.

For a specific refund or cancellation request, contact our support team for review under the applicable policy and law.`,
  },

  // ── Category 8: Schedule & SOP ────────────────────────────────────────────
  {
    id: 'DAILY_SCHEDULE',
    category: 'schedule',
    keywords: [
      'schedule', 'daily schedule', 'timetable', 'internship calendar',
      'day wise plan', 'daily tasks', 'routine', 'weekly plan',
    ],
    sampleQuestions: [
      'Where can I find my daily schedule?',
      'How does the internship calendar work?',
    ],
    answer: `After successful payment verification, you can access your assigned internship schedule.

The schedule contains day-wise activities, learning objectives, project tasks and submission requirements.

Open **Student Dashboard → My Internship → Schedule** to explore the activities.`,
  },
  {
    id: 'FIRST_WEEK_ACTIVITY',
    category: 'schedule',
    keywords: [
      'first week', 'week one', 'debugging', 'code merging', 'git', 'merge conflict',
      'sop', 'initial activities', 'getting started', 'onboarding',
    ],
    sampleQuestions: [
      'What happens in the first week?',
      'What are the initial activities?',
    ],
    answer: `The first week is dedicated to common software engineering practices.

**Activities include:**
- Understanding project repository structure
- Basic code debugging
- Identifying and fixing defects
- Git branching and merging
- Resolving merge conflicts
- Understanding code review and SOPs
- Basic validation and testing

These foundational activities prepare you for the domain-specific project.`,
  },
  {
    id: 'SOP_ACCESS',
    category: 'schedule',
    keywords: [
      'sop', 'standard operating procedure', 'process document', 'sop download',
      'learning material', 'study material', 'documentation',
    ],
    sampleQuestions: [
      'How do I access the SOPs?',
      'Can I download the learning materials?',
    ],
    answer: `SOPs are available through your authenticated internship dashboard.

You can read the assigned SOPs inside the portal. Download functionality is disabled to protect the learning material.`,
  },
  {
    id: 'SCHEDULE_NOT_VISIBLE',
    category: 'schedule',
    keywords: [
      'schedule not visible', 'schedule locked', 'daily tasks missing',
      'timetable unavailable', 'cannot see schedule',
    ],
    sampleQuestions: [
      'My schedule is not visible.',
      'Why can\'t I see my daily tasks?',
    ],
    answer: `Please verify that your payment has been successfully confirmed and your enrollment is active.

If your internship is active but the schedule is unavailable, contact support with your **Enrollment ID**.`,
  },

  // ── Category 9: Tasks & Submissions ───────────────────────────────────────
  {
    id: 'TASK_DETAILS',
    category: 'tasks',
    keywords: [
      'project task', 'daily assignment', 'task instructions', 'practical work',
      'coding assignment', 'task details', 'what is a task',
    ],
    sampleQuestions: [
      'What are the project tasks?',
      'Where can I find task instructions?',
    ],
    answer: `Each internship task contains a problem statement, technical instructions, expected outcome and submission requirements.

You can open your tasks from **Student Dashboard → My Internship → Tasks**.

Complete the assigned activity and submit the required GitHub reference or supporting evidence.`,
  },
  {
    id: 'TASK_SUBMISSION',
    category: 'tasks',
    keywords: [
      'submit task', 'assignment submission', 'upload code', 'github commit',
      'pull request', 'repository', 'how to submit', 'submit work',
    ],
    sampleQuestions: [
      'How do I submit a task?',
      'Where do I upload my code?',
    ],
    answer: `We use **GitHub** for project code submission.

**To submit your task:**
1. Connect your GitHub account.
2. Create or use your assigned project repository.
3. Complete the task and push your code.
4. Copy the relevant commit SHA or pull-request URL.
5. Submit the reference through the task submission section.

Your submission will be checked according to the task acceptance criteria.`,
  },
  {
    id: 'GITHUB_CONNECTION',
    category: 'tasks',
    keywords: [
      'connect github', 'github integration', 'repository access',
      'github account', 'authorization', 'github link', 'link github',
    ],
    sampleQuestions: [
      'How do I connect my GitHub account?',
      'Where do I link my GitHub?',
    ],
    answer: `You can connect your GitHub account from your **Student Dashboard**.

Follow the authorization process and grant only the requested permissions.

After successful connection, you can associate your repository with your internship and submit your code references.`,
  },
  {
    id: 'TASK_REJECTED',
    category: 'tasks',
    keywords: [
      'task rejected', 'submission failed', 'changes requested', 'code review feedback',
      'resubmit', 'task declined', 'fix submission',
    ],
    sampleQuestions: [
      'My task was rejected. What should I do?',
      'How do I fix a rejected submission?',
    ],
    answer: `Your submission may require changes based on automated validation or trainer feedback.

Open the task to review the comments and acceptance criteria.

Make the necessary corrections, push the updated code to GitHub and **resubmit** the relevant commit or pull request.`,
  },
  {
    id: 'TASK_COMPLETION',
    category: 'tasks',
    keywords: [
      'task approved', 'task completed', 'progress percentage', 'next task',
      'unlock task', 'task done', 'task status',
    ],
    sampleQuestions: [
      'My task was approved. What\'s next?',
      'How do I unlock the next task?',
    ],
    answer: `Once your submission satisfies the required validation and review criteria, the task will be marked as **Approved**.

Your next eligible task will become available according to its prerequisites.`,
  },

  // ── Category 10: Mentorship & Support ─────────────────────────────────────
  {
    id: 'MENTOR_SUPPORT',
    category: 'mentorship',
    keywords: [
      'mentor', 'trainer', 'instructor', 'guidance', 'doubt solving',
      'technical support', 'ask mentor', 'mentor help',
    ],
    sampleQuestions: [
      'How do I contact my mentor?',
      'Who reviews my work?',
    ],
    answer: `Our internship model supports self-paced learning along with mentor guidance.

You can raise technical queries through the available support or task-review mechanism.

Your assigned trainer can review submissions and provide feedback according to the internship plan.`,
  },
  {
    id: 'CODE_REVIEW',
    category: 'mentorship',
    keywords: [
      'code review', 'code verification', 'trainer feedback', 'pull request review',
      'code quality', 'review process', 'pr review',
    ],
    sampleQuestions: [
      'How does the code review process work?',
      'Who checks my code quality?',
    ],
    answer: `Your code may undergo automated validation and trainer review, depending on the task configuration.

Feedback will be available against the relevant task in your dashboard.

Use that feedback to improve your implementation before resubmitting.`,
  },
  {
    id: 'CONTACT_SUPPORT',
    category: 'mentorship',
    keywords: [
      'contact support', 'help', 'customer support', 'technical issue',
      'complaint', 'assistance', 'support email', 'help desk',
    ],
    sampleQuestions: [
      'How do I contact support?',
      'I need help with an issue.',
    ],
    answer: `We are here to help!

Please share your registered email address, enrollment ID and a short description of your issue through the portal's support section.

⚠️ For security, **never share** your password, OTP or GitHub access token.`,
  },

  // ── Category 11: Certificate ──────────────────────────────────────────────
  {
    id: 'CERTIFICATE_ELIGIBILITY',
    category: 'certificate',
    keywords: [
      'certificate', 'internship certificate', 'eligibility', 'completion certificate',
      'certificate requirements', 'when certificate', 'get certificate',
    ],
    sampleQuestions: [
      'How do I get my certificate?',
      'What are the certificate requirements?',
    ],
    answer: `Your internship completion certificate is generated after you satisfy all mandatory completion criteria.

**These generally include:**
- Completion of mandatory tasks
- Successful project validations
- Required trainer approvals
- Valid and active enrollment

Your certificate eligibility will be visible in your dashboard.`,
  },
  {
    id: 'CERTIFICATE_DOWNLOAD',
    category: 'certificate',
    keywords: [
      'download certificate', 'certificate pdf', 'certificate not received',
      'certificate email', 'get certificate file',
    ],
    sampleQuestions: [
      'How do I download my certificate?',
      'Will I receive the certificate by email?',
    ],
    answer: `Once your internship is successfully completed, your certificate will be generated automatically.

A copy will be sent to your registered email address. You can also download it from **Student Dashboard → Certificates**.`,
  },
  {
    id: 'CERTIFICATE_NOT_RECEIVED',
    category: 'certificate',
    keywords: [
      'certificate not received', 'email missing', 'certificate pending',
      'certificate generation failed', 'where is my certificate',
    ],
    sampleQuestions: [
      'I haven\'t received my certificate.',
      'My certificate is pending.',
    ],
    answer: `Please check your inbox, spam and promotions folders.

If your certificate is eligible but has not arrived, check its status in your dashboard.

If the issue persists, contact support with your **Enrollment ID**.`,
  },
  {
    id: 'CERTIFICATE_VERIFICATION',
    category: 'certificate',
    keywords: [
      'verify certificate', 'certificate authenticity', 'certificate id',
      'certificate validation', 'check certificate', 'is certificate valid',
    ],
    sampleQuestions: [
      'How do I verify a certificate?',
      'Can employers verify my certificate?',
    ],
    answer: `Each issued certificate contains a **unique certificate identification number**.

Use the **Certificate Verification** page and enter the certificate ID to check its authenticity and current status.`,
  },

  // ── Category 12: General ──────────────────────────────────────────────────
  {
    id: 'ABOUT_INTERNSHIP',
    category: 'general',
    keywords: [
      'about internship', 'internship details', 'practical internship',
      'real project', 'work experience', 'what is this', 'tell me about',
    ],
    sampleQuestions: [
      'Tell me about this internship.',
      'What kind of internship is this?',
    ],
    answer: `Our internship platform focuses on **practical, project-based learning**.

Students work on structured technical tasks, understand real-world development workflows, submit code through GitHub and receive feedback based on configured evaluation criteria.`,
  },
  {
    id: 'INTERNSHIP_BENEFITS',
    category: 'general',
    keywords: [
      'benefits', 'advantages', 'skills', 'portfolio', 'practical experience',
      'career', 'what will i learn', 'why join',
    ],
    sampleQuestions: [
      'What are the benefits of this internship?',
      'What will I learn?',
    ],
    answer: `The internship is designed to help you:

- ✅ Apply technical knowledge to practical projects
- ✅ Understand debugging and code-merging workflows
- ✅ Work with GitHub repositories
- ✅ Build a project portfolio
- ✅ Understand domain-specific business requirements
- ✅ Receive structured feedback
- ✅ Obtain a completion certificate after meeting the requirements`,
  },
];

// ─── Greeting & Closing ─────────────────────────────────────────────────────

export const GREETING_MESSAGE = `Hello! 👋 Welcome to **ALFRE Internship Portal**.

I'm here to assist you with registration, assessments, discount slabs, task submissions, mentor reviews, and certificates.

**How can I help you today?** Choose a topic below or type your question:`;

export const CLOSING_MESSAGE = `You're welcome! Glad I could help. 😊

Keep learning, keep building and keep progressing with your internship.

**Best wishes for your career journey!** 🚀`;

export const UNKNOWN_MESSAGE = `I couldn't find an exact answer to your question. 🤔

Please try asking in a different way or select one of the available categories.

If you need personal assistance, I can guide you to our **support team**.`;

export const CLOSING_KEYWORDS = [
  'thank you', 'thanks', 'thankyou', 'goodbye', 'bye', 'solved',
  'got it', 'that helps', 'ok thanks', 'thank',
];

