import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';


export async function POST(request) {
  try {
     await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }
    // compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Authentication successful',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}