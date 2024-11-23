from flask import Blueprint, request, jsonify
from openai import OpenAI
import websockets
import asyncio
import json
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
gpt_bp = Blueprint('gpt', __name__)

# Regular GPT chat endpoint
@gpt_bp.route('/gpt/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({
                'error': 'No prompt provided'
            }), 400

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for elderly people."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return jsonify({
            'response': response.choices[0].message.content
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@gpt_bp.route('/gpt/realtime_chat', methods=['POST'])
async def realtime_chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({
                'error': 'No prompt provided'
            }), 400

        response = await stream_gpt_response(prompt)
        return jsonify(response)

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

async def stream_gpt_response(prompt):
    """Handle real-time streaming response from GPT"""
    uri = "wss://api.openai.com/v1/realtime?model=gpt-4"
    
    try:
        async with websockets.connect(
            uri,
            additional_headers={
                "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as websocket:
            # Initialize session
            await websocket.send(json.dumps({
                "type": "response.create",
                "response": {
                    "modalities": ["text"],
                    "instructions": "You are a helpful assistant for elderly people."
                }
            }))

            # Send user message
            await websocket.send(json.dumps({
                "type": "message.create",
                "message": {
                    "content": prompt,
                    "role": "user"
                }
            }))

            # Collect streaming response
            full_response = ""
            async for message in websocket:
                response_data = json.loads(message)
                
                if response_data.get("type") == "message.chunk":
                    chunk_content = response_data.get("message", {}).get("content", "")
                    full_response += chunk_content
                
                elif response_data.get("type") == "response.complete":
                    break
                
                elif response_data.get("type") == "error":
                    raise Exception(response_data.get("error", "Unknown error"))

            return {
                'response': full_response,
                'streaming': True
            }

    except Exception as e:
        return {
            'error': str(e),
            'streaming': False
        }

# Test endpoint for regular GPT
@gpt_bp.route('/gpt/test', methods=['GET'])
def test_gpt():
    try:
        test_prompt = "Give me a simple daily activity suggestion for an elderly person."

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for elderly people."},
                {"role": "user", "content": test_prompt}
            ],
            temperature=0.7
        )
        
        return jsonify({
            'test_prompt': test_prompt,
            'response': response.choices[0].message.content
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Test endpoint for real-time GPT
@gpt_bp.route('/gpt/realtime_test', methods=['GET'])
async def test_realtime_gpt():
    try:
        test_prompt = "Give me a simple daily activity suggestion for an elderly person."
        response = await stream_gpt_response(test_prompt)
        
        return jsonify({
            'test_prompt': test_prompt,
            **response
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'streaming': False
        }), 500

# Status endpoint
@gpt_bp.route('/gpt/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'online',
        'api_key_configured': bool(os.getenv('OPENAI_API_KEY')),
        'endpoints': {
            'regular_chat': '/gpt/chat',
            'realtime_chat': '/gpt/realtime_chat',
            'regular_test': '/gpt/test',
            'realtime_test': '/gpt/realtime_test'
        }
    })