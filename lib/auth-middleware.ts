import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

// Define a new interface for requests that have been authenticated.
export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    role: string;
  };
}

// Define the type for a handler that uses the AuthenticatedRequest.
type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

/**
 * Middleware to authenticate a token from the Authorization header.
 * @param handler The handler to be executed if authentication is successful.
 */
export const authenticateToken = (handler: AuthenticatedHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
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
      
      // Attach user information to the request object.
      (req as AuthenticatedRequest).user = { id: decoded.userId, role: decoded.role };
      
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // If the token is expired, send 401 so the client can try to refresh it
        return res.status(401).json({ message: "Token expired" });
      }
      // For other errors (e.g., invalid signature), send 403
      console.error("Token verification failed:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};
