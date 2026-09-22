// =============================================================================
// RailMark AI — Railway Zone Service
// =============================================================================
import { prisma } from '../db/prisma.js';
export class ZoneService {
    static async getAllZones() {
        try {
            return await prisma.railwayZone.findMany({
                where: { active: true },
                orderBy: { code: 'asc' },
                include: {
                    _count: {
                        select: { fittings: true, users: true },
                    },
                },
            });
        }
        catch {
            // Fallback
            return [
                { id: 'zone-nr', code: 'NR', name: 'Northern Railway', headquarters: 'New Delhi', divisions: ['Delhi', 'Ambala'], active: true },
                { id: 'zone-cr', code: 'CR', name: 'Central Railway', headquarters: 'Mumbai', divisions: ['Mumbai CST', 'Pune'], active: true },
                { id: 'zone-wr', code: 'WR', name: 'Western Railway', headquarters: 'Mumbai', divisions: ['Vadodara', 'Ahmedabad'], active: true },
                { id: 'zone-sr', code: 'SR', name: 'Southern Railway', headquarters: 'Chennai', divisions: ['Chennai', 'Madurai'], active: true },
            ];
        }
    }
    static async getZoneByCode(code) {
        try {
            return await prisma.railwayZone.findUnique({
                where: { code: code.toUpperCase() },
                include: { fittings: true },
            });
        }
        catch {
            return null;
        }
    }
    static async createZone(data) {
        return await prisma.railwayZone.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                headquarters: data.headquarters,
                divisions: data.divisions || [],
                active: data.active ?? true,
            },
        });
    }
}
//# sourceMappingURL=zone.service.js.map