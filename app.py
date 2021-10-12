from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)


@app.route('/')
def home():
    loaded_model = None
    with open('random_forest.p', 'rb') as file:
        loaded_model = pickle.load(file)
    loaded_model.predict()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)