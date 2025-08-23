import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import {
  authenticateToken,
  type AuthenticatedRequest,
} from '@/lib/auth-middleware';
import type { Prisma } from '@prisma/client';

const includeAllRelations = {
  introduction: true,
  targets: { include: { location: true } },
  assignments: { include: { user: true, functions: true, vehicle: true } },
  scheduleItems: true,
  medicalPlan: {
    include: {
      hospitalLocation: true,
      ambulanceVehicle: true,
    },
  },
  createdBy: true,
  responsible: true,
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { user } = req;

  if (req.method === 'GET') {
    try {
      const plannings = await prisma.operationalPlanning.findMany({
        include: includeAllRelations,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(plannings);
    } catch (error) {
      console.error('Error fetching plannings:', error);
      return res.status(500).json({ message: 'Failed to fetch plannings' });
    }
  }

  if (req.method === 'POST') {
    const {
      introduction,
      targets,
      assignments,
      scheduleItems,
      medicalPlan,
      ...mainPlanningData
    } = req.body;

    try {
      const createdPlanning = await prisma.operationalPlanning.create({
        data: {
          ...mainPlanningData,
          createdBy: { connect: { id: user.id } },
          responsible: { connect: { id: user.id } },
          ...(introduction && { introduction: { create: introduction } }),
          ...(targets && { targets: {
            create: targets.map((target: any) => ({
              targetName: target.targetName,
              description: target.description,
              location: {
                connectOrCreate: {
                  where: { id: target.location?.id || 'undefined' },
                  create: {
                    name: target.location.name,
                    address: target.location.address,
                    latitude: target.location.latitude,
                    longitude: target.location.longitude,
                  },
                },
              },
            })),
          }}),
                    ...(scheduleItems && {
            scheduleItems: {
              create: scheduleItems.map((s: any) => ({
                ...s,
                id: undefined,
                time: new Date(s.time),
              })),
            },
          }),
          ...(assignments && { assignments: { create: assignments } }),
          ...(medicalPlan && {
            medicalPlan: {
              create: {
                procedures: medicalPlan.procedures,
                ...(medicalPlan.ambulanceVehicleId && { ambulanceVehicle: { connect: { id: medicalPlan.ambulanceVehicleId } } }),
                ...(medicalPlan.hospitalLocation && {
                  hospitalLocation: {
                    connectOrCreate: {
                      where: { id: medicalPlan.hospitalLocation?.id || 'undefined' },
                      create: {
                        name: medicalPlan.hospitalLocation.name,
                        address: medicalPlan.hospitalLocation.address,
                        latitude: medicalPlan.hospitalLocation.latitude,
                        longitude: medicalPlan.hospitalLocation.longitude,
                      },
                    },
                  },
                }),
              },
            },
          }),
        },
        include: includeAllRelations,
      });

      return res.status(201).json(createdPlanning);
    } catch (error) {
      console.error('Error creating planning:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: 'Failed to create planning', error: errorMessage });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default authenticateToken(handler);