import datetime
from rest_framework import filters
from .serializers import WeekDayFilterGetParamsSerializer, DateFilterGetParamsSerializer
from .service import main_dates_map


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
