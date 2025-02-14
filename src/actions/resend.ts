"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(name: string, message: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "info@halisi.co.uk",
      to: ["info@halisi.co.uk"],
      subject: `New Enquiry Received from ${name}`,
      html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2F2F2F; font-size: 28px; font-weight: 600; margin: 0 0 15px 0;">New Enquiry</h1>
    <div style="height: 4px; width: 60px; background: #6366F1; margin: 0 auto; border-radius: 2px;"></div>
  </div>

  <div style="background: #F8FAFC; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
    <div style="margin-bottom: 20px;">
      <h2 style="color: #64748B; font-size: 14px; font-weight: 500; margin: 0 0 8px 0; text-transform: uppercase;">Email</h2>
      <p style="color: #1E293B; font-size: 16px; font-weight: 500; margin: 0; text-decoration: none;">
        ${email}
      </p>
    </div>

    <div>
      <h2 style="color: #64748B; font-size: 14px; font-weight: 500; margin: 0 0 8px 0; text-transform: uppercase;">Message</h2>
      <div style="background: white; padding: 16px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
        <p style="color: #475569; font-size: 15px; line-height: 1.5; margin: 0;">
          ${message}
        </p>
      </div>
    </div>
  </div>

  <p style="text-align: center; font-size: 13px; color: #94A3B8; margin: 25px 0 0 0;">
    This message was sent from your website contact form
  </p>
</div>
    `,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
