import { AuditLogEntry, CreateAuditLogDto } from '../types/audit.types.js';
export declare class AuditService {
    static logAction(dto: CreateAuditLogDto): Promise<AuditLogEntry>;
    static getLogs(limit?: number, page?: number): Promise<{
        items: AuditLogEntry[];
        total: number;
    }>;
}
