'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful:', data);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Login failed:', data);
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-saffron-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">StockAnalyzer</span>
          </div>
          <p className="text-gray-600">Real-time stock market analysis platform</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Email: demo@example.com</div>
                <div>Password: password123</div>
              </div>
            </div>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-saffron-600 hover:text-saffron-800 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Badge className="mb-2">Real-Time</Badge>
            <p className="text-sm text-gray-600">Live market data updates</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Badge className="mb-2">Advanced</Badge>
            <p className="text-sm text-gray-600">C algorithm analysis</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Badge className="mb-2">Portfolio</Badge>
            <p className="text-sm text-gray-600">Track investments</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Badge className="mb-2">Secure</Badge>
            <p className="text-sm text-gray-600">JWT authentication</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
