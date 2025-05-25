#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * Initializes the SQLite database with proper tables and sample data
 * for development and testing purposes.
 */

import DatabaseService from '../src/services/DatabaseService.js';
import { format, subDays } from 'date-fns';

/**
 * Generate sample data for development
 */
async function generateSampleData() {
  console.log('Generating sample data...');
  
  // Generate 90 days of sample Google Ads data
  for (let i = 90; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    
    await DatabaseService.storeGoogleAdsData('123-456-7890', {
      impressions: Math.floor(40000 + Math.random() * 20000),
      clicks: Math.floor(2000 + Math.random() * 1000),
      spend: 500 + Math.random() * 400,
      conversions: Math.floor(50 + Math.random() * 30),
      ctr: 4.5 + Math.random() * 2,
      costPerClick: 0.8 + Math.random() * 0.5,
      campaignCount: 10 + Math.floor(Math.random() * 5)
    });
    
    // Generate Analytics data
    await DatabaseService.storeAnalyticsData('GA4-123456789', {
      sessions: Math.floor(8000 + Math.random() * 4000),
      users: Math.floor(6000 + Math.random() * 3000),
      pageviews: Math.floor(25000 + Math.random() * 15000),
      bounceRate: 30 + Math.random() * 20,
      avgSessionDuration: 120 + Math.random() * 60,
      goalCompletions: Math.floor(200 + Math.random() * 100),
      revenue: 1000 + Math.random() * 2000
    });
    
    // Generate Search Console data
    await DatabaseService.storeSearchConsoleData('https://example.com/', {
      totalClicks: Math.floor(12000 + Math.random() * 6000),
      totalImpressions: Math.floor(180000 + Math.random() * 80000),
      avgCTR: 6 + Math.random() * 3,
      avgPosition: 8 + Math.random() * 8,
      indexedPages: 1500 + Math.floor(Math.random() * 200),
      crawlErrors: Math.floor(Math.random() * 10)
    });
    
    // Generate Facebook data
    await DatabaseService.storeFacebookData('123456789012345', {
      impressions: Math.floor(60000 + Math.random() * 30000),
      clicks: Math.floor(3500 + Math.random() * 1500),
      spend: 800 + Math.random() * 600,
      conversions: Math.floor(80 + Math.random() * 40),
      ctr: 5.5 + Math.random() * 2.5,
      cpp: 0.9 + Math.random() * 0.6,
      frequency: 1.8 + Math.random() * 0.8,
      reach: Math.floor(25000 + Math.random() * 15000)
    });
    
    // Generate WPMU DEV data
    await DatabaseService.storeWPMUData('wpmu_001', {
      uptimePercentage: 98 + Math.random() * 2,
      pageLoadTime: 1.2 + Math.random() * 0.8,
      pluginCount: 20 + Math.floor(Math.random() * 10),
      securityScore: 85 + Math.floor(Math.random() * 15),
      backupStatus: Math.random() > 0.1 ? 'success' : 'failed',
      wpVersion: '6.4.2',
      activePlugins: 18 + Math.floor(Math.random() * 8)
    });
  }
  
  console.log('Sample data generated successfully!');
}

/**
 * Main setup function
 */
async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Initialize database service
    await DatabaseService.initialize();
    console.log('Database tables created successfully!');
    
    // Generate sample data for development
    await generateSampleData();
    
    console.log('Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Connect your APIs in the Settings tab');
    console.log('3. Explore AI analytics features');
    
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}