import { PrismaClient } from '@/lib/generated/prisma';
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
  const func1 = await prisma.operationalFunction.upsert({
    where: { name: 'Coordenador/Motorista' },
    update: {},
    create: {
      name: 'Coordenador/Motorista',
      description: 'Responsável pela coordenação da operação e condução da viatura',
      category: 'comando',
      isActive: true,
    },
  });

  const func2 = await prisma.operationalFunction.upsert({
    where: { name: 'Arrombamento Mecânico' },
    update: {},
    create: {
      name: 'Arrombamento Mecânico',
      description: 'Especialista em arrombamento e entrada forçada',
      category: 'especializada',
      isActive: true,
    },
  });

  const func3 = await prisma.operationalFunction.upsert({
    where: { name: 'Escudo/Taser' },
    update: {},
    create: {
      name: 'Escudo/Taser',
      description: 'Operador com escudo balístico e arma de eletrochoque',
      category: 'entrada',
      isActive: true,
    },
  });

  console.log({ func1, func2, func3 });

  // Seed Vehicles
  const vehicle1 = await prisma.vehicle.upsert({
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

  const vehicle2 = await prisma.vehicle.upsert({
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

  console.log({ vehicle1, vehicle2 });

  // Seed Operational Plannings
  const planning1 = await prisma.operationalPlanning.upsert({
    where: { introduction: { serviceOrderNumber: '001/2025' } }, // Use unique serviceOrderNumber
    update: {},
    create: {
      introduction: {
        serviceOrderNumber: '001/2025',
        operationType: 'Patrulhamento',
        description: 'Patrulhamento de rotina na área central.',
        supportUnit: 'PM',
        mandateType: 'nenhum',
        operationDate: '2025-08-20',
        operationTime: '08:00',
      },
      targets: [],
      images: [],
      assignments: [],
      schedule: [],
      communications: {
        vehicleCall: 'PATRULHA 01',
        operatorCall: 'ALPHA',
        frequency: '145.000 MHz',
      },
      peculiarities: {
        searchObjects: [],
        observations: 'Área de baixo risco.',
        risks: 'Nenhum risco identificado.',
      },
      medical: {
        medic: 'Nenhum',
        medicId: '',
        vehicleForTransport: '',
        hospitalContact: '',
        procedures: '',
      },
      complementaryMeasures: [],
      routes: [],
      locations: [],
      status: 'draft',
      priority: 'low',
      createdBy: adminUser.id, // Link to admin user
      responsibleId: adminUser.id,
      responsibleName: adminUser.name,
    },
  });

  console.log({ planning1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
