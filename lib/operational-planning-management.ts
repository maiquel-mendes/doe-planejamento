import type {
  OperationalPlanning,
  OperationalPlanningWithRelations,
} from "@/types/operational-planning";
import { api } from "@/lib/api";
import type { PlanningFormData } from "@/hooks/use-operational-planning-form";

// Helper to recursively parse date strings into Date objects
function parseDatesInObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => parseDatesInObject(item));
  }

  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(value)) {
        // Basic ISO 8601 check
        newObj[key] = new Date(value);
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = parseDatesInObject(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
}

export const getAllOperationalPlannings = async (): Promise<
  OperationalPlanning[]
> => {
  const response = await api("/api/plannings");
  if (!response.ok) {
    throw new Error("Failed to fetch plannings");
  }
  const data: OperationalPlanning[] = await response.json();
  return data.map(planning => parseDatesInObject(planning));
};

export const getOperationalPlanningById = async (
  id: string,
): Promise<OperationalPlanning | null> => {
  const response = await api(`/api/plannings/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch planning with ID ${id}`);
  }
  const data: OperationalPlanning = await response.json();
  return parseDatesInObject(data);
};

// O tipo de entrada para criação agora é PlanningFormData
export const createOperationalPlanning = async (
  data: PlanningFormData,
): Promise<OperationalPlanning> => {
  const response = await api("/api/plannings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to create planning: ${errorData.message || "Unknown error"}`,
    );
  }
  const newPlanning: OperationalPlanning = await response.json();
  return parseDatesInObject(newPlanning);
};

export const updateOperationalPlanning = async (
  id: string,
  data: Partial<PlanningFormData>,
): Promise<OperationalPlanning | null> => {
  const response = await api(`/api/plannings/${id}`, {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to update planning: ${errorData.message || "Unknown error"}`,
    );
  }
  const updatedPlanning: OperationalPlanning = await response.json();
  return parseDatesInObject(updatedPlanning);
};

export const deleteOperationalPlanning = async (
  id: string,
): Promise<boolean> => {
  const response = await api(`/api/plannings/${id}`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return true;
  }

  if (!response.ok) {
    throw new Error(`Failed to delete planning with ID ${id}`);
  }
  return true;
};