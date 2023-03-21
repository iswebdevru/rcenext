from rest_framework.routers import DefaultRouter
from apps.teachers.views import TeacherViewSet
from apps.subjects.views import SubjectViewSet
from apps.groups.views import GroupViewSet
from apps.timetables.views import MainTimetableViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('subjects', SubjectViewSet, basename='subject')
router.register('groups', GroupViewSet, basename='group')
router.register('timetables/main', MainTimetableViewSet, basename='timetable')
urlpatterns = router.urls
