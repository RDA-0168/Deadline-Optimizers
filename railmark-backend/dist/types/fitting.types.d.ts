import { FittingStatusType } from '../constants/roles.js';
import { InspectionRecord } from './inspection.types.js';
import { MaintenanceRecord } from './maintenance.types.js';
import { LifecycleEvent } from './lifecycle.types.js';
export interface FittingBasicInfo {
    fittingId: string;
    fittingType: string;
    manufacturer: string;
    batchNumber: string;
    manufacturingDate: string;
    materialGrade: string;
    standardSpec: string;
    status: FittingStatusType;
}
export interface FittingInstallationInfo {
    railLine: string;
    trackSection: string;
    sleeperNumber: string;
    gpsLatitude: number;
    gpsLongitude: number;
    installedBy: string;
    installationDate: string;
    torqueSpecNm: number;
}
export interface FittingQRInfo {
    qrCodeValue: string;
    laserMarkDate: string;
    markingMachineId: string;
    qrVerificationStatus: 'Verified' | 'Unverified' | 'Degraded';
}
export interface FittingRecord extends FittingBasicInfo, FittingInstallationInfo, FittingQRInfo {
    createdAt: string;
    updatedAt: string;
}
export interface FittingFullDetails {
    basicInfo: FittingBasicInfo;
    installationInfo: FittingInstallationInfo;
    qrInfo: FittingQRInfo;
    inspections: InspectionRecord[];
    maintenance: MaintenanceRecord[];
    lifecycle: LifecycleEvent[];
}
export interface CreateFittingDto {
    fittingId: string;
    fittingType: string;
    manufacturer: string;
    batchNumber: string;
    manufacturingDate: string;
    materialGrade: string;
    standardSpec: string;
    status?: FittingStatusType;
    railLine: string;
    trackSection: string;
    sleeperNumber: string;
    gpsLatitude: number;
    gpsLongitude: number;
    installedBy: string;
    installationDate: string;
    torqueSpecNm: number;
    qrCodeValue?: string;
    markingMachineId?: string;
}
export interface UpdateFittingDto {
    fittingType?: string;
    manufacturer?: string;
    batchNumber?: string;
    materialGrade?: string;
    standardSpec?: string;
    status?: FittingStatusType;
    railLine?: string;
    trackSection?: string;
    sleeperNumber?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    torqueSpecNm?: number;
    qrVerificationStatus?: 'Verified' | 'Unverified' | 'Degraded';
}
