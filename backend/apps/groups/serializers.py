from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = [
            'url',
            'name',
            'main_block',
            'created_at',
            'updated_at',
        ]
