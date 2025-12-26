from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('games/', views.games_view, name='games'),
    path('tests/', views.tests_view, name='tests'),
    path('ai-roleplay/', views.ai_roleplay_view, name='ai_roleplay'),
    path('ai-roleplay-chat/', views.ai_roleplay_chat, name='ai_roleplay_chat'),
    path('level-test/', views.level_test_view, name='level_test'),
    path('ai-questions/', views.ai_questions_view, name='ai_questions'),
    path('ai-questions-chat/', views.ai_questions_chat, name='ai_questions_chat'),
    path('settings/', views.settings_view, name='settings'),
    path('save-game-result/', views.save_game_result, name='save_game_result'),
    path('placement/', views.placement_test, name='placement'),
    path('test_result/', views.test_result, name='test_result'),
    path('placement/edit/<int:pk>/', views.edit_question, name='edit_question'),
    path('placement/delete/<int:pk>/', views.delete_question, name='delete_question'),
    path('placement/add/', views.add_question, name='add_question'),
    path('chatbot/', views.chatbot_view, name='chatbot'),
    path('initial-test/', views.initial_test, name='initial_test'),
    path('initial-test-results/', views.initial_test_results, name='initial_test_results'),
    path('vocablitz/', views.vocablitz_view, name='vocablitz'),
    path('sentence-game/', views.sentence_game_view, name='sentence_game'),
    path('grammar-typer/', views.grammar_typer_view, name='grammar_typer'),
    path('voice-pronunciation/', views.voice_pronunciation_view, name='voice_pronunciation'),


]
