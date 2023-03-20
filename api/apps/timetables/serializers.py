from rest_framework import serializers
from .models import Timetable, TimetablePeriod
from .service import db_dates_map


class MainTimetablePeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimetablePeriod
        fields = [
            'id',
            'index',
            'subject_id',
            'teachers',
            'cabinet',
        ]


class MainTimetableSerializer(serializers.ModelSerializer):
    periods = MainTimetablePeriodSerializer(many=True)
    week_day = serializers.ChoiceField(
        ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'])
    week_type = serializers.ChoiceField(['ЧИСЛ', 'ЗНАМ'])

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        week_day = validated_data.pop('week_day')
        week_type = validated_data.pop('week_type')
        date = db_dates_map[week_type][week_day]
        timetable = Timetable.objects.create(
            **validated_data, is_main=True, date=date
        )

        for period in periods:
            teachers_ids = period.pop('teachers')
            period_record = TimetablePeriod.objects.create(
                **period, timetable_id=timetable
            )
            period_record.teachers.add(*teachers_ids)
        return timetable

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    class Meta:
        model = Timetable
        fields = [
            'id',
            'group_id',
            'periods',
            'note',
            'week_day',
            'week_type'
        ]
