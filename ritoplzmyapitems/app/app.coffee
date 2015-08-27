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
  ).when('/carousel',
    templateUrl: 'carousel/carousel.html'
    controller: 'CarouselCtrl'
  ).when('/scatter',
    templateUrl: 'scatter/scatter.html'
    controller: 'ScatterCtrl'
  ).when('/info',
    templateUrl: 'info/info.htm'
    controller: 'InfoCtrl'
  ).otherwise redirectTo: '/'