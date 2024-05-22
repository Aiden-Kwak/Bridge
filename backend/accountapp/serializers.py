from rest_framework import serializers
from .models import User, Profile

class AccountCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # 사용자 생성 로직
        user = User.objects.create_user(**validated_data)
        user.is_active = False  # 사용자를 비활성화 상태로 설정
        user.save()
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['nickname', 'profile_pic', 'bio', 'username']

    def update(self, instance, validated_data):
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.save()
        return instance
    