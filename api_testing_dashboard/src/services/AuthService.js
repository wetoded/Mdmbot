console.log('AuthService.js loaded');

/**
 * AuthService Class
 * 
 * Handles user authentication, registration, and session management.
 * Uses localStorage for persistence in browser environment.
 */
class AuthService {
  constructor() {
    console.log('AuthService constructor called');
    this.currentUser = null;
    this.users = this.loadUsers();
    this.sessions = this.loadSessions();
    this.isInitialized = false;
    console.log('Initial state:', {
      usersCount: Object.keys(this.users).length,
      sessionsCount: Object.keys(this.sessions).length
    });
  }

  /**
   * Initialize authentication service
   */
  async initialize() {
    console.log('AuthService.initialize() called');
    
    if (this.isInitialized) {
      console.log('AuthService already initialized');
      return;
    }

    try {
      // Check for existing session
      const sessionToken = localStorage.getItem('session_token');
      console.log('Session token found:', sessionToken ? 'Yes' : 'No');
      
      if (sessionToken) {
        const session = this.sessions[sessionToken];
        console.log('Session data:', session ? 'Found' : 'Not found');
        
        if (session && session.expiresAt > Date.now()) {
          console.log('Valid session found for user ID:', session.userId);
          this.currentUser = this.users[session.userId];
          console.log('Restored user:', this.currentUser?.email);
        } else {
          console.log('Session expired, cleaning up...');
          this.logout();
        }
      }

      this.isInitialized = true;
      console.log('Auth Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Auth Service:', error);
      this.isInitialized = true; // Still mark as initialized to prevent loops
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  async register(userData) {
    console.log('AuthService.register() called for:', userData.email);
    
    const { email, password, firstName, lastName, role = 'user' } = userData;
    
    // Check if user already exists
    if (this.findUserByEmail(email)) {
      console.log('User already exists:', email);
      throw new Error('User with this email already exists');
    }

    // Generate user ID
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    console.log('Generated user ID:', userId);
    
    // Create user object
    const user = {
      id: userId,
      email: email.toLowerCase(),
      password: this.hashPassword(password), // In production, use proper hashing
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true,
      preferences: {
        theme: 'light',
        notifications: true,
        defaultDashboard: 'overview',
        useTestData: false,
        aiMode: 'local' // 'local' or 'api'
      },
      connectedAccounts: {
        google: null,
        facebook: null,
        wpmu: null
      },
      apiKeys: {}
    };

    // Store user
    this.users[userId] = user;
    this.saveUsers();
    console.log('User registered successfully:', user.email);

    return { ...user, password: undefined }; // Don't return password
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    console.log('AuthService.login() called for:', email);
    
    const user = this.findUserByEmail(email);
    
    if (!user) {
      console.log('User not found:', email);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      console.log('User account deactivated:', email);
      throw new Error('Account is deactivated');
    }

    if (!this.verifyPassword(password, user.password)) {
      console.log('Invalid password for:', email);
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers();

    // Create session
    const sessionToken = this.generateSessionToken();
    const session = {
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      userAgent: navigator.userAgent,
      ipAddress: 'browser' // In production, get real IP
    };

    this.sessions[sessionToken] = session;
    this.saveSessions();
    
    // Store session token
    localStorage.setItem('session_token', sessionToken);
    
    this.currentUser = { ...user, password: undefined };
    console.log('Login successful for:', user.email);
    return this.currentUser;
  }

  /**
   * Logout current user
   */
  async logout() {
    console.log('AuthService.logout() called');
    
    const sessionToken = localStorage.getItem('session_token');
    
    if (sessionToken) {
      delete this.sessions[sessionToken];
      this.saveSessions();
      localStorage.removeItem('session_token');
      console.log('Session cleaned up');
    }

    // Clear user-specific data
    localStorage.removeItem('google_token');
    localStorage.removeItem('facebook_token');
    localStorage.removeItem('wpmu_api_key');
    
    this.currentUser = null;
    console.log('Logout completed');
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    console.log('AuthService.getCurrentUser() called, result:', this.currentUser?.email || 'None');
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const authenticated = this.currentUser !== null;
    console.log('AuthService.isAuthenticated():', authenticated);
    return authenticated;
  }

  /**
   * Check if user has admin role
   */
  isAdmin() {
    const admin = this.currentUser && this.currentUser.role === 'admin';
    console.log('AuthService.isAdmin():', admin);
    return admin;
  }

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   */
  async updateProfile(updates) {
    console.log('AuthService.updateProfile() called');
    
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const allowedFields = ['firstName', 'lastName', 'preferences'];
    const filteredUpdates = {};
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    // Update user data
    Object.assign(this.users[this.currentUser.id], filteredUpdates);
    Object.assign(this.currentUser, filteredUpdates);
    
    this.saveUsers();
    console.log('Profile updated successfully');
    return this.currentUser;
  }

  /**
   * Store OAuth token for current user
   * @param {string} provider - OAuth provider (google, facebook)
   * @param {string} token - OAuth token
   */
  async storeOAuthToken(provider, token) {
    console.log('AuthService.storeOAuthToken() called for:', provider);
    
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    this.users[this.currentUser.id].connectedAccounts[provider] = {
      token,
      connectedAt: new Date().toISOString()
    };

    this.currentUser.connectedAccounts[provider] = this.users[this.currentUser.id].connectedAccounts[provider];
    this.saveUsers();

    // Store in localStorage for current session
    localStorage.setItem(`${provider}_token`, token);
    console.log('OAuth token stored for:', provider);
  }

  /**
   * Store API key for current user
   * @param {string} service - Service name
   * @param {string} apiKey - API key
   */
  async storeApiKey(service, apiKey) {
    console.log('AuthService.storeApiKey() called for:', service);
    
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    this.users[this.currentUser.id].apiKeys[service] = {
      key: apiKey,
      addedAt: new Date().toISOString()
    };

    this.currentUser.apiKeys[service] = this.users[this.currentUser.id].apiKeys[service];
    this.saveUsers();

    // Store in localStorage for current session
    localStorage.setItem(`${service}_api_key`, apiKey);
    console.log('API key stored for:', service);
  }

  /**
   * Get OAuth token for current user
   * @param {string} provider - OAuth provider
   */
  getOAuthToken(provider) {
    if (!this.currentUser) return null;
    const token = this.currentUser.connectedAccounts[provider]?.token || null;
    console.log('AuthService.getOAuthToken() for', provider + ':', token ? 'Found' : 'Not found');
    return token;
  }

  /**
   * Get API key for current user
   * @param {string} service - Service name
   */
  getApiKey(service) {
    if (!this.currentUser) return null;
    const key = this.currentUser.apiKeys[service]?.key || null;
    console.log('AuthService.getApiKey() for', service + ':', key ? 'Found' : 'Not found');
    return key;
  }

  /**
   * Admin: Get all users
   */
  getAllUsers() {
    console.log('AuthService.getAllUsers() called');
    
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }
    
    return Object.values(this.users).map(user => ({
      ...user,
      password: undefined
    }));
  }

  /**
   * Admin: Update user
   * @param {string} userId - User ID
   * @param {Object} updates - User updates
   */
  async updateUser(userId, updates) {
    console.log('AuthService.updateUser() called for:', userId);
    
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    if (!this.users[userId]) {
      throw new Error('User not found');
    }

    Object.assign(this.users[userId], updates);
    this.saveUsers();
    
    return { ...this.users[userId], password: undefined };
  }

  /**
   * Admin: Delete user
   * @param {string} userId - User ID
   */
  async deleteUser(userId) {
    console.log('AuthService.deleteUser() called for:', userId);
    
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    if (!this.users[userId]) {
      throw new Error('User not found');
    }

    delete this.users[userId];
    this.saveUsers();
  }

  /**
   * Admin: Get system stats
   */
  getSystemStats() {
    console.log('AuthService.getSystemStats() called');
    
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    const users = Object.values(this.users);
    const activeSessions = Object.values(this.sessions).filter(
      session => session.expiresAt > Date.now()
    );

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      activeSessions: activeSessions.length,
      connectedGoogleAccounts: users.filter(u => u.connectedAccounts.google).length,
      connectedFacebookAccounts: users.filter(u => u.connectedAccounts.facebook).length,
      connectedWPMUAccounts: users.filter(u => u.apiKeys.wpmu).length,
      testDataUsers: users.filter(u => u.preferences?.useTestData).length
    };
  }

  /**
   * Admin: Get/Set system AI configuration
   */
  getSystemAIConfig() {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }
    
    const config = localStorage.getItem('system_ai_config');
    return config ? JSON.parse(config) : {
      mode: 'local', // 'local' or 'api'
      apiKeys: {
        openai: '',
        anthropic: '',
        google: ''
      },
      localConfig: {
        ollamaUrl: 'http://localhost:11434',
        defaultModel: 'llama2'
      }
    };
  }

  /**
   * Admin: Update system AI configuration
   */
  async updateSystemAIConfig(config) {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }
    
    localStorage.setItem('system_ai_config', JSON.stringify(config));
  }

  // Private helper methods

  /**
   * Find user by email
   * @param {string} email - User email
   */
  findUserByEmail(email) {
    const user = Object.values(this.users).find(user => user.email === email.toLowerCase());
    console.log('AuthService.findUserByEmail() for', email + ':', user ? 'Found' : 'Not found');
    return user;
  }

  /**
   * Hash password (simple implementation for demo)
   * @param {string} password - Plain password
   */
  hashPassword(password) {
    // In production, use bcrypt or similar
    return btoa(password + 'salt123');
  }

  /**
   * Verify password
   * @param {string} password - Plain password
   * @param {string} hash - Hashed password
   */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  /**
   * Generate session token
   */
  generateSessionToken() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
  }

  /**
   * Load users from localStorage
   */
  loadUsers() {
    console.log('AuthService.loadUsers() called');
    
    try {
      const stored = localStorage.getItem('dashboard_users');
      const users = stored ? JSON.parse(stored) : {};
      
      console.log('Loaded users count:', Object.keys(users).length);
      
      // Create default admin user if no users exist
      if (Object.keys(users).length === 0) {
        console.log('Creating default admin user...');
        const adminId = 'admin_' + Date.now();
        users[adminId] = {
          id: adminId,
          email: 'admin@dashboard.com',
          password: this.hashPassword('admin123'),
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: null,
          isActive: true,
          preferences: {
            theme: 'light',
            notifications: true,
            defaultDashboard: 'overview',
            useTestData: true,
            aiMode: 'local'
          },
          connectedAccounts: {
            google: null,
            facebook: null,
            wpmu: null
          },
          apiKeys: {}
        };
        console.log('Default admin user created');
      }
      
      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  /**
   * Save users to localStorage
   */
  saveUsers() {
    try {
      localStorage.setItem('dashboard_users', JSON.stringify(this.users));
      console.log('Users saved to localStorage');
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  /**
   * Load sessions from localStorage
   */
  loadSessions() {
    console.log('AuthService.loadSessions() called');
    
    try {
      const stored = localStorage.getItem('dashboard_sessions');
      const sessions = stored ? JSON.parse(stored) : {};
      console.log('Loaded sessions count:', Object.keys(sessions).length);
      return sessions;
    } catch (error) {
      console.error('Error loading sessions:', error);
      return {};
    }
  }

  /**
   * Save sessions to localStorage
   */
  saveSessions() {
    try {
      localStorage.setItem('dashboard_sessions', JSON.stringify(this.sessions));
      console.log('Sessions saved to localStorage');
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }
}

console.log('Creating AuthService instance...');
const authServiceInstance = new AuthService();
console.log('AuthService instance created successfully');

// Export singleton instance
export default authServiceInstance;