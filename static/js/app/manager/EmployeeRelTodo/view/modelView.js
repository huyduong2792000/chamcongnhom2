define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
	var template_model 		= require('text!app/manager/EmployeeRelTodo/tpl/model.html');
    var filterView 			= require('app/manager/EmployeeRelTodo/view/filterView');
    return Gonrin.View.extend({
		tagName:'tr',

		template_model: _.template(template_model),
		initialize:function(){
			this.model.on('change',this.activeSaveModel,this);
		},
		events:{
			'keyup #todo_name':'completeTodo',
			'keyup #employee_name':'completeEmployee',
			'keyup #employee_assign_name':'completeEmployeeAssign',
			'click #itemSave':'saveModel',
			'click #itemRemove':'removeModel',
			'click #checkbox-employee':'setStatusEmployee',
			'click #checkbox-manager':'setStatusManager'
		},
		completeTodo:function(e){
			var self=this;
			this.searchvalue = e.target.value;
			var listtodo = {};
			$.ajax({
				url:'/api/v1/todo',
				type:'GET',
				success:function(data){
					self.listtodo = data;
					var filtered = _.filter(self.listtodo.objects,function(todo){
						console.log('todo',todo);
						return todo.todo_name.toLowerCase().indexOf(self.searchvalue.toLowerCase())!==-1;
					});
					self.renderFilterView(filtered,'#todo_filter');
				},
			});
		},
		completeEmployee:function(e){
			var self=this;
			this.searchvalue = e.target.value;
			var listtodo = {};
			$.ajax({
				url:'/api/v1/employee',
				type:'GET',
				success:function(data){
					self.listemployee = data;
					var filtered = _.filter(self.listemployee.objects,function(employee){
						return employee.name.toLowerCase().indexOf(self.searchvalue.toLowerCase())!==-1;
					});
					self.renderFilterView(filtered,'#employee_filter');
				},
			});
		},
		completeEmployeeAssign:function(e){
			var self=this;
			this.searchvalue = e.target.value;
			var listtodo = {};
			$.ajax({
				url:'/api/v1/employee',
				type:'GET',
				success:function(data){
					self.listemployee = data;
					var filtered = _.filter(self.listemployee.objects,function(employee){
						return employee.name.toLowerCase().indexOf(self.searchvalue.toLowerCase())!==-1;
					});
					self.renderFilterView(filtered,'#employee_assign_filter');
				},
			});
		},
		renderFilterView:function(filtered,field_filter){
			var self = this;
			self.$el.find(field_filter).empty();
			_.each(filtered, function(datafilter){
				var filter_view = new filterView({datafilter:datafilter,model:self.model,field_filter:field_filter});
				self.$el.find(field_filter).append(filter_view.render().el);
			});
		},
		setStatusEmployee:function(){
			var self=this;
			if (self.model.get('status_complete_employee')==0){
				self.model.set({status_complete_employee:1});
			}else{
				self.model.set({status_complete_employee:0});
			};
			
		},
		setStatusManager:function(){
			var self=this;
			if (self.model.get('status_complete_manager')==0){
				self.model.set({status_complete_manager:1});
			}else{
				self.model.set({status_complete_manager:0});
			};
		},
		newNode:function(){
			var self = this;
			return this.model;	
		},
		removeModel:function(){
			this.remove(true);
			this.model.set({
				start_time_visible:moment().endOf('day').toDate(),
				end_time_visible:moment().startOf('day').toDate()
			});
			this.model.save();
			this.getApp().notify({message: "Đã vô hiệu hóa"},{type: "success"});

		},
		saveModel:function(){
			var self = this;
			self.model.save(null,{
				
				success: function (model, respose, options) {
					self.getApp().notify({message: "Lưu thông tin thành công"},{type: "success"});
				},
				error: function (model, xhr, options) {
					self.getApp().notify({message: "Lưu thông tin thất bại"},{type: "danger"});
				   
				}
			});
		},
		activeSaveModel:function(){
			var self = this;
			self.render();
			self.$el.find('#itemSave').fadeIn(800);
		},
		render:function(){
			var self = this;
			var role_user = gonrinApp().currentUser.role;
			// this.$el.html(template());
			this.$el.html(this.template_model(this.model.toJSON()));
			if (self.model.get('status_complete_manager') == 1){
				self.$el.find('#checkbox-manager').prop('checked', true);
			};
			if (self.model.get('status_complete_employee') == 1){
				self.$el.find('#checkbox-employee').prop('checked', true);
			};
			if (role_user =='employee'){
				self.$el.find('#checkbox-manager').prop('readonly', true);
				self.$el.find('#todo_name').prop('readonly', true);
				self.$el.find('#employee_name').prop('readonly', true);
				self.events = _.clone(self.events);
				delete self.events['click #checkbox-manager','keyup #todo_name'];
				self.delegateEvents();employee_filter
			}else if(role_user =='leader'){
				self.$el.find('#checkbox-employee').prop('readonly', true);
				self.events = _.clone(self.events);
				delete self.events['click #checkbox-employee'];
				self.delegateEvents()
			};
			
			return self;
		},
	});
})