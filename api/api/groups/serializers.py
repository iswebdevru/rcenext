from rest_framework import serializers, validators
from .models import Group
from .services import create_group_slug


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'slug',
            'specialization',
            'course',
            'index',
            'main_block',
            'is_commercial',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['slug']
        validators = [
            validators.UniqueTogetherValidator(queryset=Group.objects.all(),
                                               fields=['specialization',
                                                       'course', 'index',],
                                               message='Название группы должно быть уникальным')
        ]

    def create(self, validated_data):
        validated_data['slug'] = create_group_slug(
            specialization=validated_data['specialization'],
            course=validated_data['course'],
            index=validated_data['index'],
            is_commercial=validated_data['is_commercial']
        )
        print(repr(validated_data))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['slug'] = create_group_slug(
            specialization=validated_data['specialization'],
            course=validated_data['course'],
            index=validated_data['index'],
            is_commercial=validated_data['is_commercial']
        )
        return super().update(instance, validated_data)
