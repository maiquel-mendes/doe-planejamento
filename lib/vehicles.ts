import type { Vehicle } from "@/types/operational-planning";

// Helper to convert date strings to Date objects
function parseDates(vehicle: any): Vehicle {
  return {
    ...vehicle,
    createdAt: new Date(vehicle.createdAt),
    updatedAt: new Date(vehicle.updatedAt),
  };
}

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch("/api/vehicles");
  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }
  const data: Vehicle[] = await response.json();
  return data.map(parseDates);
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const response = await fetch(`/api/vehicles/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle with ID ${id}`);
  }
  const data: Vehicle = await response.json();
  return parseDates(data);
};

export const createVehicle = async (
  data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
): Promise<Vehicle> => {
  const response = await fetch("/api/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create vehicle");
  }
  const newVehicle: Vehicle = await response.json();
  return parseDates(newVehicle);
};

export const updateVehicle = async (
  id: string,
  data: Partial<Vehicle>,
): Promise<Vehicle | null> => {
  const response = await fetch(`/api/vehicles/${id}`, {
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
    throw new Error(`Failed to update vehicle with ID ${id}`);
  }
  const updatedVehicle: Vehicle = await response.json();
  return parseDates(updatedVehicle);
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete vehicle with ID ${id}`);
  }
  return true; // 204 No Content
};
