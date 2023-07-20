from django.http import Http404
from django.db.models import Q, Exists
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import mixins
from .models import Bells
from .validators import validate_query_params
from .serializers import BellsSerializer


class BellsViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin
):
    queryset = Bells.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = BellsSerializer

    # Here I break the rules of REST and return one entity instead of a list.
    # I think there is no reason to return a list of data. It is useless.
    def list(self, request):
        query_params = validate_query_params(request.query_params)
        try:
            if query_params['type'] == 'main':
                queryset = self.queryset.get(
                    Q(variant=query_params['variant']) & Q(week_day=query_params['week_day']))
            elif query_params['type'] == 'changes':
                queryset = self.queryset.get(
                    Q(variant=query_params['variant']) & Q(date=query_params['date']))
            else:
                queryset = self.queryset.get(Q(variant=query_params['variant']) & (Q(date=query_params['date']) | Q(
                    week_day=query_params['week_day']) & ~Exists(self.queryset.filter(Q(variant=query_params['variant']) & Q(date=query_params['date'])))))
        except Bells.DoesNotExist:
            raise Http404()
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)
