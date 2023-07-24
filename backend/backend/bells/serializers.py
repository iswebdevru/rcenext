from rest_framework import serializers
from .models import Bells, BellsPeriod


class BellsPeriodSerializer(serializers.HyperlinkedModelSerializer):
    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        if validated_data.get('has_break'):
            if not validated_data.get('period_from_after'):
                raise serializers.ValidationError(
                    {'period_from_after': 'This field is required.'})
            if not validated_data.get('period_to_after'):
                raise serializers.ValidationError(
                    {'period_to_after': 'This field is required.'})
        return validated_data

    def to_representation(self, instance):
        presentation = super().to_representation(instance)
        if not instance.has_break:
            presentation.pop('period_from_after')
            presentation.pop('period_to_after')
        return presentation

    class Meta:
        model = BellsPeriod
        fields = ['index', 'has_break', 'period_from', 'period_to',
                  'period_from_after', 'period_to_after']


class BellsSerializer(serializers.HyperlinkedModelSerializer):
    periods = BellsPeriodSerializer(many=True)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        if validated_data['type'] == 'main':
            if not validated_data.get('week_day'):
                raise serializers.ValidationError(
                    {'week_day': 'This field is required.'})
            if validated_data.get('date'):
                validated_data.pop('date')
        else:
            if not validated_data.get('date'):
                raise serializers.ValidationError(
                    {'date': 'This field is required.'})
            if validated_data.get('week_day'):
                validated_data.pop('week_day')
        return validated_data

    def to_representation(self, instance):
        presentation = super().to_representation(instance)
        if instance.type == 'main':
            presentation.pop('date')
        else:
            presentation.pop('week_day')

        return presentation

    def create(self, validated_data):
        periods = validated_data.pop('periods')
        if validated_data.get('type') == 'main':
            bells = Bells.objects.update_or_create(
                variant=validated_data.pop('variant'),
                week_day=validated_data.pop('week_day'),
                defaults=validated_data
            )[0]
        else:
            bells = Bells.objects.update_or_create(
                variant=validated_data.pop('variant'),
                date=validated_data.pop('date'),
                defaults=validated_data
            )[0]
        bells.periods.all().delete()
        for period in periods:
            BellsPeriod.objects.update_or_create(
                bells=bells,
                index=period.pop('index'),
                defaults=period
            )
        return bells

    class Meta:
        model = Bells
        fields = ['id', 'url', 'type', 'variant',
                  'week_day', 'date', 'periods']
