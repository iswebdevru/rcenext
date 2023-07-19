from django.db.models import Q, Exists, OuterRef
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import django_filters
from apps.core.models import ScheduleType
from .filters import GroupBlockFilterBackend, ClassesScheduleFilter
from .models import ClassesSchedule
from .serializers import ClassesScheduleMixedSerializer
from .validators import validate_classes_query_params
from .service import get_day_info


class ClassesScheduleViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin
):
    queryset = ClassesSchedule.objects.all()
    serializer_class = ClassesScheduleMixedSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend, GroupBlockFilterBackend]
    filterset_class = ClassesScheduleFilter

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        query_params = validate_classes_query_params(request.query_params)
        schedule_type = query_params['type']
        if schedule_type == 'main':
            week_day = query_params['week_day']
            week_type = query_params['week_type']
            queryset = queryset.filter(
                type=ScheduleType.MAIN,
                week_day=week_day,
                week_type=week_type
            )
        elif schedule_type == 'changes':
            date = query_params['date']
            queryset = queryset.filter(
                type=ScheduleType.CHANGES,
                date=date
            )
        else:
            date = query_params['date']
            week_type, week_day = get_day_info(date)
            queryset = queryset.filter(
                Q(date=date) & Q(type=ScheduleType.CHANGES) |
                Q(week_day=week_day) & Q(week_type=week_type) & Q(type=ScheduleType.MAIN) &
                ~Exists(queryset.filter(
                    Q(group=OuterRef('group')) & Q(date=date) & Q(type=ScheduleType.CHANGES))
                )
            )
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
