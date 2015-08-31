angular.module('ritoplzmyapitems').controller 'MainCtrl', [
  '$scope',
  '$http',
  'championItemService'
  ($scope, $http, championItemService) ->

    $scope.championSelected = ''

    championItemService.getDataFor('items').success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.apItems = res

    championItemService.getDataFor('champions').success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.champions = res
]