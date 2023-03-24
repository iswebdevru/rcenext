from rest_framework import serializers
from .models import Timetable, TimetablePeriod
from .service import main_dates_map, week_days, week_types, get_day_info


def create_period(period_data, timetable):
    teachers = period_data.pop('teachers')
    period_record = TimetablePeriod.objects.create(
        **period_data, timetable=timetable
    )
    period_record.teachers.add(*teachers)


def create_periods(periods_data, timetable):
    for period_data in periods_data:
        create_period(period_data, timetable)


class TimetablePeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimetablePeriod
        fields = [
            'index',
            'subject',
            'teachers',
            'cabinet',
        ]


class MainTimetableSerializer(serializers.HyperlinkedModelSerializer):
    periods = TimetablePeriodSerializer(many=True)
    week_type = serializers.ChoiceField(week_types, write_only=True)
    week_day = serializers.ChoiceField(week_days, write_only=True)

    def to_internal_value(self, data):
        native_value = super().to_internal_value(data)
        week_type = native_value.pop('week_type')
        week_day = native_value.pop('week_day')
        native_value['date'] = main_dates_map[week_type][week_day]
        return native_value

    def to_representation(self, instance):
        primitive_value = super().to_representation(instance)
        week_type, week_day = get_day_info(instance.date)
        primitive_value['week_type'] = week_type
        primitive_value['week_day'] = week_day
        return primitive_value

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        timetable = Timetable.objects.create(
            **validated_data, is_main=True
        )
        create_periods(periods, timetable)
        return timetable

    def update(self, instance, validated_data):
        instance.group = validated_data.pop('group', instance.group)
        instance.note = validated_data.pop('note', instance.note)
        instance.date = validated_data.pop('date', instance.date)
        periods = validated_data.pop('periods')
        instance.periods.all().delete()
        create_periods(periods, instance)
        instance.save()
        return instance

    class Meta:
        model = Timetable
        fields = [
            'url',
            'group',
            'is_main',
            'note',
            'periods',
            'week_day',
            'week_type',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ('is_main',)
        extra_kwargs = {
            'url': {'view_name': 'timetable-main-detail'}
        }


class ChangesTimetableSerializer(serializers.HyperlinkedModelSerializer):
    periods = TimetablePeriodSerializer(many=True)

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        timetable = Timetable.objects.create(**validated_data, is_main=False)
        create_periods(periods, timetable)
        return timetable

    def update(self, instance, validated_data):
        instance.group = validated_data.pop('group', instance.group)
        instance.date = validated_data.pop('date', instance.date)
        instance.note = validated_data.pop('note', instance.note)
        instance.date = validated_data.pop('date', instance.date)
        periods = validated_data.pop('periods')
        instance.periods.all().delete()
        create_periods(periods, instance)
        instance.save()
        return instance

    class Meta:
        model = Timetable
        fields = [
            'url',
            'group',
            'is_main',
            'periods',
            'date',
            'note',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ('is_main',)
        extra_kwargs = {
            'url': {'view_name': 'timetable-changes-detail'}
        }


class MixedTimetableSerializer(serializers.HyperlinkedModelSerializer):
    periods = TimetablePeriodSerializer(many=True)

    def to_representation(self, instance):
        primitive_value = super().to_representation(instance)
        if not instance.is_main:
            return primitive_value
        primitive_value.pop('date')
        week_type, week_day = get_day_info(instance.date)
        primitive_value['week_type'] = week_type
        primitive_value['week_day'] = week_day
        return primitive_value

    class Meta:
        model = Timetable
        fields = [
            'url',
            'group',
            'is_main',
            'periods',
            'note',
            'date',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'url': {'view_name': 'timetable-mixed-detail'}
        }
