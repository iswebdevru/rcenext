from rest_framework.routers import DefaultRouter
from teachers.views import TeacherViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
urlpatterns = router.urls
