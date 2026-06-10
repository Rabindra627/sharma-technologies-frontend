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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
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