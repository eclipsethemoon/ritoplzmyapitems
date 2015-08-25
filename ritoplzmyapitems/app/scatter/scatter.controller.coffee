angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'itemService'
  ($scope, itemService) ->
#    Code is based on http://www.delimited.io/blog/2014/7/16/d3-directives-in-angularjs
    $scope.tagsize = 'reach'
    $scope.toptags = []
    $scope.currtag = ''
    $scope.artists = []
    itemService.itemChartData('3025', '').then (res) ->
      console.log res
    itemService.topTags().success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.toptags = res.tags.tag.map((t) ->
          t.reach = +t.reach
          t.taggings = +t.taggings
          t
        )
]