from datetime import timedelta


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(seconds=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(seconds=10),
    'ROTATE_REFRESH_TOKENS': True
}
