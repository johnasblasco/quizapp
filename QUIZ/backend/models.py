from django.db import models

class Student(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    joined_classes = models.ManyToManyField('Class', related_name='students', blank=True)

    def __str__(self):
        return self.name

        
class Teacher(models.Model):
      id = models.AutoField(primary_key=True)
      name = models.CharField(max_length=100)
      username = models.CharField(max_length=100)
      password = models.CharField(max_length=100)

      def __str__(self):
        return self.name


class Class(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    teacher = models.CharField(max_length=100)
    class_code = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='activities')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Question(models.Model):
    MULTIPLE_CHOICE = 'multiple_choice'
    TRUE_FALSE = 'true_false'
    IDENTIFICATION = 'identification'
    QUESTION_TYPES = [
        (MULTIPLE_CHOICE, 'Multiple Choice'),
        (TRUE_FALSE, 'True/False'),
        (IDENTIFICATION, 'Identification'),
    ]

    id = models.AutoField(primary_key=True)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES)
    question_text = models.TextField()
    options = models.JSONField(blank=True, null=True)  # For multiple-choice questions
    correct_answer = models.TextField()

    def __str__(self):
        return self.question_text