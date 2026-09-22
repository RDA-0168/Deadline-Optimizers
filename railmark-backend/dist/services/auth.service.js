// =============================================================================
// RailMark AI — Authentication Service (JWT & Role Handling)
// =============================================================================
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { ENV } from '../config/env.js';
import { UserRoles } from '../constants/roles.js';
export class AuthService {
    static async login(usernameOrEmail, plainPassword) {
        const cleanIdentifier = usernameOrEmail.trim();
        // 1. Search in PostgreSQL database
        try {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: { equals: cleanIdentifier, mode: 'insensitive' } },
                        { email: { equals: cleanIdentifier, mode: 'insensitive' } },
                    ],
                },
                include: { zone: true },
            });
            if (user) {
                const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
                if (isMatch) {
                    const token = this.generateToken(user);
                    return {
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            fullName: user.fullName,
                            badgeNumber: user.badgeNumber,
                            zone: user.zoneName || user.zone?.name || 'Central Railway',
                            zoneName: user.zoneName || user.zone?.name || 'Central Railway',
                        },
                    };
                }
            }
        }
        catch {
            // Database not ready, check fallback demo credentials
        }
        // 2. Demo fallback accounts
        const isDemoAdmin = (cleanIdentifier === 'admin' || cleanIdentifier === 'admin@railmark.ai' || cleanIdentifier === 'admin@railmark.demo') &&
            (plainPassword === 'Admin@123' || plainPassword === 'admin123');
        if (isDemoAdmin) {
            const demoAdmin = {
                id: 'USR-ADM-001',
                username: 'admin',
                email: 'admin@railmark.ai',
                role: UserRoles.ADMIN,
                fullName: 'Vikramaditya Sharma (Admin)',
                badgeNumber: 'RM-HQ-ADM-01',
                zone: 'Northern Railway',
                zoneName: 'Northern Railway',
            };
            const token = this.generateToken(demoAdmin);
            return { token, user: demoAdmin };
        }
        const isDemoInspector = (cleanIdentifier === 'inspector' || cleanIdentifier === 'inspector@railmark.ai' || cleanIdentifier === 'inspector@railmark.demo') &&
            (plainPassword === 'Inspector@123' || plainPassword === 'demo123');
        if (isDemoInspector) {
            const demoInspector = {
                id: 'USR-INS-002',
                username: 'inspector',
                email: 'inspector@railmark.ai',
                role: UserRoles.INSPECTOR,
                fullName: 'Rajesh Kumar Verma (Inspector)',
                badgeNumber: 'RM-DEL-INS-4421',
                zone: 'Northern Railway',
                zoneName: 'Northern Railway',
            };
            const token = this.generateToken(demoInspector);
            return { token, user: demoInspector };
        }
        const err = new Error('Invalid credentials. Please check your username/email and password.');
        err.statusCode = 401;
        throw err;
    }
    static async register(data) {
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ username: data.username }, { email: data.email }],
            },
        });
        if (existing) {
            const err = new Error('User with this username or email already exists.');
            err.statusCode = 409;
            throw err;
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                fullName: data.fullName,
                role: data.role || 'INSPECTOR',
                badgeNumber: data.badgeNumber,
                zoneId: data.zoneId,
                zoneName: data.zoneName || 'Central Railway',
            },
        });
        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                badgeNumber: user.badgeNumber,
                zone: user.zoneName || 'Central Railway',
            },
        };
    }
    static generateToken(user) {
        return jwt.sign({
            id: user.id,
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName || user.name,
            badgeNumber: user.badgeNumber,
            zone: user.zone || user.zoneName || 'Central Railway',
        }, ENV.JWT_SECRET, { expiresIn: '7d' });
    }
}
//# sourceMappingURL=auth.service.js.map