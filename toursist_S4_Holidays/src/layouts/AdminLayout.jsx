import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import './AdminLayout.css';

const drawerWidth = 280; // Back to normal size

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in and not on login page
  const isLoggedIn = !!localStorage.getItem("adminToken");
  const isLoginPage = location.pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await fetch("http://localhost:5000/api/admin/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }).catch(err => console.log("Logout API call failed:", err));
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("adminToken");
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
    }}>
      {/* Normal Top AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2c3e50, #3498db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Panel
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: '#6b7280', fontWeight: 500 }}
          >
            Super Admin
          </Typography>
          
          {/* Show buttons ONLY if logged in AND not on login page */}
          {isLoggedIn && !isLoginPage && (
            <Box sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />} 
                onClick={() => navigate("/admin/add")}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                Add New Package
              </Button>
              
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  borderColor: '#ef4444',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Normal Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: "border-box",
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: 'none',
            color: 'white',
          },
        }}
      >
        <Toolbar />
        
        {/* Brand Section */}
        <Box sx={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            marginBottom: 1
          }}>
            <Box sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TravelExploreIcon sx={{ color: 'white', fontSize: '24px' }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TravelAdmin
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}
          >
            Travel Management System
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ padding: '20px 0' }}>
          <ListItemButton 
            component={Link} 
            to="/admin" 
            selected={location.pathname === "/admin"}
            sx={{
              margin: '0 15px',
              borderRadius: '12px',
              marginBottom: '8px',
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                } 
              }} 
            />
          </ListItemButton>

          <ListItemButton 
            component={Link} 
            to="/admin/packages" 
            selected={location.pathname.startsWith("/admin/packages")}
            sx={{
              margin: '0 15px',
              borderRadius: '12px',
              marginBottom: '8px',
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText 
              primary="All Packages" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                } 
              }} 
            />
          </ListItemButton>

          <ListItemButton 
            component={Link} 
            to="/admin/add" 
            selected={location.pathname === "/admin/add"}
            sx={{
              margin: '0 15px',
              borderRadius: '12px',
              marginBottom: '8px',
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Add Package" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                } 
              }} 
            />
          </ListItemButton>
        </List>

        {/* Bottom Section */}
        <Box sx={{ 
          marginTop: 'auto', 
          padding: '20px', 
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              fontSize: '1.2rem',
              fontWeight: 700
            }}>
              A
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Admin User
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: '0.75rem' 
              }}>
                System Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          padding: '24px',
          marginLeft: `${drawerWidth}px`,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children ? children : <Outlet />}
      </Box>
    </Box>
  );
}
