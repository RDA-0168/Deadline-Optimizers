"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_js_1 = require("../controllers/search.controller.js");
const validate_middleware_js_1 = require("../middlewares/validate.middleware.js");
const search_schema_js_1 = require("../schemas/search.schema.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
// GET /api/search?q=
router.get('/', auth_middleware_js_1.optionalAuthenticate, (0, validate_middleware_js_1.validate)(search_schema_js_1.searchSchema), search_controller_js_1.SearchController.search);
exports.default = router;
//# sourceMappingURL=search.routes.js.map