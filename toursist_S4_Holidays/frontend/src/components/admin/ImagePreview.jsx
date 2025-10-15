import React from "react";

function ImagePreview({ file }) {
  const [src, setSrc] = React.useState("");

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!file) return null;
  return (
    <img
      src={src}
      alt="Preview"
      style={{ maxWidth: 150, maxHeight: 100, margin: "0.5rem", borderRadius: 8, border: "1px solid #ccc" }}
    />
  );
}

export default ImagePreview;
