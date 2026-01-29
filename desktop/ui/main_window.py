from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QLabel
)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Chemical Equipment Visualizer – Desktop")
        self.setGeometry(100, 100, 1000, 700)

        central = QWidget()
        layout = QVBoxLayout()

        title = QLabel("Chemical Equipment Parameter Visualizer (Desktop)")
        title.setStyleSheet("font-size: 18px; font-weight: bold;")

        layout.addWidget(title)
        central.setLayout(layout)
        self.setCentralWidget(central)
