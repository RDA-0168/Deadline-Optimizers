// =============================================================================
// RailMark AI — Fitting Service (PostgreSQL & Unique QR Code Handling)
// =============================================================================

import { prisma } from '../db/prisma.js';
import { LifecycleService } from './lifecycle.service.js';

export class FittingService {
  static async getAllFittings(options: {
    status?: string;
    zone?: string;
    type?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const limit = options.limit || 100;
    const offset = options.offset || 0;

    try {
      const where: any = {};
      if (options.status && options.status !== 'All') {
        where.status = options.status.replace(/\s+/g, '') as any;
      }
      if (options.zone && options.zone !== 'All') {
        where.railwayZoneName = { contains: options.zone, mode: 'insensitive' };
      }
      if (options.type && options.type !== 'All') {
        where.fittingType = { contains: options.type, mode: 'insensitive' };
      }

      const fittings = await prisma.fitting.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          railwayZone: true,
          inspections: {
            take: 3,
            orderBy: { inspectionDate: 'desc' },
            include: { aiAssessment: true },
          },
          maintenanceRecords: {
            take: 3,
            orderBy: { maintenanceDate: 'desc' },
          },
          lifecycleEvents: {
            orderBy: { eventDate: 'desc' },
          },
        },
      });

      return fittings.map(this.formatFittingResponse);
    } catch {
      // Fallback
      return [];
    }
  }

  static async getFittingById(id: string) {
    try {
      const fitting = await prisma.fitting.findFirst({
        where: {
          OR: [
            { id: id },
            { qrCodeValue: id },
          ],
        },
        include: {
          railwayZone: true,
          inspections: {
            orderBy: { inspectionDate: 'desc' },
            include: {
              aiAssessment: true,
              mediaMetadata: true,
            },
          },
          maintenanceRecords: {
            orderBy: { maintenanceDate: 'desc' },
          },
          lifecycleEvents: {
            orderBy: { eventDate: 'desc' },
          },
          aiAssessments: {
            orderBy: { createdAt: 'desc' },
          },
          mediaMetadata: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!fitting) return null;
      return this.formatFittingComposite(fitting);
    } catch {
      return null;
    }
  }

  static async createFitting(data: any, actorName: string = 'System Admin') {
    const fittingId = data.fittingId || data.id || `RM-FIT-${String(Date.now()).slice(-4)}`;
    const qrCodeValue = data.qrCodeValue || data.qrId || fittingId;

    // Check unique QR code constraint
    const existingQr = await prisma.fitting.findFirst({
      where: {
        OR: [{ id: fittingId }, { qrCodeValue: qrCodeValue }],
      },
    });

    if (existingQr) {
      const err = new Error(`A fitting with QR Code / ID "${qrCodeValue}" already exists. QR IDs must be unique across the railway network.`);
      (err as any).statusCode = 409;
      throw err;
    }

    const created = await prisma.fitting.create({
      data: {
        id: fittingId,
        qrCodeValue: qrCodeValue,
        fittingType: data.fittingType || 'Elastic Rail Clip (ERC MK-III)',
        manufacturer: data.manufacturer || 'Standard Track Systems',
        batchNumber: data.batchNumber || `BATCH-${new Date().getFullYear()}-001`,
        manufacturingDate: new Date(data.manufacturingDate || Date.now()),
        materialGrade: data.materialGrade || data.material || 'Spring Steel 55Si7',
        standardSpec: data.standardSpec || 'IRS:T-31-2021',
        status: (data.status?.replace(/\s+/g, '') as any) || 'Active',
        railLine: data.railLine || data.railwayZone || 'Northern High-Density Corridor',
        trackSection: data.trackSection || data.location || 'Section KM 142/4 - Up Main Line',
        sleeperNumber: data.sleeperNumber || 'PSC-SLP-01',
        railwayZoneName: data.railwayZoneName || data.railwayZone || 'Northern Railway',
        division: data.division || 'Delhi Division',
        kmMark: data.kmMark || 'KM 142/4',
        trackType: data.trackType || 'Broad Gauge (1676mm)',
        gpsLatitude: data.gpsLatitude || 28.6139,
        gpsLongitude: data.gpsLongitude || 77.2090,
        installedBy: data.installedBy || actorName,
        installationDate: new Date(data.installationDate || Date.now()),
        torqueSpecNm: data.torqueSpecNm || 110.0,
        laserMarkDate: data.laserMarkDate ? new Date(data.laserMarkDate) : new Date(),
        markingMachineId: data.markingMachineId || 'LM-RDSO-04',
        qrVerificationStatus: (data.qrVerificationStatus as any) || 'Verified',
        lastInspectionDate: data.lastInspectionDate ? new Date(data.lastInspectionDate) : new Date(),
        nextInspectionDate: data.nextInspectionDate ? new Date(data.nextInspectionDate) : undefined,
        maintenanceStatus: (data.maintenanceStatus as any) || 'Completed',
        material: data.material || data.materialGrade || 'Spring Steel',
        weight: data.weight || '0.92 kg',
        description: data.description || `${data.fittingType} with unique laser etched QR code.`,
      },
    });

    // Append-Only Lifecycle Event: Created & QR Verified
    await LifecycleService.appendEvent({
      fittingId: created.id,
      event: 'QRVerified',
      actor: actorName,
      location: created.trackSection,
      notes: `Direct Part Marking laser QR (${created.qrCodeValue}) registered in master database.`,
    });

    return this.formatFittingResponse(created);
  }

  static async updateFitting(id: string, data: any) {
    const updateData: any = {};
    if (data.status) updateData.status = data.status.replace(/\s+/g, '');
    if (data.fittingType) updateData.fittingType = data.fittingType;
    if (data.trackSection || data.location) updateData.trackSection = data.trackSection || data.location;
    if (data.materialGrade || data.material) updateData.materialGrade = data.materialGrade || data.material;
    if (data.standardSpec) updateData.standardSpec = data.standardSpec;
    if (data.torqueSpecNm !== undefined) updateData.torqueSpecNm = data.torqueSpecNm;
    if (data.qrVerificationStatus) updateData.qrVerificationStatus = data.qrVerificationStatus;
    if (data.maintenanceStatus) updateData.maintenanceStatus = data.maintenanceStatus;
    if (data.lastInspectionDate) updateData.lastInspectionDate = new Date(data.lastInspectionDate);
    if (data.nextInspectionDate) updateData.nextInspectionDate = new Date(data.nextInspectionDate);
    if (data.description) updateData.description = data.description;

    const updated = await prisma.fitting.update({
      where: { id },
      data: updateData,
    });

    return this.formatFittingResponse(updated);
  }

  static async deleteFitting(id: string) {
    return await prisma.fitting.delete({
      where: { id },
    });
  }

  private static formatFittingResponse(f: any) {
    return {
      fittingId: f.id,
      id: f.id,
      qrCodeValue: f.qrCodeValue,
      qrId: f.qrCodeValue,
      fittingType: f.fittingType,
      manufacturer: f.manufacturer,
      batchNumber: f.batchNumber,
      manufacturingDate: f.manufacturingDate ? new Date(f.manufacturingDate).toISOString().split('T')[0] : '',
      materialGrade: f.materialGrade,
      standardSpec: f.standardSpec,
      status: f.status,
      railLine: f.railLine,
      trackSection: f.trackSection,
      location: f.trackSection,
      sleeperNumber: f.sleeperNumber,
      railwayZone: f.railwayZoneName || f.railwayZone?.name || 'Northern Railway',
      railwayZoneName: f.railwayZoneName || f.railwayZone?.name || 'Northern Railway',
      division: f.division,
      kmMark: f.kmMark,
      trackType: f.trackType,
      gpsLatitude: Number(f.gpsLatitude),
      gpsLongitude: Number(f.gpsLongitude),
      installedBy: f.installedBy,
      installationDate: f.installationDate ? new Date(f.installationDate).toISOString().split('T')[0] : '',
      torqueSpecNm: Number(f.torqueSpecNm),
      laserMarkDate: f.laserMarkDate,
      markingMachineId: f.markingMachineId,
      qrVerificationStatus: f.qrVerificationStatus,
      lastInspectionDate: f.lastInspectionDate ? new Date(f.lastInspectionDate).toISOString().split('T')[0] : '',
      nextInspectionDate: f.nextInspectionDate ? new Date(f.nextInspectionDate).toISOString().split('T')[0] : '',
      maintenanceStatus: f.maintenanceStatus,
      material: f.material || f.materialGrade,
      weight: f.weight,
      description: f.description,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    };
  }

  private static formatFittingComposite(f: any) {
    const formatted = this.formatFittingResponse(f);
    return {
      basicInfo: formatted,
      installationInfo: {
        railLine: f.railLine,
        trackSection: f.trackSection,
        sleeperNumber: f.sleeperNumber,
        installedBy: f.installedBy,
        installationDate: formatted.installationDate,
        torqueSpecNm: formatted.torqueSpecNm,
        gpsLatitude: formatted.gpsLatitude,
        gpsLongitude: formatted.gpsLongitude,
      },
      qrInfo: {
        qrCodeValue: f.qrCodeValue,
        laserMarkDate: f.laserMarkDate,
        markingMachineId: f.markingMachineId,
        qrVerificationStatus: f.qrVerificationStatus,
      },
      inspections: f.inspections || [],
      maintenance: f.maintenanceRecords || [],
      lifecycle: f.lifecycleEvents || [],
      aiAssessments: f.aiAssessments || [],
      media: f.mediaMetadata || [],
    };
  }
}
