from datetime import timedelta


REST_KNOX = {
    'AUTH_HEADER_PREFIX': 'Bearer',
    'AUTO_REFRESH': True,
    'TOKEN_TTL': timedelta(days=2),
}
