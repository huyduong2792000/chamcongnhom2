var id_detail = 0;
define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/TodoSchedule/tpl/item.html'),
		schema 				= require('json!schema/TodoScheduleDetailSchema.json');
	
	var TodoSelectView   = require('app/manager/Todo/view/SelectView');
	var EmployeeSelectView   = require('app/manager/Employee/view/SelectView');
	var day_working,time_working;
	var Model = Gonrin.Model.extend({
		defaults: Gonrin.getDefaultModel(schema),
		// computeds: {
		// 	todo: {
		// 		deps: ["todo_schedule_id"],
		// 		get: function(todo_schedule_id) {
		// 			return {
		// 				"id": todo_schedule_id,	
		// 				};
		// 		},
		// 		set: function(obj) {
		// 			console.log(obj)
		// 			return {id: obj.id};
		// 		}
		// 	},
		// 	employee: {
		// 		deps: [],
		// 		get: function(id) {
		// 			return {
		// 				"id": id,	
		// 				};
		// 		},
		// 		set: function( obj ) {
		// 			console.log(obj)
		// 			return {id: obj.id};
		// 		}
		// 	},
		// },
		urlRoot : "/api/v1/todoscheduledetail"
	});
    
    return Gonrin.ItemView.extend({
		template : template,
		bindings: "item-bind",
		modelSchema	: schema,
		modelClass: Model,
		tagName: 'tr',
    	urlPrefix: "/api/v1/",
		collectionName: "todoscheduledetail",
		uiControl:{
    		fields:[
        		{
    				field:"todo",
    				uicontrol:"ref",
					textField: "todo_name",
					selectionMode: "multiple",
					foreignRemoteField: "id",
    				dataSource: TodoSelectView
				},
				{
    				field:"employee",
    				uicontrol:"ref",
					textField: "name",
					selectionMode: "multiple",
					foreignRemoteField: "id",
    				dataSource: EmployeeSelectView
				},
				{
					field:"day_working",
					uicontrol:"combobox",
					textField: "day_working",
					valueField: "id",
					dataSource: [
						{id: "monday", day_working: "Thứ 2"},
						{id: "Tuesday", day_working: "Thứ 3"},
						{id: "wednesday", day_working: "Thứ 4"},
						{id: "thursday", day_working: "Thứ 5"},
						{id: "friday", day_working: "Thứ 6"},
						{id: "saturday", day_working: "Thứ 7"},
						{id: "sunday", day_working: "Chủ nhật"},
						
					]
				},	
				{
					field:"time_working",
					uicontrol:"combobox",
					textField: "time_working",
					valueField: "id",
					dataSource: [
						{id: "morning", time_working: "Buổi sáng"},
						{id: "afternoon", time_working: "Buổi chiều"},
					]
				},
        	]
		},
		
    	render:function(){
    		var self = this;
			this.applyBindings();
			console.log('model',self.model);
			self.model.fetch({
				success: function(data){
					var list_attr_remove=['page','objects','total_pages','num_results'];
						list_attr_remove.forEach(unsetFunction);
						function unsetFunction(item, index) {
							self.model.unset(item)
						};
					self.applyBindings();
				},
				error:function(){
					self.getApp().notify("Get data Eror");
				},
			});
			if (self.model.get('id') == null){
				self.model.save();
			};

			self.$el.find("#itemRemove").unbind("click").bind("click", function () {
				self.remove(true);
				self.model.destroy();
			});
    		
    	},
    });

});