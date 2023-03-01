from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'slug',
            'specialization',
            'course',
            'index',
            'main_block',
            'created_at',
            'updated_at',
        ]
