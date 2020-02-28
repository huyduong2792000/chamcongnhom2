define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
	var template_collection = require('text!app/manager/EmployeeRelTodo/tpl/collection.html');
	var	schema 				= require('json!schema/EmployeeRelTodoSchema.json');
	var modelView           = require('app/manager/EmployeeRelTodo/view/modelView');
	var Model = Gonrin.Model.extend({
		defaults:{
			'todo_name':'',
			'employee_name':'',
			'employee_assign_name':'',
		},
		urlRoot: "/api/v1/employee_rel_todo",
	})
	return Gonrin.CollectionView.extend({
		template:template_collection,
		modelSchema	: schema,
		urlPrefix:'/api/v1/',
		collectionName:'employee_rel_todo',
		render:function(){
			var self=this;
			this.collection.fetch({
				url: "http://0.0.0.0:8090/api/v1/employee_rel_todo?results_per_page=10000",
				type:'get',
				success: function(data){
					self.filter('morning','#employee_rel_todo_detail_morning');
					self.filter('afternoon','#employee_rel_todo_detail_afternoon');
				},
				error:function(){
					self.getApp().notify("Get data Eror");
				},
			});
			$('#add_employee_rel_todo').unbind('click').bind('click',function(){
				var model = new Model();
				var start_time_working = new Date(Date.now())
				model.set({
					day_working:self.checkNameToday(),
					time_working:'morning',
					start_time_working:start_time_working ,
					end_time_working:moment().endOf('day').toDate()
				});
				var modelview = new modelView({model:model});
				$('#employee_rel_todo_detail_morning').append(modelview.render().el);

			});
			$('#restart').unbind('click').bind('click',function(){
				
				$('#employee_rel_todo_detail_morning').empty();
				self.render();
				// self.filter('morning','#employee_rel_todo_detail_morning');
				// self.filter('afternoon','#employee_rel_todo_detail_afternoon');
			});
		
		},
		checkNameToday:function(){
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var today = new Date();
			var name_today = days[today.getDay()];
			return name_today
		},
		checkNowTimestamp:function(){
			return Date.now();
		},
		filter:function(time_working,item_append){
			var self = this;
			var user = gonrinApp().currentUser;
			var role_user = user.role;
			var employee_id = user.employee_id
			var dayWorking = self.checkNameToday();
			$('#name_today').val(dayWorking);
			var timeFilter = time_working;
			if (role_user=='admin'||role_user=='leader'){
				self.filtered = _.filter(self.collection.models,function(item){
					var start_time_visible = Date.parse(item.get('start_time_visible'));
					var end_time_visible = Date.parse(item.get('end_time_visible'));
					if (isNaN(start_time_visible) ||isNaN(end_time_visible== NaN)){
						start_time_visible=0;
						end_time_visible=0;
					}
					return (item.get('time_working').toLowerCase().indexOf(timeFilter.toLowerCase())!==-1)
					&&(item.get('day_working').toLowerCase().indexOf(dayWorking.toLowerCase())!==-1)
					&&(Date.parse(item.get('start_time_working'))<= self.checkNowTimestamp())
					&&(self.checkNowTimestamp()<=Date.parse(item.get('end_time_working')))
					&&((start_time_visible - self.checkNowTimestamp())
					*(end_time_visible - self.checkNowTimestamp()) >=0);
				});
			}else if(role_user=='employee'){
				self.filtered = _.filter(self.collection.models,function(item){
					return (item.get('time_working').toLowerCase().indexOf(timeFilter.toLowerCase())!==-1)
					&&(item.get('day_working').toLowerCase().indexOf(dayWorking.toLowerCase())!==-1)
					&&(item.get('employee_id')==employee_id)
					&&(Date.parse(item.get('start_time_working'))<= self.checkNowTimestamp())
					&&(self.checkNowTimestamp()<=Date.parse(item.get('end_time_working')))
					&&((start_time_visible - self.checkNowTimestamp())
					*(end_time_visible - self.checkNowTimestamp()) >=0);
				});
			}
			// var data_group = self.groupEmployeeAfterFilter();
			_.each(self.filtered,function(item){
				// console.log('item',item.get('todo').level_diffcult);
				// var employee_assign = self.findEmployeeBeAssign(data_group);
				// var assign_data = {'employee':employee_assign,'total_level_dif_todo':item.get('todo').level_diffcult};
				// console.log('employee_assign',item.get('employee_assign'));
				// if (item.get('employee_assign').id == item.get('employee').id) {
				// 	item.set({'employee_assign_name':employee_assign.name,
				// 	'employee_assign':employee_assign
				// 	});
				// }
				var modelview = new modelView({model:item});
				// data_group = self.groupEmployeeAfterAssign(assign_data,data_group);
				// console.log('data group',data_group);
				
				$(item_append).append(modelview.render().el);
			},this);
		},
		
		
	});

});
// groupEmployeeAfterFilter:function(){
		// 	var data_group = [];
		// 	this.filtered.forEach(function(value,index){
		// 		var index_of_value_map_data_group = data_group.findIndex(function(e){
		// 			// console.log(e.employee);
		// 			// console.log(JSON.stringify(e.employee.id)==value.get('employee').id);
		// 			return e.employee.id ==value.get('employee').id;
		// 		});
		// 		if (index_of_value_map_data_group==-1){
		// 			data_group.push({'employee':value.get('employee'),'total_level_dif_todo':value.get('todo').level_diffcult});
		// 		}else{
		// 			data_group[index_of_value_map_data_group]['total_level_dif_todo']+= value.get('todo').level_diffcult;
		// 		}
		// 	});
		// 	return data_group;
			  
		// },
		// findEmployeeBeAssign: function(data_group){
		// 	var total_level_dif_todo_min = data_group[0].total_level_dif_todo;
		// 	var employee_has_total_level_dif_todo_min = data_group[0].employee;
		// 	data_group.forEach(function(value,index){
		// 		if (value.total_level_dif_todo < total_level_dif_todo_min){
		// 			total_level_dif_todo_min = value.total_level_dif_todo;
		// 			employee_has_total_level_dif_todo_min = value.employee;
		// 		};
		// 	});
		// 	// console.log(employee_has_total_level_dif_todo_min);
		// 	return employee_has_total_level_dif_todo_min;
		// },
		// groupEmployeeAfterAssign:function(assign_data,data_group){
		// 	// console.log('assign data employee',assign_data.employee);
		// 	data_group.forEach(function(value,index){
		// 		// console.log(value.employee);
		// 		if(value.employee.id == assign_data.employee.id){
		// 			data_group[index].total_level_dif_todo += assign_data.total_level_dif_todo;
		// 		}
		// 	});
		// 	return data_group;
		// },