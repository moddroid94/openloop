import logging
from django.shortcuts import render
from rest_framework import generics
from .models import Sample, Pack
from .serializers import SampleSerializer
from logging import Logger
from rest_framework import pagination

# Create your views here.
logger = Logger("default")

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class SampleLibraryList(generics.ListAPIView):
    categories = Sample.categories
    serializer_class = SampleSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Sample.objects.all()
