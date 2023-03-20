from rest_framework import viewsets, mixins, response
from .models import Timetable
from .serializers import MainTimetableSerializer
from .service import convert_db_date


class TimetableViewSet(mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.DestroyModelMixin,
                       viewsets.GenericViewSet):

    queryset = Timetable.objects.all()
    serializer_class = MainTimetableSerializer
