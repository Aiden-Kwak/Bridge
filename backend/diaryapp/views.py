from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import DiaryApp
from .serializers import DiarySerializer

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain
#from decouple import config
import requests
import datetime
from django.http import JsonResponse

# Load OPENAI_API_KEY from environment variables
#OPENAI_API_KEY = config('OPENAI_API_KEY')


#인증된 사용자가 작성한 모든 일기를 가져오는 기능을 처리
class UserDiaryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        diaries = DiaryApp.objects.filter(writer=request.user)       
        serializer = DiarySerializer(diaries, many=True)
        return Response(serializer.data)

# 특정 pk를 Diary를 get하는 것   
class DiaryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk): 
        diary = get_object_or_404(DiaryApp, pk=pk)
        serializer = DiarySerializer(diary)
        return Response(serializer.data)

#오늘과 내일의 날씨 데이터 추출 
class CheckWeatherAPIView(APIView):
    permission_classes = [IsAuthenticated]
    API_KEY = ""
    country_code = 'KR'
    def get(self, request, city):
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city},{self.country_code}&appid={self.API_KEY}&units=metric'
        response = requests.get(url)
        if response.status_code != 200:
            temp_url = f'http://api.openweathermap.org/data/2.5/forecast?q=seoul,{self.country_code}&appid={self.API_KEY}&units=metric'
            response = requests.get(temp_url)
        data = response.json()
        if 'list' in data:
            today = datetime.datetime.today().date()
            today_weather_list = [entry for entry in data['list'] if datetime.datetime.fromtimestamp(entry['dt']).date() == today]
            average_temp = sum(entry['main']['temp'] for entry in today_weather_list) / len(today_weather_list)
            weather_descriptions = [entry['weather'][0]['description'] for entry in today_weather_list]
            main_weather = max(set(weather_descriptions), key=weather_descriptions.count)
            is_rain = any('rain' in entry for entry in today_weather_list)
            is_cloudy = any('cloud' in entry['weather'][0]['description'].lower() for entry in today_weather_list)
            is_snow = any('snow' in entry for entry in today_weather_list)
            response_data = {
                '평균기온' : average_temp,
                '주요 날씨 상태' : main_weather,
                '구름 발생' : is_cloudy,
                '비 발생' : is_rain,
                '눈 발생' : is_snow,
                '도시명' : city,
            }
            return JsonResponse(response_data)
    
    def tomorrow_weather(self,city):
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city},{self.country_code}&appid={self.API_KEY}&units=metric'
        response = requests.get(url)
        if response.status_code!=200:
            temp_url = f'http://api.openweathermap.org/data/2.5/forecast?q=seoul,{self.country_code}&appid={self.API_KEY}&units=metric'
            response = requests.get(temp_url)
        data = response.json()
        today = datetime.datetime.today()
        tomorrow = today + datetime.timedelta(days=1)
        tomorrow_date = tomorrow.date()
        tomorrow_weather_list = [entry for entry in data['list'] if datetime.datetime.fromtimestamp(entry['dt']).date() == tomorrow_date]
        average_temp = sum(entry['main']['temp'] for entry in tomorrow_weather_list) / len(tomorrow_weather_list)
        weather_descriptions = [entry['weather'][0]['description'] for entry in tomorrow_weather_list]
        main_weather = max(set(weather_descriptions), key=weather_descriptions.count)
        is_rain = any('rain' in entry for entry in tomorrow_weather_list)
        is_cloudy = any('cloud' in entry['weather'][0]['description'].lower() for entry in tomorrow_weather_list)
        is_snow = any('snow' in entry for entry in tomorrow_weather_list)
        response_data = {
                '평균기온' : average_temp,
                '주요 날씨 상태' : main_weather,
                '구름 발생' : is_cloudy,
                '비 발생' : is_rain,
                '눈 발생' : is_snow,
            }
        return response_data

        

#일기의 제목,내용,수면시간을 한 문장으로 합쳐서 gpt한테 보내는..?
class CreateDiaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def diary_generator(self,content):
        chat = ChatOpenAI(temperature=0)
        template = '''
        당신은 우울증 환자의 정신 건강 증진을 위한 일기 수정 전문 인공지능입니다.
        당신의 주된 임무는 우을증 환자의 일기에서 나타나는 부정적인 감정이나 상황을 인식하고 긍정적인 표현으로 수정하는 것입니다.
        당신에게 과장된 표현은 허용하지만 거짓말은 허용하지 않습니다.  
        예를 들어 날씨가 흐려 원작자가 우울함을 느꼈다는 내용을 오늘은 날씨가 맑아 기분이 좋았다라는 내용으로 수정하면 안됩니다.
        또한 지나치게 부정적인 상황에 대한 언급을 삭제하고 하루 일과 중. 원작자가 행복을 느낀 순간으로 내용을 대신합니다.
        다른 사람이 수정된 일기를 읽었을 때 그들은 일기를 쓴 사람이 기분 좋은 하루를 보냈고 밝은 에너지를 가졌다는 것을 느끼기를 바랍니다.
        원작자가 현실감을 느끼도록 일기 원본의 문체(하십시오체, 해체 등)를 보존하기 바랍니다.
        다시 한 번 강조합니다. 당신의 주된 임무는 일기를 이전보다 긍정적인 내용으로 수정함과 동시에 원작자의 문체를 유지하는 것입니다.
        모든 응답은 반드시 일기형식으로 작성합니다. 즉, 고칠것이 없는 일기라도 일기 형식의 글을 돌려주어야 합니다.
        '''

        system_message_prompt = SystemMessagePromptTemplate.from_template(template)
        human_template="{text}"
        human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])
        chatchain = LLMChain(llm=chat, prompt=chat_prompt)
        result = chatchain.run(text=content)
        return result

    def advise_generator(self,content):
        template = '''
        당신은 일기를 통해 심리를 분석하고 개선책을 제시하는 전문 AI입니다.
        당신의 주된 임무는 일기에서 나타나는 작성자의 심리상태를 파악하고 작성자의 정신 건강을 위한 적절한 조언을 해주는 것입니다.
        작성자가 우울하거나 슬픈 상태라면 그들의 아픔에 공감해주는 말을 해주어야하고 작성자가 기쁜 상태라면 그들의 즐거움에 공감하는 말을 해주어야 합니다.
        만약 작성자의 평범한 날을 보냈다면 일기에 작성된 평범한 일에서 긍정적인 부분을 찾고 의미를 부여해주어야 합니다.
        또한, 작성자의 생활 패턴이나 일기에서 나타난 사건 중 작성자의 심리 상태를 악화시킬 수 있는 부분이 있다면 반드시 개선책을 제시해주어야 합니다.
        반대로 작성자의 생활 패턴이나 일기에서 나타난 사건 중 작성자의 심리 상태에 도움이 되는 부분이 있다면 반드시 이러한 행위에 대해 칭찬해주어야 합니다.
        당신이 작성하는 모든 문장은 '-아요,-어요'와 같은 해요체를 사용합니다.
        '''
        chat = ChatOpenAI(temperature=0)
        system_message_prompt = SystemMessagePromptTemplate.from_template(template)
        human_template="{text}"
        human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])
        chatchain = LLMChain(llm=chat, prompt=chat_prompt)
        advice = chatchain.run(text=content)
        return advice
    
    def recommand_generator(self,content,city):
        template = '''
        당신은 일기와 날씨를 바탕으로 정신 건강 증진을 위한 활동을 추천하는 전문 AI입니다.
        당신의 주된 임무는 작성자의 일기에 나타난 심리상태를 정확히 파악하고, 내일의 날씨를 고려하여 작성자의 기분을 환기시킬 수 있는 활동을 추천하는 것입니다.
        예를 들어, 작성자가 우울한 하루를 보냈고 내일 비가 온다면, 야외활동보다는 코미디 영화 시청과 같은 실내에서 할 수 있는 활동을 추천합니다.
        모든 문장은 '-아요, -어요'와 같은 해요체를 사용해 작성합니다.
        '''
        weather = CheckWeatherAPIView()
        tomorrow_weather = weather.tomorrow_weather(city)
        weather_description = f'''
        내일의 날씨는 다음과 같습니다. 
        평균기온 : {tomorrow_weather["평균기온"]}.
        구름 발생 : {tomorrow_weather["구름 발생"]}
        주요 날씨 상태 : {tomorrow_weather["주요 날씨 상태"]}
        비 발생 : {tomorrow_weather["비 발생"]}
        눈 발생 : {tomorrow_weather["눈 발생"]}
        ''' + "\n"

        chat = ChatOpenAI(temperature=0)
        system_message_prompt = SystemMessagePromptTemplate.from_template(template)
        human_template="{text}"
        human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])
        chatchain = LLMChain(llm=chat, prompt=chat_prompt)
        content = weather_description + "\n" + content 
        advice = chatchain.run(text=content)
        return advice

    def post(self, request):
        # 요청에서 데이터 가져오기
        title = request.data.get('title')
        content = request.data.get('content')
        writer = request.user
        city = request.data.get('city')
        gpt_content = self.diary_generator(content)
        gpt_advise = self.advise_generator(content) # advise_generator
        gpt_recommend = self.recommand_generator(content,city) #recommend generator
        # 모든 정보를 함께 저장
        diary = DiaryApp.objects.create(title=title, content=content, writer=writer, gpt_content=gpt_content,gpt_advise=gpt_advise,gpt_recommend=gpt_recommend)
        diary.save
        
        # 직렬화하고 응답 반환
        serializer = DiarySerializer(diary)
        return Response(serializer.data)


class SearchDiaryTitleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,string):
        diaries = DiaryApp.objects.filter(title__icontains=string,writer=request.user)
        serializer = DiarySerializer(diaries, many=True)
        return Response(serializer.data)
    
class SearchDiaryDateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,date):
        #query = request.GET.get('query', '')  # 검색어
        diaries = DiaryApp.objects.filter(created_at__date=date,writer=request.user)
        serializer = DiarySerializer(diaries, many=True)
        return Response(serializer.data)


