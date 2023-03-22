from rest_framework import serializers
from .models import Timetable, TimetablePeriod
from .service import db_dates_map


class MainTimetablePeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimetablePeriod
        fields = [
            'id',
            'index',
            'subject',
            'teachers',
            'cabinet',
        ]


class MainTimetableSerializer(serializers.HyperlinkedModelSerializer):
    periods = MainTimetablePeriodSerializer(many=True)
    week_day = serializers.ChoiceField(
        ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        write_only=True
    )
    week_type = serializers.ChoiceField(['ЧИСЛ', 'ЗНАМ'], write_only=True)

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        week_day = validated_data.pop('week_day')
        week_type = validated_data.pop('week_type')
        date = db_dates_map[week_type][week_day]
        timetable = Timetable.objects.create(
            **validated_data, is_main=True, date=date
        )
        for period in periods:
            teachers = period.pop('teachers')
            period_record = TimetablePeriod.objects.create(
                **period, timetable=timetable
            )
            period_record.teachers.add(*teachers)
        return timetable

    def update(self, instance, validated_data):
        instance.group = validated_data.pop('group', instance.group)
        instance.note = validated_data.pop('note', instance.note)
        week_day = validated_data.pop('week_day')
        week_type = validated_data.pop('week_type')
        instance.date = db_dates_map[week_type][week_day]
        periods = validated_data.pop('periods', [])
        instance.periods.all().delete()
        for period in periods:
            teachers = period.pop('teachers', [])
            period_record = TimetablePeriod.objects.create(
                **period, timetable=instance
            )
            period_record.teachers.add(*teachers)
        instance.save()
        return instance

    class Meta:
        model = Timetable
        fields = [
            'url',
            'group',
            'periods',
            'note',
            'week_day',
            'week_type',
            'created_at',
            'updated_at',
        ]
