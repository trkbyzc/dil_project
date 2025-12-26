from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid

class UserProfile(models.Model):
    LEVEL_CHOICES = [
        ('başlangıç', 'Başlangıç'),
        ('orta', 'Orta'),
        ('ileri', 'İleri'),
        ('uzman', 'Uzman'),
    ]
    
    LEARNING_PURPOSE_CHOICES = [
        ('günlük', 'Günlük Hayat'),
        ('iş', 'İş Hayatı'),
        ('eğitim', 'Eğitim'),
        ('seyahat', 'Seyahat'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    unique_code = models.CharField(max_length=10, unique=True, blank=True)
    learning_purpose = models.CharField(max_length=20, choices=LEARNING_PURPOSE_CHOICES, blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='başlangıç')
    level_number = models.IntegerField(default=1)
    total_xp = models.IntegerField(default=0)
    current_xp = models.IntegerField(default=0)
    xp_to_next_level = models.IntegerField(default=1000)
    daily_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(auto_now=True)
    games_played = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    average_score = models.IntegerField(default=0)
    
    # Skill progress percentages
    vocabulary_progress = models.IntegerField(default=0)
    grammar_progress = models.IntegerField(default=0)
    pronunciation_progress = models.IntegerField(default=0)
    translation_progress = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} - {self.level}"
    
    def generate_unique_code(self):
        """Generate a unique 8-character code"""
        import random
        import string
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not UserProfile.objects.filter(unique_code=code).exists():
                return code
    
    def save(self, *args, **kwargs):
        if not self.unique_code:
            self.unique_code = self.generate_unique_code()
        super().save(*args, **kwargs)
    
    def calculate_level(self):
        if self.total_xp < 1000:
            self.level = 'başlangıç'
            self.level_number = 1
        elif self.total_xp < 3000:
            self.level = 'orta'
            self.level_number = 2
        elif self.total_xp < 6000:
            self.level = 'orta'
            self.level_number = 3
        elif self.total_xp < 10000:
            self.level = 'orta'
            self.level_number = 4
        elif self.total_xp < 15000:
            self.level = 'orta'
            self.level_number = 5
        elif self.total_xp < 25000:
            self.level = 'ileri'
            self.level_number = 6
        elif self.total_xp < 40000:
            self.level = 'ileri'
            self.level_number = 7
        else:
            self.level = 'uzman'
            self.level_number = 8

class GameResult(models.Model):
    GAME_TYPES = [
        ('vocabblitz', 'VocabBlitz'),
        ('grammar_typer', 'Grammar Typer'),
        ('sentence_master', 'Cümle Ustası'),
        ('pronunciation', 'Telaffuz'),
        ('ai_roleplay', 'AI Roleplay'),
        ('placement_test', 'Seviye Testi'),
        ('ai_questions', 'AI Sorular'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_type = models.CharField(max_length=20, choices=GAME_TYPES)
    score = models.IntegerField()
    xp_gained = models.IntegerField()
    played_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_game_type_display()} - {self.score}"

class Question(models.Model):
    text = models.CharField(max_length=255)
    choice_a = models.CharField(max_length=100)
    choice_b = models.CharField(max_length=100)
    choice_c = models.CharField(max_length=100)
    correct_choice = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C')])

    def choices(self):
        return [
            ('A', self.choice_a),
            ('B', self.choice_b),
            ('C', self.choice_c)
        ]

    def __str__(self):
        return self.text

class TestResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.score}/{self.total} - {self.date_taken.strftime('%Y-%m-%d')}"

class InitialTestAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_number = models.IntegerField()  # 1-10 arası
    answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C')])
    answered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'question_number']
    
    def __str__(self):
        return f"{self.user.username} - Soru {self.question_number}: {self.answer}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()