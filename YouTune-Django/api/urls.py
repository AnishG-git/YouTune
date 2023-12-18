from django.urls import path
from .views import register, user_login, user_logout, create_playlist, search_youtube, delete_playlist, add_to_playlist, delete_song, change_song_position, download_song_to_dir, get_user_data#, refresh_songs
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('make-playlist/', create_playlist, name='create_playlist'),
    path('delete-playlist/', delete_playlist, name='delete_playlist'),
    path('youtube-search/', search_youtube, name='search_youtube'),
    path('add-to-playlist/', add_to_playlist, name='add_to_playlist'),
    path('delete-song/', delete_song, name='delete_song'),
    path('update-song-position/', change_song_position, name='change_song_position'),
    path('download-song/', download_song_to_dir, name='download_song_to_dir'),
    #path('refresh-songs/', refresh_songs, name='refresh_songs'),
    path('user-data/', get_user_data, name='get_user_data')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)