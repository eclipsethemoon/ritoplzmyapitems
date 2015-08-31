angular.module('ritoplzmyapitems').controller 'ShowcaseCtrl', [
  '$scope',
  'championItemService'
  ($scope, championItemService) ->
    championItemService.getDataFor('showcase').success (res) ->
      # SMW: Function to do this is probably better
      $scope.showcase = res
      $scope.nashor =
        pickRate: Math.round(res['summary']['5.14']['nashor_pickRate'] * 10000) / 100.0
        pickDiff: Math.round((res['summary']['5.14']['nashor_pickRate'] - res['summary']['5.11']['nashor_pickRate']) * 10000) / 100.0
        winner: Math.round(res['summary']['5.14']['nashor_winner'] * 10000) / 100.0
        winDiff: Math.round((res['summary']['5.14']['nashor_winner'] - res['summary']['5.11']['nashor_winner']) * 10000) / 100.0
        champs: res['summary']['5.14']['nashor_champs']
        oldChamps: res['summary']['5.11']['nashor_champs']
      $scope.wota =
        pickRate: Math.round(res['summary']['5.14']['wota_pickRate'] * 10000) / 100.0
        pickDiff: Math.round((res['summary']['5.14']['wota_pickRate'] - res['summary']['5.11']['wota_pickRate']) * 10000) / 100.0
        winner: Math.round(res['summary']['5.14']['wota_winner'] * 10000) / 100.0
        winDiff: Math.round((res['summary']['5.14']['wota_winner'] - res['summary']['5.11']['wota_winner']) * 10000) / 100.0
        heal: Math.round(res['summary']['5.14']['wota_totalHeal'])
        healDiff: Math.round((res['summary']['5.14']['wota_totalHeal'] - res['summary']['5.11']['wota_totalHeal']) * 10000 / res['summary']['5.11']['wota_totalHeal']) / 100.0
        champs: res['summary']['5.14']['wota_champs']
        oldChamps: res['summary']['5.11']['wota_champs']
      $scope.rylaiLiandry =
        pickRate: Math.round(res['summary']['5.14']['rylaiLiandry_pickRate'] * 10000) / 100.0
        pickDiff: Math.round((res['summary']['5.14']['rylaiLiandry_pickRate'] - res['summary']['5.11']['rylaiLiandry_pickRate']) * 10000) / 100.0
        winner: Math.round(res['summary']['5.14']['rylaiLiandry_winner'] * 10000) / 100.0
        winDiff: Math.round((res['summary']['5.14']['rylaiLiandry_winner'] - res['summary']['5.11']['rylaiLiandry_winner']) * 10000) / 100.0
        magicDmg: Math.round(res['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions'])
        magicDmgDiff: Math.round((res['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions'] - res['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) * 10000 / res['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) / 100.0
        crowdControl: Math.round(res['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'])
        crowdControlDiff: Math.round((res['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'] - res['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) * 10000 / res['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) / 100.0
        champs: res['summary']['5.14']['rylaiLiandry_champs']
        oldChamps: res['summary']['5.11']['rylaiLiandry_champs']
      $scope.nlr =
        pickRate: Math.round(res['summary']['5.14']['nlr_pickRate'] * 10000) / 100.0
        pickDiff: Math.round((res['summary']['5.14']['nlr_pickRate'] - res['summary']['5.11']['nlr_pickRate']) * 10000) / 100.0
        winner: Math.round(res['summary']['5.14']['nlr_winner'] * 10000) / 100.0
        winDiff: Math.round((res['summary']['5.14']['nlr_winner'] - res['summary']['5.11']['nlr_winner']) * 10000) / 100.0
        timestamp: Math.round(res['summary']['5.14']['nlr_timestamp'])
        timestampDiff: Math.round((res['summary']['5.14']['nlr_timestamp'] - res['summary']['5.11']['nlr_timestamp']) * 10000 / res['summary']['5.11']['nlr_timestamp']) / 100.0
        champs: res['summary']['5.14']['nlr_champs']
        oldChamps: res['summary']['5.11']['nlr_champs']
      $scope.fiendish =
        pickRate: Math.round(res['summary']['5.14']['fiendish_pickRate'] * 10000) / 100.0
        pickDiff: Math.round((res['summary']['5.14']['fiendish_pickRate'] - res['summary']['5.11']['fiendish_pickRate']) * 10000) / 100.0
        winner: Math.round(res['summary']['5.14']['fiendish_winner'] * 10000) / 100.0
        winDiff: Math.round((res['summary']['5.14']['fiendish_winner'] - res['summary']['5.11']['fiendish_winner']) * 10000) / 100.0
        timestamp: Math.round(res['summary']['5.14']['fiendish_timestamp'])
        timestampDiff: Math.round((res['summary']['5.14']['fiendish_timestamp'] - res['summary']['5.11']['fiendish_timestamp']) * 10000 / res['summary']['5.11']['fiendish_timestamp']) / 100.0
        champs: res['summary']['5.14']['fiendish_champs']
        oldChamps: res['summary']['5.11']['fiendish_champs']

    $scope.$watch 'championSelected', ((newVal, oldVal) ->
      if(typeof newVal =='object')
        $scope.nashor =
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['nashor_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nashor_pickRate'] - $scope.showcase[newVal.id]['5.11']['nashor_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase[newVal.id]['5.14']['nashor_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nashor_winner'] - $scope.showcase[newVal.id]['5.11']['nashor_winner']) * 10000) / 100.0
        $scope.wota =
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['wota_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_pickRate'] - $scope.showcase[newVal.id]['5.11']['wota_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase[newVal.id]['5.14']['wota_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_winner'] - $scope.showcase[newVal.id]['5.11']['wota_winner']) * 10000) / 100.0
          heal: Math.round($scope.showcase[newVal.id]['5.14']['wota_totalHeal'])
          healDiff: Math.round(($scope.showcase[newVal.id]['5.14']['wota_totalHeal'] - $scope.showcase[newVal.id]['5.11']['wota_totalHeal']) * 10000 / $scope.showcase[newVal.id]['5.11']['wota_totalHeal']) / 100.0
        $scope.rylaiLiandry =
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_pickRate'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_winner'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_winner']) * 10000) / 100.0
          magicDmg: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_magicDamageDealtToChampions'])
          magicDmgDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_magicDamageDealtToChampions'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_magicDamageDealtToChampions']) * 10000 / $scope.showcase[newVal.id]['5.11']['rylaiLiandry_magicDamageDealtToChampions']) / 100.0
          crowdControl: Math.round($scope.showcase[newVal.id]['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'])
          crowdControlDiff: Math.round(($scope.showcase[newVal.id]['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'] - $scope.showcase[newVal.id]['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) * 10000 / $scope.showcase[newVal.id]['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) / 100.0
        $scope.nlr =
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['nlr_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_pickRate'] - $scope.showcase[newVal.id]['5.11']['nlr_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase[newVal.id]['5.14']['nlr_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_winner'] - $scope.showcase[newVal.id]['5.11']['nlr_winner']) * 10000) / 100.0
          timestamp: Math.round($scope.showcase[newVal.id]['5.14']['nlr_timestamp'])
          timestampDiff: Math.round(($scope.showcase[newVal.id]['5.14']['nlr_timestamp'] - $scope.showcase[newVal.id]['5.11']['nlr_timestamp']) * 10000 / $scope.showcase[newVal.id]['5.11']['nlr_timestamp']) / 100.0
        $scope.fiendish =
          pickRate: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_pickRate'] - $scope.showcase[newVal.id]['5.11']['fiendish_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_winner'] - $scope.showcase[newVal.id]['5.11']['fiendish_winner']) * 10000) / 100.0
          timestamp: Math.round($scope.showcase[newVal.id]['5.14']['fiendish_timestamp'])
          timestampDiff: Math.round(($scope.showcase[newVal.id]['5.14']['fiendish_timestamp'] - $scope.showcase[newVal.id]['5.11']['fiendish_timestamp']) * 10000 / $scope.showcase[newVal.id]['5.11']['fiendish_timestamp']) / 100.0
      else
        $scope.nashor =
          pickRate: Math.round($scope.showcase['summary']['5.14']['nashor_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase['summary']['5.14']['nashor_pickRate'] - $scope.showcase['summary']['5.11']['nashor_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase['summary']['5.14']['nashor_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase['summary']['5.14']['nashor_winner'] - $scope.showcase['summary']['5.11']['nashor_winner']) * 10000) / 100.0
          champs: $scope.showcase['summary']['5.14']['nashor_champs']
          oldChamps: $scope.showcase['summary']['5.11']['nashor_champs']
        $scope.wota =
          pickRate: Math.round($scope.showcase['summary']['5.14']['wota_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase['summary']['5.14']['wota_pickRate'] - $scope.showcase['summary']['5.11']['wota_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase['summary']['5.14']['wota_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase['summary']['5.14']['wota_winner'] - $scope.showcase['summary']['5.11']['wota_winner']) * 10000) / 100.0
          heal: Math.round($scope.showcase['summary']['5.14']['wota_totalHeal'])
          healDiff: Math.round(($scope.showcase['summary']['5.14']['wota_totalHeal'] - $scope.showcase['summary']['5.11']['wota_totalHeal']) * 10000 / $scope.showcase['summary']['5.11']['wota_totalHeal']) / 100.0
          champs: $scope.showcase['summary']['5.14']['wota_champs']
          oldChamps: $scope.showcase['summary']['5.11']['wota_champs']
        $scope.rylaiLiandry =
          pickRate: Math.round($scope.showcase['summary']['5.14']['rylaiLiandry_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase['summary']['5.14']['rylaiLiandry_pickRate'] - $scope.showcase['summary']['5.11']['rylaiLiandry_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase['summary']['5.14']['rylaiLiandry_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase['summary']['5.14']['rylaiLiandry_winner'] - $scope.showcase['summary']['5.11']['rylaiLiandry_winner']) * 10000) / 100.0
          magicDmg: Math.round($scope.showcase['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions'])
          magicDmgDiff: Math.round(($scope.showcase['summary']['5.14']['rylaiLiandry_magicDamageDealtToChampions'] - $scope.showcase['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) * 10000 / $scope.showcase['summary']['5.11']['rylaiLiandry_magicDamageDealtToChampions']) / 100.0
          crowdControl: Math.round($scope.showcase['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'])
          crowdControlDiff: Math.round(($scope.showcase['summary']['5.14']['rylaiLiandry_totalTimeCrowdControlDealt'] - $scope.showcase['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) * 10000 / $scope.showcase['summary']['5.11']['rylaiLiandry_totalTimeCrowdControlDealt']) / 100.0
          champs: $scope.showcase['summary']['5.14']['rylaiLiandry_champs']
          oldChamps: $scope.showcase['summary']['5.11']['rylaiLiandry_champs']
        $scope.nlr =
          pickRate: Math.round($scope.showcase['summary']['5.14']['nlr_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase['summary']['5.14']['nlr_pickRate'] - $scope.showcase['summary']['5.11']['nlr_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase['summary']['5.14']['nlr_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase['summary']['5.14']['nlr_winner'] - $scope.showcase['summary']['5.11']['nlr_winner']) * 10000) / 100.0
          timestamp: Math.round($scope.showcase['summary']['5.14']['nlr_timestamp'])
          timestampDiff: Math.round(($scope.showcase['summary']['5.14']['nlr_timestamp'] - $scope.showcase['summary']['5.11']['nlr_timestamp']) * 10000 / $scope.showcase['summary']['5.11']['nlr_timestamp']) / 100.0
          champs: $scope.showcase['summary']['5.14']['nlr_champs']
          oldChamps: $scope.showcase['summary']['5.11']['nlr_champs']
        $scope.fiendish =
          pickRate: Math.round($scope.showcase['summary']['5.14']['fiendish_pickRate'] * 10000) / 100.0
          pickDiff: Math.round(($scope.showcase['summary']['5.14']['fiendish_pickRate'] - $scope.showcase['summary']['5.11']['fiendish_pickRate']) * 10000) / 100.0
          winner: Math.round($scope.showcase['summary']['5.14']['fiendish_winner'] * 10000) / 100.0
          winDiff: Math.round(($scope.showcase['summary']['5.14']['fiendish_winner'] - $scope.showcase['summary']['5.11']['fiendish_winner']) * 10000) / 100.0
          timestamp: Math.round($scope.showcase['summary']['5.14']['fiendish_timestamp'])
          timestampDiff: Math.round(($scope.showcase['summary']['5.14']['fiendish_timestamp'] - $scope.showcase['summary']['5.11']['fiendish_timestamp']) * 10000 / $scope.showcase['summary']['5.11']['fiendish_timestamp']) / 100.0
          champs: $scope.showcase['summary']['5.14']['fiendish_champs']
          oldChamps: $scope.showcase['summary']['5.11']['fiendish_champs']
    ), true

]