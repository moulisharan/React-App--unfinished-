'use strict';

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

let adjectives = [
    'small',
    'big',
    'large',
    'smelly',
    'new',
    'happy',
    'shiny',
    'old',
    'clean',
    'nice',
    'bad',
    'cool',
    'hot',
    'cold',
    'warm',
    'hungry',
    'slow',
    'fast',
    'red',
    'white',
    'black',
    'blue',
    'green',
    'basic',
    'strong',
    'cute',
    'poor',
    'nice',
    'huge',
    'rare',
    'lucky',
    'weak',
    'tall',
    'short',
    'tiny',
    'great',
    'long',
    'single',
    'rich',
    'young',
    'dirty',
    'fresh',
    'brown',
    'dark',
    'crazy',
    'sad',
    'loud',
    'brave',
    'calm',
    'silly',
    'smart',
];

let nouns = [
    'dog',
    'bat',
    'wrench',
    'apple',
    'pear',
    'ghost',
    'cat',
    'wolf',
    'squid',
    'goat',
    'snail',
    'hat',
    'sock',
    'plum',
    'bear',
    'snake',
    'turtle',
    'horse',
    'spoon',
    'fork',
    'spider',
    'tree',
    'chair',
    'table',
    'couch',
    'towel',
    'panda',
    'bread',
    'grape',
    'cake',
    'brick',
    'rat',
    'mouse',
    'bird',
    'oven',
    'phone',
    'photo',
    'frog',
    'bear',
    'camel',
    'sheep',
    'shark',
    'tiger',
    'zebra',
    'duck',
    'eagle',
    'fish',
    'kitten',
    'lobster',
    'monkey',
    'owl',
    'puppy',
    'pig',
    'rabbit',
    'fox',
    'whale',
    'beaver',
    'gorilla',
    'lizard',
    'parrot',
    'sloth',
    'swan',
];

let weekname = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];

function getRandomNumber(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
let noun = nouns[Math.floor(Math.random() * nouns.length)];
let num = getRandomNumber(5);
noun = noun.charAt(0).toUpperCase() + noun.substring(1);
adjective = adjective.charAt(0).toUpperCase() + adjective.substring(1);
// document.getElementById('roomName').value = '';

// ####################################################
// TYPPING EFECT
// ####################################################

let i = 0;
let txt = num + adjective + noun;
let speed = 100;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById('roomName').value += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

// typeWriter();

// function onEnterRoomName() {
//     if( document.getElementById("createMeeting").style.display == '' || document.getElementById("createMeeting").style.display == 'none' )
//         document.getElementById("createMeeting").style.display = 'block';
//     else 
//         document.getElementById("createMeeting").style.display = 'none';
//     typeWriter();
// }

// get current date and time
function getCurrentTime() {
    let currentDate = new Date();
    let curHour = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
    let AMPM = currentDate.getHours() > 12 ? ' PM' : ' AM';
    let curTime = curHour + ":" + currentDate.getMinutes() + AMPM;
    // document.getElementById('cur_time').innerHTML = curTime;

    let curDate = weekname[currentDate.getDay()] + " "
        + currentDate.toLocaleString('default', { month: 'long' }) 
        + ' ' + currentDate.getDate()
        + ", " + currentDate.getFullYear();
    // document.getElementById('cur_date').innerHTML = curDate;
    document.getElementById('cur_time').innerHTML = curTime + ' - ' + curDate;
}

getCurrentTime();
setInterval(getCurrentTime, 1000);

jQuery(document).ready(function($) {
    $('.landing-menu').on('click', function(e) {
        e.preventDefault();
        if( $(e.target).closest('.roomname-wrap').length )
            return false;
        $('.landing-menu').removeClass('selected');
        $('.roomname-wrap').css('display', 'none');
        $(this).addClass('selected');
        $(this).find('.roomname-wrap').delay(150).fadeIn('fast');
        // typeWriter();
    });
    // $('.profile-plan-item').on('click', function() {
    //     $('.profile-plan-item').removeClass('selected');
    //     $(this).addClass('selected');
    // });

    $('.home-landing-menu').on('click', function() {
        if( $('#userRoomName').val() != '' ) {
            $.ajax({
                url: '/api/auth/updateopen',
                method: 'post',
                data: {isOpen: true},
                success: function(result) {
                    window.location.href = '/' + $('#userRoomName').val();
                }
            });
        }
    });

    $('.nologged').on('click', function() {
        window.location.href = '/login';
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

    $('#learnMore').on('click', function() {
        var position = $('#meet-section').offset().top - 90;
        $('html, body').animate({
            scrollTop: position
        }, 1800);
    });

    $('.gotoFeature').on('click', function() {
        var position = $('#servicemap-area').offset().top - 90;
        $('html, body').animate({
            scrollTop: position
        }, 2500);
    });

    $('#startMeeting').on('click', function() {
        window.location.href = '/register';
    });

    $('#roomSeettingSave').on('click', function() {
        if( $('#roomname').val() == '' ) {
            alert('Please input Room Name');
            return false;
        }

        var obj = $(this);

        $.ajax({
            url: '/roomsetting',
            type: 'post',
            dataType: 'json',
            data: {
                roomname: $('#roomname').val(),
                filename: $('#uploadedFile').val(),
                email: $('#email').val(),
            },
            success: function(result) {
                if( result.message == 'success' ) {
                    // if( $('#uploadedFile').val() != '' ) {
                    //     $('.profile img').attr('src', '/uploads/' + $('#uploadedFile').val());
                    // }
                    // alert('Successfully Saved');
                    obj.html('Saved!');
                }
            }
        });
    });

    $('#profileSave').on('click', function() {
        if( $('#username').val() == '' ) {
            alert('Please input First Name');
            return false;
        }

        if( $('#email').val() == '' || !validateEmail($('#email').val()) ) {
            alert('Please input correct email');
            return false;
        }

        if( $('#roomname').val() == '' ) {
            alert('Please input Room Name');
            return false;
        }

        $.ajax({
            url: '/api/auth/updateprofile',
            type: 'post',
            dataType: 'json',
            data: {
                username: $('#username').val(),
                password: $('#password').val(),
                roomname: $('#roomname').val(),
                filename: $('#uploadedFile').val(),
                email: $('#email').val(),
            },
            success: function(result) {
                if( result.message == 'success' ) {
                    if( $('#uploadedFile').val() != '' ) {
                        $('.profile img').attr('src', '/uploads/' + $('#uploadedFile').val());
                    }
                    $('#profileSave').html('Saved!');
                    setTimeout(() => {
                        $('#profileSave').html('Save and Update');
                    }, 3000);
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

    $('#photoFile').on('change', function(evt) {
        var fileCtrl = document.getElementById('photoFile');
        const [file] = fileCtrl.files;
        if( file ) {
            $('#profilePhoto').attr('src', URL.createObjectURL(file));
        }

        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: '/upload',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function(data){
                $('#uploadedFile').val(data.filename);
            }
        });
    });

    $('.profile').on('click', function() {
        $('.profile .sub-menu').toggle();
    });
});