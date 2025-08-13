import { ProposalData } from '@/lib/pdf-generator'

type LeadInputs = {
  acreage?: number
  package?: 'small' | 'medium' | 'large' | 'xlarge' | string
  obstacles?: string[]
}

type LeadLike = {
  id?: string
  contact?: { name?: string; email?: string; phone?: string }
  address?: string
  property?: { address?: string }
  inputs?: LeadInputs
}

const DBH_PACKAGES: Record<string, { label: string; dbh: string; pricePerAcre: number; description: string }> = {
  small: { 
    label: 'Small Package', 
    dbh: '4\" DBH & Under', 
    pricePerAcre: 2150,
    description: 'Professional forestry mulching for light clearing. Perfect for underbrush, small saplings, and maintenance work. Our specialized equipment efficiently cuts and mulches vegetation up to 4 inches in diameter, leaving behind a natural mulch layer that enriches the soil and prevents erosion.'
  },
  medium: { 
    label: 'Medium Package', 
    dbh: '6\" DBH & Under', 
    pricePerAcre: 2500,
    description: 'Comprehensive land clearing for moderate vegetation. Ideal for property development prep, fire breaks, and selective clearing. Our powerful mulching equipment handles trees and brush up to 6 inches in diameter, creating a clean, ready-to-use space while maintaining soil integrity.'
  },
  large: { 
    label: 'Large Package', 
    dbh: '8\" DBH & Under', 
    pricePerAcre: 3140,
    description: 'Heavy-duty forestry mulching for substantial clearing projects. Perfect for overgrown properties, ranch development, and commercial land prep. Our industrial-grade equipment efficiently processes trees and vegetation up to 8 inches in diameter, transforming dense woodland into usable space while creating valuable organic mulch.'
  },
  xlarge: { 
    label: 'X-Large Package', 
    dbh: '10\" DBH & Under', 
    pricePerAcre: Math.round(3140 * 1.326),
    description: 'Maximum clearing power for the most challenging projects. Designed for dense forest conversion, large-scale development, and challenging terrain. Our heavy-duty equipment tackles mature trees up to 10 inches in diameter, providing complete land transformation with professional results and environmental responsibility.'
  }
}

function computeEstimate(acreage: number, selectedPackage: string) {
  const pkg = DBH_PACKAGES[selectedPackage] || DBH_PACKAGES['medium']
  const baseTotal = Math.max(0, acreage) * pkg.pricePerAcre
  const minTotal = Math.round(baseTotal * 0.85)
  const maxTotal = Math.round(baseTotal * 1.25)
  const days = Math.max(1, Math.ceil(Math.max(0.25, acreage) / 3))
  return {
    packageLabel: pkg.label,
    packageDbh: pkg.dbh,
    pricePerAcre: pkg.pricePerAcre,
    baseTotal: Math.round(baseTotal),
    finalTotal: Math.round((minTotal + maxTotal) / 2),
    minTotal,
    maxTotal,
    days,
  }
}

export function buildProposalDataFromLead(lead: LeadLike): ProposalData {
  const id = lead.id || 'PROPOSAL-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  const customerName = lead.contact?.name || 'Valued Customer'
  const customerEmail = lead.contact?.email || ''
  const customerPhone = lead.contact?.phone || ''
  const propertyAddress = lead.property?.address || lead.address || 'TBD'
  const acreage = Number(lead.inputs?.acreage || 0)
  const selectedPackage = String(lead.inputs?.package || 'medium')
  const obstacles = Array.isArray(lead.inputs?.obstacles) ? lead.inputs!.obstacles! : []

  const est = computeEstimate(acreage, selectedPackage)

  const pkg = DBH_PACKAGES[selectedPackage] || DBH_PACKAGES['medium']
  
  const services = [
    {
      name: `Forestry Mulching — ${est.packageLabel}`,
      description: pkg.description + (obstacles.length ? ` Site considerations: ${obstacles.join(', ')}.` : '') + ' All mulched material remains on-site as natural ground cover, providing erosion control and soil enhancement.',
      quantity: Math.max(1, acreage || 1),
      unit: 'acres',
      rate: est.pricePerAcre,
      total: est.baseTotal,
    },
  ]

  const proposal: ProposalData = {
    id,
    customerName,
    customerAddress: propertyAddress,
    customerPhone,
    customerEmail,
    propertyAddress,
    acreage: acreage || 0,
    terrain: 'flat',
    density: 'medium',
    accessibility: 'easy',
    obstacles,
    stumpRemoval: false,
    services,
    subtotal: est.baseTotal,
    tax: 0,
    total: est.finalTotal,
    validFor: 30,
    notes: obstacles.length ? `Observed site considerations: ${obstacles.join(', ')}.` : undefined,
    createdAt: new Date(),
    terms: 'Only 20% deposit required to secure your spot on our schedule - Balance due upon completion. Financing available with approved credit. Pricing subject to site verification; wetlands/permitting may affect scope. Free change order if office validation differs from this preliminary proposal.',
    timeline: `${est.days} day${est.days > 1 ? 's' : ''} estimated duration (weather and access permitting).`,
    warranty: 'Workmanship guaranteed. Licensed & insured. We repair any damage caused by our operations not disclosed in site notes.',
  }

  return proposal
}

export function buildProposalEmail(proposal: ProposalData) {
  const subject = `Your TreeAI Proposal — ${proposal.propertyAddress} (Estimate #${proposal.id})`
  const text = [
    `Hi ${proposal.customerName},`,
    '',
    'Thanks for contacting Tree Shop (TreeAI). Attached is your preliminary proposal based on the details provided.',
    `Total estimate: $${proposal.total.toLocaleString()}`,
    `Estimated duration: ${proposal.timeline}`,
    '',
    `Service address: ${proposal.propertyAddress}`,
    `Acreage: ${proposal.acreage}`,
    '',
    'Next steps:',
    '1) Our office validates site access and any permitting (within 4 business hours).',
    '2) We’ll confirm final scope and schedule.',
    '',
    'Reply to this email with any questions.',
    '',
    '— TreeAI Team',
    '(352) 555‑TREE',
    'https://treeai.us',
  ].join('\n')

  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
    <p>Hi ${proposal.customerName},</p>
    <p>Thanks for contacting <strong>Tree Shop (TreeAI)</strong>. Attached is your preliminary proposal based on the details provided.</p>
    <p><strong>Total estimate:</strong> $${proposal.total.toLocaleString()}<br/>
       <strong>Estimated duration:</strong> ${proposal.timeline}</p>
    <p>
      <strong>Service address:</strong> ${proposal.propertyAddress}<br/>
      <strong>Acreage:</strong> ${proposal.acreage}
    </p>
    <p><strong>Next steps:</strong><br/>
      1) Our office validates site access and any permitting (within 4 business hours).<br/>
      2) We’ll confirm final scope and schedule.
    </p>
    <p>Reply to this email with any questions.</p>
    <p>— TreeAI Team<br/>(352) 555‑TREE<br/>https://treeai.us</p>
  </div>`

  return { subject, text, html }
}


