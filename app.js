angular.module('ritoplzmyapitems', ['ngAnimate', 'ngRoute', 'templates', 'ui.bootstrap']).config(function($routeProvider) {
  return $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  }).when('/card', {
    templateUrl: 'card/card.html',
    controller: 'CardCtrl'
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

angular.module('ritoplzmyapitems').controller('InfoCtrl', function($scope, $modal, $log) {
  $scope.items = ['item1', 'item2', 'item3'];
  $scope.animationsEnabled = true;
  $scope.open = function(size) {
    var modalInstance;
    modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
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
  return $scope.toggleAnimation = function() {
    return $scope.animationsEnabled = !$scope.animationsEnabled;
  };
});

angular.module('ritoplzmyapitems').controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.ok = $modalInstance.close($scope.selected.item);
  return $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('ritoplzmyapitems').controller('DetailCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    $scope.intermediates = ['1026', '1052', '1058', '3057', '3108', '3113', '3136', '3145', '3191'];
    return $scope.$watch('championSelected', (function(newVal, oldVal) {
      if (typeof newVal === 'object') {
        return championItemService.getDataFor(newVal.id).success(function(res) {
          var champion_json, item_id, item_types, k, other_value, recommended_items, total_items, v, _i, _j, _len, _len1, _ref, _ref1;
          item_types = res.item_types['5.14'];
          $scope.item_types = [];
          total_items = 0;
          for (k in item_types) {
            v = item_types[k];
            total_items += v;
          }
          other_value = 0;
          for (k in item_types) {
            v = item_types[k];
            if (v > total_items * 0.05) {
              $scope.item_types.push({
                type: k,
                count: v
              });
            } else {
              other_value += v;
            }
          }
          $scope.item_types.push({
            type: 'Other',
            count: other_value
          });
          $scope.most_common = [];
          _ref = newVal['5.14']['most_common_items'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item_id = _ref[_i];
            if (__indexOf.call($scope.intermediates, item_id) < 0) {
              $scope.most_common.push({
                item: item_id,
                pickRate: Math.round(res[item_id]['5.14']['pickRate'] * 10000) / 100.0,
                pickDiff: Math.round((res[item_id]['5.14']['pickRate'] - res[item_id]['5.11']['pickRate']) * 10000) / 100.0,
                winner: Math.round(res[item_id]['5.14']['winner'] * 10000) / 100.0,
                winDiff: Math.round((res[item_id]['5.14']['winner'] - res[item_id]['5.11']['winner']) * 10000) / 100.0
              });
            }
          }
          $scope.most_winner = [];
          _ref1 = newVal['5.14']['most_winner_items'];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item_id = _ref1[_j];
            if ((__indexOf.call($scope.intermediates, item_id) < 0) && (res[item_id]['5.14']['pickRate'] >= 0.005)) {
              $scope.most_winner.push({
                item: item_id,
                pickRate: Math.round(res[item_id]['5.14']['pickRate'] * 10000) / 100.0,
                pickDiff: Math.round((res[item_id]['5.14']['pickRate'] - res[item_id]['5.11']['pickRate']) * 10000) / 100.0,
                winner: Math.round(res[item_id]['5.14']['winner'] * 10000) / 100.0,
                winDiff: Math.round((res[item_id]['5.14']['winner'] - res[item_id]['5.11']['winner']) * 10000) / 100.0
              });
            }
          }
          recommended_items = [];
          champion_json = res;
          return championItemService.getDataFor('champions_recommended_items').success(function(res) {
            var most_common, most_winner, _k, _len2, _results;
            recommended_items = res[newVal.id]['items'];
            most_common = $scope.most_common.slice(0, 4).map(function(a) {
              return a.item;
            });
            most_winner = $scope.most_winner.slice(0, 4).map(function(a) {
              return a.item;
            });
            $scope.recommended = [];
            _results = [];
            for (_k = 0, _len2 = recommended_items.length; _k < _len2; _k++) {
              item_id = recommended_items[_k];
              if ((__indexOf.call(most_common, item_id) < 0) && (__indexOf.call(most_winner, item_id) < 0)) {
                _results.push($scope.recommended.push({
                  item: item_id,
                  pickRate: Math.round(champion_json[item_id]['5.14']['pickRate'] * 10000) / 100.0,
                  pickDiff: Math.round((champion_json[item_id]['5.14']['pickRate'] - champion_json[item_id]['5.11']['pickRate']) * 10000) / 100.0,
                  winner: Math.round(champion_json[item_id]['5.14']['winner'] * 10000) / 100.0,
                  winDiff: Math.round((champion_json[item_id]['5.14']['winner'] - champion_json[item_id]['5.11']['winner']) * 10000) / 100.0
                }));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        });
      }
    }), true);
  }
]);

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
        var arc, color, height, pie, radius, svg, width;
        width = element.parent()[0].offsetWidth - 20;
        height = width;
        radius = width / 2;
        arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d.count;
        });
        svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        svg.attr('height', height);
        color = d3.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
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
          var g, tooltip;
          svg.selectAll('*').remove();
          tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
          g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
          g.append('path').attr('d', arc).style('fill', function(d) {
            return color(d.data.type);
          });
          return g.append('text').attr('transform', function(d) {
            return 'translate(' + arc.centroid(d) + ')';
          }).attr('dy', '.35em').style('text-anchor', 'middle').text(function(d) {
            return d.data.type;
          });
        };
      }
    };
  }
]);

angular.module('ritoplzmyapitems').controller('MainCtrl', [
  '$scope', '$http', 'championItemService', function($scope, $http, championItemService) {
    $scope.championSelected = '';
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
    $scope.$watch('championSelected', (function(newVals, oldVals) {
      if (typeof newVals === 'object') {
        return championItemService.getDataFor(newVals.id).success(function(res) {
          if (res.error) {
            throw new Error(res.message);
          } else {
            return $scope.apItems = res;
          }
        });
      }
    }));
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

angular.module('ritoplzmyapitems').controller('ShowcaseCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    championItemService.getDataFor('showcase').success(function(res) {
      $scope.showcase = res;
      $scope.nashor = {
        pickRate: Math.round(res['summary']['5.14']['nashor_pickRate'] * 10000) / 100.0,
        pickDiff: Math.round((res['summary']['5.14']['nashor_pickRate'] - res['summary']['5.11']['nashor_pickRate']) * 10000) / 100.0,
        winner: Math.round(res['summary']['5.14']['nashor_winner'] * 10000) / 100.0,
        winDiff: Math.round((res['summary']['5.14']['nashor_winner'] - res['summary']['5.11']['nashor_winner']) * 10000) / 100.0,
        champs: res['summary']['5.14']['nashor_champs'],
        oldChamps: res['summary']['5.11']['nashor_champs']
      };
      $scope.wota = {
        pickRate: Math.round(res['summary']['5.14']['wota_pickRate'] * 10000) / 100.0,
        pickDiff: Math.round((res['summary']['5.14']['wota_pickRate'] - res['summary']['5.11']['wota_pickRate']) * 10000) / 100.0,
        winner: Math.round(res['summary']['5.14']['wota_winner'] * 10000) / 100.0,
        winDiff: Math.round((res['summary']['5.14']['wota_winner'] - res['summary']['5.11']['wota_winner']) * 10000) / 100.0,
        heal: Math.round(res['summary']['5.14']['wota_totalHeal']),
        healDiff: Math.round((res['summary']['5.14']['wota_totalHeal'] - res['summary']['5.11']['wota_totalHeal']) * 10000 / res['summary']['5.11']['wota_totalHeal']) / 100.0,
        champs: res['summary']['5.14']['wota_champs'],
        oldChamps: res['summary']['5.11']['wota_champs']
      };
      $scope.rylaiLiandry = {
        pickRate: Math.round(res['summary']['5.14']['rylaiLiandry_pickRate'] * 10000) / 100.0,
        pickDiff: Math.round((res['summary']['5.14']['rylaiLiandry_pickRate'] - res['summary']['5.11']['rylaiLiandry_pickRate']) * 10000) / 100.0,
        winner: Math.round(res['summary']['5.14']['rylaiLiandry_winner'] * 10000) / 100.0,
        winDiff: Math.round((res['summary']['5.14']['rylaiLiandry_winner'] - res['summary']['5.11']['rylaiLiandry_winner']) * 10000) / 100.0,
        magicDmg: Math.round(res['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions']),
        magicDmgDiff: Math.round((res['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions'] - res['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) * 10000 / res['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) / 100.0,
        crowdControl: Math.round(res['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt']),
        crowdControlDiff: Math.round((res['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'] - res['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) * 10000 / res['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) / 100.0,
        champs: res['summary']['5.14']['rylaiLiandry_champs'],
        oldChamps: res['summary']['5.11']['rylaiLiandry_champs']
      };
      $scope.nlr = {
        pickRate: Math.round(res['summary']['5.14']['nlr_pickRate'] * 10000) / 100.0,
        pickDiff: Math.round((res['summary']['5.14']['nlr_pickRate'] - res['summary']['5.11']['nlr_pickRate']) * 10000) / 100.0,
        winner: Math.round(res['summary']['5.14']['nlr_winner'] * 10000) / 100.0,
        winDiff: Math.round((res['summary']['5.14']['nlr_winner'] - res['summary']['5.11']['nlr_winner']) * 10000) / 100.0,
        timestamp: Math.round(res['summary']['5.14']['nlr_timestamp']),
        timestampDiff: Math.round((res['summary']['5.14']['nlr_timestamp'] - res['summary']['5.11']['nlr_timestamp']) * 10000 / res['summary']['5.11']['nlr_timestamp']) / 100.0,
        champs: res['summary']['5.14']['nlr_champs'],
        oldChamps: res['summary']['5.11']['nlr_champs']
      };
      return $scope.fiendish = {
        pickRate: Math.round(res['summary']['5.14']['fiendish_pickRate'] * 10000) / 100.0,
        pickDiff: Math.round((res['summary']['5.14']['fiendish_pickRate'] - res['summary']['5.11']['fiendish_pickRate']) * 10000) / 100.0,
        winner: Math.round(res['summary']['5.14']['fiendish_winner'] * 10000) / 100.0,
        winDiff: Math.round((res['summary']['5.14']['fiendish_winner'] - res['summary']['5.11']['fiendish_winner']) * 10000) / 100.0,
        timestamp: Math.round(res['summary']['5.14']['fiendish_timestamp']),
        timestampDiff: Math.round((res['summary']['5.14']['fiendish_timestamp'] - res['summary']['5.11']['fiendish_timestamp']) * 10000 / res['summary']['5.11']['fiendish_timestamp']) / 100.0,
        champs: res['summary']['5.14']['fiendish_champs'],
        oldChamps: res['summary']['5.11']['fiendish_champs']
      };
    });
    return $scope.$watch('championSelected', (function(newVal, oldVal) {
      if (typeof newVal === 'object') {
        $scope.nashor = {
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['nashor_pickRate'] * 10000) / 100.0,
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nashor_pickRate'] - $scope.showcase[newVal.id]['5.11']['nashor_pickRate']) * 10000) / 100.0,
          winner: Math.round($scope.showcase[newVal.id]['5.14']['nashor_winner'] * 10000) / 100.0,
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nashor_winner'] - $scope.showcase[newVal.id]['5.11']['nashor_winner']) * 10000) / 100.0
        };
        $scope.wota = {
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['wota_pickRate'] * 10000) / 100.0,
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_pickRate'] - $scope.showcase[newVal.id]['5.11']['wota_pickRate']) * 10000) / 100.0,
          winner: Math.round($scope.showcase[newVal.id]['5.14']['wota_winner'] * 10000) / 100.0,
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_winner'] - $scope.showcase[newVal.id]['5.11']['wota_winner']) * 10000) / 100.0,
          heal: Math.round($scope.showcase[newVal.id]['5.14']['wota_totalHeal']),
          healDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_totalHeal'] - $scope.showcase[newVal.id]['5.11']['wota_totalHeal']) * 10000 / $scope.showcase[newVal.id]['5.11']['wota_totalHeal']) / 100.0
        };
        $scope.rylaiLiandry = {
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_pickRate'] * 10000) / 100.0,
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_pickRate'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_pickRate']) * 10000) / 100.0,
          winner: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_winner'] * 10000) / 100.0,
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_winner'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_winner']) * 10000) / 100.0,
          magicDmg: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_magicDamageDealtToChampions']),
          magicDmgDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_magicDamageDealtToChampions'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_magicDamageDealtToChampions']) * 10000 / $scope.showcase[newVal.id]['5.11']['rylaiLiandry_magicDamageDealtToChampions']) / 100.0,
          crowdControl: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_totalTimeCrowdControlDealt']),
          crowdControlDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) * 10000 / $scope.showcase[newVal.id]['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) / 100.0
        };
        $scope.nlr = {
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['nlr_pickRate'] * 10000) / 100.0,
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_pickRate'] - $scope.showcase[newVal.id]['5.11']['nlr_pickRate']) * 10000) / 100.0,
          winner: Math.round($scope.showcase[newVal.id]['5.14']['nlr_winner'] * 10000) / 100.0,
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_winner'] - $scope.showcase[newVal.id]['5.11']['nlr_winner']) * 10000) / 100.0,
          timestamp: Math.round($scope.showcase[newVal.id]['5.14']['nlr_timestamp']),
          timestampDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_timestamp'] - $scope.showcase[newVal.id]['5.11']['nlr_timestamp']) * 10000 / $scope.showcase[newVal.id]['5.11']['nlr_timestamp']) / 100.0
        };
        return $scope.fiendish = {
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_pickRate'] * 10000) / 100.0,
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_pickRate'] - $scope.showcase[newVal.id]['5.11']['fiendish_pickRate']) * 10000) / 100.0,
          winner: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_winner'] * 10000) / 100.0,
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_winner'] - $scope.showcase[newVal.id]['5.11']['fiendish_winner']) * 10000) / 100.0,
          timestamp: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_timestamp']),
          timestampDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_timestamp'] - $scope.showcase[newVal.id]['5.11']['fiendish_timestamp']) * 10000 / $scope.showcase[newVal.id]['5.11']['fiendish_timestamp']) / 100.0
        };
      }
    }), true);
  }
]);
