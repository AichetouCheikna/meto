from django.shortcuts import render

# Create your views here.
import requests
from django.http import JsonResponse
from django.conf import settings

def weather_api(request):
    city = request.GET.get('city', '')
    api_key = '942af425a4eda5894d95806ed6270b57'
    api_url = 'https://api.openweathermap.org/data/2.5/weather'
    
    if city:
        response = requests.get(f"{api_url}?q={city}&appid={api_key}&units=metric")
        if response.status_code == 200:
            return JsonResponse(response.json(), safe=False)
        else:
            return JsonResponse({'error': 'City not found'}, status=404)
    return JsonResponse({'error': 'No city provided'}, status=400)

def index(request):
    return render(request, 'index.html')