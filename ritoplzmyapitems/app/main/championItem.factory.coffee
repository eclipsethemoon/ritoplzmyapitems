angular.module('ritoplzmyapitems').factory 'championItemService', [
  '$http',
  ($http) ->
    {
      # Gets the json file for 'term', which corresponds with the filename
      getDataFor: (term) -> $http.get('data/' + term + '.json')
    }
]