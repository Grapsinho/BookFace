# Generated by Django 5.1.1 on 2024-09-06 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='static/media/avatars/default-boy-avatar.jpg', upload_to='avatars/'),
        ),
    ]
