angular.module('uploadApp')
	   .controller('registerCtrl',
	   			  ['$scope',
				   '$http',
				   '$location',
				   '$window',
				   'menuService',

function($scope, $http, $location, $window, menuService) {

	$scope.submit = function() {
		var user = $scope.user;

		$http.post('/users', user).
			// Same page loading animation
			success(function(data, status, headers, config) {
				$window.sessionStorage.token = data.token;
				menuService.login(data.user);
			}).
			error(function(data, status, headers, config) {
				$scope.errors = data.errors;
				$scope.message = 'Invalid JSON format, see guidelines for correct format';
				$scope.uploadError = true;
			});
	};

	$scope.toLogin = function() {
		$location.path('/login');
	};
	
}]);