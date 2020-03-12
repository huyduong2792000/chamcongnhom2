define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/Salary/tpl/collection.html');
    var	schema 				= require('json!schema/SalarySchema.json');
	var template_itemview 	= require('text!app/manager/Salary/tpl/item.html');
	var itemView = Gonrin.ItemView.extend({
		template : template_itemview,
		bindings: "item-bind",
		modelSchema	: schema,
		tagName: 'tr',
		urlPrefix: "/api/v1/",
		collectionName: "salary",
    	render:function(){
    		var self = this;
			this.applyBindings();
			self.$el.find("#itemRemove").unbind("click").bind("click", function () {
				self.remove(true);
				self.model.destroy();
			});
    		return this;
    	},
    });
    return Gonrin.CollectionView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "salary",
		tools: [
			{
				name: "default",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "create",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "Tạo mới",
						command: function(){
							var self = this;
							var path = self.collectionName + '/model';
							self.getApp().getRouter().navigate(path);
						}
					},
					
				]
			},
		],
    	uiControl:{

    	},
	    render:function(){
			var self = this;
			this.collection.fetch({
				success: function(data){
					// self.applyBindings();
					self.itemviewRender()
				},
				error:function(){
					self.getApp().notify("Get data Eror");
				},
			});
	    	return this;
		},
		itemviewRender(){
			// var data_render = this.groupEmployeeFollowId(this.collection.models)
			this.collection.models.forEach(function(model){
				var itemview = new itemView({model:model})
				$("#list_salary").append(itemview.render().el);
			})
		},
		groupEmployeeFollowId(data_original){
			var self = this;
			var result = []
			data_original.forEach(function(value,index){
				var index_of_value_in_result = result.findIndex(function(e){
					return e.get('id_employee') == value.get('id_employee');
				});
				if (index_of_value_in_result==-1){
					result.push(value);
				}else{
					var total_salary_current = result[index_of_value_in_result].get('total_salary')
					var total_hours_working_current = result[index_of_value_in_result].get('total_hours_working_in_day')
					result[index_of_value_in_result].set({
						total_salary : total_salary_current +value.get('total_salary'),
						total_hours_working_in_day: total_hours_working_current+value.get('total_hours_working_in_day')
					});
				}
			})
			return result
		}
    });

});