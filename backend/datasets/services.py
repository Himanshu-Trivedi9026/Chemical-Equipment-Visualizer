import pandas as pd

REQUIRED_COLUMNS = [
    "Equipment Name",
    "Type",
    "Flowrate",
    "Pressure",
    "Temperature"
]

def analyze_csv(file):
    df = pd.read_csv(file)

    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")

    summary = {
        "total_equipment": int(len(df)),
        "average_flowrate": float(df["Flowrate"].mean()),
        "average_pressure": float(df["Pressure"].mean()),
        "average_temperature": float(df["Temperature"].mean()),
        "type_distribution": df["Type"].value_counts().to_dict()
    }

    return summary, len(df)
