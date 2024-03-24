import logging
from django.shortcuts import render
from rest_framework import generics
from .models import Sample, Pack
from .serializers import SampleSerializer
from logging import Logger


# Create your views here.
logger = Logger("default")


class SampleLibraryList(generics.ListAPIView):
    categories = Sample.categories
    serializer_class = SampleSerializer

    def get_queryset(self):
        return Sample.objects.all()
