from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    classes = serializers.HyperlinkedIdentityField(view_name="group-classes")

    class Meta:
        model = Group
        fields = [
            'id',
            'url',
            'name',
            'main_block',
            'classes',
            'created_at',
            'updated_at',
        ]
