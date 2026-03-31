export const tiers = [
  {
    id: 'tier-registered',
    name: 'Registered',
    requirements: 'Signed partner agreement and completed onboarding training.',
    benefits: [
      'Access to partner portal and deal registration',
      'Standard partner discount on all products',
      'Access to sales and marketing resources',
      'Partner support via email',
    ],
    discount: '15%',
    color: '#6B7280',
  },
  {
    id: 'tier-silver',
    name: 'Silver',
    requirements: '$100,000+ annual revenue and 1 certified sales rep.',
    benefits: [
      'All Registered benefits',
      'Enhanced partner discount',
      'Co-marketing MDF allocation ($2,500/quarter)',
      'Quarterly business review with partner manager',
      'Lead sharing from Recast marketing campaigns',
    ],
    discount: '20%',
    color: '#9CA3AF',
  },
  {
    id: 'tier-gold',
    name: 'Gold',
    requirements: '$250,000+ annual revenue, 2 certified sales reps, and 1 certified technical resource.',
    benefits: [
      'All Silver benefits',
      'Premium partner discount',
      'Increased MDF allocation ($5,000/quarter)',
      'Priority deal registration with extended protection',
      'Access to beta programs and roadmap briefings',
      'Dedicated partner account manager',
      'Joint customer references and case studies',
    ],
    discount: '25%',
    color: '#F59E0B',
  },
  {
    id: 'tier-platinum',
    name: 'Platinum',
    requirements: '$500,000+ annual revenue, 3 certified sales reps, 2 certified technical resources, and executive sponsor alignment.',
    benefits: [
      'All Gold benefits',
      'Maximum partner discount',
      'Premium MDF allocation ($10,000/quarter)',
      'Executive-level strategic planning sessions',
      'Custom co-branded solutions and integrations',
      'First access to new product launches',
      'Annual partner summit VIP experience',
      'Performance-based bonus rebates',
    ],
    discount: '30%',
    color: '#8B5CF6',
  },
];

export const mdfData = {
  balance: 7500,
  pending: 2000,
  approved: 3500,
  claims: [
    {
      id: 'mdf-001',
      activity: 'Q1 ConfigMgr Optimization Webinar Series',
      amount: 2000,
      status: 'pending',
      submittedDate: '2026-03-25',
      description: 'Three-part webinar series targeting ConfigMgr administrators. Co-branded with TechForward Solutions branding. Expected 150 registrants.',
    },
    {
      id: 'mdf-002',
      activity: 'Regional IT Leaders Lunch & Learn',
      amount: 1500,
      status: 'approved',
      submittedDate: '2026-02-15',
      approvedDate: '2026-02-22',
      description: 'In-person lunch and learn event for 25 IT directors in the Chicago metro area. Covered venue, catering, and printed materials.',
    },
    {
      id: 'mdf-003',
      activity: 'Endpoint Management Email Campaign',
      amount: 1000,
      status: 'approved',
      submittedDate: '2026-01-10',
      approvedDate: '2026-01-17',
      description: 'Targeted email campaign to 2,500 ConfigMgr admins from our database. Used co-branded Recast templates with custom content.',
    },
    {
      id: 'mdf-004',
      activity: 'Midwest IT Expo Booth Sponsorship',
      amount: 2000,
      status: 'approved',
      submittedDate: '2025-11-20',
      approvedDate: '2025-12-01',
      description: 'Bronze booth sponsorship at Midwest IT Expo 2025. Included booth space, lead scanner, and branded giveaways.',
    },
  ],
};

export const rebateData = {
  currentTier: 'Gold',
  rate: '5%',
  quarters: [
    { quarter: 'Q1 2026', revenue: 123000, rebateEarned: 6150, status: 'in_progress' },
    { quarter: 'Q4 2025', revenue: 145000, rebateEarned: 7250, status: 'paid' },
    { quarter: 'Q3 2025', revenue: 98000, rebateEarned: 4900, status: 'paid' },
    { quarter: 'Q2 2025', revenue: 112000, rebateEarned: 5600, status: 'paid' },
  ],
};

export const leaderboard = [
  { rank: 1, company: 'CloudBridge Technologies', revenue: 892000, tier: 'Platinum', deals: 34 },
  { rank: 2, company: 'Apex IT Solutions', revenue: 745000, tier: 'Platinum', deals: 28 },
  { rank: 3, company: 'NexGen Consulting Group', revenue: 623000, tier: 'Platinum', deals: 25 },
  { rank: 4, company: 'Ironwood Systems', revenue: 510000, tier: 'Platinum', deals: 21 },
  { rank: 5, company: 'TechForward Solutions', revenue: 478000, tier: 'Gold', deals: 18 },
  { rank: 6, company: 'Meridian IT Partners', revenue: 395000, tier: 'Gold', deals: 16 },
  { rank: 7, company: 'Stratosphere Digital', revenue: 342000, tier: 'Gold', deals: 14 },
  { rank: 8, company: 'Redstone Managed Services', revenue: 287000, tier: 'Gold', deals: 12 },
  { rank: 9, company: 'Summit Peak Consulting', revenue: 198000, tier: 'Silver', deals: 9 },
  { rank: 10, company: 'Brightpath IT Group', revenue: 156000, tier: 'Silver', deals: 7 },
];
