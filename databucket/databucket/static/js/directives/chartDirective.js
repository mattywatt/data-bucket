angular.module('uploadApp')
       .directive('chart',

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

					scope.data = chartSettings.data;
					scope.topMargin = chartSettings.svgTopMargin;
					scope.svgWidth = chartSettings.svgWidth;
					scope.svgHeight = chartSettings.svgHeight;
					scope.areaWidth = chartSettings.areaWidth;
					scope.startAreaHeight = chartSettings.startAreaHeight;
					scope.finalAreaHeight = chartSettings.finalAreaHeight;
					scope.axisOffset = chartSettings.finalAreaHeight + 5;
					
					// convert date strings to JS dates for d3
					for (var i = 0; i < newVal.data.length; i++) {
						newVal.data[i].x = new Date(newVal.data[i].x);
					}

					// set the initial height for animation
					scope.areaHeight = scope.startAreaHeight;

					scope.svg = d3.select(elem[0])
								.append('svg')
								.attr('width', scope.svgWidth)
								.attr('height', scope.svgHeight)
								.append('g')
								.attr('transform', 'translate(0, ' + scope.topMargin + ')');

					// append area to svg
					scope.appendArea();
					// set new height for animation to take place
					scope.areaHeight = scope.finalAreaHeight;
					scope.renderArea();
				}

			});

			scope.appendArea = function() {
				scope.svg.append("path")
					.datum(scope.data)
					.attr("class", "area")
					.attr("d", scope.area())
					.attr('transform', 'translate(0, 50)');
			},

			scope.renderArea = function() {
				scope.svg.select('path')
					.datum(scope.data)
					.transition()
				    .each('end', function() {
				        d3.select(this)
				            .transition()
				            .ease('elastic', 1, .3)
				            .duration(800)
				            .attr('transform', 'translate(0, 0)')
				            .attr('d', scope.area());
						    });
			},

			scope.xScale = function() {
				return d3.time.scale().domain(scope.xDomain()).range([0, scope.areaWidth]);
			};

			scope.yScale = function() {
				return d3.scale.linear().domain(scope.yDomain()).range([scope.areaHeight, 0]);
			};

			scope.xDomain = function() {
				return d3.extent(scope.data, function(d) { return d.x; });
			};

			scope.yDomain = function() {
				return d3.extent(scope.data, function(d) { return d.y; });
			};

			scope.area = function() {
				var x = scope.xScale(scope.areaWidth),
					y = scope.yScale(scope.areaHeight);

				return d3.svg.area()
				    .x(function(d) { return x(d.x); })
				    .y0(scope.areaHeight)
				    .y1(function(d) { return y(d.y); });
			};

			scope.renderChart = function(width, height) {

			};

		}
	};

});