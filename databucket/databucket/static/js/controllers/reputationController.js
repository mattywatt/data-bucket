angular.module('uploadApp')
	   .controller('reputationController',
	   			  ['$scope',
	   			   '$timeout',
	   			   'reputationService',

function($scope, $timeout, reputationService) {

	$scope.$on('actionPushed', function(event, action) {
		$timeout(function () {
			console.log('rep ctrl = ' + action);
		    $scope.reputationAction = action;
		}, 0);
    });

}]);