import sys
import requests
from PyQt5.QtWidgets import (
    QApplication,
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QPushButton,
    QLabel,
    QFileDialog,
    QMessageBox,
    QGroupBox,
)
from PyQt5.QtCore import Qt

# ================= CONFIG =================
BACKEND_UPLOAD_URL = "http://127.0.0.1:8000/api/datasets/upload/"
BACKEND_HISTORY_URL = "http://127.0.0.1:8000/api/datasets/history/"

AUTH_TOKEN = "98191dceeb7e43e6812ee7689cc017e0d1a43855"


# ================= MAIN WINDOW =================
class ChemicalVisualizerDesktop(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Chemical Equipment Visualizer — Desktop")
        self.resize(1200, 800)

        self.selected_file = None

        # -------- Central Widget --------
        central = QWidget()
        self.setCentralWidget(central)

        root_layout = QVBoxLayout()
        root_layout.setAlignment(Qt.AlignCenter)
        central.setLayout(root_layout)

        # -------- Card --------
        container = QWidget()
        container.setFixedWidth(720)
        container.setStyleSheet("""
            QWidget {
                background-color: #ffffff;
                border-radius: 18px;
            }
        """)
        root_layout.addWidget(container)

        layout = QVBoxLayout(container)
        layout.setContentsMargins(50, 40, 50, 40)
        layout.setSpacing(22)

        # -------- Title --------
        title = QLabel("Chemical Equipment Parameter Visualizer")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 26px; font-weight: 700; color: #1f2937;")
        layout.addWidget(title)

        subtitle = QLabel("Desktop Analysis Client")
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #6b7280; font-size: 13px;")
        layout.addWidget(subtitle)

        # -------- Select CSV --------
        self.select_btn = QPushButton("📂 Select CSV File")
        self.select_btn.setFixedHeight(44)
        self.select_btn.clicked.connect(self.open_file_dialog)
        self.select_btn.setStyleSheet(self.primary_button_style())
        layout.addWidget(self.select_btn)

        self.file_label = QLabel("No file selected")
        self.file_label.setAlignment(Qt.AlignCenter)
        self.file_label.setStyleSheet("color: #6b7280;")
        layout.addWidget(self.file_label)

        # -------- Upload --------
        self.upload_btn = QPushButton("🚀 Upload & Analyze")
        self.upload_btn.setFixedHeight(44)
        self.upload_btn.setEnabled(False)
        self.upload_btn.clicked.connect(self.upload_to_backend)
        self.upload_btn.setStyleSheet(self.primary_button_style(disabled=True))
        layout.addWidget(self.upload_btn)

        # -------- Status --------
        self.status_label = QLabel("Status: Ready")
        self.status_label.setAlignment(Qt.AlignCenter)
        self.status_label.setStyleSheet("color: #059669; font-size: 13px;")
        layout.addWidget(self.status_label)

        # -------- Summary --------
        self.summary_box = QGroupBox("Analysis Summary")
        self.summary_box.setStyleSheet("""
            QGroupBox {
                font-weight: 600;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                margin-top: 15px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 12px;
                padding: 0 6px;
            }
        """)
        self.summary_layout = QVBoxLayout()
        self.summary_layout.setSpacing(8)
        self.summary_box.setLayout(self.summary_layout)
        self.summary_box.setVisible(False)
        layout.addWidget(self.summary_box)

        # ✅ FULLSCREEN
        self.showMaximized()

    # ================= STYLES =================
    def primary_button_style(self, disabled=False):
        if disabled:
            return """
            QPushButton {
                background-color: #9ca3af;
                color: white;
                border-radius: 10px;
                font-size: 14px;
            }
            """
        return """
        QPushButton {
            background-color: #2563eb;
            color: white;
            border-radius: 10px;
            font-size: 14px;
        }
        QPushButton:hover {
            background-color: #1d4ed8;
        }
        """

    # ================= FILE PICKER =================
    def open_file_dialog(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select CSV File", "", "CSV Files (*.csv)"
        )

        if file_path:
            self.selected_file = file_path
            self.file_label.setText(file_path.split("/")[-1])
            self.upload_btn.setEnabled(True)
            self.upload_btn.setStyleSheet(self.primary_button_style())
            self.status_label.setText("Status: File selected")

    # ================= UPLOAD =================
    def upload_to_backend(self):
        self.status_label.setText("⏳ Uploading & analyzing...")
        QApplication.processEvents()

        headers = {"Authorization": f"Token {AUTH_TOKEN}"}

        try:
            with open(self.selected_file, "rb") as f:
                response = requests.post(
                    BACKEND_UPLOAD_URL,
                    headers=headers,
                    files={"file": f},
                    timeout=20
                )

            if response.status_code == 401:
                raise Exception("Unauthorized (Invalid token)")

            if response.status_code != 200:
                raise Exception(response.text)

            self.fetch_summary(headers)

            QMessageBox.information(
                self,
                "Success",
                "CSV uploaded and analyzed successfully.\n\nCharts are available in Web UI."
            )

            self.status_label.setText("✅ Analysis completed successfully")

        except Exception as e:
            QMessageBox.critical(
                self,
                "Error",
                f"Upload failed.\n\nDetails:\n{str(e)}"
            )
            self.status_label.setText("❌ Upload failed")

        finally:
            self.upload_btn.setEnabled(True)

    # ================= FETCH SUMMARY =================
    def fetch_summary(self, headers):
        response = requests.get(BACKEND_HISTORY_URL, headers=headers)

        if response.status_code != 200:
            raise Exception("Failed to fetch summary")

        latest = response.json()[0]

        avg_flow = latest.get("avg_flowrate", 0)
        avg_pressure = latest.get("avg_pressure", 0)
        avg_temp = latest.get("avg_temperature", 0)

        equipment_counts = latest.get("equipment_counts", {})
        total_equipment = sum(equipment_counts.values())

        # Clear old summary
        while self.summary_layout.count():
            item = self.summary_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        self.summary_layout.addWidget(
            QLabel(f"• Total Equipment: {total_equipment}")
        )
        self.summary_layout.addWidget(
            QLabel(f"• Average Flowrate: {avg_flow} kg/s")
        )
        self.summary_layout.addWidget(
            QLabel(f"• Average Pressure: {avg_pressure} bar")
        )
        self.summary_layout.addWidget(
            QLabel(f"• Average Temperature: {avg_temp} °C")
        )

        self.summary_box.setVisible(True)


# ================= ENTRY =================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ChemicalVisualizerDesktop()
    sys.exit(app.exec_())
