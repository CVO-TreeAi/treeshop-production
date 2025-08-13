// Proposal Templates for TreeAI Forestry Mulching Services

export interface ProposalData {
  // Customer Information
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  
  // Project Details
  projectLocation: string
  serviceType: 'forestry-mulching' | 'land-clearing'
  packageSize: 'small' | 'medium' | 'large'
  acreage: number
  estimatedDays: number
  travelTimeHours: number
  specialConditions?: string
  
  // Pricing
  baseServiceCost: number
  transportCost: number
  totalCost: number
  pricePerAcre: number
  
  // Timeline
  quoteDate: Date
  validUntil: Date
  estimatedStartDate?: Date
  estimatedCompletionDate?: Date
  
  // Business Data
  quotedBy: string
  businessRepresentative: string
  leadId?: string
}

export const SERVICE_RATES = {
  'forestry-mulching': {
    small: { rate: 2250, dbh: '4"', hoursPerAcre: 3.0 },
    medium: { rate: 2500, dbh: '6"', hoursPerAcre: 4.5 },
    large: { rate: 2850, dbh: '8"', hoursPerAcre: 6.0 }
  },
  'land-clearing': {
    small: { rate: 3500, equipment: 'CAT 310', dailyRate: true },
    medium: { rate: 4000, equipment: 'CAT 315', dailyRate: true },
    large: { rate: 5000, equipment: 'CAT 320', dailyRate: true }
  }
}

export const TRANSPORT_RATE = 250 // $250 per hour round trip

export function calculateProposal(data: Partial<ProposalData>): ProposalData {
  const {
    customerName = '',
    customerEmail = '',
    customerPhone = '',
    customerAddress = '',
    projectLocation = '',
    serviceType = 'forestry-mulching',
    packageSize = 'medium',
    acreage = 1,
    estimatedDays = 1,
    travelTimeHours = 0.5,
    specialConditions = '',
    quotedBy = 'TreeAI Sales Team'
  } = data

  const quoteDate = new Date()
  const validUntil = new Date(quoteDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  let baseServiceCost: number
  let projectDays: number

  if (serviceType === 'forestry-mulching') {
    const rate = SERVICE_RATES[serviceType][packageSize].rate
    baseServiceCost = rate * acreage
    projectDays = Math.ceil(acreage / 1.5) // 1.5 acres per day capacity
  } else {
    const rate = SERVICE_RATES[serviceType][packageSize].rate
    baseServiceCost = rate * estimatedDays
    projectDays = estimatedDays
  }

  const dailyTransportCost = travelTimeHours * 2 * TRANSPORT_RATE
  const transportCost = dailyTransportCost * projectDays
  const totalCost = baseServiceCost + transportCost
  const pricePerAcre = totalCost / acreage

  return {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    projectLocation,
    serviceType,
    packageSize,
    acreage,
    estimatedDays,
    travelTimeHours,
    specialConditions,
    baseServiceCost,
    transportCost,
    totalCost,
    pricePerAcre,
    quoteDate,
    validUntil,
    quotedBy,
    businessRepresentative: quotedBy
  }
}

// Customer-facing proposal template
export function generateCustomerProposal(proposal: ProposalData): string {
  const serviceDetails = SERVICE_RATES[proposal.serviceType][proposal.packageSize]
  const isForestryMulching = proposal.serviceType === 'forestry-mulching'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TreeAI Service Proposal - ${proposal.customerName}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .logo { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .tagline { font-size: 1.1em; opacity: 0.9; }
        .section { background: #f8f9fa; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #22c55e; }
        .section h2 { color: #16a34a; margin-top: 0; }
        .price-highlight { background: #22c55e; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 1.2em; margin: 20px 0; }
        .breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .breakdown-item { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 20px; color: #666; border-top: 2px solid #22c55e; margin-top: 40px; }
        @media (max-width: 600px) { .breakdown { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🌲 TreeAI</div>
        <div class="tagline">Florida's Premier AI-Powered Forestry Service</div>
    </div>

    <div class="section">
        <h2>Service Proposal for ${proposal.customerName}</h2>
        <p><strong>Project Location:</strong> ${proposal.projectLocation}</p>
        <p><strong>Quote Date:</strong> ${proposal.quoteDate.toLocaleDateString()}</p>
        <p><strong>Valid Until:</strong> ${proposal.validUntil.toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Service Details</h2>
        <p><strong>Service Type:</strong> ${isForestryMulching ? 'Forestry Mulching' : 'Land Clearing'}</p>
        <p><strong>Package Size:</strong> ${proposal.packageSize.charAt(0).toUpperCase() + proposal.packageSize.slice(1)} Package ${isForestryMulching ? `(${serviceDetails.dbh} DBH)` : `(${serviceDetails.equipment})`}</p>
        <p><strong>Project Size:</strong> ${proposal.acreage} acres</p>
        <p><strong>Estimated Duration:</strong> ${Math.ceil(proposal.acreage / 1.5)} days</p>
        ${proposal.specialConditions ? `<p><strong>Special Considerations:</strong> ${proposal.specialConditions}</p>` : ''}
    </div>

    <div class="price-highlight">
        <div style="font-size: 1.5em; font-weight: bold;">Total Investment: $${proposal.totalCost.toLocaleString()}</div>
        <div style="font-size: 1em; margin-top: 10px;">($${Math.round(proposal.pricePerAcre).toLocaleString()} per acre)</div>
    </div>

    <div class="breakdown">
        <div class="breakdown-item">
            <h3 style="color: #16a34a; margin-top: 0;">Service Cost</h3>
            <p><strong>$${proposal.baseServiceCost.toLocaleString()}</strong></p>
            <p>${isForestryMulching ? 'Professional forestry mulching' : 'Complete land clearing'} with ${isForestryMulching ? serviceDetails.dbh + ' DBH capacity' : serviceDetails.equipment + ' equipment'}</p>
        </div>
        <div class="breakdown-item">
            <h3 style="color: #16a34a; margin-top: 0;">Transport & Setup</h3>
            <p><strong>$${proposal.transportCost.toLocaleString()}</strong></p>
            <p>${proposal.travelTimeHours} hours travel time each way for ${Math.ceil(proposal.acreage / 1.5)} days</p>
        </div>
    </div>

    <div class="section">
        <h2>What You Get</h2>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">✅ Professional ${isForestryMulching ? 'forestry mulching' : 'land clearing'} service</li>
            <li style="margin: 10px 0;">✅ ${isForestryMulching ? 'Eco-friendly mulch left on-site for soil improvement' : 'Complete site preparation for development'}</li>
            <li style="margin: 10px 0;">✅ Licensed, insured, and bonded operation</li>
            <li style="margin: 10px 0;">✅ No hidden fees - transparent pricing</li>
            <li style="margin: 10px 0;">✅ Professional equipment and experienced operators</li>
            <li style="margin: 10px 0;">✅ Satisfaction guarantee on all work</li>
        </ul>
    </div>

    <div class="section">
        <h2>Why Choose TreeAI?</h2>
        <p><strong>Land Freedom:</strong> We transform unusable, overgrown land into accessible, valuable space for your vision.</p>
        <p><strong>AI-Powered Precision:</strong> Our advanced estimation system ensures accurate pricing and timeline predictions.</p>
        <p><strong>Eco-Friendly Approach:</strong> ${isForestryMulching ? 'Mulching preserves topsoil and creates beneficial organic matter.' : 'Efficient clearing minimizes environmental impact.'}</p>
        <p><strong>Transparent Pricing:</strong> No surprise costs - everything is clearly itemized and explained.</p>
    </div>

    <div class="section">
        <h2>Next Steps</h2>
        <p>Ready to transform your land? Contact us to:</p>
        <ul>
            <li>Schedule a final site inspection</li>
            <li>Confirm project timeline</li>
            <li>Secure your spot in our schedule</li>
        </ul>
        <p><strong>Phone:</strong> (407) 555-TREE</p>
        <p><strong>Email:</strong> quotes@treeai.us</p>
    </div>

    <div class="footer">
        <p><strong>TreeAI Forestry Services</strong><br>
        Licensed & Insured | Florida State Contractor<br>
        Visit us at: treeai.us</p>
        <p style="font-size: 0.9em; margin-top: 20px;">
        This proposal is valid until ${proposal.validUntil.toLocaleDateString()}.<br>
        Pricing subject to final site inspection and may vary based on actual conditions.
        </p>
    </div>
</body>
</html>
  `.trim()
}

// Business-facing proposal verification
export function generateBusinessVerification(proposal: ProposalData): string {
  const serviceDetails = SERVICE_RATES[proposal.serviceType][proposal.packageSize]
  const isForestryMulching = proposal.serviceType === 'forestry-mulching'
  const projectDays = Math.ceil(proposal.acreage / 1.5)
  const totalHours = isForestryMulching 
    ? serviceDetails.hoursPerAcre * proposal.acreage 
    : proposal.estimatedDays * 8
  const effectiveHourlyRate = proposal.totalCost / (totalHours + (proposal.travelTimeHours * 2 * projectDays))
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Verification - Proposal ${proposal.leadId || 'DRAFT'}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .section { margin: 30px 0; }
        .calculation-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .calculation-table th, .calculation-table td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        .calculation-table th { background: #f3f4f6; }
        .highlight { background: #fef3c7; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Business Proposal Verification</h1>
        <p>Internal Review - Lead ID: ${proposal.leadId || 'DRAFT'}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="section">
        <h2>Customer Information</h2>
        <table class="calculation-table">
            <tr><td><strong>Name:</strong></td><td>${proposal.customerName}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${proposal.customerEmail}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${proposal.customerPhone}</td></tr>
            <tr><td><strong>Address:</strong></td><td>${proposal.customerAddress}</td></tr>
            <tr><td><strong>Project Location:</strong></td><td>${proposal.projectLocation}</td></tr>
        </table>
    </div>

    <div class="metrics">
        <div class="metric-card">
            <h3>Profitability Check</h3>
            <p><strong>Effective Hourly Rate:</strong> $${effectiveHourlyRate.toFixed(0)}</p>
            <p><strong>Target Range:</strong> $150-250/hour</p>
            <p class="${effectiveHourlyRate >= 150 ? 'success' : 'alert'}">${effectiveHourlyRate >= 150 ? '✅ Within Target' : '⚠️ Below Target'}</p>
        </div>
        <div class="metric-card">
            <h3>Business Focus</h3>
            <p><strong>Service Type:</strong> ${isForestryMulching ? 'Forestry Mulching' : 'Land Clearing'}</p>
            <p><strong>Business Mix:</strong> ${isForestryMulching ? '80% Revenue Focus' : '20% Revenue Focus'}</p>
            <p class="${isForestryMulching ? 'success' : 'alert'}">${isForestryMulching ? '✅ Primary Service' : '⚠️ Specialized Service'}</p>
        </div>
        <div class="metric-card">
            <h3>Capacity Analysis</h3>
            <p><strong>Project Size:</strong> ${proposal.acreage} acres</p>
            <p><strong>Estimated Days:</strong> ${projectDays}</p>
            <p class="${proposal.acreage <= 1.5 ? 'success' : 'alert'}">${proposal.acreage <= 1.5 ? '✅ Single Day Capacity' : '⚠️ Multi-Day Project'}</p>
        </div>
    </div>

    <div class="section">
        <h2>Detailed Calculations</h2>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Calculation</th>
                    <th>Amount</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Base Service</td>
                    <td>${isForestryMulching ? `$${serviceDetails.rate} × ${proposal.acreage} acres` : `$${serviceDetails.rate} × ${proposal.estimatedDays} days`}</td>
                    <td>$${proposal.baseServiceCost.toLocaleString()}</td>
                    <td>${isForestryMulching ? serviceDetails.dbh + ' DBH Package' : serviceDetails.equipment + ' Equipment'}</td>
                </tr>
                <tr>
                    <td>Project Days</td>
                    <td>${isForestryMulching ? `CEILING(${proposal.acreage} ÷ 1.5)` : `${proposal.estimatedDays} days estimated`}</td>
                    <td>${projectDays} days</td>
                    <td>${proposal.acreage <= 1.5 ? 'Within daily capacity' : 'Multi-day scheduling required'}</td>
                </tr>
                <tr>
                    <td>Daily Transport</td>
                    <td>${proposal.travelTimeHours} hrs × 2 × $250</td>
                    <td>$${(proposal.travelTimeHours * 2 * 250).toLocaleString()}</td>
                    <td>Round trip transport cost</td>
                </tr>
                <tr>
                    <td>Total Transport</td>
                    <td>${(proposal.travelTimeHours * 2 * 250).toLocaleString()} × ${projectDays} days</td>
                    <td>$${proposal.transportCost.toLocaleString()}</td>
                    <td>${projectDays > 1 ? 'Multi-day transport applied' : 'Single day transport'}</td>
                </tr>
                <tr class="highlight">
                    <td><strong>TOTAL QUOTE</strong></td>
                    <td><strong>Service + Transport</strong></td>
                    <td><strong>$${proposal.totalCost.toLocaleString()}</strong></td>
                    <td><strong>${Math.round(proposal.pricePerAcre).toLocaleString()} per acre</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Performance Metrics</h2>
        <table class="calculation-table">
            <tr><td><strong>Estimated Project Hours:</strong></td><td>${totalHours.toFixed(1)} hours</td></tr>
            <tr><td><strong>Total Hours (inc. travel):</strong></td><td>${(totalHours + (proposal.travelTimeHours * 2 * projectDays)).toFixed(1)} hours</td></tr>
            <tr><td><strong>Revenue per Productive Hour:</strong></td><td>$${(proposal.baseServiceCost / totalHours).toFixed(0)}</td></tr>
            <tr><td><strong>Transport Cost Recovery:</strong></td><td>${((proposal.transportCost / (proposal.travelTimeHours * 2 * projectDays * 250)) * 100).toFixed(0)}%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Quality Assurance Checklist</h2>
        <div class="${effectiveHourlyRate >= 150 ? 'success' : 'alert'}">
            <p><strong>Profitability:</strong> ${effectiveHourlyRate >= 150 ? '✅ Meets minimum $150/hour target' : '❌ Below $150/hour minimum - Consider adjusting'}</p>
        </div>
        <div class="${proposal.acreage <= 3 ? 'success' : 'alert'}">
            <p><strong>Capacity:</strong> ${proposal.acreage <= 3 ? '✅ Within reasonable project size' : '❌ Large project - Verify capacity and scheduling'}</p>
        </div>
        <div class="${isForestryMulching ? 'success' : 'alert'}">
            <p><strong>Service Mix:</strong> ${isForestryMulching ? '✅ Aligns with 80% forestry focus' : '⚠️ Land clearing - 20% service mix'}</p>
        </div>
        <div class="${proposal.travelTimeHours <= 2 ? 'success' : 'alert'}">
            <p><strong>Travel Time:</strong> ${proposal.travelTimeHours <= 2 ? '✅ Reasonable travel distance' : '❌ High travel time - Verify profitability'}</p>
        </div>
    </div>

    <div class="section">
        <h2>Approval Recommendation</h2>
        <div class="${(effectiveHourlyRate >= 150 && proposal.acreage <= 3) ? 'success' : 'alert'}">
            <h3>${(effectiveHourlyRate >= 150 && proposal.acreage <= 3) ? '✅ RECOMMEND APPROVAL' : '⚠️ REQUIRES REVIEW'}</h3>
            <p><strong>Quoted by:</strong> ${proposal.quotedBy}</p>
            <p><strong>Quote Date:</strong> ${proposal.quoteDate.toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${proposal.validUntil.toLocaleDateString()}</p>
            <p><strong>Next Action:</strong> ${(effectiveHourlyRate >= 150 && proposal.acreage <= 3) ? 'Send to customer' : 'Management review required'}</p>
        </div>
    </div>

    <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; font-size: 0.9em; color: #666;">
        <p><strong>TreeAI Internal Use Only</strong> - This verification report is for business operations review and should not be shared with customers.</p>
    </div>
</body>
</html>
  `.trim()
}

// Demo proposal data
export const DEMO_PROPOSAL_DATA: ProposalData = {
  customerName: "Sarah Johnson",
  customerEmail: "sarah.johnson@gmail.com",
  customerPhone: "(407) 555-0123",
  customerAddress: "1425 Oak Ridge Drive, Winter Park, FL 32789",
  projectLocation: "2847 Forest Trail, Oviedo, FL 32765",
  serviceType: "forestry-mulching",
  packageSize: "medium",
  acreage: 2.3,
  estimatedDays: 2,
  travelTimeHours: 0.75,
  specialConditions: "Property has mature oak trees to preserve along the eastern boundary. Access via rear gate only.",
  baseServiceCost: 5750, // $2,500 × 2.3 acres
  transportCost: 750,     // 0.75 × 2 × $250 × 2 days
  totalCost: 6500,
  pricePerAcre: 2826,
  quoteDate: new Date('2025-08-09'),
  validUntil: new Date('2025-09-08'),
  quotedBy: "Mike Rodriguez - Senior Estimator",
  businessRepresentative: "Mike Rodriguez",
  leadId: "LEAD-2025-0809-001"
}