import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button,
} from "@mui/material";
import { 
  TrendingUp, 
  Home, 
  Flight, 
  Group, 
  ArrowForward,
  Church
} from "@mui/icons-material";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Clean Static Stat Card Component
function CleanStatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="static-hover" sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      height: '100%',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981)',
        borderRadius: '16px 16px 0 0',
      }
    }}>
      <CardContent sx={{ padding: '24px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            background: color,
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Icon sx={{ fontSize: '24px' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: '#0f172a',
                marginBottom: '8px',
                fontSize: '3rem',
                lineHeight: 1
              }}
            >
              {value}
            </Typography>
            <Typography 
              sx={{ 
                color: '#64748b', 
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Clean Category Card Component
function CleanCategoryCard({ icon: Icon, title, count, theme }) {
  return (
    <Card className="static-hover" sx={{
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      textAlign: 'center',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.98)',
      }
    }}>
      <CardContent sx={{ padding: '20px !important' }}>
        <Box sx={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          background: theme,
          color: 'white'
        }}>
          <Icon sx={{ fontSize: '24px' }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#0f172a',
            marginBottom: '4px'
          }}
        >
          {title}
        </Typography>
        <Typography 
          sx={{ 
            color: '#64748b', 
            fontSize: '0.9rem' 
          }}
        >
          {count} packages
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ domestic:0, international:0, pilgrimage:0, group:0, total:0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED: Load dashboard data with cache prevention
  const load = async () => {
    try {
      setLoading(true);
      
      // Load stats with cache prevention
      const statsResponse = await fetch(`${API_URL}/packages/stats?_=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData || { domestic:0, international:0, pilgrimage:0, group:0, total:0 });
        console.log('Dashboard stats loaded:', statsData);
      }

      // Load timeline data for chart
      const timelineResponse = await fetch(`${API_URL}/packages/timeline?_=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (timelineResponse.ok) {
        const timelineData = await timelineResponse.json();
        console.log('Timeline data loaded:', timelineData);
        
        const validData = Array.isArray(timelineData) ? timelineData : [];
        setChartData(validData);
      } else {
        console.error('Failed to load timeline data:', timelineResponse.status);
        setChartData([]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({ domestic:0, international:0, pilgrimage:0, group:0, total:0 });
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load();
  }, [location.search]);

  // Enhanced refresh system - Check every second
  useEffect(() => {
    const checkForRefresh = () => {
      const refreshSignal = localStorage.getItem('dashboardRefresh');
      if (refreshSignal) {
        console.log('Dashboard refresh signal received');
        load();
        localStorage.removeItem('dashboardRefresh');
      }
    };

    checkForRefresh();
    const refreshInterval = setInterval(checkForRefresh, 1000);

    const handleCustomRefresh = () => {
      console.log('Custom refresh event received');
      load();
    };

    const handleFocus = () => {
      console.log('Window focused - reloading dashboard');
      load();
    };

    window.addEventListener('dashboardRefresh', handleCustomRefresh);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('dashboardRefresh', handleCustomRefresh);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Travel categories with themes
  const categories = [
    { 
      icon: Home, 
      title: 'Domestic', 
      count: stats.domestic || 0, 
      theme: 'linear-gradient(45deg, #10b981, #059669)' 
    },
    { 
      icon: Flight, 
      title: 'International', 
      count: stats.international || 0, 
      theme: 'linear-gradient(45deg, #3b82f6, #2563eb)' 
    },
    { 
      icon: Church, 
      title: 'Pilgrimage', 
      count: stats.pilgrimage || 0, 
      theme: 'linear-gradient(45deg, #f59e0b, #d97706)' 
    },
    { 
      icon: Group, 
      title: 'Group Trip', 
      count: stats.group || 0, 
      theme: 'linear-gradient(45deg, #8b5cf6, #7c3aed)' 
    }
  ];

  return (
    <Box sx={{ padding: '0', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        marginBottom: '28px'
      }}>
        <CardContent sx={{ padding: '24px !important' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              fontSize: '2rem'
            }}
          >
            🏖️ Travel Dashboard
          </Typography>
          <Typography 
            sx={{ 
              color: '#64748b',
              fontSize: '1.1rem',
              fontWeight: 400
            }}
          >
            Welcome to S4 Holidays Admin! Quick overview of all travel packages.
          </Typography>
        </CardContent>
      </Card>

      {/* Main Stats */}
      <Box sx={{ marginBottom: '32px' }}>
        <CleanStatCard 
          icon={TrendingUp}
          label="Total Travel Packages"
          value={stats.total || 0}
          color="linear-gradient(45deg, #0ea5e9, #06b6d4)"
        />
      </Box>

      {/* Package Categories */}
      <Box sx={{ marginBottom: '32px' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '20px'
          }}
        >
          📦 Package Categories
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CleanCategoryCard {...category} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Clean Chart Section */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '32px',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6, #06b6d4)',
          borderRadius: '20px 20px 0 0',
        }
      }}>
        <CardContent sx={{ padding: '32px !important' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
            }}
          >
            📈 Package Growth Timeline ({chartData.length} data points)
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontSize: '0.95rem',
              marginBottom: '24px',
              lineHeight: 1.5,
            }}
          >
            Track your travel package growth over time - updates when you add new packages!
          </Typography>
          
          <Box 
            sx={{ 
              height: 300,
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.02)',
              padding: '12px',
            }}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="travelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Total Packages']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '10px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <Area 
                    type="monotone" 
                    dataKey="packages" 
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="url(#travelGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: '500',
                }}
              >
                <Typography sx={{ fontSize: '3.5rem', marginBottom: '12px', opacity: 0.6 }}>
                  ✈️
                </Typography>
                <Typography>
                  {loading ? 'Loading travel data...' : 'No packages yet - add your first travel package!'}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Packages Section */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <CardContent sx={{ padding: '32px !important' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              🎒 Recent Packages
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: '#3b82f6',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.1)',
                }
              }}
              onClick={() => navigate('/admin/packages')}
            >
              View All
            </Button>
          </Box>

          {/* Empty State */}
          {stats.total === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#64748b'
            }}>
              <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                🌍 No travel packages yet
              </Typography>
              <Typography sx={{ marginBottom: '20px' }}>
                Create your first amazing travel package to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowForward />}
                onClick={() => navigate('/admin/add')}
                sx={{
                  background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '12px 24px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0284c7, #0891b2)',
                  }
                }}
              >
                Add First Package
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
