from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
from random import randint 
from application.models.model import User, Role,TodoSchedule,TodoScheduleDetail,EmployeeRelTodo,Salary
