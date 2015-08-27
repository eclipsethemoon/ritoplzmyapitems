angular.module('ritoplzmyapitems').controller 'CarouselCtrl', [
  '$scope'
  ($scope) ->
    $scope.myInterval = 5000
    $scope.noWrapSlides = false
    slides = $scope.slides = []

    $scope.addSlide = ->
      newWidth = 600 + slides.length + 1
      slides.push
        image: '//placekitten.com/' + newWidth + '/300'
        text: [
          'More'
          'Extra'
          'Lots of'
          'Surplus'
          'Phat'
        ][slides.length % 5] + ' ' + [
          'Cats'
          'Kittys'
          'Felines'
          'Cutes'
          'Schwifty'
        ][slides.length % 5]

    i = 0
    while i < 5
      $scope.addSlide()
      i++
]