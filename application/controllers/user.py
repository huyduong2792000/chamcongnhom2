from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
import random
import string

from application.models.model import User, Role,Employee


def user_register(request=None, Model=None, result=None, **kw):

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
    print('role',role_employee)
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
                user.employee.status = 'online'
                db.session.commit()
            except:
                pass
            auth.login_user(request, user)
            print('user',user.roles)
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
        user.employee.status='offline'
        db.session.commit()
    except:
        pass
    print('current user',current_user)
    auth.logout_user(request)
    return json({})

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