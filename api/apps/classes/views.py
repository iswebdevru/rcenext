import datetime
from django.db.models import Q, Exists, OuterRef
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import ClassSchedule
from .serializers import MainClassScheduleSerializer, ChangesClassScheduleSerializer, MixedClassScheduleSerializer
from .filters import WeekDayFilterBackend, DateFilterBackend
from .service import get_day_info, main_dates_map


class MainClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.filter(is_main=True)
    serializer_class = MainClassScheduleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [WeekDayFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ChangesClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.filter(is_main=False)
    serializer_class = ChangesClassScheduleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DateFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class MixedClassScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MixedClassScheduleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        changes_date = datetime.date.fromisoformat(date_str)
        week_type, week_day = get_day_info(changes_date)
        main_date = main_dates_map[week_type][week_day]
        return ClassSchedule.objects.exclude(Q(date=main_date) & Exists(ClassSchedule.objects.filter(group=OuterRef('group'))))