from . import views
from django.urls import path

urlpatterns = [
    path('', views.index, name="index"),
    path('api/weather/', views.weather_api, name='weather_api'),
]
