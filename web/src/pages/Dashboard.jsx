import { useEffect, useState } from "react";
import UploadForm from "../components/UploadForm";
import Summary from "../components/Summary";
import History from "../components/History";
import Charts from "../components/charts/Charts";
import api from "../api/client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  /* ================= FETCH HISTORY ================= */
  const fetchHistory = async () => {
    try {
      const res = await api.get("datasets/history/");
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch failed", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= PDF EXPORT (2 PAGES) ================= */
  const exportPDF = async () => {
    if (!summary) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    /* ========== PAGE 1: TITLE + SUMMARY ========== */
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Chemical Equipment Parameter Analysis", 15, 30);

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      15,
      42
    );

    pdf.setLineWidth(0.5);
    pdf.line(15, 46, pageWidth - 15, 46);

    let y = 60;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary", 15, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    pdf.text(`Total Records: ${summary.total_rows}`, 15, y);
    y += 8;
    pdf.text(`Average Flowrate: ${summary.average_flowrate}`, 15, y);
    y += 8;
    pdf.text(`Average Pressure: ${summary.average_pressure}`, 15, y);
    y += 8;
    pdf.text(`Average Temperature: ${summary.average_temperature}`, 15, y);

    y += 12;
    pdf.setFont("helvetica", "bold");
    pdf.text("Equipment Distribution:", 15, y);
    pdf.setFont("helvetica", "normal");

    y += 8;
    Object.entries(summary.type_distribution || {}).forEach(
      ([type, count]) => {
        pdf.text(`• ${type}: ${count}`, 20, y);
        y += 7;
      }
    );

    /* ========== PAGE 2: CHARTS ========== */
    pdf.addPage();
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Visual Analysis", 15, 25);

    const chartsElement = document.getElementById("pdf-charts");
    if (chartsElement) {
      const canvas = await html2canvas(chartsElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 30;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        15,
        35,
        imgWidth,
        imgHeight
      );
    }

    pdf.save("Chemical_Equipment_Report.pdf");
  };

  return (
    <div className="app-container">
      {/* ================= UPLOAD ================= */}
      <section className="card glass">
        <UploadForm
          setSummary={(data) => {
            setSummary(data);
            fetchHistory();
          }}
          setHistory={setHistory}
        />
      </section>

      {/* ================= EXPORT BUTTON ================= */}
      {summary && (
        <div style={{ textAlign: "right", margin: "20px 0" }}>
          <button className="primary-btn" onClick={exportPDF}>
            📄 Export PDF Report
          </button>
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="card glass">
          <Summary summary={summary} />
        </section>
      )}

      {/* ================= CHARTS (PDF TARGET) ================= */}
      {summary && (
        <section id="pdf-charts" className="card glass">
          <Charts summary={summary} />
        </section>
      )}

      {/* ================= HISTORY ================= */}
      {history.length > 0 && (
        <section className="card glass">
          <History history={history} />
        </section>
      )}
    </div>
  );
}

export default Dashboard;
