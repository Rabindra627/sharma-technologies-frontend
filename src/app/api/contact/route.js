import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    // 0. Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // 1. Establish database connection early
    await connectDB();

    // 2. Set up the email transporter
    const transporter = nodemailer.createTransport({
      host: "mail.sharmatechnologies.com",
      port: 465,
      secure: true, // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. HTML mail content for Internal Team (from info@)
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6f9; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; border: 1px solid #e1e5eb; }
              .header { background-color: #0f172a; color: #ffffff; padding: 25px; text-align: center; }
              .header h2 { margin: 0; font-size: 22px; }
              .content { padding: 30px; }
              .field-group { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f2f5; }
              .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px; display: block; }
              .value { font-size: 15px; color: #0f172a; line-height: 1.5; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header"><h2>New Client Inquiry - Sharma Technologies</h2></div>
              <div class="content">
                  <div class="field-group">
                      <span class="label">Full Name</span>
                      <div class="value">${name}</div>
                  </div>
                  <div class="field-group">
                      <span class="label">Email Address</span>
                      <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
                  </div>
                  <div class="field-group">
                      <span class="label">Subject</span>
                      <div class="value">${subject || "General Inquiry"}</div>
                  </div>
                  <div class="field-group">
                      <span class="label">Message</span>
                      <div class="value" style="white-space: pre-wrap;">${message}</div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    // 4. HTML mail content for User Auto-Acknowledgment (from support@)
    const clientHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6f9; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; border: 1px solid #e1e5eb; }
              .header { background-color: #1e293b; color: #ffffff; padding: 25px; text-align: center; }
              .header h2 { margin: 0; font-size: 22px; }
              .content { padding: 30px; }
              .message-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic; color: #475569; }
              .footer { padding: 20px 30px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e1e5eb; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header"><h2>We Received Your Message!</h2></div>
              <div class="content">
                  <p>Hi <strong>${name}</strong>,</p>
                  <p>Thank you for reaching out to <strong>Sharma Technologies</strong>. We have safely received your inquiry and our engineering team is reviewing your message.</p>
                  <p>We typically respond within 24 business hours. For your reference, here is a copy of the message you sent us:</p>
                  <div class="message-box">
                      "${message}"
                  </div>
                  <p>Best regards,</p>
                  <p><strong>Support Team</strong><br>Sharma Technologies</p>
              </div>
              <div class="footer">
                  &copy; ${new Date().getFullYear()} Sharma Technologies. All rights reserved.
              </div>
          </div>
      </body>
      </html>
    `;

    // 5. Send Internal Notification Email (from info@sharmatechnologies.com)
    await transporter.sendMail({
      from: `"Sharma Technologies Notifications" <info@sharmatechnologies.com>`,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `[Inquiry] ${subject ? subject : "New Website Message"} - ${name}`,
      html: adminHtmlContent,
    });

    // 6. Send Auto-Reply to the Client (from support@sharmatechnologies.com)
    await transporter.sendMail({
      from: `"Sharma Technologies Support" <support@sharmatechnologies.com>`,
      to: email,
      subject: `We've received your message - Sharma Technologies`,
      html: clientHtmlContent,
    });

    // 7. Save to Database after successful dispatch
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return Response.json(
      {
        success: true,
        data: contact,
        message: "Message sent and saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Failed to process request",
      },
      { status: 500 }
    );
  }
}