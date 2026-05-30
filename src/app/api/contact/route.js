import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    console.log(email);
    await connectDB();

    // Save in database
    await Contact.create({
      name,
      email,
      message,
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: "rabindra.onlinework@gmail.com",
      subject: "New Contact Message",
      html: `
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}