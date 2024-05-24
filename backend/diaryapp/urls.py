from django.urls import path
from .views import UserDiaryListAPIView, CreateDiaryAPIView, SearchDiaryTitleAPIView, SearchDiaryDateAPIView, DiaryDetailAPIView,CheckWeatherAPIView

app_name = 'diaryapp'

urlpatterns = [
    path('list/', UserDiaryListAPIView.as_view(), name='user_diaries'),
    path('user-diary/<int:pk>', DiaryDetailAPIView.as_view(), name='diary-detail'),
    path('create-diary', CreateDiaryAPIView.as_view(), name='create_diary'),
    path('search-title/<str:string>', SearchDiaryTitleAPIView.as_view(), name='search_title'),
    path('search-date/<str:date>', SearchDiaryDateAPIView.as_view(), name='search_date'),
    path('weather/<str:city>',CheckWeatherAPIView.as_view(),name='today_weather'),
]
