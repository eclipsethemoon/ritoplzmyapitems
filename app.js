angular.module('ritoplzmyapitems', ['ngAnimate', 'ngRoute', 'pageslide-directive', 'templates', 'ui.bootstrap']).config(function($routeProvider) {
  return $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  }).otherwise({
    redirectTo: '/'
  });
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('ritoplzmyapitems').controller('DetailCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    $scope.checked = false;
    $scope.intermediates = ['1026', '1052', '1058', '3057', '3108', '3113', '3136', '3145', '3191'];
    $scope.championTags = {
      'Assassin': '657',
      'Fighter': '658',
      'Mage': '659',
      'Marksman': '660',
      'Support': '661',
      'Tank': '662'
    };
    return $scope.$watch('championSelected', (function(newVal, oldVal) {
      $scope.checked = false;
      if (typeof newVal === 'object') {
        return championItemService.getDataFor(newVal.id).success(function(res) {
          var champion_json, item_id, item_types, k, other_value, recommended_items, v, _i, _j, _len, _len1, _ref, _ref1;
          $scope.checked = true;
          item_types = res.item_types['5.14'];
          $scope.item_types = [];
          $scope.total_item_types = 0;
          for (k in item_types) {
            v = item_types[k];
            $scope.total_item_types += v;
          }
          other_value = 0;
          for (k in item_types) {
            v = item_types[k];
            if (v > $scope.total_item_types * 0.05) {
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
                name: res[item_id]['name'],
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
                name: res[item_id]['name'],
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
                  name: champion_json[item_id]['name'],
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
        width = 350;
        height = width;
        radius = width / 2;
        arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 50);
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d.count;
        });
        svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        svg.attr('height', height);
        color = d3.scale.ordinal().range(d3.scale.category10().range());
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
          if (data) {
            svg.selectAll('*').remove();
            tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
            g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
            g.append('path').attr('d', arc).style('fill', function(d) {
              return color(d.data.type);
            });
            svg.append("text").datum(data).attr("x", 0).attr("y", 0 - radius / 15).attr("class", "text-type-tooltip").style("text-anchor", "middle").attr("font-weight", "bold").style("font-size", "24px");
            svg.append("text").datum(data).attr("x", 0).attr("y", 0 + radius / 15).attr("class", "text-percent-tooltip").style("text-anchor", "middle").attr("font-weight", "bold").style("font-size", "24px");
            g.on('mouseover', function(d) {
              var circle_text;
              circle_text = Math.round(Math.abs(d.startAngle - d.endAngle) * 100 / (2 * Math.PI));
              svg.select('text.text-type-tooltip').attr('fill', color(d.data.type)).text(d.data.type);
              return svg.select('text.text-percent-tooltip').attr('fill', color(d.data.type)).text(circle_text + '%');
            });
            return g.on('mouseout', function(d) {
              svg.select('text.text-type-tooltip').text('');
              return svg.select('text.text-percent-tooltip').text('');
            });
          }
        };
      }
    };
  }
]);

angular.module('ritoplzmyapitems').controller('InfoCtrl', function($scope, $modal, $log) {
  $scope.items = ['item1', 'item2', 'item3'];
  return $scope.open = function() {
    var modalInstance;
    modalInstance = $modal.open({
      templateUrl: 'info/info.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
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
});

angular.module('ritoplzmyapitems').controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {
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

angular.module('ritoplzmyapitems').factory('championItemService', [
  '$http', function($http) {
    return {
      getDataFor: function(term) {
        return $http.get('data/' + term + '.json');
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

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('ritoplzmyapitems').controller('ScatterCtrl', [
  '$scope', 'championItemService', function($scope, championItemService) {
    $scope.apItems = [];
    $scope.allAPItems = ['3001', '3003', '3023', '3025', '3027', '3041', '3060', '3078', '3089', '3100', '3115', '3116', '3124', '3135', '3146', '3151', '3152', '3157', '3165', '3174', '3285', '3504'];
    $scope.filterRadio = 'winner';
    $scope.champFocus = 'items';
    championItemService.getDataFor($scope.champFocus).success(function(res) {
      var apItems, item, _i, _len, _ref;
      if (res.error) {
        throw new Error(res.message);
      } else {
        apItems = [];
        for (_i = 0, _len = res.length; _i < _len; _i++) {
          item = res[_i];
          if (_ref = item.id, __indexOf.call($scope.allAPItems, _ref) >= 0) {
            apItems.push(item);
          }
        }
        return $scope.apItems = apItems;
      }
    });
    return $scope.$watch('championSelected', (function(newVals, oldVals) {
      if (typeof newVals === 'object') {
        $scope.champFocus = newVals.id;
        return championItemService.getDataFor(newVals.id).success(function(res) {
          var apItems, k, v;
          if (res.error) {
            throw new Error(res.message);
          } else {
            apItems = [];
            for (k in res) {
              v = res[k];
              if (__indexOf.call($scope.allAPItems, k) >= 0) {
                apItems.push(v);
              }
            }
            return $scope.apItems = apItems;
          }
        });
      } else {
        $scope.champFocus = 'items';
        return championItemService.getDataFor('items').success(function(res) {
          var apItems, item, _i, _len, _ref;
          if (res.error) {
            throw new Error(res.message);
          } else {
            apItems = [];
            for (_i = 0, _len = res.length; _i < _len; _i++) {
              item = res[_i];
              if (_ref = item.id, __indexOf.call($scope.allAPItems, _ref) >= 0) {
                apItems.push(item);
              }
            }
            return $scope.apItems = apItems;
          }
        });
      }
    }));
  }
]);

angular.module('ritoplzmyapitems').directive('d3Scatter', [
  function() {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        filter: '=',
        pushed: '='
      },
      link: function(scope, element) {
        var height, margin, svg, width, x, xAxis, y, yAxis;
        margin = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 50
        };
        width = element[0].parentElement.clientWidth - margin.left - margin.right;
        height = 400 - margin.top - margin.bottom;
        x = d3.scale.ordinal().rangeRoundBands([0, width - 30], .3);
        y = d3.scale.linear().range([height, 0]);
        xAxis = d3.svg.axis().scale(x);
        yAxis = d3.svg.axis().scale(y).orient('left');
        svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
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
        return scope.render = function(data, feature) {
          var iconWidth, tip, tipOffset;
          if (data.length) {
            tipOffset = scope.pushed === 'items' ? 0 : -350;
            tip = d3.tip().attr('class', 'd3-tip').offset([-10, tipOffset]).html(function(d) {
              return '<strong>' + d['name'] + '</strong>';
            });
            svg.call(tip);
            svg.selectAll('*').remove();
            x.domain(data.map(function(d) {
              return d['id'];
            }));
            y.domain(d3.extent(data, function(d) {
              return d['5.14'][feature] - d['5.11'][feature];
            }));
            svg.selectAll('.bar').data(data).enter().append('rect').attr('class', function(d) {
              if ((d['5.14'][feature] - d['5.11'][feature]) < 0) {
                return 'bar negative';
              } else {
                return 'bar positive';
              }
            }).attr('x', function(d) {
              return x(d['id']);
            }).attr('y', function(d) {
              return y(Math.max(0, d['5.14'][feature] - d['5.11'][feature]));
            }).attr('height', function(d) {
              return Math.abs(y(d['5.14'][feature] - d['5.11'][feature]) - y(0));
            }).attr('width', x.rangeBand()).on('mouseover', tip.show).on('mouseout', tip.hide);
            svg.append('g').attr('class', 'yAxis').call(yAxis);
            svg.select('.yAxis').selectAll('text').text(function(d) {
              if (feature === 'timestamp') {
                return (d / 1000).toFixed(2);
              } else {
                return Math.round(d * 100);
              }
            });
            iconWidth = x.rangeBand();
            svg.append('g').attr('class', 'xAxis').attr("transform", "translate(0," + Math.max(iconWidth / 2, Math.min(y(0), height - (iconWidth / 2))) + ")").call(xAxis);
            svg.select('.xAxis').selectAll('text').remove();
            return svg.select('.xAxis').selectAll('.tick').data(data).append('svg:image').attr('xlink:href', function(d) {
              return 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png';
            }).attr('width', iconWidth).attr('height', iconWidth).attr('x', -iconWidth / 2).attr('y', -iconWidth / 2).on('mouseover', tip.show).on('mouseout', tip.hide);
          }
        };
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
