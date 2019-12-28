""" Module represents a User. """

from sqlalchemy import (
    Column, String, Integer,
    DateTime, Date, Boolean,
    ForeignKey
)

from sqlalchemy import (
    Column, String, Integer, DateTime, Date, Boolean, DECIMAL, ForeignKey, Text
)
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship, backref

from application.database import db
from application.database.model import CommonModel, default_uuid


roles_users = db.Table('roles_users',
                       db.Column('user_id', Integer, db.ForeignKey('users.id', ondelete='cascade'), primary_key=True),
                       db.Column('role_id', Integer, db.ForeignKey('role.id', onupdate='cascade'), primary_key=True))


class Role(CommonModel):
    __tablename__ = 'role'
    id = db.Column(Integer, autoincrement=True, primary_key=True)
    role_name = db.Column(String(100), index=True, nullable=False, unique=True)
    display_name = db.Column(String(255), nullable=False)
    description = db.Column(String(255))

class User(CommonModel):
    __tablename__ = 'users'

    id = db.Column(Integer, autoincrement=True, primary_key=True)

    # Authentication Attributes.
    user_name = db.Column(String(255), nullable=False, index=True)
    full_name = db.Column(String(255), nullable=True)
    email = db.Column(String(255), nullable=False, index=True)
    password = db.Column(String(255), nullable=False)
    salt = db.Column(String(255), nullable=False)

    # Permission Based Attributes.
    is_active = db.Column(Boolean, default=True)

    # Methods
    def __repr__(self):
        """ Show user object info. """
        return '<User: {}>'.format(self.id)

class Employee(CommonModel):
    id = db.Column(Integer,primary_key=True)
    __tablename__= 'employee'
    name = db.Column(String(255))
    id_number = db.Column(Integer)
    age = db.Column(Integer)
    hometown = db.Column(String(255))
    phone_number = db.Column(Integer)
    gender = db.Column(String(255))
    position = db.Column(String(255))
    work_place = db.Column(String(255))
    status = db.Column(String(255))

class Todo(CommonModel):
    id = db.Column(Integer,primary_key=True)
    __tablename__ = 'todo'
    todo_name = db.Column(String(255))
    current_employee_working = db.Column(Integer)
    describe = db.Column(String(255))

class EmployeeRelTodo(CommonModel):
    id = db.Column(Integer,primary_key=True)
    __tablename__ = 'employeereltodo'
    id_employee = db.Column(Integer, ForeignKey('employee.id'), nullable=False)
    employee_name = db.Column(String(255))
    id_todo = db.Column(Integer, ForeignKey('todo.id'), nullable=False)
    todo_name = db.Column(String(255))
    status_completed_employee = db.Column(String(255))
    status_completed_leader = db.Column(String(255))

class Category(CommonModel):
    id = db.Column(Integer, primary_key= True)
    __tablename__ = 'category'
    category_name = db.Column(String(255))
class TodoSchedule(CommonModel):
    id = db.Column(Integer, primary_key= True)
    __tablename__ = 'todoschedule'
    id_todo = db.Column(Integer, ForeignKey('todo.id'), nullable=False)
    todo = db.relationship("Todo", order_by="Todo.id", cascade="all, delete-orphan", single_parent=True)
    start_time_working = db.Column(Integer)
    end_time_working = db.Column(Integer)

class EmployeeSchedule(CommonModel):
    id = db.Column(Integer, primary_key=True)
    __tablename__ = 'employeeschedule'
    id_employee =  db.Column(Integer, ForeignKey('employee.id'), nullable=False)
    employee = db.relationship("Employee", order_by="Employee.id", cascade="all, delete-orphan", single_parent=True)
    start_time_working = db.Column(Integer)
    end_time_working = db.Column(Integer)
class Workstation(CommonModel):
    __tablename__ = 'workstation'
    id = db.Column(Integer,primary_key=True)
    id_organization = db.Column(Integer, ForeignKey('organization.id'), nullable=False)
    address = db.Column(String(255))

class Organization(CommonModel):
    __tablename__ = 'organization'
    id = db.Column(Integer,primary_key= True)
    status = db.Column(String(255))
    name = db.Column(String(255))
    workstation = db.relationship("Workstation", order_by="Workstation.id", cascade="all, delete-orphan", single_parent=True)
class Salary(CommonModel):
    id = db.Column(Integer, primary_key=True)
    __tablename__ = 'salary'
    id_employee = db.Column(Integer, ForeignKey('employee.id'), nullable=False)
    total_hours_working = db.Column(Integer)
    total_time_working = db.Column(Integer)
    money_for_hour = db.Column(DECIMAL)
    money_for_day = db.Column(DECIMAL)
    total_salary = db.Column(DECIMAL)