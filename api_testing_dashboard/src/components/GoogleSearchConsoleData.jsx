import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Eye, MousePointer, Globe, AlertTriangle, Lightbulb } from 'lucide-react';
import MetricCard from './MetricCard';

const GoogleSearchConsoleData = ({ token }) => {
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
          totalClicks: 15420,
          totalImpressions: 234500,
          avgCTR: 6.6,
          avgPosition: 12.4
        },
        topQueries: [
          { query: 'react dashboard', clicks: 2840, impressions: 35200, ctr: 8.1, position: 3.2 },
          { query: 'api testing tool', clicks: 1920, impressions: 28400, ctr: 6.8, position: 5.1 },
          { query: 'google analytics', clicks: 1540, impressions: 22100, ctr: 7.0, position: 4.8 },
          { query: 'wpmu dev api', clicks: 890, impressions: 18200, ctr: 4.9, position: 8.3 }
        ],
        topPages: [
          { page: '/dashboard', clicks: 3240, impressions: 42100, ctr: 7.7 },
          { page: '/api-docs', clicks: 2180, impressions: 31200, ctr: 7.0 },
          { page: '/features', clicks: 1890, impressions: 25400, ctr: 7.4 },
          { page: '/pricing', clicks: 1320, impressions: 19800, ctr: 6.7 }
        ],
        accounts: [
          {
            id: 'https://example.com/',
            name: 'Main Website',
            property: 'example.com',
            type: 'Domain Property',
            verification: 'Verified',
            sitemaps: 3,
            lastCrawl: '2024-01-15'
          },
          {
            id: 'https://blog.example.com/',
            name: 'Company Blog',
            property: 'blog.example.com',
            type: 'URL Prefix',
            verification: 'Verified',
            sitemaps: 1,
            lastCrawl: '2024-01-14'
          },
          {
            id: 'https://shop.example.com/',
            name: 'E-commerce Store',
            property: 'shop.example.com',
            type: 'Domain Property',
            verification: 'Pending',
            sitemaps: 2,
            lastCrawl: '2024-01-10'
          }
        ],
        alerts: [
          { type: 'error', message: 'Mobile usability issues detected on 12 pages', time: '2 hours ago' },
          { type: 'warning', message: 'Core Web Vitals performance degraded', time: '5 hours ago' },
          { type: 'info', message: 'New sitemap submitted successfully', time: '1 day ago' }
        ],
        recommendations: [
          { 
            type: 'seo', 
            title: 'Optimize title tags for better CTR', 
            impact: 'High', 
            description: 'Your top performing pages have title tags that could be optimized for better click-through rates. This could increase organic traffic by 15%.' 
          },
          { 
            type: 'technical', 
            title: 'Fix mobile usability issues', 
            impact: 'High', 
            description: 'Address mobile usability problems affecting 12 pages to improve mobile search rankings and user experience.' 
          },
          { 
            type: 'content', 
            title: 'Create content for high-impression keywords', 
            impact: 'Medium', 
            description: 'You have high impressions but low clicks for several keywords. Creating targeted content could capture more traffic.' 
          }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Console Performance</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Search Console Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Total Clicks"
                  value={data.overview.totalClicks.toLocaleString()}
                  change="+22.3%"
                  icon={MousePointer}
                  color="green"
                />
                <MetricCard
                  title="Total Impressions"
                  value={data.overview.totalImpressions.toLocaleString()}
                  change="+18.7%"
                  icon={Eye}
                  color="blue"
                />
                <MetricCard
                  title="Average CTR"
                  value={`${data.overview.avgCTR}%`}
                  change="+1.2%"
                  icon={TrendingUp}
                  color="green"
                />
                <MetricCard
                  title="Average Position"
                  value={data.overview.avgPosition.toFixed(1)}
                  change="-2.3"
                  icon={Search}
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Top Queries</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Query
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clicks
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CTR
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.topQueries.map((query, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {query.query}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {query.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {query.ctr}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Top Pages</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clicks
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CTR
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.topPages.map((page, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {page.page}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {page.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {page.ctr}%
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">Search Console Properties</h3>
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-8 w-8 text-purple-500" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.property}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          account.verification === 'Verified' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {account.verification}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{account.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Property URL:</span>
                        <p className="text-gray-900 break-all">{account.id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Sitemaps:</span>
                        <p className="text-gray-900">{account.sitemaps}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Last Crawl:</span>
                        <p className="text-gray-900">{account.lastCrawl}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubTab === 'alerts' && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Search Console Alerts</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Recommendations</h3>
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
                            View Details
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

export default GoogleSearchConsoleData;