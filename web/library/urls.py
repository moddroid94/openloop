from django.urls import URLPattern, path
from .views import SampleLibraryList

urlpatterns = [
    path('sample', SampleLibraryList.as_view(), name="SampleList")
]
