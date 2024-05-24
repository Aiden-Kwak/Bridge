from rest_framework import serializers
from .models import DiaryApp

class DiarySerializer(serializers.ModelSerializer) :
    class Meta :
        model = DiaryApp        # product 모델 사용
        fields = ['id', 'writer', 'title', 'content','gpt_advise','gpt_content','gpt_recommend','created_at']