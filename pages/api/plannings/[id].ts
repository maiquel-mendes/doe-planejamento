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
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Planning ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const planning = await prisma.operationalPlanning.findUnique({
        where: { id },
        include: includeAllRelations,
      });
      if (!planning) {
        return res.status(404).json({ message: 'Planning not found' });
      }
      return res.status(200).json(planning);
    } catch (error) {
      console.error(`Error fetching planning with ID ${id}:`, error);
      return res.status(500).json({ message: 'Failed to fetch planning' });
    }
  }

  if (req.method === 'PUT') {
    const {
      introduction,
      targets,
      assignments,
      scheduleItems,
      medicalPlan,
      ...mainPlanningData
    } = req.body;

    try {
      const updatedPlanning = await prisma.$transaction(async (tx) => {
        // 1. Update main planning data and its direct 1-to-1 relations
        await tx.operationalPlanning.update({
          where: { id },
          data: {
            ...mainPlanningData,
            ...(introduction && { introduction: { upsert: { where: { planningId: id }, create: { ...introduction }, update: introduction } } }),
          },
        });

        // 2. Handle Medical Plan and its nested location
        if (medicalPlan) {
          const hospitalLocation = await tx.location.upsert({
            where: { id: medicalPlan.hospitalLocation?.id || 'undefined' },
            create: { ...(medicalPlan.hospitalLocation as any), id: undefined },
            update: { ...(medicalPlan.hospitalLocation as any) },
          });

          await tx.medicalPlan.upsert({
            where: { planningId: id },
            create: {
              planningId: id,
              procedures: medicalPlan.procedures,
              ambulanceVehicleId: medicalPlan.ambulanceVehicleId,
              hospitalLocationId: hospitalLocation.id,
            },
            update: {
              procedures: medicalPlan.procedures,
              ambulanceVehicleId: medicalPlan.ambulanceVehicleId,
              hospitalLocationId: hospitalLocation.id,
            },
          });
        }

        // 3. Overwrite all many-to-one relations
        await tx.planningTarget.deleteMany({ where: { planningId: id } });
        if (targets && targets.length > 0) {
          for (const target of targets) {
            if (target.location?.name) {
              const location = await tx.location.upsert({
                where: { id: target.location.id || 'undefined' },
                create: { ...target.location, id: undefined },
                update: { ...target.location },
              });

              await tx.planningTarget.create({
                data: {
                  planningId: id,
                  targetName: target.targetName,
                  description: target.description,
                  locationId: location.id,
                },
              });
            }
          }
        }

        await tx.planningAssignment.deleteMany({ where: { planningId: id } });
        if (assignments && assignments.length > 0) {
          for (const assignment of assignments) {
            if (assignment.userId && assignment.functionIds?.length > 0) {
              await tx.planningAssignment.create({
                data: {
                  planningId: id,
                  userId: assignment.userId,
                  vehicleId: assignment.vehicleId,
                  functions: {
                    connect: assignment.functionIds.map((fid: string) => ({ id: fid }))
                  },
                },
              });
            }
          }
        }

        await tx.planningScheduleItem.deleteMany({ where: { planningId: id } });
        if (scheduleItems && scheduleItems.length > 0) {
          await tx.planningScheduleItem.createMany({
            data: scheduleItems.map((item: any) => ({ id: undefined, time: new Date(item.time), activity: item.activity, planningId: id })),
          });
        }

        // 4. Fetch and return the final state
        return tx.operationalPlanning.findUniqueOrThrow({
          where: { id },
          include: includeAllRelations,
        });
      });

      return res.status(200).json(updatedPlanning);
    } catch (error) {
      console.error(`Error updating planning with ID ${id}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: 'Failed to update planning', error: errorMessage });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.$transaction([
        prisma.introductionSection.deleteMany({ where: { planningId: id } }),
        prisma.planningTarget.deleteMany({ where: { planningId: id } }),
        prisma.planningAssignment.deleteMany({ where: { planningId: id } }),
        prisma.planningScheduleItem.deleteMany({ where: { planningId: id } }),
        prisma.medicalPlan.deleteMany({ where: { planningId: id } }),
        prisma.operationalPlanning.delete({ where: { id } }),
      ]);
      return res.status(204).end();
    } catch (error) {
      console.error(`Error deleting planning with ID ${id}:`, error);
      return res.status(500).json({ message: 'Failed to delete planning' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default authenticateToken(handler);