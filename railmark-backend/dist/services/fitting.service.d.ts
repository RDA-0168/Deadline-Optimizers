import { FittingRecord, FittingFullDetails, CreateFittingDto, UpdateFittingDto } from '../types/fitting.types.js';
import { JwtPayload } from '../types/auth.types.js';
export declare class FittingService {
    static getAllFittings(query?: {
        status?: string;
        fittingType?: string;
        manufacturer?: string;
        railLine?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: FittingRecord[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    static getFittingFullDetails(fittingId: string): Promise<FittingFullDetails>;
    static createFitting(dto: CreateFittingDto, user?: JwtPayload, ipAddress?: string): Promise<FittingRecord>;
    static updateFitting(fittingId: string, dto: UpdateFittingDto, user?: JwtPayload, ipAddress?: string): Promise<FittingRecord>;
    static deleteFitting(fittingId: string, user?: JwtPayload, ipAddress?: string): Promise<void>;
}
