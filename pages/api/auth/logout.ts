import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { hashedToken: hashedRefreshToken },
        data: { revoked: true },
      });
    } catch (error) {
      // Log the error but don't block the logout process
      console.error('Error revoking refresh token:', error);
    }
  }

  // Clear the refresh token cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax' as const,
    maxAge: -1, // Expire the cookie immediately
  };

  res.setHeader('Set-Cookie', serialize('refreshToken', '', cookieOptions));
  res.status(200).json({ message: 'Logged out successfully' });
}
