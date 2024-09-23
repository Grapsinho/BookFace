# Generated by Django 5.1.1 on 2024-09-23 18:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_sharedpost_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='shared_post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='posts.sharedpost'),
        ),
        migrations.AddField(
            model_name='like',
            name='shared_post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='posts.sharedpost'),
        ),
    ]
