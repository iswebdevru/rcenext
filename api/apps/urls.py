from rest_framework.routers import DefaultRouter
from apps.teachers.views import TeacherViewSet
from apps.subjects.views import SubjectViewSet
from apps.groups.views import GroupViewSet
from apps.timetables.views import MainTimetableViewSet, ChangesTimetableViewSet, MixedTimetableViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet)
router.register('subjects', SubjectViewSet)
router.register('groups', GroupViewSet)
router.register('timetables-main', MainTimetableViewSet,
                basename="timetable-main")
router.register('timetables-changes', ChangesTimetableViewSet,
                basename="timetable-changes")
router.register('timetables', MixedTimetableViewSet,
                basename="timetable-mixed")

urlpatterns = router.urls
