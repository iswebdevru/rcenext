from rest_framework import viewsets, filters
from .models import Subject
from .serializers import SubjectSerializer
from apps.core.views import RelativeHyperlinkedModelViewSetMixin


class SubjectViewSet(RelativeHyperlinkedModelViewSetMixin, viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
