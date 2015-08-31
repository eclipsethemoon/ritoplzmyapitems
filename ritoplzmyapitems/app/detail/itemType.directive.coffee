angular.module('ritoplzmyapitems').directive 'd3Donut', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      onClick: '&'
    link: (scope, element) ->
      width = 250  # Set to the same size as pageslide
      height = width;
      radius = width / 2;

      # Setup SVG details
      arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 50)
      pie = d3.layout.pie().sort(null).value((d) -> d.count)
      svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height).append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      svg.attr 'height', height

      color = d3.scale.ordinal().range(d3.scale.category10().range())

      # on window resize, re-render d3 canvas
      window.onresize = -> scope.$apply()
      scope.$watch (->
        angular.element(window)[0].innerWidth
      ), ->
        scope.render scope.data

      # watch for data changes and re-render
      scope.$watch 'data', ((newVals, oldVals) ->
        scope.render newVals
      ), true

      # define render function
      scope.render = (data) ->
        if data
          svg.selectAll('*').remove()  # remove all previous items before render

          # Draw donut
          tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
          g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc')
          g.append('path').attr('d', arc).style('fill', (d) -> color d.data.type)

          svg.append("text").datum(data).attr("x", 0 ).attr("y", 0 - radius/15 ).attr("class", "text-type-tooltip")
            .style("text-anchor", "middle").attr("font-weight", "bold").style("font-size", "16px");
          svg.append("text").datum(data).attr("x", 0 ).attr("y", 0 + radius/15 ).attr("class", "text-percent-tooltip")
            .style("text-anchor", "middle").attr("font-weight", "bold").style("font-size", "16px");
          g.on 'mouseover', (d) ->
            circle_text = Math.round(Math.abs(d.startAngle - d.endAngle) * 100 / (2 * Math.PI))
            svg.select('text.text-type-tooltip').attr('fill', color d.data.type).text(d.data.type)
            svg.select('text.text-percent-tooltip').attr('fill', color d.data.type).text(circle_text + '%')
          g.on 'mouseout', (d) ->
            svg.select('text.text-type-tooltip').text ''
            svg.select('text.text-percent-tooltip').text ''
]