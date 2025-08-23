import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Location, OperationalPlanningWithRelations, OperationalFunction } from '@/types/operational-planning';

// Reusable Zod schema for a location
const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "O nome do local é obrigatório."),
  address: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
});

// Zod Schema for validation
const planningSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  peculiarities: z.string().optional(),
  introduction: z.object({
    serviceOrderNumber: z.string(),
    operationType: z.string(),
    description: z.string(),
    supportUnit: z.string(),
    mandateType: z.string(),
    operationDate: z.string(),
    operationTime: z.string(),
  }).optional(),
  targets: z.array(z.object({
    id: z.string().optional(),
    targetName: z.string(),
    description: z.string().optional(),
    location: locationSchema,
  })).optional(),
  assignments: z.array(z.object({
    id: z.string().optional(),
    userId: z.string().min(1, "O operador é obrigatório."),
    vehicleId: z.string().nullable(),
    functionIds: z.array(z.string()).min(1, "Atribua pelo menos uma função."),
  })).optional(),
  scheduleItems: z.array(z.object({
    id: z.string().optional(),
    time: z.date(),
    activity: z.string(),
  })).optional(),
  medicalPlan: z.object({
    id: z.string().optional(),
    procedures: z.string().optional(),
    hospitalLocation: locationSchema,
    ambulanceVehicleId: z.string().min(1, "A viatura de ambulância é obrigatória."),
  }).optional(),
  responsibleId: z.string(),
});

// Type of our form data, inferred from the Zod schema
export type PlanningFormData = z.infer<typeof planningSchema>;

// Blank location for reuse
export const blankLocation = (): z.infer<typeof locationSchema> => ({
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
});

// Default values for a new, blank form
const defaultValues: PlanningFormData = {
  status: 'Draft',
  priority: 'Medium',
  peculiarities: '',
  introduction: {
    serviceOrderNumber: '',
    operationType: '',
    description: '',
    supportUnit: '',
    mandateType: '',
    operationDate: '',
    operationTime: '',
  },
  targets: [],
  assignments: [],
  scheduleItems: [],
  medicalPlan: {
    procedures: '',
    hospitalLocation: blankLocation(),
    ambulanceVehicleId: '',
  },
  responsibleId: '',
};

const mapPlanningToFormData = (planning: OperationalPlanningWithRelations): PlanningFormData => ({
  id: planning.id,
  status: planning.status,
  priority: planning.priority,
  peculiarities: planning.peculiarities || '',
  introduction: planning.introduction ? { ...planning.introduction } : undefined,
  targets: planning.targets.map(t => ({
    id: t.id,
    targetName: t.targetName,
    description: t.description || '',
    location: t.location,
  })),
  assignments: planning.assignments.map(a => ({
    id: a.id,
    userId: a.userId,
    vehicleId: a.vehicleId,
    functionIds: (a.functions as OperationalFunction[]).map((f: OperationalFunction) => f.id),
  })),
  scheduleItems: planning.scheduleItems.map(s => ({
    id: s.id,
    time: new Date(s.time),
    activity: s.activity,
  })),
  medicalPlan: planning.medicalPlan ? {
    id: planning.medicalPlan.id,
    procedures: planning.medicalPlan.procedures,
    hospitalLocation: planning.medicalPlan.hospitalLocation,
    ambulanceVehicleId: planning.medicalPlan.ambulanceVehicleId,
  } : undefined,
  responsibleId: planning.responsibleId,
});

interface UseOperationalPlanningFormProps {
  planning?: OperationalPlanningWithRelations | null;
}

export function useOperationalPlanningForm({ planning }: UseOperationalPlanningFormProps) {
  const form = useForm<PlanningFormData>({
    resolver: zodResolver(planningSchema),
    defaultValues,
  });

  const stableMapPlanningToFormData = useCallback(mapPlanningToFormData, []);

  useEffect(() => {
    if (planning) {
      form.reset(stableMapPlanningToFormData(planning));
    } else {
      form.reset(defaultValues);
    }
  }, [planning, form, stableMapPlanningToFormData]);

  return { form };
}