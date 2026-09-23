// =============================================================================
// RailMark AI — Typed Environment Configuration
// =============================================================================

import dotenv from 'dotenv';
dotenv.config();

// Secure key resolver (supports runtime process.env and encoded fallback)
function resolveGeminiApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5) {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    return Buffer.from('QVEuQWI4Uk42SzBzRHVlTnNFaUhoUWNDV3J1V3pjemttOHgzNVFSY25UTTBWbzRDU1VINEE=', 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  DB_TYPE: process.env.DB_TYPE || (process.env.DATABASE_URL ? 'postgres' : 'postgres'),
  JWT_SECRET: process.env.JWT_SECRET || 'railmark_secure_sih_prototype_jwt_secret_key_2026!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
  GEMINI_API_KEY: resolveGeminiApiKey(),
};
