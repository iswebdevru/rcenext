from rest_framework import serializers
from .models import Teacher
from apps.subjects.models import Subject


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
            'subjects',
            'subjects_url',
            'created_at',
            'updated_at',
        ]
