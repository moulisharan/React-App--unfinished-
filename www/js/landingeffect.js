'use strict';

jQuery(document).ready(function($) {
    $('.faq-accordion .accordion').on('click', function() {
        // $(this).parent().find('.panel').toggle();
        if( $(this).hasClass('active') ) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    });
    $('.hero-divider .divider a').on('click', function() {
        var position = $('#meet-section').offset().top - 90;
        $('html, body').animate({
            scrollTop: position
        }, 1200);
    });
    $('.joinmeetingbtn').on('click', function() {
        var room_name = $(this).parent().find('input').val();
        if( room_name != '' )
            window.location.href = '/' + room_name;
    });
    $(document).on('click', function(e) {
        if( !$(e.target).closest('.landing-menu').length )
            $('.roomname-wrap').fadeOut();

        if( !$(e.target).closest('.profile').length )
            $('.sub-menu').fadeOut();
    });

    $('#mobileOpen').on('change', function() {
        // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            if( $(this).prop('checked') ) {
                $('#mobilelable').html('Close Menu');
                $('.landing-topmenu').fadeIn();
            } else {
                $('#mobilelable').html('Menu');
                $('.landing-topmenu').fadeOut();
            }
        // } 
    });
});