#!/usr/bin/env python3
"""
Test script for Gemini API integration
Run this script to test if your Gemini API key is working correctly
"""

import os
import google.generativeai as genai

def test_gemini_api():
    """Test Gemini API configuration and basic functionality"""
    
    # Check if API key is set
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable is not set!")
        print("Please set it using:")
        print("Windows (PowerShell): $env:GEMINI_API_KEY='your-api-key'")
        print("Windows (CMD): set GEMINI_API_KEY=your-api-key")
        print("Linux/Mac: export GEMINI_API_KEY='your-api-key'")
        return False
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Test with a simple prompt
        test_prompt = "Hello! Can you respond with 'Gemini API is working correctly' in English?"
        
        print("🔄 Testing Gemini API...")
        response = model.generate_content(test_prompt)
        
        if response.text:
            print("✅ Gemini API is working correctly!")
            print(f"Response: {response.text}")
            return True
        else:
            print("❌ No response received from Gemini API")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        return False

def test_roleplay_prompt():
    """Test the roleplay prompt format"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Cannot test roleplay prompt - API key not set")
        return False
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Test roleplay prompt
        system_prompt = """You are an English language tutor helping a student practice roleplay conversations. 

Student's level: B1 (Intermediate level - use intermediate vocabulary and grammar)
Roleplay topic: Restaurant ordering

Instructions:
1. Respond in English only, appropriate for B1 level
2. Stay in character for the roleplay scenario
3. Keep responses concise and natural for conversation (max 2-3 sentences)
4. If the student makes grammar mistakes, gently correct them in a helpful way
5. Encourage the student to continue the conversation
6. Use vocabulary and grammar structures appropriate for B1 level
7. Be engaging and interactive

Start the roleplay by taking on an appropriate role for the scenario and responding to the student's message."""

        test_message = "Hello, I'd like to order some food."
        
        messages = [
            {"role": "user", "parts": [system_prompt]},
            {"role": "user", "parts": [test_message]}
        ]
        
        print("🔄 Testing roleplay prompt...")
        response = model.generate_content(messages)
        
        if response.text:
            print("✅ Roleplay prompt is working correctly!")
            print(f"Response: {response.text}")
            return True
        else:
            print("❌ No response received for roleplay prompt")
            return False
            
    except Exception as e:
        print(f"❌ Error testing roleplay prompt: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Gemini API Integration")
    print("=" * 40)
    
    # Test basic API functionality
    basic_test = test_gemini_api()
    
    if basic_test:
        print("\n" + "=" * 40)
        # Test roleplay prompt
        roleplay_test = test_roleplay_prompt()
        
        if roleplay_test:
            print("\n🎉 All tests passed! Your Gemini API integration is ready.")
            print("You can now use the AI Roleplay feature in your Django application.")
        else:
            print("\n⚠️  Basic API works but roleplay prompt needs attention.")
    else:
        print("\n❌ Basic API test failed. Please check your API key and try again.") 
