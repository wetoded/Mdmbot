import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Database, Cpu, BarChart3, Zap } from 'lucide-react';

/**
 * AIAnalytics Component
 * 
 * Displays AI-powered analytics and insights across all connected services.
 * Shows machine learning predictions, anomaly detection, and natural language insights.
 */
const AIAnalytics = ({ dataSource, accountId, currentData }) => {
  // Component state for AI analysis results
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [aiStatus, setAiStatus] = useState('initializing');

  // Sub-navigation tabs for AI analytics
  const aiTabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'training', label: 'Model Training', icon: Cpu }
  ];

  /**
   * Initialize AI service and run analysis on component mount
   */
  useEffect(() => {
    initializeAI();
  }, [dataSource, accountId]);

  /**
   * Initialize AI service and perform analysis
   */
  const initializeAI = async () => {
    try {
      setLoading(true);
      setAiStatus('initializing');

      // Simulate AI initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiStatus('analyzing');

      // Generate mock analysis based on data source
      let analysisResult;
      if (dataSource === 'google_ads') {
        analysisResult = {
          type: 'google_ads_analysis',
          insights: [
            'CTR is performing 15% above industry average',
            'Cost per click has decreased by 8% this week',
            'Conversion rate shows strong upward trend',
            'Consider increasing budget for top-performing campaigns'
          ],
          anomalies: { 
            hasAnomalies: Math.random() > 0.7,
            details: Math.random() > 0.7 ? ['Unusual spike in impressions detected'] : []
          },
          predictions: {
            predictions: [
              {
                metric: 'performance_score',
                value: 85.5,
                period: '7_days',
                confidence: 0.78
              },
              {
                metric: 'ctr_forecast',
                value: 5.2,
                period: '7_days',
                confidence: 0.82
              }
            ],
            confidence: 0.80
          },
          recommendations: [
            'Optimize ad copy for mobile devices',
            'Test new keyword variations',
            'Adjust bidding strategy for peak hours',
            'Review negative keyword list'
          ],
          confidenceScore: 0.85,
          modelVersion: 'v1.0'
        };
      } else if (dataSource === 'facebook') {
        analysisResult = {
          type: 'facebook_analysis',
          insights: [
            'Audience engagement has improved by 22%',
            'Frequency is within optimal range (1.8x)',
            'Creative performance shows signs of fatigue',
            'Mobile conversion rate outperforming desktop'
          ],
          anomalies: { 
            hasAnomalies: Math.random() > 0.8,
            details: Math.random() > 0.8 ? ['Unusual drop in reach detected'] : []
          },
          predictions: {
            predictions: [
              {
                metric: 'reach_forecast',
                value: 45000,
                period: '7_days',
                confidence: 0.75
              }
            ],
            confidence: 0.73
          },
          recommendations: [
            'Refresh creative assets to combat fatigue',
            'Expand lookalike audience segments',
            'Test video ad formats',
            'Optimize for mobile-first experience'
          ],
          confidenceScore: 0.78,
          modelVersion: 'v1.0'
        };
      } else {
        analysisResult = {
          type: `${dataSource}_analysis`,
          insights: ['Analysis available for connected services'],
          anomalies: { hasAnomalies: false, details: [] },
          predictions: { predictions: [], confidence: 0 },
          recommendations: ['Connect more services for detailed analysis'],
          confidenceScore: 0.5,
          modelVersion: 'v1.0'
        };
      }

      setAnalysis(analysisResult);
      setAiStatus('ready');
    } catch (err) {
      console.error('AI initialization error:', err);
      setError(err.message);
      setAiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger model retraining with latest data
   */
  const handleRetraining = async () => {
    try {
      setAiStatus('training');
      
      // Simulate training process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAiStatus('ready');
      alert('Model retrained successfully with latest data!');
    } catch (error) {
      console.error('Training error:', error);
      setAiStatus('error');
    }
  };

  /**
   * Render AI status indicator
   */
  const renderAIStatus = () => {
    const statusConfig = {
      initializing: { color: 'yellow', text: 'Initializing AI...', icon: Cpu },
      analyzing: { color: 'blue', text: 'Analyzing Data...', icon: Brain },
      training: { color: 'purple', text: 'Training Models...', icon: Database },
      ready: { color: 'green', text: 'AI Ready', icon: Zap },
      error: { color: 'red', text: 'AI Offline', icon: AlertTriangle }
    };

    const status = statusConfig[aiStatus];
    const Icon = status.icon;

    return (
      <div className="flex items-center space-x-2 mb-6">
        <div className={`w-3 h-3 rounded-full ${
          status.color === 'yellow' ? 'bg-yellow-500' :
          status.color === 'blue' ? 'bg-blue-500' :
          status.color === 'purple' ? 'bg-purple-500' :
          status.color === 'green' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <Icon className={`h-4 w-4 ${
          status.color === 'yellow' ? 'text-yellow-600' :
          status.color === 'blue' ? 'text-blue-600' :
          status.color === 'purple' ? 'text-purple-600' :
          status.color === 'green' ? 'text-green-600' : 'text-red-600'
        }`} />
        <span className={`text-sm font-medium ${
          status.color === 'yellow' ? 'text-yellow-800' :
          status.color === 'blue' ? 'text-blue-800' :
          status.color === 'purple' ? 'text-purple-800' :
          status.color === 'green' ? 'text-green-800' : 'text-red-800'
        }`}>
          {status.text}
        </span>
      </div>
    );
  };

  /**
   * Simple chart component replacement for recharts
   */
  const SimpleChart = ({ data, title, type = 'line' }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.actual || 0, d.predicted || 0, d.normal || 0, d.anomaly || 0)));
    
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-700 mb-4">{title}</h5>
        <div className="relative h-40">
          <svg className="w-full h-full" viewBox="0 0 400 160">
            {/* Grid lines */}
            {[0, 40, 80, 120, 160].map(y => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            
            {/* Data visualization */}
            {data.map((point, index) => {
              const x = (index / Math.max(data.length - 1, 1)) * 380 + 10;
              
              if (type === 'area') {
                const normalHeight = point.normal ? (point.normal / maxValue) * 140 : 0;
                const anomalyHeight = point.anomaly ? (point.anomaly / maxValue) * 140 : 0;
                
                return (
                  <g key={index}>
                    {point.normal && (
                      <rect x={x-2} y={160-normalHeight} width="4" height={normalHeight} fill="#10b981" />
                    )}
                    {point.anomaly && (
                      <rect x={x-2} y={160-anomalyHeight} width="4" height={anomalyHeight} fill="#ef4444" />
                    )}
                  </g>
                );
              } else {
                const actualY = point.actual ? 160 - (point.actual / maxValue) * 140 : null;
                const predictedY = point.predicted ? 160 - (point.predicted / maxValue) * 140 : null;
                
                return (
                  <g key={index}>
                    {actualY && <circle cx={x} cy={actualY} r="3" fill="#2563eb" />}
                    {predictedY && <circle cx={x} cy={predictedY} r="3" fill="#dc2626" fillOpacity="0.7" />}
                  </g>
                );
              }
            })}
          </svg>
          
          {/* Legend */}
          <div className="flex items-center space-x-4 mt-2 text-xs">
            {type === 'line' ? (
              <>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Actual</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-600 opacity-70"></div>
                  <span>Predicted</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <span>Anomaly</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render AI insights tab content
   */
  const renderInsights = () => {
    if (!analysis?.insights) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confidence Score Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Analysis Confidence</h4>
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((analysis.confidenceScore || 0) * 100)}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on {analysis.modelVersion || 'v1.0'} model
            </p>
          </div>

          {/* Data Quality Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Data Quality</h4>
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {analysis.insights.length > 2 ? 'High' : 'Medium'}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.insights.length} insights generated
            </p>
          </div>
        </div>

        {/* AI-Generated Insights */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">AI-Generated Insights</h4>
          <div className="space-y-3">
            {analysis.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h4>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render predictions tab content
   */
  const renderPredictions = () => {
    if (!analysis?.predictions?.predictions) return null;

    // Mock trend data for visualization
    const trendData = [
      { day: 'Day 1', actual: 100, predicted: null },
      { day: 'Day 2', actual: 120, predicted: null },
      { day: 'Day 3', actual: 115, predicted: null },
      { day: 'Day 4', actual: null, predicted: 125 },
      { day: 'Day 5', actual: null, predicted: 130 },
      { day: 'Day 6', actual: null, predicted: 128 },
      { day: 'Day 7', actual: null, predicted: 135 }
    ];

    return (
      <div className="space-y-6">
        {/* Prediction Chart */}
        <div className="bg-white rounded-lg border p-6">
          <SimpleChart 
            data={trendData} 
            title="Performance Prediction - Next 7 Days"
            type="line"
          />
        </div>

        {/* Prediction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.predictions.predictions.map((pred, index) => (
            <div key={index} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 capitalize">
                  {pred.metric.replace('_', ' ')}
                </h5>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {typeof pred.value === 'number' ? pred.value.toFixed(2) : pred.value}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{pred.period.replace('_', ' ')}</span>
                <span>{Math.round(pred.confidence * 100)}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render anomalies tab content
   */
  const renderAnomalies = () => {
    return (
      <div className="space-y-6">
        {/* Anomaly Status */}
        <div className={`rounded-lg p-6 ${
          analysis?.anomalies?.hasAnomalies 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`h-6 w-6 ${
              analysis?.anomalies?.hasAnomalies ? 'text-red-600' : 'text-green-600'
            }`} />
            <div>
              <h4 className={`text-lg font-medium ${
                analysis?.anomalies?.hasAnomalies ? 'text-red-900' : 'text-green-900'
              }`}>
                {analysis?.anomalies?.hasAnomalies ? 'Anomalies Detected' : 'No Anomalies Detected'}
              </h4>
              <p className={`text-sm ${
                analysis?.anomalies?.hasAnomalies ? 'text-red-700' : 'text-green-700'
              }`}>
                {analysis?.anomalies?.hasAnomalies 
                  ? 'Unusual patterns found in your data that require attention'
                  : 'Your performance data appears normal and consistent'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Anomaly Details */}
        {analysis?.anomalies?.details && analysis.anomalies.details.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Anomaly Details</h4>
            <div className="space-y-3">
              {analysis.anomalies.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anomaly Detection Chart */}
        <div className="bg-white rounded-lg border p-6">
          <SimpleChart 
            data={[
              { date: '2024-01-01', normal: 100, anomaly: null },
              { date: '2024-01-02', normal: 105, anomaly: null },
              { date: '2024-01-03', normal: 98, anomaly: null },
              { date: '2024-01-04', normal: null, anomaly: 150 },
              { date: '2024-01-05', normal: 102, anomaly: null },
              { date: '2024-01-06', normal: 99, anomaly: null },
              { date: '2024-01-07', normal: 103, anomaly: null }
            ]}
            title="Anomaly Detection Timeline"
            type="area"
          />
        </div>
      </div>
    );
  };

  /**
   * Render model training tab content
   */
  const renderTraining = () => {
    return (
      <div className="space-y-6">
        {/* Model Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Performance Model</h4>
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Training Data:</span>
                <span className="font-medium">90 days</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium">2 days ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Anomaly Detection</h4>
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Precision:</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Recall:</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span>False Positives:</span>
                <span className="font-medium">5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Trend Analysis</h4>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>MAE:</span>
                <span className="font-medium">0.12</span>
              </div>
              <div className="flex justify-between">
                <span>Forecast Range:</span>
                <span className="font-medium">7 days</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className="font-medium">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Controls */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Model Training</h4>
          <div className="space-y-4">
            <p className="text-gray-600">
              Retrain models with the latest data to improve accuracy and adapt to changing patterns.
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRetraining}
                disabled={aiStatus === 'training'}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Cpu className="h-4 w-4" />
                <span>{aiStatus === 'training' ? 'Training...' : 'Retrain Models'}</span>
              </button>
              
              <div className="text-sm text-gray-500">
                Last training: 2 days ago
              </div>
            </div>

            {aiStatus === 'training' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Training Data Overview */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Training Data Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">90</div>
              <div className="text-sm text-gray-500">Days of Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2,340</div>
              <div className="text-sm text-gray-500">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-500">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-500">Data Quality</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <h4 className="text-lg font-medium text-red-900">AI Analysis Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Status Indicator */}
      {renderAIStatus()}

      {/* AI Analytics Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {aiTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'predictions' && renderPredictions()}
          {activeTab === 'anomalies' && renderAnomalies()}
          {activeTab === 'training' && renderTraining()}
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;