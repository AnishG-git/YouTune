from rest_framework import serializers
from .models import AppUser, Playlist, Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        # took out 'audio_url' element
        fields = ['id', 'title', 'url', 'audio_url', 'duration', 'artist', 'position']

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(source='song_set', many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['name', 'songs']

class AppUserSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(source='playlist_set', many=True, read_only=True)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'playlists']
