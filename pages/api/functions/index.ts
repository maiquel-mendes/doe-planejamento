import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const functions = await prisma.operationalFunction.findMany();
      res.status(200).json(functions);
    } catch (error) {
      console.error('Error fetching functions:', error);
      res.status(500).json({ message: 'Failed to fetch functions' });
    }
  } else if (req.method === 'POST') {
    try {
      const newFunctionData = req.body;
      const newFunction = await prisma.operationalFunction.create({
        data: {
          ...newFunctionData,
          createdAt: new Date(newFunctionData.createdAt || Date.now()),
          updatedAt: new Date(newFunctionData.updatedAt || Date.now()),
        },
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
