import { UserRole } from '../constants/roles.js';
export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    fullName: string;
    badgeNumber: string;
    createdAt: string;
}
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    fullName: string;
    badgeNumber: string;
    createdAt: string;
}
export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
    role: UserRole;
    fullName: string;
    badgeNumber: string;
    iat?: number;
    exp?: number;
}
export interface AuthResponseData {
    token: string;
    expiresIn: string;
    user: UserProfile;
}
