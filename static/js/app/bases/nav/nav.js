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
		    "route":"todo/collection"
		},

		{
			"text":"Khách hàng",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"khachhang",
		    "route":"khachhang/collection"
		},
		{
			"text":"Hàng hoá",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"hanghoa",
		    "route":"hanghoa/collection"
		},
		{
			"text":"Hoá đơn",
			"icon":"fa fa-child",
			"type":"view",
			"collectionName":"hoadon",
		    "route":"hoadon/collection"
		},
		{
			"text":"Hệ thống",
			"icon":"fa fa-child",
			"type": "category",
			"entries": [
				{
					"text":"Người dùng",
					"icon":"fa fa-child",
					"type":"view",
					"collectionName":"user",
					"route":"user/collection"
				},
				{
					"text":"Vai trò",
					"icon":"fa fa-child",
					"type":"view",
					"collectionName":"user",
					"route":"role/collection"
				},
			]
		},

		
	];

});