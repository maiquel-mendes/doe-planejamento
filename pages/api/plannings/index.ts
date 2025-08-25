import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import {
  authenticateToken,
  type AuthenticatedRequest,
} from '@/lib/auth-middleware';
import type { Prisma } from '@/lib/generated/prisma';
import type { Location } from '@/lib/generated/prisma';

const includeAllRelations: Prisma.OperationalPlanningInclude = {
  introduction: true,
  targets: { include: { location: true, images: true } }, // Added images: true
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
  communicationsPlan: true,
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

    // Define specific types for request body data
    type TargetData = {
      targetName: string;
      description?: string;
      location: Location;
      images?: { url: string; publicId: string }[];
    };
    type ScheduleItemData = { time: string; activity: string };
    type AssignmentData = {
      userId: string;
      vehicleId?: string | null;
      functionIds: string[];
    };

    try {
      const createdPlanning = await prisma.operationalPlanning.create({
        data: {
          ...mainPlanningData,
          createdBy: { connect: { id: user.id } },
          responsible: { connect: { id: user.id } },
          ...(introduction && { introduction: { create: introduction } }),
          ...(targets && { targets: {
            create: targets.map((target: TargetData) => ({
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
              images: {
                create: target.images?.map(img => ({ url: img.url, publicId: img.publicId })) || [],
              },
            })),
          }}),
          ...(scheduleItems && {
            scheduleItems: {
              create: scheduleItems.map((s: ScheduleItemData) => ({
                time: new Date(s.time),
                activity: s.activity,
              })),
            },
          }),
          ...(assignments && { assignments: { create: assignments.map((a: AssignmentData) => ({
            userId: a.userId,
            vehicleId: a.vehicleId,
            functions: { connect: a.functionIds.map(fid => ({ id: fid })) },
          })) } }),
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