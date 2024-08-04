from flask import Flask, jsonify
from flask_cors import CORS
from .gemini_request import detect_trash

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/v1/function', methods=['GET'])
def my_function():
    result = "Hello from Python function!"
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)