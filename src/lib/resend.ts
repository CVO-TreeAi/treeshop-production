// RESEND DISABLED - USING GMAIL API

// Stub exports to prevent import errors
export const resend = null;

export const resendDomains = {
  create: () => Promise.resolve({ error: 'Resend disabled' }),
  get: () => Promise.resolve({ error: 'Resend disabled' }),
  verify: () => Promise.resolve({ error: 'Resend disabled' }),
  update: () => Promise.resolve({ error: 'Resend disabled' }),
  list: () => Promise.resolve({ data: { data: [] } }),
  remove: () => Promise.resolve({ error: 'Resend disabled' })
};

export const sendEmail = {
  sendProposal: () => Promise.resolve({ error: 'Resend disabled' }),
  sendLeadNotification: () => Promise.resolve({ error: 'Resend disabled' }),
  sendContactForm: () => Promise.resolve({ error: 'Resend disabled' })
};

export const setupResendDomain = () => Promise.resolve({ error: 'Resend disabled' });

export const DOMAIN_CONFIG = {
  domain: 'treeai.us',
  subdomain: 'treeshop',
  fullUrl: 'https://treeai.us/treeshop',
  emailFrom: 'office@fltreeshop.com',
  adminEmails: ['office@fltreeshop.com']
};