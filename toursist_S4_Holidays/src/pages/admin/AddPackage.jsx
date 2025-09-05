import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "prosemirror-view/style/prosemirror.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Grid from "@mui/material/Grid";
import {
  Box, Card, CardContent, CardHeader, Stack, TextField, MenuItem, Button, Typography,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function RichText({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  if (!editor) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <EditorContent editor={editor} style={{ width: "100%" }} />
      <style>{`
        .ProseMirror {
          width: 100%;
          height: 72px;
          max-height: 72px;
          overflow-y: auto;
          outline: none;
          white-space: pre-wrap;
        }
      `}</style>
    </Box>
  );
}

export default function AddPackage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("domestic");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [priceNote, setPriceNote] = useState("");
  const [description, setDescription] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [cardImage, setCardImage] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function addItineraryDay() {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: "", activities: [] }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("pricePerPerson", String(pricePerPerson));
    fd.append("currency", currency);
    fd.append("priceNote", priceNote);
    fd.append("description", description);
    fd.append("inclusions", JSON.stringify(inclusions));
    fd.append("exclusions", JSON.stringify(exclusions));
    fd.append("contactNumbers", JSON.stringify(contactNumbers));
    fd.append("itinerary", JSON.stringify(itinerary));
    if (cardImage) fd.append("cardImage", cardImage);
    images.forEach((img) => fd.append("images", img));

    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/packages`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd,
    });
    const data = await res.json();

    if (res.ok) {
      setMsg("Package created successfully!");
      const ts = Date.now();
      // Force immediate dashboard refresh via query param (remounts route)
      setTimeout(() => navigate(`/admin?refresh=${ts}`), 150);
    } else {
      setMsg(data.message || "Failed to create package");
    }
    setSaving(false);
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
        Add Package
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
        <CardHeader title="Basic Details" sx={{ py: 1.25 }} />
        <CardContent sx={{ pt: 1, pb: 0.5 }}>
          <Grid container spacing={1.5} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Package Name"
                fullWidth
                size="small"
                margin="dense"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Category"
                select
                fullWidth
                size="small"
                margin="dense"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="domestic">Domestic</MenuItem>
                <MenuItem value="international">International</MenuItem>
                <MenuItem value="pilgrimage">Pilgrimage</MenuItem>
                <MenuItem value="group">Group Trip</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Price per person"
                type="number"
                fullWidth
                size="small"
                margin="dense"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Currency"
                fullWidth
                size="small"
                margin="dense"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Price note (optional)"
                fullWidth
                size="small"
                margin="dense"
                value={priceNote}
                onChange={(e) => setPriceNote(e.target.value)}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                Big Description
              </Typography>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  bgcolor: "background.paper",
                  width: "100%",
                }}
              >
                <RichText value={description} onChange={setDescription} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1, mt: 2 }}>
        <CardHeader title="Media & Lists" sx={{ py: 1.25 }} />
        <CardContent sx={{ pt: 1, pb: 0.5 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={0.75}>
                <Typography variant="subtitle2">
                  Card Image <Typography component="span" variant="caption" color="text.secondary">(optional)</Typography>
                </Typography>
                <Button component="label" variant="outlined" size="small">
                  Choose File
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCardImage(e.target.files && e.target.files ? e.target.files : null)
                    }
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  1200×800 JPG/PNG
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={0.75}>
                <Typography variant="subtitle2">More Images (max 10)</Typography>
                <Button component="label" variant="outlined" size="small">
                  Choose Files
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
                  />
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Inclusions (comma separated)"
                fullWidth
                size="small"
                margin="dense"
                onChange={(e) =>
                  setInclusions(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Exclusions (comma separated)"
                fullWidth
                size="small"
                margin="dense"
                onChange={(e) =>
                  setExclusions(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Contact Numbers (comma separated)"
                fullWidth
                size="small"
                margin="dense"
                onChange={(e) =>
                  setContactNumbers(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1, mt: 2 }}>
        <CardHeader title="Itinerary" sx={{ py: 1.25 }} />
        <CardContent sx={{ pt: 1, pb: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button onClick={addItineraryDay} size="small" variant="outlined">
              + Add Day
            </Button>
          </Stack>
          <Stack spacing={1}>
            {itinerary.map((d, i) => (
              <Grid key={i} container spacing={1}>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    label="Day"
                    value={`Day ${d.day}`}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                  <TextField
                    label="Title"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={d.title}
                    onChange={(e) => {
                      const copy = [...itinerary];
                      copy[i].title = e.target.value;
                      setItinerary(copy);
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
        <Button onClick={handleSubmit} disabled={saving} size="small" variant="contained">
          {saving ? "Saving..." : "Save Package"}
        </Button>
        {msg && <Typography variant="body2" sx={{ alignSelf: "center" }}>{msg}</Typography>}
      </Stack>
    </Box>
  );
}
