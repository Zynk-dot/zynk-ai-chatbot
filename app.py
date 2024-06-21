from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import pipeline, Conversation
import wikipediaapi
import requests
import os

app = Flask(__name__)
CORS(app)

# Load a pre-trained conversational model from Hugging Face
nlp_model = pipeline("conversational", model="microsoft/DialoGPT-medium")

# Set up Wikipedia API
user_agent = "ZynkAI/1.0 (https://github.com/Zynk-dot/zynk-ai-chatbot)"
wiki_wiki = wikipediaapi.Wikipedia('en')
wiki_wiki.user_agent = user_agent

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    conversation = Conversation(user_message)
    response_message = nlp_model(conversation).generated_responses[-1].text
    
    wiki_response = search_wikipedia(user_message)
    if wiki_response:
        response_message = wiki_response
    
    return jsonify({'message': response_message})

def search_wikipedia(query):
    page = wiki_wiki.page(query)
    if page.exists():
        return page.summary
    return None

if __name__ == '__main__':
    app.run(debug=True)
