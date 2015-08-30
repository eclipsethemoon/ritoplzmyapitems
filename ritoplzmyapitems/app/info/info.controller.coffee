angular.module('ritoplzmyapitems').controller 'InfoCtrl', ($scope, $modal, $log) ->
  $scope.items = [
    'item1'
    'item2'
    'item3'
  ]

  $scope.open = ->
    modalInstance = $modal.open(
      templateUrl: 'info/info.html'
      controller: 'ModalInstanceCtrl'
      size: 'lg'
      resolve: items: ->
        $scope.items
    )
    modalInstance.result.then ((selectedItem) ->
      $scope.selected = selectedItem
    ), ->
      $log.info 'Modal dismissed at: ' + new Date


angular.module('ritoplzmyapitems').controller 'ModalInstanceCtrl', ($scope, $modalInstance, items) ->
  $scope.items = items
  $scope.selected = item: $scope.items[0]

  $scope.ok = ->
    $modalInstance.close $scope.selected.item

  $scope.cancel = ->
    $modalInstance.dismiss 'cancel'