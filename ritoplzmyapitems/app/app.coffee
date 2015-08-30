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
  ).otherwise redirectTo: '/'