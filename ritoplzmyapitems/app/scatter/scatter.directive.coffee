angular.module('ritoplzmyapitems').directive 'd3Scatter', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      pushed: '='
    link: (scope, element) ->
      margin = {top: 10, right: 10, bottom: 10, left: 50}
      width = element[0].parentElement.clientWidth - margin.left - margin.right
      height = 400 - margin.top - margin.bottom

      x = d3.scale.ordinal().rangeRoundBands([0, width - 30], .3)
      y = d3.scale.linear().range([height, 0])
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
          tipOffset = if scope.pushed == 'items' then 0 else -350
          tip = d3.tip().attr('class', 'd3-tip').offset([-10, tipOffset]).html((d) ->
            '<strong>' + d['name'] + '</strong>'
          )
          svg.call tip

          svg.selectAll('*').remove()  # remove all previous items before render
          x.domain data.map((d) -> d['id'])
          y.domain(d3.extent(data, (d) -> d['5.14'][feature] - d['5.11'][feature]))

          # Create the bars
          svg.selectAll('.bar').data(data).enter().append('rect').attr('class', (d) ->
            if (d['5.14'][feature] - d['5.11'][feature]) < 0 then 'bar negative' else 'bar positive'
          ).attr('x', (d) ->
            x d['id']
          ).attr('y', (d) ->
            y Math.max(0, (d['5.14'][feature] - d['5.11'][feature]))
          ).attr('height', (d) ->
            Math.abs(y(d['5.14'][feature] - d['5.11'][feature]) - y(0))
          ).attr('width', x.rangeBand()).on('mouseover', tip.show).on('mouseout', tip.hide)

          # Create the y-axis
          svg.append('g').attr('class', 'yAxis').call yAxis
          svg.select('.yAxis').selectAll('text').text (d) ->
            if feature == 'timestamp'
              (d / 1000).toFixed(2)
            else
              Math.round(d * 100)

          # Create the x-axis
          iconWidth = x.rangeBand()
          svg.append('g').attr('class', 'xAxis').attr("transform", "translate(0," + Math.min(y(0), height - (iconWidth / 2)) + ")").call xAxis
          svg.select('.xAxis').selectAll('text').remove()
          svg.select('.xAxis').selectAll('.tick').data(data).append('svg:image').attr('xlink:href', (d) ->
            'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png'
          ).attr('width', iconWidth).attr('height', iconWidth).attr('x', -iconWidth / 2).attr('y', -iconWidth / 2)
          .on('mouseover', tip.show).on('mouseout', tip.hide)
]