import { UserRole } from '../constants/roles.js';
export declare class AuthService {
    static login(usernameOrEmail: string, plainPassword: string): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: UserRole;
            fullName: string;
            badgeNumber: string;
            zone: string;
            zoneName: string;
        };
    }>;
    static register(data: any): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: UserRole;
            fullName: string;
            badgeNumber: string;
            zone: string;
        };
    }>;
    static generateToken(user: any): string;
}
