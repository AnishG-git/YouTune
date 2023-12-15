from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.AppUser)
admin.site.register(models.Playlist)
admin.site.register(models.Song)
