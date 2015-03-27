angular.module('uploadApp')
	   .directive('helpMessage',

function($parse) {

	return {
		restrict: 'A',
		templateUrl: 'static/js/templates/help_message.html',
		link: function(scope, elem, attrs) {
			// get directives attribute
			var exp = $parse(attrs.helpMessage)(scope);
			console.log(exp);
		}
	};

});