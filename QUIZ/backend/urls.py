from django.urls import path
from .views import StudentView, TeacherView, ClassView
urlpatterns = [
    path('students/', StudentView.as_view()),
    path('teachers/', TeacherView.as_view()),
    path('students/<int:pk>/', StudentView.as_view()),
    path('teachers/<int:pk>/', TeacherView.as_view()),
    path('classes/', ClassView.as_view()),
    path('classes/<int:pk>/', ClassView.as_view()),
]