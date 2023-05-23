from rest_framework import serializers
from apps.teachers.models import Teacher
from .models import ClassesSchedule, ClassesSchedulePeriod


class ClassesScheduleCreateTypeSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        ['main', 'changes']
    )


class ClassesScheduleTypeSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        ['main', 'changes', 'mixed'], default='mixed'
    )


class ClassesScheduleMainTypeSerializer(serializers.Serializer):
    week_day = serializers.ChoiceField(ClassesSchedule.WeekDay.choices)
    week_type = serializers.ChoiceField(ClassesSchedule.WeekType.choices)


def create_period(period_data, timetable):
    teachers = period_data.pop('teachers')
    period_record, _ = ClassesSchedulePeriod.objects.update_or_create(
        index=period_data.pop('index'),
        timetable=timetable,
        defaults=period_data,
    )
    period_record.teachers.clear()
    period_record.teachers.add(*teachers)


def create_periods(periods_data, timetable):
    for period_data in periods_data:
        create_period(period_data, timetable)


class ClassesSchedulePeriodSerializer(serializers.HyperlinkedModelSerializer):
    teachers = serializers.HyperlinkedRelatedField(
        many=True, allow_null=True, queryset=Teacher.objects.all(), view_name='teacher-detail')

    class Meta:
        model = ClassesSchedulePeriod
        fields = [
            'index',
            'subject',
            'teachers',
            'cabinet',
        ]


class ClassesScheduleMixedSerializer(serializers.HyperlinkedModelSerializer):
    view = serializers.ChoiceField(
        ClassesSchedule.ViewMode.choices, required=False)
    date = serializers.DateField(required=False)
    week_day = serializers.ChoiceField(
        ClassesSchedule.WeekDay.choices, required=False)
    week_type = serializers.ChoiceField(
        ClassesSchedule.WeekType.choices, required=False)
    message = serializers.CharField(required=False)
    periods = ClassesSchedulePeriodSerializer(
        many=True, required=False)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        if validated_data['type'] == 'main':
            validated_data['view'] = 'table'
            if not validated_data.get('periods'):
                raise serializers.ValidationError({
                    'periods': 'This field is required.'
                })
            if not validated_data.get('week_day'):
                raise serializers.ValidationError({
                    'week_day': 'This field is required.'
                })
            if not validated_data.get('week_type'):
                raise serializers.ValidationError({
                    'week_type': 'This field is required.'
                })
            if validated_data.get('message'):
                validated_data.pop('message')
            if validated_data.get('date'):
                validated_data.pop('date')
            return validated_data
        view = validated_data.get('view')
        if not view:
            raise serializers.ValidationError({
                'view': 'This field is required.'
            })
        if not validated_data.get('date'):
            raise serializers.ValidationError({
                'date': 'This field is required.'
            })
        if view == 'table':
            if not validated_data.get('periods'):
                raise serializers.ValidationError({
                    'periods': 'This field is required.'
                })
            if validated_data.get('message'):
                validated_data.pop('message')
            return validated_data
        if not validated_data.get('message'):
            raise serializers.ValidationError({
                'message': 'This field is required.'
            })
        if validated_data.get('periods'):
            validated_data.pop('periods')
        return validated_data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.type == 'main':
            representation.pop('date')
            representation.pop('message')
            return representation
        representation.pop('week_day')
        representation.pop('week_type')
        if instance.view == 'table':
            representation.pop('message')
            return representation
        representation.pop('periods')
        return representation

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        timetable, _ = ClassesSchedule.objects.update_or_create(
            group=validated_data.pop('group'),
            date=validated_data.pop('date', None),
            week_day=validated_data.pop('week_day', None),
            week_type=validated_data.pop('week_type', None),
            defaults=validated_data
        )
        if validated_data['view'] == 'table':
            create_periods(periods, timetable)
        return timetable

    class Meta:
        model = ClassesSchedule
        fields = ['id', 'url', 'type', 'group',
                  'view', 'date', 'week_day',
                  'week_type', 'periods', 'message'
                  ]
