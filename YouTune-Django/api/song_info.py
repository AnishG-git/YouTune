from functools import wraps
from pytube import YouTube
from django.conf import settings
from rest_framework.response import Response
import asyncio
import os

def get_song_info(video_url):
    try:
        # Create a YouTube object
        yt = YouTube(video_url)
        audio_stream = yt.streams.filter(only_audio=True).order_by("abr")[-1]
        song_info = {
            "duration": yt.length,
            "uploader": yt.author,
            "audio_url": audio_stream.url,
            "title": yt.title
        }
        return song_info
    except Exception as e:
        print("Error:", e)
        return None

def get_filename(video_url):
    start_index = video_url.find('=')
    end_index = video_url.find('&', start_index)
    if start_index != -1:
        if end_index != -1:
            video_id = video_url[start_index + 1:end_index]
        else:
            video_id = video_url[start_index + 1:]
        print(video_id)
        return video_id
    else:
        print("Video ID not found in the URL.")

def download_song(video_url, user, in_playlist=False):
    try:
        yt = YouTube(video_url)
        if yt.length > 400:
            return Response({"error": "song is too long"})
        audio_streams = yt.streams.filter(only_audio=True, file_extension="mp4").order_by("abr").desc()
        video_id = get_filename(video_url)
        # Define the target folder based on whether it's in a playlist or not
        if in_playlist:
            target_folder = f'media/{user.username}/songs'
        else:
            target_folder = f'media/{user.username}/temp'

        # Check if a file with the same name already exists in the target folder
        file_path = os.path.join(settings.BASE_DIR, target_folder)
        full_file_path = f'{file_path}/{video_id}.mp3'
        if os.path.exists(full_file_path):
            print(f"File '{video_id}.mp3' already exists in the folder, skipping download.")
            return Response({"message": f"File '{video_id}.mp3' already exists in the folder, skipping download."})
        else:
            audio_streams.first().download(output_path=file_path, filename=f'{video_id}.mp3')
            print(f"Downloaded '{video_id}.mp3' to '{target_folder}'.")
            return Response({"message": f"Downloaded '{video_id}.mp3' to '{target_folder}'."})
    except Exception as e:
        print(e)
        return Response({"error": f"Failed to download due to {e} or invalid url"})

