angular.module('ritoplzmyapitems').controller 'MainCtrl', ($scope, $http) ->
  dataset = []
  # Initialize empty array
  numDataPoints = 15
  # Number of dummy data points
  maxRange = Math.random() * 1000
  # Max range of new values
  i = 0
  while i < numDataPoints
    newNumber1 = Math.floor(Math.random() * maxRange)
    # New random integer
    newNumber2 = Math.floor(Math.random() * maxRange)
    # New random integer
    dataset.push [
      newNumber1
      newNumber2
    ]
    # Add new number to array
    i++
  # Setup settings for graphic
  canvas_width = 500
  canvas_height = 300
  padding = 30
  # for chart edges
  # Create scale functions
  xScale = d3.scale.linear().domain([
    0
    d3.max(dataset, (d) ->
      d[0]
      # input domain
    )
  ]).range([
    padding
    canvas_width - (padding * 2)
  ])
  # output range
  yScale = d3.scale.linear().domain([
    0
    d3.max(dataset, (d) ->
      d[1]
      # input domain
    )
  ]).range([
    canvas_height - padding
    padding
  ])
  # remember y starts on top going down so we flip
  # Define X axis
  xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5)
  # Define Y axis
  yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5)
  # Create SVG element
  svg = d3.select('h3').append('svg').attr('width', canvas_width).attr('height', canvas_height)
  # Create Circles
  svg.selectAll('circle').data(dataset).enter().append('circle').attr('cx', (d) ->
    xScale d[0]
    # Circle's X
  ).attr('cy', (d) ->
    # Circle's Y
    yScale d[1]
  ).attr 'r', 2
  # radius
  # Add to X axis
  svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (canvas_height - padding) + ')').call xAxis
  # Add to Y axis
  svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + padding + ',0)').call yAxis
  # On click, update with new data
  d3.select('h4').on 'click', ->
    numValues = dataset.length
    # Get original dataset's length
    maxRange = Math.random() * 1000
    # Get max range of new values
    dataset = []
    # Initialize empty array
    i = 0
    while i < numValues
      newNumber1 = Math.floor(Math.random() * maxRange)
      # Random int for x
      newNumber2 = Math.floor(Math.random() * maxRange)
      # Random int for y
      dataset.push [
        newNumber1
        newNumber2
      ]
      # Add new numbers to array
      i++
    # Update scale domains
    xScale.domain [
      0
      d3.max(dataset, (d) ->
        d[0]
      )
    ]
    yScale.domain [
      0
      d3.max(dataset, (d) ->
        d[1]
      )
    ]
    # Update circles
    svg.selectAll('circle').data(dataset).transition().duration(1000).each('start', ->
      # Start animation
      d3.select(this).attr('fill', 'red').attr 'r', 5
      # Change size
    ).delay((d, i) ->
      i / dataset.length * 500
      # Dynamic delay (i.e. each item delays a little longer)
    ).attr('cx', (d) ->
      xScale d[0]
      # Circle's X
    ).attr('cy', (d) ->
      yScale d[1]
      # Circle's Y
    ).each 'end', ->
      # End animation
      d3.select(this).transition().duration(500).attr('fill', 'black').attr 'r', 2
      # Change radius
    # Update X Axis
    svg.select('.x.axis').transition().duration(1000).call xAxis
    # Update Y Axis
    svg.select('.y.axis').transition().duration(100).call yAxis
