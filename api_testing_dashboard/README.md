# API Testing Dashboard

A comprehensive dashboard for managing and monitoring Google APIs, Facebook APIs, and WPMU DEV services with AI-powered recommendations and alerts.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Modern web browser

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 How to Use

### 1. Initial Setup
When you first open the dashboard, you'll see the **Overview** tab with connection status for all services. All services will show as "Disconnected" initially.

### 2. Connect Your APIs

#### Google APIs (Ads, Analytics, Search Console)
1. Click the **Settings** tab
2. In the "Google APIs" section, click **Connect Google APIs**
3. Currently uses mock authentication - in production, this would trigger real Google OAuth
4. Once connected, you'll see a green status indicator

#### Facebook APIs
1. In Settings, find the "Facebook APIs" section
2. Click **Connect Facebook APIs**
3. Currently uses mock authentication - in production, this would trigger Facebook Login
4. Success shows green status in header

#### WPMU DEV
1. In Settings, locate "WPMU DEV API" section
2. Enter your WPMU DEV API key
3. Click **Save API Key**
4. The system will store your key securely

### 3. Navigate the Dashboard

#### Overview Tab
- Shows connection status for all services
- Displays helpful setup guides for disconnected services
- Quick access to settings for each service

#### Individual Service Tabs
Each service (Google Ads, Analytics, Search Console, Facebook, WPMU DEV) has four sub-sections:

**Overview**: Key metrics and performance data
- Campaign performance
- Traffic statistics
- Spend and conversion data

**Accounts**: Connected account details
- Account IDs and names
- Status information
- Configuration details

**Alerts**: Real-time notifications
- Error messages (red)
- Warnings (yellow)
- Information updates (blue)

**Recommendations**: AI-powered suggestions
- High/Medium/Low impact recommendations
- Actionable insights
- Performance optimization tips

### 4. Understanding the Interface

#### Connection Status Indicators
- **Green dot**: Service connected and active
- **Gray dot**: Service disconnected
- Header shows real-time connection status

#### Color-Coded Alerts
- **Red**: Critical errors requiring immediate attention
- **Yellow**: Warnings that should be reviewed
- **Blue**: Informational updates

#### Impact Levels
- **High Impact**: Critical recommendations affecting major metrics
- **Medium Impact**: Moderate improvements
- **Low Impact**: Minor optimizations

## 🔧 Technical Features

### Mock Data System
The dashboard uses realistic mock data to demonstrate functionality:
- Simulated API responses
- Realistic performance metrics
- Sample account structures

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly navigation

### Local Storage
- Securely stores connection tokens
- Remembers user preferences
- Persists across browser sessions

## 🛠 Development Notes

### Project Structure
```
src/
├── components/           # React components
│   ├── GoogleAdsData.jsx        # Google Ads interface
│   ├── GoogleAnalyticsData.jsx  # Analytics interface
│   ├── GoogleSearchConsoleData.jsx # Search Console interface
│   ├── FacebookData.jsx         # Facebook interface
│   ├── WPMUDevData.jsx         # WPMU DEV interface
│   ├── GoogleAuthButton.jsx    # Google OAuth component
│   ├── FacebookAuthButton.jsx  # Facebook auth component
│   ├── ApiKeyConfig.jsx        # API key input component
│   └── MetricCard.jsx          # Reusable metric display
├── App.jsx              # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

### State Management
- React hooks for local state
- localStorage for persistence
- Prop drilling for data flow

### Styling
- Tailwind CSS for utility classes
- Lucide React for consistent icons
- Responsive design patterns

## 🔮 Future Enhancements

### Real API Integration
Replace mock authentication with:
- Google OAuth 2.0 implementation
- Facebook Login SDK
- Real WPMU DEV API endpoints

### AI Recommendations Engine
- Machine learning integration
- Predictive analytics
- Automated optimization suggestions

### Advanced Features
- Data export functionality
- Custom dashboard creation
- Team collaboration tools
- Scheduled reporting

## 🚨 Important Notes

### Security
- Never commit real API keys
- Use environment variables in production
- Implement proper OAuth flows
- Validate all user inputs

### Performance
- Implement data caching
- Add loading states
- Optimize API calls
- Consider pagination for large datasets

### Production Deployment
- Configure proper CORS settings
- Set up environment-specific configurations
- Implement error logging
- Add monitoring and analytics

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure you're using a modern browser
4. Contact development team for API access

---

**Note**: This is a demonstration dashboard using mock data. In production, replace mock authentication with real OAuth implementations and connect to actual API endpoints.