import React, { useState, useEffect } from 'react';
import { Shield, Users, Database, Settings, Key, Link, Activity, Trash2, Edit, Bot, TestTube } from 'lucide-react';
import AuthService from '../services/AuthService.js';
import AIService from '../services/AIService.js';

/**
 * AdminSettings Component
 * 
 * Comprehensive admin dashboard for managing users, OAuth configurations,
 * API keys, AI settings, and system configuration
 */
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [aiConfig, setAiConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Admin tabs
  const adminTabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'oauth', label: 'OAuth Config', icon: Link },
    { id: 'ai', label: 'AI Configuration', icon: Bot },
    { id: 'apis', label: 'API Keys', icon: Key },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  /**
   * Load admin data on mount
   */
  useEffect(() => {
    loadAdminData();
  }, []);

  /**
   * Load all admin data
   */
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const usersData = AuthService.getAllUsers();
      const stats = AuthService.getSystemStats();
      const aiConfiguration = AuthService.getSystemAIConfig();
      
      setUsers(usersData);
      setSystemStats(stats);
      setAiConfig(aiConfiguration);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user role update
   */
  const handleUserUpdate = async (userId, updates) => {
    try {
      await AuthService.updateUser(userId, updates);
      await loadAdminData(); // Refresh data
      setEditingUser(null);
    } catch (error) {
      alert(`Error updating user: ${error.message}`);
    }
  };

  /**
   * Handle user deletion
   */
  const handleUserDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await AuthService.deleteUser(userId);
      await loadAdminData(); // Refresh data
    } catch (error) {
      alert(`Error deleting user: ${error.message}`);
    }
  };

  /**
   * Handle test data toggle for user
   */
  const handleTestDataToggle = async (userId, enabled) => {
    try {
      const user = users.find(u => u.id === userId);
      const updates = {
        preferences: {
          ...user.preferences,
          useTestData: enabled
        }
      };
      await AuthService.updateUser(userId, updates);
      await loadAdminData();
    } catch (error) {
      alert(`Error updating test data setting: ${error.message}`);
    }
  };

  /**
   * Handle AI configuration update
   */
  const handleAIConfigUpdate = async (configUpdates) => {
    try {
      await AuthService.updateSystemAIConfig(configUpdates);
      await AIService.updateConfig(configUpdates);
      setAiConfig(configUpdates);
    } catch (error) {
      alert(`Error updating AI configuration: ${error.message}`);
    }
  };

  /**
   * Render users management tab
   */
  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{systemStats.totalUsers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-green-900">{systemStats.activeUsers || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Test Data Users</p>
              <p className="text-2xl font-bold text-purple-900">{systemStats.testDataUsers || 0}</p>
            </div>
            <TestTube className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Active Sessions</p>
              <p className="text-2xl font-bold text-orange-900">{systemStats.activeSessions || 0}</p>
            </div>
            <Database className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connected Accounts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleUserUpdate(user.id, { role: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.preferences?.useTestData || false}
                        onChange={(e) => handleTestDataToggle(user.id, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Enabled</span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {user.connectedAccounts.google && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Google</span>
                      )}
                      {user.connectedAccounts.facebook && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Facebook</span>
                      )}
                      {user.apiKeys.wpmu && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">WPMU</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUserDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /**
   * Render AI configuration tab
   */
  const renderAITab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Configuration</h3>
        
        {/* AI Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">AI Mode</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="aiMode"
                value="local"
                checked={aiConfig.mode === 'local'}
                onChange={(e) => setAiConfig({ ...aiConfig, mode: e.target.value })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="font-medium">Local AI (Ollama)</span>
                <p className="text-sm text-gray-500">Run AI models locally for privacy and control</p>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="aiMode"
                value="api"
                checked={aiConfig.mode === 'api'}
                onChange={(e) => setAiConfig({ ...aiConfig, mode: e.target.value })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="font-medium">Cloud AI APIs</span>
                <p className="text-sm text-gray-500">Use cloud services like OpenAI or Anthropic</p>
              </span>
            </label>
          </div>
        </div>

        {/* Local AI Configuration */}
        {aiConfig.mode === 'local' && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-gray-900 mb-3">Local AI (Ollama) Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ollama URL</label>
                <input
                  type="text"
                  value={aiConfig.localConfig?.ollamaUrl || 'http://localhost:11434'}
                  onChange={(e) => setAiConfig({
                    ...aiConfig,
                    localConfig: { ...aiConfig.localConfig, ollamaUrl: e.target.value }
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Model</label>
                <select
                  value={aiConfig.localConfig?.defaultModel || 'llama2'}
                  onChange={(e) => setAiConfig({
                    ...aiConfig,
                    localConfig: { ...aiConfig.localConfig, defaultModel: e.target.value }
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="llama2">Llama 2</option>
                  <option value="codellama">Code Llama</option>
                  <option value="mistral">Mistral</option>
                  <option value="neural-chat">Neural Chat</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Setup Instructions:</strong><br />
                1. Install Ollama from <a href="https://ollama.ai" className="underline">ollama.ai</a><br />
                2. Run: <code className="bg-yellow-100 px-1 rounded">ollama pull llama2</code><br />
                3. Start Ollama service: <code className="bg-yellow-100 px-1 rounded">ollama serve</code>
              </p>
            </div>
          </div>
        )}

        {/* Cloud AI Configuration */}
        {aiConfig.mode === 'api' && (
          <div className="border rounded-lg p-4 bg-green-50">
            <h4 className="font-medium text-gray-900 mb-3">Cloud AI API Configuration</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={aiConfig.apiKeys?.openai || ''}
                  onChange={(e) => setAiConfig({
                    ...aiConfig,
                    apiKeys: { ...aiConfig.apiKeys, openai: e.target.value }
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Anthropic API Key</label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={aiConfig.apiKeys?.anthropic || ''}
                  onChange={(e) => setAiConfig({
                    ...aiConfig,
                    apiKeys: { ...aiConfig.apiKeys, anthropic: e.target.value }
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Google AI API Key</label>
                <input
                  type="password"
                  placeholder="AI..."
                  value={aiConfig.apiKeys?.google || ''}
                  onChange={(e) => setAiConfig({
                    ...aiConfig,
                    apiKeys: { ...aiConfig.apiKeys, google: e.target.value }
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => handleAIConfigUpdate(aiConfig)}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700"
        >
          Save AI Configuration
        </button>
      </div>

      {/* AI Status */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{aiConfig.mode || 'Not Set'}</div>
            <div className="text-sm text-gray-500">Current Mode</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {aiConfig.mode === 'local' ? 'Local' : 'Cloud'}
            </div>
            <div className="text-sm text-gray-500">Deployment Type</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Ready</div>
            <div className="text-sm text-gray-500">Service Status</div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render OAuth configuration tab
   */
  const renderOAuthTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">OAuth Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google OAuth */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded">
                <Link className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Google OAuth</h4>
                <p className="text-sm text-gray-500">Configure Google API credentials</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client ID</label>
                <input
                  type="text"
                  placeholder="Enter Google Client ID"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                <input
                  type="password"
                  placeholder="Enter Google Client Secret"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                Save Google Config
              </button>
            </div>
          </div>

          {/* Facebook OAuth */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded">
                <Link className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Facebook OAuth</h4>
                <p className="text-sm text-gray-500">Configure Facebook App credentials</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">App ID</label>
                <input
                  type="text"
                  placeholder="Enter Facebook App ID"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">App Secret</label>
                <input
                  type="password"
                  placeholder="Enter Facebook App Secret"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Save Facebook Config
              </button>
            </div>
          </div>
        </div>

        {/* OAuth Status */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">OAuth Integration Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Google Users:</span>
              <span className="font-medium">{systemStats.connectedGoogleAccounts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Facebook Users:</span>
              <span className="font-medium">{systemStats.connectedFacebookAccounts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>WPMU DEV Users:</span>
              <span className="font-medium">{systemStats.connectedWPMUAccounts || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render API Keys tab
   */
  const renderAPIKeysTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys Management</h3>
        
        <div className="space-y-4">
          {/* User API Key Usage */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">User API Key Usage</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Added Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => 
                    Object.entries(user.apiKeys).map(([service, keyData]) => (
                      <tr key={`${user.id}-${service}`}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 uppercase">{service}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(keyData.addedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render system settings tab
   */
  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Security Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Require email verification</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Enable two-factor authentication</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Auto-logout after inactivity</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Data & Testing</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Session timeout (hours)</label>
                <input
                  type="number"
                  defaultValue="24"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data retention (days)</label>
                <input
                  type="number"
                  defaultValue="90"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-700">Enable test data mode for new users</span>
              </label>
            </div>
          </div>
        </div>

        <button className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Save System Settings
        </button>
      </div>

      {/* Deployment Configuration */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-gray-900 mb-2">Local Deployment</h4>
            <p className="text-sm text-gray-600 mb-3">Run MDM Bot on your local machine or server</p>
            <div className="text-xs bg-gray-100 p-2 rounded font-mono">
              npm install<br />
              npm run build<br />
              npm run start
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-green-50">
            <h4 className="font-medium text-gray-900 mb-2">Web App Deployment</h4>
            <p className="text-sm text-gray-600 mb-3">Deploy to cloud platforms like Vercel or Netlify</p>
            <div className="text-xs bg-gray-100 p-2 rounded font-mono">
              npm run build<br />
              Deploy dist/ folder<br />
              Configure environment variables
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render analytics tab
   */
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{systemStats.totalUsers || 0}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{systemStats.activeSessions || 0}</div>
            <div className="text-sm text-gray-500">Active Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {(systemStats.connectedGoogleAccounts || 0) + (systemStats.connectedFacebookAccounts || 0)}
            </div>
            <div className="text-sm text-gray-500">Connected Accounts</div>
          </div>
        </div>

        {/* Test Data Usage */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">Test Data Usage</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{systemStats.testDataUsers || 0}</div>
              <div className="text-purple-700">Users with Test Data</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {Math.round(((systemStats.testDataUsers || 0) / (systemStats.totalUsers || 1)) * 100)}%
              </div>
              <div className="text-purple-700">Test Data Adoption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users, AI configuration, OAuth settings, and system configuration</p>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'oauth' && renderOAuthTab()}
          {activeTab === 'ai' && renderAITab()}
          {activeTab === 'apis' && renderAPIKeysTab()}
          {activeTab === 'system' && renderSystemTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;