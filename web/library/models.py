from django.db import models
from django.utils.translation import gettext_lazy as _
from pathlib import Path
from taggit.managers import TaggableManager
import logging


logger = logging.getLogger(__name__)
# Create your models here.


def get_save_path(instance, filename):
    return 'uploads/{0}/Sounds/{1}/{2}'.format(instance.pack, instance.category, filename)


def get_img_save_path(instance, filename):
    return 'uploads/{0}/Artworks/{1}'.format(instance.name, filename)


class Pack(models.Model):
    class packs(models.TextChoices):
        SAMPLEKIT = "SK", _("Sample Kit")
        PRODKIT = "PK", _("Prod. Kit")
        DRUMKIT = "DK", _("Drum Kit")

    type = models.CharField(max_length=3, choices=packs) # type: ignore
    name = models.CharField(max_length=100, unique=True)
    author = models.CharField(max_length=100)
    cover = models.ImageField(upload_to=get_img_save_path)
    tags = TaggableManager()

    def __str__(self):
        return f"{self.name}"


class Sample(models.Model):
    class categories(models.TextChoices):
        DRUMS = "DR", _("Drums")
        MELODIES = "ML", _("Melodies")
        VOCALS = "VL", _("Vocals")
        SFXS = "FX", _("Sfxs")
        AMBIENCES = "AB", _("Ambiences")

    pack = models.ForeignKey(Pack, on_delete=models.CASCADE, related_name="samples", to_field="name")
    category = models.CharField(max_length=3, choices=categories) # type: ignore
    file = models.FileField(upload_to=get_save_path)
    name = models.CharField(max_length=100, blank=True)
    tags = TaggableManager()

    class Meta:
        ordering = ["name", "pack", "category"]

    def __str__(self):
        return f"{self.file}"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.name = Path(self.file.url).name
        super().save(*args, **kwargs)
