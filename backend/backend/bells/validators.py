from rest_framework import serializers
from backend.shared.serializers import ScheduleTypeSerializer, DateSerializer
from backend.shared.models import WeekDay
from backend.shared.helpers import get_weekday
from .models import Bells


class BellsVariantSerializer(serializers.Serializer):
    variant = serializers.ChoiceField(
        Bells.Variant.choices, default=Bells.Variant.NORMAL)


class WeekDaySerializer(serializers.Serializer):
    week_day = serializers.ChoiceField(WeekDay.choices)


def validate_query_params(query_params):
    type_serializer = ScheduleTypeSerializer(data=query_params)
    type_serializer.is_valid(raise_exception=True)
    type = type_serializer.validated_data['type']
    variant_serializer = BellsVariantSerializer(data=query_params)
    variant_serializer.is_valid(raise_exception=True)
    variant = variant_serializer.validated_data['variant']
    if type == 'main':
        week_day_serializer = WeekDaySerializer(data=query_params)
        week_day_serializer.is_valid(raise_exception=True)
        week_day = week_day_serializer.validated_data['week_day']
        return {
            'type': type,
            'variant': variant,
            'week_day': week_day
        }
    date_serializer = DateSerializer(data=query_params)
    date_serializer.is_valid(raise_exception=True)
    date = date_serializer.validated_data['date']
    if type == 'changes':
        return {
            'type': type,
            'variant': variant,
            'date': date
        }
    return {
        'type': type,
        'variant': variant,
        'date': date,
        'week_day': get_weekday(date)
    }
