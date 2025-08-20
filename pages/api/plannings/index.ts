import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { user } = req; // User is attached by the middleware

  if (req.method === 'GET') {
    try {
      const plannings = await prisma.operationalPlanning.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(plannings);
    } catch (error) {
      console.error('Error fetching plannings:', error);
      res.status(500).json({ message: 'Failed to fetch plannings' });
    }
  } else if (req.method === 'POST') {
    try {
      const newPlanningData = req.body;
      const newPlanning = await prisma.operationalPlanning.create({
        data: {
          ...newPlanningData,
          createdBy: user.id, // Set the creator from the authenticated user
          responsibleId: user.id, // Or determine this based on specific logic
          responsibleName: 'TBD', // You might want to fetch user's name
        },
      });
      res.status(201).json(newPlanning);
    } catch (error) {
      console.error('Error creating planning:', error);
      res.status(500).json({ message: 'Failed to create planning' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler);
