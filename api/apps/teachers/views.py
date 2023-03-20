from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Teacher
from .serializers import TeacherSerializer
from apps.subjects.serializers import SubjectSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    @action(detail=True)
    def subjects(self, *args, **kwargs):
        subjects_of_teacher = self.get_object().subjects.all()
        serialized_subjects = SubjectSerializer(subjects_of_teacher, many=True)
        return Response(serialized_subjects.data)
