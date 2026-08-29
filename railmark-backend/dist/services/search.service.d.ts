import { FittingRecord } from '../types/fitting.types.js';
export declare class SearchService {
    static search(query: string, page?: number, limit?: number): Promise<{
        items: FittingRecord[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
