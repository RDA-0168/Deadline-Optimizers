"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_js_1 = require("../config/env.js");
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_js_1.ENV.RATE_LIMIT_WINDOW_MS,
    max: env_js_1.ENV.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
//# sourceMappingURL=rateLimiter.js.map