import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.cookies.token;

  console.log('Session API: Received token:', token ? 'YES' : 'NO');
  if (token) {
    console.log('Session API: Token value (first 10 chars):', token.substring(0, 10) + '...');
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; role: string; };
    console.log('Session API: Token decoded successfully:', decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }, // Select public user data
    });

    if (!user) {
      console.log('Session API: User not found for decoded ID.');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Session API: User found, returning data.');
    res.status(200).json(user);
  } catch (error) {
    console.error('Session API: Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
