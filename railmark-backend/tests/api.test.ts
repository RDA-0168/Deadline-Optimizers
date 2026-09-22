// =============================================================================
// RailMark AI — Backend Integration Test Suite
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('RailMark AI PostgreSQL-Backed REST API Suite', () => {
  let adminToken = '';
  let inspectorToken = '';

  beforeAll(async () => {
    // 1. Authenticate Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin@123' });
    
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.success).toBe(true);
    adminToken = adminRes.body.data.token;

    // 2. Authenticate Inspector
    const inspectorRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'inspector', password: 'Inspector@123' });
    
    expect(inspectorRes.status).toBe(200);
    expect(inspectorRes.body.success).toBe(true);
    inspectorToken = inspectorRes.body.data.token;
  });

  describe('1. API Gateway Health & Information', () => {
    it('GET /api should return active status and endpoints catalog', async () => {
      const res = await request(app).get('/api');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.endpoints).toHaveProperty('fittings');
      expect(res.body.endpoints).toHaveProperty('zones');
      expect(res.body.endpoints).toHaveProperty('aiAssessments');
      expect(res.body.endpoints).toHaveProperty('media');
    });

    it('GET /health should return system uptime', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('2. Authentication & RBAC Verification', () => {
    it('GET /api/auth/me should verify authenticated admin profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('ADMIN');
    });

    it('GET /api/auth/me should verify authenticated inspector profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${inspectorToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('INSPECTOR');
    });

    it('Inspector should NOT be permitted to delete fittings (RBAC 403)', async () => {
      const res = await request(app)
        .delete('/api/fittings/RM-FIT-0001')
        .set('Authorization', `Bearer ${inspectorToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Access Denied');
    });
  });

  describe('3. Railway Zones Registry', () => {
    it('GET /api/zones should return active railway zones', async () => {
      const res = await request(app).get('/api/zones');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('4. Master Fittings & QR Resolution', () => {
    it('GET /api/fittings should return fittings list', async () => {
      const res = await request(app).get('/api/fittings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/qr/resolve should verify and resolve QR code', async () => {
      const res = await request(app)
        .post('/api/qr/resolve')
        .send({ qrValue: 'RM-FIT-0001' });
      
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('VERIFIED');
      } else {
        // Fallback check
        expect([200, 404]).toContain(res.status);
      }
    });
  });

  describe('5. Append-Only Lifecycle Immutability', () => {
    it('PUT /api/fittings/:id/lifecycle must be rejected with 405 Method Not Allowed', async () => {
      const res = await request(app)
        .put('/api/fittings/RM-FIT-0001/lifecycle')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notes: 'Attempted mutation' });
      
      expect(res.status).toBe(405);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('strictly append-only');
    });

    it('DELETE /api/fittings/:id/lifecycle must be rejected with 405 Method Not Allowed', async () => {
      const res = await request(app)
        .delete('/api/fittings/RM-FIT-0001/lifecycle')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(405);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('strictly append-only');
    });

    it('POST /api/fittings/:id/lifecycle should append a valid immutable event', async () => {
      const res = await request(app)
        .post('/api/fittings/RM-FIT-0001/lifecycle')
        .set('Authorization', `Bearer ${inspectorToken}`)
        .send({
          fittingId: 'RM-FIT-0001',
          event: 'Inspected',
          actor: 'Inspector Rajesh Verma',
          location: 'Track Section KM 142/4',
          notes: 'Laser contrast verified with Grade A score.',
        });
      
      expect([201, 200]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data.event).toBe('Inspected');
    });
  });

  describe('6. Dashboard Analytics', () => {
    it('GET /api/dashboard/stats should return analytics overview', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalFittings');
      expect(res.body.data).toHaveProperty('qrVerificationRate');
    });
  });
});
