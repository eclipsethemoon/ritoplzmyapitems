angular.module('ritoplzmyapitems').factory 'lastfm', [
  '$http'
  ($http) ->
    patches = ['5.11', '5.14']
    items = ['1026', '1052', '1058', '3001', '3003', '3023', '3025', '3027', '3041', '3057', '3060', '3078', '3089',
             '3100', '3108', '3113', '3115', '3116', '3124', '3135', '3136', '3145', '3146', '3151', '3152', '3157',
             '3165', '3174', '3191', '3285', '3504']

#   # Want something like this returned
    apiKey = '9e421941650f3e6d9058baf8d69d4df9'
    {
      topTags: ->
        url = 'http://ws.audioscrobbler.com/2.0/'
        $http.get url, params:
          method: 'chart.gettoptags'
          api_key: apiKey
          format: 'json'
      topArtists: (tag) ->
        url = 'http://ws.audioscrobbler.com/2.0/'
        $http.get url, params:
          method: 'tag.gettopartists'
          api_key: apiKey
          tag: tag
          format: 'json'
    }
]