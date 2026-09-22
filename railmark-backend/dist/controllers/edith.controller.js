// =============================================================================
// RailMark AI — E.D.I.T.H AI Controller
// =============================================================================
import { chatWithEdith } from '../services/edith.service.js';
import { DashboardService } from '../services/dashboard.service.js';
export const EdithController = {
    async chat(req, res) {
        try {
            const { message, history } = req.body;
            if (!message || typeof message !== 'string' || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    error: 'Prompt message is required.',
                });
            }
            // Fetch live telemetry context from the dashboard service
            let statsContext = null;
            try {
                statsContext = await DashboardService.getStats();
            }
            catch (err) {
                // Continue without stats context if unavailable
            }
            const response = await chatWithEdith(message.trim(), history || [], statsContext);
            return res.status(200).json({
                success: true,
                data: response,
            });
        }
        catch (error) {
            console.error('[EdithController] Chat error:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'E.D.I.T.H AI encountered an unexpected error.',
            });
        }
    },
};
//# sourceMappingURL=edith.controller.js.map