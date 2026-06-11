import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();
    const normalizedEmail = email.toLowerCase().trim();

    console.log(normalizedEmail);

    // Query native driver collection directly
    const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const result = await db.collection('users').insertOne({
      name : name || '',
      email: normalizedEmail,
      passwordHash: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'User registered successfully!', userId : result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}