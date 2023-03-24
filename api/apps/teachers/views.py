from rest_framework import viewsets, filters
from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'first_name',
        'last_name',
        'patronymic',
    ]
