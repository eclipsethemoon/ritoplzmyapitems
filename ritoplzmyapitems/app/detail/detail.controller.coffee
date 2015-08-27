angular.module('ritoplzmyapitems').controller 'DetailCtrl', [
  '$scope'
  ($scope) ->
    $scope.populations = []

    $scope.$watch 'championSelected', ((newVals, oldVals) ->
      if(typeof newVals =='object')
        # Replace with scope.championSelected service call
        $scope.populations = [
          age : '<5'
          population : 2704659
        ,
          age : '5-13'
          population : 4499890
        ,
          age : '14-17'
          population : 2159981
        ,
          age : '18-24'
          population : 3853788
        ,
          age : '25-44'
          population : 14106543
        ,
          age : '45-64'
          population : 8819342
        ,
          age : '>64'
          population : 612463
        ]
    ), true

]