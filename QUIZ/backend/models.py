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