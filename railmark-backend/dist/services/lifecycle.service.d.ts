export declare class LifecycleService {
    /**
     * Append a new lifecycle event to the immutable record.
     */
    static appendEvent(data: {
        fittingId: string;
        event: any;
        actor: string;
        location: string;
        notes?: string;
        metadata?: any;
        eventDate?: Date | string;
    }): Promise<{
        id: string;
        fittingId: string;
        event: import(".prisma/client").$Enums.LifecycleEventType;
        eventType: import(".prisma/client").$Enums.LifecycleEventType;
        date: string;
        eventDate: Date;
        actor: string;
        location: string;
        notes: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
    } | {
        id: string;
        fittingId: string;
        event: any;
        eventType: any;
        date: string;
        eventDate: Date;
        actor: string;
        location: string;
        notes: string;
        metadata?: undefined;
        createdAt?: undefined;
    }>;
    /**
     * Retrieve full immutable custody trail for a fitting.
     */
    static getLifecycleByFittingId(fittingId: string): Promise<{
        id: string;
        fittingId: string;
        event: import(".prisma/client").$Enums.LifecycleEventType;
        eventType: import(".prisma/client").$Enums.LifecycleEventType;
        date: string;
        eventDate: Date;
        actor: string;
        location: string;
        notes: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
    }[]>;
}
