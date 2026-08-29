import { QRDetailResponse, QRResolveResult } from '../types/qr.types.js';
import { JwtPayload } from '../types/auth.types.js';
export declare class QRService {
    static getQRInfo(fittingId: string): Promise<QRDetailResponse>;
    static resolveQR(rawQrValue: string, user?: JwtPayload, ipAddress?: string): Promise<QRResolveResult>;
}
