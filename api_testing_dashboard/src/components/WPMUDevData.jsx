import React, { useState, useEffect } from 'react';
import { Server, Plug, CheckCircle, AlertCircle, Globe, AlertTriangle, Lightbulb } from 'lucide-react';
import MetricCard from './MetricCard';

const WPMUDevData = ({ apiKey }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const subTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'recommendations', label: 'Recommendations' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        sites: [
          {
            id: 1,
            name: 'example.com',
            status: 'online',
            plugins: 24,
            uptime: '99.9%',
            lastUpdate: '2024-01-15'
          },
          {
            id: 2,
            name: 'demo-site.com',
            status: 'online',
            plugins: 18,
            uptime: '99.7%',
            lastUpdate: '2024-01-14'
          }
        ],
        plugins: [
          { name: 'Defender Pro', version: '4.1.0', status: 'active', site: 'example.com' },
          { name: 'Hummingbird Pro', version: '3.4.2', status: 'active', site: 'example.com' },
          { name: 'SmartCrawl Pro', version: '3.0.1', status: 'inactive', site: 'demo-site.com' },
          { name: 'Forminator Pro', version: '1.24.6', status: 'active', site: 'demo-site.com' }
        ],
        summary: {
          totalSites: 2,
          activeSites: 2,
          totalPlugins: 42,
          activePlugins: 38
        },
        accounts: [
          {
            id: 'wpmu_001',
            siteName: 'example.com',
            domain: 'https://example.com',
            plan: 'Pro',
            status: 'Active',
            plugins: 24,
            lastBackup: '2024-01-15',
            wpVersion: '6.4.2'
          },
          {
            id: 'wpmu_002',
            siteName: 'demo-site.com',
            domain: 'https://demo-site.com',
            plan: 'Agency',
            status: 'Active',
            plugins: 18,
            lastBackup: '2024-01-14',
            wpVersion: '6.4.1'
          },
          {
            id: 'wpmu_003',
            siteName: 'test-blog.com',
            domain: 'https://test-blog.com',
            plan: 'Basic',
            status: 'Maintenance',
            plugins: 12,
            lastBackup: '2024-01-10',
            wpVersion: '6.3.2'
          }
        ],
        alerts: [
          { type: 'warning', message: 'Plugin update available for Defender Pro', time: '3 hours ago' },
          { type: 'error', message: 'Backup failed for test-blog.com', time: '6 hours ago' },
          { type: 'info', message: 'WordPress 6.4.3 available for all sites', time: '1 day ago' }
        ],
        recommendations: [
          { 
            type: 'security', 
            title: 'Enable two-factor authentication', 
            impact: 'High', 
            description: 'Implement 2FA across all sites to significantly improve security and protect against unauthorized access.' 
          },
          { 
            type: 'performance', 
            title: 'Update outdated plugins', 
            impact: 'Medium', 
            description: 'Several plugins have updates available that include performance improvements and security patches.' 
          },
          { 
            type: 'backup', 
            title: 'Schedule automated backups', 
            impact: 'High', 
            description: 'Set up daily automated backups for all sites to ensure data protection and quick recovery capabilities.' 
          }
        ]
      });
      setLoading(false);
    }, 800);
  }, [apiKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">WPMU DEV Overview</h3>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeSubTab === 'overview' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">WPMU DEV Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Total Sites"
                  value={data.summary.totalSites}
                  change="+0%"
                  icon={Server}
                  color="blue"
                />
                <MetricCard
                  title="Active Sites"
                  value={data.summary.activeSites}
                  change="+0%"
                  icon={CheckCircle}
                  color="green"
                />
                <MetricCard
                  title="Total Plugins"
                  value={data.summary.totalPlugins}
                  change="+2"
                  icon={Plug}
                  color="blue"
                />
                <MetricCard
                  title="Active Plugins"
                  value={data.summary.activePlugins}
                  change="+1"
                  icon={CheckCircle}
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Site Status</h4>
                  <div className="space-y-3">
                    {data.sites.map((site) => (
                      <div key={site.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{site.name}</h5>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            site.status === 'online' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {site.status === 'online' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {site.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Plugins:</span> {site.plugins}
                          </div>
                          <div>
                            <span className="font-medium">Uptime:</span> {site.uptime}
                          </div>
                          <div>
                            <span className="font-medium">Updated:</span> {site.lastUpdate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Plugin Status</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plugin
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Version
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.plugins.map((plugin, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {plugin.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              v{plugin.version}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plugin.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {plugin.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'accounts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">WPMU DEV Sites</h3>
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-8 w-8 text-indigo-500" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{account.siteName}</h4>
                          <p className="text-sm text-gray-500">{account.domain}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          account.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {account.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{account.plan} Plan</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Site ID:</span>
                        <p className="text-gray-900">{account.id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Plugins:</span>
                        <p className="text-gray-900">{account.plugins}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">WordPress:</span>
                        <p className="text-gray-900">v{account.wpVersion}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Last Backup:</span>
                        <p className="text-gray-900">{account.lastBackup}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubTab === 'alerts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">WPMU DEV Alerts</h3>
              <div className="space-y-4">
                {data.alerts.map((alert, index) => (
                  <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                    alert.type === 'error' ? 'border-red-400 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                    'border-blue-400 bg-blue-50'
                  }`}>
                    <div className="flex items-start">
                      <AlertTriangle className={`h-5 w-5 mr-3 mt-0.5 ${
                        alert.type === 'error' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          alert.type === 'error' ? 'text-red-800' :
                          alert.type === 'warning' ? 'text-yellow-800' :
                          'text-blue-800'
                        }`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubTab === 'recommendations' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Site Recommendations</h3>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        rec.impact === 'High' ? 'bg-red-100' :
                        rec.impact === 'Medium' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <Lightbulb className={`h-5 w-5 ${
                          rec.impact === 'High' ? 'text-red-600' :
                          rec.impact === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{rec.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rec.impact === 'High' ? 'bg-red-100 text-red-800' :
                            rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.impact} Impact
                          </span>
                        </div>
                        <p className="text-gray-600">{rec.description}</p>
                        <div className="mt-4">
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                            Take Action
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WPMUDevData;