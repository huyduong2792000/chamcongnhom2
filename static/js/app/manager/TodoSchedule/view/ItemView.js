var data_todoschedule =[];
define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/TodoSchedule/tpl/item.html'),
		schema 				= require('json!schema/TodoScheduleDetailSchema.json');
	
	var TodoSelectView   = require('app/manager/Todo/view/SelectView');
	var EmployeeSelectView   = require('app/manager/Employee/view/SelectView');
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
		// foreignRemoteField: "id",
		// foreignField: "todo_schedule_id",

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
        	]
    	},
		
    	render:function(){
    		var self = this;
			this.applyBindings();
			// self.model.on("change:soluong change:dongia", function(){
			// 	self.calculateThanhTien();
			// })
			$("button").on("click", function () {
				console.log(self.model.attributes);
			});
			self.$el.find("#itemRemove").unbind("click").bind("click", function () {
				self.remove(true);
			});
    		
    	},

		// calculateThanhTien: function(){
		// 	var self = this;
		// 	var soluong = self.model.get("soluong");
		// 	var dongia = self.model.get("dongia");
		// 	if(!soluong){
		// 		soluong = 0;
		// 	}
		// 	if(!dongia){
		// 		dongia = 0;
		// 	}
		// 	var thanhtien = parseInt(soluong) * parseInt(dongia);
		// 	self.model.set("thanhtien", thanhtien);
		// }
    });

});