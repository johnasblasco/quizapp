from django.contrib import admin
from .models import Student, Teacher, Class

# Register your models here.

class StudentDetails(admin.ModelAdmin):
   pass

class TeacherDetails(admin.ModelAdmin):
   pass

class ClassDetails(admin.ModelAdmin):
   pass

admin.site.register(Student, StudentDetails)
admin.site.register(Teacher, TeacherDetails)
admin.site.register(Class, ClassDetails)