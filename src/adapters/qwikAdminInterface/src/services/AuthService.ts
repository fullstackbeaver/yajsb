import { $ } from '@builder.io/qwik';
// No Qwik signals directly in this service anymore to avoid hook rule violations.
// State will be managed by components that use this service.

const DUMMY_PASSWORD = "password123";
const AUTH_KEY = 'isAdminAuthenticated';

class AuthService {
  private _isAuthenticated: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this._isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
    }
  }

  // Synchronous getter for initial state checking by components
  getIsAuthenticatedSync(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        this._isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
    }
    return this._isAuthenticated;
  }
  
  login = $((password: string): boolean => {
    if (password === DUMMY_PASSWORD) {
      this._isAuthenticated = true;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(AUTH_KEY, 'true');
      }
      console.log("AuthService: Login successful");
      return true;
    }
    console.log("AuthService: Login failed - incorrect password");
    this._isAuthenticated = false; // Ensure state is false on failed attempt
     if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_KEY); // Clear any previous auth state
      }
    return false;
  });

  logout = $(() => {
    this._isAuthenticated = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
    console.log("AuthService: Logout successful");
  });
}

export const authService = new AuthService();
