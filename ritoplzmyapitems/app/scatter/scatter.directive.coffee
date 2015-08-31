angular.module('ritoplzmyapitems').directive 'd3Scatter', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      pushed: '='
    link: (scope, element) ->
      margin = {top: 10, right: 0, bottom: 10, left: 50}
      width = 960 - margin.left - margin.right
      height = 400 - margin.top - margin.bottom

      x = d3.scale.ordinal().rangeRoundBands([0, width - 30], .3)
      y = d3.scale.linear().range([0, height])
      xAxis = d3.svg.axis().scale(x)
      yAxis = d3.svg.axis().scale(y).orient('left')

      svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height)
        .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      # on window resize, re-render d3 canvas
      window.onresize = -> scope.$apply()
      scope.$watch (->
        angular.element(window)[0].innerWidth
      ), ->
        scope.render scope.data, scope.filter

      # watch for data changes and re-render
      scope.$watch 'data', ((newVals, oldVals) ->
        scope.render newVals, scope.filter
      ), true

      scope.$watch 'filter', ((newVals, oldVals) ->
        scope.render scope.data, newVals
      ), true

      # define render function
      scope.render = (data, feature) ->
        if data.length
          changeIcon = (v) ->
            console.log v
            if v > 0
              '<span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>'
            else
              '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>'

          changeTimeIcon = (v) ->
            if v > 0
              '<span class="glyphicon glyphicon-triangle-top timestamp" aria-hidden="true"></span>'
            else
              '<span class="glyphicon glyphicon-triangle-bottom timestamp" aria-hidden="true"></span>'

          tipOffset = if scope.pushed == 'items' then 0 else -175
          tip = d3.tip().attr('class', 'd3-tip').offset([-10, tipOffset]).html((d) ->
            '<center><strong>' + d['name'] + '</strong></center><br/>' +
              '<strong>Pick rate: </strong>' + (d['5.14']['pickRate'] * 100).toFixed(1) + '%' +
              changeIcon(d['5.14']['pickRate'] - d['5.11']['pickRate']) +
              (d['5.11']['pickRate'] * 100).toFixed(1) + '%' + '<br/>' +
              '<strong>Win rate: </strong>' + (d['5.14']['winner'] * 100).toFixed(1) + '%' +
              changeIcon(d['5.14']['winner'] - d['5.11']['winner']) +
              (d['5.11']['winner'] * 100).toFixed(1) + '%' + '<br/>' +
              '<strong>Time to complete: </strong>' + (d['5.14']['timestamp'] / 60000).toFixed(1) + 'min' +
              changeTimeIcon(d['5.14']['timestamp'] - d['5.11']['timestamp']) +
              (d['5.11']['timestamp'] / 60000).toFixed(1) + 'min'
          )
          svg.call tip

          svg.selectAll('*').remove()  # remove all previous items before render
          x.domain data.map((d) -> d['id'])
          y.domain(d3.extent(data, (d) -> d['5.11'][feature] - d['5.14'][feature]))

          # Create the bars
          svg.selectAll('.bar').data(data).enter().append('rect').attr('class', (d) ->
            if feature == 'timestamp'
              if (d['5.14'][feature] - d['5.11'][feature]) > 0 then 'bar negative' else 'bar positive'
            else
              if (d['5.14'][feature] - d['5.11'][feature]) < 0 then 'bar negative' else 'bar positive'
          ).attr('x', (d) ->
            x d['id']
          ).attr('y', (d) ->
            y Math.min(0, (d['5.11'][feature] - d['5.14'][feature]))
          ).attr('height', (d) ->
            Math.abs(y(d['5.14'][feature] - d['5.11'][feature]) - y(0))
          ).attr('width', x.rangeBand()).on('mouseover', tip.show).on('mouseout', tip.hide)

          # Create the y-axis
          svg.append('g').attr('class', 'yAxis').call yAxis
          svg.select('.yAxis').selectAll('text').text (d) ->
            if feature == 'timestamp'
              (d / 60000).toFixed(1)
            else
              Math.round(d * 100)

          # Create the x-axis
          iconWidth = x.rangeBand()
          svg.append('g').attr('class', 'xAxis').attr("transform", "translate(0," +
            Math.max((iconWidth / 2), Math.min(y(0), height - (iconWidth / 2))) + ")"
          ).call xAxis
          svg.select('.xAxis').selectAll('text').remove()
          svg.select('.xAxis').selectAll('.tick').data(data).append('svg:image').attr('xlink:href', (d) ->
            'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png'
          ).attr('width', iconWidth).attr('height', iconWidth).attr('x', -iconWidth / 2).attr('y', -iconWidth / 2)
          .on('mouseover', tip.show).on('mouseout', tip.hide)
]