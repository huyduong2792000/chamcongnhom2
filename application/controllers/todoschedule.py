from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
from random import randint 
from application.models.model import User, Role,TodoSchedule,TodoScheduleDetail


# @app.route("/api/v1/todoschedule", methods=['POST'])
def todo_schedule(request,data,Model):
    
    param = request.json
    currentUser = auth.current_user(request)
    print(param)
    # if (currentUser is None):
    #     return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)
    # if param['id'] is None:
    #     id_todoschedule = db.session.query(TodoSchedule).order_by(TodoSchedule.id.desc()).first().id+10000
    #     # id_todoschedule = 0
    #     while(True):
    #         try:
                
    #             db.session.add(TodoSchedule(id=id_todoschedule))
    #             break
    #         except:
    #             id_todoschedule+=1
    #             continue
        
    #     id_todoschedule_detail = db.session.query(TodoScheduleDetail).order_by(TodoScheduleDetail.id.desc()).first().id+10000
    #     # id_todoschedule_detail = 0
    #     for item in param["employee_of_todo"]:
    #         print("ádfeagadg")
    #         while(True):
    #             try:
    #                 db.session.add(TodoScheduleDetail(id=id_todoschedule_detail,todo_schedule_id=id_todoschedule))
    #                 break
    #             except:
    #                 id_todoschedule_detail+=1
    #                 continue

    #         for employee in item["employee"]:
    #             for todo in item["todo"]:
    #                 # for todo_id in todo["todo"]:
    #                 new_row_employee_rel_todo = EmployeeRelTodo(employee_id=employee['id'],todo_id=todo['id'],todoscheduledetail_id=id_todoschedule_detail)
                    
    #                 db.session.add(new_row_employee_rel_todo)
    #         id_todoschedule_detail+=1
    # db.session.commit()
    return json(param)