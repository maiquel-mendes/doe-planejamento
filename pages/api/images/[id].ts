import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/auth-middleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query; // This is the Image ID from our database

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Image ID is required' });
  }

  if (req.method === 'DELETE') {
    try {
      // 1. Find the image in our database to get its publicId
      const imageToDelete = await prisma.image.findUnique({
        where: { id },
      });

      if (!imageToDelete) {
        return res.status(404).json({ message: 'Image not found in database' });
      }

      // 2. Delete the image from Cloudinary
      // The publicId is usually the file name without extension, or the full path if in a folder
      // Cloudinary's destroy method expects the publicId
      const cloudinaryResult = await cloudinary.uploader.destroy(imageToDelete.publicId);

      if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
        // If Cloudinary reports an error other than 'not found' (which means it was already gone)
        console.error("Error deleting image from Cloudinary:", cloudinaryResult);
        return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
      }

      // 3. Delete the image record from our database
      await prisma.image.delete({
        where: { id },
      });

      return res.status(204).end(); // No Content

    } catch (error) {
      console.error(`Error deleting image with ID ${id}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: 'Failed to delete image', error: errorMessage });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default authenticateToken(handler);
