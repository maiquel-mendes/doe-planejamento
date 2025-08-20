import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: {
          prefix: 'asc',
        },
      });
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
  } else if (req.method === 'POST') {
    try {
      const newVehicleData = req.body;
      const newVehicle = await prisma.vehicle.create({
        data: newVehicleData,
      });
      res.status(201).json(newVehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ message: 'Failed to create vehicle' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler);
