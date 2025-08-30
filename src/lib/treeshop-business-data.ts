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
    }
  }
};

// Utility functions for real business data only

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