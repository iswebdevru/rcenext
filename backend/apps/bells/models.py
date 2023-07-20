from django.db import models
from django.db.models import Q
from apps.core.models import TimestampModel, ScheduleType, WeekDay
from django.core.validators import MaxValueValidator
from datetime import timedelta


class Bells(TimestampModel):
    class Variant(models.TextChoices):
        NORMAL = 'normal'
        REDUCED = 'reduced'

    type = models.CharField(max_length=7, choices=ScheduleType.choices)
    variant = models.CharField(max_length=7, choices=Variant.choices)
    week_day = models.CharField(
        max_length=2, choices=WeekDay.choices, null=True, blank=True)
    date = models.DateField(null=True, blank=True)

    class Meta:
        constraints = [
            models.constraints.CheckConstraint(
                check=Q(type='main') & Q(week_day__isnull=False) | Q(
                    type='changes') & Q(date__isnull=False),
                name='Целостность расписания звонков в зависимости от состояния'
            ),
            models.constraints.UniqueConstraint(
                'variant',
                'week_day',
                name="Одно расписание на один день недели"
            ),
            models.constraints.UniqueConstraint(
                'variant',
                'date',
                name="Одно расписание на одну дату"
            )
        ]


class BellsPeriod(TimestampModel):
    bells = models.ForeignKey(
        Bells, on_delete=models.CASCADE, related_name='periods')
    index = models.PositiveSmallIntegerField()
    has_break = models.BooleanField()
    period_from = models.DurationField(db_column='from', validators=[
                                       MaxValueValidator(timedelta(hours=23, minutes=59))])
    period_to = models.DurationField(db_column='to', validators=[
        MaxValueValidator(timedelta(hours=23, minutes=59))])
    period_from_after = models.DurationField(
        db_column='from_after', null=True, blank=True, validators=[
            MaxValueValidator(timedelta(hours=23, minutes=59))])
    period_to_after = models.DurationField(
        db_column='to_after', null=True, blank=True, validators=[
            MaxValueValidator(timedelta(hours=23, minutes=59))])

    class Meta:
        ordering = ['index']
        constraints = [
            models.constraints.UniqueConstraint(
                'bells', 'index', name='Номер звонка на пару должен быть уникальным'
            ),
            models.constraints.CheckConstraint(
                check=Q(has_break=False) | Q(has_break=True) & Q(period_from_after__isnull=False) & Q(
                    period_to_after__isnull=False),
                name='Наличие двух дополнительных полей в случае, если указано has_break'
            )
        ]
