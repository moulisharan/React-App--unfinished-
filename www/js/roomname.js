'use strict';

jQuery(document).ready(function($) {
    $('.plan-item').on('click', function() {
        $('.plan-item').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#freePlanBtn').on('click', function() {
        document.location.href="/roomname";
    });
    $('#paidPlanBtn').on('click', function() {
        document.location.href="/roomname";
    });
});

// id, name, email, password, roomname, plantype