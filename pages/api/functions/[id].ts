import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Function ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const func = await prisma.operationalFunction.findUnique({
        where: { id },
      });
      if (!func) {
        return res.status(404).json({ message: 'Function not found' });
      }
      res.status(200).json(func);
    } catch (error) {
      console.error(`Error fetching function with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to fetch function' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedFunctionData = req.body;
      const updatedFunction = await prisma.operationalFunction.update({
        where: { id },
        data: {
          ...updatedFunctionData,
          updatedAt: new Date(),
        },
      });
      res.status(200).json(updatedFunction);
    } catch (error) {
      console.error(`Error updating function with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to update function' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.operationalFunction.delete({
        where: { id },
      });
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting function with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to delete function' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
