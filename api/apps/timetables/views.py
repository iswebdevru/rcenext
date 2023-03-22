from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Timetable
from .serializers import MainTimetableSerializer
from .filters import DateFilterBackend
from apps.core.views import RelativeHyperlinkedModelViewSetMixin


class MainTimetableViewSet(RelativeHyperlinkedModelViewSetMixin, viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = MainTimetableSerializer
    filter_backends = [DateFilterBackend]

    def partial_update(self, request, pk=None):
        response = {'message': 'Update function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)
