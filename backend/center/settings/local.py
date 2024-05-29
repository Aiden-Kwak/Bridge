import environ
from .base import *

env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(
    env_file=os.path.join(BASE_DIR, '.env')
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
OPEN_API_KEY = env('OPEN_API_KEY')
#OPEN_WEATHER_API_KEY = env('OPEN_WEATHER_MAP_API_KEY')
os.environ["OPENAI_API_KEY"] = OPEN_API_KEY

DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    #'http://127.0.0.1:5173',
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DEFAULT_FROM_EMAIL = 'develop.Bridge@gmail.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'develop.Bridge@gmail.com'
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
