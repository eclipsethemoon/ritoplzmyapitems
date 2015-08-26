angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'championItemService'
  ($scope, championItemService) ->
    $scope.d3OnClick = (item) ->
      alert item.name

    $scope.apItems = []
    $scope.filterRadio = 'winner'

    championItemService.getDataFor('items').success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.apItems = res
]