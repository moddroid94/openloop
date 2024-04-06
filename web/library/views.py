import logging
from django.shortcuts import render
from rest_framework import generics
from .models import Sample, Pack
from .serializers import SampleSerializer
from logging import Logger
from taggit.managers import TaggableManager
from rest_framework import pagination, filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter

# Create your views here.
logger = Logger("default")


class SampleModelFilter(FilterSet):
    class Meta:
        model = Sample
        fields = {
            'category': ['icontains'],
            'name': ['icontains'],
            'pack__type': ['exact'],
        }
        exclude = ['tags']
        filter_overrides = {
            TaggableManager: {
                'filterset_class': CharFilter,
            },
        }


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class SampleLibraryList(generics.ListAPIView):
    categories = Sample.categories
    serializer_class = SampleSerializer
    pagination_class = StandardResultsSetPagination

    # filtering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = SampleModelFilter
    search_fields = ['name']
    ordering_fields = ['name', 'category', 'pack__type', 'duration']

    def get_queryset(self):
        return Sample.objects.all()
