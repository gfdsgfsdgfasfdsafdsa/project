# Generated by Django 4.1 on 2022-12-03 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0003_alter_evaluationrubric_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employeeevaluationdetail',
            name='rubric',
        ),
        migrations.AddField(
            model_name='employeeevaluationdetail',
            name='score',
            field=models.IntegerField(default=0),
        ),
    ]