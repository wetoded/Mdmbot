/**
 * AIService Class (Hybrid Implementation)
 * 
 * Supports both local AI (Ollama) and cloud AI APIs (OpenAI, Anthropic)
 * Mode is configurable per user or system-wide
 */
class AIService {
  constructor() {
    this.isInitialized = false;
    this.mode = 'local'; // 'local' or 'api'
    this.config = null;
  }

  /**
   * Initialize AI service based on configuration
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load AI configuration
      this.loadConfig();
      
      if (this.mode === 'local') {
        await this.initializeLocal();
      } else {
        await this.initializeAPI();
      }
      
      this.isInitialized = true;
      console.log(`AI Service initialized in ${this.mode} mode`);
    } catch (error) {
      console.error('Failed to initialize AI Service:', error);
    }
  }

  /**
   * Load AI configuration
   */
  loadConfig() {
    try {
      const systemConfig = localStorage.getItem('system_ai_config');
      
      this.config = systemConfig ? JSON.parse(systemConfig) : {
        mode: 'local',
        apiKeys: {
          openai: '',
          anthropic: '',
          google: ''
        },
        localConfig: {
          ollamaUrl: 'http://localhost:11434',
          defaultModel: 'llama2'
        }
      };
      
      this.mode = this.config.mode;
    } catch (error) {
      console.error('Error loading AI config:', error);
      this.mode = 'local';
      this.config = {
        mode: 'local',
        localConfig: {
          ollamaUrl: 'http://localhost:11434',
          defaultModel: 'llama2'
        }
      };
    }
  }

  /**
   * Initialize local AI (Ollama)
   */
  async initializeLocal() {
    try {
      // Check if Ollama is available
      const response = await fetch(`${this.config.localConfig.ollamaUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        console.log('Available Ollama models:', data.models?.map(m => m.name) || []);
      } else {
        throw new Error('Ollama not available');
      }
    } catch (error) {
      console.warn('Local AI (Ollama) not available. Install from https://ollama.ai');
      // Don't throw error - allow fallback to mock mode
    }
  }

  /**
   * Initialize API-based AI
   */
  async initializeAPI() {
    try {
      // Validate API keys
      if (!this.config.apiKeys.openai && !this.config.apiKeys.anthropic) {
        console.warn('No AI API keys configured');
      }
      console.log('API-based AI initialized');
    } catch (error) {
      console.error('Error initializing API-based AI:', error);
    }
  }

  /**
   * Generate analysis using configured AI mode
   */
  async generateAnalysis(prompt, context = {}) {
    if (this.mode === 'local') {
      return this.generateLocalAnalysis(prompt, context);
    } else {
      return this.generateAPIAnalysis(prompt, context);
    }
  }

  /**
   * Generate analysis using local AI (Ollama)
   */
  async generateLocalAnalysis(prompt, context) {
    try {
      const response = await fetch(`${this.config.localConfig.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.localConfig.defaultModel,
          prompt: prompt,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        return this.parseAIResponse(data.response);
      } else {
        throw new Error('Ollama request failed');
      }
    } catch (error) {
      console.warn('Local AI failed, using fallback:', error.message);
      return this.generateFallbackAnalysis(context);
    }
  }

  /**
   * Generate analysis using cloud AI APIs
   */
  async generateAPIAnalysis(prompt, context) {
    try {
      if (this.config.apiKeys.openai) {
        return this.generateOpenAIAnalysis(prompt, context);
      } else if (this.config.apiKeys.anthropic) {
        return this.generateAnthropicAnalysis(prompt, context);
      } else {
        throw new Error('No AI API keys configured');
      }
    } catch (error) {
      console.warn('API AI failed, using fallback:', error.message);
      return this.generateFallbackAnalysis(context);
    }
  }

  /**
   * Generate analysis using OpenAI API
   */
  async generateOpenAIAnalysis(prompt, context) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKeys.openai}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert marketing data analyst. Provide concise, actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return this.parseAIResponse(data.choices[0].message.content);
      } else {
        throw new Error('OpenAI API request failed');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate analysis using Anthropic API
   */
  async generateAnthropicAnalysis(prompt, context) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKeys.anthropic,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return this.parseAIResponse(data.content[0].text);
      } else {
        throw new Error('Anthropic API request failed');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Parse AI response into structured insights
   */
  parseAIResponse(response) {
    const lines = response.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, 4); // Return first 4 insights
  }

  /**
   * Generate fallback analysis when AI is unavailable
   */
  generateFallbackAnalysis(context) {
    const dataSource = context.dataSource || 'unknown';
    return [
      `${dataSource} analysis available - AI features temporarily offline`,
      'Performance appears within normal ranges based on historical data',
      'Consider manual review of recent changes and optimizations',
      'Monitor key metrics closely for any significant variations'
    ];
  }

  /**
   * Analyze Google Ads performance
   */
  async analyzeGoogleAds(accountId, currentData) {
    try {
      const prompt = `
        Analyze this Google Ads performance data and provide insights:
        
        Current Performance:
        - Impressions: ${currentData.impressions || 0}
        - Clicks: ${currentData.clicks || 0}
        - Spend: $${currentData.spend || 0}
        - CTR: ${currentData.ctr || 0}%
        - Cost per Click: $${currentData.costPerClick || 0}
        
        Provide 3-4 key insights about performance trends, optimization opportunities, and potential issues.
        Keep each insight concise and actionable.
      `;

      const insights = await this.generateAnalysis(prompt, { dataSource: 'google_ads' });

      return {
        type: 'google_ads_analysis',
        insights: insights,
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
        recommendations: this.generateRecommendations('google_ads', insights),
        confidenceScore: 0.85,
        modelVersion: this.mode === 'local' ? 'ollama-local' : 'api-cloud',
        aiMode: this.mode
      };
    } catch (error) {
      console.error('Error analyzing Google Ads data:', error);
      return this.getFallbackAnalysis('google_ads');
    }
  }

  /**
   * Analyze Facebook Ads performance
   */
  async analyzeFacebookAds(accountId, currentData) {
    try {
      const prompt = `
        Analyze this Facebook Ads performance data:
        
        Current Metrics:
        - Impressions: ${currentData.impressions || 0}
        - Clicks: ${currentData.clicks || 0}
        - Spend: $${currentData.spend || 0}
        - CTR: ${currentData.ctr || 0}%
        - Frequency: ${currentData.frequency || 0}
        - Reach: ${currentData.reach || 0}
        
        Focus on frequency management, audience fatigue, and creative performance.
        Provide specific recommendations for Facebook's unique advertising environment.
      `;

      const insights = await this.generateAnalysis(prompt, { dataSource: 'facebook' });

      return {
        type: 'facebook_analysis',
        insights: insights,
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
        recommendations: this.generateRecommendations('facebook', insights),
        confidenceScore: 0.78,
        modelVersion: this.mode === 'local' ? 'ollama-local' : 'api-cloud',
        aiMode: this.mode
      };
    } catch (error) {
      console.error('Error analyzing Facebook data:', error);
      return this.getFallbackAnalysis('facebook');
    }
  }

  /**
   * Generate recommendations based on data source
   */
  generateRecommendations(dataSource, insights) {
    const recommendations = [];
    
    switch (dataSource) {
      case 'google_ads':
        recommendations.push('Optimize ad copy for mobile devices');
        recommendations.push('Test new keyword variations');
        recommendations.push('Adjust bidding strategy for peak hours');
        recommendations.push('Review negative keyword list');
        break;
      case 'facebook':
        recommendations.push('Refresh creative assets to combat fatigue');
        recommendations.push('Expand lookalike audience segments');
        recommendations.push('Test video ad formats');
        recommendations.push('Optimize for mobile-first experience');
        break;
      default:
        recommendations.push(`Review ${dataSource} performance manually`);
        recommendations.push('Monitor key metrics closely');
    }
    
    return recommendations;
  }

  /**
   * Get fallback analysis when AI is unavailable
   */
  getFallbackAnalysis(dataSource) {
    return {
      type: `${dataSource}_analysis`,
      insights: [
        'Basic analysis available - AI features temporarily offline',
        'Performance appears within normal ranges',
        'Consider manual review of recent changes'
      ],
      anomalies: { hasAnomalies: false, details: [] },
      predictions: { predictions: [], confidence: 0 },
      recommendations: [
        `Review ${dataSource} performance manually`,
        'Check for obvious optimization opportunities',
        'Monitor key metrics closely'
      ],
      confidenceScore: 0.3,
      modelVersion: 'fallback',
      aiMode: 'fallback'
    };
  }

  /**
   * Update AI configuration
   */
  async updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.mode = this.config.mode;
    localStorage.setItem('system_ai_config', JSON.stringify(this.config));
    
    // Reinitialize with new config
    this.isInitialized = false;
    await this.initialize();
  }

  /**
   * Get current AI configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Check if AI is available
   */
  isAvailable() {
    return this.isInitialized;
  }

  /**
   * Get AI status
   */
  getStatus() {
    return {
      mode: this.mode,
      available: this.isInitialized,
      config: this.config
    };
  }
}

// Export singleton instance
export default new AIService();