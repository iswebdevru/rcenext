from rest_framework import serializers
from .models import Teacher


class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            'url',
            'first_name',
            'last_name',
            'patronymic',
            'subjects',
            'created_at',
            'updated_at',
        ]
