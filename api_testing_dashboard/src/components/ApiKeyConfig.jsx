import React, { useState } from 'react';
import { Key, Save } from 'lucide-react';

const ApiKeyConfig = ({ onSave, currentKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key');
      return;
    }

    setLoading(true);
    try {
      await onSave(apiKey);
      setMessage('API key saved successfully!');
      setApiKey('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this API key?')) {
      localStorage.removeItem('wpmu_api_key');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      {currentKey ? (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-green-600" />
            <span className="text-green-800">API Key Configured</span>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WPMU DEV API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your WPMU DEV API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading || !apiKey.trim()}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save API Key
              </>
            )}
          </button>
        </>
      )}
      
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('success') 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ApiKeyConfig;