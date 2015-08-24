angular.module 'ritoplzmyapitems', [
  'ngAnimate',
  'ngRoute',
  'templates',
  'ui.bootstrap'
]
.config ($routeProvider) ->
  $routeProvider.when('/',
    templateUrl: 'main/main.html'
    controller: 'MainCtrl'
  ).when('/champions',
    templateUrl: 'champions/champion-list.htm'
    controller: 'ChampionListCtrl'
  ).when('/champion/:champion',
    templateUrl: 'champions/champion-detail.htm'
    controller: 'ChampionDetailCtrl'
  ).when('/info',
    templateUrl: 'info/info.htm'
    controller: 'InfoCtrl'
  ).otherwise redirectTo: '/'