angular.module('uploadApp')
       .service('reputationService',

	function($rootScope) {
        this.pushAction = function(action) {
        	console.log('action pushed!');
        	$rootScope.$broadcast('actionPushed', action);
        };
	}
);