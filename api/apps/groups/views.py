from rest_framework import viewsets, filters
from .models import Group
from .serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'specialization',
        'course',
        'index',
        'is_commercial',
    ]
