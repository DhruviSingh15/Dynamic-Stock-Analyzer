'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Activity, DollarSign, Search } from 'lucide-react';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high52Week: number;
  low52Week: number;
  marketCap: number;
  sector: string;
}

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<Record<string, MarketIndex>>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch market indices
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/stocks/market-indices');
        const data = await response.json();
        if (data.success) {
          setIndices(data.data);
        }
      } catch (error) {
        console.error('Error fetching market indices:', error);
      }
    };

    fetchIndices();
  }, []);

  // Fetch watchlist stocks
  useEffect(() => {
    const fetchWatchlistStocks = async () => {
      if (watchlist.length === 0) {
        // Mock watchlist for demo
        setWatchlist(['TCS.NS', 'INFY.BSE', 'HDFCBANK.NS']);
        return;
      }

      try {
        const promises = watchlist.map(symbol =>
          fetch(`http://localhost:5001/api/stocks/quote/${symbol}`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);
        const stockData = results
          .filter(result => result.success)
          .map(result => result.data);

        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching watchlist stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistStocks();
  }, [watchlist]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (watchlist.length > 0) {
        watchlist.forEach(symbol => {
          fetch(`http://localhost:5001/api/stocks/quote/${symbol}`)
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setStocks(prev => prev.map(stock =>
                  stock.symbol === symbol ? data.data : stock
                ));
              }
            })
            .catch(error => console.error('Error refreshing stock data:', error));
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [watchlist]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Market Dashboard</h1>
          <p className="text-gray-600">Real-time market data and portfolio tracking</p>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(indices).map(([key, index]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  {index.name}
                  <Activity className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatNumber(index.price)}
                </div>
                <div className={`flex items-center text-sm ${
                  index.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {index.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-medium">
                    {index.change >= 0 ? '+' : ''}
                    {formatNumber(index.change)} ({index.changePercent >= 0 ? '+' : ''}
                    {index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist Stocks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Watchlist Stocks
                  </span>
                  <Badge variant="secondary">{watchlist.length} stocks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                            <p className="text-sm text-gray-600">{stock.sector}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-2xl font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                        </div>
                        <div className={`flex items-center text-sm ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span>
                            {stock.change >= 0 ? '+' : ''}
                            {formatCurrency(stock.change)} ({stock.changePercent >= 0 ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromWatchlist(stock.symbol)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  {stocks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No stocks in watchlist</p>
                      <p className="text-sm">Add stocks using the search below</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add Stocks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Add to Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Search stock symbol (e.g., TCS.NS)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      addToWatchlist(searchTerm.trim().toUpperCase());
                      setSearchTerm('');
                    }
                  }}
                >
                  Add Stock
                </Button>

                {/* Quick Add Buttons */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Quick Add:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['TCS.NS', 'INFY.BSE', 'HDFCBANK.NS', 'RELIANCE.NS'].map((symbol) => (
                      <Button
                        key={symbol}
                        variant="outline"
                        size="sm"
                        onClick={() => addToWatchlist(symbol)}
                        disabled={watchlist.includes(symbol)}
                      >
                        {symbol}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stocks.filter(s => s.change >= 0).length}
                </div>
                <div className="text-sm text-gray-600">Gainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stocks.filter(s => s.change < 0).length}
                </div>
                <div className="text-sm text-gray-600">Losers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stocks.reduce((sum, s) => sum + s.price * 1000, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Market Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
