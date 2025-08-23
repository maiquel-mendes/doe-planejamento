import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import crypto from 'node:crypto';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Use findFirst instead of findUnique as hashedToken is not unique by itself
    const storedToken = await prisma.refreshToken.findFirst({
      where: { hashedToken: hashedRefreshToken, revoked: false },
      include: { user: true }, // Include user data
    });

    if (!storedToken || !storedToken.user) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token' });
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error(
        'JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables.',
      );
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: storedToken.user.id, role: storedToken.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    // Optionally, rotate the refresh token (invalidate old, create new)
    // For simplicity, we're just issuing a new access token here.

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear the cookie on error to prevent infinite loops with invalid tokens
    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax' as const,
        maxAge: 0, // Expire the cookie immediately
      }),
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
}