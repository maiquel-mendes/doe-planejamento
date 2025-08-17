export type PlanningStatus = "draft" | "active" | "completed" | "cancelled"
export type PlanningPriority = "low" | "medium" | "high" | "critical"

export interface Planning {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  status: PlanningStatus
  priority: PlanningPriority
  responsibleId: string
  responsibleName: string
  objectives: string[]
  resources: string[]
  budget?: number
  progress: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface PlanningFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  status: PlanningStatus
  priority: PlanningPriority
  responsibleId: string
  objectives: string[]
  resources: string[]
  budget?: number
}

export interface Target {
  id: string
  name: string
  alias?: string
  cpf?: string
  description?: string
  photo?: string
}

export interface Address {
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode?: string
  coordinates?: string
  reference?: string
}

export interface FunctionAssignment {
  operatorId: string
  operatorName: string
  functionId: string
  functionName: string
  vehicleId?: string
  vehiclePrefix?: string
  observations?: string
}

export interface Schedule {
  time: string
  activity: string
  location?: string
}

export interface Route {
  name: string
  description: string
  distance?: string
  duration?: string
  url?: string
}

export interface Location {
  name: string
  coordinates?: string
  address?: string
  phone?: string
  url?: string
}

export interface OperationalPlanning {
  id: string
  // 1. Introdução
  serviceOrder: string
  operationType: string
  operationDate: string
  operationTime: string
  location: string
  objective: string

  // 2. Identificação do Alvo
  targets: Target[]

  // 3. Endereço do Alvo
  targetAddresses: Address[]

  // 4. Imagens
  images: string[]

  // 5. Quadro de Funções
  functionAssignments: FunctionAssignment[]

  // 6. Quadro de Horários
  schedules: Schedule[]

  // 7. Comunicações
  communicationChannel: string
  radioOperators: string

  // 8. Peculiaridades
  searchObjects: string[]
  specialConsiderations: string[]

  // 9. APH - Médico
  medicalTeam: string[]
  medicalVehicle?: string
  hospitalContact: string
  emergencyProcedures: string[]

  // 10. Medidas Complementares
  complementaryMeasures: string[]

  // 11. Resumo das Rotas
  routes: Route[]

  // 12. Resumo das Localizações
  locations: Location[]

  // Metadados
  status: PlanningStatus
  priority: PlanningPriority
  responsibleId: string
  responsibleName: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface OperationalPlanningFormData {
  // 1. Introdução
  serviceOrder: string
  operationType: string
  operationDate: string
  operationTime: string
  location: string
  objective: string

  // 2. Identificação do Alvo
  targets: Target[]

  // 3. Endereço do Alvo
  targetAddresses: Address[]

  // 4. Imagens
  images: string[]

  // 5. Quadro de Funções
  functionAssignments: FunctionAssignment[]

  // 6. Quadro de Horários
  schedules: Schedule[]

  // 7. Comunicações
  communicationChannel: string
  radioOperators: string

  // 8. Peculiaridades
  searchObjects: string[]
  specialConsiderations: string[]

  // 9. APH - Médico
  medicalTeam: string[]
  medicalVehicle?: string
  hospitalContact: string
  emergencyProcedures: string[]

  // 10. Medidas Complementares
  complementaryMeasures: string[]

  // 11. Resumo das Rotas
  routes: Route[]

  // 12. Resumo das Localizações
  locations: Location[]

  // Metadados
  status: PlanningStatus
  priority: PlanningPriority
  responsibleId: string
}
