from django.db import models
from apps.groups.models import Group
from apps.subjects.models import Subject
from apps.teachers.models import Teacher
from apps.core.models import TimestampModel


class Timetable(TimestampModel):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField()
    is_main = models.BooleanField()
    note = models.CharField(max_length=400, null=True, blank=True)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'group_id',
                'date',
                name="Группа может иметь только одно расписание на один день"
            ),
        ]


class TimetablePeriod(TimestampModel):
    timetable_id = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    index = models.PositiveSmallIntegerField()
    subject_id = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teachers = models.ManyToManyField(Teacher)
    cabinet = models.CharField(max_length=55)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'timetable_id',
                'index',
                name="Номер пары должен быть уникальным",
            ),
        ]
