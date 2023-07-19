# Generated by Django 4.1.7 on 2023-07-19 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bells', '0002_bellsperiod_номер звонка на пару должен быть уникальным'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='bellsperiod',
            name='Наличие двух дополнительных полей в случае, если указано has_break',
        ),
        migrations.AddConstraint(
            model_name='bellsperiod',
            constraint=models.CheckConstraint(check=models.Q(('has_break', False), models.Q(('has_break', True), ('period_from_after__isnull', False), ('period_to_after__isnull', False)), _connector='OR'), name='Наличие двух дополнительных полей в случае, если указано has_break'),
        ),
    ]
