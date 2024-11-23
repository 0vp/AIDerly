from flask import Blueprint, request, jsonify
from openai import OpenAI

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
gpt_bp = Blueprint('gpt', __name__)

@gpt_bp.route('/gpt/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({
                'error': 'No prompt provided'
            }), 400

        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for elderly people."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7)

        return jsonify({
            'response': response.choices[0].message.content
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# test one if you needed
@gpt_bp.route('/gpt/test', methods=['GET'])
def test_gpt():
    try:
        test_prompt = "Give me a simple daily activity suggestion for an elderly person."

        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for elderly people."},
            {"role": "user", "content": test_prompt}
        ],
        temperature=0.7)
        return jsonify({
            'test_prompt': test_prompt,
            'response': response.choices[0].message.content
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500