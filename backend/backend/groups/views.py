from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from backend.classes.serializers import ClassesScheduleMixedSerializer
from backend.classes.validators import validate_classes_query_params
from backend.classes.models import ClassesSchedule, ScheduleType
from .models import Group
from .serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'main_block']

    @action(detail=True, methods=['GET'])
    def classes(self, request, pk=None):
        query_params = validate_classes_query_params(request.query_params)
        if query_params['type'] == 'changes':
            return Response(
                ClassesScheduleMixedSerializer(
                    get_object_or_404(
                        ClassesSchedule,
                        type=ScheduleType.CHANGES,
                        group__id=pk,
                        date=query_params['date']
                    ),
                    context={
                        'request': request
                    }
                ).data
            )
        if query_params['type'] == 'main':
            return Response(
                ClassesScheduleMixedSerializer(
                    get_object_or_404(
                        ClassesSchedule,
                        group__id=pk,
                        type=ScheduleType.MAIN,
                        week_day=query_params['week_day'],
                        week_type=query_params['week_type']
                    ),
                    context={
                        'request': request
                    }
                ).data
            )
        try:
            return Response(
                ClassesScheduleMixedSerializer(
                    ClassesSchedule.objects.get(
                        group__id=pk,
                        type=ClassesSchedule.ScheduleType.CHANGES,
                        date=query_params['date']
                    ),
                    context={
                        'request': request
                    }
                ).data
            )
        except:
            return Response(
                ClassesScheduleMixedSerializer(
                    get_object_or_404(
                        ClassesSchedule,
                        group__id=pk,
                        type=ClassesSchedule.ScheduleType.MAIN,
                        week_day=query_params['week_day'],
                        week_type=query_params['week_type']
                    ),
                    context={
                        'request': request
                    }
                ).data
            )
