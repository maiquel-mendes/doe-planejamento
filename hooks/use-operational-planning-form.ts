import { useEffect, useState } from "react";
import type {
  Location,
  OperationalAssignment,
  OperationalPlanning,
  Route,
  Target,
  TimeSchedule,
  OperationalFunction,
  Vehicle,
} from "@/types/operational-planning";
import type { User } from "@/types/auth";

// --- Helper: blank objects with all required fields ---
const blankTarget = (): Target => ({
  id: "",
  name: "",
  alias: "", // Initialize alias to empty string
  address: "",
});
const blankRoute = (): Route => ({
  id: "",
  name: "",
  origin: "",
  destination: "",
  distance: "",
  duration: "",
});
const blankLocation = (): Location => ({
  id: "",
  name: "",
  address: "",
  coordinates: "",
  type: "alvo",
});

const blankAssignment = (): OperationalAssignment => ({
  id: "",
  operatorId: "",
  operatorName: "",
  assignedFunctions: [],
  order: 0,
});

const blankSchedule = (): TimeSchedule => ({
  id: "",
  time: "",
  activity: "",
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
  const [formData, setFormData] = useState<OperationalPlanning>(() => ({
    introduction: {
      serviceOrderNumber: "",
      operationType: "",
      description: "",
      supportUnit: "",
      mandateType: "",
      operationDate: "",
      operationTime: "",
    },
    targets: [],
    images: [],
    id: "",
    assignments: [],
    schedule: [],
    communications: {
      vehicleCall: "",
      operatorCall: "",
    },
    peculiarities: {
      searchObjects: [],
      observations: "",
      risks: "",
    },
    medical: {
      medic: "",
      medicId: "",
      vehicleForTransport: "",
      hospitalContact: "",
      procedures: "",
    },
    complementaryMeasures: [],
    routes: [],
    locations: [],
    status: "draft",
    priority: "medium",
    createdBy: "",
    responsibleId: "",
    responsibleName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const [newTarget, setNewTarget] = useState<Target>(blankTarget());
  const [newRoute, setNewRoute] = useState<Route>(blankRoute());
  const [newLocation, setNewLocation] = useState<Location>(blankLocation());
  const [newAssignment, setNewAssignment] = useState<{
    id: string;
    operatorId: string;
    operatorName: string;
    vehicleId?: string;
    vehiclePrefix?: string;
    order: number;
    selectedFunction1Id: string;
    selectedFunction2Id: string;
  }>(() => ({
    id: "",
    operatorId: "",
    operatorName: "",
    order: 0,
    selectedFunction1Id: "",
    selectedFunction2Id: "",
  }));
  const [newScheduleItem, setNewScheduleItem] = useState<TimeSchedule>(
    blankSchedule(),
  );
  const [newMeasure, setNewMeasure] = useState("");
  const [newSearchObject, setNewSearchObject] = useState("");

  useEffect(() => {
    console.log('useOperationalPlanningForm useEffect: planning changed', planning);
    if (planning) {
      const newFormData = {
        id: planning.id,
        introduction: {
          serviceOrderNumber: planning.introduction.serviceOrderNumber,
          operationType: planning.introduction.operationType,
          description: planning.introduction.description,
          supportUnit: planning.introduction.supportUnit,
          mandateType: planning.introduction.mandateType,
          operationDate: planning.introduction.operationDate,
          operationTime: planning.introduction.operationTime,
        },
        targets: planning.targets || [],
        assignments: planning.assignments || [],
        images: planning.images || [],

        schedule: planning.schedule || [],
        communications: {
          vehicleCall: planning.communications.vehicleCall,
          operatorCall: planning.communications.operatorCall,
        },
        peculiarities: {
          searchObjects: planning.peculiarities.searchObjects || [],
          observations: planning.peculiarities.observations,
          risks: planning.peculiarities.risks,
        },
        medical: {
          medic: planning.medical.medic,
          medicId: planning.medical.medicId,
          vehicleForTransport: planning.medical.vehicleForTransport,
          hospitalContact: planning.medical.hospitalContact,
          procedures: planning.medical.procedures || "",
        },
        complementaryMeasures: planning.complementaryMeasures || [],
        routes: planning.routes || [],
        locations: planning.locations || [],
        status: planning.status || "draft",
        priority: planning.priority || "medium",
        createdBy: planning.createdBy || "",
        responsibleId: planning.responsibleId || "",
        responsibleName: planning.responsibleName || "",
        createdAt: planning.createdAt || new Date(),
        updatedAt: planning.updatedAt || new Date(),
      };
      setFormData(newFormData);
      console.log('useOperationalPlanningForm useEffect: formData set to', newFormData);
    } else {
      // ... (reset form for new planning)
      const blankFormData = {
        introduction: {
          serviceOrderNumber: "",
          operationType: "",
          description: "",
          supportUnit: "",
          mandateType: "",
          operationDate: "",
          operationTime: "",
        },
        targets: [],
        images: [],
        id: "",
        assignments: [],
        schedule: [],
        communications: {
          vehicleCall: "",
          operatorCall: "",
        },
        peculiarities: {
          searchObjects: [],
          observations: "",
          risks: "",
        },
        medical: {
          medic: "",
          medicId: "",
          vehicleForTransport: "",
          hospitalContact: "",
          procedures: "",
        },
        complementaryMeasures: [],
        routes: [],
        locations: [],
        status: "draft",
        priority: "medium",
        createdBy: "",
        responsibleId: "",
        responsibleName: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setFormData(blankFormData);
      console.log('useOperationalPlanningForm useEffect: formData reset to blank', blankFormData);
    }
    setNewTarget(blankTarget());
    setNewRoute(blankRoute());
    setNewLocation(blankLocation());
    setNewAssignment({
      id: "",
      operatorId: "",
      operatorName: "",
      order: 0,
      selectedFunction1Id: "",
      selectedFunction2Id: "",
    });
    setNewScheduleItem(blankSchedule());
    setNewMeasure("");
    setNewSearchObject("");
    // eslint-disable-next-line
  }, [planning]);

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
    console.log("Attempting to add assignment...");
    if (!newAssignment.operatorId || !newAssignment.selectedFunction1Id) {
      console.log("Validation failed: Operator and Function 1 are required.");
      return { success: false, message: "Operador e Função 1 são obrigatórios." };
    }

    const assignedFunctions = [];
    const selectedFunction1 = functions.find(f => f.id === newAssignment.selectedFunction1Id);

    if (!selectedFunction1) {
      console.log("Validation failed: Invalid Function 1 selected.");
      return { success: false, message: "Função 1 selecionada inválida." };
    }
    assignedFunctions.push({
      id: selectedFunction1.id,
      name: selectedFunction1.name,
      category: selectedFunction1.category,
    });

    if (newAssignment.selectedFunction2Id) {
      const selectedFunction2 = functions.find(f => f.id === newAssignment.selectedFunction2Id);
      if (!selectedFunction2) {
        console.log("Validation failed: Invalid Function 2 selected.");
        return { success: false, message: "Função 2 selecionada inválida." };
      }
      // Validate different categories
      if (selectedFunction1.category === selectedFunction2.category) {
        console.log("Validation failed: Functions must be from different categories.");
        return { success: false, message: "As funções devem ser de categorias diferentes." };
      }
      assignedFunctions.push({
        id: selectedFunction2.id,
        name: selectedFunction2.name,
        category: selectedFunction2.category,
      });
    }

    const selectedOperator = users.find(u => u.id === newAssignment.operatorId);
    const selectedVehicle = vehicles.find(v => v.id === newAssignment.vehicleId);

    setFormData({
      ...formData,
      assignments: [
        ...formData.assignments,
        {
          id: Date.now().toString(),
          operatorId: newAssignment.operatorId,
          operatorName: selectedOperator?.name || "",
          assignedFunctions: assignedFunctions,
          vehicleId: newAssignment.vehicleId,
          vehiclePrefix: selectedVehicle?.prefix || "",
          order: formData.assignments.length + 1,
        },
      ],
    });
    setNewAssignment({
      id: "",
      operatorId: "",
      operatorName: "",
      order: 0,
      selectedFunction1Id: "",
      selectedFunction2Id: "",
    });
    console.log("Assignment added successfully. newAssignment reset.");
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
    field: "operatorId" | "vehicleId" | "function1Id" | "function2Id",
    value: string,
  ) => {
    const updatedAssignments = [...formData.assignments];
    const assignmentToUpdate = updatedAssignments[index];

    if (field === "operatorId") {
      assignmentToUpdate.operatorId = value;
      const selectedOperator = users.find(u => u.id === value);
      assignmentToUpdate.operatorName = selectedOperator?.name || "";
    } else if (field === "vehicleId") {
      assignmentToUpdate.vehicleId = value;
      const selectedVehicle = vehicles.find(v => v.id === value);
      assignmentToUpdate.vehiclePrefix = selectedVehicle?.prefix || "";
    } else if (field === "function1Id") {
      const selectedFunction = functions.find(f => f.id === value);
      if (selectedFunction) {
        // Ensure categories are different if a second function is already assigned
        if (assignmentToUpdate.assignedFunctions.length > 1 && assignmentToUpdate.assignedFunctions[1].category === selectedFunction.category) {
          console.error("As funções devem ser de categorias diferentes.");
          return; // Prevent update if categories are the same
        }
        assignmentToUpdate.assignedFunctions[0] = {
          id: selectedFunction.id,
          name: selectedFunction.name,
          category: selectedFunction.category,
        };
      } else {
        assignmentToUpdate.assignedFunctions.splice(0, 1); // Remove if function is unselected
      }
    } else if (field === "function2Id") {
      const selectedFunction = functions.find(f => f.id === value);
      if (selectedFunction) {
        // Ensure categories are different from the first function
        if (assignmentToUpdate.assignedFunctions.length > 0 && assignmentToUpdate.assignedFunctions[0].category === selectedFunction.category) {
          console.error("As funções devem ser de categorias diferentes.");
          return; // Prevent update if categories are the same
        }
        if (assignmentToUpdate.assignedFunctions.length === 0) {
          // If no first function, add it as the first
          assignmentToUpdate.assignedFunctions.push({
            id: selectedFunction.id,
            name: selectedFunction.name,
            category: selectedFunction.category,
          });
        } else {
          assignmentToUpdate.assignedFunctions[1] = {
            id: selectedFunction.id,
            name: selectedFunction.name,
            category: selectedFunction.category,
          };
        }
      } else {
        assignmentToUpdate.assignedFunctions.splice(1, 1); // Remove if function is unselected
      }
    }

    setFormData({
      ...formData,
      assignments: updatedAssignments,
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
      setNewMeasure("");
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
      setNewSearchObject("");
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
    field: keyof OperationalPlanning["medical"],
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
