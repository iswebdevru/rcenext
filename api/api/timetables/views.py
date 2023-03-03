from rest_framework import viewsets
from .models import Timetable
from .serializers import TimetableSerializer


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
