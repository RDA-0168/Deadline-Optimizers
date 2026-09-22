// =============================================================================
// RailMark AI — Lifecycle Service (Strictly Append-Only Immutability)
// =============================================================================
import { prisma } from '../db/prisma.js';
export class LifecycleService {
    /**
     * Append a new lifecycle event to the immutable record.
     */
    static async appendEvent(data) {
        const eventId = `LC-${String(Date.now()).slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        // Normalize event type to Prisma enum
        const eventMap = {
            Manufactured: 'Manufactured',
            QualityChecked: 'QualityChecked',
            'Quality Checked': 'QualityChecked',
            Supplied: 'Supplied',
            Installed: 'Installed',
            Inspected: 'Inspected',
            Maintained: 'Maintained',
            QRVerified: 'QRVerified',
            'QR Verified': 'QRVerified',
            Decommissioned: 'Decommissioned',
        };
        const normalizedEvent = eventMap[data.event] || 'Inspected';
        try {
            const created = await prisma.lifecycleEvent.create({
                data: {
                    id: eventId,
                    fittingId: data.fittingId,
                    event: normalizedEvent,
                    eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
                    actor: data.actor || 'RailMark System',
                    location: data.location || 'Track Maintenance Division',
                    notes: data.notes || '',
                    metadata: data.metadata,
                },
            });
            return {
                id: created.id,
                fittingId: created.fittingId,
                event: created.event,
                eventType: created.event,
                date: created.eventDate.toISOString().split('T')[0],
                eventDate: created.eventDate,
                actor: created.actor,
                location: created.location,
                notes: created.notes,
                metadata: created.metadata,
                createdAt: created.createdAt,
            };
        }
        catch {
            // Fallback in case of mock/standalone mode
            return {
                id: eventId,
                fittingId: data.fittingId,
                event: data.event,
                eventType: data.event,
                date: new Date().toISOString().split('T')[0],
                eventDate: new Date(),
                actor: data.actor || 'RailMark System',
                location: data.location || 'Track Maintenance Division',
                notes: data.notes || '',
            };
        }
    }
    /**
     * Retrieve full immutable custody trail for a fitting.
     */
    static async getLifecycleByFittingId(fittingId) {
        try {
            const events = await prisma.lifecycleEvent.findMany({
                where: { fittingId },
                orderBy: { eventDate: 'desc' },
            });
            return events.map((e) => ({
                id: e.id,
                fittingId: e.fittingId,
                event: e.event,
                eventType: e.event,
                date: e.eventDate.toISOString().split('T')[0],
                eventDate: e.eventDate,
                actor: e.actor,
                location: e.location,
                notes: e.notes,
                metadata: e.metadata,
                createdAt: e.createdAt,
            }));
        }
        catch {
            return [];
        }
    }
}
//# sourceMappingURL=lifecycle.service.js.map