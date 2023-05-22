from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters import rest_framework as drf_filters
from .models import ClassesSchedule
from .serializers import ClassesScheduleMainSerializer, ClassesScheduleChangesSerializer, ClassesScheduleMixedSerializer
from .filters import WeekDayFilterBackend, DateFilterBackend, ClassesScheduleMixedFilterBackend, GroupBlockFilterBackend


class ClassesScheduleMainViewSet(viewsets.ModelViewSet):
    queryset = ClassesSchedule.objects.filter(is_main=True)
    serializer_class = ClassesScheduleMainSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [WeekDayFilterBackend, GroupBlockFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ClassesScheduleChangesViewSet(viewsets.ModelViewSet):
    queryset = ClassesSchedule.objects.filter(is_main=False)
    serializer_class = ClassesScheduleChangesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DateFilterBackend, GroupBlockFilterBackend]

    def partial_update(self, request, pk=None):
        response = {
            'message': 'PATCH method is disabled due to implementation difficulties. Use PUT instead'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ClassesScheduleMixedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClassesSchedule.objects.all()
    serializer_class = ClassesScheduleMixedSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [drf_filters.DjangoFilterBackend,
                       ClassesScheduleMixedFilterBackend,
                       GroupBlockFilterBackend]
    filterset_fields = ['group__name']
