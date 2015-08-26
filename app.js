angular.module('ritoplzmyapitems', ['ngAnimate', 'ngRoute', 'templates', 'ui.bootstrap']).config(function($routeProvider) {
  return $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  }).when('/scatter', {
    templateUrl: 'scatter/scatter.html',
    controller: 'ScatterCtrl'
  }).when('/info', {
    templateUrl: 'info/info.htm',
    controller: 'InfoCtrl'
  }).otherwise({
    redirectTo: '/'
  });
});

angular.module('ritoplzmyapitems').controller('InfoCtrl', function($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.ok = function() {
    return $modalInstance.close($scope.selected.item);
  };
  return $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
});

angular.module('ritoplzmyapitems').controller('MainCtrl', [
  '$scope', '$http', function($scope, $http) {
    var canvas_height, canvas_width, dataset, i, maxRange, newNumber1, newNumber2, numDataPoints, padding, svg, xAxis, xScale, yAxis, yScale;
    $scope.templates = [
      {
        name: 'template1.html',
        url: 'scatter/template.html'
      }, {
        name: 'template2.html',
        url: 'detail/template.html'
      }
    ];
    $scope.template = $scope.templates[0];
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function(size) {
      var modalInstance;
      modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'info/info.html',
        controller: 'InfoCtrl',
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      return modalInstance.result.then((function(selectedItem) {
        return $scope.selected = selectedItem;
      }), function() {
        return $log.info('Modal dismissed at: ' + new Date);
      });
    };
    dataset = [];
    numDataPoints = 15;
    maxRange = Math.random() * 1000;
    i = 0;
    while (i < numDataPoints) {
      newNumber1 = Math.floor(Math.random() * maxRange);
      newNumber2 = Math.floor(Math.random() * maxRange);
      dataset.push([newNumber1, newNumber2]);
      i++;
    }
    canvas_width = 500;
    canvas_height = 300;
    padding = 30;
    xScale = d3.scale.linear().domain([
      0, d3.max(dataset, function(d) {
        return d[0];
      })
    ]).range([padding, canvas_width - (padding * 2)]);
    yScale = d3.scale.linear().domain([
      0, d3.max(dataset, function(d) {
        return d[1];
      })
    ]).range([canvas_height - padding, padding]);
    xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5);
    yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);
    svg = d3.select('h3').append('svg').attr('width', canvas_width).attr('height', canvas_height);
    svg.selectAll('circle').data(dataset).enter().append('circle').attr('cx', function(d) {
      return xScale(d[0]);
    }).attr('cy', function(d) {
      return yScale(d[1]);
    }).attr('r', 2);
    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (canvas_height - padding) + ')').call(xAxis);
    svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + padding + ',0)').call(yAxis);
    return d3.select('h4').on('click', function() {
      var numValues;
      numValues = dataset.length;
      maxRange = Math.random() * 1000;
      dataset = [];
      i = 0;
      while (i < numValues) {
        newNumber1 = Math.floor(Math.random() * maxRange);
        newNumber2 = Math.floor(Math.random() * maxRange);
        dataset.push([newNumber1, newNumber2]);
        i++;
      }
      xScale.domain([
        0, d3.max(dataset, function(d) {
          return d[0];
        })
      ]);
      yScale.domain([
        0, d3.max(dataset, function(d) {
          return d[1];
        })
      ]);
      svg.selectAll('circle').data(dataset).transition().duration(1000).each('start', function() {
        return d3.select(this).attr('fill', 'red').attr('r', 5);
      }).delay(function(d, i) {
        return i / dataset.length * 500;
      }).attr('cx', function(d) {
        return xScale(d[0]);
      }).attr('cy', function(d) {
        return yScale(d[1]);
      }).each('end', function() {
        return d3.select(this).transition().duration(500).attr('fill', 'black').attr('r', 2);
      });
      svg.select('.x.axis').transition().duration(1000).call(xAxis);
      return svg.select('.y.axis').transition().duration(100).call(yAxis);
    });
  }
]);

angular.module('ritoplzmyapitems').controller('ScatterCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    $scope.d3OnClick = function(item) {
      return alert(item.name);
    };
    $scope.apItems = [];
    return championItemService.getDataFor('items').success(function(res) {
      if (res.error) {
        throw new Error(res.message);
      } else {
        return $scope.apItems = res;
      }
    });
  }
]);

angular.module('ritoplzmyapitems').directive('d3Scatter', [
  function() {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, element) {
        var svg;
        svg = d3.select(element[0]).append('svg').attr('width', '100%');
        window.onresize = function() {
          return scope.$apply();
        };
        scope.$watch((function() {
          return angular.element(window)[0].innerWidth;
        }), function() {
          return scope.render(scope.data);
        });
        scope.$watch('data', (function(newVals, oldVals) {
          return scope.render(newVals);
        }), true);
        return scope.render = function(data) {
          var height, tooltip, width, xAxis, xMap, xScale, xValue, yAxis, yMap, yScale, yValue;
          svg.selectAll('*').remove();
          width = d3.select(element[0])[0][0].offsetWidth - 20;
          height = 480;
          svg.attr('height', height);
          xScale = d3.scale.linear().range([0, width]);
          xValue = function(d) {
            return d['5.11']['winner'] * 100;
          };
          xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
          xMap = function(d) {
            return xScale(xValue(d));
          };
          xAxis = d3.svg.axis().scale(xScale).orient('bottom');
          svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('x', width).attr('y', -6).style('text-anchor', 'end').text('Pre-AP Item Changes');
          yScale = d3.scale.linear().range([height, 0]);
          yValue = function(d) {
            return d['5.14']['winner'] * 100;
          };
          yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
          yMap = function(d) {
            return yScale(yValue(d));
          };
          yAxis = d3.svg.axis().scale(yScale).orient('left');
          svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text('Post-AP Item Changes');
          tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
          return svg.selectAll('.dot').data(data).enter().append('image').attr('xlink:href', function(d) {
            return 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png';
          }).attr("x", xMap).attr("y", yMap).attr("width", 16).attr("height", 16).on('mouseover', function(d) {
            tooltip.transition().duration(200).style('opacity', .9);
            return tooltip.html(d['name'] + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
          }).on('mouseout', function(d) {
            return tooltip.transition().duration(500).style('opacity', 0);
          });
        };
      }
    };
  }
]);

angular.module('ritoplzmyapitems').factory('championItemService', [
  '$http', function($http) {
    return {
      getDataFor: function(term) {
        return $http.get('data/' + term + '.json');
      }
    };
  }
]);
