'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Search, Calculator, BarChart3, LineChart, Hash, Upload, FileText, Trash2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

export default function StockTracker() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [algorithmResults, setAlgorithmResults] = useState<AlgorithmResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('overview');
  const [rangeQueryParams, setRangeQueryParams] = useState({
    left: 0,
    right: 29 // Default to last 30 days
  });

  // New state for dataset upload
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Fetch stock data
  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/stocks/quote/${symbol}`);
      const data = await response.json();

      if (data.success) {
        setStockData(data.data);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload dataset
  const uploadDataset = async () => {
    if (!datasetFile) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('dataset', datasetFile);

      const response = await fetch('http://localhost:5001/api/algorithms/upload-dataset', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Refresh datasets list
        fetchDatasets();
        setDatasetFile(null);
        // Clear file input
        const fileInput = document.getElementById('dataset-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error uploading dataset:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  // Fetch uploaded datasets
  const fetchDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/algorithms/datasets');
      const data = await response.json();

      if (data.success) {
        setUploadedDatasets(data.data);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  // Delete dataset
  const deleteDataset = async (datasetId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/algorithms/datasets/${datasetId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchDatasets();
        if (selectedDataset === datasetId) {
          setSelectedDataset('');
          setAlgorithmResults(null);
        }
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  // Run algorithm analysis
  const runAlgorithmAnalysis = async () => {
    if (!selectedDataset) return;

    setAnalysisLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/algorithms/analyze-dataset/${selectedDataset}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operations: {
            stockSpan: true,
            rangeQuery: { left: rangeQueryParams.left, right: rangeQueryParams.right },
            slidingWindow: { windowSize: 5 },
            rsi: { period: 14 },
            macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAlgorithmResults(data);
      }
    } catch (error) {
      console.error('Error running algorithm analysis:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Auto-fetch data when symbol changes
  useEffect(() => {
    if (stockSymbol.trim()) {
      fetchStockData(stockSymbol.trim().toUpperCase());
    }
  }, [stockSymbol]);

  // Load datasets on component mount
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Run analysis when dataset is selected
  useEffect(() => {
    if (selectedDataset) {
      runAlgorithmAnalysis();
    }
  }, [selectedDataset]);

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

  // Chart data preparation
  const getStockSpanChartData = (): ChartData | null => {
    if (!algorithmResults?.data?.stockSpan) return null;

    const spans = algorithmResults.data.stockSpan;
    const labels = spans.map((_, index) => `Day ${index + 1}`);

    return {
      labels,
      datasets: [{
        label: 'Stock Span',
        data: spans,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };
  };

  const getSlidingWindowChartData = (): ChartData | null => {
    if (!algorithmResults?.data?.slidingWindow) return null;

    const { movingAverages, volatilities } = algorithmResults.data.slidingWindow;
    const labels = movingAverages.map((_, index) => `Day ${index + 1}`);

    return {
      labels,
      datasets: [
        {
          label: 'Moving Average',
          data: movingAverages,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        },
        {
          label: 'Volatility',
          data: volatilities,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  const getRSIChartData = (): ChartData | null => {
    if (!algorithmResults?.data?.rsi) return null;

    const rsi = algorithmResults.data.rsi;
    const labels = rsi.map((_, index) => `Day ${index + 1}`);

    return {
      labels,
      datasets: [{
        label: 'RSI',
        data: rsi,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.1
      }]
    };
  };

  const getMACDChartData = (): ChartData | null => {
    if (!algorithmResults?.data?.macd) return null;

    const { macdLine, signalLine, histogram } = algorithmResults.data.macd;
    const labels = macdLine.map((_, index) => `Day ${index + 1}`);

    return {
      labels,
      datasets: [
        {
          label: 'MACD Line',
          data: macdLine,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.2)',
          tension: 0.1
        },
        {
          label: 'Signal Line',
          data: signalLine,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Algorithm Analysis Results'
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Algorithm Analyzer</h1>
          <p className="text-gray-600">Upload datasets and analyze with advanced algorithms</p>
        </div>

        {/* Dataset Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Dataset Upload & Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center gap-4">
                <Input
                  id="dataset-upload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={(e) => setDatasetFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Button
                  onClick={uploadDataset}
                  disabled={!datasetFile || uploadLoading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>

              {/* Uploaded Datasets */}
              {uploadedDatasets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Uploaded Datasets:</h3>
                  <div className="grid gap-2">
                    {uploadedDatasets.map((dataset) => (
                      <div key={dataset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">Dataset {dataset.id}</div>
                            <div className="text-xs text-gray-500">
                              {dataset.length} data points • Sample: [{dataset.sample.join(', ')}]
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDataset(dataset.id)}
                            className={selectedDataset === dataset.id ? 'bg-blue-50' : ''}
                          >
                            Select
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDataset(dataset.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stock Search Section (Optional) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Stock Search (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Enter stock symbol (e.g., TCS.NS)"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => fetchStockData(stockSymbol.trim().toUpperCase())}
                disabled={loading || !stockSymbol.trim()}
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {stockData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {stockData.symbol}
                </span>
                <Badge variant={stockData.change >= 0 ? 'default' : 'destructive'}>
                  {stockData.change >= 0 ? '↗' : '↘'} {stockData.changePercent.toFixed(2)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stockData.price)}
                  </div>
                  <div className="text-sm text-gray-600">Current Price</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData.change >= 0 ? '+' : ''}{formatCurrency(stockData.change)}
                  </div>
                  <div className="text-sm text-gray-600">Change</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stockData.volume)}
                  </div>
                  <div className="text-sm text-gray-600">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stockData.sector}
                  </div>
                  <div className="text-sm text-gray-600">Sector</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedDataset && (
          <>
            {/* Algorithm Analysis Tabs */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Algorithm Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  {[
                    { key: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
                    { key: 'stockSpan', label: 'Stock Span', icon: <Activity className="h-4 w-4" /> },
                    { key: 'rangeQuery', label: 'Range Query', icon: <Hash className="h-4 w-4" /> },
                    { key: 'slidingWindow', label: 'Moving Average', icon: <LineChart className="h-4 w-4" /> },
                    { key: 'rsi', label: 'RSI', icon: <TrendingUp className="h-4 w-4" /> },
                    { key: 'macd', label: 'MACD', icon: <TrendingUp className="h-4 w-4" /> }
                  ].map((tab) => (
                    <Button
                      key={tab.key}
                      variant={selectedAnalysis === tab.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAnalysis(tab.key)}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      {tab.icon}
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {analysisLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Running algorithm analysis...</p>
                  </div>
                ) : algorithmResults?.success ? (
                  <div className="space-y-6">
                    {selectedAnalysis === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-lg font-semibold text-blue-900">
                            {uploadedDatasets.find(d => d.id === selectedDataset)?.length || 0}
                          </div>
                          <div className="text-sm text-blue-700">Data Points</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-lg font-semibold text-green-900">
                            {algorithmResults.data?.rangeQuery?.minPrice ?
                              formatCurrency(algorithmResults.data.rangeQuery.minPrice) : 'N/A'}
                          </div>
                          <div className="text-sm text-green-700">Min Price (Range)</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-lg font-semibold text-purple-900">
                            {algorithmResults.data?.slidingWindow?.movingAverages.length || 0}
                          </div>
                          <div className="text-sm text-purple-700">MA Points</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-lg font-semibold text-orange-900">
                            {algorithmResults.data?.rsi?.length ?
                              algorithmResults.data.rsi[algorithmResults.data.rsi.length - 1]?.toFixed(2) : 'N/A'}
                          </div>
                          <div className="text-sm text-orange-700">Latest RSI</div>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis === 'rangeQuery' && algorithmResults.data?.rangeQuery && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Range Query Analysis</h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Query minimum and maximum prices in a specific date range using Segment Tree algorithm.
                          </p>

                          {/* Range Query Controls */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Day</label>
                              <Input
                                type="number"
                                min="0"
                                max={uploadedDatasets.find(d => d.id === selectedDataset)?.length - 1 || 29}
                                value={rangeQueryParams.left}
                                onChange={(e) => setRangeQueryParams({...rangeQueryParams, left: parseInt(e.target.value) || 0})}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Day</label>
                              <Input
                                type="number"
                                min="0"
                                max={uploadedDatasets.find(d => d.id === selectedDataset)?.length - 1 || 29}
                                value={rangeQueryParams.right}
                                onChange={(e) => setRangeQueryParams({...rangeQueryParams, right: parseInt(e.target.value) || 29})}
                              />
                            </div>
                          </div>

                          <Button
                            onClick={runAlgorithmAnalysis}
                            className="mb-4"
                          >
                            Update Range Query
                          </Button>

                          {/* Range Query Results */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-lg font-semibold text-green-900">
                                {algorithmResults.data.rangeQuery.minPrice ?
                                  formatCurrency(algorithmResults.data.rangeQuery.minPrice) : 'N/A'}
                              </div>
                              <div className="text-sm text-green-700">Minimum Price</div>
                              <div className="text-xs text-green-600 mt-1">
                                Days {rangeQueryParams.left} - {rangeQueryParams.right}
                              </div>
                            </div>

                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-lg font-semibold text-blue-900">
                                {algorithmResults.data.rangeQuery.maxPrice ?
                                  formatCurrency(algorithmResults.data.rangeQuery.maxPrice) : 'N/A'}
                              </div>
                              <div className="text-sm text-blue-700">Maximum Price</div>
                              <div className="text-xs text-blue-600 mt-1">
                                Days {rangeQueryParams.left} - {rangeQueryParams.right}
                              </div>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-lg font-semibold text-purple-900">
                                {algorithmResults.data.rangeQuery.rangeSize ?
                                  algorithmResults.data.rangeQuery.rangeSize : rangeQueryParams.right - rangeQueryParams.left + 1}
                              </div>
                              <div className="text-sm text-purple-700">Range Size</div>
                              <div className="text-xs text-purple-600 mt-1">
                                Days in Range
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis === 'stockSpan' && algorithmResults.data?.stockSpan && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Stock Span Analysis</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-4">
                            Stock span shows how many consecutive days the price was less than or equal to today's price.
                          </p>
                          <div className="mb-6">
                            {getStockSpanChartData() && (
                              <div className="h-64">
                                <Line data={getStockSpanChartData()!} options={chartOptions} />
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                            {algorithmResults.data?.stockSpan?.slice(-20).map((span, index) => (
                              <div key={index} className="text-center">
                                <div className="text-xs text-gray-500">{(algorithmResults.data?.stockSpan?.length || 0) - 20 + index + 1}</div>
                                <div className="font-mono text-sm bg-white p-1 rounded">{span}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis === 'slidingWindow' && algorithmResults.data?.slidingWindow && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Moving Average & Volatility</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Moving Averages (Window: 5)</h4>
                            <div className="h-64 mb-4">
                              {getSlidingWindowChartData() && (
                                <Line data={getSlidingWindowChartData()!} options={chartOptions} />
                              )}
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {algorithmResults.data?.slidingWindow?.movingAverages.slice(-10).map((ma, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>Day {(algorithmResults.data?.slidingWindow?.movingAverages?.length || 0) - 10 + index + 1}:</span>
                                  <span className="font-mono">{ma.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Volatility (Window: 5)</h4>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {algorithmResults.data?.slidingWindow?.volatilities.slice(-10).map((vol, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>Day {(algorithmResults.data?.slidingWindow?.volatilities?.length || 0) - 10 + index + 1}:</span>
                                  <span className="font-mono">{vol.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis === 'rsi' && algorithmResults.data?.rsi && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">RSI (Relative Strength Index)</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-4">
                            RSI measures the speed and magnitude of price changes. Values above 70 indicate overbought conditions, below 30 indicate oversold.
                          </p>
                          <div className="h-64 mb-4">
                            {getRSIChartData() && (
                              <Line data={getRSIChartData()!} options={chartOptions} />
                            )}
                          </div>
                          <div className="space-y-2">
                            {algorithmResults.data?.rsi?.slice(-10).map((rsi, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <span className="w-16 text-sm">Day {(algorithmResults.data?.rsi?.length || 0) - 10 + index + 1}:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      rsi > 70 ? 'bg-red-500' :
                                      rsi < 30 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min(rsi, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="font-mono text-sm w-12">{rsi.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis === 'macd' && algorithmResults.data?.macd && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">MACD (Moving Average Convergence Divergence)</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-4">
                            MACD shows the relationship between two moving averages of a stock's price.
                          </p>
                          <div className="h-64 mb-4">
                            {getMACDChartData() && (
                              <Line data={getMACDChartData()!} options={chartOptions} />
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">MACD Line</h4>
                              <div className="flex gap-2 overflow-x-auto">
                                {algorithmResults.data?.macd?.macdLine.slice(-15).map((value, index) => (
                                  <div key={index} className="text-center min-w-[60px]">
                                    <div className="text-xs text-gray-500">{(algorithmResults.data?.macd?.macdLine?.length || 0) - 15 + index + 1}</div>
                                    <div className={`font-mono text-sm p-1 rounded ${value >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                      {value.toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Failed to load algorithm analysis</p>
                    <p className="text-sm">{algorithmResults?.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!selectedDataset && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload a Dataset</h3>
              <p className="text-gray-600">
                Upload a CSV or text file containing price data to start algorithm analysis
              </p>
            </CardContent>
}