angular.module('uploadApp')
	   .controller('uploadInvalidCtrl',
	   			  ['$scope',
				   '$http',
				   '$location',

function($scope, $http, $location) {
	$scope.errors = $scope.$parent.errors;	
}]);