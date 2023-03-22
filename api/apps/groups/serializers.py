from rest_framework import serializers, validators
from .models import Group


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = [
            'url',
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
