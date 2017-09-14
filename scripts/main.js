$(document).ready(function(){

    $(document).foundation();

});

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

var mq = window.matchMedia( "(min-width: 800px)" );

$(document).ready(function() {
	$('.header').hide();
	$('.circular').css({'width':'0px', 'height':'0px', 'border-radius':'0px', 'margin-left':'0px', 'margin-top':'62vh'})
	$('.bg#home img').hide();
	if (mq.matches) {
		$('.content#about').hide().css('margin-right', '1%');
	} else {
		$('.content#about').hide().css('margin-right', '-4%');
	}
  	$('.nav').load('navbar.html')
})

$(window).on('load', function() {
	$('h1#loading').fadeOut(400);
	$('.header').css('left', '5%').delay(400).animate({opacity: 'show', left: '0%'}, 800);
	if (mq.matches) {
		$('.circular').delay(1000).animate({width: '60vh', height: '60vh', 'border-radius': '30vh', 'margin-left': '-30vh', 'margin-top': '32vh'}, 1000);
	} else {
		$('.circular').delay(1000).animate({width: '90vw', height: '90vw', 'border-radius': '45vw', 'margin-left': '-45vw', 'margin-top': '32vh'}, 1000);
	}
	$('.bg#home img').delay(1800).fadeIn(1000);
	$('.header').delay(1200).animate({'color': 'white'}, 1000);
});

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();
	// var aboutTop = $('.content#about').offset().top;

	if (scrollTop > 350) {
		if (mq.matches) {
			$('.content#about').animate({opacity: 'show', marginRight: '5%'}, 1000);
		} else {
			$('.content#about').animate({opacity: 'show', marginRight: '0px'}, 1000);
		}
	}
});
