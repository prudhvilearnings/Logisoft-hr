import type { User, UserRole } from '../types/auth';

// Simulated database of mock users for the HRMS environment
export const MOCK_USERS: Record<UserRole, { user: User; token: string }> = {
  employee: {
    user: {
      id: 'emp_01',
      email: 'employee@logisoft.com',
      name: 'Alice Cooper',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      department: 'Software Engineering',
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_employee_jwt_payload_data',
  },
  lead: {
    user: {
      id: 'lead_01',
      email: 'lead@logisoft.com',
      name: 'John Smith',
      role: 'lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      department: 'Software Engineering',
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_lead_jwt_payload_data',
  },
  manager: {
    user: {
      id: 'mng_01',
      email: 'manager@logisoft.com',
      name: 'Jane Doe',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      department: 'Human Resources',
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_manager_jwt_payload_data',
  },
};

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Simulates network login request with delay
   */
  async login(email: string, password: string, role: UserRole): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchingMock = MOCK_USERS[role];
        
        // Validation: Verify if email matches our role expectations
        if (matchingMock && matchingMock.user.email === email.trim().toLowerCase() && password === 'password') {
          resolve({
            user: matchingMock.user,
            token: matchingMock.token,
            refreshToken: `mock_refresh_token_for_${role}_session`,
          });
        } else {
          reject(new Error('Invalid email or password. Please use password: "password"'));
        }
      }, 1000);
    });
  },

  /**
   * Simulates token refresh request
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (refreshToken.startsWith('mock_refresh_token_for_')) {
          // Extract role from mock token structure
          const role = refreshToken.split('_')[4] as UserRole;
          const matchingMock = MOCK_USERS[role];
          if (matchingMock) {
            resolve({
              token: matchingMock.token + '_refreshed',
              refreshToken: `mock_refresh_token_for_${role}_session_new`,
            });
            return;
          }
        }
        reject(new Error('Invalid or expired session token'));
      }, 500);
    });
  },
};

export default authService;
