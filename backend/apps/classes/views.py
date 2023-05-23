from django.db.models import Q, Exists, OuterRef
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import ClassesSchedule
from .serializers import ClassesScheduleMixedSerializer
from .validators import validate_classes_query_params
from .service import get_day_info


class ClassesScheduleViewSet(viewsets.ViewSet):
    queryset = ClassesSchedule.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request):
        query_params = validate_classes_query_params(request)
        schedule_type = query_params['type']
        if (schedule_type == 'main'):
            week_day = query_params['week_day']
            week_type = query_params['week_type']
            return Response(ClassesScheduleMixedSerializer(
                self.queryset.filter(
                    type=ClassesSchedule.ScheduleType.MAIN,
                    week_day=week_day,
                    week_type=week_type
                ),
                many=True,
                context={
                    'request': request
                }).data,
            )
        date = query_params['date']
        if (schedule_type == 'changes'):
            return Response(
                ClassesScheduleMixedSerializer(
                    self.queryset.filter(
                        type=ClassesSchedule.ScheduleType.CHANGES,
                        date=date
                    ),
                    many=True,
                    context={
                        'request': request
                    }
                ).data
            )
        week_type, week_day = get_day_info(date)
        return Response(
            ClassesScheduleMixedSerializer(
                self.queryset.filter(
                    Q(date=date) |
                    Q(week_day=week_day) & Q(week_type=week_type) &
                    ~Exists(self.queryset.filter(
                        Q(group=OuterRef('group')) & Q(date=date))
                    )
                ),
                many=True,
                context={
                    'request': request
                }
            ).data
        )

    def create(self, request):
        classes_serializer = ClassesScheduleMixedSerializer(
            data=request.data,
            context={
                'request': request
            }
        )
        classes_serializer.is_valid(raise_exception=True)
        classes_serializer.save()
        return Response(classes_serializer.data)

    def retrieve(self, request, pk=None):
        return Response(ClassesScheduleMixedSerializer(self.queryset.get(id=pk), context={'request': request}).data)

    def destroy(self, request, pk=None):
        self.queryset.get(id=pk).delete()
        return Response({'status': 'success'})
