import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
  userRole?: string;
}

export const authenticateToken = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        role: string;
      };
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      return handler(req, res);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
