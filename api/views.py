# api/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from googleapiclient.discovery import build
from .models import AppUser
from .models import Playlist
from .models import Song
from .song_info import get_song_info, download_song
from .serializers import AppUserSerializer
from .helpers import create_user_directories
from django.conf import settings

# sign up function
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if username and password and email:
            # Create a new user
            user = AppUser.objects.create_user(username=username, password=password, email=email)
            create_user_directories(user)
            # Initialize an empty playlist for the user
            # user.playlists.set([])  # Set an empty list of playlists
            print("user successfully registered\n")
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Username, password, and email are required"}, status=status.HTTP_400_BAD_REQUEST)
        
# login function
@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        print(f'username: {username}, password: {password}')
        user = authenticate(request, username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
# logout function
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    print(f"{request.user.username} logging out")
    request.auth.delete()  # Invalidates the user's session
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# function to create playlist
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_playlist(request):
    playlist_name = request.data.get('name')
    if playlist_name:
        try:
            user = request.user
            if Playlist.objects.filter(user=user, name=playlist_name).exists():
                return Response({"message": "Playlist already exists"})
            playlist = Playlist.objects.create(user=user, name=playlist_name)
            return Response({"message": f"Playlist '{playlist.name}' created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"error": "must pass playlist's name as parameter 'name' in body of request"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_playlist(request):
    name = request.data.get('name')
    if name:    
        user = request.user
        try:
            playlist = Playlist.objects.get(user=user, name=name)
            playlist.delete()
            user.playlists.remove(playlist)  # Remove the playlist object, not just the name
            return Response({"message": f"{name} successfully deleted"})
        except Playlist.DoesNotExist:
            return Response({"message": "Playlist does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"error": "must pass playlist's name as parameter 'name' in body of request"})

@api_view(['POST'])
def search_youtube(request):
    try:
        query = request.data.get('query')                           # youtube query
        api_key = ""         # api key for youtube data api
        youtube = build('youtube', 'v3', developerKey=api_key)
        search_response = youtube.search().list(
            q=query,
            type='video',
            part='id,snippet',
            maxResults=5
        ).execute()                                                 # executing search with query
        songs = []                                                  # array that will hold songs and their info
        for item in search_response.get('items', []):               # looping through search results and gathering info
            video_id = item['id']['videoId']
            url=f'https://www.youtube.com/watch?v={video_id}'
            # test
            split_parts = url.split('=')
            vid_id = split_parts[-1].split('&')[0]
            print(vid_id)
            #
            print(video_id)
            song_info = get_song_info(video_url=url)
            songs.append(
                {
                "title": song_info["title"],
                "url": url,
                #"audio_url": song_info["audio_url"], 
                "duration": song_info["duration"], 
                "author": song_info["uploader"]
                }
            )
        return Response(songs, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_playlist(request):
    try:
        url = request.data.get('url')
        song_info = get_song_info(video_url=url)
        playlist_name = request.data.get('playlist_name')
        user = request.user
        playlist = Playlist.objects.get(user=user, name=playlist_name)
        num_songs = playlist.songs.count()
        try:
            song = Song.objects.create(
                user=user,
                title=song_info["title"], 
                url=url,
                duration=song_info["duration"], 
                songwriter=song_info["uploader"],
                position=num_songs+1,
                in_playlist=playlist
            )
            song_info.update({"song_id": song.id})
            song_info.update({"url": url})
            song_info.update({"position": num_songs+1})
            playlist.songs.add(song)  # Add the song to the playlist
        except Exception as e:
            return Response({"message": f"Song already exists in the playlist or error: {e}"})
        return Response(song_info, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"message": f"There was an error: {e}"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_song(request):
    try:
        song_id = request.data.get('song_id')  # Assuming you pass the song_id in the request data
        user = request.user
        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return Response({"message": "Song does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the song belongs to any playlist owned by the user
        if Playlist.objects.filter(user=user, songs=song).exists():
            playlist = song.in_playlist  # Get the playlist that the song belongs to
            position = song.position  # Get the position of the song
            
            song.delete()
            remaining_songs = playlist.songs.filter(position__gt=position)
            for remaining_song in remaining_songs:
                remaining_song.position -= 1
                print(f'{remaining_song.title} position: {remaining_song.position}, id: {remaining_song.id}')
                remaining_song.save()
            return Response({"message": "Song deleted successfully"})
        else:
            return Response({"message": "You do not have permission to delete this song"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_song_position(request):
    updated_info = request.data.get('updated_info')
    print(updated_info)
    for item in updated_info:
        try:
            song_id = item["song_id"]
            new_pos = item["new_position"]
            song = Song.objects.filter(id=song_id).first()  # Use `id` instead of `song_id`
            if song:
                song.position = new_pos
                song.save()  # Save the updated position to the database
            else:
                return Response({"error": f"Song with id {song_id} not found"})
        except Exception as e:
            return Response({"error": str(e)})
    return Response({"message": "Successfully updated song positions"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def download_song_to_dir(request):
    url = request.data.get('url')
    result = download_song(video_url=url, user=request.user, in_playlist=False)
    return result


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    print(settings.BASE_DIR)
    user = request.user
    serializer = AppUserSerializer(user)
    return Response(serializer.data)