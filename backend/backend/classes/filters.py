
from rest_framework import filters, serializers
import django_filters


class GroupBlockFilterGetParamsSerializer(serializers.Serializer):
    block = serializers.ChoiceField([1, 6, -1], default=-1)


class GroupBlockFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        serializer = GroupBlockFilterGetParamsSerializer(
            data=request.query_params
        )
        serializer.is_valid(raise_exception=True)
        block = serializer.validated_data['block']
        if block == 6:
            return queryset.filter(group__main_block=6)
        if block == 1:
            return queryset.filter(group__main_block__lt=6)
        return queryset


class ClassesScheduleFilter(django_filters.FilterSet):
    group__name = django_filters.CharFilter(
        field_name='group__name', lookup_expr='icontains')
    cabinet = django_filters.CharFilter(
        field_name='periods__cabinet',
        lookup_expr='istartswith',
        distinct=True
    )
