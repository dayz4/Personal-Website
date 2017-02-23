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
	$('.header, .circular').hide();
	$('.bg#home').hide();
	$('.content#about').hide().css('margin-right', '0px');
  $('.nav').load('navbar.html')
})

$(window).on('load', function() {
	$('h1#loading').fadeOut(800);
	$('.header, .circular').css('left', '55%').delay(400).animate({opacity: 'show', left: '50%'}, 1000);
	$('.bg#home').delay(400).fadeIn(1000);
});

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();
	// var aboutTop = $('.content#about').offset().top;

	if (scrollTop > 350) {
		$('.content#about').animate({opacity: 'show', marginRight: '40px'}, 1000);;
	}
});
