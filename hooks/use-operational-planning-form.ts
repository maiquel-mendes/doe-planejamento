import { useCallback, useEffect, useState } from 'react';
import type {
  Location,
  OperationalAssignment,
  OperationalPlanning,
  Route,
  Target,
  TimeSchedule,
  OperationalFunction,
  Vehicle,
} from '@/types/operational-planning';
import type { User } from '@/types/auth';

// --- Helper: blank objects with all required fields ---
const blankTarget = (): Target => ({
  id: '',
  name: '',
  alias: '', // Initialize alias to empty string
  address: '',
});
const blankRoute = (): Route => ({
  id: '',
  name: '',
  origin: '',
  destination: '',
  distance: '',
  duration: '',
});
const blankLocation = (): Location => ({
  id: '',
  name: '',
  address: '',
  coordinates: '',
  type: 'alvo',
});

const blankAssignment = (): OperationalAssignment => ({
  id: '',
  operatorId: '',
  operatorName: '',
  assignedFunctions: [],
  order: 0,
  vehicleId: null, // Ensure vehicleId is explicitly null
  vehiclePrefix: '',
});

const blankSchedule = (): TimeSchedule => ({
  id: '',
  time: '',
  activity: '',
});

interface UseOperationalPlanningFormProps {
  planning?: OperationalPlanning | null;
  users: User[];
  functions: OperationalFunction[];
  vehicles: Vehicle[];
}

export function useOperationalPlanningForm({
  planning,
  users,
  functions,
  vehicles,
}: UseOperationalPlanningFormProps) {
  const [formData, setFormData] = useState<OperationalPlanning>(() => {
    const blankFormData: OperationalPlanning = {
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
      images: [],
      id: '',
      assignments: [],
      schedule: [],
      communications: {
        vehicleCall: '',
        operatorCall: '',
      },
      peculiarities: {
        searchObjects: [],
        observations: '',
        risks: '',
      },
      medical: {
        medic: '',
        medicId: '',
        vehicleForTransport: '',
        hospitalContact: '',
        procedures: '',
      },
      complementaryMeasures: [],
      routes: [],
      locations: [],
      status: 'draft',
      priority: 'medium',
      createdBy: '',
      responsibleId: '',
      responsibleName: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return blankFormData;
  });

  // Helper function to map planning data to formData structure
  const mapPlanningToFormData = useCallback((p: OperationalPlanning): OperationalPlanning => {
    const validStatuses = ["draft", "approved", "in_progress", "completed", "cancelled"] as const;
    const validPriorities = ["low", "medium", "high", "critical"] as const;

    return {
      id: p.id,
      introduction: p.introduction,
      targets: p.targets || [],
      assignments: p.assignments || [],
      images: p.images || [],
      schedule: p.schedule || [],
      communications: p.communications,
      peculiarities: p.peculiarities,
      medical: p.medical,
      complementaryMeasures: p.complementaryMeasures || [],
      routes: p.routes || [],
      locations: p.locations || [],
      status: validStatuses.includes(p.status as any) ? p.status as typeof validStatuses[number] : "draft",
      priority: validPriorities.includes(p.priority as any) ? p.priority as typeof validPriorities[number] : "medium",
      createdBy: p.createdBy || '',
      responsibleId: p.responsibleId || '',
      responsibleName: p.responsibleName || '',
      createdAt: p.createdAt || new Date(),
      updatedAt: p.updatedAt || new Date(),
    };
  }, []);

  // useEffect to update formData when planning prop changes
  useEffect(() => {
    if (planning) {
      setFormData(mapPlanningToFormData(planning));
    } else {
      // Reset form for new planning when planning prop becomes null
      setFormData(() => ({
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
        images: [],
        id: '',
        assignments: [],
        schedule: [],
        communications: {
          vehicleCall: '',
          operatorCall: '',
        },
        peculiarities: {
          searchObjects: [],
          observations: '',
          risks: '',
        },
        medical: {
          medic: '',
          medicId: '',
          vehicleForTransport: '',
          hospitalContact: '',
          procedures: '',
        },
        complementaryMeasures: [],
        routes: [],
        locations: [],
        status: 'draft',
        priority: 'medium',
        createdBy: '',
        responsibleId: '',
        responsibleName: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
  }, [planning, mapPlanningToFormData]);

  const [newTarget, setNewTarget] = useState<Target>(blankTarget());
  const [newRoute, setNewRoute] = useState<Route>(blankRoute());
  const [newLocation, setNewLocation] = useState<Location>(blankLocation());
  const [newAssignment, setNewAssignment] = useState<{
    id: string;
    operatorId: string;
    operatorName: string;
    vehicleId?: string | null;
    vehiclePrefix?: string;
    order: number;
    selectedFunction1Id: string;
    selectedFunction2Id: string;
  }>(() => ({
    id: '',
    operatorId: '',
    operatorName: '',
    order: 0,
    selectedFunction1Id: '',
    selectedFunction2Id: '',
  }));
  const [newScheduleItem, setNewScheduleItem] = useState<TimeSchedule>(
    blankSchedule(),
  );
  const [newMeasure, setNewMeasure] = useState('');
  const [newSearchObject, setNewSearchObject] = useState('');

  // --- Handlers ---
  // Targets
  const addTarget = () => {
    if (newTarget.name.trim() && newTarget.address.trim()) {
      setFormData({
        ...formData,
        targets: [
          ...formData.targets,
          { ...newTarget, id: Date.now().toString() },
        ],
      });
      setNewTarget(blankTarget());
    }
  };
  const removeTarget = (id: string) => {
    setFormData({
      ...formData,
      targets: formData.targets.filter((t) => t.id !== id),
    });
  };

  // Assignments
  const addAssignment = (): { success: boolean; message?: string } => {
    console.log('Attempting to add assignment...');
    if (!newAssignment.operatorId || !newAssignment.selectedFunction1Id) {
      console.log('Validation failed: Operator and Function 1 are required.');
      return {
        success: false,
        message: 'Operador e Função 1 são obrigatórios.',
      };
    }

    const assignedFunctions: {
      id: string;
      name: string;
      category: 'entrada' | 'apoio' | 'comando' | 'especializada';
    }[] = [];
    const selectedFunction1 = functions.find(
      (f) => f.id === newAssignment.selectedFunction1Id,
    );

    if (!selectedFunction1) {
      console.log('Validation failed: Invalid Function 1 selected.');
      return { success: false, message: 'Função 1 selecionada inválida.' };
    }
    assignedFunctions.push({
      id: selectedFunction1.id,
      name: selectedFunction1.name,
      category: selectedFunction1.category,
    });

    if (newAssignment.selectedFunction2Id) {
      const selectedFunction2 = functions.find(
        (f) => f.id === newAssignment.selectedFunction2Id,
      );
      if (!selectedFunction2) {
        console.log('Validation failed: Invalid Function 2 selected.');
        return { success: false, message: 'Função 2 selecionada inválida.' };
      }
      // Validate different categories
      if (selectedFunction1.category === selectedFunction2.category) {
        console.log(
          'Validation failed: Functions must be from different categories.',
        );
        return {
          success: false,
          message: 'As funções devem ser de categorias diferentes.',
        };
      }
      assignedFunctions.push({
        id: selectedFunction2.id,
        name: selectedFunction2.name,
        category: selectedFunction2.category,
      });
    }

    const selectedOperator = users.find(
      (u) => u.id === newAssignment.operatorId,
    );
    const selectedVehicle = vehicles.find(
      (v) => v.id === newAssignment.vehicleId,
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      assignments: [
        ...prevFormData.assignments,
        {
          id: Date.now().toString(),
          operatorId: newAssignment.operatorId,
          operatorName: selectedOperator?.name || '',
          assignedFunctions: assignedFunctions,
          vehicleId: newAssignment.vehicleId || null,
          vehiclePrefix: selectedVehicle?.prefix || '',
          order: prevFormData.assignments.length + 1,
        },
      ],
    }));
    setNewAssignment({
      id: '',
      operatorId: '',
      operatorName: '',
      order: 0,
      selectedFunction1Id: '',
      selectedFunction2Id: '',
    });
    console.log('Assignment added successfully. newAssignment reset.');
    return { success: true };
  };
  const removeAssignment = (id: string) => {
    setFormData({
      ...formData,
      assignments: formData.assignments.filter((a) => a.id !== id),
    });
  };

  const updateFunctionAssignment = (
    index: number,
    field: 'operatorId' | 'vehicleId' | 'function1Id' | 'function2Id',
    value: string,
  ) => {
    setFormData((prevFormData) => {
      const newAssignments = prevFormData.assignments.map((assignment, i) => {
        if (i !== index) {
          return assignment;
        }

        let updatedFunctions = [...assignment.assignedFunctions];
        if (field === 'function1Id') {
          const selectedFunction = functions.find((f) => f.id === value);
          if (selectedFunction) {
            updatedFunctions = [
              {
                id: selectedFunction.id,
                name: selectedFunction.name,
                category: selectedFunction.category,
              },
              ...updatedFunctions.slice(1),
            ];
          } else {
            updatedFunctions = updatedFunctions.slice(1);
          }
        } else if (field === 'function2Id') {
          const selectedFunction = functions.find((f) => f.id === value);
          if (selectedFunction) {
            updatedFunctions = [
              updatedFunctions[0],
              {
                id: selectedFunction.id,
                name: selectedFunction.name,
                category: selectedFunction.category,
              },
            ];
          } else {
            updatedFunctions = [updatedFunctions[0]];
          }
        }

        const selectedOperator =
          field === 'operatorId'
            ? users.find((u) => u.id === value)
            : users.find((u) => u.id === assignment.operatorId);
        const selectedVehicle =
          field === 'vehicleId'
            ? vehicles.find((v) => v.id === value)
            : vehicles.find((v) => v.id === assignment.vehicleId);

        return {
          ...assignment,
          operatorId: field === 'operatorId' ? value : assignment.operatorId,
          operatorName: selectedOperator?.name || '',
          vehicleId: field === 'vehicleId' ? value : assignment.vehicleId,
          vehiclePrefix: selectedVehicle?.prefix || '',
          assignedFunctions: updatedFunctions.filter(Boolean), // filter(Boolean) removes undefined/null items
        };
      });

      return {
        ...prevFormData,
        assignments: newAssignments,
      };
    });
  };

  // Routes
  const addRoute = () => {
    if (newRoute.origin.trim() && newRoute.destination.trim()) {
      setFormData({
        ...formData,
        routes: [
          ...formData.routes,
          { ...newRoute, id: Date.now().toString() },
        ],
      });
      setNewRoute(blankRoute());
    }
  };
  const removeRoute = (id: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.filter((r) => r.id !== id),
    });
  };

  // Locations
  const addLocation = () => {
    if (
      newLocation.name.trim() &&
      newLocation.address.trim() &&
      newLocation.type
    ) {
      setFormData({
        ...formData,
        locations: [
          ...formData.locations,
          { ...newLocation, id: Date.now().toString() },
        ],
      });
      setNewLocation(blankLocation());
    }
  };
  const removeLocation = (id: string) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((l) => l.id !== id),
    });
  };

  // Schedule
  const addSchedule = () => {
    if (newScheduleItem.time.trim() && newScheduleItem.activity.trim()) {
      setFormData({
        ...formData,
        schedule: [
          ...formData.schedule,
          { ...newScheduleItem, id: Date.now().toString() },
        ],
      });
      setNewScheduleItem(blankSchedule());
    }
  };
  const removeSchedule = (id: string) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((s) => s.id !== id),
    });
  };

  // Complementary Measures
  const addMeasure = () => {
    if (newMeasure.trim()) {
      setFormData({
        ...formData,
        complementaryMeasures: [
          ...formData.complementaryMeasures,
          newMeasure.trim(),
        ],
      });
      setNewMeasure('');
    }
  };
  const removeMeasure = (index: number) => {
    setFormData({
      ...formData,
      complementaryMeasures: formData.complementaryMeasures.filter(
        (_, i) => i !== index,
      ),
    });
  };

  // Search Objects
  const addSearchObject = () => {
    if (newSearchObject.trim()) {
      setFormData({
        ...formData,
        peculiarities: {
          ...formData.peculiarities,
          searchObjects: [
            ...formData.peculiarities.searchObjects,
            newSearchObject.trim(),
          ],
        },
      });
      setNewSearchObject('');
    }
  };
  const removeSearchObject = (index: number) => {
    setFormData({
      ...formData,
      peculiarities: {
        ...formData.peculiarities,
        searchObjects: formData.peculiarities.searchObjects.filter(
          (_, i) => i !== index,
        ),
      },
    });
  };

  // Medical
  const handleMedicalChange = (
    field: keyof OperationalPlanning['medical'],
    value: string,
  ) => {
    setFormData({
      ...formData,
      medical: {
        ...formData.medical,
        [field]: value,
      },
    });
  };

  return {
    formData,
    setFormData,
    newTarget,
    setNewTarget,
    newRoute,
    setNewRoute,
    newLocation,
    setNewLocation,
    newAssignment,
    setNewAssignment,
    newScheduleItem,
    setNewScheduleItem,
    newMeasure,
    setNewMeasure,
    newSearchObject,
    setNewSearchObject,
    addTarget,
    removeTarget,
    addAssignment,
    removeAssignment,
    updateFunctionAssignment,
    addRoute,
    removeRoute,
    addLocation,
    removeLocation,
    addSchedule,
    removeSchedule,
    addMeasure,
    removeMeasure,
    addSearchObject,
    removeSearchObject,
    handleMedicalChange,
  };
}
