// =============================================================================
// RailMark AI — Zone, AI Assessment, and Media Controllers
// =============================================================================
import { ZoneService } from '../services/zone.service.js';
import { AIAssessmentService } from '../services/aiAssessment.service.js';
import { MediaService } from '../services/media.service.js';
export class ZoneController {
    static async getAllZones(req, res) {
        try {
            const zones = await ZoneService.getAllZones();
            res.status(200).json({ success: true, data: zones });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async getZoneByCode(req, res) {
        try {
            const code = String(req.params.code);
            const zone = await ZoneService.getZoneByCode(code);
            if (!zone) {
                res.status(404).json({ success: false, error: `Zone ${code} not found.` });
                return;
            }
            res.status(200).json({ success: true, data: zone });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async createZone(req, res) {
        try {
            const zone = await ZoneService.createZone(req.body);
            res.status(201).json({ success: true, data: zone });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}
export class AIAssessmentController {
    static async getForFitting(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            const assessments = await AIAssessmentService.getAssessmentsByFittingId(fittingId);
            res.status(200).json({ success: true, data: assessments });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async createAssessment(req, res) {
        try {
            const assessment = await AIAssessmentService.createAssessment(req.body);
            res.status(201).json({ success: true, data: assessment });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}
export class MediaController {
    static async getForFitting(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            const media = await MediaService.getMediaByFittingId(fittingId);
            res.status(200).json({ success: true, data: media });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async recordMedia(req, res) {
        try {
            const uploadedBy = req.user?.fullName || req.user?.username || req.body.uploadedBy || 'Inspector';
            const record = await MediaService.recordMedia({ ...req.body, uploadedBy });
            res.status(201).json({ success: true, data: record });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}
//# sourceMappingURL=zone.controller.js.map