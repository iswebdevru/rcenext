
from django.db.models import Exists, Q, OuterRef
from rest_framework import filters, serializers
from .service import get_day_info, main_dates_map, week_days, week_types


class WeekDayFilterGetParamsSerializer(serializers.Serializer):
    week_day = serializers.ChoiceField(week_days)
    week_type = serializers.ChoiceField(week_types)


class DateFilterGetParamsSerializer(serializers.Serializer):
    date = serializers.DateField()


class ClassesScheduleMixedGetParamsSerializer(serializers.Serializer):
    date = serializers.DateField()


class GroupBlockFilterGetParamsSerializer(serializers.Serializer):
    block = serializers.ChoiceField([1, 6], allow_blank=True)


class WeekDayFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        serializer = WeekDayFilterGetParamsSerializer(
            data=request.query_params
        )
        if serializer.is_valid():
            date = main_dates_map[serializer.validated_data['week_type']
                                  ][serializer.validated_data['week_day']]
            return queryset.filter(date=date)
        return queryset


class DateFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        serializer = DateFilterGetParamsSerializer(data=request.query_params)
        if serializer.is_valid():
            return queryset.filter(date=serializer.validated_data['date'])
        return queryset


class ClassesScheduleMixedFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        serializer = DateFilterGetParamsSerializer(
            data=request.query_params
        )
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['date']
        week_type, week_day = get_day_info(date)
        main_date = main_dates_map[week_type][week_day]
        return queryset.filter(
            Q(date=date) | Q(date=main_date) & ~Exists(
                queryset.filter(Q(group=OuterRef('group')) & Q(date=date))
            )
        )


class GroupBlockFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        serializer = GroupBlockFilterGetParamsSerializer(
            data=request.query_params)
        serializer.is_valid(raise_exception=True)
        block = serializer.validated_data['block']
        if block == 1:
            return queryset.filter(group__main_block__lt=6)
        if block == 6:
            return queryset.filter(group__main_block=6)
        return queryset
