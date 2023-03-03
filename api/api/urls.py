from rest_framework.routers import DefaultRouter
from api.teachers.views import TeacherViewSet
from api.subjects.views import SubjectViewSet
from api.groups.views import GroupViewSet
from api.timetables.views import TimetableViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('subjects', SubjectViewSet, basename='subject')
router.register('groups', GroupViewSet, basename='group')
router.register('timetables', TimetableViewSet, basename='timetable')
urlpatterns = router.urls
