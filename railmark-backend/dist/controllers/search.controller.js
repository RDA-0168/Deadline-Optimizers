"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_js_1 = require("../services/search.service.js");
class SearchController {
    static async search(req, res, next) {
        try {
            const q = req.query.q || '';
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const result = await search_service_js_1.SearchService.search(q, page, limit);
            res.status(200).json({
                success: true,
                data: result.items,
                meta: {
                    query: q,
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map