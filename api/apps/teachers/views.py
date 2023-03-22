from rest_framework import viewsets, filters
from apps.core.views import RelativeHyperlinkedModelViewSetMixin
from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(RelativeHyperlinkedModelViewSetMixin, viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'first_name',
        'last_name',
        'patronymic',
    ]
