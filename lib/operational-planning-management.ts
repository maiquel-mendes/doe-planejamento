import type { OperationalPlanning } from "@/types/operational-planning";

// Helper to convert date strings to Date objects
function parseDates(planning: any): OperationalPlanning {
  return {
    ...planning,
    createdAt: new Date(planning.createdAt),
    updatedAt: new Date(planning.updatedAt),
    // Recursively parse dates in nested objects if necessary,
    // but for now, only top-level dates are handled by Prisma's default
    // and our API routes. If nested dates are stored as strings,
    // they would need similar parsing.
  };
}

export const getAllOperationalPlannings = async (): Promise<
  OperationalPlanning[]
> => {
  const response = await fetch("/api/plannings");
  if (!response.ok) {
    throw new Error("Failed to fetch plannings");
  }
  const data: OperationalPlanning[] = await response.json();
  return data.map(parseDates);
};

export const getOperationalPlanningById = async (
  id: string,
): Promise<OperationalPlanning | null> => {
  const response = await fetch(`/api/plannings/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch planning with ID ${id}`);
  }
  const data: OperationalPlanning = await response.json();
  return parseDates(data);
};

export const createOperationalPlanning = async (
  data: Omit<OperationalPlanning, "id" | "createdAt" | "updatedAt">, // Omit generated fields
  createdBy: string,
): Promise<OperationalPlanning> => {
  const response = await fetch("/api/plannings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, createdBy, createdAt: new Date(), updatedAt: new Date() }), // Send dates as ISO strings
  });
  if (!response.ok) {
    throw new Error("Failed to create planning");
  }
  const newPlanning: OperationalPlanning = await response.json();
  return parseDates(newPlanning);
};

export const updateOperationalPlanning = async (
  id: string,
  data: Partial<OperationalPlanning>,
): Promise<OperationalPlanning | null> => {
  const response = await fetch(`/api/plannings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to update planning with ID ${id}`);
  }
  const updatedPlanning: OperationalPlanning = await response.json();
  return parseDates(updatedPlanning);
};

export const deleteOperationalPlanning = async (
  id: string,
): Promise<boolean> => {
  const response = await fetch(`/api/plannings/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete planning with ID ${id}`);
  }
  return true; // 204 No Content
};

