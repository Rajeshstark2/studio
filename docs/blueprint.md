# **App Name**: FinLit Buddy

## Core Features:

- User Authentication: User-friendly sign-up/sign-in page with name and language preference stored locally.
- Chat Interface: Chat interface with text and voice input, displaying conversation in user/bot bubbles.
- AI Chatbot Integration: Integrate Gemini AI API to provide real-time chatbot responses and translate responses if needed. Use Text-to-Speech for Gemini replies.
- Predefined Questions: Offer predefined questions as clickable buttons for easy access to common queries.
- Multilingual Support: Enable language selection, store the choice locally, and display the entire UI and chatbot responses in the selected language.

## Style Guidelines:

- Primary color: Soft green (#C8E6C9) for a sense of calm and growth.
- Secondary color: Light grey (#EEEEEE) for clean backgrounds.
- Accent: Teal (#4DB6AC) for interactive elements and highlights.
- Clear and simple sans-serif fonts for easy readability, especially for semi-literate users.
- Use simple, recognizable icons to represent financial concepts.
- Clean and intuitive layout with a focus on accessibility for first-time digital users.

## Original User Request:
FINAL DETAILED PROMPT

Project Title: Financial Literacy Chatbot for Low-Income Users
Team Name: Raptors
Institution: Takshashila
Platform: Android Mobile Application
AI Model: Gemini AI API


---

Objective

Build an Android mobile app that serves as a multilingual AI-powered Financial Literacy Chatbot to educate low-income users in India on basic financial concepts such as budgeting, investment, insurance, SIPs, digital payments, and fraud protection. The app should support chat interaction, local language conversations, and work partially offline, with simple UI for semi-literate and first-time digital users.


---

Core Features

1. Sign In / Sign Up Page

Input fields: Name, username, language preference.

Data stored in local storage (SharedPreferences) for offline-first access.

User can skip login but preferences are saved locally.


2. Chatting Page (Chatbot Screen)

Text Input + Voice Input using Android’s SpeechRecognizer.

Conversation-style UI with user and bot bubbles.

Uses Gemini AI API for real-time chatbot responses.

Text-to-Speech for Gemini replies.

Option to translate responses to preferred language using Google Translate API.

Offline fallback: Show pre-loaded responses for common queries.


3. Predefined Questions Support

List of frequently asked questions shown as clickable buttons.

When clicked, these auto-send to Gemini API or fetch stored answers offline.

Example questions:

What is investment?

Define insurance.

What is SIP?

How to invest in stock market?

What is UPI?

How to avoid financial fraud?



4. Multilingual Support

User selects language on first login.

All chatbot responses, questions, and UI shown in that language.

Option to change language in settings.

Use Google Translate API to dynamically translate responses if Gemini replies in English.


5. Offline Mode (Partial)

App caches chatbot replies, questions, and user history.

If no internet:

Predefined financial lessons still available.

Chatbot gives stored responses instead of Gemini API.



6. Educational Mode (Optional Tab)

Static content explaining financial concepts in the form of:

Cards

Mini-lessons

Audio or Text summaries


Includes visual infographics and icons for semi-literate users.


7. Settings Page

Change Language

Clear Chat History

About the App (Developed by Raptors Team from Takshashila)



---

Gemini API Integration Prompt (Sample Format)

Each user message should be sent to Gemini API like this:

{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "You are a financial literacy assistant. Explain in simple Hindi: What is SIP?"
        }
      ]
    }
  ]
}

Receive the response, parse it, display in chat, and optionally translate.


---

Tech Stack Recommendation


---

UI Layout Overview

Sign In Screen:

Name, Language Selection, Save


Chatting Page:

Scrollable chat area

Predefined Question Buttons

Text input + Mic + Send button

Optional “Speak Response” button


Education Tab:

Mini lessons with titles, icons, text/audio


Settings:

Change language

About app

Clear chat history



---

Expected Outcomes

Increase financial awareness in local communities.

Reduce digital payment frauds.

Promote safe banking habits.

Empower first-time internet and mobile users to make informed financial decisions.
  