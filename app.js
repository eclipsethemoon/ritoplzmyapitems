angular.module('ritoplzmyapitems', ['ngAnimate', 'ngRoute', 'templates', 'ui.bootstrap']).config(function($routeProvider) {
  return $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  }).when('/carousel', {
    templateUrl: 'carousel/carousel.html',
    controller: 'CarouselCtrl'
  }).when('/detail', {
    templateUrl: 'detail/detail.html',
    controller: 'DetailCtrl'
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

angular.module('ritoplzmyapitems').controller('CarouselCtrl', [
  '$scope', function($scope) {
    var i, slides, _results;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    slides = $scope.slides = [];
    $scope.addSlide = function() {
      var newWidth;
      newWidth = 600 + slides.length + 1;
      return slides.push({
        image: '//placekitten.com/' + newWidth + '/300',
        text: ['More', 'Extra', 'Lots of', 'Surplus', 'Phat'][slides.length % 5] + ' ' + ['Cats', 'Kittys', 'Felines', 'Cutes', 'Schwifty'][slides.length % 5]
      });
    };
    i = 0;
    _results = [];
    while (i < 5) {
      $scope.addSlide();
      _results.push(i++);
    }
    return _results;
  }
]);

angular.module('ritoplzmyapitems').controller('DetailCtrl', ['$scope', function($scope) {}]);

angular.module('ritoplzmyapitems').directive('d3Donut', [
  function() {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        filter: '=',
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
          return scope.render(scope.data, scope.filter);
        });
        scope.$watch('data', (function(newVals, oldVals) {
          return scope.render(newVals, scope.filter);
        }), true);
        scope.$watch('filter', (function(newVals, oldVals) {
          return scope.render(scope.data, newVals);
        }), true);
        return scope.render = function(data, filter) {
          var height, tooltip, width, xAxis, xMap, xScale, xValue, yAxis, yMap, yScale, yValue;
          svg.selectAll('*').remove();
          width = d3.select(element[0])[0][0].offsetWidth - 20;
          height = 300;
          svg.attr('height', height);
          xScale = d3.scale.linear().range([0, width]);
          xValue = function(d) {
            return d['5.11'][filter] * 100;
          };
          xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
          xMap = function(d) {
            return xScale(xValue(d));
          };
          xAxis = d3.svg.axis().scale(xScale).orient('bottom');
          svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('x', width).attr('y', -6).style('text-anchor', 'end').text('Pre-AP Item Changes');
          yScale = d3.scale.linear().range([height, 0]);
          yValue = function(d) {
            return d['5.14'][filter] * 100;
          };
          yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
          yMap = function(d) {
            return yScale(yValue(d));
          };
          yAxis = d3.svg.axis().scale(yScale).orient('left');
          svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text('Post-AP Item Changes');
          svg.append('line').attr('x1', 0).attr('x2', 100).attr('y1', 0).attr('y2', 100).attr('color', 'black');
          tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
          return svg.selectAll('.dot').data(data).enter().append('image').attr('xlink:href', function(d) {
            return 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png';
          }).attr("x", xMap).attr("y", yMap).attr("width", 16).attr("height", 16).on('mouseover', function(d) {
            tooltip.transition().duration(200).style('opacity', .9);
            if (filter === 'timestamp') {
              return tooltip.html(d['name'] + '<br/> (' + xValue(d) / 60000 + ', ' + yValue(d) / 60000 + ')').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
            } else {
              return tooltip.html(d['name'] + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
            }
          }).on('mouseout', function(d) {
            return tooltip.transition().duration(500).style('opacity', 0);
          });
        };
      }
    };
  }
]);

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
  '$scope', '$http', 'championItemService', function($scope, $http, championItemService) {
    championItemService.getDataFor('items').success(function(res) {
      if (res.error) {
        throw new Error(res.message);
      } else {
        return $scope.apItems = res;
      }
    });
    return championItemService.getDataFor('champions').success(function(res) {
      if (res.error) {
        throw new Error(res.message);
      } else {
        return $scope.champions = res;
      }
    });
  }
]);

angular.module('ritoplzmyapitems').controller('ScatterCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    $scope.d3OnClick = function(item) {
      return alert(item.name);
    };
    $scope.apItems = [];
    $scope.filterRadio = 'winner';
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
        filter: '=',
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
          return scope.render(scope.data, scope.filter);
        });
        scope.$watch('data', (function(newVals, oldVals) {
          return scope.render(newVals, scope.filter);
        }), true);
        scope.$watch('filter', (function(newVals, oldVals) {
          return scope.render(scope.data, newVals);
        }), true);
        return scope.render = function(data, filter) {
          var height, tooltip, width, xAxis, xMap, xScale, xValue, yAxis, yMap, yScale, yValue;
          svg.selectAll('*').remove();
          width = d3.select(element[0])[0][0].offsetWidth - 20;
          height = 300;
          svg.attr('height', height);
          xScale = d3.scale.linear().range([0, width]);
          xValue = function(d) {
            return d['5.11'][filter] * 100;
          };
          xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
          xMap = function(d) {
            return xScale(xValue(d));
          };
          xAxis = d3.svg.axis().scale(xScale).orient('bottom');
          svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('x', width).attr('y', -6).style('text-anchor', 'end').text('Pre-AP Item Changes');
          yScale = d3.scale.linear().range([height, 0]);
          yValue = function(d) {
            return d['5.14'][filter] * 100;
          };
          yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
          yMap = function(d) {
            return yScale(yValue(d));
          };
          yAxis = d3.svg.axis().scale(yScale).orient('left');
          svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text('Post-AP Item Changes');
          svg.append('line').attr('x1', 0).attr('x2', 100).attr('y1', 0).attr('y2', 100).attr('color', 'black');
          tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
          return svg.selectAll('.dot').data(data).enter().append('image').attr('xlink:href', function(d) {
            return 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png';
          }).attr("x", xMap).attr("y", yMap).attr("width", 16).attr("height", 16).on('mouseover', function(d) {
            tooltip.transition().duration(200).style('opacity', .9);
            if (filter === 'timestamp') {
              return tooltip.html(d['name'] + '<br/> (' + xValue(d) / 60000 + ', ' + yValue(d) / 60000 + ')').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
            } else {
              return tooltip.html(d['name'] + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
            }
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
