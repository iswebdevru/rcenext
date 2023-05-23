from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from apps.classes.serializers import ClassesScheduleMixedSerializer
from apps.classes.validators import validate_classes_query_params
from apps.classes.models import ClassesSchedule
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
        query_params = validate_classes_query_params(request)
        if query_params['type'] == 'changes':
            return Response(
                ClassesScheduleMixedSerializer(
                    get_object_or_404(
                        ClassesSchedule,
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
                        week_day=query_params['week_day'],
                        week_type=query_params['week_type']
                    ),
                    context={
                        'request': request
                    }
                ).data
            )
