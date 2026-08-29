export interface DashboardStats {
    totalFittings: number;
    inspected: number;
    maintenanceDue: number;
    pendingInspection: number;
    recentScans: number;
    qrVerificationStatus: {
        verified: number;
        unverified: number;
        degraded: number;
    };
    conditionBreakdown: {
        good: number;
        moderate: number;
        fair: number;
        critical: number;
        severe: number;
    };
    recentActivities: {
        id: string;
        action: string;
        user: string;
        fittingId?: string;
        timestamp: string;
        details: string;
    }[];
}
