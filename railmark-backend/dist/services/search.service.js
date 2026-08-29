"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const index_js_1 = require("../db/index.js");
class SearchService {
    static async search(query, page = 1, limit = 20) {
        const results = await index_js_1.db.search(query);
        const total = results.length;
        const p = page > 0 ? page : 1;
        const l = limit > 0 ? limit : 20;
        const start = (p - 1) * l;
        const items = results.slice(start, start + l);
        const totalPages = Math.ceil(total / l) || 1;
        return {
            items,
            total,
            page: p,
            limit: l,
            totalPages,
        };
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map