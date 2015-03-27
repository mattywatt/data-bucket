angular.module('uploadApp', ['ngRoute'])

.config(['$interpolateProvider',
		 '$routeProvider',
		 '$locationProvider',
		 '$httpProvider',

function($interpolateProvider, $routeProvider, $locationProvider, $httpProvider) {

	$interpolateProvider.startSymbol('<%').endSymbol('%>');
	// Auth headers
	$httpProvider.interceptors.push('authInterceptor');
	
	$routeProvider
		.when('/', {
			controller: 'uploadCtrl',
			templateUrl: 'static/js/templates/upload.html'
		})
		.when('/data/:id', {
			templateUrl: 'static/js/templates/data.html',
			controller: 'dataCtrl'
		})
		.when('/upload/invalid', {
			templateUrl: 'static/js/templates/upload_invalid.html',
			controller: 'uploadInvalidCtrl'
		})
		.when('/register', {
			templateUrl: 'static/js/templates/register.html',
			controller: 'registerCtrl'
		})
		.when('/login', {
			templateUrl: 'static/js/templates/login.html',
			controller: 'loginCtrl'
		})
		.when('/logout', {
			templateUrl: 'static/js/templates/logout.html',
			controller: 'loginCtrl'
		});


}]);

