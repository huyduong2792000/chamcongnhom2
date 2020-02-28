define(function (require) {
	"use strict";
	function checkRole(){
		var role = gonrinApp().currentUser != null ? gonrinApp().currentUser.role: false;
		return role;
	};
	// {
	// 	"text": "API Document",
	// 	"icon": "fa fa-folder-open-o",
	// 	"type": "category",
	// 	"visible": function () {
	// 		return false;
	// 		var user = gonrinApp().currentUser;
	// 		if (!!user) {
	// 			var arr_roles = user.roles
	// 			var _bool = false
	// 			arr_roles.forEach(element => {
	// 				let role_name = element.role_name 
	// 				if ( role_name== "ADMIN" || role_name== "TECHNICAL") {
	// 					_bool = true
	// 				}
	// 			});
	// 			return _bool;

	// 		}
	// 	},
	// 	"entries": [

	// 		{
	// 			"text": "Tài liệu Api",
	// 			"icon": "",
	// 			"type": "view",
	// 			"route": "MenuDocumentApi/collection",
	// 			"$ref": "app/menu_document_api/view/CollectionView",
	// 			"visible": function () {
	// 				return false;
	// 			}
	// 		},

	// 	]
	// },
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