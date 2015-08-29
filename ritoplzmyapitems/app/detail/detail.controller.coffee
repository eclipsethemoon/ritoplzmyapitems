angular.module('ritoplzmyapitems').controller 'DetailCtrl', [
  '$scope',
  'championItemService'
  ($scope, championItemService) ->
    $scope.populations = []

    $scope.$watch 'championSelected', ((newVals, oldVals) ->
      if(typeof newVals =='object')
        championItemService.getDataFor(newVals.id).success (res) ->
          item_types = res.item_types['5.14']
          $scope.item_types = []
          total_items = 0
          for k,v of item_types
            total_items += v
          other_value = 0
          for k,v of item_types
            if v > total_items * 0.05
              $scope.item_types.push {type: k, count: v}
            else
              other_value += v
          $scope.item_types.push {type: 'Other', count: other_value}
    ), true

]