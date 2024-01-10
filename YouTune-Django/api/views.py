# api/views.py
from django.shortcuts import get_object_or_404
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
from .song_info import get_song_info, download_song, get_audio_url
from .serializers import AppUserSerializer
from .helpers import create_user_directories
from django.conf import settings
import os
from isodate import parse_duration
from dotenv import load_dotenv
load_dotenv()

# sign up function
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if username and password and email:
            # Create a new user
            if AppUser.objects.filter(username=username).exists():
                return Response({"response": "Username already exists"}, status=status.HTTP_201_CREATED)
            if AppUser.objects.filter(email=email).exists():
                return Response({"response": "Email already exists"}, status=status.HTTP_201_CREATED)
            AppUser.objects.create_user(username=username, password=password, email=email)
            # create_user_directories(user)
            # Initialize an empty playlist for the user
            # user.playlists.set([])  # Set an empty list of playlists
            print("user successfully registered\n")
            return Response({"response": "User registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"response": "Username, password, and email are required"}, status=status.HTTP_400_BAD_REQUEST)
        
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
def get_youtube_data(query):
    MAX_DURATION = 359
    try:
        req = query.data.get('query')
        api_key = os.environ.get('YT_API_KEY')
        youtube = build('youtube', 'v3', developerKey=api_key)
        request = youtube.search().list(
            part='snippet',
            q=req,
            type='video',
            maxResults=5
        )
        response = request.execute()
        videos = []
        for item in response['items']:
            try:
                video_id = item['id']['videoId']
                video_info = youtube.videos().list(
                    part='snippet,contentDetails',
                    id=video_id
                ).execute()['items'][0]
                iso_duration = video_info['contentDetails']['duration']
                duration = int(parse_duration(iso_duration).total_seconds())
                if (duration < MAX_DURATION):
                    title = video_info['snippet']['title']
                    artist = video_info['snippet']['channelTitle']
                    url = f'https://youtube.com/watch?v={video_id}'
                    videos.append({
                        'title': title,
                        'artist': artist,
                        'duration': duration,
                        'url': url
                    })
            except:
                print(f'Error playing: https://www.youtube.com/watch?v={video_id}')
        return Response(videos, status=status.HTTP_202_ACCEPTED)
    except Exception as e:
        return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def audio_convert(request):
    try:
        url = request.data.get('url')
        audio_url = get_audio_url(url)
        return Response({"audio_url": audio_url}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": e}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def refresh_playlist_song(request):
    try:
        user = request.user
        playlist_name = request.data.get('name')
        position = request.data.get('position')
        playlist = get_object_or_404(Playlist, user=user, name=playlist_name)
        song = playlist.songs.all()[position - 1]
        audio_url = get_audio_url(song.url)
        song.audio_url = audio_url
        song.save()
        playlist.save()

        return Response({"audio_url": audio_url}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": e}, status=status.HTTP_404_NOT_FOUND)

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
                audio_url = song_info["audio_url"],
                duration=song_info["duration"], 
                artist=song_info["uploader"],
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