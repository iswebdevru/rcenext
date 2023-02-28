from rest_framework.routers import DefaultRouter
from api.teachers.views import TeacherViewSet
from api.subjects.views import SubjectViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('subjects', SubjectViewSet, basename='subject')
urlpatterns = router.urls
