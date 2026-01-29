from django.db import models

class Dataset(models.Model):
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    row_count = models.IntegerField()
    summary = models.JSONField()

    def __str__(self):
        return self.filename
