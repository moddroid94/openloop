from django.db import models
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import pre_save
from pathlib import Path
from taggit.managers import TaggableManager
import mutagen
import logging


logger = logging.getLogger(__name__)



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
        DRUMS = "drums", _("Drums")
        MELODIES = "melodies", _("Melodies")
        VOCALS = "vocals", _("Vocals")
        SFXS = "sfxs", _("Sfxs")
        AMBIENCES = "ambiences", _("Ambiences")


    # fields
    pack = models.ForeignKey(Pack, on_delete=models.CASCADE, related_name="samples", to_field="name")
    category = models.CharField(max_length=20, choices=categories) # type: ignore
    file = models.FileField(upload_to=get_save_path)

    # composite values
    duration = models.PositiveIntegerField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)

    # tags
    tags = TaggableManager()

    class Meta:
        ordering = ["name", "pack", "category"]

    def __str__(self):
        return f"{self.file}"

    def save(self, *args, **kwargs):
        # if not self.pk:
        #     self.name = Path(self.file.url).name
        #     update_fields = None
        # else:
        #     update_fields = True
        super().save(*args, **kwargs)


@receiver(pre_save, sender=Sample)
def set_composite_values(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExists:
        instance.name = Path(instance.file.url).name
        audio_info = mutagen.File(instance.file)
        instance.duration = round(audio_info.info.length)
    else:
        if not obj.file == instance.file:
            instance.name = Path(instance.file.url).name
            audio_info = mutagen.File(instance.file)
            logger.warning(audio_info.info.length)
            instance.duration = round(audio_info.info.length)
    