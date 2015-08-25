angular.module('ritoplzmyapitems').factory 'itemService', [
  '$http',
  '$q'
  ($http, $q) ->
    patches = ['5.11', '5.14']
    items = ['1026', '1052', '1058', '3001', '3003', '3023', '3025', '3027', '3041', '3057', '3060', '3078', '3089',
             '3100', '3108', '3113', '3115', '3116', '3124', '3135', '3136', '3145', '3146', '3151', '3152', '3157',
             '3165', '3174', '3191', '3285', '3504']

    apiKey = '9e421941650f3e6d9058baf8d69d4df9'
    {
      itemChartData: (item, champion) ->
        if champion == '' then champion == 'summary'
        prePromise = $http.get('data/' + item + '_5.11.json')
        postPromise = $http.get('data/' + item + '_5.14.json')
        $q.all([prePromise, postPromise]).then (res) ->
          {
            data: [res[0]['data'][champion], res[1]['data'][champion]]
          }
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