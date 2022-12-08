'use strict';

jQuery(document).ready(function($) {
    var recordCount = 0;
    $.ajax({
        url: '/getrecords',
        method: 'post',
        data: {
            user_id: $('#curuserid').val(),
        },
        success: function(result) {
            var recordList = '';
            var idx = 0;
            if( result.data.length > 0 ) {
                recordCount = result.data.length;
                recordList = '';
                for( idx=0; idx<result.data.length; idx++ ) {
                    recordList += '<div class="record-item">';
                    recordList += '<input type="hidden" class="downloadLink" value="' + result.data[idx].filename + '" />';
                    recordList += '<div class="record-image"><img src="/images/ico_recording.png"></div>';
                    recordList += '<p>' + result.data[idx].description + '</p>';
                    recordList += '<div class="record-btn" id="' + result.data[idx].id + '">';
                    recordList += '<a class="download" download="' + result.data[idx].filename + '" target="_blank" href="/uploads/' + result.data[idx].filename + '">Download</a>';
                    recordList += '<button class="delete">Delete</button>';
                    recordList += '</div></div>';
                }
            } else {
                recordList = '<div class="record-item">';
                recordList += '<div class="record-image"><img src="/images/ico_recording.png"></div>';
                recordList += '<p>No Recordings...</p>';
                recordList += '<div class="record-btn"><button class="expand">Start a New Call</button></div>';
                recordList += '</div>';
            }
            $('.record-wrap').html(recordList);
        }
    });
    // go to meeting room
    $('body').on('click', '.record-btn .expand', function() {
        $.ajax({
            url: '/api/auth/updateopen',
            method: 'post',
            data: {isOpen: true},
            success: function(result) {
                window.location.href = '/' + $('#meetingRoomName').val();
            }
        });
    });
    // delete recording data
    $('body').on('click', '.record-btn .delete', function() {
        const del_id = $(this).parent().attr('id');
        var curObj = $(this).parent().parent();
        $.ajax({
            url: '/removerecord',
            method: 'post',
            data: {
                id: del_id,
            },
            success: function(result) {
                curObj.remove();
                recordCount --;
                if( recordCount == 0 ) {
                    var recordList = '';
                    recordList = '<div class="record-item">';
                    recordList += '<div class="record-image"><img src="/images/ico_recording.png"></div>';
                    recordList += '<p>No Recordings...</p>';
                    recordList += '<div class="record-btn"><button class="expand">Start a New Call</button></div>';
                    recordList += '</div>';
                    $('.record-wrap').html(recordList);
                }
            }
        });
    });
});