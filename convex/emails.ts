import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// HTTP action to send emails using Resend
export const sendEmail = httpAction(async (ctx, request) => {
  const { emailType, data } = await request.json();
  
  // Get Resend API key from environment variables
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let emailContent;
    let subject;
    let to;
    let from = "TreeShop Florida <onboarding@resend.dev>";  // Use verified domain for now

    switch (emailType) {
      case "customer_proposal":
        to = data.customerEmail;
        subject = `Your Free TreeShop Estimate - ${data.projectAddress}`;
        emailContent = generateCustomerProposalHTML(data);
        break;

      case "admin_new_lead":
        to = "office@fltreeshop.com";
        subject = `🌲 New ${data.leadScore.toUpperCase()} Lead: ${data.name} - $${data.estimatedTotal?.toLocaleString() || 'TBD'}`;
        emailContent = generateAdminLeadHTML(data);
        break;

      case "admin_partial_lead":
        to = "office@fltreeshop.com";
        subject = `⚠️ Partial Lead Alert: ${data.name || 'Visitor'} - ${data.step}`;
        emailContent = generateAdminPartialLeadHTML(data);
        break;

      default:
        throw new Error("Unknown email type");
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html: emailContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${result.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: result.id,
      message: "Email sent successfully" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to send email",
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Generate customer proposal email HTML
function generateCustomerProposalHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your TreeShop Estimate</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2d5016; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; }
            .estimate-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #4a7c59; margin: 20px 0; }
            .price-highlight { font-size: 28px; font-weight: bold; color: #2d5016; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details-table th, .details-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .details-table th { background: #f1f1f1; font-weight: bold; }
            .cta-button { display: inline-block; background: #4a7c59; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🌲 Your Free TreeShop Estimate</h1>
            <p>Professional Forestry Mulching & Land Clearing</p>
        </div>
        
        <div class="content">
            <h2>Hi ${data.customerName},</h2>
            
            <p>Thank you for requesting an estimate from TreeShop! We've prepared a comprehensive proposal for your land clearing project.</p>
            
            <div class="estimate-box">
                <h3>Project: ${data.projectAddress}</h3>
                <div class="price-highlight">$${data.totalPrice?.toLocaleString()}</div>
                <p><strong>Acreage:</strong> ${data.acreage} acres</p>
                <p><strong>Package:</strong> ${formatPackageName(data.packageType)} DBH</p>
                <p><strong>Estimated Timeline:</strong> ${data.estimatedDays} days</p>
                
                <table class="details-table">
                    <tr><th>Service</th><th>Amount</th></tr>
                    <tr><td>Base Clearing (${data.acreage} acres)</td><td>$${data.basePrice?.toLocaleString()}</td></tr>
                    ${data.travelSurcharge > 0 ? `<tr><td>Travel Surcharge</td><td>$${data.travelSurcharge.toLocaleString()}</td></tr>` : ''}
                    ${data.obstacleAdjustment > 0 ? `<tr><td>Obstacle Adjustment</td><td>$${data.obstacleAdjustment.toLocaleString()}</td></tr>` : ''}
                    <tr><th>Total Project Cost</th><th>$${data.totalPrice?.toLocaleString()}</th></tr>
                </table>
                
                ${data.assumptions && data.assumptions.length > 0 ? `
                <h4>Project Assumptions:</h4>
                <ul>
                    ${data.assumptions.map((assumption: string) => `<li>${assumption}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            
            <p><strong>Ready to get started?</strong> This estimate is valid for 30 days. We're fully licensed, insured, and ready to transform your property!</p>
            
            <a href="tel:+1-407-555-0199" class="cta-button">📞 Call (407) 555-0199 to Book</a>
            
            <h3>Why Choose TreeShop?</h3>
            <ul>
                <li>✅ Professional forestry mulching equipment</li>
                <li>✅ Environmental-friendly land clearing</li>
                <li>✅ Licensed & fully insured</li>
                <li>✅ Free on-site consultations</li>
                <li>✅ Same-day estimates</li>
            </ul>
            
            <p>Questions? Just reply to this email or call us at <strong>(407) 555-0199</strong>. We're here to help!</p>
            
            <p>Best regards,<br>
            <strong>The TreeShop Team</strong><br>
            Florida's Premier Land Clearing Experts</p>
        </div>
        
        <div class="footer">
            <p>TreeShop Florida | office@fltreeshop.com | (407) 555-0199</p>
            <p>Licensed & Insured | Serving Central Florida</p>
        </div>
    </body>
    </html>
  `;
}

// Generate admin new lead notification HTML
function generateAdminLeadHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Lead Alert</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-header { background: ${data.leadScore === 'hot' ? '#dc3545' : data.leadScore === 'warm' ? '#fd7e14' : '#6c757d'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 25px; }
            .lead-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; background: ${data.leadScore === 'hot' ? '#dc3545' : data.leadScore === 'warm' ? '#fd7e14' : '#6c757d'}; }
            .contact-info { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="alert-header">
            <h1>🚨 New Lead Alert!</h1>
            <div class="priority-badge">${data.leadScore.toUpperCase()} PRIORITY</div>
        </div>
        
        <div class="content">
            <div class="lead-details">
                <h2>${data.name}</h2>
                
                <div class="contact-info">
                    <strong>📧 Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
                    <strong>📱 Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a><br>
                    <strong>🏠 Address:</strong> ${data.address}
                </div>
                
                <h3>Project Details:</h3>
                <ul>
                    <li><strong>Acreage:</strong> ${data.acreage} acres</li>
                    <li><strong>Package:</strong> ${formatPackageName(data.selectedPackage)} DBH</li>
                    <li><strong>Estimated Value:</strong> $${data.estimatedTotal?.toLocaleString() || 'TBD'}</li>
                    <li><strong>Lead Score:</strong> ${data.leadScore.toUpperCase()}</li>
                    <li><strong>Source:</strong> ${data.leadSource}</li>
                </ul>
                
                ${data.obstacles && data.obstacles.length > 0 ? `
                <h4>Obstacles/Considerations:</h4>
                <ul>${data.obstacles.map((obstacle: string) => `<li>${obstacle}</li>`).join('')}</ul>
                ` : ''}
                
                ${data.utmSource ? `
                <h4>Attribution:</h4>
                <ul>
                    ${data.utmSource ? `<li><strong>UTM Source:</strong> ${data.utmSource}</li>` : ''}
                    ${data.utmMedium ? `<li><strong>UTM Medium:</strong> ${data.utmMedium}</li>` : ''}
                    ${data.utmCampaign ? `<li><strong>UTM Campaign:</strong> ${data.utmCampaign}</li>` : ''}
                </ul>
                ` : ''}
                
                <p><strong>⏰ Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3>Next Steps:</h3>
            <ol>
                <li>Call within 15 minutes for HOT leads</li>
                <li>Schedule on-site consultation</li>
                <li>Provide detailed proposal</li>
                <li>Update lead status in admin dashboard</li>
            </ol>
        </div>
    </body>
    </html>
  `;
}

// Generate admin partial lead notification HTML  
function generateAdminPartialLeadHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Partial Lead Alert</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-header { background: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 25px; }
            .lead-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="alert-header">
            <h1>⚠️ Partial Form Alert</h1>
            <p>Someone started but didn't complete the estimate form</p>
        </div>
        
        <div class="content">
            <div class="lead-details">
                <h2>Partial Submission Details</h2>
                
                <ul>
                    <li><strong>Name:</strong> ${data.formData?.name || 'Not provided'}</li>
                    <li><strong>Email:</strong> ${data.formData?.email || 'Not provided'}</li>
                    <li><strong>Phone:</strong> ${data.formData?.phone || 'Not provided'}</li>
                    <li><strong>Address:</strong> ${data.formData?.address || 'Not provided'}</li>
                    <li><strong>Acreage:</strong> ${data.formData?.acreage || 'Not provided'}</li>
                    <li><strong>Step Reached:</strong> ${data.step}</li>
                    <li><strong>Page:</strong> ${data.pageUrl}</li>
                    <li><strong>Time:</strong> ${new Date(data.updatedAt).toLocaleString()}</li>
                </ul>
                
                <h3>Follow-up Actions:</h3>
                <ol>
                    <li>Wait 30 minutes, then send follow-up email</li>
                    <li>Call if phone number provided</li>
                    <li>Offer assistance completing the estimate</li>
                </ol>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Helper function to format package names
function formatPackageName(packageType: string): string {
  const packages = {
    small: '4" Small',
    medium: '6" Medium',
    large: '8" Large', 
    xlarge: '10" Extra Large',
  };
  return packages[packageType as keyof typeof packages] || '6" Medium';
}