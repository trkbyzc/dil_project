from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Question, UserProfile

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text', 'choice_a', 'choice_b', 'choice_c', 'correct_choice']

class CustomUserCreationForm(UserCreationForm):
    learning_purpose = forms.ChoiceField(
        choices=UserProfile.LEARNING_PURPOSE_CHOICES,
        label='İngilizce öğrenme amacınız nedir?',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'learning_purpose')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})
    
    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            # Update the user profile with learning purpose
            user.userprofile.learning_purpose = self.cleaned_data['learning_purpose']
            user.userprofile.save()
        return user
