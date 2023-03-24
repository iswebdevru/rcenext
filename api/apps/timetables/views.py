import datetime
from django.db.models import Q, Exists, OuterRef
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Timetable
from .serializers import MainTimetableSerializer, ChangesTimetableSerializer, MixedTimetableSerializer
from .filters import WeekDayFilterBackend, DateFilterBackend
from .service import get_week_type_and_day, db_dates_map


class MainTimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.filter(is_main=True)
    serializer_class = MainTimetableSerializer
    filter_backends = [WeekDayFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ChangesTimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.filter(is_main=False)
    serializer_class = ChangesTimetableSerializer
    filter_backends = [DateFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class MixedTimetableViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MixedTimetableSerializer

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        changes_date = datetime.date.fromisoformat(date_str)
        week_type, week_day = get_week_type_and_day(changes_date)
        main_date = db_dates_map[week_type][week_day]
        return Timetable.objects.exclude(Q(date=main_date) & Exists(Timetable.objects.filter(group=OuterRef('group'))))
