import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Vehicle ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to fetch vehicle' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedVehicleData = req.body;
      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          ...updatedVehicleData,
          updatedAt: new Date(),
        },
      });
      res.status(200).json(updatedVehicle);
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to update vehicle' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.vehicle.delete({
        where: { id },
      });
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to delete vehicle' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler);
