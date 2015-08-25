angular.module('ritoplzmyapitems').directive 'toptagChart', [
  'itemService'
  (itemService) ->

    link = ($scope, $el, $attrs) ->
      diameter = 500
      bubble = d3.layout.pack().sort(null).size([
        diameter
        diameter
      ]).padding(2.5)
      svg = d3.select($el[0]).append('svg').attr(
        width: diameter
        height: diameter).attr('viewBox', '0 0 ' + diameter + ' ' + diameter)
      chart = svg.append('g')

      resize = ->
        svg.attr 'width', $el[0].clientWidth
        svg.attr 'height', $el[0].clientWidth

      chart.append('text').attr('id', 'loading').text('Loading...').attr 'transform', 'translate(200,250)'

      update = ->
        data = $scope.toptags.map((d) ->
          d.value = d[$scope.tagsize]
          d
        )
        bubble.nodes children: data
        if data.length
          chart.select('#loading').remove()
        selection = chart.selectAll('.node').data(data)
        enter = selection.enter().append('g').attr('class', 'node').attr('transform', (d) ->
          'translate(' + d.x + ',' + d.y + ')'
        )
        enter.append('circle').attr('r', (d) ->
          d.r
        ).style('fill', '#547980').on 'click', (d) ->
          svg.selectAll('circle').style 'fill', '#547980'
          d3.select(this).style 'fill', '#9DE0AD'
          itemService.topArtists(d.name).success (res) ->
            if res.error
              throw new Error(res.message)
            else
              $scope.currtag = d.name
              artists = res.topartists.artist.map((a) ->
                a.genre = d.name
                a.arank = +a['@attr'].rank
                a
              )
              $scope.artists = artists
        enter.append('text').attr('dy', '.3em').style('text-anchor', 'middle').text (d) ->
          d.name
        selection.transition().duration(2000).attr 'transform', (d) ->
          'translate(' + d.x + ',' + d.y + ')'
        selection.selectAll('circle').transition().duration(3000).attr 'r', (d) ->
          d.r
        resize()

      $scope.$on 'windowResize', resize
      $scope.$watch 'tagsize', update
      $scope.$watch 'toptags', update

    {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>'
      replace: true
      link: link
      restrict: 'E'
    }
]