define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	return [
		{
			"collectionName": "employee", 
			"route": "employee/collection",
			"$ref": "app/manager/Employee/view/CollectionView",
		},
		{
			"collectionName": "employee",
			"route": "employee/model(/:id)",
			"$ref": "app/manager/Employee/view/ModelView",
		},
		{
			"collectionName": "todo", 
			"route": "todo/collection",
			"$ref": "app/manager/Todo/view/CollectionView",
		},
		{
			"collectionName": "todo",
			"route": "todo/model(/:id)",
			"$ref": "app/manager/Todo/view/ModelView",
		},
		{
			"collectionName": "todoschedule", 
			"route": "todoschedule/collection",
			"$ref": "app/manager/TodoSchedule/view/CollectionView",
		},
		{
			"collectionName": "todoschedule",
			"route": "todoschedule/model(/:id)",
			"$ref": "app/manager/TodoSchedule/view/ModelView",
		},
	];

});


