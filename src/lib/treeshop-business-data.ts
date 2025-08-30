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

  // Current Active Projects (Updated with Workflow Pricing)
  activeProjects: [
    {
      projectNumber: "TSH-2025-001",
      customerName: "Heritage Oaks Development LLC",
      propertyAddress: "1247 Heritage Oak Dr, New Smyrna Beach, FL 32168",
      packageType: "Large Package (8\" DBH)",
      workAreaAcreage: 12.5,
      totalValue: 42187, // 12.5 acres × $3,375 = $42,187.50
      status: "in_progress",
      progress: 35,
      phase: "Primary Clearing"
    },
    {
      projectNumber: "TSH-2025-002", 
      customerName: "Riverfront Estates Group",
      propertyAddress: "892 Riverfront Blvd, Edgewater, FL 32132",
      packageType: "Medium Package (6\" DBH)",
      workAreaAcreage: 8.3,
      totalValue: 20750, // 8.3 acres × $2,500 = $20,750
      status: "scheduled",
      progress: 0,
      phase: "Pre-Survey Complete"
    },
    {
      projectNumber: "TSH-2025-003",
      customerName: "Oak Ridge Commons HOA", 
      propertyAddress: "156 Oak Ridge Pkwy, Port Orange, FL 32129",
      packageType: "Small Package (4\" DBH)",
      workAreaAcreage: 6.2,
      totalValue: 13175, // 6.2 acres × $2,125 = $13,175
      status: "scheduled", 
      progress: 0,
      phase: "Site Assessment"
    }
  ],

  // Business KPIs (Current Month - Updated for Realistic Pricing)
  kpis: {
    totalLeads: 47,
    qualifiedLeads: 23,
    activeProjects: 3,
    completedProjects: 8,
    monthlyRevenue: 96750, // Updated to reflect realistic project values
    averageProjectValue: 25312, // Updated based on actual pricing ($2,125-$4,250/acre)
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

  // Service Packages & Pricing (Actual Workflow Structure)
  pricing: {
    packages: {
      small: {
        name: "Small Package",
        dbhLimit: "4\" DBH limit",
        pricePerAcre: 2125
      },
      medium: {
        name: "Medium Package", 
        dbhLimit: "6\" DBH limit",
        pricePerAcre: 2500
      },
      large: {
        name: "Large Package",
        dbhLimit: "8\" DBH limit", 
        pricePerAcre: 3375
      },
      xLarge: {
        name: "X-Large Package",
        dbhLimit: "10\" DBH limit",
        pricePerAcre: 4250
      },
      max: {
        name: "Max Package",
        dbhLimit: "Land clearing",
        pricePerDay: 4500 // 15-ton excavator + skid steer
      }
    },
    
    additionalServices: {
      debrisHauling: 23, // $23/yard
      transport: 150, // $150/hour (round trip)
      projectMinimum: 1900, // $1,900 project minimum
      distanceMinimum: 3500 // $3,500 minimum for 2.5+ hours one-way
    },
    
    formula: {
      calculation: "(Package + Project Size + Transport) × 1.15",
      markup: 1.15
    },
    
    // Updated project calculations with realistic pricing
    currentProjectValues: {
      heritageOaks: 42187, // 12.5 acres × $3,375 (Large Package) = $42,187.50
      riverfrontEstates: 20750, // 8.3 acres × $2,500 (Medium Package) = $20,750
      oakRidgeCommons: 13175 // 6.2 acres × $2,125 (Small Package) = $13,175
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

// Pricing helpers for workflow integration
export const calculateProjectCost = (acres: number, packageType: keyof typeof TREESHOP_BUSINESS_DATA.pricing.packages) => {
  const pkg = TREESHOP_BUSINESS_DATA.pricing.packages[packageType];
  if (packageType === 'max') {
    // Max package is per day, not per acre
    return pkg.pricePerDay;
  }
  return acres * pkg.pricePerAcre;
};

export const getPricingPackages = () => TREESHOP_BUSINESS_DATA.pricing.packages;

export const getInstantQuote = (acres: number, packageType: keyof typeof TREESHOP_BUSINESS_DATA.pricing.packages, transportHours: number = 0) => {
  const baseCost = calculateProjectCost(acres, packageType);
  const transportCost = transportHours * TREESHOP_BUSINESS_DATA.pricing.additionalServices.transport;
  const subtotal = baseCost + transportCost;
  const total = subtotal * TREESHOP_BUSINESS_DATA.pricing.formula.markup;
  
  // Apply minimums
  const { projectMinimum, distanceMinimum } = TREESHOP_BUSINESS_DATA.pricing.additionalServices;
  const finalTotal = Math.max(total, transportHours >= 2.5 ? distanceMinimum : projectMinimum);
  
  return {
    baseCost,
    transportCost,
    subtotal,
    markup: TREESHOP_BUSINESS_DATA.pricing.formula.markup,
    total: finalTotal,
    breakdown: {
      package: `${TREESHOP_BUSINESS_DATA.pricing.packages[packageType].name}`,
      acres,
      pricePerAcre: packageType === 'max' ? 'Per Day' : `$${TREESHOP_BUSINESS_DATA.pricing.packages[packageType].pricePerAcre}`,
      transport: transportHours > 0 ? `${transportHours} hours @ $${TREESHOP_BUSINESS_DATA.pricing.additionalServices.transport}/hr` : 'None'
    }
  };
};

export default TREESHOP_BUSINESS_DATA;