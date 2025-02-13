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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #333; text-align: center;">New Enquiry</h1>
        
        <div style="background: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #555; margin-top: 15px; margin-bottom: 5px;">Email:</h2>
          <p style="font-size: 16px; color: #007bff; font-weight: bold;">${email}</p>
          
          <h2 style="color: #555; margin-top: 15px; margin-bottom: 5px;">Message:</h2>
          <p style="font-size: 16px; color: #444; background: #eef2ff; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
    
        <p style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">
          This message was sent from your website contact form.
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
