import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { emailType, data } = await request.json();
    
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL || "office@fltreeshop.com";

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Gmail API not configured' }, { status: 500 });
    }

    // Set up OAuth2 client
    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    let emailContent;
    let subject;
    let to;

    switch (emailType) {
      case "customer_proposal":
        to = data.customerEmail;
        subject = `🌲 Your Free TreeShop Estimate - ${data.projectAddress}`;
        emailContent = generateCustomerProposalHTML(data);
        break;

      case "admin_new_lead":
        to = "office@fltreeshop.com"; // Business email address
        subject = `🌲 New ${data.leadScore?.toUpperCase() || 'NEW'} Lead: ${data.name} - $${data.estimatedTotal?.toLocaleString() || 'TBD'}`;
        emailContent = generateAdminLeadHTML(data);
        break;

      case "admin_partial_lead":
        to = "office@fltreeshop.com"; // Business email address
        subject = `⚠️ Partial Lead Alert: ${data.name || 'Visitor'} - ${data.step}`;
        emailContent = generateAdminPartialLeadHTML(data);
        break;

      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }

    // Create MIME message
    const emailMessage = [
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      `From: ${SENDER_EMAIL}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      emailContent
    ].join('\n');

    // Encode message
    const encodedMessage = Buffer.from(emailMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return NextResponse.json({
      success: true,
      messageId: response.data.id,
      message: 'Email sent successfully via Gmail API',
      from: SENDER_EMAIL,
      to: to
    });

  } catch (error) {
    console.error('Gmail API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email via Gmail API',
      details: error.message
    }, { status: 500 });
  }
}

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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; }
            .estimate-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #4a7c59; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .price-highlight { font-size: 32px; font-weight: bold; color: #2d5016; text-align: center; margin: 20px 0; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details-table th, .details-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .details-table th { background: #f8f9fa; font-weight: bold; color: #2d5016; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #4a7c59 0%, #22c55e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; text-align: center; }
            .footer { background: #2d5016; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .features-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
            .feature-item { padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 3px solid #4a7c59; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🌲 Your Free TreeShop Estimate</h1>
            <p style="font-size: 18px; margin: 0;">Professional Forestry Mulching & Land Clearing</p>
        </div>
        
        <div class="content">
            <h2 style="color: #2d5016;">Hi ${data.customerName || 'Valued Customer'},</h2>
            
            <p style="font-size: 16px;">Thank you for requesting an estimate from TreeShop! We've prepared a comprehensive proposal for your land clearing project in Florida.</p>
            
            <div class="estimate-box">
                <h3 style="color: #2d5016; margin-top: 0;">📍 Project: ${data.projectAddress}</h3>
                <div class="price-highlight">$${data.totalPrice?.toLocaleString()}</div>
                <p><strong>📏 Acreage:</strong> ${data.acreage} acres</p>
                <p><strong>🌳 Package:</strong> ${formatPackageName(data.packageType)} DBH Clearing</p>
                <p><strong>⏱️ Timeline:</strong> ${data.estimatedDays || Math.ceil(data.acreage * 0.5)} days</p>
                
                <table class="details-table">
                    <tr><th>Service Details</th><th>Cost</th></tr>
                    <tr><td>Base Clearing (${data.acreage} acres)</td><td>$${data.basePrice?.toLocaleString()}</td></tr>
                    ${data.travelSurcharge > 0 ? `<tr><td>Travel Surcharge</td><td>$${data.travelSurcharge.toLocaleString()}</td></tr>` : ''}
                    ${data.obstacleAdjustment > 0 ? `<tr><td>Obstacle Adjustment</td><td>$${data.obstacleAdjustment.toLocaleString()}</td></tr>` : ''}
                    <tr style="background: #f0f8f0; font-weight: bold;"><td>Total Project Cost</td><td>$${data.totalPrice?.toLocaleString()}</td></tr>
                </table>
                
                ${data.assumptions && data.assumptions.length > 0 ? `
                <h4 style="color: #2d5016;">📋 Project Assumptions:</h4>
                <ul style="color: #666;">
                    ${data.assumptions.map((assumption: string) => `<li>${assumption}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 18px; font-weight: bold; color: #2d5016;">Ready to transform your property?</p>
                <a href="tel:+1-407-555-0199" class="cta-button">📞 Call (407) 555-0199 to Schedule</a>
                <p style="font-size: 14px; color: #666;">This estimate is valid for 30 days</p>
            </div>
            
            <h3 style="color: #2d5016;">🏆 Why Choose TreeShop Florida?</h3>
            <div class="features-list">
                <div class="feature-item">
                    <strong>🚜 Professional Equipment</strong><br>
                    CAT forestry mulchers & Fecon attachments
                </div>
                <div class="feature-item">
                    <strong>🌱 Eco-Friendly Process</strong><br>
                    Selective clearing preserves soil & nutrients
                </div>
                <div class="feature-item">
                    <strong>📜 Licensed & Insured</strong><br>
                    Fully bonded with comprehensive coverage
                </div>
                <div class="feature-item">
                    <strong>⚡ Fast Turnaround</strong><br>
                    Most projects completed in 1-3 days
                </div>
            </div>
            
            <p style="font-size: 16px;">Questions about your estimate? Just reply to this email or call us at <strong>(407) 555-0199</strong>. We're here to help make your land clearing project a success!</p>
            
            <p style="margin-top: 30px;">Best regards,<br>
            <strong style="color: #2d5016;">The TreeShop Team</strong><br>
            <em>Florida's Premier Forestry Mulching Experts</em></p>
        </div>
        
        <div class="footer">
            <p><strong>TreeShop Florida</strong></p>
            <p>📧 office@fltreeshop.com | 📞 (407) 555-0199</p>
            <p>🏆 Licensed & Insured | Serving Central Florida</p>
        </div>
    </body>
    </html>
  `;
}

// Generate admin new lead notification HTML
function generateAdminLeadHTML(data: any): string {
  const priorityColor = data.leadScore === 'hot' ? '#dc3545' : data.leadScore === 'warm' ? '#fd7e14' : '#6c757d';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New TreeShop Lead Alert</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-header { background: ${priorityColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 25px; }
            .lead-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .priority-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; background: ${priorityColor}; margin: 10px 0; }
            .contact-info { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .action-items { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="alert-header">
            <h1>🚨 New TreeShop Lead!</h1>
            <div class="priority-badge">${data.leadScore?.toUpperCase() || 'NEW'} PRIORITY</div>
        </div>
        
        <div class="content">
            <div class="lead-details">
                <h2 style="margin-top: 0; color: #2d5016;">${data.name}</h2>
                
                <div class="contact-info">
                    <p><strong>📧 Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                    <p><strong>📱 Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                    <p><strong>📍 Address:</strong> ${data.address}</p>
                </div>
                
                <h3 style="color: #2d5016;">🌲 Project Details:</h3>
                <ul>
                    <li><strong>Acreage:</strong> ${data.acreage} acres</li>
                    <li><strong>Package:</strong> ${formatPackageName(data.selectedPackage)} DBH</li>
                    <li><strong>Estimated Value:</strong> $${data.estimatedTotal?.toLocaleString() || 'TBD'}</li>
                    <li><strong>Lead Score:</strong> ${data.leadScore?.toUpperCase() || 'UNSCORED'}</li>
                    <li><strong>Source:</strong> ${data.leadSource || 'Website'}</li>
                </ul>
                
                ${data.obstacles && data.obstacles.length > 0 ? `
                <h4 style="color: #2d5016;">⚠️ Obstacles/Considerations:</h4>
                <ul>${data.obstacles.map((obstacle: string) => `<li>${obstacle}</li>`).join('')}</ul>
                ` : ''}
                
                ${data.utmSource ? `
                <h4 style="color: #2d5016;">📊 Attribution:</h4>
                <ul>
                    ${data.utmSource ? `<li><strong>UTM Source:</strong> ${data.utmSource}</li>` : ''}
                    ${data.utmMedium ? `<li><strong>UTM Medium:</strong> ${data.utmMedium}</li>` : ''}
                    ${data.utmCampaign ? `<li><strong>UTM Campaign:</strong> ${data.utmCampaign}</li>` : ''}
                </ul>
                ` : ''}
                
                <p><strong>⏰ Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="action-items">
                <h3 style="margin-top: 0;">🎯 Next Steps:</h3>
                <ol>
                    <li><strong>${data.leadScore === 'hot' ? 'Call within 15 minutes' : 'Call within 2 hours'}</strong> for best conversion</li>
                    <li>Schedule on-site consultation</li>
                    <li>Provide detailed proposal</li>
                    <li>Update lead status in CRM</li>
                </ol>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3232/admin/crm" style="display: inline-block; background: #4a7c59; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    📊 View in CRM Dashboard
                </a>
            </div>
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
        <title>Partial Lead Alert - TreeShop</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-header { background: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 25px; }
            .lead-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .followup-actions { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="alert-header">
            <h1>⚠️ Partial Form Submission</h1>
            <p>Someone started but didn't complete the estimate form</p>
        </div>
        
        <div class="content">
            <div class="lead-details">
                <h2 style="margin-top: 0;">🔍 Partial Submission Details</h2>
                
                <ul>
                    <li><strong>Name:</strong> ${data.formData?.name || 'Not provided'}</li>
                    <li><strong>Email:</strong> ${data.formData?.email || 'Not provided'}</li>
                    <li><strong>Phone:</strong> ${data.formData?.phone || 'Not provided'}</li>
                    <li><strong>Address:</strong> ${data.formData?.address || 'Not provided'}</li>
                    <li><strong>Acreage:</strong> ${data.formData?.acreage || 'Not provided'}</li>
                    <li><strong>Step Reached:</strong> ${data.step}</li>
                    <li><strong>Page:</strong> ${data.pageUrl || 'Estimate form'}</li>
                    <li><strong>Time:</strong> ${new Date(data.updatedAt).toLocaleString()}</li>
                </ul>
            </div>
            
            <div class="followup-actions">
                <h3 style="margin-top: 0;">📋 Follow-up Strategy:</h3>
                <ol>
                    <li><strong>Wait 30 minutes</strong>, then send follow-up email (if email provided)</li>
                    <li><strong>Call within 2 hours</strong> (if phone provided)</li>
                    <li><strong>Offer assistance</strong> completing the estimate</li>
                    <li><strong>Provide direct contact</strong> for immediate questions</li>
                </ol>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3232/admin/crm" style="display: inline-block; background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    📊 View Partial Leads in CRM
                </a>
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