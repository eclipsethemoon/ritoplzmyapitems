angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'championItemService'
  ($scope, championItemService) ->
    $scope.d3OnClick = (item) ->
      alert item.name

    $scope.apItems = []
    $scope.allAPItems = ['1026', '1052', '1058', '3001', '3003', '3023', '3025', '3027', '3041', '3057', '3060', '3078',
                         '3089', '3100', '3108', '3113', '3115', '3116', '3124', '3135', '3136', '3145', '3146', '3151',
                         '3152', '3157', '3165', '3174', '3191', '3285', '3504']
    $scope.filterRadio = 'winner'

    championItemService.getDataFor('items').success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.apItems = res

    # TODO: Fix this - needs to call directive after getting new apItems
    $scope.$watch 'championSelected', ((newVals, oldVals) ->
      if(typeof newVals =='object')
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
        championItemService.getDataFor('items').success (res) ->
          if res.error
            throw new Error(res.message)
          else
            $scope.apItems = res
    )
]