from django.urls import path
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from knox.views import LogoutView
from apps.teachers.views import TeacherViewSet
from apps.subjects.views import SubjectViewSet
from apps.groups.views import GroupViewSet
from apps.login.views import LoginView
from apps.classes.views import ClassesScheduleMainViewSet, ClassesScheduleChangesViewSet, ClassesScheduleMixedViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet)
router.register('subjects', SubjectViewSet)
router.register('groups', GroupViewSet)
router.register('classes-main', ClassesScheduleMainViewSet,
                basename="timetable-main")
router.register('classes-changes', ClassesScheduleChangesViewSet,
                basename="timetable-changes")
router.register('classes', ClassesScheduleMixedViewSet,
                basename="timetable-mixed")

urlpatterns = router.urls
urlpatterns += [
    path('admin/', admin.site.urls),
    path('auth/login/', LoginView.as_view(), name="knox_login"),
    path('auth/logout/', LogoutView.as_view(), name="knox_logout")
]
