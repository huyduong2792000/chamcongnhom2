from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
from random import randint 
from application.models.model import User, Role,TodoSchedule,TodoScheduleDetail,EmployeeRelTodo,Salary

def preget_salary(request=None,search_params=None, Model=None,instance_id=None):
    print(search_params)
    print('get salary')
    salary_test = Salary(id_employee=4,total_hours_working=5)
    db.session.add(salary_test)
    db.session.commit()