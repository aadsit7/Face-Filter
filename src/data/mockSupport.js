export const faqs = [
  {
    id: 'faq-1',
    question: 'How do I register a new deal in the partner portal?',
    answer:
      'Navigate to the Deals page and click "Register Deal." Fill in the customer name, opportunity details, estimated close date, and deal value. Once submitted, our team reviews registrations within 2 business days and you will receive an email confirmation with your deal protection window.',
  },
  {
    id: 'faq-2',
    question: 'What are the requirements to move up to the next partner tier?',
    answer:
      'Tier advancement is based on annual revenue, number of certified sales reps, and certified technical resources. Silver requires $100K+ revenue and 1 certified rep. Gold requires $250K+ revenue, 2 certified sales reps, and 1 certified technical resource. Platinum requires $500K+ revenue, 3 certified sales reps, 2 certified technical resources, and executive sponsor alignment.',
  },
  {
    id: 'faq-3',
    question: 'How does the Market Development Fund (MDF) program work?',
    answer:
      'MDF funds are allocated quarterly based on your partner tier. Submit a claim through the Incentives page with activity details, expected outcomes, and receipts. Claims are reviewed within 10 business days. Approved funds are disbursed within 30 days of approval. Unused MDF does not roll over to the next quarter.',
  },
  {
    id: 'faq-4',
    question: 'How do I access co-branded marketing materials?',
    answer:
      'Co-branded materials are available on the Marketing page. You can customize templates with your company logo and contact information. Materials include email templates, slide decks, one-pagers, and social media assets. Gold and Platinum partners also have access to custom content creation services.',
  },
  {
    id: 'faq-5',
    question: 'What training certifications are available?',
    answer:
      'We offer three certification tracks: Sales Fundamentals (required for all partner reps), Technical Pre-Sales (for engineers and solution architects), and Advanced Solutions (for senior consultants handling enterprise accounts). Each certification requires completing all modules in the learning path and passing the final assessment with 80% or higher.',
  },
  {
    id: 'faq-6',
    question: 'How are rebates calculated and when are they paid?',
    answer:
      'Rebates are calculated quarterly based on your total recognized revenue and current tier rebate rate. Registered partners earn 2%, Silver earns 3%, Gold earns 5%, and Platinum earns 8%. Rebates are paid within 45 days of quarter close, provided all revenue has been verified and reconciled.',
  },
];

export const partnerManager = {
  name: 'James Thornton',
  title: 'Senior Partner Account Manager',
  email: 'james.thornton@recast.com',
  phone: '+1 (612) 555-0142',
  calendlyLink: 'https://calendly.com/james-thornton-recast/partner-meeting',
  initials: 'JT',
};

export const seedTickets = [
  {
    id: 'ticket-001',
    subject: 'Deal registration not showing approved status',
    category: 'deal_support',
    priority: 'high',
    status: 'open',
    description:
      'I registered deal DR-2026-042 last week and received an approval email, but the portal still shows it as pending. Customer is asking for the partner pricing and I need the approved status to generate a quote.',
    createdAt: '2026-03-28T14:30:00Z',
    updatedAt: '2026-03-28T14:30:00Z',
  },
  {
    id: 'ticket-002',
    subject: 'MDF claim reimbursement delayed',
    category: 'billing',
    priority: 'medium',
    status: 'in_progress',
    description:
      'MDF claim mdf-002 was approved on Feb 22 but I have not received the reimbursement yet. It has been over 30 days. Can you check on the payment status?',
    createdAt: '2026-03-25T09:15:00Z',
    updatedAt: '2026-03-26T11:00:00Z',
  },
  {
    id: 'ticket-003',
    subject: 'Need access to Right Click Tools demo environment',
    category: 'technical',
    priority: 'medium',
    status: 'resolved',
    description:
      'I have a customer demo scheduled for next week and need access to the partner demo lab. My previous credentials expired. Can you re-provision my demo environment access?',
    createdAt: '2026-03-20T16:45:00Z',
    updatedAt: '2026-03-22T10:30:00Z',
  },
  {
    id: 'ticket-004',
    subject: 'Question about Platinum tier requirements',
    category: 'general',
    priority: 'low',
    status: 'resolved',
    description:
      'We are close to hitting Platinum tier revenue requirements. Can you clarify whether the revenue threshold is based on calendar year or rolling 12 months? Also, do renewal deals count toward the total?',
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-03-16T13:20:00Z',
  },
];
