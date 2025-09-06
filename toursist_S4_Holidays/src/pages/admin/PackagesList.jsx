import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Avatar,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  MoreVert,
  Add,
  FilterList,
  Home,
  Flight,
  Church,
  Group,
  AttachMoney,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Beautiful Package Card Component
function PackageCard({ package: pkg, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'domestic': return <Home sx={{ fontSize: '20px' }} />;
      case 'international': return <Flight sx={{ fontSize: '20px' }} />;
      case 'pilgrimage': return <Church sx={{ fontSize: '20px' }} />;
      case 'group': return <Group sx={{ fontSize: '20px' }} />;
      default: return <Home sx={{ fontSize: '20px' }} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'domestic': return '#10b981';
      case 'international': return '#3b82f6';
      case 'pilgrimage': return '#f59e0b';
      case 'group': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        transition: 'all 0.3s ease',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(31, 38, 135, 0.25)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${getCategoryColor(pkg.category)}, ${getCategoryColor(pkg.category)}90)`,
        }
      }}
    >
      <CardContent sx={{ padding: '24px !important', height: '100%' }}>
        {/* Header with Menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(45deg, ${getCategoryColor(pkg.category)}, ${getCategoryColor(pkg.category)}90)`,
                width: 48,
                height: 48,
              }}
            >
              {getCategoryIcon(pkg.category)}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                  fontSize: '1.1rem',
                  marginBottom: '4px'
                }}
              >
                {pkg.title}
              </Typography>
              <Chip
                label={pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                size="small"
                sx={{
                  background: `linear-gradient(45deg, ${getCategoryColor(pkg.category)}20, ${getCategoryColor(pkg.category)}10)`,
                  color: getCategoryColor(pkg.category),
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: `1px solid ${getCategoryColor(pkg.category)}30`
                }}
              />
            </Box>
          </Box>

          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              background: 'rgba(107, 114, 128, 0.1)',
              '&:hover': { background: 'rgba(107, 114, 128, 0.2)' }
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { onEdit(pkg._id); handleMenuClose(); }}>
              <Edit sx={{ marginRight: 1, fontSize: '18px' }} />
              Edit Package
            </MenuItem>
            <MenuItem onClick={() => { onDelete(pkg._id); handleMenuClose(); }} sx={{ color: '#ef4444' }}>
              <Delete sx={{ marginRight: 1, fontSize: '18px' }} />
              Delete Package
            </MenuItem>
          </Menu>
        </Box>

        {/* Package Details */}
        <Box sx={{ marginBottom: '20px' }}>
          {pkg.duration && (
            <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
              📅 {pkg.duration}
            </Typography>
          )}
          
          {/* Price Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '12px' }}>
            <AttachMoney sx={{ color: getCategoryColor(pkg.category), fontSize: '20px' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: getCategoryColor(pkg.category),
                fontSize: '1.2rem'
              }}
            >
              {pkg.pricingMode === 'Structured' 
                ? `${pkg.currency} ${pkg.pricePerPerson?.toLocaleString() || 'N/A'}`
                : pkg.priceText || 'Contact for Price'
              }
            </Typography>
            {pkg.pricingMode === 'Structured' && (
              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                per person
              </Typography>
            )}
          </Box>

          {pkg.priceNote && (
            <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic' }}>
              {pkg.priceNote}
            </Typography>
          )}
        </Box>

        {/* Package Stats */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 'auto' }}>
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <Chip
              label={`${pkg.itinerary.length} Days`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <Chip
              label={`${pkg.inclusions.length} Inclusions`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => onEdit(pkg._id)}
            sx={{
              background: `linear-gradient(45deg, ${getCategoryColor(pkg.category)}, ${getCategoryColor(pkg.category)}90)`,
              color: 'white',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '6px 16px',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 15px ${getCategoryColor(pkg.category)}40`,
              }
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => onDelete(pkg._id)}
            variant="outlined"
            sx={{
              color: '#ef4444',
              borderColor: '#ef4444',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '6px 16px',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function PackagesList() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages`);
      if (response.ok) {
        const data = await response.json();
        setPackages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/packages/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await fetch(`${API_URL}/packages/${id}`, { method: 'DELETE' });
        loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: FilterList },
    { value: 'domestic', label: 'Domestic', icon: Home },
    { value: 'international', label: 'International', icon: Flight },
    { value: 'pilgrimage', label: 'Pilgrimage', icon: Church },
    { value: 'group', label: 'Group Trip', icon: Group },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ marginBottom: '32px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '8px'
              }}
            >
              All Packages
            </Typography>
            <Typography 
              sx={{ 
                color: '#6b7280',
                fontSize: '1.1rem'
              }}
            >
              Manage your travel packages with style
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/add')}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 24px',
              fontSize: '1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            Add New Package
          </Button>
        </Box>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                '& fieldset': { border: '1px solid rgba(255, 255, 255, 0.3)' },
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  startIcon={<IconComponent />}
                  onClick={() => setCategoryFilter(category.value)}
                  variant={categoryFilter === category.value ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    ...(categoryFilter === category.value ? {
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    } : {
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      }
                    })
                  }}
                >
                  {category.label}
                </Button>
              );
            })}
          </Box>
        </Stack>
      </Box>

      {/* Packages Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Typography>Loading packages...</Typography>
        </Box>
      ) : filteredPackages.length === 0 ? (
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          textAlign: 'center',
          padding: '60px 40px',
        }}>
          <Typography variant="h5" sx={{ marginBottom: '16px', color: '#6b7280' }}>
            {searchTerm || categoryFilter !== 'all' ? 'No packages found' : 'No packages yet'}
          </Typography>
          <Typography sx={{ marginBottom: '24px', color: '#9ca3af' }}>
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first package to get started'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/add')}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 24px',
            }}
          >
            Add Your First Package
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredPackages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg._id}>
              <PackageCard 
                package={pkg} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Stats Footer */}
      {!loading && filteredPackages.length > 0 && (
        <Box sx={{ 
          marginTop: '40px', 
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
        }}>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Showing {filteredPackages.length} of {packages.length} packages
          </Typography>
        </Box>
      )}
    </Box>
  );
}
