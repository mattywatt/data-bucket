angular.module('uploadApp')
	   .controller('dataCtrl',
	   			  ['$scope',
				   '$http',
				   '$location',
				   '$routeParams',

function($scope, $http, $location, $routeParams) {
	
	$scope.isLoading = true;
	$scope.dataId = $routeParams.id;
	$scope.activeTab = 'activity';
	$scope.activityFetched = false; // will be set true upon activity tab selection

	$http.get('/api/data/' + $scope.dataId).
		success(function(data, status, headers, config) {
			$scope.isLoading = false;
			// Data and settings for the chart directive
			$scope.chartData = {
				areaWidth: 960,
				// There is a d3 animation of height 100 to 200
				startAreaHeight: 100,
				finalAreaHeight: 150, // need to leave room for axis + margin
				svgHeight: 200,
				svgWidth: 960,
				svgTopMargin: 20,
				// data from /data/<id> ajax
				data: data.data
			};
			// Data list
			$scope.dataList = data.data;
		}).
		error(function(data, status, headers, config) {

		});
	
	// Fetch activity feed (API history)
	$http.get('/api/data/activity/' + $scope.dataId).
		success(function(data, status, headers, config) {
			$scope.activities = data;
		}).
		error(function(data, status, headers, config) {

		});

}]);