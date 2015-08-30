angular.module 'ritoplzmyapitems', [
  'ngAnimate',
  'ngRoute',
  'pageslide-directive',
  'templates',
  'ui.bootstrap'
]
.config ($routeProvider) ->
  $routeProvider.when('/',
    templateUrl: 'main/main.html'
    controller: 'MainCtrl'
  ).when('/card',
    templateUrl: 'card/card.html'
    controller: 'CardCtrl'
  ).when('/detail',
    templateUrl: 'detail/detail.html'
    controller: 'DetailCtrl'
  ).when('/scatter',
    templateUrl: 'scatter/scatter.html'
    controller: 'ScatterCtrl'
  ).when('/info',
    templateUrl: 'info/info.htm'
    controller: 'InfoCtrl'
  ).otherwise redirectTo: '/'