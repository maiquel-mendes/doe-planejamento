import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import crypto from 'node:crypto';
import { serialize } from 'cookie';

/**
 * Handles user login requests.
 * @param req The NextApiRequest object.
 * @param res The NextApiResponse object.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error(
        'JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables.',
      );
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // 1. Create Access Token (short-lived)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }, // Expires in 15 minutes
    );

    // 2. Create Refresh Token (long-lived)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // 3. Store Refresh Token in the database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        hashedToken: hashedRefreshToken,
      },
    });

    // 4. Set Refresh Token in HttpOnly Cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      path: '/',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', refreshToken, cookieOptions),
    );

    // 5. Send Access Token in the response body
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
