from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator


class Group(models.Model):
    slug = models.SlugField(max_length=255, primary_key=True)
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                'specialization',
                'course',
                'index',
                name="unique_group_name",
            )
        ]
