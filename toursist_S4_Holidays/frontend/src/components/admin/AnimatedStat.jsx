import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function AnimatedStat({ value = 0, label = "" }) {
  const ref = useRef();

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = Math.floor(latest);
      }
    });
    return () => controls.stop();
  }, [value]);

  return (
    <Card sx={{ minWidth: 150, m: 1, bgcolor: "#fafafa", boxShadow: 2 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography ref={ref} variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          0
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#666" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AnimatedStat;
