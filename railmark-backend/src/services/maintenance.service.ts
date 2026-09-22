// =============================================================================
// RailMark AI — Maintenance Service (PostgreSQL + Lifecycle Integration)
// =============================================================================

import { prisma } from '../db/prisma.js';
import { LifecycleService } from './lifecycle.service.js';

export class MaintenanceService {
  static async getAllMaintenance(limit = 100) {
    try {
      const records = await prisma.maintenanceRecord.findMany({
        take: limit,
        orderBy: { maintenanceDate: 'desc' },
        include: {
          fitting: {
            select: {
              id: true,
              qrCodeValue: true,
              fittingType: true,
              railwayZoneName: true,
              trackSection: true,
            },
          },
        },
      });

      return records.map(this.formatMaintenanceResponse);
    } catch {
      return [];
    }
  }

  static async getMaintenanceByFittingId(fittingId: string) {
    try {
      const records = await prisma.maintenanceRecord.findMany({
        where: { fittingId },
        orderBy: { maintenanceDate: 'desc' },
      });

      return records.map(this.formatMaintenanceResponse);
    } catch {
      return [];
    }
  }

  static async createMaintenance(data: any, technicianName?: string) {
    const maintenanceId = data.id || `MNT-${Date.now()}`;
    const tech = technicianName || data.technician || 'Track Maintenance Lead';

    const created = await prisma.maintenanceRecord.create({
      data: {
        id: maintenanceId,
        fittingId: data.fittingId,
        maintenanceDate: data.maintenanceDate ? new Date(data.maintenanceDate) : new Date(),
        maintenanceType: (data.maintenanceType as any) || 'Preventive',
        technician: tech,
        technicianId: data.technicianId || 'RM-MNT-9932',
        description: data.description || 'Maintenance service logged.',
        status: (data.status as any) || 'Completed',
        nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : undefined,
        cost: data.cost || '₹ 350',
        partsReplaced: data.partsReplaced || [],
      },
    });

    // Update fitting maintenance status
    try {
      await prisma.fitting.update({
        where: { id: data.fittingId },
        data: {
          maintenanceStatus: (data.status as any) || 'Completed',
          nextInspectionDate: data.nextMaintenance ? new Date(data.nextMaintenance) : undefined,
        },
      });
    } catch {
      // Ignore in standalone demo mode
    }

    // Append Immutable Lifecycle Event
    await LifecycleService.appendEvent({
      fittingId: data.fittingId,
      event: 'Maintained',
      actor: tech,
      location: data.location || 'Track Maintenance Division',
      notes: `${data.maintenanceType || 'Routine'} maintenance: ${data.description}. Status: ${data.status || 'Completed'}.`,
    });

    return this.formatMaintenanceResponse(created);
  }

  private static formatMaintenanceResponse(m: any) {
    return {
      id: m.id,
      fittingId: m.fittingId,
      maintenanceDate: m.maintenanceDate ? new Date(m.maintenanceDate).toISOString().split('T')[0] : '',
      maintenanceType: m.maintenanceType,
      technician: m.technician,
      technicianName: m.technician,
      technicianId: m.technicianId,
      description: m.description,
      status: m.status,
      nextMaintenance: m.nextMaintenance ? new Date(m.nextMaintenance).toISOString().split('T')[0] : '',
      cost: m.cost,
      partsReplaced: m.partsReplaced || [],
      createdAt: m.createdAt,
    };
  }
}
