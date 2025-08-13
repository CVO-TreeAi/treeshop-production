import type { 
  SiteSettings, 
  PricingPackage, 
  Service, 
  LegalTerms,
  ProposalTemplate 
} from '@/types/proposals';

export const sampleSiteSettings: SiteSettings = {
  business: {
    name: "TreeAI Professional Services",
    address: "123 Forest Drive, Orlando, FL 32801",
    phone: "(555) 123-4567",
    email: "info@treeai.us",
    website: "https://treeai.us",
    licenseNumber: "FL-TREE-2024-001"
  },
  branding: {
    logoUrl: "/treeshop/images/branding/treeai-logo-florida-forestry-services.jpg",
    primaryColor: "#16a34a",
    secondaryColor: "#22c55e",
    accentColor: "#15803d"
  },
  marketing: {
    tagline: "AI-Powered Land Clearing Excellence",
    description: "Professional forestry mulching and land clearing services throughout Florida",
    socialProof: [
      "500+ Projects Completed",
      "Licensed & Insured",
      "30-Day Guarantee",
      "AI-Powered Estimates"
    ]
  },
  pdfStyles: {
    format: "letter",
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    typeScale: {
      h1: 24,
      h2: 18,
      h3: 14,
      body: 10,
      small: 8
    },
    accentColor: "#16a34a",
    fonts: {
      primary: "Inter",
      secondary: "Manrope"
    }
  },
  flags: {
    enableDeposits: true,
    requireSignature: true,
    defaultTTL: 30
  }
};

export const samplePricingPackages: PricingPackage[] = [
  {
    id: "light",
    label: "Light Vegetation",
    dbh: "trees up to 4\" DBH",
    pricePerAcre: 1200,
    description: "Ideal for light brush, saplings, and small trees",
    isDefault: false,
    inclusions: [
      "Brush and sapling clearing",
      "Trees up to 4 inches diameter",
      "Basic site cleanup",
      "Mulch left on site"
    ],
    exclusions: [
      "Large trees over 4\" DBH",
      "Rock removal",
      "Stump grinding"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "medium",
    label: "Medium Vegetation",
    dbh: "trees up to 6\" DBH",
    pricePerAcre: 1500,
    description: "Perfect for mixed vegetation with medium-sized trees",
    isDefault: true,
    inclusions: [
      "Brush, saplings, and trees",
      "Trees up to 6 inches diameter",
      "Thorough site cleanup",
      "Mulch distribution"
    ],
    exclusions: [
      "Large trees over 6\" DBH",
      "Wetland clearing",
      "Special permits"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "heavy",
    label: "Heavy Vegetation",
    dbh: "trees up to 8\" DBH",
    pricePerAcre: 1800,
    description: "For dense forests and larger trees",
    isDefault: false,
    inclusions: [
      "Dense vegetation clearing",
      "Trees up to 8 inches diameter",
      "Complete site preparation",
      "Professional mulch finishing"
    ],
    exclusions: [
      "Trees over 8\" DBH",
      "Hazardous tree removal",
      "Environmental permits"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleServices: Service[] = [
  {
    id: "stump-grinding",
    name: "Stump Grinding",
    description: "Professional stump removal and grinding",
    defaultRate: 125,
    unit: "per_stump",
    category: "grinding",
    inclusions: ["Stump grinding below grade", "Debris cleanup", "Wood chip removal"],
    exclusions: ["Root removal", "Soil replacement"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "site-cleanup",
    name: "Additional Site Cleanup",
    description: "Extra cleanup and debris removal",
    defaultRate: 750,
    unit: "flat_rate",
    category: "clearing",
    inclusions: ["Complete debris removal", "Site grading", "Final inspection"],
    exclusions: ["Concrete removal", "Underground utilities"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "travel-surcharge",
    name: "Travel Surcharge",
    description: "Equipment transport and mobilization",
    defaultRate: 300,
    unit: "flat_rate",
    category: "other",
    inclusions: ["Equipment delivery", "Setup time", "Return transport"],
    exclusions: ["Overtime charges", "Emergency callout"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "tree-removal",
    name: "Selective Tree Removal",
    description: "Individual tree cutting and removal",
    defaultRate: 200,
    unit: "per_tree",
    category: "removal",
    inclusions: ["Tree cutting", "Log sectioning", "Branch cleanup"],
    exclusions: ["Stump grinding", "Root removal", "Crane work"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleLegalTerms: LegalTerms[] = [
  {
    id: "standard-terms",
    title: "Standard Terms and Conditions",
    bodyRich: `
      <h3>Payment Terms</h3>
      <p>A 20% deposit is required to secure your project date. Final payment is due upon completion of work unless other arrangements have been made in writing.</p>
      
      <h3>Weather and Scheduling</h3>
      <p>Weather conditions may affect project scheduling. We will reschedule as needed at no additional cost.</p>
      
      <h3>Site Preparation</h3>
      <p>Customer is responsible for marking all underground utilities, property lines, and areas to be protected prior to work commencement.</p>
      
      <h3>Warranty</h3>
      <p>All work is guaranteed for 30 days from completion date. This warranty covers workmanship but does not include natural regrowth.</p>
      
      <h3>Limitations</h3>
      <p>Estimates are based on visible conditions. Additional charges may apply for unforeseen obstacles, hazardous materials, or site access issues.</p>
    `,
    shortDisclosure: "Standard terms and conditions apply to all projects",
    disclaimers: [
      "Prices subject to site inspection confirmation",
      "Permits and environmental clearances are customer's responsibility",
      "TreeAI Professional Services is licensed and insured in Florida"
    ],
    version: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleProposalTemplate: ProposalTemplate = {
  id: "standard-template-v1",
  name: "Standard Proposal Template",
  description: "Default two-page proposal template for forestry mulching projects",
  status: "active",
  version: 1,
  blocks: {
    "header": {
      id: "header",
      type: "header",
      title: "Company Header",
      content: {
        showLogo: true,
        showContactInfo: true,
        showLicense: true,
        title: "PROJECT PROPOSAL"
      },
      order: 1,
      isRequired: true,
      isVisible: true
    },
    "customer-info": {
      id: "customer-info",
      type: "custom",
      title: "Customer Information",
      content: {
        fields: ["name", "address", "acreage", "obstacles"]
      },
      order: 2,
      isRequired: true,
      isVisible: true
    },
    "project-summary": {
      id: "project-summary",
      type: "about",
      title: "Project Summary",
      content: {
        template: "Land clearing and forestry mulching for {{acreage}} acres. Trees up to {{packageDbh}} included. Professional equipment and experienced operators with site cleanup and final grading included."
      },
      order: 3,
      isRequired: true,
      isVisible: true
    },
    "services": {
      id: "services",
      type: "services",
      title: "Services & Pricing",
      content: {
        showBreakdown: true,
        showTotals: true,
        showDeposit: true
      },
      order: 4,
      isRequired: true,
      isVisible: true
    },
    "terms": {
      id: "terms",
      type: "terms",
      title: "Terms & Conditions",
      content: {
        termsId: "standard-terms",
        showBulletPoints: true
      },
      order: 5,
      isRequired: true,
      isVisible: true
    },
    "signature": {
      id: "signature",
      type: "signature",
      title: "Customer Approval",
      content: {
        showSignatureLine: true,
        showDateLine: true,
        showWebApprovalNote: true
      },
      order: 6,
      isRequired: true,
      isVisible: true
    }
  },
  history: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "system"
};