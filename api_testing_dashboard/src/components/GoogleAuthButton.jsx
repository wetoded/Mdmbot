import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const GoogleAuthButton = ({ onAuth }) => {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // Simulate OAuth flow - in production this would redirect to Google OAuth
      const mockToken = 'mock_google_token_' + Date.now();
      await onAuth(mockToken);
    } catch (error) {
      console.error('Google auth failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      ) : (
        <>
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect Google APIs
        </>
      )}
    </button>
  );
};

export default GoogleAuthButton;