var id_detail = 0;
define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/TodoSchedule/tpl/item.html'),
		schema 				= require('json!schema/TodoScheduleDetailSchema.json');
	
	var template_filter		= require('text!app/manager/EmployeeRelTodo/tpl/filter.html');
    
    return Gonrin.View.extend({
		tagName:'li',
		template_filter: _.template(template_filter),
		initialize: function(options) {
			this.datafilter = options.datafilter;
			this.model=options.model;
			this.field_filter = options.field_filter;
			// console.log('option',this.options);
			// _.bindAll(this, 'render');
		},
		events:{
			'click #select':'setValue'
		},
		setValue:function(){
			var self = this;
			if (self.field_filter == "#todo_filter"){
				self.model.set({
					todo:self.datafilter.todo,
					todo_name:self.datafilter.todo_name,
					todo_id:self.datafilter.id,
				});
			}else if (self.field_filter == "#employee_filter"){
				self.model.set({
					employee:self.datafilter.employee,
					employee_name:self.datafilter.name,
					employee_id:self.datafilter.id,
				});
			}else if (self.field_filter == "#employee_assign_filter"){
				self.model.set({
					employee_assign_name:self.datafilter.name,
					employee_assign_id:self.datafilter.id,
				});
			}
			
		},
		render:function(){
			var self = this;
			// console.log(self.field_filter == "#employee_assign_filter");
			this.$el.html(this.template_filter(self.datafilter));
			return this;
		},
	});
});