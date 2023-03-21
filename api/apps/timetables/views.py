from rest_framework import viewsets, filters
from .models import Timetable
from .serializers import MainTimetableSerializer

# TODO: СДЕЛАТЬ ФИЛЬТРЫ ПО ТИПУ НЕДЕЛИ И ДНЮ НЕДЕЛИ


class MainTimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = MainTimetableSerializer
    # filter_backends = [filters.SearchFilter]
    # search_fields = [
    #     'first_name',
    #     'last_name',
    #     'patronymic',
    # ]
