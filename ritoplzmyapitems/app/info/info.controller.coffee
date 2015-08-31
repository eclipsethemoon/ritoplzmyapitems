angular.module('ritoplzmyapitems').controller 'InfoCtrl', [
  '$scope',
  '$modal',
  'championItemService'
  ($scope, $modal, championItemService) ->
    $scope.items=[]

    $scope.champIds = {}
    championItemService.getDataFor('champions').success (res) ->
      for champ in res
        $scope.champIds[champ.id] = champ.key

    championItemService.getDataFor('champions_recommended_items').success (res) ->
      # We cheated a bit and found the four groups that the k-means generated.
      $scope.items.push {champs: res['1']['champs'], items: res['1']['items']}
      $scope.items.push {champs: res['2']['champs'], items: res['2']['items']}
      $scope.items.push {champs: res['4']['champs'], items: res['4']['items']}
      $scope.items.push {champs: res['8']['champs'], items: res['8']['items']}


    $scope.open = ->
      $modal.open(
        templateUrl: 'info/info.html'
        controller: 'ModalInstanceCtrl'
        size: 'lg'
        resolve:
          items: ->
            $scope.items
          champions: ->
            $scope.champIds
      )
]


angular.module('ritoplzmyapitems').controller 'ModalInstanceCtrl', [
  '$scope',
  '$modalInstance',
  'items',
  'champions'
  ($scope, $modalInstance, items, champions) ->
    $scope.items = items
    $scope.champIds = champions
    $scope.cancel = ->
      $modalInstance.dismiss 'cancel'
]