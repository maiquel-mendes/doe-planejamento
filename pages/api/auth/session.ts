import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // The user ID is attached to the request by the authenticateToken middleware
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Session API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Wrap the handler with the authentication middleware
export default authenticateToken(handler);
