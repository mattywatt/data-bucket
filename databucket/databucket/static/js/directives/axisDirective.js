angular.module('uploadApp')
       .directive('axis',

function() {
	return {
		restrict: 'E',
		scope: {
			chartData: '='
		},
		link: function(scope, elem, attrs) {
			scope.$watch('chartData', function(newVal, oldVal) {
				// undefined when DOM first loads, until ajax callback sets the
				if (typeof newVal !== 'undefined') {
					// just for readability
					var chartSettings = newVal;
					scope.areaWidth = chartSettings.areaWidth;
					
					// convert date strings to JS dates for d3
					for (var i = 0; i < newVal.data.length; i++) {
						newVal.data[i].x = new Date(newVal.data[i].x);
					}

					scope.data = chartSettings.data;
					var ticks = scope.xScale().ticks(3);

					for (var i = 0; i < ticks.length; i++) {
						var tick = ticks[i]; // this is a JS date
						var xScale = scope.xScale(); // get x scale which is based on data domain and physical/pixel width
						var pos = Math.round(xScale(tick)); // this gets the date position based on x scale

						var format = d3.time.format("%Y-%m-%d");
						var dateStr = format(tick);
						$(elem).append('<div class="x-tick" style="left: '+pos+'px;">'+dateStr+'</div>');
						
					}

				}

			});

			scope.xScale = function() {
				return d3.time.scale().domain(scope.xDomain()).range([0, scope.areaWidth]);
			};

			scope.xDomain = function() {
				return d3.extent(scope.data, function(d) { return d.x; });
			};

		}
	};

});