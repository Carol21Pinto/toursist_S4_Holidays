import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Add,
  FilterList,
  Home,
  Flight,
  Church,
  Group as GroupIcon,
  People,
  Warning,
  CheckCircle,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Simple Static Package Card Component
function PackageCard({ package: pkg, onEdit, onDelete }) {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'domestic': return <Home fontSize="small" />;
      case 'international': return <Flight fontSize="small" />;
      case 'pilgrimage': return <Church fontSize="small" />;
      case 'group': return <GroupIcon fontSize="small" />;
      default: return <Home fontSize="small" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'domestic': return { bg: '#e6f7f1', text: '#059669', border: '#10b981' };
      case 'international': return { bg: '#dbeafe', text: '#2563eb', border: '#3b82f6' };
      case 'pilgrimage': return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' };
      case 'group': return { bg: '#ede9fe', text: '#7c3aed', border: '#8b5cf6' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
    }
  };

  const color = getCategoryColor(pkg?.category);

  const renderPrice = () => {
    if (pkg?.pricingMode === 'Structured' && pkg?.pricePerPerson) {
      return `INR ${pkg.pricePerPerson.toLocaleString()}`;
    } else if (pkg?.priceText) {
      return pkg.priceText;
    }
    return 'Contact for Price';
  };

  return (
    <Card
      sx={{
        background: '#fff',
        borderRadius: '16px',
        border: `2px solid ${color.border}30`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: '16px' }}>
          <Avatar
            sx={{
              background: color.bg,
              color: color.text,
              width: 44,
              height: 44,
            }}
          >
            {getCategoryIcon(pkg?.category)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '1.05rem',
                marginBottom: '6px',
                lineHeight: 1.3,
              }}
            >
              {pkg?.title || 'Untitled Package'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label={(pkg?.category || 'General').charAt(0).toUpperCase() + (pkg?.category || 'general').slice(1)}
                size="small"
                sx={{
                  background: color.bg,
                  color: color.text,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '22px',
                  border: `1px solid ${color.border}40`,
                  '& .MuiChip-label': { padding: '0 8px' }
                }}
              />
              <Chip
                label={pkg?.pricingMode === 'Structured' ? 'Structured' : 'Text'}
                size="small"
                sx={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '0.7rem',
                  height: '22px',
                  '& .MuiChip-label': { padding: '0 8px' }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Duration & Price */}
        <Box sx={{ marginBottom: '16px' }}>
          {pkg?.duration && (
            <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>
              📅 {pkg.duration}
            </Typography>
          )}
          <Typography
            sx={{
              fontWeight: 700,
              color: color.text,
              fontSize: '1.1rem',
              marginBottom: '4px'
            }}
          >
            {renderPrice()}
          </Typography>
          {pkg?.pricingMode === 'Structured' && (
            <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
              per person
            </Typography>
          )}
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 1, marginTop: 'auto', marginBottom: '16px', flexWrap: 'wrap' }}>
          {pkg?.itinerary && pkg.itinerary.length > 0 && (
            <Chip
              label={`${pkg.itinerary.length} Days`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '24px' }}
            />
          )}
          {pkg?.inclusions && pkg.inclusions.length > 0 && (
            <Chip
              label={`${pkg.inclusions.length} Inclusions`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '24px' }}
            />
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Edit fontSize="small" />}
            onClick={() => onEdit(pkg._id)}
            sx={{
              flex: 1,
              background: color.text,
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '8px 12px',
              borderRadius: '8px',
              '&:hover': {
                background: color.border,
              }
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Delete fontSize="small" />}
            onClick={() => onDelete(pkg._id, pkg.title)}
            sx={{
              flex: 1,
              color: '#ef4444',
              borderColor: '#ef4444',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '8px 12px',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#dc2626',
                background: '#fef2f2',
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    action: null
  });

  let deletePackageId = null;
  let deletePackageTitle = '';

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages`);
      
      if (response.ok) {
        const data = await response.json();
        const packagesArray = Array.isArray(data) ? data : (data.packages || data.data || []);
        setPackages(packagesArray);
      } else {
        setPackages([]);
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
    if (id) {
      navigate(`/admin/packages/edit/${id}`);
    }
  };

  const handleDelete = (id, title) => {
    if (!id) return;
    
    deletePackageId = id;
    deletePackageTitle = title || 'Unknown Package';
    
    setSnackbar({
      open: true,
      message: `Delete "${title || 'this package'}"?`,
      severity: 'warning',
      action: (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            size="small" 
            onClick={confirmDelete}
            sx={{ fontWeight: 600, color: '#fff', background: '#ef4444', '&:hover': { background: '#dc2626' } }}
          >
            DELETE
          </Button>
          <Button 
            color="inherit" 
            size="small" 
            onClick={cancelDelete}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
        </Box>
      )
    });
  };

  const confirmDelete = async () => {
    try {
      if (!deletePackageId) throw new Error('Package ID is missing');
      
      const response = await fetch(`${API_URL}/packages/${deletePackageId}`, { method: 'DELETE' });
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: `✅ "${deletePackageTitle}" deleted successfully!`,
          severity: 'success',
          action: null
        });
        
        loadPackages();
        localStorage.setItem('dashboardRefresh', Date.now().toString());
        window.dispatchEvent(new CustomEvent('dashboardRefresh'));
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Failed to delete: ${error.message}`,
        severity: 'error',
        action: null
      });
    } finally {
      deletePackageId = null;
      deletePackageTitle = '';
    }
  };

  const cancelDelete = () => {
    deletePackageId = null;
    deletePackageTitle = '';
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway' && snackbar.action) return;
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredPackages = packages.filter(pkg => {
    if (!pkg) return false;
    const matchesSearch = !searchTerm || (pkg.title && pkg.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || (pkg.category && pkg.category === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const sortedPackages = filteredPackages.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const categories = [
    { value: 'all', label: 'All', icon: FilterList },
    { value: 'domestic', label: 'Domestic', icon: Home },
    { value: 'international', label: 'International', icon: Flight },
    { value: 'pilgrimage', label: 'Pilgrimage', icon: Church },
    { value: 'group', label: 'Group', icon: People },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ marginBottom: '32px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
            Packages ({packages.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/add')}
            sx={{
              background: '#6366f1',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: '10px',
              '&:hover': { background: '#4f46e5' }
            }}
          >
            Add Package
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
                  <Search sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: '#fff',
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  startIcon={<IconComponent fontSize="small" />}
                  onClick={() => setCategoryFilter(category.value)}
                  variant={categoryFilter === category.value ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '8px 16px',
                    ...(categoryFilter === category.value ? {
                      background: '#6366f1',
                      color: '#fff',
                      '&:hover': { background: '#4f46e5' }
                    } : {
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      '&:hover': { borderColor: '#6366f1', background: '#f0f9ff' }
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
        <Box sx={{ textAlign: 'center', padding: '40px' }}>
          <Typography>Loading packages...</Typography>
        </Box>
      ) : sortedPackages.length === 0 ? (
        <Card sx={{ textAlign: 'center', padding: '60px 40px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Typography variant="h5" sx={{ marginBottom: '16px', color: '#6b7280' }}>
            {searchTerm || categoryFilter !== 'all' ? 'No packages found' : 'No packages yet'}
          </Typography>
          <Typography sx={{ marginBottom: '24px', color: '#9ca3af' }}>
            {searchTerm || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first package'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/add')}
            sx={{ background: '#6366f1', textTransform: 'none', fontWeight: 600, padding: '10px 20px', borderRadius: '10px' }}
          >
            Add Package
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {sortedPackages.map((pkg, index) => (
            <Grid item xs={12} sm={6} md={4} key={pkg?._id || index}>
              <PackageCard package={pkg} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.action ? null : 4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={snackbar.action ? null : handleCloseSnackbar}
          severity={snackbar.severity}
          action={snackbar.action}
          icon={snackbar.severity === 'warning' ? <Warning /> : <CheckCircle />}
          sx={{
            width: '100%',
            fontSize: '1rem',
            fontWeight: 500,
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
