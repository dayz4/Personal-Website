$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 50
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

// $(window).scroll(function() {
//     if ($(this).scrollTop() > 400) {
//         $( ".bg #fade" ).fadeIn();
//     } else {
//         console.log('there');
//         $( ".bg #fade" ).fadeOut();
//     }
// });

var fadeStart=100 // 100px scroll or less will equiv to 1 opacity
,fadeUntil=200 // 200px scroll or more will equiv to 0 opacity
,bg = $('#bg')
;

$(window).bind('scroll', function(){
var offset = $(document).scrollTop()
	,opacity=0
;
if( offset<=fadeStart ){
	opacity=1;
}else if( offset<=fadeUntil ){
	opacity=1-offset/fadeUntil;
}
bg.css('opacity',opacity).html(opacity);
});
