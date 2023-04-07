from django.db import models
from apps.groups.models import Group
from apps.subjects.models import Subject
from apps.teachers.models import Teacher
from apps.core.models import TimestampModel


class ClassSchedule(TimestampModel):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField()
    is_main = models.BooleanField()
    note = models.CharField(max_length=400, null=True, blank=True)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'group',
                'date',
                name="Группа может иметь только одно расписание на один день"
            ),
        ]


class ClassSchedulePeriod(TimestampModel):
    timetable = models.ForeignKey(
        ClassSchedule, on_delete=models.CASCADE, related_name='periods')
    index = models.PositiveSmallIntegerField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teachers = models.ManyToManyField(Teacher)
    cabinet = models.CharField(max_length=55)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                'timetable',
                'index',
                name="Номер пары должен быть уникальным",
            ),
        ]
        ordering = ['index']
