'use strict';

Stripe.setPublishableKey(process.env.STRIPE_SECRET_KEY);

jQuery(document).ready(function($) {
    /* Coupon code check */
    var couponValid = false;
    var coupon = null;
    var mainPrice = 12.99;
    var discountPrice = 0.00;
    var totalPrice = 12.99;
    $('#coupon').on('keyup', function() {
        var couponVal = $(this).val();
        if(couponVal != '') {
            $.ajax({
                url: '/getcoupon',
                method: 'post',
                data: {
                    couponid: couponVal
                },
                success: function(result) {
                    if( result.message && result.message == 'error' ) {
                        couponValid = false;
                        coupon = null;
                        $('#discountPrice').html('');
                        $('#sumPrice').html('$12.99 <span>/month</span>');
                        $.ajax({
                            url: '/getpromotion',
                            method: 'post',
                            data: {
                                couponid: couponVal
                            },
                            success: function(result) {
                                if( result.message && result.message == 'error' ) {
                                    couponValid = false;
                                    coupon = null;
                                    $('#discountPrice').html('');
                                    $('#sumPrice').html('$12.99 <span>/month</span>');
                                } else {
                                    couponValid = true;
                                    coupon = result;
                                    $('#couponid').val(coupon.id);
                                    discountPrice = parseFloat(mainPrice * coupon.percent_off / 100);
                                    totalPrice = parseFloat(mainPrice - discountPrice);
                                    $('#discountPrice').html(coupon.percent_off + '% off Premium');
                                    $('#sumPrice').html('$' + totalPrice + ' <span>/month</span>');
                                }
                            }
                        });
                    } else {
                        couponValid = true;
                        coupon = result;
                        $('#couponid').val(coupon.id);
                        discountPrice = parseFloat(mainPrice * coupon.percent_off / 100);
                        totalPrice = parseFloat(mainPrice - discountPrice);
                        $('#discountPrice').html(coupon.percent_off + '% off Premium');
                        $('#sumPrice').html('$' + totalPrice + ' <span>/month</span>');
                    }
                }
            });
        }
    });
    $('#expirateDay').on('keydown', function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if( (parseInt(keycode) < 47 || parseInt(keycode) > 57) 
            && parseInt(keycode) != 8 && parseInt(keycode) != 32 
            && parseInt(keycode) != 37 && parseInt(keycode) != 39 
            && parseInt(keycode) != 116 && parseInt(keycode) != 9 ) {
            return false;
        }
        if( $(this).val().length == 2 && parseInt(keycode) != 8 && parseInt(keycode) != 9 )
            $(this).val($(this).val() + '/');
    });
    /* Payment */
    $('#freeTrialBtn').on('click', function() {
        if( $('#cardNumber').val() == '' || $('#expirateDay').val() == '' || $('#cvc').val() == '' ) {
            alert('Please input payment method');
            return false;
        }
        var expDate = $('#expirateDay').val().split('/');
        var thisBtn = $(this);
        thisBtn.attr('disabled', 'disabled');
        var loadingObj = $(this).find('img');
        var btnText = $(this).find('span');
        loadingObj.show();
        btnText.hide();

        Stripe.createToken({
            number: $('#cardNumber').val(),
            cvc: $('#cvc').val(),
            exp_month: expDate[0],
            exp_year: expDate[1]
        }, function(status, response) {
            if( response.error ) {
                thisBtn.removeAttr('disabled');
                $('.summary-wrap.error').fadeIn();
                btnText.show();
                loadingObj.hide();
                setTimeout(function() {
                    $('.summary-wrap.error').fadeOut();
                }, 4000);
            } else {
                var token = response['id'];
                // $('#stripeToken').val(token);
                // $('#paymentForm').submit();
                $.ajax({
                    url: '/api/auth/updatepay',
                    method: 'post',
                    data: {
                        stripeToken: token,
                        couponid: $('#couponid').val(),
                    },
                    success: function(result) {
                        if( result.message == 'success' ) {
                            $('.summary-wrap.success').fadeIn();
                            btnText.show();
                            loadingObj.hide();
                            setTimeout(function() {
                                $('.summary-wrap.success').fadeOut();
                                if( $('#fromVal').val() == '' )
                                    window.location.href = '/roomname';
                                else if( $('#fromVal').val() == '1' )
                                    window.location.href = '/subscription';
                                else 
                                    window.location.href = '/roomsett';
                            }, 3000);
                        } else {
                            $('.summary-wrap.error').fadeIn();
                            setTimeout(function() {
                                $('.summary-wrap.error').fadeOut();
                            }, 4000);
                        }
                    }
                });
            }
        });
        return false;
    });
});