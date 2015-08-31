angular.module('ritoplzmyapitems').controller 'MainCtrl', [
  '$scope',
  '$http',
  'championItemService'
  ($scope, $http, championItemService) ->

    $scope.championSelected = ''

    $scope.championNames = []
    championItemService.getDataFor('champions').success (res) ->
      for champ in res
        $scope.championNames.push {key: champ.key, name: champ.name}

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