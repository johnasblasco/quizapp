from rest_framework import serializers
from backend.models import Student, Teacher, Class


class StudentSerializer(serializers.ModelSerializer):
    joined_classes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Class.objects.all(),
        required=False
        
    )

    class Meta:
        model = Student
        fields = ['id', 'name', 'username', 'password', 'joined_classes']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'
