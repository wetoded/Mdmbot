import React, { createContext, useContext, useState, useEffect } from 'react';

console.log('AuthContext.jsx loaded');

// Import AuthService with error handling
let AuthService;
try {
  console.log('Importing AuthService...');
  const authServiceModule = await import('../services/AuthService.js');
  AuthService = authServiceModule.default;
  console.log('AuthService imported successfully');
} catch (error) {
  console.error('Failed to import AuthService:', error);
}

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log('AuthProvider initializing...');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('AuthProvider useEffect triggered');
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('Initializing authentication...');
    
    if (!AuthService) {
      console.error('AuthService not available during initialization');
      setInitialized(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Calling AuthService.initialize()...');
      await AuthService.initialize();
      
      console.log('Getting current user...');
      const currentUser = AuthService.getCurrentUser();
      
      console.log('Current user result:', currentUser ? `${currentUser.email} (${currentUser.role})` : 'None');
      setUser(currentUser);
      setInitialized(true);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setInitialized(true);
    } finally {
      console.log('Auth initialization complete');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('Login attempt for:', email);
    
    if (!AuthService) {
      throw new Error('AuthService not available');
    }

    try {
      const user = await AuthService.login(email, password);
      console.log('Login successful for:', user.email);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('Registration attempt for:', userData.email);
    
    if (!AuthService) {
      throw new Error('AuthService not available');
    }

    try {
      const user = await AuthService.register(userData);
      console.log('Registration successful, auto-logging in...');
      
      // Auto-login after registration
      const loginUser = await AuthService.login(userData.email, userData.password);
      setUser(loginUser);
      return loginUser;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logout attempt...');
    
    if (!AuthService) {
      console.warn('AuthService not available during logout');
      setUser(null);
      return;
    }

    try {
      await AuthService.logout();
      console.log('Logout successful');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    console.log('Profile update attempt...');
    
    if (!AuthService) {
      throw new Error('AuthService not available');
    }

    try {
      const updatedUser = await AuthService.updateProfile(updates);
      console.log('Profile updated successfully');
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const storeOAuthToken = async (provider, token) => {
    console.log('Storing OAuth token for:', provider);
    
    if (!AuthService) {
      throw new Error('AuthService not available');
    }

    try {
      await AuthService.storeOAuthToken(provider, token);
      console.log('OAuth token stored successfully');
      
      // Refresh user data to include new token
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('OAuth token storage error:', error);
      throw error;
    }
  };

  const storeApiKey = async (service, apiKey) => {
    console.log('Storing API key for:', service);
    
    if (!AuthService) {
      throw new Error('AuthService not available');
    }

    try {
      await AuthService.storeApiKey(service, apiKey);
      console.log('API key stored successfully');
      
      // Refresh user data to include new API key
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('API key storage error:', error);
      throw error;
    }
  };

  const getOAuthToken = (provider) => {
    if (!AuthService) {
      console.warn('AuthService not available for getting OAuth token');
      return null;
    }
    
    const token = AuthService.getOAuthToken(provider);
    console.log('OAuth token for', provider + ':', token ? 'Found' : 'Not found');
    return token;
  };

  const getApiKey = (service) => {
    if (!AuthService) {
      console.warn('AuthService not available for getting API key');
      return null;
    }
    
    const key = AuthService.getApiKey(service);
    console.log('API key for', service + ':', key ? 'Found' : 'Not found');
    return key;
  };

  const isAdmin = () => {
    if (!AuthService) {
      console.warn('AuthService not available for checking admin status');
      return false;
    }
    
    const admin = AuthService.isAdmin();
    console.log('Admin status:', admin);
    return admin;
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    storeOAuthToken,
    storeApiKey,
    getOAuthToken,
    getApiKey,
    isAdmin
  };

  console.log('AuthProvider state:', {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
    initialized,
    hasAuthService: !!AuthService
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};