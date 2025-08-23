import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, type AuthenticatedRequest, type AuthenticatedHandler } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const locations = await prisma.location.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      res.status(200).json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Failed to fetch locations' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler as AuthenticatedHandler);
