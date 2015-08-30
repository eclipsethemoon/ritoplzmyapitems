angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'championItemService'
  ($scope, championItemService) ->
    $scope.apItems = []
    $scope.allAPItems = ['3001', '3003', '3023', '3025', '3027', '3041', '3060', '3078', '3089', '3100', '3115', '3116',
                         '3124', '3135', '3146', '3151', '3152', '3157', '3165', '3174', '3285', '3504']
    $scope.filterRadio = 'winner'
    $scope.champFocus = 'items'

    championItemService.getDataFor($scope.champFocus).success (res) ->
      if res.error
        throw new Error(res.message)
      else
        apItems = []
        for item in res
          if item.id in $scope.allAPItems
            apItems.push item
        $scope.apItems = apItems

    # TODO: Since the championItemService call is the same, replace with function
    $scope.$watch 'championSelected', ((newVals, oldVals) ->
      if(typeof newVals =='object')
        $scope.champFocus = newVals.id
        championItemService.getDataFor(newVals.id).success (res) ->
          if res.error
            throw new Error(res.message)
          else
            apItems = []
            for k, v of res
              if k in $scope.allAPItems
                apItems.push v
            $scope.apItems = apItems
      else
        $scope.champFocus = 'items'
        championItemService.getDataFor('items').success (res) ->
          if res.error
            throw new Error(res.message)
          else
            apItems = []
            for item in res
              if item.id in $scope.allAPItems
                apItems.push item
            $scope.apItems = apItems
    )
]