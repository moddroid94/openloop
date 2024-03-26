from rest_framework import serializers
from taggit.serializers import (TagListSerializerField,
                                TaggitSerializer)
from .models import Sample, Pack


class SampleSerializer(serializers.ModelSerializer):
    tags = TagListSerializerField()
    category_name = serializers.SerializerMethodField()

    def get_category_name(self, obj):
        val = [i for x, i in obj.categories.choices if x == obj.category]
        # set 0 as the input dict contains only one value and we don't pass a dict in frontend
        return val[0]

    class Meta:
        model = Sample
        fields = '__all__'
        depth = 1
