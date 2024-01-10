from django.db import models
from django.contrib.auth.models import AbstractUser


def user_song_upload_path(self, filename):
    username = self.username
    return f' media/{username}/songs/{filename}'

    return f'media/{username}/songs/{filename}'
class AppUser(AbstractUser):
    email = models.EmailField(unique=True)
    playlists = models.ManyToManyField('Playlist', blank=True)
    def __str__(self):
        return self.username

class Playlist(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100)
    songs = models.ManyToManyField('Song', blank=True)

    def __str__(self):
        return self.name

class Song(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True)
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, blank=False)
    url = models.URLField(blank=False)
    audio_url = models.URLField(blank=True, max_length=1000)
    audio = models.FileField(upload_to=user_song_upload_path(AppUser, title), blank=True, null=True)
    duration = models.IntegerField()
    artist = models.CharField(max_length=100)
    position = models.PositiveIntegerField(blank=True, null=True)
    in_playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title

