'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, Shield, Zap, Database, BarChart3 } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Real-Time Dashboard',
      description: 'Live market data with instant updates for NIFTY, SENSEX, and your watchlist stocks.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Stock Analytics',
      description: 'Advanced C algorithms for stock span, range queries, and sliding window analysis.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Portfolio Management',
      description: 'Track your investments with live P&L calculations and sector-wise allocation.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'High Performance',
      description: 'WebAssembly-powered algorithms for real-time computation and analysis.'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Redis Caching',
      description: 'Optimized data storage and retrieval with intelligent caching strategies.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Reliable',
      description: 'JWT authentication with encrypted API key storage and rate limiting.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-saffron-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-saffron-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">StockAnalyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-saffron-300 text-saffron-700 hover:bg-saffron-50">Dashboard</Button>
              </Link>
              <Link href="/tracker">
                <Button variant="outline" className="border-saffron-300 text-saffron-700 hover:bg-saffron-50">Stock Tracker</Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" className="border-saffron-300 text-saffron-700 hover:bg-saffron-50">Compare</Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="border-saffron-300 text-saffron-700 hover:bg-saffron-50">Portfolio</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-saffron-600 hover:bg-saffron-700">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Real-Time Stock Market
            <span className="text-saffron-600 block">Analytics Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced stock analysis with live data, C-powered algorithms, and comprehensive portfolio management.
            Built for serious investors who demand performance and accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 bg-saffron-600 hover:bg-saffron-700">Launch Dashboard</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="text-lg px-8 border-saffron-300 text-saffron-700 hover:bg-saffron-50">Create Account</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart Investing
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to make informed investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-saffron-600">
                    {feature.icon}
                    <span className="ml-3">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h3>
            <p className="text-gray-600">
              High-performance stack designed for real-time financial data processing
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Next.js', color: 'bg-black text-white' },
              { name: 'TypeScript', color: 'bg-saffron-600 text-white' },
              { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
              { name: 'Node.js', color: 'bg-green-600 text-white' },
              { name: 'Redis', color: 'bg-red-600 text-white' },
              { name: 'PostgreSQL', color: 'bg-blue-800 text-white' },
              { name: 'WebAssembly', color: 'bg-purple-600 text-white' },
              { name: 'Socket.io', color: 'bg-gray-800 text-white' },
              { name: 'Alpha Vantage', color: 'bg-orange-500 text-white' },
              { name: 'shadcn/ui', color: 'bg-slate-600 text-white' }
            ].map((tech, index) => (
              <div key={index} className={`p-3 rounded-lg text-center ${tech.color}`}>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-saffron-gradient rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h3>
            <p className="text-saffron-100 mb-6">
              Join thousands of investors who trust our platform for real-time market insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-saffron-600 hover:bg-saffron-50">View Dashboard</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-saffron-600">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-saffron-400 mr-2" />
                <span className="text-xl font-bold">StockAnalyzer</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced real-time stock market analysis platform with high-performance algorithms
                and comprehensive portfolio management tools.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="bg-saffron-100 text-saffron-800">Real-Time Data</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">C Algorithms</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">WebAssembly</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Real-Time Dashboard</li>
                <li>Stock Analytics</li>
                <li>Portfolio Management</li>
                <li>Market Comparison</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StockAnalyzer. Built with Next.js, TypeScript, and modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
