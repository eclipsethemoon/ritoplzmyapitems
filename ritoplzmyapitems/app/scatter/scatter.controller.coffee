angular.module('ritoplzmyapitems').controller 'ScatterCtrl', [
  '$scope'
  'championItemService'
  ($scope, championItemService) ->
#    Code is based on http://www.delimited.io/blog/2014/7/16/d3-directives-in-angularjs
    $scope.tagsize = 'reach'
    $scope.toptags = []
    $scope.currtag = ''
    $scope.artists = []
    championItemService.getDataFor('items').success (res) ->
      console.log res
    championItemService.topTags().success (res) ->
      if res.error
        throw new Error(res.message)
      else
        $scope.toptags = res.tags.tag.map((t) ->
          t.reach = +t.reach
          t.taggings = +t.taggings
          t
        )
]