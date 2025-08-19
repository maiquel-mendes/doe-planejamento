import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Planning ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const planning = await prisma.operationalPlanning.findUnique({
        where: { id },
      });
      if (!planning) {
        return res.status(404).json({ message: 'Planning not found' });
      }
      res.status(200).json(planning);
    } catch (error) {
      console.error(`Error fetching planning with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to fetch planning' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedPlanningData = req.body;
      const updatedPlanning = await prisma.operationalPlanning.update({
        where: { id },
        data: {
          ...updatedPlanningData,
          updatedAt: new Date(), // Ensure updatedAt is updated
        },
      });
      res.status(200).json(updatedPlanning);
    } catch (error) {
      console.error(`Error updating planning with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to update planning' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.operationalPlanning.delete({
        where: { id },
      });
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      console.error(`Error deleting planning with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to delete planning' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler);
