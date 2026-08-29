import { LifecycleEvent } from '../types/lifecycle.types.js';
export declare class LifecycleService {
    static getLifecycleByFittingId(fittingId: string): Promise<LifecycleEvent[]>;
}
