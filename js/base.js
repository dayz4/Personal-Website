$(document).foundation().ready(function() {
  	$('.nav').load('navbar.html')

  	$('.hero-section-text').hide();
	$('#pro-pic').css({'width':'0', 'height':'0', 'margin-top': '27.5vh'})
	$('.content#about').hide().css({'margin-left': '2%', 'margin-right': '0'});
  	$('#about-buttons').hide();
});


$(window).on('load', function() {
	$('#loading-screen').fadeOut(400);
	$('.hero-section-text').css('left', '5%').delay(400).animate({'opacity': 'show', 'left': '0%'}, 800);
	$('#pro-pic').delay(1000).animate({'width': '55vh', 'height': '55vh', 'border-radius': '50%', 'margin-top': '0'}, 1000);
	$('.hero-section-text').delay(1100).animate({'color': 'white'}, 1000);
});

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();

	if (scrollTop > 350) {
		$('.content#about').animate({'opacity': 'show', 'margin-left': '0', 'marginRight': '2%'}, 1000);
		$('#about-buttons').show();
	}
});