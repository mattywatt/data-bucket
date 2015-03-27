angular.module('uploadApp')
	   .controller('loginCtrl',
	   			  ['$scope',
				   '$http',
				   '$location',
				   '$window',

function($scope, $http, $location, $window) {

	$scope.submit = function() {
		var user = $scope.user;
		$scope.showError = false;
		// provide username and password to obtain a token which will be used for api calls
		$http.post('/api/login', user)
			.success(function(data, status, headers, config) {
				$window.sessionStorage.token = data.token;
				//menuService.login(data.user);
				$location.path('/');
			})
			.error(function(data, status, headers, config) {
				console.log('ERROR TRUE');
				if (status === 500) {
					$scope.loginError = true;
				}
			});
	};

	$scope.toRegister = function() {
		$location.path('/register');
	};
	
}]);