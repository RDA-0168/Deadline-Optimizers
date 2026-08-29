export interface InspectionRecord {
    id: string;
    fittingId: string;
    inspectionDate: string;
    inspectorId: string;
    inspectorName: string;
    condition: 'Good' | 'Moderate' | 'Fair' | 'Critical' | 'Severe';
    qrReadability: 'High' | 'Medium' | 'Low' | 'Unreadable';
    corrosion: 'None' | 'Light' | 'Moderate' | 'Severe';
    surfaceDamage: 'None' | 'Minor Scratch' | 'Crack Detected' | 'Spalling';
    deformation: 'None' | 'Slight Bend' | 'Severe Distortion';
    wear: 'Minimal' | 'Normal' | 'Excessive';
    notes: string;
    aiAssistanceResult: string;
    aiConfidence: number;
    createdAt: string;
}
export interface CreateInspectionDto {
    inspectionDate?: string;
    inspector?: string;
    condition: 'Good' | 'Moderate' | 'Fair' | 'Critical' | 'Severe';
    qrReadability: 'High' | 'Medium' | 'Low' | 'Unreadable';
    corrosion: 'None' | 'Light' | 'Moderate' | 'Severe';
    surfaceDamage: 'None' | 'Minor Scratch' | 'Crack Detected' | 'Spalling';
    deformation: 'None' | 'Slight Bend' | 'Severe Distortion';
    wear: 'Minimal' | 'Normal' | 'Excessive';
    notes: string;
    aiAssistanceResult: string;
    aiConfidence: number;
}
