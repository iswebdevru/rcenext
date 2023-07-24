from django.urls import path
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from knox.views import LogoutView
from backend.teachers.views import TeacherViewSet
from backend.subjects.views import SubjectViewSet
from backend.groups.views import GroupViewSet
from backend.login.views import LoginView
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
    path('auth/login/', LoginView.as_view(), name="knox_login"),
    path('auth/logout/', LogoutView.as_view(), name="knox_logout")
]
