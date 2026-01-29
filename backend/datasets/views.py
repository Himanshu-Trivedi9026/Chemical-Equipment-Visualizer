from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import Dataset
from .serializers import DatasetSerializer
from .services import analyze_csv


class UploadDatasetView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=400
            )

        summary, row_count = analyze_csv(file)

        Dataset.objects.create(
            filename=file.name,
            row_count=row_count,
            summary=summary,
        )

        # ✅ SAFE delete older records (keep last 5)
        old_ids = (
            Dataset.objects
            .order_by("-uploaded_at")
            .values_list("id", flat=True)[5:]
        )

        Dataset.objects.filter(id__in=old_ids).delete()

        return Response(summary)


class DatasetHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        datasets = Dataset.objects.order_by("-uploaded_at")[:5]
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)
