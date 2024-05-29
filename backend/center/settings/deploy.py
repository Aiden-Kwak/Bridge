from .base import *

SECRET_KEY = read_secret('DJANGO_SECRET_KEY')
OPEN_API_KEY = read_secret('OPEN_API_KEY')
os.environ["OPENAI_API_KEY"] = OPEN_API_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    "https://computer-system-team-06.dev.mobilex.kr",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DEFAULT_FROM_EMAIL = 'develop.Bridge@gmail.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'develop.Bridge@gmail.com'
EMAIL_HOST_PASSWORD = read_secret('EMAIL_HOST_PASSWORD')
