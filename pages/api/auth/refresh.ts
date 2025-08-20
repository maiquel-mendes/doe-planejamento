import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await prisma.refreshToken.findUnique({
      where: { hashedToken: hashedRefreshToken },
      include: { user: true }, // Include user data
    });

    if (!storedToken || storedToken.revoked) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token.' });
    }

    // Now we have the user object from the token relation
    const { user } = storedToken;

    // At this point, the refresh token is valid. Generate a new access token.
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role }, // Use the correct role from the user object
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
