import React, { useState } from 'react';
import { User, Settings, Key, Link, Save, X, TestTube, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * UserProfile Component
 * 
 * Displays and manages user profile information and connected accounts
 */
const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    preferences: {
      theme: user?.preferences?.theme || 'light',
      notifications: user?.preferences?.notifications || true,
      defaultDashboard: user?.preferences?.defaultDashboard || 'overview'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !user) return null;

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  /**
   * Handle profile update
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences
    });
    setIsEditing(false);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg ${
            message.startsWith('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-3 w-3 inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                {isEditing ? (
                  <select
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{user.preferences.theme}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Dashboard
                </label>
                {isEditing ? (
                  <select
                    name="preferences.defaultDashboard"
                    value={formData.preferences.defaultDashboard}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="overview">Overview</option>
                    <option value="ads">Google Ads</option>
                    <option value="analytics">Analytics</option>
                    <option value="ai-analytics">AI Analytics</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{user.preferences.defaultDashboard}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="preferences.notifications"
                      checked={formData.preferences.notifications}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={user.preferences.notifications}
                      disabled
                      className="rounded border-gray-300 text-blue-600"
                    />
                  )}
                  <span className="ml-2 text-sm text-gray-700">
                    Enable notifications
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h3>
            
            <div className="space-y-3">
              {/* Google Account */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Link className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Google Services</p>
                    <p className="text-sm text-gray-500">Ads, Analytics, Search Console</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.connectedAccounts.google 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.connectedAccounts.google ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {/* Facebook Account */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Link className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Facebook</p>
                    <p className="text-sm text-gray-500">Ads and Marketing API</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.connectedAccounts.facebook 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.connectedAccounts.facebook ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {/* WPMU DEV */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">WPMU DEV</p>
                    <p className="text-sm text-gray-500">WordPress management</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.apiKeys.wpmu 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.apiKeys.wpmu ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;