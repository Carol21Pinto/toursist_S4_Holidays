// src/pages/admin/PackagesList.jsx
import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PackagesList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchAll() {
    setLoading(true);
    const cats = ["domestic","international","pilgrimage","group"];
    const all = [];
    for (const c of cats) {
      const r = await fetch(`${API_URL}/packages/category/${c}`);
      const d = await r.json();
      d.forEach(p => all.push({ ...p, id: p._id, category: c }));
    }
    setRows(all);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/packages/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    if (res.ok) setRows(prev => prev.filter(r => r.id !== id));
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "category", headerName: "Category", width: 140 },
    { field: "pricePerPerson", headerName: "Price", width: 120 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => navigate(`/admin/edit/${params.id}`)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>All Packages</Typography>
        <Button variant="contained" onClick={() => navigate("/admin/add")}>Add Package</Button>
      </Stack>
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </Stack>
  );
}
