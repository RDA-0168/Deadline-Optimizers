import { AuditActionType, UserRole } from '../constants/roles.js';
export interface AuditLogEntry {
    id: string;
    user: string;
    role: UserRole | 'SYSTEM' | 'ANONYMOUS';
    action: AuditActionType | string;
    fittingId?: string;
    timestamp: string;
    ipAddress?: string;
    details?: string;
    metadata?: Record<string, any>;
}
export interface CreateAuditLogDto {
    user: string;
    role: UserRole | 'SYSTEM' | 'ANONYMOUS';
    action: AuditActionType | string;
    fittingId?: string;
    ipAddress?: string;
    details?: string;
    metadata?: Record<string, any>;
}
