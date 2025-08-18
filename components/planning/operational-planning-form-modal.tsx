"use client";

import { Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockUsers } from "@/lib/auth-mock";
import { mockFunctions } from "@/lib/operational-functions";
import { mockVehicles } from "@/lib/vehicles";
import type {
  Location,
  OperationalAssignment,
  OperationalPlanning,
  Route,
  Target,
  TimeSchedule,
} from "@/types/operational-planning";

interface OperationalPlanningFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OperationalPlanning) => void;
  planning?: OperationalPlanning | null;
  isLoading?: boolean;
}

// --- Helper: blank objects with all required fields ---
const blankTarget = (): Target => ({
  id: "",
  name: "",
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
  functionId: "",
  functionName: "",
  order: 0,
});

const blankSchedule = (): TimeSchedule => ({
  id: "",
  time: "",
  activity: "",
});

export function OperationalPlanningFormModal({
  isOpen,
  onClose,
  onSubmit,
  planning,
  isLoading,
}: OperationalPlanningFormModalProps) {
  // --- State ---
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
      frequency: "",
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

  // --- Temporary states ---
  const [newTarget, setNewTarget] = useState<Target>(blankTarget());
  const [newRoute, setNewRoute] = useState<Route>(blankRoute());
  const [newLocation, setNewLocation] = useState<Location>(blankLocation());
  const [newAssignment, setNewAssignment] = useState<OperationalAssignment>(
    blankAssignment(),
  );
  const [newScheduleItem, setNewScheduleItem] = useState<TimeSchedule>(
    blankSchedule(),
  );
  const [newMeasure, setNewMeasure] = useState("");
  const [newSearchObject, setNewSearchObject] = useState("");

  // --- Effect: load planning ---
  useEffect(() => {
    if (planning) {
      setFormData({
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
          frequency: planning.communications.frequency,
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
      });
    } else {
      setFormData({
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
          frequency: "",
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
      });
    }
    setNewTarget(blankTarget());
    setNewRoute(blankRoute());
    setNewLocation(blankLocation());
    setNewAssignment(blankAssignment());
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
  const addAssignment = () => {
    if (newAssignment.operatorId && newAssignment.functionId) {
      setFormData({
        ...formData,
        assignments: [
          ...formData.assignments,
          {
            ...newAssignment,
            id: Date.now().toString(),
            order: formData.assignments.length + 1,
          },
        ],
      });
      setNewAssignment(blankAssignment());
    }
  };
  const removeAssignment = (id: string) => {
    setFormData({
      ...formData,
      assignments: formData.assignments.filter((a) => a.id !== id),
    });
  };

  const updateFunctionAssignment = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...formData.assignments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      assignments: updated,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!planning;

  // --- UI ---
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Planejamento Operacional"
              : "Novo Planejamento Operacional"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do planejamento operacional."
              : "Preencha as informações para criar um novo planejamento operacional."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="introducao" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="introducao">Introdução</TabsTrigger>
              <TabsTrigger value="alvos">Alvos</TabsTrigger>
              <TabsTrigger value="funcoes">Funções</TabsTrigger>
              <TabsTrigger value="horarios">Horários</TabsTrigger>
              <TabsTrigger value="complementares">Complementares</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              {/* Aba Introdução */}
              <TabsContent value="introducao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>1. Introdução</CardTitle>
                    <CardDescription>
                      Informações básicas da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Ordem de Serviço</Label>
                        <Input
                          value={formData.introduction.serviceOrderNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                serviceOrderNumber: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: 013/2025 – DOE"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tipo de Operação</Label>
                        <Input
                          value={formData.introduction.operationType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                operationType: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: Busca e Apreensão"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Unidade de Apoio</Label>
                        <Input
                          value={formData.introduction.supportUnit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                supportUnit: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: P11, DOE"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tipo de Mandado</Label>
                        <Select
                          value={formData.introduction.mandateType}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                mandateType: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="busca-apreensao">
                              Busca e Apreensão
                            </SelectItem>
                            <SelectItem value="mandado-prisao">
                              Mandado de Prisão
                            </SelectItem>
                            <SelectItem value="busca-prisao">
                              Busca e Apreensão + Mandado de Prisão
                            </SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Data da Operação</Label>
                        <Input
                          type="date"
                          value={formData.introduction.operationDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                operationDate: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Horário da Operação</Label>
                        <Input
                          type="time"
                          value={formData.introduction.operationTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: {
                                ...formData.introduction,
                                operationTime: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={formData.introduction.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            introduction: {
                              ...formData.introduction,
                              description: e.target.value,
                            },
                          })
                        }
                        placeholder="Descrição da introdução"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Alvos */}
              <TabsContent value="alvos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>2. Identificação do Alvo</CardTitle>
                    <CardDescription>
                      Informações sobre os alvos da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.targets.map((target, _index) => (
                        <div
                          key={target.id}
                          className="flex items-center gap-2 p-3 border rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{target.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {target.description}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTarget(target.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={newTarget.name}
                          onChange={(e) =>
                            setNewTarget({ ...newTarget, name: e.target.value })
                          }
                          placeholder="Nome do alvo"
                        />
                        <Input
                          value={newTarget.description}
                          onChange={(e) =>
                            setNewTarget({
                              ...newTarget,
                              description: e.target.value,
                            })
                          }
                          placeholder="Descrição/Observações"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTarget}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Alvo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3. Endereço do Alvo</CardTitle>
                    <CardDescription>Localizações dos alvos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.targets.map((target, _index) => (
                        <div
                          key={target.id}
                          className="flex items-center gap-2 p-3 border rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{target.address}</div>
                            <div className="text-sm text-muted-foreground">
                              {target.coordinates &&
                                `Coordenadas: ${target.coordinates}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {target.observations &&
                                `Referência: ${target.observations}`}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTarget(target.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid gap-2">
                        <Input
                          value={newTarget.address}
                          onChange={(e) =>
                            setNewTarget({
                              ...newTarget,
                              address: e.target.value,
                            })
                          }
                          placeholder="Endereço completo"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={newTarget.coordinates}
                            onChange={(e) =>
                              setNewTarget({
                                ...newTarget,
                                coordinates: e.target.value,
                              })
                            }
                            placeholder="Coordenadas GPS"
                          />
                          <Input
                            value={newTarget.observations}
                            onChange={(e) =>
                              setNewTarget({
                                ...newTarget,
                                observations: e.target.value,
                              })
                            }
                            placeholder="Ponto de referência"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTarget}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Endereço
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>4. Imagens</CardTitle>
                    <CardDescription>
                      Anexar imagens relevantes à operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Clique para adicionar imagens ou arraste e solte aqui
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG até 10MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Funções */}
              <TabsContent value="funcoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>5. Quadro de Funções</CardTitle>
                    <CardDescription>
                      Distribuição de operadores, funções e viaturas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.assignments.map((assignment, index) => (
                        <div
                          key={assignment.id}
                          className="grid grid-cols-4 gap-2 p-3 border rounded"
                        >
                          <Select
                            value={assignment.operatorId}
                            onValueChange={(value) =>
                              updateFunctionAssignment(
                                index,
                                "operatorId",
                                value,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operador" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={assignment.functionId}
                            onValueChange={(value) =>
                              updateFunctionAssignment(
                                index,
                                "functionId",
                                value,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Função" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockFunctions.map((func) => (
                                <SelectItem key={func.id} value={func.id}>
                                  {func.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={assignment.vehicleId}
                            onValueChange={(value) =>
                              updateFunctionAssignment(
                                index,
                                "vehicleId",
                                value,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Viatura" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.prefix} - {vehicle.model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAssignment(assignment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addAssignment}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Função
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Horários */}
              <TabsContent value="horarios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>6. Quadro de Horários</CardTitle>
                    <CardDescription>
                      Cronograma detalhado da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.schedule.map((item, _index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-3 border rounded"
                        >
                          <div className="font-mono text-sm font-medium min-w-[80px]">
                            {item.time}
                          </div>
                          <div className="flex-1">{item.activity}</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSchedule(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="time"
                          value={newScheduleItem.time}
                          onChange={(e) =>
                            setNewScheduleItem({
                              ...newScheduleItem,
                              time: e.target.value,
                            })
                          }
                          placeholder="Horário"
                        />
                        <Input
                          value={newScheduleItem.activity}
                          onChange={(e) =>
                            setNewScheduleItem({
                              ...newScheduleItem,
                              activity: e.target.value,
                            })
                          }
                          placeholder="Atividade"
                          className="col-span-2"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSchedule}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Horário
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>7. Comunicações Durante Trajeto</CardTitle>
                    <CardDescription>
                      Configurações de comunicação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Chamada das Viaturas</Label>
                        <Input
                          value={formData.communications.vehicleCall}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              communications: {
                                ...formData.communications,
                                vehicleCall: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: OPERAÇÃO 03"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Chamada dos Operadores</Label>
                        <Input
                          value={formData.communications.operatorCall}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              communications: {
                                ...formData.communications,
                                operatorCall: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: DMO: DOA / DOE"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Frequência</Label>
                        <Input
                          value={formData.communications.frequency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              communications: {
                                ...formData.communications,
                                frequency: e.target.value,
                              },
                            })
                          }
                          placeholder="Frequência de comunicação"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Complementares */}
              <TabsContent value="complementares" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>8. Peculiaridades</CardTitle>
                    <CardDescription>
                      Informações específicas da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Objetos da Busca</Label>
                      <div className="space-y-2">
                        {formData.peculiarities.searchObjects.map(
                          (object, index) => (
                            <div
                              key={object}
                              className="flex items-center gap-2"
                            >
                              <Badge
                                variant="outline"
                                className="flex-1 justify-start"
                              >
                                {object}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSearchObject(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                        <div className="flex gap-2">
                          <Input
                            value={newSearchObject}
                            onChange={(e) => setNewSearchObject(e.target.value)}
                            placeholder="Adicionar objeto de busca"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSearchObject}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={formData.peculiarities.observations}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            peculiarities: {
                              ...formData.peculiarities,
                              observations: e.target.value,
                            },
                          })
                        }
                        placeholder="Observações gerais sobre a operação"
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Riscos Identificados</Label>
                      <Textarea
                        value={formData.peculiarities.risks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            peculiarities: {
                              ...formData.peculiarities,
                              risks: e.target.value,
                            },
                          })
                        }
                        placeholder="Riscos e precauções necessárias"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>9. APH – Médico</CardTitle>
                    <CardDescription>
                      Atendimento pré-hospitalar e suporte médico
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Socorristas</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={formData.medical.medic}
                            onChange={(e) =>
                              handleMedicalChange("medic", e.target.value)
                            }
                            placeholder="Nome do socorrista"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Equipamentos / Procedimentos</Label>
                      <Textarea
                        value={formData.medical.procedures}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            medical: {
                              ...formData.medical,
                              procedures: e.target.value,
                            },
                          })
                        }
                        placeholder="Procedimentos de atendimento"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Hospital de Referência</Label>
                        <Input
                          value={
                            formData.locations.find(
                              (l) => l.type === "hospital",
                            )?.name || ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              locations: formData.locations.map((l) =>
                                l.type === "hospital"
                                  ? { ...l, name: e.target.value }
                                  : l,
                              ),
                            })
                          }
                          placeholder="Nome do hospital"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Telefone do Hospital</Label>
                        <Input
                          value={formData.medical.hospitalContact}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              medical: {
                                ...formData.medical,
                                hospitalContact: e.target.value,
                              },
                            })
                          }
                          placeholder="(61) 3550-8900"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>10. Medidas Complementares</CardTitle>
                    <CardDescription>
                      Ações adicionais necessárias
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.complementaryMeasures.map((measure, index) => (
                        <div key={measure} className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="flex-1 justify-start"
                          >
                            {measure}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeasure(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newMeasure}
                          onChange={(e) => setNewMeasure(e.target.value)}
                          placeholder="Adicionar medida complementar"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addMeasure}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>11. Resumo das Rotas</CardTitle>
                    <CardDescription>
                      Rotas e trajetos da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.routes.map((route, _index) => (
                        <div
                          key={route.id}
                          className="flex items-center gap-2 p-3 border rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {route.origin} → {route.destination}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {route.distance && `Distância: ${route.distance}`}
                              {route.duration && ` • Tempo: ${route.duration}`}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoute(route.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={newRoute.origin}
                          onChange={(e) =>
                            setNewRoute({ ...newRoute, origin: e.target.value })
                          }
                          placeholder="Origem"
                        />
                        <Input
                          value={newRoute.destination}
                          onChange={(e) =>
                            setNewRoute({
                              ...newRoute,
                              destination: e.target.value,
                            })
                          }
                          placeholder="Destino"
                        />
                        <Input
                          value={newRoute.distance}
                          onChange={(e) =>
                            setNewRoute({
                              ...newRoute,
                              distance: e.target.value,
                            })
                          }
                          placeholder="Distância"
                        />
                        <Input
                          value={newRoute.duration}
                          onChange={(e) =>
                            setNewRoute({
                              ...newRoute,
                              duration: e.target.value,
                            })
                          }
                          placeholder="Tempo estimado"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addRoute}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Rota
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>12. Resumo das Localizações</CardTitle>
                    <CardDescription>
                      Pontos importantes da operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.locations.map((location) => (
                        <div
                          key={location.id}
                          className="flex items-center gap-2 p-3 border rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {location.coordinates &&
                                `Coordenadas: ${location.coordinates}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {location.address &&
                                `Referência: ${location.address}`}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLocation(location.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid gap-2">
                        <Input
                          value={newLocation.name}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              name: e.target.value,
                            })
                          }
                          placeholder="Nome da localização"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={newLocation.coordinates}
                            onChange={(e) =>
                              setNewLocation({
                                ...newLocation,
                                coordinates: e.target.value,
                              })
                            }
                            placeholder="Coordenadas GPS"
                          />
                          <Input
                            value={newLocation.address}
                            onChange={(e) =>
                              setNewLocation({
                                ...newLocation,
                                address: e.target.value,
                              })
                            }
                            placeholder="Ponto de referência"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addLocation}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Localização
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
