from rest_framework import serializers
from .models import Teacher
from api.subjects.models import Subject


class TeacherSerializer(serializers.ModelSerializer):
    subjects_url = serializers.HyperlinkedIdentityField(
        view_name="teacher-subjects")

    subjects = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Subject.objects.all())

    class Meta:
        model = Teacher
        fields = [
            'id',
            'first_name',
            'last_name',
            'patronymic',
            'created_at',
            'updated_at',
            'subjects_url',
            'subjects',
        ]
