// Tipos específicos para planejamento operacional policial

export interface OperationalFunction {
  id: string
  name: string
  description: string
  category: "entrada" | "apoio" | "comando" | "especializada"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  prefix: string
  type: "viatura" | "moto" | "van" | "blindado"
  model: string
  capacity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OperationalAssignment {
  id: string
  operatorId: string
  operatorName: string
  functionId: string
  functionName: string
  vehicleId?: string
  vehiclePrefix?: string
  order: number
}

export interface Target {
  id: string
  name: string
  alias?: string
  address: string
  coordinates?: string
  description?: string
  images?: string[]
  observations?: string
}

export interface TimeSchedule {
  id: string
  time: string
  activity: string
  location?: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  distance?: string
  duration?: string
  coordinates?: string
  mapUrl?: string
}

export interface Location {
  id: string
  name: string
  address: string
  coordinates: string
  type: "alvo" | "drop_off" | "hospital" | "base"
  phone?: string
  mapUrl?: string
}

export interface OperationalPlanning {
  id: string
  // Seções do planejamento
  introduction: {
    serviceOrderNumber: string
    operationType: string
    description: string
    supportUnit: string
    mandateType: string
    operationDate: string
    operationTime: string
  }

  targets: Target[]
  assignments: OperationalAssignment[]
  schedule: TimeSchedule[]
  communications: {
    vehicleCall: string
    operatorCall: string
    frequency?: string
  }

  peculiarities: {
    searchObjects: string[]
    observations: string[]
    risks: string[]
  }

  medical: {
    medic: string
    medicId: string
    vehicleForTransport: string
    hospitalContact: string
    procedures: string[]
  }

  complementaryMeasures: string[]
  routes: Route[]
  locations: Location[]

  // Metadados
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  createdBy: string
  responsibleId: string
  responsibleName: string
  createdAt: Date
  updatedAt: Date
}

export interface OperationalPlanningFormData {
  introduction: {
    serviceOrderNumber: string
    operationType: string
    description: string
    supportUnit: string
    mandateType: string
    operationDate: string
    operationTime: string
  }
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  responsibleId: string
  title: string
  description: string
  startDate: string
  endDate: string
  objectives: string[]
  resources: string[]
  budget?: number
  targets: Array<{
    id: string
    name: string
    description: string
  }>
  addresses: Array<{
    id: string
    location: string
    coordinates: string
    reference: string
  }>
  images: string[]
  functionsBoard: Array<{
    id: string
    operatorId: string
    functionId: string
    vehicleId: string
    order: number
  }>
  schedule: Array<{
    id: string
    time: string
    activity: string
  }>
  communications: {
    vehicleCall: string
    operatorCall: string
    frequency: string
  }
  peculiarities: {
    searchObjects: string[]
    observations: string
    risks: string
  }
  aph: {
    medics: string[]
    equipment: string[]
    procedures: string
    hospital: string
    hospitalPhone: string
  }
  complementaryMeasures: string[]
  routes: Array<{
    id: string
    from: string
    to: string
    distance: string
    time: string
  }>
  locations: Array<{
    id: string
    name: string
    coordinates: string
    reference: string
  }>
}
