from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from apps.core.models import TimestampModel


class Group(TimestampModel):
    specialization = models.CharField(max_length=55, validators=[
        RegexValidator(regex=r'[а-яА-Я]+',
                       message="Разрешены только буквы кириллицы")
    ])
    course = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4),
        ]
    )
    index = models.PositiveSmallIntegerField()
    main_block = models.PositiveBigIntegerField()
    is_commercial = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                'specialization',
                'course',
                'index',
                name="unique_group_name",
            )
        ]
