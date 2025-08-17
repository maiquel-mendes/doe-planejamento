"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { OperationalPlanning, OperationalPlanningFormData } from "@/types/planning"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Upload } from "lucide-react"
import { mockUsers } from "@/lib/auth-mock"
import { mockFunctions } from "@/lib/operational-functions"
import { mockVehicles } from "@/lib/vehicles"

interface OperationalPlanningFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: OperationalPlanningFormData) => void
  planning?: OperationalPlanning | null
  isLoading?: boolean
}

export function OperationalPlanningFormModal({
  isOpen,
  onClose,
  onSubmit,
  planning,
  isLoading,
}: OperationalPlanningFormModalProps) {
  const [formData, setFormData] = useState<OperationalPlanningFormData>({
    introduction: {
      serviceOrderNumber: "",
      operationType: "",
      description: "",
      supportUnit: "",
      mandateType: "",
      operationDate: "",
      operationTime: "",
    },
    status: "draft",
    priority: "medium",
    responsibleId: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    objectives: [],
    resources: [],
    budget: undefined,
    // Seções específicas do planejamento operacional
    targets: [],
    addresses: [],
    images: [],
    functionsBoard: [],
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
    aph: {
      medics: [],
      equipment: [],
      procedures: "",
      hospital: "",
      hospitalPhone: "",
    },
    complementaryMeasures: [],
    routes: [],
    locations: [],
  })

  const [newObjective, setNewObjective] = useState("")
  const [newResource, setNewResource] = useState("")
  const [newTarget, setNewTarget] = useState({ name: "", description: "" })
  const [newAddress, setNewAddress] = useState({ location: "", coordinates: "", reference: "" })
  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", activity: "" })
  const [newSearchObject, setNewSearchObject] = useState("")
  const [newMedic, setNewMedic] = useState("")
  const [newEquipment, setNewEquipment] = useState("")
  const [newMeasure, setNewMeasure] = useState("")
  const [newRoute, setNewRoute] = useState({ from: "", to: "", distance: "", time: "" })
  const [newLocation, setNewLocation] = useState({ name: "", coordinates: "", reference: "" })

  useEffect(() => {
    if (planning) {
      setFormData({
        title: planning.title,
        description: planning.description || "",
        startDate: planning.startDate ? planning.startDate.toISOString().split("T")[0] : "",
        endDate: planning.endDate ? planning.endDate.toISOString().split("T")[0] : "",
        status: planning.status,
        priority: planning.priority,
        responsibleId: planning.responsibleId,
        objectives: planning.objectives || [],
        resources: planning.resources || [],
        budget: planning.budget,
        introduction: planning.introduction || {
          serviceOrderNumber: "",
          operationType: "",
          description: "",
          supportUnit: "",
          mandateType: "",
          operationDate: "",
          operationTime: "",
        },
        targets: planning.targets || [],
        addresses: planning.addresses || [],
        images: planning.images || [],
        functionsBoard: planning.functionsBoard || [],
        schedule: planning.schedule || [],
        communications: planning.communications || {
          vehicleCall: "",
          operatorCall: "",
          frequency: "",
        },
        peculiarities: planning.peculiarities || {
          searchObjects: [],
          observations: "",
          risks: "",
        },
        aph: planning.aph || {
          medics: [],
          equipment: [],
          procedures: "",
          hospital: "",
          hospitalPhone: "",
        },
        complementaryMeasures: planning.complementaryMeasures || [],
        routes: planning.routes || [],
        locations: planning.locations || [],
      })
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "draft",
        priority: "medium",
        responsibleId: "",
        objectives: [],
        resources: [],
        budget: undefined,
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
        addresses: [],
        images: [],
        functionsBoard: [],
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
        aph: {
          medics: [],
          equipment: [],
          procedures: "",
          hospital: "",
          hospitalPhone: "",
        },
        complementaryMeasures: [],
        routes: [],
        locations: [],
      })
    }
    // Reset dos estados de novos itens
    setNewObjective("")
    setNewResource("")
    setNewTarget({ name: "", description: "" })
    setNewAddress({ location: "", coordinates: "", reference: "" })
    setNewScheduleItem({ time: "", activity: "" })
    setNewSearchObject("")
    setNewMedic("")
    setNewEquipment("")
    setNewMeasure("")
    setNewRoute({ from: "", to: "", distance: "", time: "" })
    setNewLocation({ name: "", coordinates: "", reference: "" })
  }, [planning, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, newObjective.trim()],
      })
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    })
  }

  const addResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        resources: [...formData.resources, newResource.trim()],
      })
      setNewResource("")
    }
  }

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index),
    })
  }

  const addTarget = () => {
    if (newTarget.name.trim()) {
      setFormData({
        ...formData,
        targets: [...formData.targets, { ...newTarget, id: Date.now().toString() }],
      })
      setNewTarget({ name: "", description: "" })
    }
  }

  const removeTarget = (index: number) => {
    setFormData({
      ...formData,
      targets: formData.targets.filter((_, i) => i !== index),
    })
  }

  const addAddress = () => {
    if (newAddress.location.trim()) {
      setFormData({
        ...formData,
        addresses: [...formData.addresses, { ...newAddress, id: Date.now().toString() }],
      })
      setNewAddress({ location: "", coordinates: "", reference: "" })
    }
  }

  const removeAddress = (index: number) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index),
    })
  }

  const addScheduleItem = () => {
    if (newScheduleItem.time.trim() && newScheduleItem.activity.trim()) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, { ...newScheduleItem, id: Date.now().toString() }],
      })
      setNewScheduleItem({ time: "", activity: "" })
    }
  }

  const removeScheduleItem = (index: number) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index),
    })
  }

  const addSearchObject = () => {
    if (newSearchObject.trim()) {
      setFormData({
        ...formData,
        peculiarities: {
          ...formData.peculiarities,
          searchObjects: [...formData.peculiarities.searchObjects, newSearchObject.trim()],
        },
      })
      setNewSearchObject("")
    }
  }

  const removeSearchObject = (index: number) => {
    setFormData({
      ...formData,
      peculiarities: {
        ...formData.peculiarities,
        searchObjects: formData.peculiarities.searchObjects.filter((_, i) => i !== index),
      },
    })
  }

  const addMedic = () => {
    if (newMedic.trim()) {
      setFormData({
        ...formData,
        aph: {
          ...formData.aph,
          medics: [...formData.aph.medics, newMedic.trim()],
        },
      })
      setNewMedic("")
    }
  }

  const removeMedic = (index: number) => {
    setFormData({
      ...formData,
      aph: {
        ...formData.aph,
        medics: formData.aph.medics.filter((_, i) => i !== index),
      },
    })
  }

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData({
        ...formData,
        aph: {
          ...formData.aph,
          equipment: [...formData.aph.equipment, newEquipment.trim()],
        },
      })
      setNewEquipment("")
    }
  }

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      aph: {
        ...formData.aph,
        equipment: formData.aph.equipment.filter((_, i) => i !== index),
      },
    })
  }

  const addMeasure = () => {
    if (newMeasure.trim()) {
      setFormData({
        ...formData,
        complementaryMeasures: [...formData.complementaryMeasures, newMeasure.trim()],
      })
      setNewMeasure("")
    }
  }

  const removeMeasure = (index: number) => {
    setFormData({
      ...formData,
      complementaryMeasures: formData.complementaryMeasures.filter((_, i) => i !== index),
    })
  }

  const addRoute = () => {
    if (newRoute.from.trim() && newRoute.to.trim()) {
      setFormData({
        ...formData,
        routes: [...formData.routes, { ...newRoute, id: Date.now().toString() }],
      })
      setNewRoute({ from: "", to: "", distance: "", time: "" })
    }
  }

  const removeRoute = (index: number) => {
    setFormData({
      ...formData,
      routes: formData.routes.filter((_, i) => i !== index),
    })
  }

  const addLocation = () => {
    if (newLocation.name.trim()) {
      setFormData({
        ...formData,
        locations: [...formData.locations, { ...newLocation, id: Date.now().toString() }],
      })
      setNewLocation({ name: "", coordinates: "", reference: "" })
    }
  }

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((_, i) => i !== index),
    })
  }

  const addFunctionAssignment = () => {
    setFormData({
      ...formData,
      functionsBoard: [
        ...formData.functionsBoard,
        {
          id: Date.now().toString(),
          operatorId: "",
          functionId: "",
          vehicleId: "",
          order: formData.functionsBoard.length + 1,
        },
      ],
    })
  }

  const removeFunctionAssignment = (index: number) => {
    setFormData({
      ...formData,
      functionsBoard: formData.functionsBoard.filter((_, i) => i !== index),
    })
  }

  const updateFunctionAssignment = (index: number, field: string, value: string) => {
    const updated = [...formData.functionsBoard]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({
      ...formData,
      functionsBoard: updated,
    })
  }

  const isEditing = !!planning

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Planejamento Operacional" : "Novo Planejamento Operacional"}</DialogTitle>
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
                    <CardDescription>Informações básicas da operação</CardDescription>
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
                              introduction: { ...formData.introduction, serviceOrderNumber: e.target.value },
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
                              introduction: { ...formData.introduction, operationType: e.target.value },
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
                              introduction: { ...formData.introduction, supportUnit: e.target.value },
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
                              introduction: { ...formData.introduction, mandateType: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="busca-apreensao">Busca e Apreensão</SelectItem>
                            <SelectItem value="mandado-prisao">Mandado de Prisão</SelectItem>
                            <SelectItem value="busca-prisao">Busca e Apreensão + Mandado de Prisão</SelectItem>
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
                              introduction: { ...formData.introduction, operationDate: e.target.value },
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
                              introduction: { ...formData.introduction, operationTime: e.target.value },
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
                            introduction: { ...formData.introduction, description: e.target.value },
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
                    <CardDescription>Informações sobre os alvos da operação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.targets.map((target, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">{target.name}</div>
                            <div className="text-sm text-muted-foreground">{target.description}</div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeTarget(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={newTarget.name}
                          onChange={(e) => setNewTarget({ ...newTarget, name: e.target.value })}
                          placeholder="Nome do alvo"
                        />
                        <Input
                          value={newTarget.description}
                          onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
                          placeholder="Descrição/Observações"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={addTarget} className="w-full bg-transparent">
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
                      {formData.addresses.map((address, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">{address.location}</div>
                            <div className="text-sm text-muted-foreground">
                              {address.coordinates && `Coordenadas: ${address.coordinates}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.reference && `Referência: ${address.reference}`}
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAddress(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid gap-2">
                        <Input
                          value={newAddress.location}
                          onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })}
                          placeholder="Endereço completo"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={newAddress.coordinates}
                            onChange={(e) => setNewAddress({ ...newAddress, coordinates: e.target.value })}
                            placeholder="Coordenadas GPS"
                          />
                          <Input
                            value={newAddress.reference}
                            onChange={(e) => setNewAddress({ ...newAddress, reference: e.target.value })}
                            placeholder="Ponto de referência"
                          />
                        </div>
                      </div>
                      <Button type="button" variant="outline" onClick={addAddress} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Endereço
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>4. Imagens</CardTitle>
                    <CardDescription>Anexar imagens relevantes à operação</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Clique para adicionar imagens ou arraste e solte aqui
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 10MB</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Funções */}
              <TabsContent value="funcoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>5. Quadro de Funções</CardTitle>
                    <CardDescription>Distribuição de operadores, funções e viaturas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.functionsBoard.map((assignment, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded">
                          <Select
                            value={assignment.operatorId}
                            onValueChange={(value) => updateFunctionAssignment(index, "operatorId", value)}
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
                            onValueChange={(value) => updateFunctionAssignment(index, "functionId", value)}
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
                            onValueChange={(value) => updateFunctionAssignment(index, "vehicleId", value)}
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
                            onClick={() => removeFunctionAssignment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFunctionAssignment}
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
                    <CardDescription>Cronograma detalhado da operação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.schedule.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded">
                          <div className="font-mono text-sm font-medium min-w-[80px]">{item.time}</div>
                          <div className="flex-1">{item.activity}</div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeScheduleItem(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="time"
                          value={newScheduleItem.time}
                          onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                          placeholder="Horário"
                        />
                        <Input
                          value={newScheduleItem.activity}
                          onChange={(e) => setNewScheduleItem({ ...newScheduleItem, activity: e.target.value })}
                          placeholder="Atividade"
                          className="col-span-2"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addScheduleItem}
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
                    <CardDescription>Configurações de comunicação</CardDescription>
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
                              communications: { ...formData.communications, vehicleCall: e.target.value },
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
                              communications: { ...formData.communications, operatorCall: e.target.value },
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
                              communications: { ...formData.communications, frequency: e.target.value },
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
                    <CardDescription>Informações específicas da operação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Objetos da Busca</Label>
                      <div className="space-y-2">
                        {formData.peculiarities.searchObjects.map((object, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="flex-1 justify-start">
                              {object}
                            </Badge>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeSearchObject(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={newSearchObject}
                            onChange={(e) => setNewSearchObject(e.target.value)}
                            placeholder="Adicionar objeto de busca"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSearchObject())}
                          />
                          <Button type="button" variant="outline" onClick={addSearchObject}>
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
                            peculiarities: { ...formData.peculiarities, observations: e.target.value },
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
                            peculiarities: { ...formData.peculiarities, risks: e.target.value },
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
                    <CardDescription>Atendimento pré-hospitalar e suporte médico</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Socorristas</Label>
                      <div className="space-y-2">
                        {formData.aph.medics.map((medic, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="flex-1 justify-start">
                              {medic}
                            </Badge>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeMedic(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={newMedic}
                            onChange={(e) => setNewMedic(e.target.value)}
                            placeholder="Nome do socorrista"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMedic())}
                          />
                          <Button type="button" variant="outline" onClick={addMedic}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Equipamentos</Label>
                      <div className="space-y-2">
                        {formData.aph.equipment.map((equipment, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="flex-1 justify-start">
                              {equipment}
                            </Badge>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEquipment(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={newEquipment}
                            onChange={(e) => setNewEquipment(e.target.value)}
                            placeholder="Equipamento médico"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEquipment())}
                          />
                          <Button type="button" variant="outline" onClick={addEquipment}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Procedimentos</Label>
                      <Textarea
                        value={formData.aph.procedures}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aph: { ...formData.aph, procedures: e.target.value },
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
                          value={formData.aph.hospital}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aph: { ...formData.aph, hospital: e.target.value },
                            })
                          }
                          placeholder="Nome do hospital"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Telefone do Hospital</Label>
                        <Input
                          value={formData.aph.hospitalPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aph: { ...formData.aph, hospitalPhone: e.target.value },
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
                    <CardDescription>Ações adicionais necessárias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.complementaryMeasures.map((measure, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline" className="flex-1 justify-start">
                            {measure}
                          </Badge>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMeasure(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newMeasure}
                          onChange={(e) => setNewMeasure(e.target.value)}
                          placeholder="Adicionar medida complementar"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMeasure())}
                        />
                        <Button type="button" variant="outline" onClick={addMeasure}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>11. Resumo das Rotas</CardTitle>
                    <CardDescription>Rotas e trajetos da operação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.routes.map((route, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">
                              {route.from} → {route.to}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {route.distance && `Distância: ${route.distance}`}
                              {route.time && ` • Tempo: ${route.time}`}
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeRoute(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={newRoute.from}
                          onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                          placeholder="Origem"
                        />
                        <Input
                          value={newRoute.to}
                          onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                          placeholder="Destino"
                        />
                        <Input
                          value={newRoute.distance}
                          onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                          placeholder="Distância"
                        />
                        <Input
                          value={newRoute.time}
                          onChange={(e) => setNewRoute({ ...newRoute, time: e.target.value })}
                          placeholder="Tempo estimado"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={addRoute} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Rota
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>12. Resumo das Localizações</CardTitle>
                    <CardDescription>Pontos importantes da operação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formData.locations.map((location, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {location.coordinates && `Coordenadas: ${location.coordinates}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {location.reference && `Referência: ${location.reference}`}
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeLocation(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="grid gap-2">
                        <Input
                          value={newLocation.name}
                          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                          placeholder="Nome da localização"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={newLocation.coordinates}
                            onChange={(e) => setNewLocation({ ...newLocation, coordinates: e.target.value })}
                            placeholder="Coordenadas GPS"
                          />
                          <Input
                            value={newLocation.reference}
                            onChange={(e) => setNewLocation({ ...newLocation, reference: e.target.value })}
                            placeholder="Ponto de referência"
                          />
                        </div>
                      </div>
                      <Button type="button" variant="outline" onClick={addLocation} className="w-full bg-transparent">
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
  )
}
