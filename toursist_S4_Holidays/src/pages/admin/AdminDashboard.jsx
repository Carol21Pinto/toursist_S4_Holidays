import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Box, Card, CardContent, Stack, Typography, Button } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function StatCard({ label, value }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
        <Typography color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState({ domestic:0, international:0, pilgrimage:0, group:0, total:0 });
  const [chartData, setChartData] = useState([]);

  const load = () => {
    const token = localStorage.getItem("adminToken");
    fetch(`${API_URL}/packages/stats`, { headers: { Authorization: "Bearer " + token }})
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        console.log('Stats API response:', d); // Debug log
        setStats(d || {});
      })
      .catch(() => setStats({ domestic:0, international:0, pilgrimage:0, group:0, total:0 }));

    fetch(`${API_URL}/packages/weekly`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setChartData(Array.isArray(data) ? data : []))
      .catch(() => setChartData([]));
  };

  useEffect(() => {
    load();
  }, [location.search]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard</Typography>
        <Button size="small" variant="outlined" onClick={load}>Refresh</Button>
      </Stack>

      {/* Updated Grid Layout - Two Rows */}
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {/* First Row */}
        <Grid size={{ xs: 12, md: 6 }}><StatCard label="Total Packages" value={stats.total || 0} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><StatCard label="Domestic" value={stats.domestic || 0} /></Grid>
        
        {/* Second Row */}
        <Grid size={{ xs: 12, md: 4 }}><StatCard label="International" value={stats.international || 0} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><StatCard label="Pilgrimage" value={stats.pilgrimage || 0} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><StatCard label="Group Trip" value={stats.group || 0} /></Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Packages this week</Typography>
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976D2" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="packages" stroke="#1976D2" fill="url(#c1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
