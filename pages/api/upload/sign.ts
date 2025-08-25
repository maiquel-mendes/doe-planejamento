import { v2 as cloudinary } from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type SignatureResponse = {
  signature: string;
  timestamp: number;
} | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    return res.status(500).json({ error: 'Cloudinary API secret not configured.' });
  }

  try {
    const paramsToSign = req.body.params_to_sign;

    if (!paramsToSign) {
        return res.status(400).json({ error: 'Missing params_to_sign in request body' });
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    res.status(200).json({ signature, timestamp: paramsToSign.timestamp });

  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}
