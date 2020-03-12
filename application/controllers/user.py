from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
from datetime import datetime,date
import random
import string

from application.models.model import User, Role,Employee,Salary


def user_register(request=None, Model=None, result=None, **kw):
    currentUser = auth.current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)
    if result['id'] is not None:
        param = request.json
        role_admin = Role.query.filter(Role.role_name == "admin").first()
        role_user = Role.query.filter(Role.role_name == "user").first()
        role_employee = Role.query.filter(Role.role_name == "employee").first()
        role_leader = Role.query.filter(Role.role_name == "leader").first()
        # print("model==========",result)

        letters = string.ascii_lowercase
        user_salt = ''.join(random.choice(letters) for i in range(64))
        print("user_salt", user_salt)
        user_password=auth.encrypt_password(param['password'], user_salt)
        user = User(email=param['email'],password=user_password, salt=user_salt,user_name=param['user_name'],full_name=param['full_name'])
        if (param['position']=='employee' or param['position'] is None):
            user.roles = [role_employee]
        if (param['position']=='leader'):
            user.roles = [role_leader]
        employee = db.session.query(Employee).filter(Employee.id == result['id']).first()
        employee.user = [user]
        db.session.add(employee)

        db.session.commit()
@app.route("/api/v1/makesalt/<password>", methods=["POST", "GET"])
async def makesalt(request,password):
    letters = string.ascii_lowercase
    user_salt = ''.join(random.choice(letters) for i in range(64))
    user_password=auth.encrypt_password(password, user_salt)
    return json({'user_password':user_password,'user_salt':user_salt})
@app.route("/user_test")
async def user_test(request):
    # role_admin = Role.query.filter(Role.role_name == "admin").first()

    # user = db.session.query(User).filter(User.user_name == 'admin').first()
    # user.roles = [role_admin]
    # db.session.add(user)
    # db.session.commit()
    return text("user_test api")

@app.route("/user/login", methods=["POST", "GET"])
async def user_login(request):
    param = request.json
    user_name = param.get("user_name")
    password = param.get("password")
    print(user_name, password)
    if (user_name is not None) and (password is not None):
        user = db.session.query(User).filter(User.user_name == user_name).first()
        if (user is not None) and auth.verify_password(password, user.password, user.salt):
            try:
                employee = user.employee
                employee.status = 'online'
                test = datetime.now()
                # print("111111111",test.strftime("%x"))
                analysis = Analysis(id_employee = employee.id,salary_for_month = employee.salary_for_month,\
                salary_for_shift = employee.salary_for_shift,employee_name = employee.name,\
                login_at = datetime.now())
                db.session.add(analysis)
                db.session.commit()
            except:
                pass
            auth.login_user(request, user)
            return json({"id": user.id, "user_name": user.user_name, "full_name": user.full_name,"employee_id":user.employee_id,"role":user.roles[0].role_name})
        return json({"error_code":"LOGIN_FAILED","error_message":"user does not exist or incorrect password"}, status=520)
    else:
        return json({"error_code": "PARAM_ERROR", "error_message": "param error"}, status=520)
    return text("user_login api")

@app.route("/user/logout", methods=["GET"])
async def user_logout(request):
    current_user = auth.current_user(request)
    user = db.session.query(User).filter(User.id == int(current_user)).first()
    try:
        set_logout_for_salary(user)
    # salary = db.session.query(Salary).filter(Salary.id_employee==17).first()
    # print("11111111111",salary)
        user.employee.status='offline'
        db.session.commit()
    except:
        pass
    auth.logout_user(request)
    return json({})
def set_logout_for_salary(user):
    today = datetime.today() 
    dayend = datetime(year=today.year, month=today.month,
                day=today.day, hour=23,minute=59, second=59,microsecond=999999)
    salary = db.session.query(Salary).filter(Salary.id_employee == user.employee.id,\
    Salary.logout_at == dayend).all()
    for val in salary:
        if datetime.now().strftime("%x") == val.login_at.strftime("%x"):
            salary = val
            break
    salary.logout_at = datetime.now()
    logout_at = datetime.now()
    login_at = salary.login_at
    salary_for_shift = salary.salary_for_shift
    total_hours_working_in_day =\
         round((logout_at.hour+(logout_at.minute+logout_at.second/60+logout_at.microsecond/10000000)/60)\
        -(login_at.hour+(login_at.minute+login_at.second/60+login_at.microsecond/10000000)/60),2)
    total_salary = total_hours_working_in_day*salary_for_shift
    salary.total_hours_working_in_day = total_hours_working_in_day
    salary.total_salary = total_salary
    # salary = Salary(id_employee = salary.id_employee,salary_for_month = salary.salary_for_month,\
    #         salary_for_shift = salary.salary_for_shift,employee_name = salary.employee_name,\
    #         login_at = salary.login_at,logout_at = datetime.now())
    print("11111111111",salary.logout_at)
@app.route("/user/current_user", methods=["GET"])
async def user_current_user(request):
    user_id = auth.current_user(request)
    print(user_id)

    user = User.query.filter(User.id == user_id).first()
    if user is not None:
        
        print(user.roles[0])
        return json({"id": user.id, "user_name": user.user_name, "full_name": user.full_name,"employee_id":user.employee_id,"role":user.roles[0].role_name})
    else:
        return json({"error_code": "NOT_FOUND", "error_message": "User not found"}, status=520)
    return json({"error_code": "UNKNOWN", "error_message": "Unknown error"}, status=520)