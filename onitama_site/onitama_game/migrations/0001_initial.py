# Generated by Django 2.0.6 on 2018-07-09 05:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='GameCard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cardholder', models.CharField(choices=[('R', 'Red'), ('B', 'Blue'), ('N', 'Neutral')], max_length=1)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onitama_game.Card')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onitama_game.Game')),
            ],
        ),
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player', models.CharField(choices=[('R', 'Red'), ('B', 'Blue')], max_length=1)),
                ('turn', models.PositiveSmallIntegerField()),
                ('start', models.CharField(choices=[('A1', 'A1'), ('A2', 'A2'), ('A3', 'A3'), ('A4', 'A4'), ('A5', 'A5'), ('B1', 'B1'), ('B2', 'B2'), ('B3', 'B3'), ('B4', 'B4'), ('B5', 'B5'), ('C1', 'C1'), ('C2', 'C2'), ('C3', 'C3'), ('C4', 'C4'), ('C5', 'C5'), ('D1', 'D1'), ('D2', 'D2'), ('D3', 'D3'), ('D4', 'D4'), ('D5', 'D5'), ('E1', 'E1'), ('E2', 'E2'), ('E3', 'E3'), ('E4', 'E4'), ('E5', 'E5')], max_length=2)),
                ('end', models.CharField(choices=[('A1', 'A1'), ('A2', 'A2'), ('A3', 'A3'), ('A4', 'A4'), ('A5', 'A5'), ('B1', 'B1'), ('B2', 'B2'), ('B3', 'B3'), ('B4', 'B4'), ('B5', 'B5'), ('C1', 'C1'), ('C2', 'C2'), ('C3', 'C3'), ('C4', 'C4'), ('C5', 'C5'), ('D1', 'D1'), ('D2', 'D2'), ('D3', 'D3'), ('D4', 'D4'), ('D5', 'D5'), ('E1', 'E1'), ('E2', 'E2'), ('E3', 'E3'), ('E4', 'E4'), ('E5', 'E5')], max_length=2)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onitama_game.Card')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onitama_game.Game')),
            ],
            options={
                'ordering': ['turn'],
            },
        ),
        migrations.AddField(
            model_name='game',
            name='cards',
            field=models.ManyToManyField(through='onitama_game.GameCard', to='onitama_game.Card'),
        ),
        migrations.AlterUniqueTogether(
            name='move',
            unique_together={('game', 'turn')},
        ),
    ]