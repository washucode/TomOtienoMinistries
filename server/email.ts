import nodemailer from 'nodemailer';

interface EmailConfig {
  user: string;
  pass: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.warn('Email service not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  async sendRegistrationNotification(
    ministryType: string,
    registrationData: {
      fullName: string;
      email: string;
      phone: string;
      message?: string;
    }
  ): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not configured. Skipping email notification.');
      return false;
    }

    const ministryNames: Record<string, string> = {
      'deal-to-heal': 'Deal to Heal',
      'master-class': 'Master Class',
      'proskuneo': 'Proskuneo Worship',
      'understanding-dreams': 'Understanding Dreams',
    };

    const ministryName = ministryNames[ministryType] || ministryType;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'revtotieno@gmail.com',
      subject: `New Registration: ${ministryName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 3px solid #ec4899; padding-bottom: 10px;">
            New Registration Received
          </h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Ministry Program</h3>
            <p style="font-size: 18px; font-weight: bold; color: #374151;">${ministryName}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #1e40af;">Participant Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Full Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${registrationData.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${registrationData.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${registrationData.phone}</td>
              </tr>
              ${registrationData.message ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px;">${registrationData.message}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Action Required:</strong> Please follow up with this participant to confirm their registration.
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated notification from your ministry website registration system.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Registration notification sent for ${ministryName}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
