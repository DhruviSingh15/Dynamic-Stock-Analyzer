'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Plus, X, BarChart3, Activity } from 'lucide-react';

interface StockData {
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

interface ComparisonData {
  stocks: StockData[];
  correlations: Array<{
    stock1: string;
    stock2: string;
    correlation: number;
    strength: string;
  }>;
  historicalData: Record<string, number[]>;
  summary: {
    count: number;
    averagePrice: number;
    averageChange: number;
    averageVolume: number;
    period: number;
  };
}

export default function StockComparison() {
  const [symbols, setSymbols] = useState<string[]>(['TCS.NS', 'INFY.BSE']);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comparison data
  const fetchComparison = async () => {
    if (symbols.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/compare/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbols,
          period: 30
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComparisonData(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError('Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  // Add symbol to comparison
  const addSymbol = () => {
    if (currentSymbol.trim() && !symbols.includes(currentSymbol.trim().toUpperCase()) && symbols.length < 5) {
      setSymbols([...symbols, currentSymbol.trim().toUpperCase()]);
      setCurrentSymbol('');
    }
  };

  // Remove symbol from comparison
  const removeSymbol = (symbolToRemove: string) => {
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
  };

  // Auto-fetch when symbols change
  useEffect(() => {
    if (symbols.length >= 2) {
      fetchComparison();
    }
  }, [symbols]);

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

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return 'text-green-600';
    if (abs > 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCorrelationStrength = (strength: string) => {
    switch (strength) {
      case 'strong': return 'Strong';
      case 'moderate': return 'Moderate';
      default: return 'Weak';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Comparison</h1>
          <p className="text-gray-600">Compare multiple stocks with correlation analysis</p>
        </div>

        {/* Symbol Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Select Stocks for Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Enter stock symbol (e.g., TCS.NS)"
                value={currentSymbol}
                onChange={(e) => setCurrentSymbol(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSymbol()}
              />
              <Button onClick={addSymbol} disabled={!currentSymbol.trim() || symbols.length >= 5}>
                <Plus className="h-4 w-4 mr-2" />
                Add ({symbols.length}/5)
              </Button>
            </div>

            {/* Selected Symbols */}
            <div className="flex flex-wrap gap-2">
              {symbols.map((symbol) => (
                <Badge key={symbol} variant="secondary" className="flex items-center gap-2">
                  {symbol}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeSymbol(symbol)}
                  />
                </Badge>
              ))}
            </div>

            {symbols.length < 2 && (
              <p className="text-sm text-gray-600 mt-2">
                Add at least 2 stocks to enable comparison
              </p>
            )}
          </CardContent>
        </Card>

        {loading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Analyzing stock correlations...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {comparisonData && (
          <>
            {/* Summary Statistics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {comparisonData.summary.count}
                    </div>
                    <div className="text-sm text-gray-600">Stocks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(comparisonData.summary.averagePrice)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Price</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      comparisonData.summary.averageChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {comparisonData.summary.averageChange >= 0 ? '+' : ''}
                      {comparisonData.summary.averageChange.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Change</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(comparisonData.summary.averageVolume)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Volume</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Comparison Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Stock Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Symbol</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Change</th>
                        <th className="text-right p-4">Volume</th>
                        <th className="text-center p-4">Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.stocks.map((stock) => (
                        <tr key={stock.symbol} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{stock.symbol}</td>
                          <td className="p-4 text-right font-mono">
                            {formatCurrency(stock.price)}
                          </td>
                          <td className={`p-4 text-right font-mono ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}
                            {formatCurrency(stock.change)} ({stock.changePercent.toFixed(2)}%)
                          </td>
                          <td className="p-4 text-right font-mono">
                            {formatNumber(stock.volume)}
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">{stock.sector}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Correlation Analysis */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Correlation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Correlation measures how closely stock prices move together. Higher values indicate stronger relationships.
                  </p>
                </div>

                {comparisonData.correlations.length > 0 ? (
                  <div className="space-y-4">
                    {comparisonData.correlations.map((corr, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-medium">{corr.stock1}</div>
                            <div className="text-sm text-gray-600">vs</div>
                            <div className="font-medium">{corr.stock2}</div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className={`text-lg font-bold ${getCorrelationColor(corr.correlation)}`}>
                            {corr.correlation.toFixed(3)}
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {getCorrelationStrength(corr.strength)}
                          </Badge>
                        </div>

                        <div className="w-32">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                Math.abs(corr.correlation) > 0.7 ? 'bg-green-500' :
                                Math.abs(corr.correlation) > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No correlation data available</p>
                    <p className="text-sm">Add more stocks to see correlation analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Add Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Popular Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'HDFCBANK.NS',
                    'ICICIBANK.NS',
                    'RELIANCE.NS',
                    'LT.NS',
                    'AXISBANK.NS',
                    'MARUTI.NS',
                    'SUNPHARMA.NS',
                    'BHARTIARTL.NS'
                  ].filter(symbol => !symbols.includes(symbol)).slice(0, 8).map((symbol) => (
                    <Button
                      key={symbol}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentSymbol(symbol)}
                      className="justify-start"
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {symbols.length < 2 && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Stocks to Compare</h3>
              <p className="text-gray-600">
                Add at least 2 stocks above to view comparison analysis and correlation data
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
