# Generated by Django 5.1.1 on 2024-10-05 19:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_alter_comment_post_alter_like_post'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sharedpost',
            options={'ordering': ['-created_at']},
        ),
    ]
