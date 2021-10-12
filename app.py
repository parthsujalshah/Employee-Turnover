from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def home():
    loaded_model = None
    print('request.json')
    print(request.json)
    with open('random_forest.p', 'rb') as file:
        loaded_model = pickle.load(file)
    build_dict = {
        'satisfaction_level': [request.json.get('satisfaction_level')],
        'last_evaluation': [request.json.get('last_evaluation')],
        'time_spend_company': [request.json.get('time_spend_company')],
        'Work_accident': [request.json.get('Work_accident')],
        'promotion_last_5years': [request.json.get('promotion_last_5years')],
        'department_RandD': [0],
        'department_hr': [0],
        'department_management': [0],
        'department_management': [0],
        'salary_high': [0],
        'salary_low': [0],
    }
    build_dict[f"department_{request.json.get('department')}"][0] = 1
    build_dict[request.json.get('salary')][0] = 1
    test = pd.DataFrame.from_dict(build_dict)
    predictions = loaded_model.predict(test)
    print(predictions)
    if predictions[0] == 0:
        return jsonify({'staying': True})
    return jsonify({'staying': False})


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8000)