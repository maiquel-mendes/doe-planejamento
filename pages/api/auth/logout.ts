import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Clear the token cookie by setting its expiration to a past date
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = req.headers.host?.split(':')[0]; // Get hostname without port

  res.setHeader(
    'Set-Cookie',
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure=${isProduction}`,
  );
  res.status(200).json({ message: 'Logged out successfully' });
}
