from rest_framework import serializers
from .models import Timetable, TimetablePeriod


class TimetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timetable
        fields = [
            'id',
            'group_slug',
            'date',
            'is_main',
        ]


class TimetablePeriodSerializer(serializers.Serializer):
    pass
