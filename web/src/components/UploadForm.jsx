import { useState, useRef } from "react";
import api from "../api/client";

export default function UploadForm({ setSummary, setHistory }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  /* ================= FILE HANDLERS ================= */

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are allowed.");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      // 🔐 THIS CALL USES api → TOKEN IS ATTACHED AUTOMATICALLY
      const uploadRes = await api.post(
        "datasets/upload/",
        formData
      );

      setSummary(uploadRes.data);
      setFile(null);


      // Refresh history
      const historyRes = await api.get("datasets/history/");
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Upload error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.detail) {
  setError(err.response.data.detail);
}
 else {
        setError("Upload failed. Check backend logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="upload-card">
      <h2>Upload CSV</h2>

      <form onSubmit={handleSubmit}>
        {/* Drag & Drop Zone */}
        <div
          className={`drop-zone ${dragActive ? "active" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />

          {!file ? (
            <p>Drag & drop CSV here, or click to browse</p>
          ) : (
            <p>
              📄 <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <button
  type="submit"
  className="primary-btn"
  disabled={loading || !file}
>

          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
