import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';



export async function POST(request) {
  try {
     await connectDB();
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const normalizedEmail = body.email.toLowerCase().trim();

    console.log(normalizedEmail);

    // Query native driver collection directly
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const result = await User.create({
      name : body.name || '',
      email: normalizedEmail,
      password: hashedPassword,
      avatarUrl : '',
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'User registered successfully!', userId : result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}