angular.module('ritoplzmyapitems').controller 'InfoCtrl', ($scope, $modal, $log) ->
  $scope.items = [
    'item1'
    'item2'
    'item3'
  ]
  $scope.animationsEnabled = true

  $scope.open = (size) ->
    modalInstance = $modal.open(
      animation: $scope.animationsEnabled
      templateUrl: 'myModalContent.html'
      controller: 'ModalInstanceCtrl'
      size: size
      resolve: items: ->
        $scope.items
    )
    modalInstance.result.then ((selectedItem) ->
      $scope.selected = selectedItem
    ), ->
      $log.info 'Modal dismissed at: ' + new Date

  $scope.toggleAnimation = ->
    $scope.animationsEnabled = !$scope.animationsEnabled

# Please note that $modalInstance represents a modal window (instance) dependency.
# It is not the same as the $modal service used above.
angular.module('ritoplzmyapitems').controller 'ModalInstanceCtrl', ($scope, $modalInstance, items) ->
  $scope.items = items
  $scope.selected = item: $scope.items[0]

  $scope.ok = $modalInstance.close $scope.selected.item

  $scope.cancel = -> $modalInstance.dismiss 'cancel'