angular.module('uploadApp')
	   .service('datasetService', ['$http', '$q',
function($http, $q) {
	var getData = function(dataId) {
		return $http({
			method: 'GET',
			url: '/data'
		});
	};

	var createData = function(data) {
		var d = $q.defer();
		return d.promise;
	};

}]);