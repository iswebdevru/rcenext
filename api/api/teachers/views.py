from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    @action(detail=True)
    def subjects(self, *args, **kwargs):
        teacher = self.get_object()
        return Response(teacher.subjects.all())
