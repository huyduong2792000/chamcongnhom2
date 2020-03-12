define(function (require) {
	"use strict";

	return [
		{
			"text":"Nhân Viên",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"employee",
		    "route":"employee/collection"
		},
		{
			"text":"Công Việc",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"todo",
			"route":"todo/collection",
			// "visible":function(){
			// 	var role =checkRole();
			// 	if (role=='employee'){
			// 		return false;
			// 	}else if(role == 'admin' ||role =="leader"){
			// 		return true;
			// 	}
			// },
		},
		{
			"text":"Lên Lịch Công Việc",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"todoschedule",
		    "route":"todoschedule/collection"
		},
		{
			"text":"Xem công việc",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"employee_rel_todo",
		    "route":"employee_rel_todo/collection"
		},
		{
			"text":"Lương",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"salary",
		    "route":"salary/collection"
		},
		
	];

});