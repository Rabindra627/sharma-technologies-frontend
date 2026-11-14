import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    await connectDB();

    // Configured for Titan Email (BigRock)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., smtp.titan.email
      port: process.env.EMAIL_PORT, // e.g., 465
      secure: true, // true for port 465 (SSL/TLS)
      auth: {
        user: process.env.EMAIL_USER, // e.g., info@sharmatechnologies.com
        pass: process.env.EMAIL_PASS, // Your Titan email password
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
          <h2>New Client Inquiry - Sharma Technologies</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <p><strong>Message:</strong><br>${message}</p>
      </body>
      </html>
    `;

    const clientHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
          <h2>We Received Your Message!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to Sharma Technologies. We have received your message and will get back to you soon.</p>
      </body>
      </html>
    `;

    // Send emails concurrently
    await Promise.all([
      transporter.sendMail({
        from: `"Sharma Technologies Notifications" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.EMAIL_USER, // Where admin notifications go
        subject: `[Inquiry] ${subject ? subject : "New Website Message"} - ${name}`,
        html: adminHtmlContent,
      }),
      transporter.sendMail({
        from: `"Sharma Technologies Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We've received your message - Sharma Technologies`,
        html: clientHtmlContent,
      }),
    ]);

    const contact = await Contact.create({ name, email, subject, message });

    return Response.json(
      { success: true, data: contact, message: "Message sent and saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return Response.json(
      { success: false, message: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}