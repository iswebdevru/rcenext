from rest_framework import serializers
from .models import Teacher


class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    # subjects = serializers.HyperlinkedIdentityField(
    # view_name='teacher-subjects')

    class Meta:
        model = Teacher
        fields = [
            'id',
            'url',
            'first_name',
            'last_name',
            'patronymic',
            'created_at',
            'updated_at',
            # 'subjects',
        ]
