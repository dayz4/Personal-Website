$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 800);
    });
}

$.fn.scrollViewHome = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 100
        }, 800);
    });
}

$(document).ready(function() {
	$('.header').hide();
	$('.circular').css({'width':'0px', 'height':'0px', 'border-radius':'0px', 'margin-left':'0px', 'top':'600px'})
	$('.bg#home img').hide();
	$('.content#about').hide().css('margin-right', '0px');
  $('.nav').load('navbar.html')
})

$(window).on('load', function() {
	$('h1#loading').fadeOut(400);
	$('.header').css('left', '55%').delay(400).animate({opacity: 'show', left: '50%'}, 800);
	$('.circular').delay(1000).animate({width: '600px', height: '600px', 'border-radius': '300px', 'margin-left': '-300px', 'top': '300px'}, 1000);
	$('.bg#home img').delay(1800).fadeIn(1000);
	$('.header').delay(1800).animate({'color': 'white'}, 1000);
});

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();
	// var aboutTop = $('.content#about').offset().top;

	if (scrollTop > 350) {
		$('.content#about').animate({opacity: 'show', marginRight: '40px'}, 1000);;
	}
});
