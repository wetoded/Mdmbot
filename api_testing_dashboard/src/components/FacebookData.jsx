import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, MousePointer, DollarSign, Users, AlertTriangle, Lightbulb, Share2 } from 'lucide-react';
import MetricCard from './MetricCard';

const FacebookData = ({ token }) => {
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
        campaigns: [
          { name: 'Holiday Campaign', impressions: 125000, clicks: 8500, spend: 2450.00, ctr: 6.8 },
          { name: 'Brand Awareness', impressions: 89000, clicks: 5200, spend: 1680.00, ctr: 5.8 },
          { name: 'Retargeting Campaign', impressions: 67000, clicks: 4100, spend: 1290.00, ctr: 6.1 }
        ],
        totals: {
          impressions: 281000,
          clicks: 17800,
          spend: 5420.00,
          ctr: 6.3
        },
        accounts: [
          { 
            id: '123456789012345', 
            name: 'Main Business Account', 
            status: 'Active', 
            currency: 'USD',
            campaigns: 12,
            spend: 18450.00,
            lastActivity: '2024-01-15',
            adSets: 35
          },
          { 
            id: '987654321098765', 
            name: 'E-commerce Store', 
            status: 'Active', 
            currency: 'USD',
            campaigns: 8,
            spend: 12780.00,
            lastActivity: '2024-01-14',
            adSets: 24
          },
          { 
            id: '555444333222111', 
            name: 'Local Business', 
            status: 'Limited', 
            currency: 'USD',
            campaigns: 5,
            spend: 3150.00,
            lastActivity: '2024-01-12',
            adSets: 12
          }
        ],
        alerts: [
          { type: 'warning', message: 'Campaign "Holiday Campaign" frequency too high', time: '1 hour ago' },
          { type: 'error', message: 'Ad rejected in "Brand Awareness" campaign', time: '3 hours ago' },
          { type: 'info', message: 'New audience insights available', time: '6 hours ago' }
        ],
        recommendations: [
          { type: 'audience', title: 'Expand lookalike audiences', impact: 'High', description: 'Create lookalike audiences based on your best converting customers to reach 35% more qualified prospects.' },
          { type: 'creative', title: 'Test video ad formats', impact: 'Medium', description: 'Video ads in your niche show 23% higher engagement rates. Consider testing short-form video content.' },
          { type: 'budget', title: 'Reallocate budget to top performing ad sets', impact: 'High', description: 'Your retargeting campaign shows 40% better ROAS. Consider increasing its budget by 25%.' }
        ]
      });
      setLoading(false);
    }, 1100);
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Facebook Ads Performance</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Facebook Ads Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Total Impressions"
                  value={data.totals.impressions.toLocaleString()}
                  change="+18.2%"
                  icon={Eye}
                  color="blue"
                />
                <MetricCard
                  title="Total Clicks"
                  value={data.totals.clicks.toLocaleString()}
                  change="+15.4%"
                  icon={MousePointer}
                  color="green"
                />
                <MetricCard
                  title="Total Spend"
                  value={`$${data.totals.spend.toFixed(2)}`}
                  change="+8.7%"
                  icon={DollarSign}
                  color="red"
                />
                <MetricCard
                  title="Average CTR"
                  value={`${data.totals.ctr}%`}
                  change="+3.2%"
                  icon={TrendingUp}
                  color="blue"
                />
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Top Campaigns</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Impressions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clicks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spend
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CTR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.campaigns.map((campaign, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.impressions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.clicks.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${campaign.spend.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.ctr}%
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Connected Facebook Accounts</h3>
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Share2 className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-500">ID: {account.id}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        account.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        account.status === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {account.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Currency:</span>
                        <p className="text-gray-900">{account.currency}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Campaigns:</span>
                        <p className="text-gray-900">{account.campaigns}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Ad Sets:</span>
                        <p className="text-gray-900">{account.adSets}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Total Spend:</span>
                        <p className="text-gray-900">${account.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Last Activity:</span>
                        <p className="text-gray-900">{account.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubTab === 'alerts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Facebook Alerts</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Facebook Recommendations</h3>
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
                            Apply Recommendation
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

export default FacebookData;