import type { OperationalPlanning, OperationalPlanningFormData } from "@/types/operational-planning"

// Mock operational planning data
const mockOperationalPlannings: OperationalPlanning[] = [
  {
    id: "1",
    introduction: {
      serviceOrder: "013/2025 – DOE",
      operationType: "Apoio à P11",
      supportUnit: "DPE",
      mandateType: "BUSCA E APREENSÃO E MANDADO DE PRISÃO",
      operationDate: "2025-12-16",
      operationTime: "04:30",
    },
    targets: [
      {
        id: "1",
        name: "NAIANE",
        alias: "Esposa do ALESSANDRO",
        description: "Investigada envolvida em furto e receptação de cabos",
        observations: "Possui filho pequeno. Reside na Santa Luzia - Estrutural",
      },
    ],
    addresses: [
      {
        id: "1",
        targetId: "1",
        address: "Invasão da Santa Luzia, Rua Da Paz, Quadra 23, Lote 48, Santa Luzia",
        complement: "Frente Ferro Velho São José",
        city: "Estrutural",
        state: "DF",
        coordinates: "15° 46' 34.3999\" S 47° 59' 25.1999\" W",
        reference: "https://maps.app.goo.gl/K1rAMev7BhY6WhkZ6",
      },
    ],
    images: [
      {
        id: "1",
        url: "/residential-aerial.png",
        description: "Vista aérea do local da operação",
        type: "location",
      },
    ],
    functionsBoard: [
      {
        id: "1",
        operatorId: "2",
        operatorName: "Maiquel",
        functionId: "1",
        functionName: "Coordenador/Motorista",
        vehicleId: "1",
        vehiclePrefix: "D-0210",
        observations: "AF",
      },
      {
        id: "2",
        operatorId: "3",
        operatorName: "Igor",
        functionId: "2",
        functionName: "Arrombamento Mecânico",
        vehicleId: "1",
        vehiclePrefix: "D-0210",
        observations: "",
      },
      {
        id: "3",
        operatorId: "4",
        operatorName: "Rubens",
        functionId: "3",
        functionName: "Escudo/Taser",
        vehicleId: "2",
        vehiclePrefix: "D-0212",
        observations: "",
      },
    ],
    schedule: [
      {
        id: "1",
        time: "04:00",
        activity: "PRONTO PARA BRIEFING NA DOE",
      },
      {
        id: "2",
        time: "04:15",
        activity: "SAÍDA DA DOE",
      },
      {
        id: "3",
        time: "04:30",
        activity: "BRIEFING DPE",
      },
      {
        id: "4",
        time: "05:30",
        activity: "Previsão da entrada",
      },
    ],
    communications: [
      {
        id: "1",
        type: "Viaturas",
        description: "OPERAÇÃO 03",
      },
      {
        id: "2",
        type: "Operadores",
        description: "DMO: DOA / DOE",
      },
    ],
    peculiarities: [
      "Aparelho Celular Pessoal (desbloquear e anotar senha)",
      "Investigados envolvidos em furto e receptação de cabos",
      "Histórico de possuírem armas, mas sem confirmação atual",
      "NAIANE possui filho pequeno",
      "Alvos podem não estar nos endereços (operação anterior CORPATRI)",
      "Muitos alvos são familiares - possibilidade de encontrar outros alvos",
    ],
    aph: [
      "Todos os operadores com IFAK",
      "Socorristas: SANTILHENO com IFAK",
      "Deslocamento médico pela D-0212 (SANTILHENO + FELIPE)",
      "Seguir segunda viatura de apoio quando possível",
      "Contato telefônico com hospital durante deslocamento",
      "Chave da VTR no bolso superior ESQUERDO da gandola",
    ],
    complementaryMeasures: [
      "Verificação do material no dia anterior – Todos",
      "Realização do relatório e escritura do MBA – Cesar",
      "Conferir endereço no mandado e enviar foto no grupo – Cesar",
    ],
    routes: [
      {
        id: "1",
        from: "DPE",
        to: "DROP OFF",
        distance: "10,8 km",
        duration: "12 min",
        url: "https://maps.app.goo.gl/aPgiJHMs3sLvDCks9",
      },
    ],
    locations: [
      {
        id: "1",
        name: "DROP OFF",
        coordinates: "15° 46' 34.3999\" S 47° 59' 25.1999\" W",
        url: "",
      },
      {
        id: "2",
        name: "Hospital de Base do DF",
        coordinates: "",
        url: "https://maps.app.goo.gl/NDbtMTbBMkrZq1R49",
        phone: "(61) 3550-8900",
      },
    ],
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2025-12-15"),
    createdBy: "Admin Sistema",
  },
]

const operationalPlannings: OperationalPlanning[] = [...mockOperationalPlannings]

export const getAllOperationalPlannings = async (): Promise<OperationalPlanning[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...operationalPlannings].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export const getOperationalPlanningById = async (id: string): Promise<OperationalPlanning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return operationalPlannings.find((p) => p.id === id) || null
}

export const createOperationalPlanning = async (
  data: OperationalPlanningFormData,
  createdBy: string,
): Promise<OperationalPlanning> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newPlanning: OperationalPlanning = {
    ...data,
    id: (operationalPlannings.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
  }

  operationalPlannings.push(newPlanning)
  return newPlanning
}

export const updateOperationalPlanning = async (
  id: string,
  data: Partial<OperationalPlanningFormData>,
): Promise<OperationalPlanning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const planningIndex = operationalPlannings.findIndex((p) => p.id === id)
  if (planningIndex === -1) return null

  const updatedData: Partial<OperationalPlanning> = {
    ...data,
    updatedAt: new Date(),
  }

  operationalPlannings[planningIndex] = { ...operationalPlannings[planningIndex], ...updatedData }
  return operationalPlannings[planningIndex]
}

export const deleteOperationalPlanning = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const planningIndex = operationalPlannings.findIndex((p) => p.id === id)
  if (planningIndex === -1) return false

  operationalPlannings.splice(planningIndex, 1)
  return true
}
