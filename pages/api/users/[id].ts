import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true },
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedUserData = req.body;
      const { password, ...dataToUpdate } = updatedUserData;

      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({
        where: { id },
      });
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
