from rest_framework import serializers, validators
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'id',
            'specialization',
            'course',
            'index',
            'main_block',
            'is_commercial',
            'created_at',
            'updated_at',
        ]
        validators = [
            validators.UniqueTogetherValidator(queryset=Group.objects.all(),
                                               fields=['specialization',
                                                       'course', 'index',],
                                               message='Название группы должно быть уникальным')
        ]
