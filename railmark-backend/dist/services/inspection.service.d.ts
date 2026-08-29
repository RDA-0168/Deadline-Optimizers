import { CreateInspectionDto, InspectionRecord } from '../types/inspection.types.js';
import { JwtPayload } from '../types/auth.types.js';
export declare class InspectionService {
    static getInspectionsByFittingId(fittingId: string): Promise<InspectionRecord[]>;
    static createInspection(fittingId: string, dto: CreateInspectionDto, user?: JwtPayload, ipAddress?: string): Promise<InspectionRecord>;
}
