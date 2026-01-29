Chemical Equipment Parameter Visualizer

📌Overview-

The Chemical Equipment Parameter Visualizer is a hybrid (Web + Desktop) application designed to analyze and visualize operational parameters of chemical equipment using CSV datasets.

The system processes industrial data such as flowrate, pressure, and temperature, generates statistical summaries, and presents interactive visualizations to assist engineers in decision-making.

This project is developed as part of an academic and open-source initiative aligned with FOSSEE (Free and Open Source Software for Education) objectives.

🎯Objectives-

Analyze CSV-based chemical equipment datasets
Compute average operational parameters
Visualize results using interactive charts
Maintain upload history
Provide downloadable analytical reports (PDF)
Demonstrate hybrid extensibility (Web + Desktop)

🏗️ System Architecture-

+------------------+
|  Desktop Client  |  (PyQt5 / PySide6)
+--------+---------+
         |
         | REST API (JSON, Auth Token)
         |
+--------v---------+
|   Django Backend |
|  (DRF + SQLite)  |
+--------+---------+
         |
         |
+--------v---------+
|   Web Frontend   |
|   (React + Vite) |
+------------------+

🔐 Demo Login Credentials

To access the web application, use the following demo credentials:

Username: admin  
Password: Admin@1234 

These credentials are provided for evaluation and demonstration purposes only.


Key Point:

Both Web and Desktop clients use the same backend, demonstrating extensibility and hybrid design.

🧰 Technology Stack

Backend
Python 3.10
Django
Django REST Framework
SQLite
Token Authentication
Web Frontend
React (Vite)
Axios
Chart.js / Recharts
HTML2Canvas
jsPDF
Desktop Application
Python
PyQt5 / PySide6
Requests

⚙️ Features

Backend-

Secure CSV upload
Data validation
Statistical analysis
Upload history (last 5 uploads)
RESTful APIs

Web Application-
Drag & drop CSV upload
Summary statistics
Interactive charts
Equipment distribution visualization
Export charts as PNG
Export analysis as PDF
Responsive UI
Desktop Application-
CSV file selection
Upload & analyze via backend API
Status feedback dialogs
Uses same backend as web app

🚀How to Run the Project

1️⃣Backend Setup-

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000/

2️⃣Web Frontend Setup

cd web
npm install
npm run dev


Web app runs at:

http://localhost:5173/

3️⃣Desktop Application Setup

cd desktop_app
python -m venv venv
venv\Scripts\activate
pip install pyqt5 requests matplotlib
python main.py

📊 Sample Dataset

A sample dataset is provided:

sample_equipment_data.csv


Contains:

Equipment type
Flowrate
Pressure
Temperature

📄PDF Report

The application can generate a multi-page PDF report containing:-

Project title
Date & time
Summary statistics
Visual charts

🧪Screenshots-

Include the following screenshots in a /screenshots folder:

Web UI – CSV Upload
Web UI – Summary
Web UI – Charts
PDF Report Output
Desktop Application Interface
Desktop Upload Success Dialog

📜License-

This project is released under the MIT License.

👤Author-

Himanshu Trivedi
B-tech - Computer Science Engineering