export declare class SeedService {
    /**
     * Seed all 12 track fittings, zones, users, inspections, maintenance, and lifecycle logs.
     * @param force If true, clears existing tables before seeding. If false, seeds only if empty.
     */
    static seedDatabase(force?: boolean): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
}
