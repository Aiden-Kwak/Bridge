from django.urls import path, re_path
from django.views.generic import RedirectView
from .views import AccountCreateAPI, ActivateAccountAPI, LoginAPI, LogoutAPI, UserProfileAPI

app_name = 'accountapp'

urlpatterns = [
    path('signup/', AccountCreateAPI.as_view(), name='create'),
    path('activate/<str:uidb64>/<str:token>/', ActivateAccountAPI.as_view(), name='activate'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('profile/<slug:slug>', UserProfileAPI.as_view(), name='profile'),
    #re_path(r'^pwreset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', RedirectView.as_view(url='http://localhost:5173/password-reset/%(uidb64)s/%(token)s')),
]