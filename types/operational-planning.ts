import type {
  OperationalPlanning as PrismaOperationalPlanning,
  IntroductionSection,
  PlanningTarget,
  Location,
  Image,
  PlanningAssignment,
  User,
  OperationalFunction as PrismaOperationalFunction,
  Vehicle as PrismaVehicle,
  PlanningScheduleItem,
  MedicalPlan,
  CommunicationsPlan,
} from '@/lib/generated/prisma';

// Define tipos explícitos para modelos com relações
export type PlanningTargetWithRelations = PlanningTarget & {
  location: Location;
  images: Image[];
};

export type PlanningAssignmentWithRelations = PlanningAssignment & {
  user: User;
  functions: PrismaOperationalFunction[];
  vehicle: PrismaVehicle | null;
};

export type MedicalPlanWithRelations = MedicalPlan & {
  hospitalLocation: Location;
  ambulanceVehicle: PrismaVehicle;
};

// Este é o nosso tipo principal, agora totalmente explícito
export type OperationalPlanningWithRelations = PrismaOperationalPlanning & {
  introduction: IntroductionSection | null;
  targets: PlanningTargetWithRelations[];
  assignments: PlanningAssignmentWithRelations[];
  scheduleItems: PlanningScheduleItem[];
  medicalPlan: MedicalPlanWithRelations | null;
  communicationsPlan: CommunicationsPlan | null;
  createdBy: User;
  responsible: User;
};

// Adiciona a propriedade opcional 'isOptimistic' que usamos na UI
export type OperationalPlanning = OperationalPlanningWithRelations & {
  isOptimistic?: boolean;
};

// Exporta tipos individuais para uso em outros lugares, se necessário
export type { Location, Image, MedicalPlan };

// Tipos individuais extendidos para incluir a flag otimista da UI
export type OperationalFunction = PrismaOperationalFunction & {
  isOptimistic?: boolean;
};

export type Vehicle = PrismaVehicle & {
  isOptimistic?: boolean;
};
