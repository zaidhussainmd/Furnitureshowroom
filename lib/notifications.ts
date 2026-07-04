import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize APIs if keys are active and not default placeholders
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const ownerWhatsapp = process.env.OWNER_WHATSAPP_NUMBER;

const resendApiKey = process.env.RESEND_API_KEY;
const ownerEmail = process.env.OWNER_EMAIL || 'owner@example.com';

const isTwilioConfigured =
  twilioSid &&
  !twilioSid.includes('your_') &&
  twilioToken &&
  !twilioToken.includes('your_') &&
  ownerWhatsapp &&
  !ownerWhatsapp.includes('your_');

const isResendConfigured = resendApiKey && !resendApiKey.includes('your_');

const resend = isResendConfigured ? new Resend(resendApiKey) : null;
const twilioClient = isTwilioConfigured ? twilio(twilioSid, twilioToken) : null;

interface NotificationPayload {
  enquiryNumber: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
}

export async function sendWhatsAppNotification(payload: NotificationPayload) {
  const isGeneral = payload.productName === 'General Enquiry';
  
  let body = '';
  if (isGeneral) {
    body = `📩 New General Enquiry — ${payload.enquiryNumber}\nCustomer: ${payload.customerName} | ${payload.customerPhone} | ${payload.customerEmail}\nMessage: ${payload.message.substring(0, 100)}${payload.message.length > 100 ? '...' : ''}`;
  } else {
    body = `🪑 New Enquiry — ${payload.enquiryNumber}\nProduct: ${payload.productName}\nCustomer: ${payload.customerName} | ${payload.customerPhone}\nContact via: ${payload.preferredContact}\nMessage: ${payload.message.substring(0, 100)}${payload.message.length > 100 ? '...' : ''}`;
  }

  if (isTwilioConfigured && twilioClient) {
    try {
      await twilioClient.messages.create({
        body,
        from: twilioFrom,
        to: ownerWhatsapp!,
      });
      console.log(`[Twilio WhatsApp] Sent notification for ${payload.enquiryNumber}`);
    } catch (err) {
      console.error('[Twilio WhatsApp] Error sending message:', err);
    }
  } else {
    console.log('\n┌─────────────────── SIMULATED WHATSAPP NOTIFICATION ───────────────────┐');
    console.log(`│ To Owner: ${ownerWhatsapp || 'Not Configured'}`);
    console.log(`│ From: ${twilioFrom}`);
    console.log('│ Content:');
    body.split('\n').forEach((line) => {
      console.log(`│   ${line}`);
    });
    console.log('└───────────────────────────────────────────────────────────────────────┘\n');
  }
}

export async function sendEmailNotifications(payload: NotificationPayload) {
  const isGeneral = payload.productName === 'General Enquiry';
  
  // HTML template for Owner email alert
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #f5f0e8; padding: 30px; border: 1px solid #2e2820; max-width: 600px;">
      <h2 style="font-family: Georgia, serif; color: #c9a84c; border-bottom: 1px solid #2e2820; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
        Maison & Co — New Enquiry Alert
      </h2>
      <p style="font-size: 14px; margin-top: 20px;">
        A new ${isGeneral ? 'general query' : 'product quote request'} has been submitted.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold; width: 150px;">Enquiry Ref:</td>
          <td style="padding: 10px 0; color: #c9a84c; font-weight: bold;">${payload.enquiryNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold;">Product Name:</td>
          <td style="padding: 10px 0; color: #f5f0e8;">${payload.productName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold;">Customer Name:</td>
          <td style="padding: 10px 0; color: #f5f0e8;">${payload.customerName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold;">Phone Number:</td>
          <td style="padding: 10px 0; color: #f5f0e8;">${payload.customerPhone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold;">Email Address:</td>
          <td style="padding: 10px 0; color: #f5f0e8;">${payload.customerEmail}</td>
        </tr>
        <tr style="border-bottom: 1px solid #2e2820;">
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold;">Preferred Contact:</td>
          <td style="padding: 10px 0; color: #c9a84c; font-weight: bold; text-transform: uppercase;">${payload.preferredContact}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #8a8070; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 10px 0; color: #f5f0e8; line-height: 1.5; white-space: pre-wrap;">${payload.message || 'No custom details provided.'}</td>
        </tr>
      </table>
      <div style="margin-top: 30px; border-top: 1px solid #2e2820; padding-top: 15px; font-size: 11px; color: #8a8070;">
        This is an automated alert from your Maison & Co online showroom database.
      </div>
    </div>
  `;

  // HTML template for Customer confirmation email
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #f5f0e8; padding: 30px; border: 1px solid #2e2820; max-width: 600px;">
      <h1 style="font-family: Georgia, serif; color: #c9a84c; border-bottom: 1px solid #2e2820; padding-bottom: 10px; text-transform: uppercase; font-size: 20px; letter-spacing: 0.2em; font-weight: normal; text-align: center;">
        MAISON & CO
      </h1>
      <p style="font-size: 14px; margin-top: 25px; line-height: 1.6; text-align: center;">
        Dear ${payload.customerName},
      </p>
      <p style="font-size: 14px; line-height: 1.6; text-align: center;">
        Thank you for expressing interest in our curated pieces. We have received your query for:
        <strong style="color: #c9a84c; display: block; margin: 10px 0; font-size: 16px;">${payload.productName}</strong>
        Your enquiry reference number is: <strong style="color: #c9a84c; font-size: 16px;">${payload.enquiryNumber}</strong>
      </p>
      <p style="font-size: 13px; line-height: 1.6; text-align: center; color: #8a8070; margin-top: 20px;">
        A showroom manager from our Banjara Hills gallery will reach out to you via 
        <strong style="color: #c9a84c; text-transform: uppercase;">${payload.preferredContact}</strong> within the next 24 hours to coordinate specifications, customization options, and quote details.
      </p>
      <div style="margin-top: 40px; border-top: 1px solid #2e2820; padding-top: 20px; text-align: center; font-size: 11px; color: #8a8070; line-height: 1.6;">
        <strong>Maison & Co Showroom</strong><br />
        Road No. 12, Banjara Hills, Hyderabad, TS 500034<br />
        Where Craftsmanship Meets Luxury
      </div>
    </div>
  `;

  if (isResendConfigured && resend) {
    try {
      // 1. Send copy to Owner
      await resend.emails.send({
        from: 'Maison & Co Showroom <showroom@resend.dev>',
        to: ownerEmail,
        subject: `[New Enquiry] ${payload.enquiryNumber} - ${payload.productName}`,
        html: ownerHtml,
      });

      // 2. Send confirmation copy to Customer
      await resend.emails.send({
        from: 'Maison & Co Showroom <showroom@resend.dev>',
        to: payload.customerEmail,
        subject: `Enquiry Received - Reference: ${payload.enquiryNumber} | Maison & Co`,
        html: customerHtml,
      });

      console.log(`[Resend Email] Dispatched transactional emails for ${payload.enquiryNumber}`);
    } catch (err) {
      console.error('[Resend Email] Error sending messages:', err);
    }
  } else {
    console.log('\n┌───────────────────── SIMULATED EMAIL TO OWNER ─────────────────────┐');
    console.log(`│ To Owner Email: ${ownerEmail}`);
    console.log(`│ Subject: [New Enquiry] ${payload.enquiryNumber} - ${payload.productName}`);
    console.log('│ Content HTML Outline:');
    console.log(`│   Reference: ${payload.enquiryNumber}`);
    console.log(`│   Customer: ${payload.customerName} (${payload.customerPhone} | ${payload.customerEmail})`);
    console.log(`│   Preferred Contact Method: ${payload.preferredContact}`);
    console.log(`│   Message: ${payload.message || 'None'}`);
    console.log('└────────────────────────────────────────────────────────────────────┘\n');

    console.log('\n┌──────────────────── SIMULATED EMAIL TO CUSTOMER ────────────────────┐');
    console.log(`│ To Customer Email: ${payload.customerEmail}`);
    console.log(`│ Subject: Enquiry Received - Reference: ${payload.enquiryNumber} | Maison & Co`);
    console.log('│ Content HTML Outline:');
    console.log(`│   Dear ${payload.customerName},`);
    console.log(`│   Thank you for your enquiry on ${payload.productName}.`);
    console.log(`│   Reference code: ${payload.enquiryNumber}`);
    console.log(`│   Preferred contact: We will contact you via ${payload.preferredContact} in 24 hrs.`);
    console.log('└─────────────────────────────────────────────────────────────────────┘\n');
  }
}
