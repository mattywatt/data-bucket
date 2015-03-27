angular.module('uploadApp')
	   .controller('uploadCtrl',
	   			  ['$scope',
	   			   '$http',
	   			   '$location',
	   			   '$interval',
	   			   '$anchorScroll',
	   			   'reputationService',

function($scope, $http, $location, $interval, $anchorScroll, reputationService) {

	// configurable

	var scrollPinDist = 160,
		didScroll = false,
		fileJSON;

	$scope.pinUpload = false;
	$scope.pinFileMenu = false;

	/*
	 *	Scroll pin	
	 */
	
	$(window).scroll(function() {
	    didScroll = true;
	});

	$interval(function() {
	    if (didScroll) {
	        didScroll = false;
	        if($(window).scrollTop() >= scrollPinDist) {
	        	$scope.pinUpload = true;
	        	$scope.pinFileMenu = true;
	        }
	        else {
	        	$scope.pinUpload = false;
	        	$scope.pinFileMenu = false;
	        }
	    }
	}, 5);

	$scope.scrollTo = function(id) {
		$location.hash(id);
		$anchorScroll.yOffset = 150; // offset so fixed header doesn't block visibility
		$anchorScroll();
	};

	$scope.uploadSubmit = function() {
		$http.post('/api/data', fileJSON).
			success(function(data, status, headers, config) {
				var id = data.id;
				reputationService.pushAction('upload_data');
				//reputationService.pushAction('test message from uploadCtrl');
				$location.path('/data/' + id);
			}).
			error(function(data, status, headers, config) {
				$scope.errors = data.errors;
				$scope.message = 'Invalid JSON format, see guidelines for correct format';
				$scope.uploadError = true; // pop up will appear because of directive
			});


	};

	$scope.gotoAnchor = function(x) {
		var newHash = 'anchor' + x;
		if ($location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash('anchor' + x);
		} else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			$anchorScroll();
		}
	};

	$('.fileinput-input').on('change', function() {
		var file = $('.fileinput-input')[0].files[0];
		var fr = new FileReader();
		fr.onload = function() {
			fileJSON = JSON.parse(fr.result);
		};
		fr.readAsText(file);
	});

}]);