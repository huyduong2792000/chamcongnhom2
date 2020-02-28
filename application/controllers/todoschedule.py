from gatco.response import json, text
from application.server import app
from application.database import db
from application.extensions import auth
from random import randint 
from application.models.model import User, Role,TodoSchedule,TodoScheduleDetail,EmployeeRelTodo


# @app.route("/api/v1/todoschedule", methods=['POST']
# @app.route("/api/v1/test", methods=['GET'])
def pre_post_todo_schedule(request=None, Model=None, result=None, **kw):
    param = request.json
    currentUser = auth.current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)
    if result['id'] is not None:
        list_data_before_commit = []
        start_time_working = result['start_time_working']
        end_time_working = result['end_time_working']
        todo_schedule_id = result['id']
        
        for index in range(0,len(result["todoscheduledetail"])):
            todoschedule_detail = TodoScheduleDetail.query.filter(TodoScheduleDetail.id == result['todoscheduledetail'][index]['id']).first()
            
            todo_list = todoschedule_detail.todo
            employee_list = todoschedule_detail.employee
            for employee in employee_list:
                for todo in todo_list:
                    data_before_commit = {'todo_schedule_id':todo_schedule_id,\
                    'employee_id':employee.id,\
                    'employee_name':employee.name,'employee' : employee,'todo_id':todo.id,\
                    'todo_name':todo.todo_name,'todo' : todo,\
                    'day_working':todoschedule_detail.day_working,\
                    'time_working':todoschedule_detail.time_working}
                    list_data_before_commit.append(data_before_commit)
        
        group_data_before_commit = group_list_data_follow_employee(list_data_before_commit)
        for data_commit in list_data_before_commit:
            employee_assign = find_employee_be_assign(group_data_before_commit)

            data_add = EmployeeRelTodo(
                start_time_working=start_time_working,\
                end_time_working = end_time_working,\
                todo_schedule_id = todo_schedule_id,\
                day_working=data_commit['day_working'],time_working=data_commit['time_working'],\
                employee_id=data_commit['employee_id'],employee_name=data_commit['employee_name'],\
                employee = data_commit['employee'],employee_assign_name = employee_assign.name,\
                employee_assign_id = employee_assign.id,employee_assign=employee_assign,\
                todo_id = data_commit['todo_id'],todo_name = data_commit['todo_name'],\
                todo = data_commit['todo'])

            group_data_before_commit = group_list_data_after_find(employee_assign,\
                data_commit['todo'].level_diffcult,group_data_before_commit)
            db.session.add(data_add)

    db.session.commit()
# @app.route("/api/v1/test", methods=['POST'])
def group_list_data_follow_employee(list_data_before_commit):
    # list_data_before_commit = request.json
    group_data_before_commit = []
    for data in list_data_before_commit:
        check_id_match = False
        for val in group_data_before_commit:
            if val['employee'].id == data['employee'].id:
                val['total_level_dif_todo'] += data['todo'].level_diffcult
                check_id_match = True
        if check_id_match is False:
            group_data_before_commit.append({
                'employee':data['employee'],
                'total_level_dif_todo':data['todo'].level_diffcult
            })
    print('group_data_before_commit',group_data_before_commit)
    return group_data_before_commit

def find_employee_be_assign(group_data_before_commit):
    total_level_dif_todo_min = group_data_before_commit[0]['total_level_dif_todo']
    employee_has_total_level_dif_todo_min = group_data_before_commit[0]['employee']
    for val in group_data_before_commit:
        if total_level_dif_todo_min > val['total_level_dif_todo']:
            total_level_dif_todo_min = val['total_level_dif_todo']
            employee_has_total_level_dif_todo_min = val['employee']
    return employee_has_total_level_dif_todo_min
        
def group_list_data_after_find(employee_be_assign,level_diffcult,group_data_before_commit):
    for data in group_data_before_commit:
        if data['employee'].id == employee_be_assign.id:
            data['total_level_dif_todo'] += level_diffcult
    return group_data_before_commit

def pre_delete_todo_schedule(request=None, Model=None, result=None, **kw):
    param = request.json
    if param['id'] is not None: #  """ if put param['id'] -> not none else post param['id'] -> none"""
        employee_rel_todo_match = EmployeeRelTodo.query.filter(EmployeeRelTodo.todo_schedule_id == param['id']).delete()
    else:
        pass
def pre_put_todo_schedule(request=None, Model=None, result=None, **kw):
    pre_delete_todo_schedule(request=request, Model=Model, result=result)
    pre_post_todo_schedule(request=request, Model=Model, result=result)