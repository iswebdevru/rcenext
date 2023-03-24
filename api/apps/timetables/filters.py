import datetime
from django.db.models import Case, When, Exists, OuterRef
from django.db import connection
from rest_framework import filters
from .service import week_days, week_types, main_dates_map, get_day_info


class WeekDayFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        week_day = request.query_params.get('week_day')
        week_type = request.query_params.get('week_type')
        if week_day not in week_days or week_type not in week_types:
            return queryset
        date = main_dates_map[week_type][week_day]
        return queryset.filter(date=date)


class DateFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        try:
            date_str = request.query_params.get('date')
            date = datetime.date.fromisoformat(date_str)
            return queryset.filter(date=date)
        except:
            return queryset
