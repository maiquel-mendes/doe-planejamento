import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const vehicles = await prisma.vehicle.findMany();
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
  } else if (req.method === 'POST') {
    try {
      const newVehicleData = req.body;
      const newVehicle = await prisma.vehicle.create({
        data: {
          ...newVehicleData,
          createdAt: new Date(newVehicleData.createdAt || Date.now()),
          updatedAt: new Date(newVehicleData.updatedAt || Date.now()),
        },
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
