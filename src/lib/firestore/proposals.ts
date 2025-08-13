// Firebase proposals module disabled for Convex migration
// All Firebase functionality has been moved to Convex backend

export const siteSettingsRef = null;
export const proposalTemplatesRef = null;
export const pricingPackagesRef = null;
export const servicesRef = null;
export const legalTermsRef = null;
export const proposalsRef = null;
export const proposalEventsRef = null;

// Disabled functions
export async function getSiteSettings() { return null; }
export async function updateSiteSettings() { return; }
export async function getActiveProposalTemplate() { return null; }
export async function getProposalTemplate() { return null; }
export async function createProposalTemplate() { return ''; }
export async function publishProposalTemplate() { return; }
export async function getPricingPackages() { return []; }
export async function getPricingPackage() { return null; }
export async function createPricingPackage() { return ''; }
export async function getServices() { return []; }
export async function getService() { return null; }
export async function createService() { return ''; }
export async function getProposal() { return null; }
export async function createProposal() { return ''; }
export async function updateProposal() { return; }
export async function getProposalsByStatus() { return []; }
export async function getAllProposals() { return []; }
export async function createProposalEvent() { return ''; }
export async function getProposalEvents() { return []; }
export async function createProposalSnapshot() { return {}; }