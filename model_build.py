import pandas as pd
import numpy as np
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle


hr = pd.read_csv('HR.csv')
col_names = hr.columns.tolist()
hr=hr.rename(columns = {'sales':'department'})

# combine “technical”, “support” and “IT” together and call them “technical”
hr['department']=np.where(hr['department'] =='support', 'technical', hr['department'])
hr['department']=np.where(hr['department'] =='IT', 'technical', hr['department'])

# Creating dummy var
cat_vars=['department','salary']
for var in cat_vars:
    cat_list='var'+'_'+var
    cat_list = pd.get_dummies(hr[var], prefix=var)
    hr1=hr.join(cat_list)
    hr=hr1
hr.drop(hr.columns[[8, 9]], axis=1, inplace=True)
hr_vars=hr.columns.values.tolist()
y=['left']
X=[i for i in hr_vars if i not in y]

# Feature Selection
model = LogisticRegression()
rfe = RFE(estimator=model, n_features_to_select=10)
rfe = rfe.fit(hr[X], hr[y])
print(rfe.support_)
print(rfe.ranking_)
print(col_names)
features = [X[i] for i in range(len(rfe.support_)) if rfe.support_[i]]
# Features selected: [‘satisfaction_level’, ‘last_evaluation’, ‘time_spend_company’, ‘Work_accident’, ‘promotion_last_5years’, ‘department_RandD’, ‘department_hr’, ‘department_management’, ‘salary_high’, ‘salary_low’]
# print(X)
print('features', features)

cols=features
X=hr[cols]
y=hr['left']

# Use SVM

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
svc = SVC()
print('TRAIN DS COL', X_train.columns.to_list())
# svc.fit(X_train, y_train)
svc.fit(X_train, y_train)
pickle.dump(svc, open('svm.p', 'wb'))

print('SVM Accuracy: {:.3f}'.format(accuracy_score(y_test, svc.predict(X_test))))
print('Classification Report', classification_report(y_test, svc.predict(X_test)))

print('X TEST', type(X_test), X_test)

y_pred = svc.predict(X_test)
print(y_pred)
forest_cm = confusion_matrix(y_pred, y_test)
print('Confusion Matrix: ', forest_cm)