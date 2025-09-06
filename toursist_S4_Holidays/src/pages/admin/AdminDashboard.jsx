import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button,
  Chip,
} from "@mui/material";
import { 
  TrendingUp, 
  Home, 
  Flight, 
  Church, 
  Group, 
  ArrowForward 
} from "@mui/icons-material";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Modern Stat Card Component
function ModernStatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
      transition: 'all 0.3s ease',
      height: '100%',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(31, 38, 135, 0.2)',
      }
    }}>
      <CardContent sx={{ padding: '24px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            background: `linear-gradient(45deg, ${color}, ${color}90)`,
            borderRadius: '16px',
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
                color: '#1f2937',
                marginBottom: '4px',
                fontSize: '2.5rem'
              }}
            >
              {value}
            </Typography>
            <Typography 
              sx={{ 
                color: '#6b7280', 
                fontSize: '1rem',
                fontWeight: 500 
              }}
            >
              {label}
            </Typography>
            {trend && (
              <Chip 
                icon={<TrendingUp sx={{ fontSize: '14px !important' }} />}
                label={trend}
                size="small"
                sx={{
                  marginTop: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Category Card Component
function CategoryCard({ icon: Icon, title, count, color }) {
  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(31, 38, 135, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(31, 38, 135, 0.2)',
      }
    }}>
      <CardContent sx={{ padding: '20px !important', textAlign: 'center' }}>
        <Box sx={{
          background: `linear-gradient(45deg, ${color}, ${color}90)`,
          borderRadius: '12px',
          padding: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginBottom: '12px'
        }}>
          <Icon sx={{ fontSize: '24px' }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#1f2937',
            marginBottom: '4px'
          }}
        >
          {title}
        </Typography>
        <Typography 
          sx={{ 
            color: '#6b7280', 
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      // Load stats
      const statsResponse = await fetch(`${API_URL}/packages/stats`, { 
        headers: { Authorization: "Bearer " + token }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData || { domestic:0, international:0, pilgrimage:0, group:0, total:0 });
      }

      // Load timeline data for chart
      const timelineResponse = await fetch(`${API_URL}/packages/timeline?t=${Date.now()}`);
      
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

  useEffect(() => {
    load();
  }, [location.search, refreshTrigger]);

  // Enhanced refresh system
  useEffect(() => {
    const checkForRefresh = () => {
      const refreshSignal = localStorage.getItem('dashboardRefresh');
      if (refreshSignal) {
        console.log('Dashboard refresh signal received');
        load();
        localStorage.removeItem('dashboardRefresh');
        setRefreshTrigger(prev => prev + 1);
      }
    };

    checkForRefresh();
    const refreshInterval = setInterval(checkForRefresh, 1000);

    const handleCustomRefresh = () => {
      console.log('Custom refresh event received');
      load();
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('dashboardRefresh', handleCustomRefresh);
    window.addEventListener('focus', checkForRefresh);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('dashboardRefresh', handleCustomRefresh);
      window.removeEventListener('focus', checkForRefresh);
    };
  }, []);

  const categories = [
    { 
      icon: Home, 
      title: 'Domestic', 
      count: stats.domestic || 0, 
      color: '#10b981' 
    },
    { 
      icon: Flight, 
      title: 'International', 
      count: stats.international || 0, 
      color: '#3b82f6' 
    },
    { 
      icon: Church, 
      title: 'Pilgrimage', 
      count: stats.pilgrimage || 0, 
      color: '#f59e0b' 
    },
    { 
      icon: Group, 
      title: 'Group Trip', 
      count: stats.group || 0, 
      color: '#8b5cf6' 
    }
  ];

  return (
    <Box sx={{ padding: '0' }}>
      {/* Welcome Header */}
      <Box sx={{ marginBottom: '32px' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '8px'
          }}
        >
          Dashboard
        </Typography>
        <Typography 
          sx={{ 
            color: '#6b7280',
            fontSize: '1.1rem'
          }}
        >
          Welcome! Quick overview of all packages.
        </Typography>
      </Box>

      {/* Main Stats */}
      <Box sx={{ marginBottom: '32px' }}>
        <ModernStatCard 
          icon={TrendingUp}
          label="Total Packages"
          value={stats.total || 0}
          color="#667eea"
          trend="+12%"
        />
      </Box>

      {/* Package Categories */}
      <Box sx={{ marginBottom: '32px' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '20px'
          }}
        >
          Package Categories
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CategoryCard {...category} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Beautiful Chart Section - YOUR GRAPH IS HERE! */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '25px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
        }
      }}>
        <CardContent sx={{ padding: '35px !important' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: '1.6rem !important',
              fontWeight: '700 !important',
              color: '#1f2937 !important',
              marginBottom: '5px !important',
            }}
          >
            Package Growth Timeline ({chartData.length} data points)
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280 !important',
              fontSize: '1rem !important',
              marginBottom: '25px !important',
              lineHeight: 1.5,
            }}
          >
            Shows your total package count over time - updates immediately when you add packages!
          </Typography>
          
          <Box 
            sx={{ 
              height: 300,
              borderRadius: '15px',
              background: 'rgba(102, 126, 234, 0.02)',
              padding: '15px',
            }}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer 
                width="100%" 
                height="100%"
                key={`chart_${refreshTrigger}_${chartData.length}`}
              >
                <AreaChart 
                  data={chartData} 
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="modernGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#764ba2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f093fb" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Total Packages']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '10px',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <Area 
                    type="monotone" 
                    dataKey="packages" 
                    stroke="#667eea"
                    strokeWidth={3}
                    fill="url(#modernGradient)"
                    animationDuration={1000}
                    key={`line_${refreshTrigger}`}
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
                  color: '#9ca3af',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                }}
              >
                <Typography sx={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.5 }}>
                  📊
                </Typography>
                <Typography>
                  {loading ? 'Loading timeline data...' : 'No packages found - add your first package to see the chart!'}
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
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
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
                color: '#1f2937'
              }}
            >
              Recent Packages
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
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
              color: '#6b7280'
            }}>
              <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                No packages yet
              </Typography>
              <Typography sx={{ marginBottom: '20px' }}>
                Create your first package to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowForward />}
                onClick={() => navigate('/admin/add')}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '12px 24px',
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
