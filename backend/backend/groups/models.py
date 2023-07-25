from django.db import models
from backend.shared.models import TimestampModel


class Group(TimestampModel):
    name = models.CharField(max_length=255, unique=True)
    main_block = models.PositiveBigIntegerField()
