# Generated by Django 4.1.7 on 2023-07-20 09:32

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bells', '0003_remove_bellsperiod_наличие двух дополнительных полей в случае, если указано has_break_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bellsperiod',
            name='period_from',
            field=models.DurationField(db_column='from', validators=[django.core.validators.MaxValueValidator(datetime.timedelta(seconds=86340))]),
        ),
        migrations.AlterField(
            model_name='bellsperiod',
            name='period_from_after',
            field=models.DurationField(blank=True, db_column='from_after', null=True, validators=[django.core.validators.MaxValueValidator(datetime.timedelta(seconds=86340))]),
        ),
        migrations.AlterField(
            model_name='bellsperiod',
            name='period_to',
            field=models.DurationField(db_column='to', validators=[django.core.validators.MaxValueValidator(datetime.timedelta(seconds=86340))]),
        ),
        migrations.AlterField(
            model_name='bellsperiod',
            name='period_to_after',
            field=models.DurationField(blank=True, db_column='to_after', null=True, validators=[django.core.validators.MaxValueValidator(datetime.timedelta(seconds=86340))]),
        ),
    ]
