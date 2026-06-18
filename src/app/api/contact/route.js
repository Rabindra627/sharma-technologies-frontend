import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Html mail content

    const htmlContent = `
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
              .field-group { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f2f5; }
              .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px; display: block; }
              .value { font-size: 15px; color: #0f172a; line-height: 1.5; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header"><h2>New Website Inquiry</h2></div>
              <div class="content">
                  <div class="field-group">
                      <span class="label">Full Name</span>
                      <div class="value">${name}</div>
                  </div>
                  <div class="field-group">
                      <span class="label">Email Address</span>
                      <div class="value">${email}</div>
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `New Inquiry Initiative by ${name}`,
      html:htmlContent
    });

    return Response.json(
      {
        success: true,
        data: contact,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}