'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Plus, Edit, Trash2, DollarSign, PieChart, Target, LogIn } from 'lucide-react';

interface PortfolioStock {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector: string;
  lastUpdated: string;
}

interface Portfolio {
  id: string;
  userId: string;
  name: string;
  stocks: PortfolioStock[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdated: string;
}

export default function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddStock, setShowAddStock] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    quantity: '',
    buyPrice: ''
  });
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPortfolios();
  }, [router]);

  // Fetch portfolios
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setPortfolios(data.data);
        if (data.data.length > 0 && !selectedPortfolio) {
          setSelectedPortfolio(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new portfolio
  const createPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5001/api/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Portfolio ${portfolios.length + 1}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  // Add stock to portfolio
  const addStock = async () => {
    if (!selectedPortfolio || !newStock.symbol || !newStock.quantity || !newStock.buyPrice) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/portfolio/${selectedPortfolio.id}/stocks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symbol: newStock.symbol.toUpperCase(),
          quantity: parseFloat(newStock.quantity),
          buyPrice: parseFloat(newStock.buyPrice)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddStock(false);
        setNewStock({ symbol: '', quantity: '', buyPrice: '' });
        fetchPortfolios();
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  // Remove stock from portfolio
  const removeStock = async (stockId: string) => {
    if (!selectedPortfolio) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`http://localhost:5001/api/portfolio/${selectedPortfolio.id}/stocks/${stockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      fetchPortfolios();
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = (portfolio: Portfolio) => {
    const totalInvested = portfolio.stocks.reduce((sum, stock) => sum + (stock.quantity * stock.buyPrice), 0);
    const totalCurrent = portfolio.stocks.reduce((sum, stock) => sum + (stock.quantity * stock.currentPrice), 0);
    const totalGainLoss = totalCurrent - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrent,
      totalGainLoss,
      totalGainLossPercent
    };
  };

  // Get sector allocation
  const getSectorAllocation = (portfolio: Portfolio) => {
    const sectorData: Record<string, { value: number; percentage: number }> = {};

    portfolio.stocks.forEach(stock => {
      const value = stock.quantity * stock.currentPrice;
      if (sectorData[stock.sector]) {
        sectorData[stock.sector].value += value;
      } else {
        sectorData[stock.sector] = { value, percentage: 0 };
      }
    });

    const totalValue = Object.values(sectorData).reduce((sum, sector) => sum + sector.value, 0);

    Object.keys(sectorData).forEach(sector => {
      sectorData[sector].percentage = (sectorData[sector].value / totalValue) * 100;
    });

    return sectorData;
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
          <p className="text-gray-600">Track your investments with live P&L calculations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Portfolios
                  </span>
                  <Button size="sm" onClick={createPortfolio}>
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {portfolios.map((portfolio) => {
                    const metrics = calculatePortfolioMetrics(portfolio);
                    return (
                      <div
                        key={portfolio.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPortfolio?.id === portfolio.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPortfolio(portfolio)}
                      >
                        <div className="font-medium">{portfolio.name}</div>
                        <div className="text-sm text-gray-600">
                          {portfolio.stocks.length} stocks • {formatCurrency(metrics.totalCurrent)}
                        </div>
                        <div className={`text-sm ${metrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metrics.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(metrics.totalGainLoss)}
                          ({metrics.totalGainLossPercent >= 0 ? '+' : ''}{metrics.totalGainLossPercent.toFixed(2)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Details */}
          <div className="lg:col-span-2">
            {selectedPortfolio ? (
              <>
                {/* Portfolio Summary */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedPortfolio.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddStock(!showAddStock)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stock
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showAddStock && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3">Add New Stock</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Symbol (e.g., TCS.NS)"
                            value={newStock.symbol}
                            onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                          />
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={newStock.quantity}
                            onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Buy Price"
                            value={newStock.buyPrice}
                            onChange={(e) => setNewStock({...newStock, buyPrice: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={addStock}>Add Stock</Button>
                          <Button size="sm" variant="outline" onClick={() => setShowAddStock(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}

                    {(() => {
                      const metrics = calculatePortfolioMetrics(selectedPortfolio);
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(metrics.totalCurrent)}
                            </div>
                            <div className="text-sm text-gray-600">Current Value</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(metrics.totalInvested)}
                            </div>
                            <div className="text-sm text-gray-600">Total Invested</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${metrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(metrics.totalGainLoss)}
                            </div>
                            <div className="text-sm text-gray-600">P&L</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${metrics.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metrics.totalGainLossPercent >= 0 ? '+' : ''}{metrics.totalGainLossPercent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-gray-600">P&L %</div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Holdings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPortfolio.stocks.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPortfolio.stocks.map((stock) => {
                          const invested = stock.quantity * stock.buyPrice;
                          const current = stock.quantity * stock.currentPrice;
                          const gainLoss = current - invested;
                          const gainLossPercent = invested > 0 ? (gainLoss / invested) * 100 : 0;

                          return (
                            <div key={stock.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                                    <p className="text-sm text-gray-600">{stock.sector}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right space-y-1">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatCurrency(current)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {stock.quantity} × {formatCurrency(stock.currentPrice)}
                                </div>
                                <div className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                                  ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                                </div>
                              </div>

                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeStock(stock.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No stocks in this portfolio</p>
                        <p className="text-sm">Add stocks using the "Add Stock" button above</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sector Allocation */}
                {selectedPortfolio.stocks.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Sector Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(getSectorAllocation(selectedPortfolio)).map(([sector, data]) => (
                          <div key={sector} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{sector}</span>
                                <span>{data.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${data.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{formatCurrency(data.value)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Portfolio</h3>
                  <p className="text-gray-600">
                    Choose a portfolio from the list to view details and manage your holdings
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
