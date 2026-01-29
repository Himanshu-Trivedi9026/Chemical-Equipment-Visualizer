from django.urls import path
from .views import UploadDatasetView, DatasetHistoryView

urlpatterns = [
    path("upload/", UploadDatasetView.as_view(), name="dataset-upload"),
    path("history/", DatasetHistoryView.as_view(), name="dataset-history"),
]
