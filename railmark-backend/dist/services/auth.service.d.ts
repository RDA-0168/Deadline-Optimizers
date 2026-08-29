import { UserProfile, AuthResponseData } from '../types/auth.types.js';
import { UserRole } from '../constants/roles.js';
export declare class AuthService {
    static login(identifier: string, passwordPlain: string, ipAddress?: string): Promise<AuthResponseData>;
    static register(data: {
        username: string;
        email: string;
        passwordPlain: string;
        role: UserRole;
        fullName: string;
        badgeNumber: string;
    }, creatorName?: string): Promise<UserProfile>;
    static getProfile(userId: string): Promise<UserProfile>;
}
