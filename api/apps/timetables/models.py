from django.db import models
from apps.groups.models import Group
from apps.subjects.models import Subject
from apps.teachers.models import Teacher
from apps.core.models import TimestampModel


class Timetable(TimestampModel):
    group_slug = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField()
    is_main = models.BooleanField()

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'group_slug',
                'date',
                name="Группа может иметь только одно расписание на один день"
            ),
        ]


class TimetablePeriod(TimestampModel):
    timetable_id = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    subject_id = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teachers = models.ManyToManyField(Teacher)
    cabinet = models.CharField(max_length=55)
    index = models.PositiveSmallIntegerField()

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'timetable_id',
                'index',
                name="Номер пары должен быть уникальным",
            ),
        ]
