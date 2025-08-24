import { PrismaClient } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@example.com',
      password: hashedPassword,
      role: 'editor',
      isActive: true,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    },
  });

  console.log({ adminUser, editorUser, regularUser });

  // Seed Operational Functions
  const funcCoordMotorista = await prisma.operationalFunction.upsert({
    where: { name: 'Coordenador/Motorista' },
    update: {},
    create: {
      name: 'Coordenador/Motorista',
      description:
        'Responsável pela coordenação da operação e condução da viatura',
      category: 'comando',
      isActive: true,
    },
  });

  const funcArrombamento = await prisma.operationalFunction.upsert({
    where: { name: 'Arrombamento Mecânico' },
    update: {
      name: 'Arrombador Mecânico',
    },
    create: {
      name: 'Arrombador Mecânico',
      description: 'Especialista em arrombamento e entrada forçada',
      category: 'especializada',
      isActive: true,
    },
  });

  const funcEscudoTaser = await prisma.operationalFunction.upsert({
    where: { name: 'Escudo/Taser' },
    update: {},
    create: {
      name: 'Escudo/Taser',
      description: 'Operador com escudo balístico e arma de eletrochoque',
      category: 'entrada',
      isActive: true,
    },
  });
  const funcMaosLivres = await prisma.operationalFunction.upsert({
    where: { name: 'Mãos Livres' },
    update: {},
    create: {
      name: 'Mãos Livres',
      description:
        'Operador com arma curta responsavel pelo algemamento e possivel combate corpo a corpo',
      category: 'entrada',
      isActive: true,
    },
  });

  const funcApoioFogo = await prisma.operationalFunction.upsert({
    where: { name: 'Apoio de Fogo' },
    update: {},
    create: {
      name: 'Apoio de Fogo',
      description: 'Operador com arma longa maior poder de fogo',
      category: 'entrada',
      isActive: true,
    },
  });

  const funcAPH = await prisma.operationalFunction.upsert({
    where: { name: 'APH' },
    update: {},
    create: {
      name: 'APH',
      description: 'Atendimento Pré-Hospitalar',
      category: 'apoio',
      isActive: true,
    },
  });

  console.log({
    funcCoordMotorista,
    funcArrombamento,
    funcEscudoTaser,
    funcMaosLivres,
    funcApoioFogo,
    funcAPH,
  });

  // Seed Vehicles
  const vehicleHilux = await prisma.vehicle.upsert({
    where: { prefix: 'D-0210' },
    update: {},
    create: {
      prefix: 'D-0210',
      type: 'viatura',
      model: 'Toyota Hilux',
      capacity: 4,
      isActive: true,
    },
  });

  const vehicleRanger = await prisma.vehicle.upsert({
    where: { prefix: 'D-0212' },
    update: {},
    create: {
      prefix: 'D-0212',
      type: 'viatura',
      model: 'Ford Ranger',
      capacity: 4,
      isActive: true,
    },
  });

  const vehicleAmbulance = await prisma.vehicle.upsert({
    where: { prefix: 'AMB-001' },
    update: {},
    create: {
      prefix: 'AMB-001',
      type: 'ambulancia',
      model: 'Mercedes-Benz Sprinter',
      capacity: 2,
      isActive: true,
    },
  });

  console.log({ vehicleHilux, vehicleRanger, vehicleAmbulance });

  // Seed Locations
  const locHospital = await prisma.location.upsert({
    where: { name: 'Hospital Central' },
    update: {},
    create: {
      name: 'Hospital Central',
      address: 'Rua Principal, 1000, Centro',
      latitude: -15.7801,
      longitude: -47.9292,
    },
  });

  const locTargetAddress = await prisma.location.upsert({
    where: { name: 'Endereço do Alvo Principal' },
    update: {},
    create: {
      name: 'Endereço do Alvo Principal',
      address: 'Rua das Flores, 123, Bairro Alegre',
      latitude: -15.79,
      longitude: -47.93,
    },
  });

  const locBase = await prisma.location.upsert({
    where: { name: 'Base de Operações' },
    update: {},
    create: {
      name: 'Base de Operações',
      address: 'Av. do Exército, S/N, Setor Militar',
      latitude: -15.77,
      longitude: -47.92,
    },
  });

  console.log({ locHospital, locTargetAddress, locBase });

  // Seed Operational Plannings
  const examplePlanning = await prisma.operationalPlanning.upsert({
    where: { id: 'example-planning-1' }, // Use a fixed ID for upsert to work
    update: {},
    create: {
      id: 'example-planning-1',
      status: 'draft',
      priority: 'high',
      peculiarities: 'Área residencial com alto fluxo de veículos.',
      createdById: adminUser.id,
      responsibleId: adminUser.id,

      // Related entities
      introduction: {
        create: {
          serviceOrderNumber: '001/2025 – DOE',
          operationType: 'Busca e Apreensão',
          description:
            'Operação para cumprimento de mandado de busca e apreensão.',
          supportUnit: 'P11, DOE',
          mandateType: 'busca-apreensao',
          operationDate: '2025-08-22',
          operationTime: '08:00',
        },
      },
      targets: {
        create: [
          {
            targetName: 'João da Silva',
            description: 'Suspeito de tráfico de drogas.',
            location: { connect: { id: locTargetAddress.id } },
          },
        ],
      },
      assignments: {
        create: [
          {
            userId: adminUser.id,
            vehicleId: vehicleHilux.id,
            // functions will be connected in a separate step
          },
          {
            userId: editorUser.id,
            vehicleId: vehicleAmbulance.id,
            // functions will be connected in a separate step
          },
        ],
      },
      scheduleItems: {
        create: [
          {
            time: new Date('2025-08-22T08:00:00Z'),
            activity: 'Briefing da equipe',
          },
          {
            time: new Date('2025-08-22T09:00:00Z'),
            activity: 'Deslocamento para o alvo',
          },
        ],
      },
      medicalPlan: {
        create: {
          procedures: 'Protocolo de atendimento de trauma.',
          hospitalLocation: { connect: { id: locHospital.id } },
          ambulanceVehicle: { connect: { id: vehicleAmbulance.id } },
        },
      },
    },
  });

  // Connect functions to assignments after planning creation
  const adminAssignment = await prisma.planningAssignment.findFirstOrThrow({
    where: { userId: adminUser.id, planningId: examplePlanning.id },
  });
  await prisma.planningAssignment.update({
    where: { id: adminAssignment.id },
    data: {
      functions: {
        connect: [{ id: funcCoordMotorista.id }, { id: funcAPH.id }],
      },
    },
  });

  const editorAssignment = await prisma.planningAssignment.findFirstOrThrow({
    where: { userId: editorUser.id, planningId: examplePlanning.id },
  });
  await prisma.planningAssignment.update({
    where: { id: editorAssignment.id },
    data: {
      functions: { connect: [{ id: funcAPH.id }] },
    },
  });

  console.log({ examplePlanning });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
