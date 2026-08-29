export interface QRResolveInput {
    qrValue: string;
}
export interface QRResolveResult {
    success: boolean;
    fittingId?: string;
    message?: string;
    data?: {
        fittingId: string;
        qrValue: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        status: string;
        verificationStatus: string;
        laserMarkDate: string;
    };
}
export interface QRDetailResponse {
    fittingId: string;
    qrCodeValue: string;
    qrPayloadUrl: string;
    laserMarkDate: string;
    markingMachineId: string;
    qrVerificationStatus: string;
    laserMarkingSpecs: {
        laserType: string;
        markDepthMicrons: number;
        dpi: number;
        matrixStandard: string;
        durabilityStandard: string;
    };
}
