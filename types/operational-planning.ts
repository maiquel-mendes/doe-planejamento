// Tipos específicos para planejamento operacional policial

export interface OperationalFunction {
  id: string;
  name: string;
  description: string;
  category: "entrada" | "apoio" | "comando" | "especializada";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isOptimistic?: boolean;
}

export interface Vehicle {
  id: string;
  prefix: string;
  type: "viatura" | "moto" | "van" | "blindado";
  model: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isOptimistic?: boolean;
}

export interface OperationalAssignment {
  id: string;
  operatorId: string;
  operatorName: string;
  assignedFunctions: { id: string; name: string; category: OperationalFunction['category']; }[];
  vehicleId?: string | null;
  vehiclePrefix?: string;
  order: number;
}

export interface Target {
  id: string;
  name: string;
  alias?: string;
  address: string;
  coordinates?: string;
  description?: string;
  images?: string[];
  observations?: string;
}

export interface TimeSchedule {
  id: string;
  time: string;
  activity: string;
  location?: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance?: string;
  duration?: string;
  coordinates?: string;
  mapUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: string;
  type: "alvo" | "drop_off" | "hospital" | "base";
  phone?: string;
  mapUrl?: string;
}

export interface OperationalPlanning {
  id: string;
  // Seções do planejamento
  introduction: {
    serviceOrderNumber: string;
    operationType: string;
    description: string;
    supportUnit: string;
    mandateType: string;
    operationDate: string;
    operationTime: string;
  };

  targets: Target[];
  images: Image[]; // <-- Add this line
  assignments: OperationalAssignment[];
  schedule: TimeSchedule[];
  communications: {
    vehicleCall: string;
    operatorCall: string;
  };

  peculiarities: {
    searchObjects: string[];
    observations: string;
    risks: string;
  };

  medical: {
    medic: string;
    medicId: string;
    vehicleForTransport: string;
    hospitalContact: string;
    procedures: string;
  };

  complementaryMeasures: string[];
  routes: Route[];
  locations: Location[];

  // Metadados
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  createdBy: string;
  responsibleId: string;
  responsibleName: string;
  createdAt: Date;
  updatedAt: Date;
  isOptimistic?: boolean;
}

export interface Image {
  id: string;
  url: string;
  description: string;
  type: string;
}
