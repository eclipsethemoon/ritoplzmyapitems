angular.module('ritoplzmyapitems').directive 'd3Scatter', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      onClick: '&'
    link: (scope, element) ->
      margin = {top: 10, right: 10, bottom: 10, left: 50}
      width = element[0].parentElement.clientWidth - margin.left - margin.right
      height = 300 - margin.top - margin.bottom

      x = d3.scale.ordinal().rangeRoundBands([0, width], .2)
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
          ).attr 'width', x.rangeBand()

          # Create the y-axis
          svg.append('g').attr('class', 'yAxis').call yAxis
          svg.select('.yAxis').selectAll('text').text (d) ->
            console.log d
            if feature == 'timestamp'
              (d / 1000).toFixed(2)
            else
              Math.round(d * 100)

          # Create the x-axis
          svg.append('g').attr('class', 'xAxis').attr("transform", "translate(0," + y(0) + ")").call xAxis
          svg.select('.xAxis').selectAll('text').remove()
          iconWidth = (width - 50) / data.length
          svg.select('.xAxis').selectAll('.tick').data(data).append('svg:image').attr('xlink:href', (d) ->
            'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png'
          ).attr('width', iconWidth).attr('height', iconWidth)
           .attr('x', -iconWidth / 2).attr('y', -iconWidth / 2)

# Draw dots
#        tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
#        svg.selectAll('.dot').data(data).enter().append('image')
#          .attr('xlink:href', (d) -> 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png')
#          .attr("x", xMap).attr("y", yMap).attr("width", 16).attr("height", 16)
#          .on('mouseover', (d) ->
#            tooltip.transition().duration(200).style 'opacity', .9
#            if filter == 'timestamp'
#              tooltip.html(d['name'] + '<br/> (' + xValue(d) / 60000 + ', ' + yValue(d) / 60000 + ')')
#                .style('left', d3.event.pageX + 5 + 'px').style 'top', d3.event.pageY - 28 + 'px'
#            else
#              tooltip.html(d['name'] + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')')
#                .style('left', d3.event.pageX + 5 + 'px').style 'top', d3.event.pageY - 28 + 'px'
#          ).on 'mouseout', (d) ->
#            tooltip.transition().duration(500).style 'opacity', 0
]