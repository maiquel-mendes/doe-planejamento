import type { Prisma } from '@prisma/client';
import type {
  Location,
  Vehicle as PrismaVehicle, // Alias original Vehicle
  OperationalFunction as PrismaOperationalFunction, // Alias original OperationalFunction
  PlanningTarget,
  PlanningAssignment as PrismaPlanningAssignment, // Alias original PlanningAssignment
  MedicalPlan,
} from '@prisma/client';

// Define a type for PlanningAssignment that includes the functions relation
export type PlanningAssignmentWithFunctions = PrismaPlanningAssignment & {
  functions: OperationalFunction[]; // Explicitly include the many-to-many relation
};

// Define um 'include' reutilizável para todas as relações do planejamento
const operationalPlanningWithRelations = {
  include: {
    introduction: {
      select: {
        id: true,
        serviceOrderNumber: true,
        operationType: true,
        description: true,
        supportUnit: true,
        mandateType: true,
        operationDate: true,
        operationTime: true,
      },
    },
    targets: {
      include: {
        location: true,
      },
    },
    assignments: {
      include: {
        user: true,
        functions: true, // Ensure this is 'functions'
        vehicle: true,
      },
    },
    scheduleItems: true,
    medicalPlan: {
      include: {
        hospitalLocation: true,
        ambulanceVehicle: true,
      },
    },
    createdBy: true,
    responsible: true,
  },
};

// Gera o tipo completo do planejamento operacional com todas as suas relações
export type OperationalPlanningWithRelations = Prisma.OperationalPlanningGetPayload<
  typeof operationalPlanningWithRelations
> & {
  // Override assignments to use the new type
  assignments: PlanningAssignmentWithFunctions[];
};

// Adiciona a propriedade opcional 'isOptimistic' que usamos na UI
export type OperationalPlanning = OperationalPlanningWithRelations & {
  isOptimistic?: boolean;
};

// Exporta tipos individuais para uso em outros lugares, se necessário
export type { Location, PlanningTarget, MedicalPlan };

// Tipos individuais extendidos para incluir a flag otimista da UI
export type OperationalFunction = PrismaOperationalFunction & {
  isOptimistic?: boolean;
};

export type Vehicle = PrismaVehicle & {
  isOptimistic?: boolean;
};
