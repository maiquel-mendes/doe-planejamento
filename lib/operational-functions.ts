import type { OperationalFunction } from "@/types/operational-planning";

// Helper to convert date strings to Date objects
function parseDates(func: any): OperationalFunction {
  return {
    ...func,
    createdAt: new Date(func.createdAt),
    updatedAt: new Date(func.updatedAt),
  };
}

export const getAllFunctions = async (): Promise<OperationalFunction[]> => {
  const response = await fetch("/api/functions");
  if (!response.ok) {
    throw new Error("Failed to fetch functions");
  }
  const data: OperationalFunction[] = await response.json();
  return data.map(parseDates);
};

export const getFunctionById = async (
  id: string,
): Promise<OperationalFunction | null> => {
  const response = await fetch(`/api/functions/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch function with ID ${id}`);
  }
  const data: OperationalFunction = await response.json();
  return parseDates(data);
};

export const createFunction = async (
  data: Omit<OperationalFunction, "id" | "createdAt" | "updatedAt">,
): Promise<OperationalFunction> => {
  const response = await fetch("/api/functions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create function");
  }
  const newFunction: OperationalFunction = await response.json();
  return parseDates(newFunction);
};

export const updateFunction = async (
  id: string,
  data: Partial<OperationalFunction>,
): Promise<OperationalFunction | null> => {
  const response = await fetch(`/api/functions/${id}`, {
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
    throw new Error(`Failed to update function with ID ${id}`);
  }
  const updatedFunction: OperationalFunction = await response.json();
  return parseDates(updatedFunction);
};

export const deleteFunction = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/functions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete function with ID ${id}`);
  }
  return true; // 204 No Content
};
