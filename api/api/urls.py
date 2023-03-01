from rest_framework.routers import DefaultRouter
from api.teachers.views import TeacherViewSet
from api.subjects.views import SubjectViewSet
from api.groups.views import GroupViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('subjects', SubjectViewSet, basename='subject')
router.register('groups', GroupViewSet, basename='group')
urlpatterns = router.urls
