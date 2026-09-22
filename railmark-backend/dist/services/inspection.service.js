// =============================================================================
// RailMark AI — Inspection Service (PostgreSQL + AI Vision + Lifecycle Integration)
// =============================================================================
import { prisma } from '../db/prisma.js';
import { LifecycleService } from './lifecycle.service.js';
import { AIAssessmentService } from './aiAssessment.service.js';
export class InspectionService {
    static async getAllInspections(limit = 100) {
        try {
            const inspections = await prisma.inspection.findMany({
                take: limit,
                orderBy: { inspectionDate: 'desc' },
                include: {
                    aiAssessment: true,
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
            return inspections.map(this.formatInspectionResponse);
        }
        catch {
            return [];
        }
    }
    static async getInspectionsByFittingId(fittingId) {
        try {
            const inspections = await prisma.inspection.findMany({
                where: { fittingId },
                orderBy: { inspectionDate: 'desc' },
                include: {
                    aiAssessment: true,
                    mediaMetadata: true,
                },
            });
            return inspections.map(this.formatInspectionResponse);
        }
        catch {
            return [];
        }
    }
    static async createInspection(data, inspectorName) {
        const inspectionId = data.id || `INSP-${Date.now()}`;
        const inspector = inspectorName || data.inspector || 'Senior Track Inspector';
        // Condition mapping
        const conditionMap = {
            Good: 'Good',
            'Needs Attention': 'NeedsAttention',
            NeedsAttention: 'NeedsAttention',
            'Maintenance Required': 'MaintenanceRequired',
            MaintenanceRequired: 'MaintenanceRequired',
            Critical: 'Critical',
        };
        const condition = conditionMap[data.condition] || 'Good';
        // 1. Create inspection record
        const created = await prisma.inspection.create({
            data: {
                id: inspectionId,
                fittingId: data.fittingId,
                inspectionDate: data.inspectionDate ? new Date(data.inspectionDate) : new Date(),
                inspector: inspector,
                inspectorId: data.inspectorId || 'RM-INS-001',
                condition: condition,
                qrReadability: data.qrReadability || 'Good',
                corrosion: data.corrosion || 'None',
                surfaceDamage: data.surfaceDamage || 'None',
                deformation: data.deformation || 'None',
                wear: data.wear || 'Normal',
                notes: data.notes || '',
                imageUrl: data.imageUrl,
            },
        });
        // 2. Create AI Vision assessment record if provided
        if (data.aiConfidence !== undefined || data.aiCondition || data.aiAssistanceResult) {
            await AIAssessmentService.createAssessment({
                inspectionId: created.id,
                fittingId: data.fittingId,
                confidence: data.aiConfidence || 95.0,
                conditionAssessment: conditionMap[data.aiCondition || data.aiAssistanceResult || data.condition] || 'Good',
                qrQuality: data.aiQrQuality || 92.0,
                defectDetected: data.defectDetected || condition === 'MaintenanceRequired' || condition === 'Critical',
                defectType: data.defectType || (condition !== 'Good' ? `${data.wear || ''} wear / ${data.corrosion || ''} corrosion` : undefined),
                recommendation: data.recommendation || (condition === 'Good' ? 'Fitting verified in optimal state.' : 'Schedule maintenance intervention.'),
                imageUrl: data.imageUrl,
            });
        }
        // 3. Update fitting's last inspection date & status
        try {
            await prisma.fitting.update({
                where: { id: data.fittingId },
                data: {
                    lastInspectionDate: created.inspectionDate,
                    status: condition === 'Good' ? 'Active' : condition === 'Critical' ? 'Critical' : 'MaintenanceRequired',
                },
            });
        }
        catch {
            // Ignore if fitting not found in standalone mode
        }
        // 4. Append Immutable Lifecycle Event
        await LifecycleService.appendEvent({
            fittingId: data.fittingId,
            event: 'Inspected',
            actor: inspector,
            location: data.location || 'Track Field Inspection Zone',
            notes: `Periodic inspection: Condition assessed as ${data.condition} (AI Confidence: ${data.aiConfidence || 95}%).`,
        });
        return this.formatInspectionResponse(created);
    }
    static formatInspectionResponse(i) {
        return {
            id: i.id,
            fittingId: i.fittingId,
            inspectionDate: i.inspectionDate ? new Date(i.inspectionDate).toISOString().split('T')[0] : '',
            inspector: i.inspector,
            inspectorName: i.inspector,
            inspectorId: i.inspectorId,
            condition: i.condition,
            qrReadability: i.qrReadability,
            corrosion: i.corrosion,
            surfaceDamage: i.surfaceDamage,
            deformation: i.deformation,
            wear: i.wear,
            notes: i.notes || '',
            aiConfidence: i.aiAssessment ? Number(i.aiAssessment.confidence) : 95,
            aiCondition: i.aiAssessment?.conditionAssessment || i.condition,
            aiAssistanceResult: i.aiAssessment?.conditionAssessment || i.condition,
            aiQrQuality: i.aiAssessment ? Number(i.aiAssessment.qrQuality) : 92,
            imageUrl: i.imageUrl || i.aiAssessment?.imageUrl,
            images: i.imageUrl ? [i.imageUrl] : [],
            createdAt: i.createdAt,
        };
    }
}
//# sourceMappingURL=inspection.service.js.map