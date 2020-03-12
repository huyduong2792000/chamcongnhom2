define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
	var template 			= require('text!app/manager/Employee/tpl/model.html'),
		template_schedule	= require('text!app/manager/Employee/tpl/schedule.html'),
		schema 				= require('json!schema/EmployeeSchema.json'),
		schema_schedule     = require('json!schema/EmployeeScheduleSchema.json');

	var Model = Gonrin.Model.extend({
		defaults: Gonrin.getDefaultModel(schema_schedule),
		urlRoot: "/api/v1/employeeschedule",
	})	
	var scheduleView = Gonrin.View.extend({
		template_schedule : _.template(template_schedule),
		tagName: "div",
		className: "grid-container",
		initialize:function(options){
			this.modelEmployee = options.modelEmployee;
			if (this.modelEmployee.get("employee_schedule")[0] == undefined){
				this.model = new Model()
			}else{
				this.model = new Model()
				this.model.attributes = this.modelEmployee.get("employee_schedule")[0]
			}
			this.modelEmployee.on('change:parttime_fulltime',this.render,this);
			
		},
		scheduleEvents:function(self){
			if(self.modelEmployee.get('parttime_fulltime') == 'fulltime'){
				self.scheuduleFulltime(self);
			}else{
				self.$el.find(".schedule-item").removeClass('active bg-primary')
				self.scheduleParttime(self);
			}
		},
		scheuduleFulltime:function(self){
			self.$el.find(".schedule-item").each(function(){
				var field_id = $(this).attr('id')
				$(this).addClass('active bg-primary')
			  });
		},
		scheduleParttime:function(self){
			self.$el.find(".schedule-item").each(function(){
				var field_id = $(this).attr('id')
				if(self.model.get(field_id) == true){
					$(this).addClass('active bg-primary')
				}
				$(this).click(function(){
					$(this).toggleClass('active bg-primary')
					});
				
				});
			
		},
		render:function(){
			var self = this;
			this.$el.html(this.template_schedule());
			self.scheduleEvents(self);			
			return this;
		}
	});
	
    return Gonrin.ModelView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "employee",
		uiControl:{
		fields:[
			{
				field:"position",
				uicontrol:"combobox",
				textField: "position",
				valueField: "id",
				dataSource: [
					{id: "employee", position: "Nhân viên"},
					{id: "leader", position: "Tổ trưởng"},
					
				]
			},
			{
				field:"parttime_fulltime",
				uicontrol:"combobox",
				textField: "parttime_fulltime",
				valueField: "id",
				dataSource: [
					{id: "partime", parttime_fulltime: "Theo ca"},
					{id: "fulltime", parttime_fulltime: "Toàn thời gian"},
				]
			},

		]
	},	
    	tools : [
    	    {
    	    	name: "defaultgr",
    	    	type: "group",
    	    	groupClass: "toolbar-group",
    	    	buttons: [
					{
						name: "back",
						type: "button",
						buttonClass: "btn-default btn-sm",
						label: "TRANSLATE:BACK",
						command: function(){
							var self = this;
							
							Backbone.history.history.back();
						}
					},
					{
		    	    	name: "save",
		    	    	type: "button",
		    	    	buttonClass: "btn-success btn-sm",
		    	    	label: "LƯU NHÂN VIÊN",
		    	    	command: function(){
		    	    		var self = this;
							// self.processSave();
							self.saveSchedule(self)
							self.model.save(null,{
								success: function (model, respose, options) {
									
									self.getApp().notify("Lưu thông tin thành công");
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
									
								},
								error: function (model, xhr, options) {
									self.getApp().notify('Lưu thông tin không thành công!');
								   
								}
							});
		                    
		    	    	}
		    	    },
					{
		    	    	name: "delete",
		    	    	type: "button",
		    	    	buttonClass: "btn-danger btn-sm",
		    	    	label: "TRANSLATE:DELETE",
		    	    	visible: function(){
		    	    		return this.getApp().getRouter().getParam("id") !== null;
		    	    	},
		    	    	command: function(){
		    	    		var self = this;
		                    self.model.destroy({
		                        success: function(model, response) {
		                        	self.getApp().notify('Xoá dữ liệu thành công');
		                            self.getApp().getRouter().navigate(self.collectionName + "/collection");
		                        },
		                        error: function (model, xhr, options) {
		                            self.getApp().notify('Xoá dữ liệu không thành công!');
		                            
		                        }
		                    });
		    	    	}
		    	    },
    	    	],
			}],
		saveSchedule:function(self){
			$(".schedule-item").each(function(){
				var field_id = $(this).attr('id')
					var setobject = self.model.get('employee_schedule')[0] || {}
					if ($(this).hasClass("active")){
						setobject[field_id] = true
					}else{
						setobject[field_id] = false
					}
					self.model.set({
						employee_schedule:[setobject]
					})
				
				});
		},
    	render:function(){
			var self = this;
			// var currUser = self.getApp().currentUser;
			// console.log('model',this.model);

    		var id = this.getApp().getRouter().getParam("id");
    		if(id){
    			//progresbar quay quay
    			this.model.set('id',id);
        		this.model.fetch({
        			success: function(data){
						// console.log(self.model.get('salary'))
						// $('#user').append(UserRegisterView.render());
						// self.model.set({"salary_for_shift":"self.model.get('salary')"})
						self.applyBindings();
						$('#grid-schedule').append(new scheduleView({modelEmployee:self.model}).render().el)
        			},
        			error:function(){
    					self.getApp().notify("Get data Eror");
    				},
        		});
    		}else{
				self.applyBindings();
				$('#grid-schedule').append(new scheduleView({modelEmployee:self.model}).render().el)	
			}
			self.model.on("change:parttime_fulltime ", function(){
				if (self.model.get('parttime_fulltime') == 'partime'){
					$('#salary_for_month').hide()
					$('#salary_for_shift').show();
				}else if(self.model.get('parttime_fulltime') == 'fulltime'){
					$('#salary_for_shift').hide();
					$('#salary_for_month').show()
				}
			});

			
    		
		},

    });

});