import requests

BASE_URL = "http://127.0.0.1:8000/api/"

TOKEN = "PASTE_YOUR_DRF_TOKEN_HERE"

HEADERS = {
    "Authorization": f"Token {TOKEN}"
}

def upload_csv(file_path):
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(
            BASE_URL + "datasets/upload/",
            files=files,
            headers=HEADERS
        )
    response.raise_for_status()
    return response.json()

def get_history():
    response = requests.get(
        BASE_URL + "datasets/history/",
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()
