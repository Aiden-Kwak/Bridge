from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.http import HttpResponseRedirect
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from .serializers import AccountCreateSerializer, ProfileSerializer
from accountapp.token import account_activation_token
from django.shortcuts import get_object_or_404
from .models import Profile
from django.contrib.auth import get_user_model

User=get_user_model()
class AccountCreateAPI(APIView):
    def post(self, request):
        serializer = AccountCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()

            current_site = get_current_site(request)
            mail_subject = '[ Bridge ]이메일 인증을 완료해주세요!'
            # URL 생성
            activation_link = request.build_absolute_uri(
                reverse('account:activate', kwargs={
                    'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': account_activation_token.make_token(user)
                })
            )
            html_message = render_to_string('accountapp/validation_email.html', {
                'user': user,
                'activation_link': activation_link,
            })
            to_email = serializer.validated_data['email']
            send_mail(
                subject=mail_subject, 
                message="", 
                from_email='develop.Bridge@gmail.com', 
                recipient_list=[to_email], 
                html_message=html_message
            )
            return Response({'message': '인증메일이 발송되었습니다. 링크를 통해 회원가입을 완료할 수 있습니다.'}, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
# 계정활성화
class ActivateAccountAPI(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            #print('이메일 인증이 성공하였습니다.') # 검토후 삭제
            #return Response({'message': '이메일 인증이 완료되었습니다.'})
            if settings.DEBUG:
                return HttpResponseRedirect('http://localhost:5173/login')
            else:
                return HttpResponseRedirect('https://bridge.com/login')
        else:
            if user is not None and user.is_active==False:
                user.delete()
            if settings.DEBUG:
                return HttpResponseRedirect('http://localhost:5173/login')
            else:
                return HttpResponseRedirect('https://bridge.com/login')
        
# 로그인
class LoginAPI(APIView):
    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            #token, created = Token.objects.get_or_create(user=user)
            return Response({"message": "로그인 성공"}, status=status.HTTP_200_OK)
            #return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "아이디/패스워드를 확인하세요."}, status=status.HTTP_400_BAD_REQUEST)
        

class LogoutAPI(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    def post(self, request):
        logout(request) 
        return Response({"message": "로그아웃 되었습니다."}, status=status.HTTP_200_OK)

class UserProfileAPI(APIView):
    permissions_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({"username": user.username, "email": user.email}, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = get_object_or_404(User, username=id)
        if request.user != user:
            return Response({'error': '권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)
        profile, created = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)