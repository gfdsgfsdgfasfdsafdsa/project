# Generated by Django 4.1 on 2022-12-03 02:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='evaluationrubric',
            name='employee_type',
            field=models.CharField(choices=[('SALESEXECUTIVE', 'Sales Executive'), ('TECHNICIAN', 'Tecnician')], default='SALESEXECUTIVE', max_length=20),
        ),
    ]