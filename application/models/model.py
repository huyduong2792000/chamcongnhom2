""" Module represents a User. """
import datetime
from sqlalchemy import (
    Column, String, Integer,
    DateTime, Date, Boolean,
    ForeignKey, Float
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
    user = db.relationship("User",
                            secondary="roles_users",
                            )

class User(CommonModel):
    __tablename__ = 'users'

    id = db.Column(Integer, autoincrement=True, primary_key=True)

    # Authentication Attributes.
    user_name = db.Column(String(255), nullable=False, index=True)
    full_name = db.Column(String(255), nullable=True)
    email = db.Column(String(255), nullable=False, index=True)
    password = db.Column(String(255), nullable=False)
    salt = db.Column(String(255), nullable=False)

    is_active = db.Column(Boolean, default=True)
    employee_id = db.Column(Integer, ForeignKey('employee.id'))
    employee = db.relationship("Employee")
    roles = db.relationship("Role",
                            secondary="roles_users",
                            )
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
    user_name = db.Column(String(255))
    full_name = db.Column(String(255))
    email = db.Column(String(255))
    password = db.Column(String(255))
    way_of_working = db.Column(String(255))
    salary_for_hour = db.Column(Float)
    todoscheduledetail = db.relationship("TodoScheduleDetail",
                            secondary="employee_rel_todoscheduledetail",
                            #backref = db.#backref('employee', lazy = 'dynamic'), 
                            )
    user = db.relationship("User", cascade="all, delete-orphan", lazy='dynamic')


class Todo(CommonModel):
    id = db.Column(Integer,primary_key=True)
    __tablename__ = 'todo'
    todo_name = db.Column(String(255))
    # current_employee_working = db.Column(Integer)
    describe = db.Column(String(255))
    level_diffcult = db.Column(Integer)
    # todoschedule = db.relationship("TodoSchedule")
    # todoscheduledetail = db.relationship("TodoScheduleDetail")
    # todoscheduledetail_id = db.Column(Integer, ForeignKey("todoscheduledetail.id"))
    # employeereltodo = db.relationship("EmployeeRelTodo", order_by="EmployeeRelTodo.id", cascade="all, delete-orphan")
    # employee = db.relationship("Employee",
    #                         secondary="employee_rel_todo",
    #                         #backref = db.#backref('todo', lazy = 'dynamic'), 
    #                         )
    todoscheduledetail = db.relationship("TodoScheduleDetail",
                            secondary="todo_rel_todoscheduledetail",
                            #backref = db.#backref('todo', lazy = 'dynamic'), 
                            )
class Category(CommonModel):
    id = db.Column(Integer, primary_key= True)
    __tablename__ = 'category'
    category_name = db.Column(String(255))
class TodoSchedule(CommonModel):
    id = db.Column(Integer, primary_key= True)
    __tablename__ = 'todoschedule'
    start_time_working = db.Column(DateTime)
    end_time_working = db.Column(DateTime)
    todoscheduledetail = db.relationship("TodoScheduleDetail", cascade="all, delete-orphan", lazy='dynamic')

employee_rel_todoscheduledetail = db.Table(
    "employee_rel_todoscheduledetail",
    db.Column("employee_id", Integer, db.ForeignKey("employee.id", ondelete="cascade"), primary_key=True),
    db.Column("todoscheduledetail_id", Integer, db.ForeignKey("todoscheduledetail.id", ondelete="cascade"), primary_key=True)
) 
todo_rel_todoscheduledetail = db.Table(
    "todo_rel_todoscheduledetail",
    db.Column("todo_id", Integer, db.ForeignKey("todo.id", ondelete="cascade"), primary_key=True),
    db.Column("todoscheduledetail_id", Integer, db.ForeignKey("todoscheduledetail.id", ondelete="cascade"), primary_key=True)
)

class TodoScheduleDetail(CommonModel):
    id = db.Column(Integer,primary_key=True, nullable=False)
    __tablename__ = 'todoscheduledetail'
    todo_schedule_id = db.Column(Integer, ForeignKey("todoschedule.id"))
    day_working = db.Column(String())
    time_working = db.Column(String())
    # employeereltodo = db.relationship("EmployeeRelTodo")
    employee = db.relationship("Employee",
                            secondary="employee_rel_todoscheduledetail",
                            #backref = db.#backref('todoscheduledetail', lazy = 'dynamic'), 
                            )
    todo = db.relationship("Todo",
                        secondary="todo_rel_todoscheduledetail",
                        #backref = db.#backref('todoscheduledetail', lazy = 'dynamic'), 
                        )
  

class EmployeeRelTodo(CommonModel):
    id = db.Column(Integer,primary_key=True)
    __tablename__ = 'employee_rel_todo'
    start_time_working = db.Column(DateTime)
    end_time_working = db.Column(DateTime)
    start_time_visible = db.Column(DateTime)
    end_time_visible = db.Column(DateTime)
    todo_schedule_id = db.Column(Integer,ForeignKey('todoschedule.id',ondelete="cascade") )
    day_working = db.Column(String())
    time_working = db.Column(String())
    employee_id = db.Column(Integer, ForeignKey('employee.id',ondelete="cascade"), nullable=False)
    employee_name = db.Column(String(50)) 
    employee = db.relationship("Employee")
    employee_assign_name = db.Column(String(50)) 
    employee_assign_id = db.Column(Integer)
    employee_assign = db.relationship("Employee")
    todo_id = db.Column(Integer, ForeignKey('todo.id',ondelete="cascade"), nullable=False)
    todo_name = db.Column(String(50))
    todo = db.relationship("Todo")
    status_complete_manager = db.Column(Integer,default=0)
    status_complete_employee = db.Column(Integer,default=0)


class EmployeeSchedule(CommonModel):
    id = db.Column(Integer, primary_key=True) 
    __tablename__ = 'employeeschedule'
    id_employee =  db.Column(Integer, ForeignKey('employee.id'), nullable=False)
    # employee = db.relationship("Employee", order_by="Employee.id", cascade="all, delete-orphan", single_parent=True)
    day_working = db.Column(DateTime())
    start_time_working = db.Column(DateTime())
    end_time_working = db.Column(DateTime())
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
    login_at = db.Column(DateTime)
    logout_at = db.Column(DateTime, default=datetime.datetime.utcnow)
    id_employee = db.Column(Integer, ForeignKey('employee.id',ondelete="cascade"), nullable=False)
    total_hours_working_in_day = db.Column(Float, default=0)
    # total_hours_working = db.Column(Float)
    salary_for_hour = db.Column(Float)
    salary_for_month = db.Column(Float)
    total_salary = db.Column(Float)