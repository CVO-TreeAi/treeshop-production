// DATABASE SERVICES DISABLED - USING CONVEX

// Stub exports to prevent import errors
export const adminLeadService = {
  createLead: () => Promise.resolve(null),
  getLeads: () => Promise.resolve([]),
  updateLead: () => Promise.resolve(null)
};

export const estimateService = {
  createEstimate: () => Promise.resolve(null),
  getEstimates: () => Promise.resolve([]),
  updateEstimate: () => Promise.resolve(null)
};

export const jobService = {
  createJob: () => Promise.resolve(null),
  getJobs: () => Promise.resolve([]),
  updateJob: () => Promise.resolve(null)
};

export const serviceService = {
  getServices: () => Promise.resolve([]),
  createService: () => Promise.resolve(null)
};

export const adminDatabase = {
  collection: () => ({ 
    add: () => Promise.resolve({ id: 'disabled' }),
    get: () => Promise.resolve({ docs: [] })
  })
};