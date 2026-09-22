// =============================================================================
// RailMark AI — AI Vision Assessment Service
// =============================================================================

import { prisma } from '../db/prisma.js';

export class AIAssessmentService {
  static async getAssessmentsByFittingId(fittingId: string) {
    try {
      return await prisma.aiAssessment.findMany({
        where: { fittingId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  static async getAssessmentByInspectionId(inspectionId: string) {
    try {
      return await prisma.aiAssessment.findUnique({
        where: { inspectionId },
      });
    } catch {
      return null;
    }
  }

  static async createAssessment(data: {
    fittingId: string;
    inspectionId?: string;
    confidence?: number;
    conditionAssessment?: any;
    qrQuality?: number;
    defectDetected?: boolean;
    defectType?: string;
    recommendation?: string;
    imageUrl?: string;
    metadata?: any;
  }) {
    return await prisma.aiAssessment.create({
      data: {
        fittingId: data.fittingId,
        inspectionId: data.inspectionId,
        confidence: data.confidence ?? 95.0,
        conditionAssessment: data.conditionAssessment || 'Good',
        qrQuality: data.qrQuality ?? 92.0,
        defectDetected: data.defectDetected ?? false,
        defectType: data.defectType,
        recommendation: data.recommendation,
        imageUrl: data.imageUrl,
        metadata: data.metadata,
      },
    });
  }
}
