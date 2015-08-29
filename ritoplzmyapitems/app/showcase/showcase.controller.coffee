angular.module('ritoplzmyapitems').controller 'ShowcaseCtrl', [
  '$scope',
  'championItemService'
  ($scope, championItemService) ->
    # TODO: Read showcase.json file for all data

    $scope.$watch 'championSelected', ((newVal, oldVal) ->
      if(typeof newVal =='object')
        # Get champion specific data
        championItemService.getDataFor(newVal.id).success (res) ->
          # Setup the pie chart that shows item composition
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

          # Setup the most common items
          $scope.most_common = []
          for item_id in newVal['5.14']['most_common_items']
            $scope.most_common.push
              item: item_id
              pickRate: Math.round(res[item_id]['5.14']['pickRate'] * 10000) / 100.0
              winner: Math.round(res[item_id]['5.14']['winner'] * 10000) / 100.0

          # Setup the most winning items
          $scope.most_winner = []
          for item_id in newVal['5.14']['most_winner_items']
            $scope.most_winner.push
              item: item_id
              pickRate: Math.round(res[item_id]['5.14']['pickRate'] * 10000) / 100.0
              winner: Math.round(res[item_id]['5.14']['winner'] * 10000) / 100.0

          # Setup the recommended items
          recommended_items = []
          champion_json = res
          # SMW: This is callback hell, but only two layers and not enough time to fix.
          championItemService.getDataFor('champions_recommended_items').success (res) ->
            recommended_items = res[newVal.id]['items']
            $scope.recommended = []
            for item_id in recommended_items
              $scope.recommended.push
                item: item_id
                pickRate: Math.round(champion_json[item_id]['5.14']['pickRate'] * 10000) / 100.0
                winner: Math.round(champion_json[item_id]['5.14']['winner'] * 10000) / 100.0
    ), true

]