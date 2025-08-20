import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const functions = await prisma.operationalFunction.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      res.status(200).json(functions);
    } catch (error) {
      console.error('Error fetching functions:', error);
      res.status(500).json({ message: 'Failed to fetch functions' });
    }
  } else if (req.method === 'POST') {
    try {
      const newFunctionData = req.body;
      const newFunction = await prisma.operationalFunction.create({
        data: newFunctionData,
      });
      res.status(201).json(newFunction);
    } catch (error) {
      console.error('Error creating function:', error);
      res.status(500).json({ message: 'Failed to create function' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authenticateToken(handler);
