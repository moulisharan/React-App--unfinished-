'use strict';

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}  

jQuery(document).ready(function($) {
    $('#registerBtn').on('click', function() {
        if( $('#firstname').val() == '' ) {
            $('#errorMsg').html('Please input username');
            return false;
        }

        if( $('#password').val() == '' ) {
            $('#errorMsg').html('Please input password');
            return false;
        }

        if( $('#email').val() == '' || !validateEmail($('#email').val()) ) {
            $('#errorMsg').html('Please input correct email');
            return false;
        }

        var registerBtnText = $(this).find('span');
        var loadingObj = $(this).find('img');
        loadingObj.show();
        registerBtnText.hide();

        $.ajax({
            url: '/api/auth/hasuser',
            method: 'post',
            data: {userEmail: $('#email').val()},
            success: function(result) {
                registerBtnText.show();
                loadingObj.hide();
                if( result.message == 'yes' ) {
                    $('#errorMsg').html('The user is already exist');
                } else {
                    $('#signUpForm').submit();
                }
            }
        });
    });

    $('#passSetting').on('click', function() {
        if( $(this).attr('alt') == 'Show' ) {
            $(this).attr('alt', 'Hide');
            $(this).attr('src', 'images/ico_eye1.svg');
            $('#password').attr('type', 'text');
        } else {
            $(this).attr('alt', 'Show');
            $(this).attr('src', 'images/ico_eye.svg');
            $('#password').attr('type', 'password');
        }
    });

    $('#signinForm #password').on('keyup', function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if( keycode == '13' ) {
            if( $('#email').val() == '' || !validateEmail($('#email').val()) ) {
                $('#errorMsg').html('Please input correct email');
                return false;
            }
            if( $('#password').val() == '' ) {
                $('#errorMsg').html('Please input password');
                return false;
            }

            var loginBtnText = $('#loginBtn span');
            var loadingObj = $('#loginBtn img');
            loadingObj.show();
            loginBtnText.hide();
    
            $.ajax({
                url: '/api/auth/checkuser',
                method: 'post',
                data: {
                    userEmail: $('#email').val(),
                    userPass: $('#password').val()
                },
                success: function(result) {
                    loginBtnText.show();
                    loadingObj.hide();
                    if( result.message == 'no' ) {
                        $('#errorMsg').html('User email or password is incorrect');
                    } else {
                        $('#signinForm').submit();
                    }
                }
            });
        }
    });

    $('#signUpForm #password').on('keyup', function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if( keycode == '13' ) {
            if( $('#firstname').val() == '' ) {
                $('#errorMsg').html('Please input username');
                return false;
            }
    
            if( $('#password').val() == '' ) {
                $('#errorMsg').html('Please input password');
                return false;
            }
    
            if( $('#email').val() == '' || !validateEmail($('#email').val()) ) {
                $('#errorMsg').html('Please input correct email');
                return false;
            }

            var registerBtnText = $('#registerBtn span');
            var loadingObj = $('#registerBtn img');
            loadingObj.show();
            registerBtnText.hide();
    
            $.ajax({
                url: '/api/auth/hasuser',
                method: 'post',
                data: {userEmail: $('#email').val()},
                success: function(result) {
                    registerBtnText.show();
                    loadingObj.hide();
                    if( result.message == 'yes' ) {
                        $('#errorMsg').html('The user is already exist');
                    } else {
                        $('#signUpForm').submit();
                    }
                }
            });    
        }
    });

    $('#loginBtn').on('click', function() {
        if( $('#email').val() == '' || !validateEmail($('#email').val()) ) {
            $('#errorMsg').html('Please input correct email');
            return false;
        }
        if( $('#password').val() == '' ) {
            $('#errorMsg').html('Please input password');
            return false;
        }

        var loginBtnText = $(this).find('span');
        var loadingObj = $(this).find('img');
        loadingObj.show();
        loginBtnText.hide();

        $.ajax({
            url: '/api/auth/checkuser',
            method: 'post',
            data: {
                userEmail: $('#email').val(),
                userPass: $('#password').val()
            },
            success: function(result) {
                loginBtnText.show();
                loadingObj.hide();
                if( result.message == 'no' ) {
                    $('#errorMsg').html('User email or password is incorrect');
                } else {
                    $('#signinForm').submit();
                }
            }
        });
    })

    $('#freePlanBtn').on('click', function() {
        $('#plantype').val('1');
        $('#planform').submit();
    });
    $('#paidPlanBtn').on('click', function() {
        $('#plantype').val('2');
        $('#planform').submit();
    });
});