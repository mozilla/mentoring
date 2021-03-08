from pathlib import Path
import os
from configurations import Configuration, values

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


class Base(Configuration):
    # Application definition

    INSTALLED_APPS = [
        'mentoring.participants.apps.ParticipantsConfig',
        'mentoring.pairing.apps.PairingConfig',
        'mentoring.frontend.apps.FrontendConfig',
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'rest_framework',
    ]

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        'csp.middleware.CSPMiddleware',
    ]

    ROOT_URLCONF = 'mentoring.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': ['mentoring/templates'],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'mentoring.wsgi.application'

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'root': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }

    # URLs to which the user will be redirected when login/logout are complete
    LOGIN_REDIRECT_URL = "/"
    LOGOUT_REDIRECT_URL = "/"

    # Default permission for all API methods is to require user.is_staff
    REST_FRAMEWORK = {
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAdminUser',
        ]
    }

    # Internationalization
    # https://docs.djangoproject.com/en/3.1/topics/i18n/
    LANGUAGE_CODE = 'en-us'
    TIME_ZONE = 'UTC'
    USE_I18N = True
    USE_L10N = True
    USE_TZ = True

    # content security policy
    CSP_DEFAULT_SRC = ["'self'"]
    CSP_FONT_SRC = ["'self'", "https://fonts.gstatic.com"]
    CSP_STYLE_SRC = ["'self'", "https://fonts.googleapis.com"]
    CSP_INCLUDE_NONCE_IN = ['style-src']

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/3.1/howto/static-files/
    STATIC_URL = '/static/'
    STATICFILES_DIRS = [BASE_DIR / "static"]

    # Trust X-Forwarded-Proto to signify a secure connection
    # (even in dev, this is useful if using a tunnel service)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

    # Limit the request body to a reasonable size
    DATA_UPLOAD_MAX_MEMORY_SIZE = 500 * 1024


class Production(Base):
    DEBUG = False

    SECRET_KEY = values.Value(environ_required=True)

    # require DJANGO_ALLOWED_HOSTS
    ALLOWED_HOSTS = values.ListValue(environ_required=True)

    # days to retain participant data
    DATA_RETENTION_DAYS = 180

    # secret key for hashing pair_ids (treat like SECRET_KEY)
    PAIR_ID_HASH_SECRET = values.Value(environ_required=True)

    # use OIDC in production, with our custom auth backend
    INSTALLED_APPS = Base.INSTALLED_APPS + ['mozilla_django_oidc']
    AUTHENTICATION_BACKENDS = ['mentoring.auth.MentoringAuthBackend']
    LOGIN_URL = '/oidc/authenticate/'

    OIDC_RP_SIGN_ALGO = "RS256"
    OIDC_RP_CLIENT_ID = values.Value(environ_required=True)
    OIDC_RP_CLIENT_SECRET = values.Value(environ_required=True)
    # OIDC_OP_* come from https://auth.mozilla.auth0.com/.well-known/openid-configuration
    OIDC_OP_JWKS_ENDPOINT = "https://auth.mozilla.auth0.com/.well-known/jwks.json"
    OIDC_OP_TOKEN_ENDPOINT = "https://auth.mozilla.auth0.com/oauth/token"
    OIDC_OP_USER_ENDPOINT = "https://auth.mozilla.auth0.com/userinfo"
    OIDC_OP_AUTHORIZATION_ENDPOINT = "https://auth.mozilla.auth0.com/authorize"
    OIDC_AUTHENTICATION_CALLBACK_URL = values.Value(environ_required=True)
    OIDC_RP_SCOPES = "openid email profile"

    # Members of these Mozilla SSO groups will be Django staff, able to perform pairing;
    # this capability is given to committee members.
    STAFF_GROUPS = values.ListValue(environ_required=True)

    # Members of these Mozilla SSO groups will be Django superusers, able to do
    # everything; this capability should be given to a subset of committee
    # members who can use the power safely
    ADMIN_GROUPS = values.ListValue(environ_required=True)

    # determine the database configuration from DATABASE_URL
    DATABASES = values.DatabaseURLValue()

    # security settings
    SECURE_HSTS_SECONDS = 3600
    SECURE_REFERRER_POLICY = 'same-origin'
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_SECURE = 1  # Set that the cookie should only be sent on https
    CSRF_COOKIE_SECURE = 1  # Same for CSRF cookies


class Development(Base):
    DEBUG = True

    SECRET_KEY = 'development'
    DATA_RETENTION_DAYS = 7
    PAIR_ID_HASH_SECRET = 'development'

    # allow the default development hosts (implied by []), or DJANGO_AUTHORIZED_HOSTS if set
    ALLOWED_HOSTS = values.ListValue([])

    # for development, we use a local sqlite DB
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

    # use the simple django-model based sign-in in development
    AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']
    LOGIN_URL = '/accounts/login/'

    # For development builds of the react app (`yarn dev`, not `yarn build`), eval is needed
    CSP_DEFAULT_SRC = Base.CSP_DEFAULT_SRC + ["'unsafe-eval'"]
