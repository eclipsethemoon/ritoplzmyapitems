angular.module('ritoplzmyapitems').directive 'd3Donut', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      onClick: '&'
    link: (scope, element) ->
      svg = d3.select(element[0]).append('svg').attr('width', '100%')

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
      scope.render = (data, filter) ->
        svg.selectAll('*').remove()  # remove all previous items before render
        # setup variables
        width = d3.select(element[0])[0][0].offsetWidth - 20  # 20 is for margins and can be changed
        height = 300;  # 20 is for margins and can be changed
        svg.attr 'height', height

        # Setup the x-axis
        xScale = d3.scale.linear().range([0, width])
        xValue = (d) -> d['5.11'][filter] * 100
        xScale.domain [d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]
        xMap = (d) -> xScale xValue(d)
        xAxis = d3.svg.axis().scale(xScale).orient('bottom')
        svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis)
        .append('text').attr('class', 'label').attr('x', width).attr('y', -6).style('text-anchor', 'end')
        .text 'Pre-AP Item Changes'

        # Setup the y-axis
        yScale = d3.scale.linear().range([height, 0])
        yValue = (d) -> d['5.14'][filter] * 100
        yScale.domain [d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]
        yMap = (d) -> yScale yValue(d)
        yAxis = d3.svg.axis().scale(yScale).orient('left')
        svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label')
        .attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end')
        .text 'Post-AP Item Changes'

        # TODO: Draw reference y = x line
        svg.append('line').attr('x1', 0).attr('x2', 100).attr('y1',0).attr('y2', 100).attr('color', 'black')

        # Draw dots
        tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
        svg.selectAll('.dot').data(data).enter().append('image')
        .attr('xlink:href', (d) -> 'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/' + d['id'] + '.png')
        .attr("x", xMap).attr("y", yMap).attr("width", 16).attr("height", 16)
        .on('mouseover', (d) ->
          tooltip.transition().duration(200).style 'opacity', .9
          if filter == 'timestamp'
            tooltip.html(d['name'] + '<br/> (' + xValue(d) / 60000 + ', ' + yValue(d) / 60000 + ')')
            .style('left', d3.event.pageX + 5 + 'px').style 'top', d3.event.pageY - 28 + 'px'
          else
            tooltip.html(d['name'] + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')')
            .style('left', d3.event.pageX + 5 + 'px').style 'top', d3.event.pageY - 28 + 'px'
        ).on 'mouseout', (d) ->
          tooltip.transition().duration(500).style 'opacity', 0
]