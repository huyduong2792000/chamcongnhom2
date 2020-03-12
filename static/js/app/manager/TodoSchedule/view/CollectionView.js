define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/manager/TodoSchedule/tpl/collection.html');
    var	schema 				= require('json!schema/TodoScheduleSchema.json');
    var dataSource= [
		{id: 1, time_working: "Sáng thứ 2"},
		{id: 2, time_working: "Chiều thứ 2"},
		{id: 3, time_working: "Sáng thứ 3"},
		{id: 4, time_working: "Chiều thứ 3"},
		{id: 5, time_working: "Sáng thứ 4"},
		{id: 6, time_working: "Chiều thứ 4"},
		{id: 7, time_working: "Sáng thứ 5"},
		{id: 8, time_working: "Chiều thứ 5"},
		{id: 9, time_working: "Sáng thứ 6"},
		{id: 10, time_working: "Chiều thứ 6"},
		{id: 11, time_working: "Sáng thứ 7"},
		{id: 12, time_working: "Chiều thứ 7"},
		{id: 13, time_working: "Sáng chủ nhật"},
		{id: 14, time_working: "Chiều chủ nhật"},
	];
    return Gonrin.CollectionView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "todoschedule",
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
							var path = "todoschedule" + '/model';
							self.getApp().getRouter().navigate(path);
						}
					},
					
					
				]
			},
		],
    	uiControl:{
    		fields: [
				{ 
	    	    	field: "id",label:"ID",
				},
				{
					field: "start_time_working", 
					label: "Bắt đầu ngày",
				},	
				{
					field: "end_time_working", 
					label: "Kết thúc ngày",
				},	
		     ],
		     onRowClick: function(event){
		    	if(event.rowId){
		        		var path = this.collectionName + '/model?id='+ event.rowId;
		        		this.getApp().getRouter().navigate(path);
		        }
		    	
		    }
    	},
	    render:function(){
			var self = this;
			// console.log('collection',this)
			// self.collection.set({'url':"http://0.0.0.0:8090/api/v1/todoschedule?page=2&results_per_page=10"});
			// this.collection.fetch({
			// 	url: "http://0.0.0.0:8090/api/v1/todoschedule?results_per_page=10000",
			// 	type:'get',
			// 	success: function(data){
			// 		console.log("schedule",data.models);
			// 		_.each(data.models,function(){

			// 		},this)
			// 		// self.applyBindings();
			// 	},
			// 	error:function(){
			// 		self.getApp().notify("Get data Eror");
			// 	},
			// });
			// this.collection.fetch({
			// 	url: "http://0.0.0.0:8090/api/v1/todoscheduledetail?results_per_page=10000",
			// 	type:'get',
			// 	success: function(data){
			// 		console.log("detail",data.models);
			// 		// self.applyBindings();
			// 	},
			// 	error:function(){
			// 		self.getApp().notify("Get data Eror");
			// 	},
			// });
			 this.applyBindings();
			//  console.log(this.collection.models)
			//  _.each(this.collection.models,function(todoschedule,index){
			// 	console.log(todoschedule.todoschedule);
			// },this);
	    	 return this;
    	},
    });

});