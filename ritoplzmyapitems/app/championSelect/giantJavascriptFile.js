//need this to get any of the tooltips to work
$('[data-toggle="tooltip"]').tooltip();





//these can be replaced by angular functions

var menuLeft = document.getElementById( 'cbp-spmenu-s1' ), 
    showLeftPush = document.getElementById( 'showLeftPush' ),
    arrowLeft = document.getElementById( 'panelLeftButton' ),
    arrowRight = document.getElementById( 'panelRightButton' );

var togglePanel = function() {
				classie.toggle( this, 'active' );
				// this for push
				classie.toggle( document.body, 'cbp-spmenu-push-toright' );
				// this for slide
				// classie.toggle( document.body, 'cbp-spmenu-open');
				classie.toggle( menuLeft, 'cbp-spmenu-open' );
				classie.toggle( arrowLeft, 'hide');
				classie.toggle( arrowRight, 'hide');
			};
				
arrowRight.onclick = togglePanel
arrowLeft.onclick = togglePanel


var searchButton = $("#searchButton")
searchButton.click(function() {
	if ($("#searchButtonWrapper").width() > 100) {
		$("#searchButtonWrapper").animate({width: '50px'}, 500);
	}
	else {
		$("#searchButtonWrapper").animate({width: '250px'}, 500);
	}
});

$(window).scroll( function(){
    
        /* Check the location of each desired element */
        $('.hideMe').each( function(i){
            
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + 1000;
            
            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){
                
                $(this).animate({'opacity':'1'},500);
                $(this).removeClass('hideMe')
                console.log("fading in", this)
                    
            }
            
        }); 
    
    });

$(document).ready(function() {
  var color = 'one';
  var counter = 0;

  $('.desc').click(
  	function() {
  		console.log("open champion panel for ", $(this).attr('championname'))
  		$(arrowRight).click()
  	}
  );
  $('.hexagon').hover(
    function() {
      $(this).find('.desc').fadeOut('fast');
      // counter++;
      // if (counter === 0) {
      //   color = 'base';
      // } else if (counter === 1) {
      //   color = 'one';
      // } else if (counter === 2) {
      //   color = 'two';
      // } else if (counter === 3) {
      //   color = 'three';
      // } else if (counter >= 4){
      //   counter = 0 ;
      //   color = 'base';
      // }
      // $(this).find('.desc').addClass(color);
      $(this).find('.desc').removeClass('inactive')
    }, 
    function() {
      $(this).find('.desc').fadeIn('fast', function() {
        // $(this).removeClass(color);
        $(this).addClass("inactive")
      });
    });
});