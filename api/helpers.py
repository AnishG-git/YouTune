import os
from django.conf import settings
def create_user_directories(user):
    # Get the username
    username = user.username

    # Define the paths for the user's folders
    user_media_root = os.path.join(settings.MEDIA_ROOT, username)
    songs_folder = os.path.join(user_media_root, 'songs')
    temp_folder = os.path.join(user_media_root, 'temp')

    # Create the directories if they don't exist
    os.makedirs(user_media_root, exist_ok=True)
    os.makedirs(songs_folder, exist_ok=True)
    os.makedirs(temp_folder, exist_ok=True)