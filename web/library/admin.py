from typing import Any
from django.contrib import admin
from .forms import PackForm
from django.conf import settings
from taggit.managers import TaggableManager
from taggit.models import Tag

# Register your models here.
from .models import Pack, Sample

import logging


logger = logging.getLogger(__name__)


class SampleAdminInline(admin.TabularInline):
    model = Sample


@admin.register(Pack)
class PackAdmin(admin.ModelAdmin):
    form = PackForm

    def save_model(self, request: Any, obj: Any, form: Any, change: Any) -> None:
        super().save_model(request, obj, form, change)
        jtags = set()
        for i in request.POST["tags"].split(","):
            jtags.add(str(i).replace(" ",""))
        for v, n in Sample.categories.choices:
            files = request.FILES.getlist(n.lower())
            for f in files:
                instance = Sample(file=f, pack=obj, category=v)
                instance.save()
                instance.tags.set(tags= jtags)
                


@admin.register(Sample)
class SampleAdmin(admin.ModelAdmin):
    pass
