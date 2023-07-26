from django.urls import path
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from backend.teachers.views import TeacherViewSet
from backend.subjects.views import SubjectViewSet
from backend.groups.views import GroupViewSet
from backend.classes.views import ClassesScheduleViewSet
from backend.bells.views import BellsViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet)
router.register('subjects', SubjectViewSet)
router.register('groups', GroupViewSet)
router.register('classes', ClassesScheduleViewSet)
router.register('bells', BellsViewSet)

urlpatterns = router.urls
urlpatterns += [
    path('admin/', admin.site.urls),
    path('auth/login/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist')
]
