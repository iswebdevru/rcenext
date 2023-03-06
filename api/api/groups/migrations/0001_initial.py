# Generated by Django 4.1.7 on 2023-03-02 15:25

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('slug', models.SlugField(max_length=255, primary_key=True, serialize=False)),
                ('specialization', models.CharField(max_length=55, validators=[django.core.validators.RegexValidator(message='Разрешены только буквы кириллицы', regex='[а-яА-Я]+')])),
                ('course', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)])),
                ('index', models.PositiveSmallIntegerField()),
                ('main_block', models.PositiveBigIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_commercial', models.BooleanField()),
            ],
        ),
        migrations.AddConstraint(
            model_name='group',
            constraint=models.UniqueConstraint(models.F('specialization'), models.F('course'), models.F('index'), name='unique_group_name'),
        ),
    ]