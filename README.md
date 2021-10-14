# EMPLOYEE TURNOVER PREDICTOR

### INTRODUCTION
The purpose of this application is to predict wether a given employee will leave the office or not considering some parameters.

### USING THE APPLICATION
- The user fills a form displayed on the screen.
- The user clicks the "Submit" button.
- The result wether the employee will stay or leave is displayed acording to the prediction.

### DATASET
A CSV file having the following columns:
- Satisfaction Level
- Last Evaluation
- Number of Projects
- Average Monthly Hours
- Time Spent in the Company
- Wether the employee has ever been in a Work Accident
- Wether the employee has left or not
- Wether the employee has been promoted in the last 5 years
- Department (Labelled as "Sales" in the dataset)
- Salary

### Preprocessing
- Rename the column "Sales" to "Department"
- Combine "technical", "support", "IT" into "technical" department
- Create dummy variables for categorical variables ("Department" and "Salary")

### FEATURE SELECTION
Selecting the most important features using Recursive Feature Elimination (RFE) and Logistic Regression Model. The selected features are:
1. Satisfaction Level
2. Last Evaluation
3. Time Spent in the Company
4. Wether the employee has ever been in a Work Accident
5. Wether the employee has been promoted in the last 5 years
6. Department (Labelled as "Sales" in the dataset)
7. Salary

### Model Generation
SVM is being used and a pickle file is generated

### ACCURACY
91%

### CONFUSION MATRIX

### CLASSIFICATION REPORT

### RUNNING THE APPLICATION LOCALLY
- Install python and node
- Clone the repo
- Go to the project root dir
- For python:
```bash
pip install -r requirements.txt
python app.py
```
- For node:
```bash
cd frontend/
npm install
npm start
```
### GENERATING A NEW SAVED MODEL
- Go to the root folder and run:
```bash
python model_build.py
```