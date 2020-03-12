from application.extensions import apimanager
from application.models.model import *
from application.extensions import auth
from gatco.exceptions import ServerError
from application.controllers.todoschedule import *
from application.controllers.user import *

def auth_func(request=None, **kw):
    #uid = auth.current_user(request)
    #if uid is None:
    #    raise ServerError("abc")
    
    pass
apimanager.create_api(collection_name='users', model=User,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )
apimanager.create_api(collection_name='employee', model=Employee,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], PUT_SINGLE=[auth_func], POST=[auth_func]),
    postprocess=dict(POST=[user_register], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[]),
    )
apimanager.create_api(collection_name='todo', model=Todo,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )
apimanager.create_api(collection_name='todoschedule', model=TodoSchedule,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    postprocess=dict(POST=[pre_post_todo_schedule], PUT_SINGLE=[pre_put_todo_schedule], DELETE_SINGLE=[], GET_MANY =[]),
    )
apimanager.create_api(collection_name='employeeschedule', model=EmployeeSchedule,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[]),
    )
apimanager.create_api(collection_name='todoscheduledetail', model=TodoScheduleDetail,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func],POST=[auth_func], PUT_SINGLE=[auth_func] ),
    )
apimanager.create_api(collection_name='employee_rel_todo', model=EmployeeRelTodo,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )
apimanager.create_api(collection_name='workstation', model=Workstation,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )
apimanager.create_api(collection_name='organization', model=Organization,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )
apimanager.create_api(collection_name='salary', model=Salary,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    )