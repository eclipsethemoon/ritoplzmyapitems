angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'championItemService'
  ($scope, championItemService) ->
    $scope.d3OnClick = (item) ->
      alert item.name

    $scope.apItems = []
    $scope.filterRadio = 'winner'

    # TODO: Fix this - needs to call directive after getting new apItems
    $scope.$watch 'championSelected', ((newVals, oldVals) ->
      if(typeof newVals =='object')
        championItemService.getDataFor(newVals.id).success (res) ->
          if res.error
            throw new Error(res.message)
          else
            $scope.apItems = res
    )

    championItemService.getDataFor('items').success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.apItems = res
]