from rest_framework import filters
from .service import week_days, week_types, db_dates_map


class DateFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        week_day = request.query_params.get('week_day')
        week_type = request.query_params.get('week_type')
        if week_day not in week_days or week_type not in week_types:
            return queryset
        date = db_dates_map[week_type][week_day]
        return queryset.filter(date=date)
