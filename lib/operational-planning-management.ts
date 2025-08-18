import type { OperationalPlanning } from "@/types/operational-planning";

// Mock operational planning data
const mockOperationalPlannings: OperationalPlanning[] = [
  {
    id: "1",
    introduction: {
      serviceOrderNumber: "013/2025 – DOE",
      operationType: "Apoio à P11",
      supportUnit: "DPE",
      mandateType: "BUSCA E APREENSÃO E MANDADO DE PRISÃO",
      operationDate: "2025-12-16",
      operationTime: "04:30",
      description: "",
    },
    targets: [
      {
        id: "1",
        name: "NAIANE",
        alias: "Esposa do ALESSANDRO",
        description: "Investigada envolvida em furto e receptação de cabos",
        observations:
          "Possui filho pequeno. Reside na Santa Luzia - Estrutural",
        address: "",
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
    assignments: [
      {
        id: "1",
        operatorId: "2",
        operatorName: "Maiquel",
        functionId: "1",
        functionName: "Coordenador/Motorista",
        vehicleId: "1",
        vehiclePrefix: "D-0210",
        order: 1,
      },
      {
        id: "2",
        operatorId: "3",
        operatorName: "Igor",
        functionId: "2",
        functionName: "Arrombamento Mecânico",
        vehicleId: "1",
        vehiclePrefix: "D-0210",
        order: 2,
      },
      {
        id: "3",
        operatorId: "4",
        operatorName: "Rubens",
        functionId: "3",
        functionName: "Escudo/Taser",
        vehicleId: "2",
        vehiclePrefix: "D-0212",
        order: 3,
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
    communications: {
      vehicleCall: "OPERAÇÃO 03",
      operatorCall: "DMO: DOA / DOE",
      frequency: "155.000 MHz",
    },
    peculiarities: {
      searchObjects: [
        "Aparelho Celular Pessoal (desbloquear e anotar senha)",
        "Investigados envolvidos em furto e receptação de cabos",
        "Histórico de possuírem armas, mas sem confirmação atual",
        "NAIANE possui filho pequeno",
        "Alvos podem não estar nos endereços (operação anterior CORPATRI)",
        "Muitos alvos são familiares - possibilidade de encontrar outros alvos",
      ],
      observations: "Observações sobre as peculiaridades da operação",
      risks: "Riscos identificados na operação",
    },
    medical: {
      medic: "SANTILHENO",
      medicId: "4",
      vehicleForTransport: "D-0212",
      hospitalContact: "(61) 3550-8900",
      procedures: `IFAK - Kit de Primeiros Socorros
				Deslocamento Médico - D-0212`,
    },

    complementaryMeasures: [
      "Verificação do material no dia anterior – Todos",
      "Realização do relatório e escritura do MBA – Cesar",
      "Conferir endereço no mandado e enviar foto no grupo – Cesar",
    ],
    routes: [
      {
        id: "1",
        distance: "10,8 km",
        duration: "12 min",
        mapUrl: "https://maps.app.goo.gl/aPgiJHMs3sLvDCks9",
        name: "Rota 1",
        origin: "DPE",
        destination: "DROP OFF",
      },
    ],
    locations: [
      {
        id: "1",
        name: "DROP OFF",
        coordinates: "15° 46' 34.3999\" S 47° 59' 25.1999\" W",
        mapUrl: "",
        address: "",
        type: "alvo",
      },
      {
        id: "2",
        name: "Hospital de Base do DF",
        coordinates: "",
        mapUrl: "https://maps.app.goo.gl/NDbtMTbBMkrZq1R49",
        phone: "(61) 3550-8900",
        address: "",
        type: "hospital",
      },
    ],
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2025-12-15"),
    createdBy: "Admin Sistema",
    status: "draft",
    priority: "low",
    responsibleId: "",
    responsibleName: "",
  },
];

const operationalPlannings: OperationalPlanning[] = [
  ...mockOperationalPlannings,
];

export const getAllOperationalPlannings = async (): Promise<
  OperationalPlanning[]
> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...operationalPlannings].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
};

export const getOperationalPlanningById = async (
  id: string,
): Promise<OperationalPlanning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return operationalPlannings.find((p) => p.id === id) || null;
};

export const createOperationalPlanning = async (
  data: OperationalPlanning,
  createdBy: string,
): Promise<OperationalPlanning> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newPlanning: OperationalPlanning = {
    ...data,
    id: (operationalPlannings.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
    assignments: [],
    medical: {
      medic: "",
      medicId: "",
      vehicleForTransport: "",
      hospitalContact: "",
      procedures: "",
    },
    status: "draft",
    priority: "low",
    responsibleId: "",
    responsibleName: "",
  };

  operationalPlannings.push(newPlanning);
  return newPlanning;
};

export const updateOperationalPlanning = async (
  id: string,
  data: Partial<OperationalPlanning>,
): Promise<OperationalPlanning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const planningIndex = operationalPlannings.findIndex((p) => p.id === id);
  if (planningIndex === -1) return null;

  const updatedData: Partial<OperationalPlanning> = {
    ...data,
    updatedAt: new Date(),
  };

  operationalPlannings[planningIndex] = {
    ...operationalPlannings[planningIndex],
    ...updatedData,
  };
  return operationalPlannings[planningIndex];
};

export const deleteOperationalPlanning = async (
  id: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const planningIndex = operationalPlannings.findIndex((p) => p.id === id);
  if (planningIndex === -1) return false;

  operationalPlannings.splice(planningIndex, 1);
  return true;
};
