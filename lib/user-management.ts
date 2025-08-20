import type { User } from "@/types/auth";

// Helper to convert date strings to Date objects
function parseDates(user: any): User {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
  };
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data: User[] = await response.json();
  return data.map(parseDates);
};

export const createUser = async (
  userData: Omit<User, "id" | "createdAt" | "isActive"> & { password: string },
): Promise<User> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  const newUser: User = await response.json();
  return parseDates(newUser);
};

export const updateUser = async (
  id: string,
  userData: Partial<Omit<User, "createdAt"> & { password?: string }>,
): Promise<User | null> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to update user with ID ${id}`);
  }
  const updatedUser: User = await response.json();
  return parseDates(updatedUser);
};

export const toggleUserStatus = async (id: string): Promise<User | null> => {
  // First, get the current user to know the current isActive status
  const userResponse = await fetch(`/api/users/${id}`);
  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user with ID ${id} for status toggle`);
  }
  const currentUser: User = await userResponse.json();

  // Toggle the isActive status
  const updatedStatus = !currentUser.isActive;

  // Send a PUT request to update only the isActive status
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive: updatedStatus }),
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to toggle user status for ID ${id}`);
  }
  const updatedUser: User = await response.json();
  return parseDates(updatedUser);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const response = await fetch(`/api/users/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${id}`);
  }
  const data: User = await response.json();
  return parseDates(data);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete user with ID ${id}`);
  }
  return true; // 204 No Content
};
