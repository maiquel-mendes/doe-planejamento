import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const plannings = await prisma.operationalPlanning.findMany();
      res.status(200).json(plannings);
    } catch (error) {
      console.error('Error fetching plannings:', error);
      res.status(500).json({ message: 'Failed to fetch plannings' });
    }
  } else if (req.method === 'POST') {
    try {
      const newPlanningData = req.body;
      // Ensure that nested JSON fields are correctly parsed if they come as strings
      // Prisma handles JSON fields automatically if the input is a valid JSON object
      const newPlanning = await prisma.operationalPlanning.create({
        data: {
          ...newPlanningData,
          // Convert Date strings back to Date objects if necessary, though Prisma usually handles this
          createdAt: new Date(newPlanningData.createdAt || Date.now()),
          updatedAt: new Date(newPlanningData.updatedAt || Date.now()),
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
