from rest_framework import serializers
from backend.models import Student, Teacher, Class, Question, Activity


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

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_type', 'question_text', 'options', 'correct_answer']

    def validate(self, data):
        # Add custom validation to ensure correct answer is valid for multiple-choice questions
        if data['question_type'] == 'multiple_choice' and data['correct_answer'] not in data['options']:
            raise serializers.ValidationError("The correct answer must be one of the options for multiple-choice questions.")
        return data

class ActivitySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Activity
        fields = ['class_id', 'name', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')  # Extract questions data
        activity = Activity.objects.create(**validated_data)  # Create the Activity instance
        for question_data in questions_data:
            Question.objects.create(activity=activity, **question_data)  # Create the associated questions
        return activity
