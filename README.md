# Dynamic Stock Analyzer 1.0 📊

A comprehensive real-time stock market analysis platform built with modern web technologies. Features live market data, advanced C algorithms, portfolio management, and correlation analysis.

## 🚀 Features

### ✅ Core Features Implemented

#### **1. Real-Time Dashboard**
- Live market indices (NIFTY, SENSEX) with real-time updates
- Stock watchlist with live price tracking
- Market summary with gainers/losers
- Responsive design for all devices

#### **2. Live Stock Tracker**
- Advanced search and stock lookup
- Real-time algorithm analysis (Stock Span, Range Query, Sliding Window)
- Technical indicators (RSI, MACD)
- Interactive charts and visualizations

#### **3. Stock Comparison**
- Multi-stock correlation analysis
- Historical price comparison
- Sector-wise performance analysis
- Pearson correlation coefficients

#### **4. Portfolio Management**
- CRUD operations for portfolios and stocks
- Live P&L calculations
- Sector allocation visualization
- Investment tracking with real-time updates

#### **5. Advanced Algorithms**
- **Stock Span Algorithm**: O(n) stack-based approach
- **Range Query**: Segment tree implementation for min/max queries
- **Sliding Window**: Moving averages and volatility analysis
- **Technical Indicators**: RSI and MACD calculations

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **Socket.io** - Real-time communication
- **JWT** - Authentication and authorization

### Database & Caching
- **PostgreSQL** - Relational database for portfolio data
- **Redis** - In-memory cache for performance optimization
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Nginx** - Reverse proxy and load balancing
- **PM2** - Process management (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for containerized deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-stock-analyzer-1.0
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit environment files
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Check service status**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Using Deployment Script

```bash
# Make script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## 📁 Project Structure

```
dynamic-stock-analyzer-1.0/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── dashboard/   # Real-time dashboard
│   │   │   ├── tracker/     # Stock tracker with algorithms
│   │   │   ├── compare/     # Stock comparison tool
│   │   │   ├── portfolio/   # Portfolio management
│   │   │   └── login/       # Authentication
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # Utility functions
│   ├── Dockerfile           # Frontend container config
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth.ts      # Authentication routes
│   │   │   ├── stocks.ts    # Stock data routes
│   │   │   ├── portfolio.ts # Portfolio management
│   │   │   ├── algorithms.ts # Algorithm analysis
│   │   │   └── compare.ts   # Stock comparison
│   │   ├── services/        # Business logic services
│   │   ├── middleware/      # Express middleware
│   │   └── algorithms/      # Algorithm implementations
│   ├── Dockerfile           # Backend container config
│   └── package.json
├── docker-compose.yml       # Multi-service orchestration
├── nginx.conf              # Reverse proxy configuration
├── deploy.sh               # Deployment automation script
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Stock Data
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/search` - Search stocks
- `GET /api/stocks/market-indices` - Get market indices
- `GET /api/stocks/live/:symbol` - Live stock data

### Portfolio Management
- `GET /api/portfolio` - Get user portfolios
- `POST /api/portfolio` - Create portfolio
- `PUT /api/portfolio/:id` - Update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio
- `POST /api/portfolio/:id/stocks` - Add stock to portfolio

### Algorithm Analysis
- `POST /api/algorithms/analyze` - Run stock algorithms
- `POST /api/algorithms/stock-span` - Stock span calculation
- `POST /api/algorithms/range-query` - Range query analysis
- `POST /api/algorithms/sliding-window` - Sliding window analysis

### Stock Comparison
- `POST /api/compare/stocks` - Compare multiple stocks
- `GET /api/compare/sectors` - Sector-wise comparison

## 🔒 Security Features

- **JWT Authentication** - Stateless token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Express-validator for all inputs
- **CORS Configuration** - Properly configured cross-origin requests
- **Helmet Security** - Security headers middleware
- **Rate Limiting** - API rate limiting to prevent abuse

## 🚀 Performance Optimizations

- **Redis Caching** - Intelligent caching for API responses
- **Database Indexing** - Optimized queries for portfolio data
- **Code Splitting** - Next.js automatic code splitting
- **Image Optimization** - Next.js image optimization
- **Compression** - Gzip compression for responses

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## 🔮 Future Enhancements

### Planned Features
- **WebAssembly Compilation** - Compile C algorithms to WASM for better performance
- **Real-time Notifications** - Push notifications for price alerts
- **Advanced Charting** - TradingView integration for professional charts
- **AI Predictions** - Machine learning for price predictions
- **Mobile App** - React Native mobile application
- **Multi-language Support** - Internationalization

### Algorithm Enhancements
- **Pattern Recognition** - Candlestick pattern detection
- **Sentiment Analysis** - News and social media sentiment
- **Risk Assessment** - Portfolio risk analysis tools
- **Backtesting** - Historical strategy testing

## 📊 Algorithm Details

### Stock Span Algorithm
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)
- **Use Case**: Find consecutive days where price ≤ current price

### Range Query (Segment Tree)
- **Time Complexity**: O(log n) for queries, O(n) for construction
- **Space Complexity**: O(n)
- **Use Case**: Find min/max price in date ranges

### Sliding Window Analysis
- **Time Complexity**: O(n)
- **Space Complexity**: O(1) for fixed window size
- **Use Case**: Moving averages and volatility calculation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alpha Vantage** - Financial data API
- **shadcn/ui** - Beautiful UI components
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@stockanalyzer.dev
- Documentation: [Link to docs]

---

**Built with ❤️ for serious investors who demand performance and accuracy.**
