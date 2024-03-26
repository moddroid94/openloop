from django import forms
from .models import Pack


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={'directory': True, 'webkitdirectory': True}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class FileFieldForm(forms.Form):
    file_field = MultipleFileField()


class PackForm(forms.ModelForm):
    drums = MultipleFileField()
    melodies = MultipleFileField()
    vocals = MultipleFileField()
    sfxs = MultipleFileField()
    ambiences = MultipleFileField()

    class Meta:
        model = Pack
        fields = "__all__"
