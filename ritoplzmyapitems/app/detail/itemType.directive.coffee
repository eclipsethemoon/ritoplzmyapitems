angular.module('ritoplzmyapitems').directive 'd3Donut', [
  () ->
    restrict: 'EA'
    scope:
      data: '='
      filter: '='
      onClick: '&'
    link: (scope, element) ->
      width = element.parent()[0].offsetWidth - 20  # 20 is for margins and can be changed
      height = width;  # 20 is for margins and can be changed
      radius = width / 2;

      # Setup SVG details
      arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70)
      pie = d3.layout.pie().sort(null).value((d) -> d.count)
      svg = d3.select(element[0]).append('svg').attr('width', width).attr('height', height).append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      svg.attr 'height', height

      color = d3.scale.ordinal().range([
        '#98abc5'
        '#8a89a6'
        '#7b6888'
        '#6b486b'
        '#a05d56'
        '#d0743c'
        '#ff8c00'
      ])

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
        svg.selectAll('*').remove()  # remove all previous items before render

        # Draw donut
        tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
        g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc')
        g.append('path').attr('d', arc).style('fill', (d) -> color d.data.type)
        g.append('text').attr('transform', (d) -> 'translate(' + arc.centroid(d) + ')')
          .attr('dy', '.35em').style('text-anchor', 'middle').text((d) -> d.data.type)
]