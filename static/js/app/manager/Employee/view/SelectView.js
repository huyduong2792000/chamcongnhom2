define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/Employee/tpl/dialog.html'),
    	schema 				= require('json!schema/EmployeeSchema.json');
	var DiaLogItemView = Gonrin.View.extend({
		tagName:'tr',
		className:"grid_row",
		template_model:_.template(`<td><%= name %></td><td><%= hometown %></td>`),
		initialize:function(options){
			this.selectedItems = options.selectedItems
		},
		events:{
			'click':'addToSelectItem',
		},
		addToSelectItem:function(){
			var self = this;
			self.$el.toggleClass('select-employee bg-primary')
			if (self.$el.hasClass('select-employee')){
				self.selectedItems.push(self.model.attributes)
				
			}else{
				var index_remove = self.selectedItems.findIndex(function(e){
					return e.id == self.model.get('id')
				})
				self.selectedItems.splice(index_remove,1)

			}
		},
		renderEmployeeHasSelect:function(self){
			var index_model_on_selectitem = self.selectedItems.findIndex(function(e){
				return e.id == self.model.get('id')
			})
			if(index_model_on_selectitem != -1){
				self.$el.addClass('select-employee bg-primary')
			}
		},
		render:function(){
			var self = this;
			this.$el.html(this.template_model(this.model.toJSON()));
			self.renderEmployeeHasSelect(self)
			return this
		}
	})
	return Gonrin.CollectionDialogView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
    	collectionName: "employee",
    	textField: "name",
    	valueField: "id",
    	tools : [
    	    {
    	    	name: "defaultgr",
    	    	type: "group",
    	    	groupClass: "toolbar-group",
    	    	buttons: [
					{
		    	    	name: "select",
		    	    	type: "button",
		    	    	buttonClass: "btn-success btn-sm",
		    	    	label: "TRANSLATE:SELECT",
		    	    	command: function(){
							var self = this;
		    	    		self.trigger("onSelected");
		    	    		self.close();
		    	    	}
		    	    },
    	    	]
    	    },
    	],
    	uiControl:{
    		// fields: [
	    	//      { field: "id", label: "Mã", width:150},
		    //  	 { field: "name", label: "Tên", width:250 },
			// // ],
		    // onRowClick: function(event){
			// 	this.uiControl.selectedItems = event.selectedItems;
	    	// },
		},
		initialize:function(options){
		},
    	render:function(){
			var self= this;
			
			var day_working = this.viewData.get('day_working'),
				time_working = this.viewData.get('time_working');

			if (day_working != null && time_working !=null){
				self.collection.fetch({
					success:function(data){
						var filtered = _.filter(self.collection.models,function(item){
							
							return item.get('employee_schedule')[0][day_working+'_'+time_working] == true
							
						});
						self.$el.find("#grid-data").empty();
						filtered.forEach(function(value,index){
							self.$el.find("#grid-data").append(new DiaLogItemView({model:value,selectedItems:self.uiControl.selectedItems}).render().el)
						})

					}
				})
				return this;
		}else{
			self.getApp().notify({message: 'Bạn chưa nhập thứ và thời gian sáng chiều'},{type: "danger"});
		}
    		
    	},
    	
    });

});