import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="fixed" color="inherit" elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider", zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Admin Panel</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => navigate("/admin/add")}>
            Add New Package
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", borderRight: 1, borderColor: "divider" },
        }}>
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/admin" selected={location.pathname === "/admin"}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/packages" selected={location.pathname.startsWith("/admin/packages")}>
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText primary="All Packages" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/add" selected={location.pathname === "/admin/add"}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary="Add Package" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
