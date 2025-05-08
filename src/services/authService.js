import { GoogleGenerativeAI } from '@google/generative-ai';

// In a real application, you would use a proper backend service
// This is a simplified version for demonstration
const MOCK_USERS = new Map();

const STORAGE_KEY = 'legalDoc_users';
const SESSION_KEY = 'legalDoc_session';

// Password requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
};

export const authService = {
  // Initialize with some sample users if none exist
  initialize() {
    const users = this.getUsers();
    if (users.length === 0) {
      const sampleUsers = [
        {
          email: 'demo@example.com',
          password: 'Demo@123', // In a real app, this would be hashed
          name: 'Demo User',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleUsers));
    }
  },

  getUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  },

  validatePassword(password) {
    const errors = [];
    
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
    }
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  async signup(email, password, name) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('\n'));
    }

    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      throw new Error('User already exists');
    }

    // Add new user
    const newUser = {
      email,
      password, // In a real app, this would be hashed
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    // Automatically log in the user
    return this.login(email, password);
  },

  async login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const session = {
      user: { email: user.email, name: user.name },
      token: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  isAuthenticated() {
    return !!this.getCurrentSession();
  }
};

export default authService; 