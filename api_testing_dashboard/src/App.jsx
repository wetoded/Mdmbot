import React, { useState, useEffect } from 'react';
import { Settings, BarChart3, Globe, Search, Plug, RefreshCw, Share2, Brain, User, LogOut } from 'lucide-react';

console.log('App.jsx loaded');

// Import components with debug logging
let AuthProvider, useAuth, LoginForm, UserProfile, AdminSettings;
let GoogleAuthButton, FacebookAuthButton, ApiKeyConfig, MetricCard;
let GoogleAdsData, GoogleAnalyticsData, GoogleSearchConsoleData, FacebookData, WPMUDevData, AIAnalytics;

try {
  console.log('Importing AuthContext...');
  const authModule = await import('./contexts/AuthContext.jsx');
  AuthProvider = authModule.AuthProvider;
  useAuth = authModule.useAuth;
  console.log('AuthContext imported successfully');
} catch (error) {
  console.error('Failed to import AuthContext:', error);
}

try {
  console.log('Importing components...');
  
  const loginModule = await import('./components/LoginForm.jsx');
  LoginForm = loginModule.default;
  console.log('LoginForm imported');

  const profileModule = await import('./components/UserProfile.jsx');
  UserProfile = profileModule.default;
  console.log('UserProfile imported');

  const adminModule = await import('./components/AdminSettings.jsx');
  AdminSettings = adminModule.default;
  console.log('AdminSettings imported');

  const googleAuthModule = await import('./components/GoogleAuthButton.jsx');
  GoogleAuthButton = googleAuthModule.default;
  console.log('GoogleAuthButton imported');

  const facebookAuthModule = await import('./components/FacebookAuthButton.jsx');
  FacebookAuthButton = facebookAuthModule.default;
  console.log('FacebookAuthButton imported');

  const apiKeyModule = await import('./components/ApiKeyConfig.jsx');
  ApiKeyConfig = apiKeyModule.default;
  console.log('ApiKeyConfig imported');

  const metricModule = await import('./components/MetricCard.jsx');
  MetricCard = metricModule.default;
  console.log('MetricCard imported');

  const googleAdsModule = await import('./components/GoogleAdsData.jsx');
  GoogleAdsData = googleAdsModule.default;
  console.log('GoogleAdsData imported');

  const analyticsModule = await import('./components/GoogleAnalyticsData.jsx');
  GoogleAnalyticsData = analyticsModule.default;
  console.log('GoogleAnalyticsData imported');

  const searchModule = await import('./components/GoogleSearchConsoleData.jsx');
  GoogleSearchConsoleData = searchModule.default;
  console.log('GoogleSearchConsoleData imported');

  const facebookModule = await import('./components/FacebookData.jsx');
  FacebookData = facebookModule.default;
  console.log('FacebookData imported');

  const wpmuModule = await import('./components/WPMUDevData.jsx');
  WPMUDevData = wpmuModule.default;
  console.log('WPMUDevData imported');

  const aiModule = await import('./components/AIAnalytics.jsx');
  AIAnalytics = aiModule.default;
  console.log('AIAnalytics imported');

  console.log('All components imported successfully');
} catch (error) {
  console.error('Failed to import components:', error);
}

/**
 * Main Dashboard Component (Protected)
 */
function Dashboard() {
  console.log('Dashboard component rendering...');
  
  const authHook = useAuth();
  console.log('Auth hook result:', { 
    hasUser: !!authHook?.user, 
    userEmail: authHook?.user?.email,
    isAdmin: authHook?.isAdmin?.()
  });
  
  const { user, logout, storeOAuthToken, storeApiKey, getOAuthToken, getApiKey, isAdmin } = authHook;
  
  // State management for UI
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserProfile, setShowUserProfile] = useState(false);

  console.log('Dashboard state:', { activeTab, showUserProfile });

  // Get stored tokens from auth context
  const googleToken = getOAuthToken('google');
  const facebookToken = getOAuthToken('facebook');
  const wpmuApiKey = getApiKey('wpmu');

  console.log('Token status:', {
    hasGoogleToken: !!googleToken,
    hasFacebookToken: !!facebookToken,
    hasWpmuApiKey: !!wpmuApiKey
  });

  // Check if user has test data enabled
  const useTestData = user?.preferences?.useTestData || false;
  console.log('Test data enabled:', useTestData);

  /**
   * Handle Google authentication success
   */
  const handleGoogleAuth = async (token) => {
    console.log('Handling Google auth with token:', token?.substring(0, 10) + '...');
    await storeOAuthToken('google', token);
  };

  /**
   * Handle Facebook authentication success
   */
  const handleFacebookAuth = async (token) => {
    console.log('Handling Facebook auth with token:', token?.substring(0, 10) + '...');
    await storeOAuthToken('facebook', token);
  };

  /**
   * Handle WPMU DEV API key configuration
   */
  const handleWpmuApiKey = async (apiKey) => {
    console.log('Handling WPMU API key:', apiKey?.substring(0, 5) + '...');
    await storeApiKey('wpmu', apiKey);
  };

  /**
   * Handle disconnecting all services
   */
  const handleDisconnect = () => {
    console.log('Disconnecting all services...');
    if (confirm('Are you sure you want to disconnect all services?')) {
      localStorage.removeItem('google_token');
      localStorage.removeItem('facebook_token');
      localStorage.removeItem('wpmu_api_key');
      window.location.reload(); // Refresh to update state
    }
  };

  /**
   * Navigation tab configuration
   */
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ads', label: 'Google Ads', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'search', label: 'Search Console', icon: Search },
    { id: 'facebook', label: 'Facebook', icon: Share2 },
    { id: 'wpmu', label: 'WPMU DEV', icon: Plug },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain },
    ...(isAdmin() ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  console.log('Available tabs:', tabs.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">API Testing Dashboard</h1>
            </div>
            
            {/* User Info and Connection Status */}
            <div className="flex items-center space-x-6">
              {/* Test Data Indicator */}
              {useTestData && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-purple-700 font-medium">Test Data Mode</span>
                </div>
              )}

              {/* Connection Status Indicators */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${googleToken || useTestData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Google</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${facebookToken || useTestData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Facebook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${wpmuApiKey || useTestData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">WPMU DEV</span>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 text-gray-600" />
                </button>
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log('Switching to tab:', tab.id);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {console.log('Rendering tab content for:', activeTab)}
        
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h2>
                <p className="text-gray-600 mt-1">
                  {useTestData ? 'Viewing test data for demonstration purposes' : 'Here\'s your dashboard overview'}
                </p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh All</span>
              </button>
            </div>

            {/* Test Data Notice */}
            {useTestData && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-purple-900">Test Data Mode Active</h4>
                    <p className="text-purple-700 text-sm">
                      You're viewing realistic demo data. All connections and analytics are simulated for testing purposes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning message when no services are connected and test data is off */}
            {(!googleToken && !facebookToken && !wpmuApiKey && !useTestData) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Please configure your API credentials in the Settings tab to view data.
                </p>
              </div>
            )}

            {/* Service Connection Status Cards */}
            {MetricCard && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MetricCard
                  title="Google Ads"
                  value={googleToken || useTestData ? "Connected" : "Disconnected"}
                  change={googleToken || useTestData ? "Active" : "Inactive"}
                  icon={Globe}
                  color={googleToken || useTestData ? "green" : "red"}
                />
                <MetricCard
                  title="Google Analytics"
                  value={googleToken || useTestData ? "Connected" : "Disconnected"}
                  change={googleToken || useTestData ? "Active" : "Inactive"}
                  icon={BarChart3}
                  color={googleToken || useTestData ? "green" : "red"}
                />
                <MetricCard
                  title="Search Console"
                  value={googleToken || useTestData ? "Connected" : "Disconnected"}
                  change={googleToken || useTestData ? "Active" : "Inactive"}
                  icon={Search}
                  color={googleToken || useTestData ? "green" : "red"}
                />
                <MetricCard
                  title="Facebook"
                  value={facebookToken || useTestData ? "Connected" : "Disconnected"}
                  change={facebookToken || useTestData ? "Active" : "Inactive"}
                  icon={Share2}
                  color={facebookToken || useTestData ? "green" : "red"}
                />
                <MetricCard
                  title="WPMU DEV"
                  value={wpmuApiKey || useTestData ? "Connected" : "Disconnected"}
                  change={wpmuApiKey || useTestData ? "Active" : "Inactive"}
                  icon={Plug}
                  color={wpmuApiKey || useTestData ? "green" : "red"}
                />
              </div>
            )}

            {/* Getting Started Guide for Disconnected Services */}
            {(!useTestData && (!googleToken || !facebookToken || !wpmuApiKey)) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {!googleToken && (
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-md font-medium text-gray-900 mb-2">Connect Google APIs</h4>
                      <p className="text-sm text-gray-500 mb-4">Access Google Ads, Analytics, and Search Console data</p>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Configure Now →
                      </button>
                    </div>
                  )}
                  
                  {!facebookToken && (
                    <div className="text-center">
                      <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-md font-medium text-gray-900 mb-2">Connect Facebook</h4>
                      <p className="text-sm text-gray-500 mb-4">Access Facebook Ads and Instagram data</p>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Configure Now →
                      </button>
                    </div>
                  )}
                  
                  {!wpmuApiKey && (
                    <div className="text-center">
                      <Plug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-md font-medium text-gray-900 mb-2">Connect WPMU DEV</h4>
                      <p className="text-sm text-gray-500 mb-4">Monitor WordPress sites and plugins</p>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Configure Now →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Google APIs</h3>
                <div className="space-y-4">
                  {GoogleAuthButton && <GoogleAuthButton onAuth={handleGoogleAuth} />}
                  {googleToken && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">Google APIs Connected</span>
                      <button
                        onClick={() => {
                          localStorage.removeItem('google_token');
                          window.location.reload();
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Facebook APIs</h3>
                <div className="space-y-4">
                  {FacebookAuthButton && <FacebookAuthButton onAuth={handleFacebookAuth} />}
                  {facebookToken && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">Facebook APIs Connected</span>
                      <button
                        onClick={() => {
                          localStorage.removeItem('facebook_token');
                          window.location.reload();
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">WPMU DEV API</h3>
                {ApiKeyConfig && <ApiKeyConfig onSave={handleWpmuApiKey} currentKey={wpmuApiKey} />}
              </div>
            </div>
          </div>
        )}

        {/* Debug Tab Content for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'settings' && (
          <div className="text-center py-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Debug Mode: {activeTab}</h3>
              <p className="text-blue-700">This tab is under development. Component loading status:</p>
              <div className="mt-4 text-sm text-left bg-white p-4 rounded">
                <div>GoogleAdsData: {GoogleAdsData ? 'Loaded' : 'Missing'}</div>
                <div>GoogleAnalyticsData: {GoogleAnalyticsData ? 'Loaded' : 'Missing'}</div>
                <div>GoogleSearchConsoleData: {GoogleSearchConsoleData ? 'Loaded' : 'Missing'}</div>
                <div>FacebookData: {FacebookData ? 'Loaded' : 'Missing'}</div>
                <div>WPMUDevData: {WPMUDevData ? 'Loaded' : 'Missing'}</div>
                <div>AIAnalytics: {AIAnalytics ? 'Loaded' : 'Missing'}</div>
                <div>AdminSettings: {AdminSettings ? 'Loaded' : 'Missing'}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      {UserProfile && (
        <UserProfile 
          isOpen={showUserProfile} 
          onClose={() => setShowUserProfile(false)} 
        />
      )}
    </div>
  );
}

/**
 * Main App Component with Authentication Wrapper
 */
function App() {
  console.log('App component rendering...');
  
  if (!AuthProvider) {
    console.error('AuthProvider not available');
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Component Loading Error</h1>
          <p className="text-red-700">AuthProvider failed to load. Check console for details.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}

/**
 * App Component with Authentication Logic
 */
function AppWithAuth() {
  console.log('AppWithAuth component rendering...');
  
  const { user, loading, login, register, initialized } = useAuth();

  console.log('Auth state:', { 
    hasUser: !!user, 
    loading, 
    initialized,
    userEmail: user?.email 
  });

  /**
   * Handle user login
   */
  const handleLogin = async (email, password) => {
    console.log('Attempting login for:', email);
    try {
      await login(email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Handle user registration
   */
  const handleRegister = async (userData) => {
    console.log('Attempting registration for:', userData.email);
    try {
      await register(userData);
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Show loading screen while initializing
  if (!initialized || loading) {
    console.log('Showing loading screen...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">
            Initialized: {initialized ? 'Yes' : 'No'} | Loading: {loading ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    console.log('Showing login form...');
    
    if (!LoginForm) {
      console.error('LoginForm component not available');
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Component Missing</h1>
            <p className="text-red-700">LoginForm component failed to load.</p>
          </div>
        </div>
      );
    }

    return (
      <LoginForm 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // Show main dashboard if authenticated
  console.log('Showing dashboard for user:', user.email);
  return <Dashboard />;
}

console.log('App.jsx file processed successfully');

export default App;