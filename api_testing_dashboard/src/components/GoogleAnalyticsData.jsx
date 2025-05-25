import React, { useState, useEffect } from 'react';
import { Users, Monitor, Clock, TrendingDown, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';
import MetricCard from './MetricCard';

const GoogleAnalyticsData = ({ token }) => {
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
        overview: {
          sessions: 125420,
          users: 89340,
          pageviews: 342580,
          bounceRate: 35.8,
          avgSessionDuration: '2:45'
        },
        topPages: [
          { page: '/home', views: 45200, bounceRate: 28.5 },
          { page: '/products', views: 32100, bounceRate: 42.1 },
          { page: '/about', views: 18900, bounceRate: 55.3 },
          { page: '/contact', views: 12400, bounceRate: 45.7 }
        ],
        accounts: [
          {
            id: 'GA4-123456789',
            name: 'Main Website',
            property: 'example.com',
            type: 'GA4',
            status: 'Active',
            dataRetention: '14 months',
            lastUpdate: '2024-01-15'
          },
          {
            id: 'UA-987654321',
            name: 'Legacy Analytics',
            property: 'demo.example.com',
            type: 'Universal Analytics',
            status: 'Sunset',
            dataRetention: 'N/A',
            lastUpdate: '2023-07-01'
          },
          {
            id: 'GA4-555444333',
            name: 'Mobile App',
            property: 'com.example.app',
            type: 'GA4',
            status: 'Active',
            dataRetention: '14 months',
            lastUpdate: '2024-01-14'
          }
        ],
        alerts: [
          { type: 'warning', message: 'Traffic dropped 25% compared to last week', time: '1 hour ago' },
          { type: 'info', message: 'New audience segment available for targeting', time: '3 hours ago' },
          { type: 'error', message: 'Goal tracking configuration issue detected', time: '6 hours ago' }
        ],
        recommendations: [
          { 
            type: 'conversion', 
            title: 'Set up enhanced ecommerce tracking', 
            impact: 'High', 
            description: 'Enhanced ecommerce tracking will provide deeper insights into user purchase behavior and improve conversion attribution.' 
          },
          { 
            type: 'audience', 
            title: 'Create custom audiences for retargeting', 
            impact: 'Medium', 
            description: 'Custom audiences based on user behavior could improve your remarketing campaigns effectiveness by 30%.' 
          },
          { 
            type: 'goals', 
            title: 'Configure micro-conversion goals', 
            impact: 'Medium', 
            description: 'Track newsletter signups and file downloads as micro-conversions to better understand user engagement.' 
          }
        ]
      });
      setLoading(false);
    }, 1200);
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Google Analytics Overview</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Google Analytics Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Sessions"
                  value={data.overview.sessions.toLocaleString()}
                  change="+15.2%"
                  icon={Monitor}
                  color="blue"
                />
                <MetricCard
                  title="Users"
                  value={data.overview.users.toLocaleString()}
                  change="+12.8%"
                  icon={Users}
                  color="green"
                />
                <MetricCard
                  title="Page Views"
                  value={data.overview.pageviews.toLocaleString()}
                  change="+18.4%"
                  icon={TrendingDown}
                  color="blue"
                />
                <MetricCard
                  title="Bounce Rate"
                  value={`${data.overview.bounceRate}%`}
                  change="-3.2%"
                  icon={Clock}
                  color="green"
                />
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Top Pages</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bounce Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.topPages.map((page, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {page.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {page.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {page.bounceRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'accounts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Connected Analytics Accounts</h3>
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-8 w-8 text-orange-500" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.property}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          account.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          account.status === 'Sunset' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {account.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{account.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Property ID:</span>
                        <p className="text-gray-900">{account.id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Data Retention:</span>
                        <p className="text-gray-900">{account.dataRetention}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Last Update:</span>
                        <p className="text-gray-900">{account.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubTab === 'alerts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics Alerts</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics Recommendations</h3>
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
                            Implement Recommendation
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

export default GoogleAnalyticsData;