// TreeShop Business Data - Real Company Information
// Updated for TreeShop Terminal consistency

export const TREESHOP_BUSINESS_DATA = {
  company: {
    name: "TreeShop",
    fullName: "FL TreeShop LLC",
    location: "New Smyrna Beach, FL",
    serviceArea: "Central Florida",
    established: "2018",
    website: "treeshopterminal.com",
    phone: "(386) 427-3455",
    email: "info@fltreeshop.com",
    adminEmail: "office@fltreeshop.com"
  },

  // Current Active Projects
  activeProjects: [
    {
      projectNumber: "TSH-2025-001",
      customerName: "Heritage Oaks Development LLC",
      propertyAddress: "1247 Heritage Oak Dr, New Smyrna Beach, FL 32168",
      packageType: "Premium Land Clearing",
      workAreaAcreage: 12.5,
      totalValue: 202500, // $16,200/acre x 12.5 acres
      status: "in_progress",
      progress: 35,
      phase: "Primary Clearing"
    },
    {
      projectNumber: "TSH-2025-002", 
      customerName: "Riverfront Estates Group",
      propertyAddress: "892 Riverfront Blvd, Edgewater, FL 32132",
      packageType: "Standard Land Clearing",
      workAreaAcreage: 8.3,
      totalValue: 134460,
      status: "scheduled",
      progress: 0,
      phase: "Pre-Survey Complete"
    },
    {
      projectNumber: "TSH-2025-003",
      customerName: "Oak Ridge Commons HOA", 
      propertyAddress: "156 Oak Ridge Pkwy, Port Orange, FL 32129",
      packageType: "Forestry Mulching",
      workAreaAcreage: 6.2,
      totalValue: 100440,
      status: "scheduled", 
      progress: 0,
      phase: "Site Assessment"
    }
  ],

  // Business KPIs (Current Month)
  kpis: {
    totalLeads: 47,
    qualifiedLeads: 23,
    activeProjects: 3,
    completedProjects: 8,
    monthlyRevenue: 485750,
    averageProjectValue: 145500,
    conversionRate: 48.9,
    activeCrew: 3,
    totalAcresCleared: 127.3,
    customerSatisfaction: 98.2
  },

  // Equipment Fleet
  equipment: [
    {
      name: "CAT 299d3 Fecon Blackhawk",
      type: "Track Loader w/ Forestry Mulcher",
      status: "active",
      operator: "Alex Thompson"
    },
    {
      name: "2023 Ford F-450 Lariat Ultimate",
      type: "Heavy Duty Truck (HoneyBadger)", 
      status: "active",
      operator: "Mike Rodriguez"
    }
  ],

  // Current Crew Members
  crewMembers: [
    {
      name: "Alex Thompson",
      role: "Lead Operations Manager", 
      isActive: true,
      equipment: "CAT 299d3 w/ Fecon Blackhawk",
      currentProject: "Heritage Oaks Development"
    },
    {
      name: "Mike Rodriguez",
      role: "Equipment Operator",
      isActive: true,
      equipment: "2023 Ford F-450 (HoneyBadger)",
      currentProject: "Riverfront Estates"
    },
    {
      name: "Sarah Martinez",
      role: "Site Supervisor",
      isActive: true,
      equipment: "Mobile Command Unit", 
      currentProject: "Oak Ridge Commons"
    }
  ],

  // Service Packages & Pricing
  pricing: {
    baseRate: 16200, // $16,200 per acre (standard clearing)
    lightClearing: 12000, // $12,000 per acre (minimal vegetation)
    premiumService: 19500, // $19,500 per acre (full service with debris removal)
    
    // Current project calculations
    currentProjectValues: {
      heritageOaks: 202500, // 12.5 acres × $16,200 = $202,500
      riverfrontEstates: 134460, // 8.3 acres × $16,200 = $134,460
      oakRidgeCommons: 100440 // 6.2 acres × $16,200 = $100,440
    }
  }
};

// Utility functions for business data
export const getActiveProjectsCount = () => {
  return TREESHOP_BUSINESS_DATA.activeProjects.filter(
    project => project.status === 'in_progress'
  ).length;
};

export const getTotalProjectValue = () => {
  return TREESHOP_BUSINESS_DATA.activeProjects.reduce(
    (total, project) => total + project.totalValue, 0
  );
};

export const getProjectsByStatus = (status: string) => {
  return TREESHOP_BUSINESS_DATA.activeProjects.filter(
    project => project.status === status
  );
};

export const getActiveCrewMembers = () => {
  return TREESHOP_BUSINESS_DATA.crewMembers.filter(
    member => member.isActive
  );
};

// Contact information helpers
export const getContactInfo = () => ({
  phone: TREESHOP_BUSINESS_DATA.company.phone,
  email: TREESHOP_BUSINESS_DATA.company.email,
  location: TREESHOP_BUSINESS_DATA.company.location,
  serviceArea: TREESHOP_BUSINESS_DATA.company.serviceArea
});

export default TREESHOP_BUSINESS_DATA;