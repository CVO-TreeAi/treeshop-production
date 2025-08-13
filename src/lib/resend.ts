import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Domain management functions
export const resendDomains = {
  // Create domain
  async create(domain: string) {
    try {
      const response = await resend.domains.create({ name: domain })
      return response
    } catch (error) {
      console.error('Failed to create Resend domain:', error)
      throw error
    }
  },

  // Get domain details
  async get(domainId: string) {
    try {
      const response = await resend.domains.get(domainId)
      return response
    } catch (error) {
      console.error('Failed to get Resend domain:', error)
      throw error
    }
  },

  // Verify domain
  async verify(domainId: string) {
    try {
      const response = await resend.domains.verify(domainId)
      return response
    } catch (error) {
      console.error('Failed to verify Resend domain:', error)
      throw error
    }
  },

  // Update domain settings
  async update(domainId: string, options: { openTracking?: boolean; clickTracking?: boolean }) {
    try {
      const response = await resend.domains.update({
        id: domainId,
        ...options
      })
      return response
    } catch (error) {
      console.error('Failed to update Resend domain:', error)
      throw error
    }
  },

  // List all domains
  async list() {
    try {
      const response = await resend.domains.list()
      return response
    } catch (error) {
      console.error('Failed to list Resend domains:', error)
      throw error
    }
  },

  // Remove domain
  async remove(domainId: string) {
    try {
      const response = await resend.domains.remove(domainId)
      return response
    } catch (error) {
      console.error('Failed to remove Resend domain:', error)
      throw error
    }
  }
}

// Email sending functions
export const sendEmail = {
  // Send proposal email
  async sendProposal(to: string, customerName: string, proposalHTML: string) {
    try {
      const response = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'no-reply@treeai.us',
        to: [to],
        subject: `TreeAI Forestry Services - Your Project Proposal`,
        html: proposalHTML,
        headers: {
          'X-Entity-Ref-ID': `proposal-${Date.now()}`
        }
      })
      return response
    } catch (error) {
      console.error('Failed to send proposal email:', error)
      throw error
    }
  },

  // Send lead notification to business
  async sendLeadNotification(leadData: any) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@treeai.us']
    
    try {
      const response = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'no-reply@treeai.us',
        to: adminEmails,
        subject: `🔥 New ${leadData.temperature} Lead - ${leadData.customerName}`,
        html: `
          <h2>New Lead Received</h2>
          <p><strong>Customer:</strong> ${leadData.customerName}</p>
          <p><strong>Phone:</strong> ${leadData.phone}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Location:</strong> ${leadData.location}</p>
          <p><strong>Service:</strong> ${leadData.serviceType}</p>
          <p><strong>Lead Temperature:</strong> ${leadData.temperature}</p>
          <p><strong>Estimated Value:</strong> $${leadData.estimatedValue}</p>
          
          <h3>Project Details</h3>
          <p><strong>Acreage:</strong> ${leadData.acreage}</p>
          <p><strong>Package:</strong> ${leadData.packageSize}</p>
          <p><strong>Timeline:</strong> ${leadData.timeline}</p>
          
          <p><a href="https://treeai.us/treeshop/admin/crm" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in CRM</a></p>
        `,
        headers: {
          'X-Entity-Ref-ID': `lead-${leadData.id}`
        }
      })
      return response
    } catch (error) {
      console.error('Failed to send lead notification:', error)
      throw error
    }
  },

  // Send general contact form
  async sendContactForm(formData: any) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@treeai.us']
    
    try {
      const response = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'no-reply@treeai.us',
        to: adminEmails,
        subject: `Contact Form - ${formData.subject}`,
        html: `
          <h2>Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          
          <h3>Message</h3>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
          
          <p><em>Sent from TreeAI Contact Form</em></p>
        `,
        headers: {
          'X-Entity-Ref-ID': `contact-${Date.now()}`
        }
      })
      return response
    } catch (error) {
      console.error('Failed to send contact form:', error)
      throw error
    }
  }
}

// Setup functions for initial domain configuration
export const setupResendDomain = async () => {
  const domain = 'treeai.us'
  
  try {
    // First, try to list existing domains to see if treeai.us is already added
    const existingDomains = await resendDomains.list()
    const existingDomain = existingDomains.data?.data?.find((d: any) => d.name === domain)
    
    if (existingDomain) {
      console.log('Domain already exists:', existingDomain)
      return existingDomain
    }
    
    // Create the domain
    const newDomain = await resendDomains.create(domain)
    console.log('Domain created:', newDomain)
    
    // Update settings for better deliverability
    if (newDomain.data?.id) {
      await resendDomains.update(newDomain.data.id, {
        openTracking: true,
        clickTracking: true
      })
      console.log('Domain settings updated')
    }
    
    return newDomain
  } catch (error) {
    console.error('Failed to setup Resend domain:', error)
    throw error
  }
}

// Configuration for treeai.us domain
export const DOMAIN_CONFIG = {
  domain: 'treeai.us',
  subdomain: 'treeshop',
  fullUrl: 'https://treeai.us/treeshop',
  emailFrom: 'no-reply@treeai.us',
  adminEmails: ['admin@treeai.us', 'owner@fltreeshop.com']
}