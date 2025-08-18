import type { User } from "@/types/auth";

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Handle specific error messages from API if needed
      console.error("Authentication failed:", response.statusText);
      return null;
    }

    const user: User = await response.json();
    // Convert createdAt string to Date object
    return {
      ...user,
      createdAt: new Date(user.createdAt),
    };
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
};
