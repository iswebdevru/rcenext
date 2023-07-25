from backend.shared.serializers import DateSerializer, ScheduleTypeSerializer
from .serializers import ClassesScheduleMainTypeSerializer
from .service import get_day_info


def validate_classes_query_params(query_params):
    type_serializer = ScheduleTypeSerializer(data=query_params)
    type_serializer.is_valid(raise_exception=True)
    schedule_type = type_serializer.validated_data['type']
    if (schedule_type == 'main'):
        main_serializer = ClassesScheduleMainTypeSerializer(
            data=query_params
        )
        main_serializer.is_valid(raise_exception=True)
        week_day = main_serializer.validated_data['week_day']
        week_type = main_serializer.validated_data['week_type']
        return {
            'type': schedule_type,
            'week_day': week_day,
            'week_type': week_type
        }
    date_serializer = DateSerializer(data=query_params)
    date_serializer.is_valid(raise_exception=True)
    date = date_serializer.validated_data['date']
    if (schedule_type == 'changes'):
        return {
            'type': schedule_type,
            'date': date
        }
    week_type, week_day = get_day_info(date)
    return {
        'type': schedule_type,
        'date': date,
        'week_day': week_day,
        'week_type': week_type,
    }
