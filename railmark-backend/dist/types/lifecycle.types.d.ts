import { LifecycleEventTypeValue } from '../constants/roles.js';
export interface LifecycleEvent {
    id: string;
    fittingId: string;
    eventType: LifecycleEventTypeValue;
    eventDate: string;
    actor: string;
    location: string;
    details: string;
    metadata?: Record<string, any>;
    createdAt: string;
}
export interface CreateLifecycleEventDto {
    fittingId: string;
    eventType: LifecycleEventTypeValue;
    eventDate: string;
    actor: string;
    location: string;
    details: string;
    metadata?: Record<string, any>;
}
