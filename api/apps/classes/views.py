import datetime
from django.db.models import Q, Exists, OuterRef
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters import rest_framework as drf_filters
from .models import ClassesSchedule
from .serializers import ClassesScheduleMainSerializer, ClassesScheduleChangesSerializer, ClassesScheduleMixedSerializer, DateFilterGetParamsSerializer
from .filters import WeekDayFilterBackend, DateFilterBackend
from .service import get_day_info, main_dates_map


class ClassesScheduleMainViewSet(viewsets.ModelViewSet):
    queryset = ClassesSchedule.objects.filter(is_main=True)
    serializer_class = ClassesScheduleMainSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [WeekDayFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ClassesScheduleChangesViewSet(viewsets.ModelViewSet):
    queryset = ClassesSchedule.objects.filter(is_main=False)
    serializer_class = ClassesScheduleChangesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DateFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ClassScheduleMixedViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ClassesScheduleMixedSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [drf_filters.DjangoFilterBackend]
    filterset_fields = ['group__specialization', 'group__course',
                        'group__index', 'group__is_commercial', 'group__main_block']

    def get_queryset(self):
        serializer = DateFilterGetParamsSerializer(
            data=self.request.query_params
        )
        serializer.is_valid(raise_exception=True)
        week_type, week_day = get_day_info(serializer.validated_data['date'])
        main_date = main_dates_map[week_type][week_day]
        return ClassesSchedule.objects.exclude(Q(date=main_date) & Exists(ClassesSchedule.objects.filter(group=OuterRef('group'))))
