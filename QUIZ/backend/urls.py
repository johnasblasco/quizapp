from django.urls import path
from .views import StudentView, TeacherView, ClassView, ActivityListCreateView
urlpatterns = [
    path('students/', StudentView.as_view()),
    path('teachers/', TeacherView.as_view()),
    path('students/<int:pk>/', StudentView.as_view()),
    path('teachers/<int:pk>/', TeacherView.as_view()),
    path('classes/', ClassView.as_view()),
    path('classes/<int:pk>/', ClassView.as_view()),
    path('activities/', ActivityListCreateView.as_view(), name='activities'),
    path('activities/delete-by-name/', ActivityListCreateView.as_view(), name='delete-activity-by-name'),]