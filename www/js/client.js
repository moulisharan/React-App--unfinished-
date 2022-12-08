/*
 ██████ ██      ██ ███████ ███    ██ ████████ 
██      ██      ██ ██      ████   ██    ██    
██      ██      ██ █████   ██ ██  ██    ██    
██      ██      ██ ██      ██  ██ ██    ██    
 ██████ ███████ ██ ███████ ██   ████    ██   

Shuffle Browser Client

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const isHttps = false; // must be the same to server.js isHttps
const signalingServerPort = 3000; // must be the same to server.js PORT
const signalingServer = getSignalingServer();
const roomId = getRoomId();
const peerInfo = getPeerInfo();
const peerLoockupUrl = 'https://extreme-ip-lookup.com/json/';
const avatarApiUrl = 'https://eu.ui-avatars.com/api';
const roomLockedImg = '../images/locked.png';
const camOffImg = '../images/cam-off.png';
const audioOffImg = '../images/audio-off.png';
const deleteImg = '../images/delete.png';
const youtubeImg = '../images/youtube.png';
const messageImg = '../images/message.png';
const kickedOutImg = '../images/leave-room.png';

const notifyBySound = true; // turn on - off sound notifications
const fileSharingInput = '*'; // allow all file extensions

const isWebRTCSupported = DetectRTC.isWebRTCSupported;
const isMobileDevice = DetectRTC.isMobileDevice;
const myBrowserName = DetectRTC.browser.name;

// video cam - screen max frame rate
let videoMaxFrameRate = 30;
let screenMaxFrameRate = 30;

let leftChatAvatar;
let rightChatAvatar;

let callStartTime;
let callElapsedTime;
let recStartTime;
let recElapsedTime;
let ShuffleTheme = 'neon'; // neon - dark - forest - ghost ...
let ShuffleBtnsBar = 'vertical'; // vertical - horizontal
let swalBackground = 'rgba(0, 0, 0, 0.7)'; // black - #16171b - transparent ...
let peerGeo;
let peerConnection;
let myPeerName;
let myPeerImage;
let prevVideo;
let useAudio = true;
let useVideo = true;
let camera = 'user';
let roomLocked = false;
let myVideoChange = false;
let myHandStatus = false;
let myVideoStatus = true;
let curVideoStatus = true;
let myAudioStatus = true;
let isScreenStreaming = false;
let isChatRoomVisible = false;
let isChatEmojiVisible = false;
let isButtonsVisible = false;
let isMySettingsVisible = false;
let isVideoOnFullScreen = false;
let isDocumentOnFullScreen = false;
let isWhiteboardFs = false;
let isVideoUrlPlayerOpen = false;
let isRecScreenSream = false;
let isGameOpen = false;
let signalingSocket; // socket.io connection to our webserver
let localMediaStream; // my microphone / webcam
let remoteMediaStream; // peers microphone / webcam
let recScreenStream; // recorded screen stream
let recordingTime = '';
let remoteMediaControls = false; // enable - disable peers video player controls (default false)
let peerConnections = {}; // keep track of our peer connections, indexed by peer_id == socket.io id
let chatDataChannels = {}; // keep track of our peer chat data channels
let fileDataChannels = {}; // keep track of our peer file sharing data channels
let peerMediaElements = {}; // keep track of our peer <video> tags, indexed by peer_id
let chatMessages = []; // collect chat messages to save it later if want
let backupIceServers = [{ urls: 'stun:stun.l.google.com:19302' }]; // backup iceServers
let timeMonitorInterval;    // Monitor interval for free user
let overTime = 0;           // Monitor time
let mainPeerId = [];        // join users

let chatInputEmoji = {
    '<3': '\u2764\uFE0F',
    '</3': '\uD83D\uDC94',
    ':D': '\uD83D\uDE00',
    ':)': '\uD83D\uDE03',
    ';)': '\uD83D\uDE09',
    ':(': '\uD83D\uDE12',
    ':p': '\uD83D\uDE1B',
    ';p': '\uD83D\uDE1C',
    ":'(": '\uD83D\uDE22',
    ':+1:': '\uD83D\uDC4D',
}; // https://github.com/wooorm/gemoji/blob/main/support.md

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}  


const backColor = [
    'f0cad3', 'eebcb7', 'f0d5b6', 'f2e4bd', 'cae8c8', 'cae2f2', 'd3ccf0'
];
// init audio-video
let initAudioBtn;
let initVideoBtn;
// buttons bar
let buttonsBar;
let shareRoomBtn;
let audioBtn;
let videoBtn;
let swapCameraBtn;
let screenShareBtn;
let recordStreamBtn;
let fullScreenBtn;
let chatRoomBtn;
let raiseHandBtn;
let whiteboardBtn;
let shareFileBtn;
let gameBtn;
let showSettingBtn;
let aboutBtn;
let leaveRoomBtn;
// chat room elements
let msgerDraggable;
let msgerHeader;
let msgerTheme;
let msgerCPBtn;
let msgerClean;
let msgerSaveBtn;
let msgerClose;
let msgerChat;
let msgerEmojiBtn;
let msgerInput;
let msgerSendBtn;
// chat room connected peers
let msgerCP;
let msgerCPHeader;
let msgerCPCloseBtn;
let msgerCPList;
// chat room emoji picker
let msgerEmojiPicker;
let emojiPicker;
// my settings
let mySettings;
let mySettingsHeader;
let tabDevicesBtn;
let tabBandwidthBtn;
let tabRoomBtn;
let mySettingsCloseBtn;
let myPeerNameSet;
let myPeerNameSetBtn;
let audioInputSelect;
let audioOutputSelect;
let videoSelect;
let videoQualitySelect;
let videoFpsSelect;
let screenFpsSelect;
let themeSelect;
let btnsBarSelect;
let selectors;
// my video element
let myVideo;
let myVideoWrap;
let myVideoAvatarImage;
// name && hand video audio status
let myVideoParagraph;
let myVideoStatusIcon;
let myAudioStatusIcon;
// record Media Stream
let mediaRecorder;
let recordedBlobs;
let isStreamRecording = false;
// whiteboard init
let whiteboardCont;
let whiteboardHeader;
let whiteboardColorPicker;
let whiteboardCloseBtn;
let whiteboardFsBtn;
let whiteboardCleanBtn;
let whiteboardSaveBtn;
let whiteboardEraserBtn;
let isWhiteboardVisible = false;
let canvas;
let ctx;
// whiteboard settings
let isDrawing = 0;
let x = 0;
let y = 0;
let color = '#000000';
let drawsize = 3;
// room actions btns
let muteEveryoneBtn;
let hideEveryoneBtn;
let lockUnlockRoomBtn;
// file transfer settings
let fileToSend;
let fileReader;
let receiveBuffer = [];
let receivedSize = 0;
let incomingFileInfo;
let incomingFileData;
let sendFileDiv;
let sendFileInfo;
let sendProgress;
let sendAbortBtn;
let sendInProgress = false;
// MTU 1kb to prevent drop.
// const chunkSize = 1024;
const chunkSize = 1024 * 16; // 16kb/s
// video URL player
let videoUrlCont;
let videoUrlHeader;
let videoUrlCloseBtn;
let videoUrlIframe;
// game player
let gameCont;
let gameHeader;
let gameCloseBtn;
let gameIframe;

/**
 * Load all Html elements by Id
 */
function getHtmlElementsById() {
    // my video
    myVideo = getId('myVideo');
    myVideoWrap = getId('myVideoWrap');
    myVideoAvatarImage = getId('myVideoAvatarImage');
    // buttons Bar
    buttonsBar = getId('buttonsBar');
    shareRoomBtn = getId('shareRoomBtn');
    audioBtn = getId('audioBtn');
    videoBtn = getId('videoBtn');
    swapCameraBtn = getId('swapCameraBtn');
    screenShareBtn = getId('screenShareBtn');
    recordStreamBtn = getId('recordStreamBtn');
    fullScreenBtn = getId('fullScreenBtn');
    chatRoomBtn = getId('chatRoomBtn');
    whiteboardBtn = getId('whiteboardBtn');
    shareFileBtn = getId('shareFileBtn');
    gameBtn = getId('gameBtn');
    raiseHandBtn = getId('raiseHandBtn');
    showSettingBtn = getId('showSettingBtn');
    aboutBtn = getId('aboutBtn');
    // leaveRoomBtn = getId('leaveRoomBtn');
    // chat Room elements
    msgerDraggable = getId('msgerDraggable');
    msgerHeader = getId('msgerHeader');
    msgerTheme = getId('msgerTheme');
    msgerCPBtn = getId('msgerCPBtn');
    msgerClean = getId('msgerClean');
    msgerSaveBtn = getId('msgerSaveBtn');
    msgerClose = getId('msgerClose');
    msgerChat = getId('msgerChat');
    msgerEmojiBtn = getId('msgerEmojiBtn');
    msgerInput = getId('msgerInput');
    msgerSendBtn = getId('msgerSendBtn');
    // chat room connected peers
    msgerCP = getId('msgerCP');
    msgerCPHeader = getId('msgerCPHeader');
    msgerCPCloseBtn = getId('msgerCPCloseBtn');
    msgerCPList = getId('msgerCPList');
    // chat room emoji picker
    msgerEmojiPicker = getId('msgerEmojiPicker');
    emojiPicker = getSl('emoji-picker');
    // my settings
    mySettings = getId('mySettings');
    mySettingsHeader = getId('mySettingsHeader');
    tabDevicesBtn = getId('tabDevicesBtn');
    tabBandwidthBtn = getId('tabBandwidthBtn');
    tabRoomBtn = getId('tabRoomBtn');
    mySettingsCloseBtn = getId('mySettingsCloseBtn');
    myPeerNameSet = getId('myPeerNameSet');
    myPeerNameSetBtn = getId('myPeerNameSetBtn');
    audioInputSelect = getId('audioSource');
    audioOutputSelect = getId('audioOutput');
    videoSelect = getId('videoSource');
    videoQualitySelect = getId('videoQuality');
    videoFpsSelect = getId('videoFps');
    screenFpsSelect = getId('screenFps');
    themeSelect = getId('ShuffleTheme');
    btnsBarSelect = getId('ShuffleBtnsBar');
    // my conference name, hand, video - audio status
    myVideoParagraph = getId('myVideoParagraph');
    myVideoStatusIcon = getId('videoBtn');
    myAudioStatusIcon = getId('audioBtn');
    // my whiteboard
    whiteboardCont = getSl('.whiteboard-cont');
    whiteboardHeader = getSl('.colors-cont');
    whiteboardCloseBtn = getId('whiteboardCloseBtn');
    whiteboardFsBtn = getId('whiteboardFsBtn');
    whiteboardColorPicker = getId('whiteboardColorPicker');
    whiteboardSaveBtn = getId('whiteboardSaveBtn');
    whiteboardEraserBtn = getId('whiteboardEraserBtn');
    whiteboardCleanBtn = getId('whiteboardCleanBtn');
    canvas = getId('whiteboard');
    ctx = canvas.getContext('2d');
    // room actions buttons
    muteEveryoneBtn = getId('muteEveryoneBtn');
    hideEveryoneBtn = getId('hideEveryoneBtn');
    lockUnlockRoomBtn = getId('lockUnlockRoomBtn');
    // file send progress
    sendFileDiv = getId('sendFileDiv');
    sendFileInfo = getId('sendFileInfo');
    sendProgress = getId('sendProgress');
    sendAbortBtn = getId('sendAbortBtn');
    // video url player
    videoUrlCont = getId('videoUrlCont');
    videoUrlHeader = getId('videoUrlHeader');
    videoUrlCloseBtn = getId('videoUrlCloseBtn');
    videoUrlIframe = getId('videoUrlIframe');
    // game player
    gameCont = getId('gameCont');
    gameHeader = getId('gameHeader');
    gameCloseBtn = getId('gameCloseBtn');
    gameIframe = getId('gameIframe');
}

/**
 * Using tippy aka very nice tooltip!
 * https://atomiks.github.io/tippyjs/
 */
function setButtonsTitle() {
    // not need for mobile
    if (isMobileDevice) return;

    // left buttons
    tippy(shareRoomBtn, {
        content: 'Invite people to join',
        placement: 'right-start',
    });
    tippy(screenShareBtn, {
        content: 'START screen sharing',
        placement: 'right-start',
    });
    tippy(recordStreamBtn, {
        content: 'START recording',
        placement: 'right-start',
    });
    tippy(fullScreenBtn, {
        content: 'VIEW full screen',
        placement: 'right-start',
    });
    tippy(chatRoomBtn, {
        content: 'OPEN the chat',
        placement: 'right-start',
    });
    tippy(raiseHandBtn, {
        content: 'RAISE your hand',
        placement: 'right-start',
    });
    tippy(whiteboardBtn, {
        content: 'OPEN the whiteboard',
        placement: 'right-start',
    });
    tippy(shareFileBtn, {
        content: 'SHARE the file',
        placement: 'right-start',
    });
    tippy(gameBtn, {
        content: 'START a game',
        placement: 'right-start',
    });
    tippy(showSettingBtn, {
        content: 'Show settings',
        placement: 'right-start',
    });
    tippy(aboutBtn, {
        content: 'Show about',
        placement: 'right-start',
    });
    // chat room buttons
    tippy(msgerTheme, {
        content: 'Ghost theme',
    });
    tippy(msgerCPBtn, {
        content: 'Private messages',
    });
    tippy(msgerClean, {
        content: 'Clean messages',
    });
    tippy(msgerSaveBtn, {
        content: 'Save messages',
    });
    tippy(msgerClose, {
        content: 'Close the chat',
    });
    tippy(msgerEmojiBtn, {
        content: 'Emoji',
    });
    tippy(msgerSendBtn, {
        content: 'Send',
    });

    // settings
    tippy(mySettingsCloseBtn, {
        content: 'Close settings',
    });
    tippy(myPeerNameSetBtn, {
        content: 'Change name',
    });

    // whiteboard btns
    tippy(whiteboardCloseBtn, {
        content: 'CLOSE the whiteboard',
        placement: 'bottom',
    });
    tippy(whiteboardFsBtn, {
        content: 'VIEW full screen',
        placement: 'bottom',
    });
    tippy(whiteboardColorPicker, {
        content: 'COLOR picker',
        placement: 'bottom',
    });
    tippy(whiteboardSaveBtn, {
        content: 'SAVE the board',
        placement: 'bottom',
    });
    tippy(whiteboardEraserBtn, {
        content: 'ERASE the board',
        placement: 'bottom',
    });
    tippy(whiteboardCleanBtn, {
        content: 'CLEAN the board',
        placement: 'bottom',
    });

    // room actions btn
    tippy(muteEveryoneBtn, {
        content: 'MUTE everyone except yourself',
        placement: 'top',
    });
    tippy(hideEveryoneBtn, {
        content: 'HIDE everyone except yourself',
        placement: 'top',
    });

    // Suspend File transfer btn
    tippy(sendAbortBtn, {
        content: 'ABORT file transfer',
        placement: 'right-start',
    });

    // video URL player
    tippy(videoUrlCloseBtn, {
        content: 'Close the videoPlayer',
    });
    tippy(msgerVideoUrlBtn, {
        content: 'Share YouTube video to all participants',
    });

    // game player
    tippy(gameCloseBtn, {
        content: 'Close the game',
    });
}

/**
 * Get peer info using DetecRTC
 * https://github.com/muaz-khan/DetectRTC
 * @return Obj peer info
 */
function getPeerInfo() {
    return {
        detectRTCversion: DetectRTC.version,
        isWebRTCSupported: DetectRTC.isWebRTCSupported,
        isMobileDevice: DetectRTC.isMobileDevice,
        osName: DetectRTC.osName,
        osVersion: DetectRTC.osVersion,
        browserName: DetectRTC.browser.name,
        browserVersion: DetectRTC.browser.version,
    };
}

/**
 * Get approximative peer geolocation
 * @return json
 */
function getPeerGeoLocation() {
    fetch(peerLoockupUrl)
        .then((res) => res.json())
        .then((outJson) => {
            peerGeo = outJson;
        })
        .catch((err) => console.error(err));
}

/**
 * Get Signaling server URL
 * @return Signaling server URL
 */
function getSignalingServer() {
    if (isHttps) {
        return 'https://' + 'localhost' + ':' + signalingServerPort;
        // outside of localhost change it with YOUR-SERVER-DOMAIN
    }
    return (
        'http' +
        (location.hostname == 'localhost' ? '' : 's') +
        '://' +
        location.hostname +
        (location.hostname == 'localhost' ? ':' + signalingServerPort : '')
    );
}

/**
 * Generate random Room id
 * @return Room Id
 */
function getRoomId() {
    // skip /join/
    // let roomId = location.pathname.substring(6);
    const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
    var roomId = getLastItem(location.pathname);
    roomId = roomId.replace('__', ' ');
    // if not specified room id, create one random
    /* if (roomId == '') {
        roomId = makeId(12);
        roomId = roomId.replace('__', '');
        const newurl = signalingServer + '/join/' + roomId;
        window.history.pushState({ url: newurl }, roomId, newurl);
    } */
    return roomId;
}

/**
 * Generate random Id
 * @param {*} length
 * @returns random id
 */
function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Check if there is peer connections
 * @return true, false otherwise
 */
function thereIsPeerConnections() {
    if (Object.keys(peerConnections).length === 0) return false;
    return true;
}

/**
 * On body load Get started
 */
function initClientPeer() {
    setTheme(ShuffleTheme);

    if (!isWebRTCSupported) {
        userLog('error', 'This browser seems not supported WebRTC!');
        return;
    }

    console.log('Connecting to signaling server');
    signalingSocket = io(signalingServer);

    // on receiving data from signaling server...
    signalingSocket.on('connect', handleConnect);
    signalingSocket.on('roomIsLocked', handleRoomLocked);
    signalingSocket.on('roomStatus', handleRoomStatus);
    signalingSocket.on('addPeer', handleAddPeer);
    signalingSocket.on('sessionDescription', handleSessionDescription);
    signalingSocket.on('iceCandidate', handleIceCandidate);
    signalingSocket.on('peerName', handlePeerName);
    signalingSocket.on('peerStatus', handlePeerStatus);
    signalingSocket.on('peerAction', handlePeerAction);
    signalingSocket.on('wb', handleWhiteboard);
    signalingSocket.on('kickOut', handleKickedOut);
    signalingSocket.on('fileInfo', handleFileInfo);
    signalingSocket.on('fileAbort', handleFileAbort);
    signalingSocket.on('videoPlayer', handleVideoPlayer);
    signalingSocket.on('disconnect', handleDisconnect);
    signalingSocket.on('removePeer', handleRemovePeer);

    // locked function
    signalingSocket.on('acceptResult', handleAcceptResult);

} // end [initClientPeer]

/**
 * Send async data to signaling server (server.js)
 * @param {*} msg msg to send to signaling server
 * @param {*} config JSON data to send to signaling server
 */
async function sendToServer(msg, config = {}) {
    await signalingSocket.emit(msg, config);
}

/**
 * Connected to Signaling Server. Once the user has given us access to their
 * microphone/cam, join the channel and start peering up
 */
function handleConnect() {
    console.log('Connected to signaling server');
    if (localMediaStream) joinToChannel();
    else
        setupLocalMedia(() => {
            whoAreYou();
        });
}

/**
 * set your name for the conference
 */
function whoAreYou() {
    // playSound('newMessage');

    const nameWrapper = document.createElement('div');
    nameWrapper.className = "enter-name-wrap";

    const prevCameraWrap = document.createElement('div');
    prevCameraWrap.setAttribute('id', 'previewCamera');

    prevVideo = document.getElementById('prevVideo');
    attachMediaStream(prevVideo, localMediaStream);

    prevCameraWrap.appendChild(prevVideo);

    const vBtn = document.createElement('div');
    vBtn.className = 'fas fa-video';
    vBtn.innerHTML = '<img src="/images/ico_small_camera.png" style="width:18px;height:12px;"/>';
    vBtn.setAttribute('id', 'initVideoButton');

    const mBtn = document.createElement('div');
    mBtn.className = 'fas fa-microphone';
    mBtn.innerHTML = '<img src="/images/ico_small_mic.png" style="width:17px;height:16px;" />';
    mBtn.setAttribute('id', 'initAudioButton');

    prevCameraWrap.appendChild(vBtn);
    prevCameraWrap.appendChild(mBtn);

    const readH2 = document.createElement('h2');
    readH2.innerHTML = 'Ready to join?';

    const userName = document.getElementById('userinfo').value;

    const yourNameInput = document.createElement('input');
    yourNameInput.setAttribute('type', 'text');
    yourNameInput.setAttribute('id', 'yourName');
    yourNameInput.setAttribute('name', 'yourName');
    yourNameInput.setAttribute('value', userName);
    yourNameInput.setAttribute('placeholder', 'Enter a Display Name');
    yourNameInput.setAttribute('require', true);

    nameWrapper.appendChild(prevCameraWrap);
    nameWrapper.appendChild(readH2);
    nameWrapper.appendChild(yourNameInput);

    var footerSection = '';
    if( document.getElementById('userinfo').value == '' ) {
        footerSection = '<p>Hava an account? <a href="/login?room=' + roomId + '" id="askLogin">Log In</a>';
    }

    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        position: 'center',
        footer: footerSection,
        html: nameWrapper,
        confirmButtonText: `Enter Meeting`,
        customClass: {
            container: 'whoareyou-container',
            confirmButton: 'join-meeting-btn',
            footer: 'footer-custom',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
        preConfirm: function() {
            if (document.getElementById('yourName').value == '') {
                Swal.showValidationMessage('Please enter your name');
                return false;
            }
            myPeerName = document.getElementById('yourName').value;
            document.getElementById('joinName').innerHTML = myPeerName;

            var bgColor = backColor[Math.floor(Math.random() * 7)];
            var avartarImg = 'https://eu.ui-avatars.com/api?name=' + myPeerName + '&size=40&background=e2fcee&color=00ab53&rounded=false';
            if( document.getElementById('usericon').value != '' )
                avartarImg = document.getElementById('usericon').value;

            myPeerImage = avartarImg;

            // Add meeting participants to sidebar
            let newParticipantHTML;
            if( document.getElementById('isCreator').value != '' ) {
                newParticipantHTML = '<div class="memparty-item"><div>'
                    + '<img class="memparty-img" src="' + avartarImg + '">'
                    + '<div class="memparty-name">' + myPeerName + '</div></div>'
                    + '<div>'
                    + '<button id="localAudioOption"><img src="/images/ico_small_mic2.svg" /></button>'
                    + '<button id="localCameraOption"><img src="/images/ico_small_camera2.svg" /></button>'
                    + '</div></div>';
            } else {
                newParticipantHTML = '<div class="memparty-item"><div>'
                    + '<img class="memparty-img" src="' + avartarImg + '">'
                    + '<div class="memparty-name">' + myPeerName + '</div></div>'
                    + '<div></div></div>';
            }

            document.getElementById('memParticipantList').innerHTML = newParticipantHTML;
        },
    }).then(() => {
        myVideoWrap.style.display = 'inline';
        logStreamSettingsInfo('localMediaStream', localMediaStream);
        attachMediaStream(myVideo, localMediaStream);
        resizeVideos();

        myPeerName = myPeerName;
        myPeerImage = myPeerImage;
        myVideoParagraph.innerHTML = myPeerName;
        setPeerAvatarImgName('myVideoAvatarImage', myPeerImage);
        setPeerChatAvatarImgName('right', myPeerName);
        joinToChannel();

        welcomeUser();
    });

    if (isMobileDevice) return;

    initAudioBtn = getId('initAudioBtn');
    initVideoBtn = getId('initVideoBtn');

    tippy(initAudioBtn, {
        content: 'Click to audio OFF',
        placement: 'top',
    });
    tippy(initVideoBtn, {
        content: 'Click to video OFF',
        placement: 'top',
    });
}

/**
 * join to chennel and send some peer info
 */
function joinToChannel() {
    console.log('join to channel', roomId);
    sendToServer('join', {
        channel: roomId,
        peer_info: peerInfo,
        peer_geo: peerGeo,
        peer_name: myPeerName,
        peer_video: myVideoStatus,
        peer_audio: myAudioStatus,
        peer_hand: myHandStatus,
        peer_rec: isRecScreenSream,
        peer_icon: document.getElementById('usericon').value,
    });
}

/**
 * welcome message
 */
function welcomeUser() {
    const myRoomUrl = window.location.toString();

    $('.RoomLogoStatus').show();

    $('#inviteLink').html(myRoomUrl);
    if( $('#userinfo').val() != '' )
        $('.invite-people-wrap').fadeIn();
    else
        $('#memparty-invite-btn').hide();

    if( document.getElementById('isCreator').value != '' && document.getElementById('plantype').value == '1' ) {
        overTime = 0;
        timeMonitorInterval = window.setInterval(getLimitStatus, 300000);
    }
}

// Monitor free user : limit time
function getLimitStatus() {
    var memCount = getMemberCount();
    overTime += 5;
    console.log(overTime + ' --- ' + memCount);
    if( memCount > 2 && overTime == 40 ) {
        Swal.fire({
            background: swalBackground,
            position: 'center',
            html:
                `
                <br/> 
                <div class='accept-image'>
                    <img src='` + document.getElementById('usericon').value + `' />
                </div>
                <div>
                    <h2>Free tier 5 minute warning!</h2>
                    <p>You have 5 minutes remaining in your free tier limit on meetings with 3 or more people. Upgrade to premium for no call limits.</p>
                </div>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Close`,
            denyButtonText: `Upgrade to Premium`,
            customClass: {
                container: 'accept-container',
                popup: 'accept-popup',
                htmlContainer: 'accept-text',
                confirmButton: 'accept-confirm-btn',
                denyButton: 'accept-deny-btn',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.close();
            } else if (result.isDenied) {
                window.location.href = '/payment?from=1';
            }
        });
    }

    if( memCount > 2 && overTime >= 45 ) {
        clearInterval(timeMonitorInterval);
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            position: 'center',
            html:
                `
                <br/> 
                <div>
                    <h2>Free call limit reached</h2>
                    <p>Thank you for using Shuffle! Free users are limited to 45-minutes calls on meetings with 3 or more participants.</p>
                    <p>Looking for a better Shuffle experience? Use the discount code below for 50% off Shuffle Premium.</p>
                    <div class="code-section">Code : extendmeetings</div>
                </div>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Upgrade to Shuffle Premium`,
            denyButtonText: `Back Home`,
            customClass: {
                container: 'limit-container',
                popup: 'accept-popup',
                htmlContainer: 'accept-text',
                confirmButton: 'accept-confirm-btn',
                denyButton: 'accept-deny-btn',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/payment?from=1';
            } else if (result.isDenied) {
                // $.ajax({
                //     url: '/api/auth/updateopen',
                //     method: 'post',
                //     data: {isOpen: false},
                //     success: function(result) {
                //         window.location.href = '/';
                //     }
                // });
                window.location.href = '/';
            }
        });

        var idx = 0;
        for( idx=0; idx<mainPeerId.length; idx++ ) {
            sendToServer('kickOut', {
                room_id: roomId,
                peer_id: mainPeerId[idx],
                peer_name: '',
            });
        }
    }
}

/**
 * When we join a group, our signaling server will send out 'addPeer' events to each pair of users in the group (creating a fully-connected graph of users,
 * ie if there are 6 people in the channel you will connect directly to the other 5, so there will be a total of 15 connections in the network).
 *
 * @param {*} config
 */
function handleAddPeer(config) {
    // console.log("addPeer", JSON.stringify(config));

    let peer_id = config.peer_id;
    let peers = config.peers;
    let should_create_offer = config.should_create_offer;
    let iceServers = config.iceServers;

    if (peer_id in peerConnections) {
        // This could happen if the user joins multiple channels where the other peer is also in.
        console.log('Already connected to peer', peer_id);
        return;
    }

    if( document.getElementById('isLocked').value == 'true' ) {
        if( document.getElementById('isCreator').value != '' ) {
            Swal.fire({
                background: swalBackground,
                position: 'center',
                html:
                    `
                    <br/> 
                    <div class='accept-image'>
                        <img src='` + peers[peer_id].peer_icon + `' />
                    </div>
                    <div>
                        <h2>` + peers[peer_id].peer_name + ` wants to enter the meeting</h2>
                        <p>Your meeting room is locked, click below to allow him to enter the room</p>
                    </div>`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Admit`,
                denyButtonText: `Reject`,
                customClass: {
                    container: 'accept-container',
                    popup: 'accept-popup',
                    htmlContainer: 'accept-text',
                    confirmButton: 'accept-confirm-btn',
                    denyButton: 'accept-deny-btn',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    sendToServer('requestJoin', {
                        peer_id: peer_id,
                        peers: peers,
                        should_create_offer: should_create_offer,
                        iceServers: iceServers,
                        accpet: true,
                    });
                } else if (result.isDenied) {
                    sendToServer('requestJoin', {
                        peer_id: peer_id,
                        peers: peers,
                        should_create_offer: should_create_offer,
                        iceServers: iceServers,
                        accept: false,
                    });
                }
            });
        } else {
            if (should_create_offer) getId('waitingBg').style.display = 'block';
        }
    }
    if (!iceServers) iceServers = backupIceServers;
    console.log('iceServers', iceServers[0]);

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
    peerConnection = new RTCPeerConnection({ iceServers: iceServers });
    peerConnections[peer_id] = peerConnection;

    msgerAddPeers(peers);
    handleOnIceCandidate(peer_id);
    handleOnTrack(peer_id, peers);
    handleAddTracks(peer_id);
    handleRTCDataChannels(peer_id, peers[peer_id].peer_icon);
    if (should_create_offer) handleRtcOffer(peer_id);

    // playSound('addPeer');
}

/**
 * when accepted
 */
 function handleAcceptResult(config) {
    // let peer_id = config.peer_id;
    // let peers = config.peers;
    // let should_create_offer = config.should_create_offer;
    // let iceServers = config.iceServers;

    let accept_result = config.accept_result;
    if( accept_result ) {
        getId('waitingBg').style.display = 'none';
        getId('waitingDiv').style.display = 'none';
        /* if (!iceServers) iceServers = backupIceServers;
        console.log('iceServers', iceServers[0]);

        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
        peerConnection = new RTCPeerConnection({ iceServers: iceServers });
        peerConnections[peer_id] = peerConnection;

        msgerAddPeers(peers);
        handleOnIceCandidate(peer_id);
        handleOnTrack(peer_id, peers);
        handleAddTracks(peer_id);
        handleRTCDataChannels(peer_id);
        if (should_create_offer) handleRtcOffer(peer_id);

        playSound('addPeer'); */
    } else {
        window.location.href = '/';
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
 *
 * @param {*} peer_id
 */
function handleOnIceCandidate(peer_id) {
    peerConnections[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return;
        sendToServer('relayICE', {
            peer_id: peer_id,
            ice_candidate: {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
            },
        });
    };
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
 *
 * @param {*} peer_id
 * @param {*} peers
 */
function handleOnTrack(peer_id, peers) {
    peerConnections[peer_id].ontrack = (event) => {
        console.log('handleOnTrack', event);
        if (event.track.kind === 'video') {
            loadRemoteMediaStream(event.streams[0], peers, peer_id);
        }
    };
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack
 *
 * @param {*} peer_id
 */
function handleAddTracks(peer_id) {
    localMediaStream.getTracks().forEach((track) => {
        peerConnections[peer_id].addTrack(track, localMediaStream);
    });
}

/**
 * Secure RTC Data Channel
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ondatachannel
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel/onmessage
 *
 * @param {*} peer_id
 */
function handleRTCDataChannels(peer_id, peer_icon) {
    peerConnections[peer_id].ondatachannel = (event) => {
        // console.log('handle ' + peerConnections[peer_id]);
        // console.log('handleRTCDataChannels ' + peer_id, event);
        event.channel.onmessage = (msg) => {
            console.log(msg);
            switch (event.channel.label) {
                case 'Shuffle_chat_channel':
                    try {
                        let dataMessage = JSON.parse(msg.data);
                        handleDataChannelChat(dataMessage, peer_icon);
                    } catch (err) {
                        console.error('handleDataChannelChat', err);
                    }
                    break;
                case 'Shuffle_file_sharing_channel':
                    try {
                        let dataFile = msg.data;
                        handleDataChannelFileSharing(dataFile);
                    } catch (err) {
                        console.error('handleDataChannelFS', err);
                    }
                    break;
            }
        };
    };
    createChatDataChannel(peer_id);
    createFileSharingDataChannel(peer_id);
}

/**
 * Only one side of the peer connection should create the offer, the signaling server picks one to be the offerer.
 * The other user will get a 'sessionDescription' event and will create an offer, then send back an answer 'sessionDescription' to us
 *
 * @param {*} peer_id
 */
function handleRtcOffer(peer_id) {
    console.log('Creating RTC offer to', peer_id);
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    peerConnections[peer_id]
        .createOffer()
        .then((local_description) => {
            console.log('Local offer description is', local_description);
            // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
            peerConnections[peer_id]
                .setLocalDescription(local_description)
                .then(() => {
                    sendToServer('relaySDP', {
                        peer_id: peer_id,
                        session_description: local_description,
                    });
                    console.log('Offer setLocalDescription done!');
                })
                .catch((err) => {
                    console.error('[Error] offer setLocalDescription', err);
                    userLog('error', 'Offer setLocalDescription failed ' + err);
                });
        })
        .catch((err) => {
            console.error('[Error] sending offer', err);
        });
}

/**
 * Peers exchange session descriptions which contains information about their audio / video settings and that sort of stuff. First
 * the 'offerer' sends a description to the 'answerer' (with type "offer"), then the answerer sends one back (with type "answer").
 *
 * @param {*} config
 */
function handleSessionDescription(config) {
    console.log('Remote Session Description', config);

    let peer_id = config.peer_id;
    let remote_description = config.session_description;

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
    let description = new RTCSessionDescription(remote_description);

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
    peerConnections[peer_id]
        .setRemoteDescription(description)
        .then(() => {
            console.log('setRemoteDescription done!');
            if (remote_description.type == 'offer') {
                console.log('Creating answer');
                // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
                peerConnections[peer_id]
                    .createAnswer()
                    .then((local_description) => {
                        console.log('Answer description is: ', local_description);
                        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
                        peerConnections[peer_id]
                            .setLocalDescription(local_description)
                            .then(() => {
                                sendToServer('relaySDP', {
                                    peer_id: peer_id,
                                    session_description: local_description,
                                });
                                console.log('Answer setLocalDescription done!');
                            })
                            .catch((err) => {
                                console.error('[Error] answer setLocalDescription', err);
                                userLog('error', 'Answer setLocalDescription failed ' + err);
                            });
                    })
                    .catch((err) => {
                        console.error('[Error] creating answer', err);
                    });
            } // end [if type offer]
        })
        .catch((err) => {
            console.error('[Error] setRemoteDescription', err);
        });
}

/**
 * The offerer will send a number of ICE Candidate blobs to the answerer so they
 * can begin trying to find the best path to one another on the net.
 *
 * @param {*} config
 */
function handleIceCandidate(config) {
    let peer_id = config.peer_id;
    let ice_candidate = config.ice_candidate;
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate
    peerConnections[peer_id].addIceCandidate(new RTCIceCandidate(ice_candidate)).catch((err) => {
        console.error('[Error] addIceCandidate', err);
    });
}

/**
 * Disconnected from Signaling Server. Tear down all of our peer connections
 * and remove all the media divs when we disconnect from signaling server
 */
function handleDisconnect() {
    console.log('Disconnected from signaling server');
    for (let peer_id in peerMediaElements) {
        document.getElementById('videoMediaContainer').removeChild(peerMediaElements[peer_id].parentNode);
        document.getElementById('countMember').innerHTML = getMemberCount() + '/100';
        // document.getElementById('meetingPartyCount').innerHTML = getMemberCount();
        document.getElementById('meetPartyCount').innerHTML = getMemberCount();
        var elem = document.getElementById(peer_id + '_memPartyItem');
        elem.parentNode.removeChild(elem);
        resizeVideos();
    }
    for (let peer_id in peerConnections) {
        peerConnections[peer_id].close();
        msgerRemovePeer(peer_id);
    }
    chatDataChannels = {};
    fileDataChannels = {};
    peerConnections = {};
    peerMediaElements = {};
}

/**
 * When a user leaves a channel (or is disconnected from the signaling server) everyone will recieve a 'removePeer' message
 * telling them to trash the media channels they have open for those that peer. If it was this client that left a channel,
 * they'll also receive the removePeers. If this client was disconnected, they wont receive removePeers, but rather the
 * signaling_socket.on('disconnect') code will kick in and tear down all the peer sessions.
 *
 * @param {*} config
 */
function handleRemovePeer(config) {
    console.log('Signaling server said to remove peer:', config);

    let peer_id = config.peer_id;

    if (peer_id in peerMediaElements) {
        document.getElementById('videoMediaContainer').removeChild(peerMediaElements[peer_id].parentNode);
        document.getElementById('countMember').innerHTML = getMemberCount() + '/100';
        // document.getElementById('meetingPartyCount').innerHTML = getMemberCount();
        document.getElementById('meetPartyCount').innerHTML = getMemberCount();
        var elem = document.getElementById(peer_id + '_memPartyItem');
        elem.parentNode.removeChild(elem);
        resizeVideos();
    }
    if (peer_id in peerConnections) peerConnections[peer_id].close();

    msgerRemovePeer(peer_id);

    delete chatDataChannels[peer_id];
    delete fileDataChannels[peer_id];
    delete peerConnections[peer_id];
    delete peerMediaElements[peer_id];

    // playSound('removePeer');
}

/**
 * Set Shuffle theme neon | dark | forest | sky | ghost | ...
 * @param {*} theme
 */
function setTheme(theme) {
    if (!theme) return;

    ShuffleTheme = theme;
    switch (ShuffleTheme) {
        case 'neon':
            // neon theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(to left, #383838, #000000)');
            document.documentElement.style.setProperty(
                '--msger-private-bg',
                'linear-gradient(to left, #383838, #000000)',
            );
            break;
        case 'dark':
            // dark theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', '#16171b');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(to left, #383838, #000000)');
            document.documentElement.style.setProperty(
                '--msger-private-bg',
                'linear-gradient(to left, #383838, #000000)',
            );
            document.documentElement.style.setProperty('--left-msg-bg', '#222328');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#0a0b0c');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #0a0b0c, -3px -3px 6px #222328');
            break;
        case 'forest':
            // forest theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(to left, #383838, #000000)');
            document.documentElement.style.setProperty(
                '--msger-private-bg',
                'linear-gradient(to left, #383838, #000000)',
            );
            document.documentElement.style.setProperty('--left-msg-bg', '#2e3500');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#004b1c');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #27944f, -3px -3px 6px #14843d');
            break;
        case 'sky':
            // sky theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(to left, #383838, #000000)');
            document.documentElement.style.setProperty(
                '--msger-private-bg',
                'linear-gradient(to left, #383838, #000000)',
            );
            document.documentElement.style.setProperty('--left-msg-bg', '#0c95b7');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#012a5f');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--my-settings-label-color', '#03a5ce');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #03a5ce, -3px -3px 6px #03a5ce');
            break;
        case 'ghost':
            // ghost theme
            swalBackground = 'rgba(0, 0, 0, 0.150)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty(
                '--msger-bg',
                'linear-gradient(to left, transparent, rgba(0, 0, 0, 0.7))',
            );
            document.documentElement.style.setProperty(
                '--msger-private-bg',
                'linear-gradient(to left, #383838, #000000)',
            );
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btns-left', '5px');
            document.documentElement.style.setProperty('--btn-opc', '0.7');
            document.documentElement.style.setProperty('--box-shadow', '0px');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--left-msg-bg', 'rgba(0, 0, 0, 0.7)');
            document.documentElement.style.setProperty('--private-msg-bg', 'rgba(252, 110, 110, 0.7)');
            document.documentElement.style.setProperty('--right-msg-bg', 'rgba(0, 0, 0, 0.7)');
            break;
        // ...
        default:
            console.log('No theme found');
    }

    // setButtonsBarPosition(ShuffleBtnsBar);
}

/**
 * Set buttons bar position
 * @param {*} position vertical / horizontal
 */
function setButtonsBarPosition(position) {
    if (!position || isMobileDevice) return;

    ShuffleBtnsBar = position;
    switch (ShuffleBtnsBar) {
        case 'vertical':
            let btnsLeft = ShuffleTheme === 'ghost' ? '5px' : '20px';
            document.documentElement.style.setProperty('--btns-top', '50%');
            document.documentElement.style.setProperty('--btns-right', '0px');
            document.documentElement.style.setProperty('--btns-left', btnsLeft);
            document.documentElement.style.setProperty('--btns-margin-left', '0px');
            document.documentElement.style.setProperty('--btns-width', '40px');
            document.documentElement.style.setProperty('--btns-flex-direction', 'column');
            break;
        case 'horizontal':
            document.documentElement.style.setProperty('--btns-top', '95%');
            document.documentElement.style.setProperty('--btns-right', '25%');
            document.documentElement.style.setProperty('--btns-left', '50%');
            document.documentElement.style.setProperty('--btns-margin-left', '-300px');
            document.documentElement.style.setProperty('--btns-width', '600px');
            document.documentElement.style.setProperty('--btns-flex-direction', 'row');
            break;
        default:
            console.log('No position found');
    }
}

/**
 * Setup local media stuff. Ask user for permission to use the computers microphone and/or camera,
 * attach it to an <audio> or <video> tag if they give us access.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * @param {*} callback
 * @param {*} errorback
 */
function setupLocalMedia(callback, errorback) {
    // if we've already been initialized do nothing
    if (localMediaStream != null) {
        if (callback) callback();
        return;
    }

    getPeerGeoLocation();

    console.log('Requesting access to local audio / video inputs');

    // default | qvgaVideo | vgaVideo | hdVideo | fhdVideo | 4kVideo |
    let videoConstraints =
        myBrowserName === 'Firefox' ? getVideoConstraints('useVideo') : getVideoConstraints('default');

    const constraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
        video: videoConstraints,
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            loadLocalMedia(stream);
            if (callback) callback();
        })
        .catch((err) => {
            // https://blog.addpipe.com/common-getusermedia-errors/
            console.error('Access denied for audio/video', err);
            // playSound('error');
            window.location.href = `/permission?roomId=${roomId}&getUserMediaError=${err.toString()}`;
            if (errorback) errorback();
        });
} // end [setup_local_stream]

/**
 * Load Local Media Stream obj
 * @param {*} stream
 */
function loadLocalMedia(stream) {
    console.log('Access granted to audio/video');
    // hide loading div
    getId('loadingBg').style.display = 'none';
    getId('loadingDiv').style.display = 'none';

    localMediaStream = stream;

    // local video elemets
    const videoWrap = document.createElement('div');
    const localMedia = document.createElement('video');

    // handle my peer name video audio status
    const myStatusMenu = document.createElement('div');
    const myVideoParagraph = document.createElement('h4');

    const subCtrlWrapper = document.createElement('div');

    const myVideoStatusIcon1 = document.createElement('button');
    const myAudioStatusIcon1 = document.createElement('button');
    const myVideoFullScreenBtn = document.createElement('button');
    const myVideoAvatarImage = document.createElement('img');

    const myVideoLayoutType = document.createElement('button');
    const myVideoLayoutImg = document.createElement('img');

    // menu Status
    myStatusMenu.setAttribute('id', 'myStatusMenu');
    myStatusMenu.className = 'statusMenu';

    // my peer name
    myVideoParagraph.setAttribute('id', 'myVideoParagraph');
    myVideoParagraph.className = 'videoPeerName';
    /* tippy(myVideoParagraph, { 
        content: 'My name',
    }); */

    // scren layout button
    myVideoLayoutType.setAttribute('id', 'myVideoLayoutType');
    myVideoLayoutType.className = 'video-layout';
    // screen layout icon
    myVideoLayoutImg.src = '/images/ico_screen2.svg';
    myVideoLayoutImg.alt = "Focused";
    myVideoLayoutType.appendChild(myVideoLayoutImg);
    
    // my video status element
    myVideoStatusIcon1.setAttribute('id', 'videoBtn');
    myVideoStatusIcon1.className = 'fas fa-video';
    /* tippy(myVideoStatusIcon, {
        content: 'My video is ON',
    }); */
    // my audio status element

    myAudioStatusIcon1.setAttribute('id', 'audioBtn');
    myAudioStatusIcon1.className = 'fas fa-microphone';
    /* tippy(myAudioStatusIcon, {
        content: 'My audio is ON',
    }); */
    // my video full screen mode
    myVideoFullScreenBtn.setAttribute('id', 'myVideoFullScreenBtn');
    /* myVideoFullScreenBtn.className = 'fas fa-expand';
    tippy(myVideoFullScreenBtn, {
        content: 'Full screen mode',
    }); */
    // my video avatar image
    myVideoAvatarImage.setAttribute('id', 'myVideoAvatarImage');
    myVideoAvatarImage.className = 'videoAvatarImage pulsate';

    // add elements to myStatusMenu div
    myStatusMenu.appendChild(myVideoParagraph);

    subCtrlWrapper.appendChild(myVideoStatusIcon1);
    subCtrlWrapper.appendChild(myAudioStatusIcon1);
    // subCtrlWrapper.appendChild(myVideoFullScreenBtn);

    myStatusMenu.appendChild(subCtrlWrapper);

    localMedia.setAttribute('id', 'myVideo');
    localMedia.setAttribute('playsinline', true);
    localMedia.className = 'mirror';
    localMedia.autoplay = true;
    localMedia.muted = true;
    localMedia.volume = 0;
    localMedia.controls = false;

    videoWrap.className = 'video';
    videoWrap.setAttribute('id', 'myVideoWrap');

    // add elements to video wrap div
    videoWrap.appendChild(myStatusMenu);
    videoWrap.appendChild(myVideoAvatarImage);
    videoWrap.appendChild(localMedia);
    videoWrap.appendChild(myVideoLayoutType);

    document.getElementById('videoMediaContainer').appendChild(videoWrap);
    videoWrap.style.display = 'none';

    getHtmlElementsById();
    setButtonsTitle();
    manageLeftButtons();
    handleBodyOnMouseMove();
    setupMySettings();
    setupVideoUrlPlayer();
    startCountTime();
    document.getElementById("curMeetingName").innerHTML = 'joinshuffle.io/' + getRoomId();
    handleVideoPlayerFs('myVideo', 'myVideoFullScreenBtn');
}

/**
 * Load Remote Media Stream obj
 * @param {*} stream
 * @param {*} peers
 * @param {*} peer_id
 */
function loadRemoteMediaStream(stream, peers, peer_id) {
    // get data from peers obj
    let peer_name = peers[peer_id]['peer_name'];
    let peer_video = peers[peer_id]['peer_video'];
    let peer_audio = peers[peer_id]['peer_audio'];
    let peer_hand = peers[peer_id]['peer_hand'];
    let peer_rec = peers[peer_id]['peer_rec'];
    let peer_icon = peers[peer_id]['peer_icon'];

    if( document.getElementById('isCreator').value != '' ) {
        mainPeerId.push(peer_id);
    }

    remoteMediaStream = stream;

    // remote video elements
    const remoteVideoWrap = document.createElement('div');
    const remoteMedia = document.createElement('video');

    // handle peers name video audio status
    const remoteStatusMenu = document.createElement('div');
    const remoteVideoParagraph = document.createElement('h4');
    /* 
    const remoteHandStatusIcon = document.createElement('button');
    const remoteVideoStatusIcon = document.createElement('button');
    const remoteAudioStatusIcon = document.createElement('button');
    const remotePrivateMsgBtn = document.createElement('button');
    const remoteYoutubeBtnBtn = document.createElement('button');
    const remotePeerKickOut = document.createElement('button');
    // const remoteVideoFullScreenBtn = document.createElement('button');
    */ 
    const remoteVideoAvatarImage = document.createElement('img');

    // const remoteAudioStatusIcon = document.createElement('button');

    // menu Status
    remoteStatusMenu.setAttribute('id', peer_id + '_menuStatus');
    remoteStatusMenu.className = 'statusMenu';

    // remote peer name element
    remoteVideoParagraph.setAttribute('id', peer_id + '_name');
    remoteVideoParagraph.className = 'videoPeerName';
    /* tippy(remoteVideoParagraph, {
        content: 'Participant name',
    }); */
    const peerVideoText = document.createTextNode(peers[peer_id]['peer_name']);
    remoteVideoParagraph.appendChild(peerVideoText);
    // my video avatar image
    remoteVideoAvatarImage.setAttribute('id', peers[peer_id]['peer_icon']);
    remoteVideoAvatarImage.className = 'videoAvatarImage pulsate';

    // add elements to remoteStatusMenu div
    remoteStatusMenu.appendChild(remoteVideoParagraph);

    remoteMedia.setAttribute('id', peer_id + '_video');
    remoteMedia.setAttribute('playsinline', true);
    remoteMedia.mediaGroup = 'remotevideo';
    remoteMedia.autoplay = true;
    isMobileDevice ? (remoteMediaControls = false) : (remoteMediaControls = remoteMediaControls);
    remoteMedia.controls = remoteMediaControls;
    peerMediaElements[peer_id] = remoteMedia;

    remoteVideoWrap.className = 'video';

    // add elements to videoWrap div
    remoteVideoWrap.appendChild(remoteStatusMenu);
    remoteVideoWrap.appendChild(remoteVideoAvatarImage);

    console.log(remoteVideoWrap);

    // document.body.appendChild(remoteVideoWrap);
    document.getElementById('videoMediaContainer').prepend(remoteVideoWrap);

    document.getElementById('countMember').innerHTML = getMemberCount() + '/100';
    // document.getElementById('meetingPartyCount').innerHTML = getMemberCount();
    document.getElementById('meetPartyCount').innerHTML = getMemberCount();


    // Add meeting participants to sidebar
    let newParticipantHTML;
    if( document.getElementById('isCreator').value != '' ) {
        newParticipantHTML = '<div class="memparty-item" id="' + String(peer_id) + '_memPartyItem"><div>'
            + '<img class="memparty-img" src="' + peer_icon + '">'
            + '<div class="memparty-name">' + peer_name + '</div></div>'
            + '<div><button id="' + String(peer_id) + '_kickOut'
            + '"><img src="/images/ico_logout.svg" /></button>'
            + '<button id="' + String(peer_id) + '_audioSideStatus'
            + '" class="audio-on"><img src="/images/ico_small_mic2.svg" /></button>'
            + '<button id="' + String(peer_id) + '_videoSideStatus'
            + '" class="video-on"><img src="/images/ico_small_camera2.svg" /></button>'
            + '</div></div>';
    } else {
        newParticipantHTML = '<div class="memparty-item" id="' + String(peer_id) + '_memPartyItem"><div>'
            + '<img class="memparty-img" src="' + peer_icon + '">'
            + '<div class="memparty-name">' + peer_name + '</div></div>'
            + '<div><button id="' + String(peer_id) + '_kickOut'
            + '"><img src="/images/ico_logout.svg" /></div></div>';
    }

    document.getElementById('memParticipantList').innerHTML += newParticipantHTML;


    // attachMediaStream is a part of the adapter.js library
    attachMediaStream(remoteMedia, remoteMediaStream);

    remoteVideoWrap.appendChild(remoteMedia);

    // resize video elements
    resizeVideos();
    // handle video full screen mode
    handleVideoPlayerFs(peer_id + '_video', peer_id + '_fullScreen', peer_id);
    // handle kick out button event
    handlePeerKickOutBtn(peer_id);
    // refresh remote peers avatar name
    setPeerAvatarImgName(peer_id + '_avatar', peer_icon);
    // refresh remote peers hand icon status and title
    setPeerHandStatus(peer_id, peer_name, peer_hand);
    // refresh remote peers video icon status and title
    setPeerVideoStatus(peer_id, peer_video);
    // refresh remote peers audio icon status and title
    setPeerAudioStatus(peer_id, peer_audio);
    // handle remote peers audio on-off
    handlePeerAudioBtn(peer_id);
    // handle remote peers video on-off
    handlePeerVideoBtn(peer_id);
    // notify if peer started to recording own screen + audio
    if (peer_rec) notifyRecording(peer_name, 'Started');
}

/**
 * Log stream settings info
 * @param {*} name
 * @param {*} stream
 */
function logStreamSettingsInfo(name, stream) {
    console.log(name, {
        video: {
            label: stream.getVideoTracks()[0].label,
            settings: stream.getVideoTracks()[0].getSettings(),
        },
        audio: {
            label: stream.getAudioTracks()[0].label,
            settings: stream.getAudioTracks()[0].getSettings(),
        },
    });
}

/**
 * Resize video elements
 */
function resizeVideos() {
    const numToString = ['', 'one', 'two', 'three', 'four', 'five', 'six'];
    const videos = document.querySelectorAll('.video');
    document.querySelectorAll('.video').forEach((v) => {
        v.className = 'video ' + numToString[videos.length];
    });
}

/**
 * Connection Count
 */
function getMemberCount() {
    const videos = document.querySelectorAll('.video');
    return videos.length;
}

/**
 * Refresh video - chat image avatar on name changes
 * https://eu.ui-avatars.com/
 *
 * @param {*} videoAvatarImageId element
 * @param {*} peerName
 */
function setPeerAvatarImgName(videoAvatarImageId, peerName) {
    let videoAvatarImageElement = getId(videoAvatarImageId);
    // default img size 64 max 512
    // let avatarImgSize = isMobileDevice ? 128 : 256;
    // videoAvatarImageElement.setAttribute(
    //     'src',
    //     avatarApiUrl + '?name=' + peerName + '&size=' + avatarImgSize + '&background=random&rounded=true',
    // );
    if( videoAvatarImageElement == null ) return false;
    if( peerName == '' ) {
        let avatarImgSize = isMobileDevice ? 128 : 256;
        var bgColor = backColor[Math.floor(Math.random() * 7)];
        videoAvatarImageElement.setAttribute(
            'src',
            avatarApiUrl + '?name=' + peerName + '&size=' + avatarImgSize + '&background=e2fcee&color=00ab53&rounded=true',
        );
    } else {
        videoAvatarImageElement.setAttribute(
            'src',
            peerName,
        );
    }
}

/**
 * Set Chat avatar image by peer name
 * @param {*} avatar left/right
 * @param {*} peerName my/friends
 */
function setPeerChatAvatarImgName(avatar, peerName) {
    var bgColor = backColor[Math.floor(Math.random() * 7)];
    let avatarImg = avatarApiUrl + '?name=' + peerName + '&size=34' + '&background=e2fcee&color=00ab53&rounded=false';

    switch (avatar) {
        case 'left':
            // console.log("Set Friend chat avatar image");
            leftChatAvatar = avatarImg;
            break;
        case 'right':
            // console.log("Set My chat avatar image");
            rightChatAvatar = avatarImg;
            break;
    }
}

/**
 * On video player click, go on full screen mode ||
 * On button click, go on full screen mode.
 * Press Esc to exit from full screen mode, or click again.
 *
 * @param {*} videoId
 * @param {*} videoFullScreenBtnId
 * @param {*} peer_id
 */
function handleVideoPlayerFs(videoId, videoFullScreenBtnId, peer_id = null) {
    let videoPlayer = getId(videoId);
    let videoFullScreenBtn = getId(videoFullScreenBtnId);

    // handle Chrome Firefox Opera Microsoft Edge videoPlayer ESC
    videoPlayer.addEventListener('fullscreenchange', (e) => {
        // if Controls enabled, or document on FS do nothing
        if (videoPlayer.controls || isDocumentOnFullScreen) return;
        let fullscreenElement = document.fullscreenElement;
        if (!fullscreenElement) {
            videoPlayer.style.pointerEvents = 'auto';
            isVideoOnFullScreen = false;
            // console.log("Esc FS isVideoOnFullScreen", isVideoOnFullScreen);
        }
    });

    // handle Safari videoPlayer ESC
    videoPlayer.addEventListener('webkitfullscreenchange', (e) => {
        // if Controls enabled, or document on FS do nothing
        if (videoPlayer.controls || isDocumentOnFullScreen) return;
        let webkitIsFullScreen = document.webkitIsFullScreen;
        if (!webkitIsFullScreen) {
            videoPlayer.style.pointerEvents = 'auto';
            isVideoOnFullScreen = false;
            // console.log("Esc FS isVideoOnFullScreen", isVideoOnFullScreen);
        }
    });

    // on button click go on FS mobile/desktop
    // videoFullScreenBtn.addEventListener('click', (e) => {
    //     gotoFS();
    // });

    // on video click go on FS
    videoPlayer.addEventListener('click', (e) => {
        // not mobile on click go on FS or exit from FS
        if (!isMobileDevice) {
            gotoFS();
        } else {
            // mobile on click exit from FS, for enter use videoFullScreenBtn
            if (isVideoOnFullScreen) handleFSVideo();
        }
    });

    function gotoFS() {
        // handle remote peer video fs
        if (peer_id !== null) {
            handleFSVideo();
        } else {
            handleFSVideo();
        }
    }

    function showMsg() {
        userLog('toast', 'Full screen mode work when video is on');
    }

    function handleFSVideo() {
        // if Controls enabled, or document on FS do nothing
        if (videoPlayer.controls || isDocumentOnFullScreen) return;

        if (!isVideoOnFullScreen) {
            if (videoPlayer.requestFullscreen) {
                // Chrome Firefox Opera Microsoft Edge
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) {
                // Safari request full screen mode
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) {
                // IE11 request full screen mode
                videoPlayer.msRequestFullscreen();
            }
            isVideoOnFullScreen = true;
            videoPlayer.style.pointerEvents = 'none';
            // console.log("Go on FS isVideoOnFullScreen", isVideoOnFullScreen);
        } else {
            if (document.exitFullscreen) {
                // Chrome Firefox Opera Microsoft Edge
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                // Safari exit full screen mode ( Not work... )
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                // IE11 exit full screen mode
                document.msExitFullscreen();
            }
            isVideoOnFullScreen = false;
            videoPlayer.style.pointerEvents = 'auto';
            // console.log("Esc FS isVideoOnFullScreen", isVideoOnFullScreen);
        }
    }
}

/**
 * Start talk time
 */
function startCountTime() {
    countTime.style.display = 'inline';
    callStartTime = Date.now();
    setInterval(function printTime() {
        callElapsedTime = Date.now() - callStartTime;
        countTime.innerHTML = getTimeToString(callElapsedTime);
    }, 1000);
}

/**
 * Return time to string
 * @param {*} time
 */
function getTimeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
    let formattedHH = hh.toString().padStart(2, '0');
    let formattedMM = mm.toString().padStart(2, '0');
    let formattedSS = ss.toString().padStart(2, '0');
    return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

/**
 * Handle WebRTC left buttons
 */
function manageLeftButtons() {
    setShareRoomBtn();
    setAudioBtn();
    setVideoBtn();
    setSwapCameraBtn();
    setScreenShareBtn();
    setRecordStreamBtn();
    setFullScreenBtn();
    setChatRoomBtn();
    setChatEmojiBtn();
    setraiseHandBtn();
    setMyWhiteboardBtn();
    setMyshareFileBtn();
    setMyGameBtn();
    setshowSettingBtn();
    setAboutBtn();
    // setLeaveRoomBtn();
    // showButtonsBarAndMenu();
}

/**
 * Copy - share room url button click event
 */
function setShareRoomBtn() {
    shareRoomBtn.addEventListener('click', async (e) => {
        shareRoomUrl();
    });
}

/**
 * Audio mute - unmute button click event
 */
function setAudioBtn() {
    audioBtn.addEventListener('click', (e) => {
        handleAudio(e, false);
    });
}

/**
 * Video hide - show button click event
 */
function setVideoBtn() {
    videoBtn.addEventListener('click', (e) => {
        handleVideo(e, false);
    });
}

/**
 * Check if can swap or not the cam, if yes show the button else hide it
 */
function setSwapCameraBtn() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInput = devices.filter((device) => device.kind === 'videoinput');
        if (videoInput.length > 1 && isMobileDevice) {
            swapCameraBtn.addEventListener('click', (e) => {
                swapCamera();
            });
        } else {
            swapCameraBtn.style.display = 'none';
        }
    });
}

/**
 * Check if i can share the screen, if yes show button else hide it
 */
function setScreenShareBtn() {
    if (!isMobileDevice && (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia)) {
        screenShareBtn.addEventListener('click', (e) => {
            curVideoStatus = myVideoStatus;
            if( curVideoStatus === false ) {
                localMediaStream.getVideoTracks()[0].enabled = true;
                emitPeerStatus('video', true);
                setMyVideoStatus(true);
            }
            toggleScreenSharing();
        });
    } else {
        screenShareBtn.style.display = 'none';
    }
}

/**
 * Start - Stop Stream recording
 */
function setRecordStreamBtn() {
    recordStreamBtn.addEventListener('click', (e) => {
        if (isStreamRecording) {
            stopStreamRecording();
        } else {
            startStreamRecording();
        }
    });
}

/**
 * Full screen button click event
 */
function setFullScreenBtn() {
    if (DetectRTC.browser.name != 'Safari') {
        // detect esc from full screen mode
        document.addEventListener('fullscreenchange', (e) => {
            let fullscreenElement = document.fullscreenElement;
            if (!fullscreenElement) {
                fullScreenBtn.className = 'fas fa-expand-alt';
                isDocumentOnFullScreen = false;
                // only for desktop
                if (!isMobileDevice) {
                    tippy(fullScreenBtn, {
                        content: 'VIEW full screen',
                        placement: 'right-start',
                    });
                }
            }
        });
        fullScreenBtn.addEventListener('click', (e) => {
            toggleFullScreen();
        });
    } else {
        fullScreenBtn.style.display = 'none';
    }
}

/**
 * Chat room buttons click event
 */
function setChatRoomBtn() {
    // adapt chat room size for mobile
    setChatRoomForMobile();

    // open hide chat room
    chatRoomBtn.addEventListener('click', (e) => {
        if (!isChatRoomVisible) {
            showChatRoomDraggable();
        } else {
            hideChatRoomAndEmojiPicker();
            e.target.className = 'fas fa-comment';
        }
    });

    // ghost theme + undo
    msgerTheme.addEventListener('click', (e) => {
        if (ShuffleTheme == 'ghost') return;

        if (e.target.className == 'fas fa-ghost') {
            e.target.className = 'fas fa-undo';
            document.documentElement.style.setProperty('--msger-bg', 'rgba(0, 0, 0, 0.100)');
        } else {
            e.target.className = 'fas fa-ghost';
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(to left, #383838, #000000)');
        }
    });

    // show msger participants section
    msgerCPBtn.addEventListener('click', (e) => {
        if (!thereIsPeerConnections()) {
            userLog('info', 'No participants detected');
            return;
        }
        msgerCP.style.display = 'flex';
    });

    // hide msger participants section
    msgerCPCloseBtn.addEventListener('click', (e) => {
        msgerCP.style.display = 'none';
    });

    // clean chat messages
    msgerClean.addEventListener('click', (e) => {
        cleanMessages();
    });

    // save chat messages to file
    msgerSaveBtn.addEventListener('click', (e) => {
        if (chatMessages.length != 0) {
            downloadChatMsgs();
            return;
        }
        userLog('info', 'No chat messages to save');
    });

    // close chat room - show left button and status menu if hide
    msgerClose.addEventListener('click', (e) => {
        hideChatRoomAndEmojiPicker();
        // showButtonsBarAndMenu();
    });

    // open Video Url Player
    msgerVideoUrlBtn.addEventListener('click', (e) => {
        sendVideoUrl();
    });

    // Execute a function when the user releases a key on the keyboard
    msgerInput.addEventListener('keyup', (e) => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            e.preventDefault();
            msgerSendBtn.click();
        }
    });

    // on input check 4emoji from map
    msgerInput.oninput = function () {
        for (let i in chatInputEmoji) {
            let regex = new RegExp(escapeSpecialChars(i), 'gim');
            this.value = this.value.replace(regex, chatInputEmoji[i]);
        }
    };

    // chat send msg
    msgerSendBtn.addEventListener('click', (e) => {
        // prevent refresh page
        e.preventDefault();
        sendChatMessage();
    });
}

/**
 * Emoji picker chat room button click event
 */
function setChatEmojiBtn() {
    msgerEmojiBtn.addEventListener('click', (e) => {
        // prevent refresh page
        e.preventDefault();
        hideShowEmojiPicker();
    });

    emojiPicker.addEventListener('emoji-click', (e) => {
        //console.log(e.detail);
        //console.log(e.detail.emoji.unicode);
        msgerInput.value += e.detail.emoji.unicode;
        hideShowEmojiPicker();
    });
}

/**
 * Set my hand button click event
 */
function setraiseHandBtn() {
    raiseHandBtn.addEventListener('click', async (e) => {
        setMyHandStatus();
    });
}

/**
 * Whiteboard : https://r8.whiteboardfox.com (good alternative)
 */
function setMyWhiteboardBtn() {
    // not supported for mobile
    if (isMobileDevice) {
        whiteboardBtn.style.display = 'none';
        return;
    }

    setupCanvas();

    // open - close whiteboard
    whiteboardBtn.addEventListener('click', (e) => {
        if (isWhiteboardVisible) {
            whiteboardClose();
            remoteWbAction('close');
        } else {
            whiteboardOpen();
            remoteWbAction('open');
        }
    });
    // close whiteboard
    whiteboardCloseBtn.addEventListener('click', (e) => {
        whiteboardClose();
        remoteWbAction('close');
    });
    // view full screen
    whiteboardFsBtn.addEventListener('click', (e) => {
        whiteboardResize();
        remoteWbAction('resize');
    });
    // erase whiteboard
    whiteboardEraserBtn.addEventListener('click', (e) => {
        setEraser();
    });
    // save whitebaord content as img
    whiteboardSaveBtn.addEventListener('click', (e) => {
        saveWbCanvas();
    });
    // clean whiteboard
    whiteboardCleanBtn.addEventListener('click', (e) => {
        confirmCleanBoard();
    });
}

/**
 * File Transfer button event click
 */
function setMyshareFileBtn() {
    // make send file div draggable
    if (!isMobileDevice) dragElement(getId('sendFileDiv'), getId('imgShare'));

    shareFileBtn.addEventListener('click', (e) => {
        //window.open("https://fromsmash.com"); // for Big Data
        selectFileToShare();
    });
    sendAbortBtn.addEventListener('click', (e) => {
        abortFileTransfer();
    });
}

/**
 * My game button click event and settings
 */
function setMyGameBtn() {
    if (isMobileDevice) {
        // adapt game iframe for mobile
        document.documentElement.style.setProperty('--game-iframe-width', '100%');
        document.documentElement.style.setProperty('--game-iframe-height', '100%');
    } else {
        dragElement(gameCont, gameHeader);
    }
    gameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleGame();
    });
    gameCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleGame();
    });
}

/**
 * My settings button click event
 */
function setshowSettingBtn() {
    showSettingBtn.addEventListener('click', (e) => {
        if (isMobileDevice) {
            buttonsBar.style.display = 'none';
            isButtonsVisible = false;
        }
        hideShowMySettings();
    });
    mySettingsCloseBtn.addEventListener('click', (e) => {
        hideShowMySettings();
    });
    myPeerNameSetBtn.addEventListener('click', (e) => {
        updateMyPeerName();
    });
    // make chat room draggable for desktop
    if (!isMobileDevice) dragElement(mySettings, mySettingsHeader);
}

/**
 * About button click event
 */
function setAboutBtn() {
    aboutBtn.addEventListener('click', (e) => {
        showAbout();
    });
}

/**
 * Leave room button click event
 */
/* function setLeaveRoomBtn() {
    leaveRoomBtn.addEventListener('click', (e) => {
        leaveRoom();
    });
} */

/**
 * Handle left buttons - status menù show - hide on body mouse move
 */
function handleBodyOnMouseMove() {
    document.body.addEventListener('mousemove', (e) => {
        // showButtonsBarAndMenu();
    });
}

/**
 * Setup local audio - video devices - theme ...
 */
function setupMySettings() {
    // tab buttons
    tabDevicesBtn.addEventListener('click', (e) => {
        openTab(e, 'tabDevices');
    });
    tabBandwidthBtn.addEventListener('click', (e) => {
        openTab(e, 'tabBandwidth');
    });
    tabRoomBtn.addEventListener('click', (e) => {
        openTab(e, 'tabRoom');
    });
    // audio - video select box
    selectors = [audioInputSelect, audioOutputSelect, videoSelect];
    audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    // select audio input
    audioInputSelect.addEventListener('change', (e) => {
        myVideoChange = false;
        refreshLocalMedia();
    });
    // select audio output
    audioOutputSelect.addEventListener('change', (e) => {
        changeAudioDestination();
    });
    // select video input
    videoSelect.addEventListener('change', (e) => {
        myVideoChange = true;
        refreshLocalMedia();
    });
    // select video quality
    videoQualitySelect.addEventListener('change', (e) => {
        setLocalVideoQuality();
    });
    // select video fps
    videoFpsSelect.addEventListener('change', (e) => {
        videoMaxFrameRate = parseInt(videoFpsSelect.value);
        setLocalMaxFps(videoMaxFrameRate);
    });
    // Firefox not support video cam Fps O.o
    if (myBrowserName === 'Firefox') {
        videoFpsSelect.value = null;
        videoFpsSelect.disabled = true;
    }
    // select screen fps
    screenFpsSelect.addEventListener('change', (e) => {
        screenMaxFrameRate = parseInt(screenFpsSelect.value);
        if (isScreenStreaming) setLocalMaxFps(screenMaxFrameRate);
    });
    // Mobile not support screen sharing
    if (isMobileDevice) {
        screenFpsSelect.value = null;
        screenFpsSelect.disabled = true;
    }
    // room actions
    muteEveryoneBtn.addEventListener('click', (e) => {
        disableAllPeers('audio');
    });
    hideEveryoneBtn.addEventListener('click', (e) => {
        disableAllPeers('video');
    });
    lockUnlockRoomBtn.addEventListener('click', (e) => {
        lockUnlockRoom();
    });
}

/**
 * Make video Url player draggable
 */
function setupVideoUrlPlayer() {
    if (isMobileDevice) {
        // adapt video player iframe for mobile
        document.documentElement.style.setProperty('--iframe-width', '320px');
        document.documentElement.style.setProperty('--iframe-height', '240px');
    } else {
        dragElement(videoUrlCont, videoUrlHeader);
    }
    videoUrlCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeVideoUrlPlayer();
        emitVideoPlayer('close');
    });
}

/**
 * Refresh Local media audio video in - out
 */
function refreshLocalMedia() {
    // some devices can't swap the video track, if already in execution.
    stopLocalVideoTrack();
    stopLocalAudioTrack();

    navigator.mediaDevices.getUserMedia(getAudioVideoConstraints()).then(gotStream).then(gotDevices).catch(handleError);
}

/**
 * Get audio - video constraints
 * @returns constraints
 */
function getAudioVideoConstraints() {
    const audioSource = audioInputSelect.value;
    const videoSource = videoSelect.value;
    let videoConstraints = getVideoConstraints(videoQualitySelect.value ? videoQualitySelect.value : 'default');
    videoConstraints['deviceId'] = videoSource ? { exact: videoSource } : undefined;
    const constraints = {
        audio: {
            deviceId: audioSource ? { exact: audioSource } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
        video: videoConstraints,
    };
    return constraints;
}

/**
 * https://webrtc.github.io/samples/src/content/getusermedia/resolution/
 *
 * @returns video constraints
 */
function getVideoConstraints(videoQuality) {
    let frameRate = { max: videoMaxFrameRate };

    switch (videoQuality) {
        case 'useVideo':
            return useVideo;
        // Firefox not support set frameRate (OverconstrainedError) O.o
        case 'default':
            return { frameRate: frameRate };
        // video cam constraints default
        case 'qvgaVideo':
            return {
                width: { exact: 320 },
                height: { exact: 240 },
                frameRate: frameRate,
            }; // video cam constraints low bandwidth
        case 'vgaVideo':
            return {
                width: { exact: 640 },
                height: { exact: 480 },
                frameRate: frameRate,
            }; // video cam constraints medium bandwidth
        case 'hdVideo':
            return {
                width: { exact: 1280 },
                height: { exact: 720 },
                frameRate: frameRate,
            }; // video cam constraints high bandwidth
        case 'fhdVideo':
            return {
                width: { exact: 1920 },
                height: { exact: 1080 },
                frameRate: frameRate,
            }; // video cam constraints very high bandwidth
        case '4kVideo':
            return {
                width: { exact: 3840 },
                height: { exact: 2160 },
                frameRate: frameRate,
            }; // video cam constraints ultra high bandwidth
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/applyConstraints
 *
 * @param {*} maxFrameRate
 */
function setLocalMaxFps(maxFrameRate) {
    localMediaStream
        .getVideoTracks()[0]
        .applyConstraints({ frameRate: { max: maxFrameRate } })
        .then(() => {
            logStreamSettingsInfo('setLocalMaxFps', localMediaStream);
        })
        .catch((err) => {
            console.error('setLocalMaxFps', err);
            userLog('error', "Your device doesn't support the selected fps, please select the another one.");
        });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/applyConstraints
 */
function setLocalVideoQuality() {
    let videoConstraints = getVideoConstraints(videoQualitySelect.value ? videoQualitySelect.value : 'default');
    localMediaStream
        .getVideoTracks()[0]
        .applyConstraints(videoConstraints)
        .then(() => {
            logStreamSettingsInfo('setLocalVideoQuality', localMediaStream);
        })
        .catch((err) => {
            console.error('setLocalVideoQuality', err);
            userLog('error', "Your device doesn't support the selected video quality, please select the another one.");
        });
}

/**
 * Change Speaker
 */
function changeAudioDestination() {
    const audioDestination = audioOutputSelect.value;
    attachSinkId(myVideo, audioDestination);
}

/**
 * Attach audio output device to video element using device/sink ID.
 * @param {*} element
 * @param {*} sinkId
 */
function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
        element
            .setSinkId(sinkId)
            .then(() => {
                console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch((err) => {
                let errorMessage = err;
                if (err.name === 'SecurityError')
                    errorMessage = `You need to use HTTPS for selecting audio output device: ${err}`;
                console.error(errorMessage);
                // Jump back to first output device in the list as it's the default.
                audioOutputSelect.selectedIndex = 0;
            });
    } else {
        console.warn('Browser does not support output device selection.');
    }
}

/**
 * Got Stream and append to local media
 * @param {*} stream
 */
function gotStream(stream) {
    refreshMyStreamToPeers(stream, true);
    refreshMyLocalStream(stream, true);
    if (myVideoChange) {
        setMyVideoStatusTrue();
        if (isMobileDevice) myVideo.classList.toggle('mirror');
    }
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}

/**
 * Get audio-video Devices and show it to select box
 * https://webrtc.github.io/samples/src/content/devices/input-output/
 * https://github.com/webrtc/samples/tree/gh-pages/src/content/devices/input-output
 * @param {*} deviceInfos
 */
function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map((select) => select.value);
    selectors.forEach((select) => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    // check devices
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        // console.log("device-info ------> ", deviceInfo);
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;

        switch (deviceInfo.kind) {
            case 'videoinput':
                option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
                videoSelect.appendChild(option);
                break;

            case 'audioinput':
                option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
                audioInputSelect.appendChild(option);
                break;

            case 'audiooutput':
                option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
                audioOutputSelect.appendChild(option);
                break;

            default:
                console.log('Some other kind of source/device: ', deviceInfo);
        }
    } // end for devices

    selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex];
        }
    });
}

/**
 * Handle getUserMedia error
 * @param {*} err
 */
function handleError(err) {
    console.log('navigator.MediaDevices.getUserMedia error: ', err);
    switch (err.name) {
        case 'OverconstrainedError':
            userLog(
                'error',
                "GetUserMedia: Your device doesn't support the selected video quality or fps, please select the another one.",
            );
            break;
        default:
            userLog('error', 'GetUserMedia error ' + err);
    }
    // https://blog.addpipe.com/common-getusermedia-errors/
}

/**
 * AttachMediaStream stream to element
 * @param {*} element
 * @param {*} stream
 */
function attachMediaStream(element, stream) {
    //console.log("DEPRECATED, attachMediaStream will soon be removed.");
    console.log('Success, media stream attached');
    element.srcObject = stream;
}

/**
 * Show left buttons & status menù for 10 seconds on body mousemove
 * if mobile and chatroom open do nothing return
 * if mobile and mySettings open do nothing return
 */
function showButtonsBarAndMenu() {
    if (isButtonsVisible || (isMobileDevice && isChatRoomVisible) || (isMobileDevice && isMySettingsVisible)) return;
    toggleClassElements('statusMenu', 'inline');
    buttonsBar.style.display = 'flex';
    isButtonsVisible = true;
    setTimeout(() => {
        toggleClassElements('statusMenu', 'none');
        buttonsBar.style.display = 'none';
        isButtonsVisible = false;
    }, 10000);
}

/**
 * Copy room url to clipboard and share it with navigator share if supported
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
 */
async function shareRoomUrl() {
    const myRoomUrl = window.location.href;

    // navigator share
    let isSupportedNavigatorShare = false;
    let errorNavigatorShare = false;
    // if supported
    if (navigator.share) {
        isSupportedNavigatorShare = true;
        try {
            // not add title and description to load metadata from url
            await navigator.share({ url: myRoomUrl });
            userLog('toast', 'Room Shared successfully!');
        } catch (err) {
            errorNavigatorShare = true;
            /*
                This feature is available only in secure contexts (HTTPS),
                in some or all supporting browsers and mobile devices
                console.error("navigator.share", err); 
            */
        }
    }

    // something wrong or not supported navigator.share
    if (!isSupportedNavigatorShare || (isSupportedNavigatorShare && errorNavigatorShare)) {
        // playSound('newMessage');
        Swal.fire({
            background: swalBackground,
            position: 'center',
            title: 'Share the Room',
            imageAlt: 'Shuffle-share',
            html:
                `
            <br/>
            <div id="qrRoomContainer">
                <canvas id="qrRoom"></canvas>
            </div>
            <br/><br/>
            <p style="color:white;"> Share this meeting invite others to join.</p>
            <p style="color:rgb(8, 189, 89);">` +
                myRoomUrl +
                `</p>`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Copy meeting URL`,
            denyButtonText: `Email invite`,
            cancelButtonText: `Close`,
            customClass: {
                title: 'popup-title',
                htmlContainer: 'popup-text',
                confirmButton: 'popup-confirm-btn',
                denyButton: 'popup-deny-btn',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                copyRoomURL();
            } else if (result.isDenied) {
                let message = {
                    email: '',
                    subject: 'Please join our Shuffle Video Chat Meeting',
                    body: 'Click to join: ' + myRoomUrl,
                };
                shareRoomByEmail(message);
            }
        });
        makeRoomQR();
    }
}

/**
 * Make Room QR
 * https://github.com/neocotic/qrious
 */
function makeRoomQR() {
    let qr = new QRious({
        element: getId('qrRoom'),
        value: window.location.href,
    });
    qr.set({
        size: 128,
    });
}

/**
 * Copy Room URL to clipboard
 */
function copyRoomURL() {
    let roomURL = window.location.href;
    let tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    tmpInput.value = roomURL;
    tmpInput.select();
    tmpInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    console.log('Copied to clipboard Join Link ', roomURL);
    document.body.removeChild(tmpInput);
    // userLog('toast', 'Meeting URL is copied to clipboard 👍');
}

/**
 * Share room id by email
 * @param {*} message email | subject | body
 */
function shareRoomByEmail(message) {
    let email = message.email;
    let subject = message.subject;
    let emailBody = message.body;
    document.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody;
}

/**
 * Handle Audio ON - OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleAudio(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getAudioTracks
    localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
    myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
    e.target.className = 'fas fa-microphone' + (myAudioStatus ? '' : '-slash');
    if (init) {
        audioBtn.className = 'fas fa-microphone' + (myAudioStatus ? '' : '-slash');
        /* if (!isMobileDevice) {
            tippy(initAudioBtn, {
                content: myAudioStatus ? 'Click to audio OFF' : 'Click to audio ON',
                placement: 'top',
            });
        } */
    }
    emitPeerStatus('audio', myAudioStatus);
    setMyAudioStatus(myAudioStatus);
}

/**
 * Handle Video ON - OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleVideo(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getVideoTracks
    localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0].enabled;
    myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
    e.target.className = 'fas fa-video' + (myVideoStatus ? '' : '-slash');
    if (init) {
        videoBtn.className = 'fas fa-video' + (myVideoStatus ? '' : '-slash');
        /* if (!isMobileDevice) {
            tippy(initVideoBtn, {
                content: myVideoStatus ? 'Click to video OFF' : 'Click to video ON',
                placement: 'top',
            });
        } */
    }
    emitPeerStatus('video', myVideoStatus);
    setMyVideoStatus(myVideoStatus);
}

/**
 * SwapCamera front (user) - rear (environment)
 */
function swapCamera() {
    // setup camera
    camera = camera == 'user' ? 'environment' : 'user';
    if (camera == 'user') useVideo = true;
    else useVideo = { facingMode: { exact: camera } };

    // some devices can't swap the cam, if have Video Track already in execution.
    if (useVideo) stopLocalVideoTrack();

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices
        .getUserMedia({ video: useVideo })
        .then((camStream) => {
            refreshMyStreamToPeers(camStream);
            refreshMyLocalStream(camStream);
            if (useVideo) setMyVideoStatusTrue();
            myVideo.classList.toggle('mirror');
        })
        .catch((err) => {
            console.log('[Error] to swaping camera', err);
            userLog('error', 'Error to swaping the camera ' + err);
            // https://blog.addpipe.com/common-getusermedia-errors/
        });
}

/**
 * Stop Local Video Track
 */
function stopLocalVideoTrack() {
    localMediaStream.getVideoTracks()[0].stop();
}

/**
 * Stop Local Audio Track
 */
function stopLocalAudioTrack() {
    localMediaStream.getAudioTracks()[0].stop();
}

/**
 * Enable - disable screen sharing
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 */
function toggleScreenSharing() {
    screenMaxFrameRate = parseInt(screenFpsSelect.value);
    const constraints = {
        video: { frameRate: { max: screenMaxFrameRate } },
    }; // true | { frameRate: { max: screenMaxFrameRate } }

    let screenMediaPromise;

    if (!isScreenStreaming) {
        // on screen sharing start
        screenMediaPromise = navigator.mediaDevices.getDisplayMedia(constraints);
    } else {
        // on screen sharing stop
        screenMediaPromise = navigator.mediaDevices.getUserMedia(getAudioVideoConstraints());
    }
    screenMediaPromise
        .then((screenStream) => {
            // stop cam video track on screen share
            stopLocalVideoTrack();
            isScreenStreaming = !isScreenStreaming;
            refreshMyStreamToPeers(screenStream);
            refreshMyLocalStream(screenStream);
            myVideo.classList.toggle('mirror');
            setScreenSharingStatus(isScreenStreaming);
        })
        .catch((err) => {
            console.error('[Error] Unable to share the screen', err);
            userLog('error', 'Unable to share the screen ' + err);
        });
}

/**
 * Set Screen Sharing Status
 * @param {*} status
 */
function setScreenSharingStatus(status) {
    screenShareBtn.className = status ? 'control-btn selected' : 'control-btn';
    // only for desktop
    if (!isMobileDevice) {
        tippy(screenShareBtn, {
            content: status ? 'STOP screen sharing' : 'START screen sharing',
            placement: 'right-start',
        });
    }
}

/**
 * set myVideoStatus true
 */
function setMyVideoStatusTrue() {
    if (myVideoStatus) return;
    // Put video status alredy ON
    localMediaStream.getVideoTracks()[0].enabled = true;
    myVideoStatus = true;
    videoBtn.className = 'fas fa-video';
    myVideoStatusIcon.className = 'fas fa-video';
    myVideoAvatarImage.style.display = 'none';
    emitPeerStatus('video', myVideoStatus);
    // only for desktop
    if (!isMobileDevice) {
        tippy(videoBtn, {
            content: 'Click to video OFF',
            placement: 'right-start',
        });
    }
}

/**
 * Enter - esc on full screen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 */
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullScreenBtn.className = 'fas fa-compress-alt';
        isDocumentOnFullScreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullScreenBtn.className = 'fas fa-expand-alt';
            isDocumentOnFullScreen = false;
        }
    }
    // only for desktop
    if (!isMobileDevice) {
        tippy(fullScreenBtn, {
            content: isDocumentOnFullScreen ? 'EXIT full screen' : 'VIEW full screen',
            placement: 'right-start',
        });
    }
}

/**
 * Refresh my stream changes to connected peers in the room
 * @param {*} stream
 * @param {*} localAudioTrackChange true or false(default)
 */
function refreshMyStreamToPeers(stream, localAudioTrackChange = false) {
    if (!thereIsPeerConnections()) return;

    // refresh my stream to peers
    for (let peer_id in peerConnections) {
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/getSenders
        let videoSender = peerConnections[peer_id]
            .getSenders()
            .find((s) => (s.track ? s.track.kind === 'video' : false));
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack
        videoSender.replaceTrack(stream.getVideoTracks()[0]);

        if (localAudioTrackChange) {
            let audioSender = peerConnections[peer_id]
                .getSenders()
                .find((s) => (s.track ? s.track.kind === 'audio' : false));
            // https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack
            audioSender.replaceTrack(stream.getAudioTracks()[0]);
        }
    }
}

/**
 * Refresh my local stream
 * @param {*} stream
 * @param {*} localAudioTrackChange true or false(default)
 */
function refreshMyLocalStream(stream, localAudioTrackChange = false) {
    stream.getVideoTracks()[0].enabled = true;

    // enable audio
    if (localAudioTrackChange && myAudioStatus === false) {
        audioBtn.className = 'fas fa-microphone';
        setMyAudioStatus(true);
        myAudioStatus = true;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
    const newStream = new MediaStream([
        stream.getVideoTracks()[0],
        localAudioTrackChange ? stream.getAudioTracks()[0] : localMediaStream.getAudioTracks()[0],
    ]);
    localMediaStream = newStream;

    // log newStream devices
    logStreamSettingsInfo('refreshMyLocalStream', localMediaStream);

    // attachMediaStream is a part of the adapter.js library
    attachMediaStream(myVideo, localMediaStream); // newstream

    // on toggleScreenSharing video stop
    stream.getVideoTracks()[0].onended = () => {
        if( curVideoStatus === false ) {
            localMediaStream.getVideoTracks()[0].enabled = false;
            emitPeerStatus('video', false);
            setMyVideoStatus(false);
            curVideoStatus = true;
        }
        if (isScreenStreaming) toggleScreenSharing();
    };

    /**
     * When you stop the screen sharing, on default i turn back to the webcam with video stream ON.
     * If you want the webcam with video stream OFF, just disable it with the button (click to video OFF),
     * before to stop the screen sharing.
     */
    if (myVideoStatus === false) localMediaStream.getVideoTracks()[0].enabled = false;
}

/**
 * Start recording time
 */
function startRecordingTime() {
    recStartTime = Date.now();
    let rc = setInterval(function printTime() {
        if (isStreamRecording) {
            recElapsedTime = Date.now() - recStartTime;
            recordingTime = getTimeToString(recElapsedTime);
            myVideoParagraph.innerHTML = myPeerName + '&nbsp;&nbsp; 🔴 REC ' + getTimeToString(recElapsedTime);
            return;
        }
        clearInterval(rc);
    }, 1000);
}

/**
 * Get MediaRecorder MimeTypes
 * @returns mimeType
 */
function getSupportedMimeTypes() {
    const possibleTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac',
        'video/mp4',
    ];
    return possibleTypes.filter((mimeType) => {
        return MediaRecorder.isTypeSupported(mimeType);
    });
}

/**
 * Start Recording
 * https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/record
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
 */
function startStreamRecording() {
    recordedBlobs = [];

    let options = getSupportedMimeTypes();
    console.log('MediaRecorder options supported', options);
    options = { mimeType: options[0] }; // select the first available as mimeType

    try {
        if (isMobileDevice) {
            // on mobile devices recording camera + audio
            mediaRecorder = new MediaRecorder(localMediaStream, options);
            console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
            handleMediaRecorder(mediaRecorder);
        } else {
            // on desktop devices recording screen + audio
            screenMaxFrameRate = parseInt(screenFpsSelect.value);
            const constraints = {
                video: { frameRate: { max: screenMaxFrameRate } },
            };
            let recScreenStreamPromise = navigator.mediaDevices.getDisplayMedia(constraints);
            recScreenStreamPromise
                .then((screenStream) => {
                    const newStream = new MediaStream([
                        screenStream.getVideoTracks()[0],
                        localMediaStream.getAudioTracks()[0],
                    ]);
                    recScreenStream = newStream;
                    mediaRecorder = new MediaRecorder(recScreenStream, options);
                    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
                    isRecScreenSream = true;
                    handleMediaRecorder(mediaRecorder);
                })
                .catch((err) => {
                    console.error('[Error] Unable to recording the screen + audio', err);
                    userLog('error', 'Unable to recording the screen + audio ' + err);
                });
        }
    } catch (err) {
        console.error('Exception while creating MediaRecorder: ', err);
        userLog('error', "Can't start stream recording: " + err);
        return;
    }
}

/**
 * Notify me if someone start to recording they screen + audio
 * @param {*} from peer_name
 * @param {*} action Started Stopped
 */
function notifyRecording(from, action) {
    let msg = '[ 🔴 REC ] : ' + action + ' to recording his own screen and audio';
    let chatMessage = {
        from: from,
        to: myPeerName,
        msg: msg,
        privateMsg: false,
    };
    handleDataChannelChat(chatMessage, '');
    userLog('toast', from + ' ' + msg);
}

/**
 * Handle Media Recorder obj
 * @param {*} mediaRecorder
 */
function handleMediaRecorder(mediaRecorder) {
    mediaRecorder.start();
    mediaRecorder.addEventListener('start', handleMediaRecorderStart);
    mediaRecorder.addEventListener('dataavailable', handleMediaRecorderData);
    mediaRecorder.addEventListener('stop', handleMediaRecorderStop);
}

/**
 * Handle Media Recorder onstart event
 * @param {*} event
 */
function handleMediaRecorderStart(event) {
    // playSound('recStart');
    if (isRecScreenSream) {
        emitPeersAction('recStart');
        emitPeerStatus('rec', isRecScreenSream);
    }
    console.log('MediaRecorder started: ', event);
    isStreamRecording = true;
    recordStreamBtn.style.setProperty('background-color', 'red');
    startRecordingTime();
    // only for desktop
    if (!isMobileDevice) {
        tippy(recordStreamBtn, {
            content: 'STOP recording',
            placement: 'right-start',
        });
    } else {
        swapCameraBtn.style.display = 'none';
    }
}

/**
 * Handle Media Recorder ondata event
 * @param {*} event
 */
function handleMediaRecorderData(event) {
    console.log('MediaRecorder data: ', event);
    if (event.data && event.data.size > 0) recordedBlobs.push(event.data);
}

/**
 * Handle Media Recorder onstop event
 * @param {*} event
 */
function handleMediaRecorderStop(event) {
    // playSound('recStop');
    console.log('MediaRecorder stopped: ', event);
    console.log('MediaRecorder Blobs: ', recordedBlobs);
    myVideoParagraph.innerHTML = myPeerName;
    isStreamRecording = false;
    if (isRecScreenSream) {
        recScreenStream.getTracks().forEach((track) => {
            if (track.kind === 'video') track.stop();
        });
        isRecScreenSream = false;
        emitPeersAction('recStop');
        emitPeerStatus('rec', isRecScreenSream);
    }
    setRecordButtonUi();
    downloadRecordedStream();
    // only for desktop
    if (!isMobileDevice) {
        tippy(recordStreamBtn, {
            content: 'START recording',
            placement: 'right-start',
        });
    } else {
        swapCameraBtn.style.display = 'block';
    }
}

/**
 * Stop recording
 */
function stopStreamRecording() {
    mediaRecorder.stop();
}

/**
 * Set Record Button UI on change theme
 */
function setRecordButtonUi() {
    recordStreamBtn.style.setProperty('background-color', 'white');
}

/**
 * Download recorded stream
 */
function downloadRecordedStream() {
    try {
        const type = recordedBlobs[0].type.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(recordedBlobs, { type: 'video/' + type });
        const recFileName = getDataTimeString() + '-REC.' + type;
        const currentDevice = isMobileDevice ? 'MOBILE' : 'PC';
        const blobFileSize = bytesToSize(blob.size);

        // userLog(
        //     'success-html',
        //     `<div style="text-align: left;">
        //         🔴 Recording Info <br/>
        //         FILE: ${recFileName} <br/>
        //         SIZE: ${blobFileSize} <br/>
        //         Please wait to be processed, then will be downloaded to your ${currentDevice} device.
        //     </div>`,
        // );

        // saveBlobToFile(blob, recFileName);
        uploadBlobFile(blob, recFileName, blobFileSize);
    } catch (err) {
        userLog('error', 'Recording save failed: ' + err);
    }
}

// upload video stream
function uploadBlobFile(blob, filename, filesize) {

    var formdata = new FormData();
    formdata.append('file', blob, filename);

    var desc = 'Meeting on ';
    const curDate = new Date();
    const mon = curDate.getMonth() + 1;
    const year = curDate.getFullYear() + '';
    const day = curDate.getDate();
    desc += mon + '/' + day + '/' + year.substring(2, 4) + ' - ';
    desc += recordingTime + ' call';
    desc += ' - ' + getMemberCount() + ' partipants';

    $.ajax({
        url: '/uploadrecord',
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
            saveRecordingData(data.filename, desc, filesize);
        }
    });
    
    // const inp = document.createElement('input');
    // inp.type = 'file';
    // inp.value = url;
    // inp.style.display = 'none';
    // document.body.appendChild(inp);
    // setTimeout(() => {
    //     document.body.removeChild(inp);
    //     window.URL.revokeObjectURL(url);
    // }, 1000);
}

function saveRecordingData(filename, desc, filesize) {
    $.ajax({
        url: '/addrecord',
        method: 'post',
        data: {
            user_id: $('#userid').val(),
            description: desc,
            filename: filename,
            filesize: filesize
        },
        success: function(result) {
            userLog(
                'success-html',
                `<div style="text-align: left;">
                    🔴 Recording Info <br/>
                    FILE: ${filename} <br/>
                    SIZE: ${filesize} <br/>
                    You can download recording data on profile page.
                </div>`,
            );
        }
    });  
}

/**
 * Create Chat Room Data Channel
 * @param {*} peer_id
 */
function createChatDataChannel(peer_id) {
    chatDataChannels[peer_id] = peerConnections[peer_id].createDataChannel('Shuffle_chat_channel');
    chatDataChannels[peer_id].onopen = (event) => {
        console.log('chatDataChannels created', event);
    };
}

/**
 * Set the chat room on full screen mode for mobile
 */
function setChatRoomForMobile() {
    if (isMobileDevice) {
        document.documentElement.style.setProperty('--msger-height', '99%');
        document.documentElement.style.setProperty('--msger-width', '99%');
    } else {
        // make chat room draggable for desktop
        dragElement(msgerDraggable, msgerHeader);
    }
}

/**
 * Show msger draggable on center screen position
 */
function showChatRoomDraggable() {
    // playSound('newMessage');
    if (isMobileDevice) {
        buttonsBar.style.display = 'none';
        isButtonsVisible = false;
    }
    chatRoomBtn.className = 'fas fa-comment-slash';
    msgerDraggable.style.top = '50%';
    msgerDraggable.style.left = '50%';
    msgerDraggable.style.display = 'flex';
    isChatRoomVisible = true;
    // only for desktop
    if (!isMobileDevice) {
        tippy(chatRoomBtn, {
            content: 'CLOSE the chat',
            placement: 'right-start',
        });
    }
}

/**
 * Clean chat messages
 */
function cleanMessages() {
    Swal.fire({
        background: swalBackground,
        position: 'center',
        title: 'Clean up chat Messages?',
        imageUrl: deleteImg,
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        // clean chat messages
        if (result.isConfirmed) {
            let msgs = msgerChat.firstChild;
            while (msgs) {
                msgerChat.removeChild(msgs);
                msgs = msgerChat.firstChild;
            }
            // clean object
            chatMessages = [];
        }
    });
}

/**
 * Hide chat room and emoji picker
 */
function hideChatRoomAndEmojiPicker() {
    msgerDraggable.style.display = 'none';
    msgerEmojiPicker.style.display = 'none';
    chatRoomBtn.className = 'fas fa-comment';
    isChatRoomVisible = false;
    isChatEmojiVisible = false;
    // only for desktop
    if (!isMobileDevice) {
        tippy(chatRoomBtn, {
            content: 'OPEN the chat',
            placement: 'right-start',
        });
    }
}

/**
 * Send Chat messages to peers in the room
 */
function sendChatMessage() {
    if (!thereIsPeerConnections()) {
        userLog('info', "Can't send message, no participants in the room");
        msgerInput.value = '';
        return;
    }

    $('.msger-chat-wrap').animate({
        scrollTop: $('.msger-chat-wrap')[0].scrollHeight
     }, 700);

    const msg = msgerInput.value;
    // empity msg or
    if (!msg) return;

    emitMsg(myPeerName, 'toAll', msg, false);
    appendMessage(myPeerName, myPeerImage, 'right', msg, false, false);
    msgerInput.value = '';
}

/**
 * handle Incoming Data Channel Chat Messages
 * @param {*} dataMessage
 */
function handleDataChannelChat(dataMessage, peerIcon) {
    if (!dataMessage) return;

    let msgFrom = dataMessage.from;
    let msgTo = dataMessage.to;
    let msg = dataMessage.msg;
    let msgPrivate = dataMessage.privateMsg;

    // private message but not for me return
    if (msgPrivate && msgTo != myPeerName) return;

    console.log('handleDataChannelChat', dataMessage);
    // chat message for me also
    if (!isChatRoomVisible) {
        // showChatRoomDraggable();
        chatRoomBtn.className = 'fas fa-comment-slash';
    }
    // playSound('chatMessage');
    setPeerChatAvatarImgName('left', msgFrom);
    if( peerIcon == '' )
        appendMessage(msgFrom, leftChatAvatar, 'left', msg, msgPrivate, true);
    else 
        appendMessage(msgFrom, peerIcon, 'left', msg, msgPrivate, true);
}

/**
 * Escape Special Chars
 * @param {*} regex
 */
function escapeSpecialChars(regex) {
    return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

/**
 * Append Message to msger chat room
 * @param {*} from
 * @param {*} img
 * @param {*} side
 * @param {*} msg
 * @param {*} privateMsg
 */
function appendMessage(from, img, side, msg, privateMsg, isMine) {
    let time = getFormatDate(new Date());
    // collect chat msges to save it later
    chatMessages.push({
        time: time,
        from: from,
        msg: msg,
        privateMsg: privateMsg,
    });

    // check if i receive a private message
    let msgBubble = privateMsg ? 'private-msg-bubble' : 'msg-bubble';

    // console.log("chatMessages", chatMessages);
    let cMsg = detectUrl(msg);
    let extraClass = 'my-msg';
    if( isMine == true ) {
        extraClass = 'other-msg';
    }
    const msgHTML = `
	<div class="msg ${side}-msg">
		<div class="msg-img" style="background-image: url('${img}')"></div>
		<div class=${msgBubble}>
            <div class="msg-info">
                <div class="msg-info-name">${from}</div>
                <div class="msg-info-time">${time}</div>
            </div>
            <div class="msg-text ${extraClass}">${cMsg}</div>
        </div>
	</div>
    `;
    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    $('.msger-chat-wrap').animate({
        scrollTop: $('.msger-chat-wrap')[0].scrollHeight
    }, 500);
    msgerChat.scrollTop += 500;
}

/**
 * Add participants in the chat room lists
 * @param {*} peers
 */
function msgerAddPeers(peers) {
    // console.log("peers", peers);
    // add all current Participants
    for (let peer_id in peers) {
        let peer_name = peers[peer_id]['peer_name'];
        // bypass insert to myself in the list :)
        if (peer_name != myPeerName) {
            let exsistMsgerPrivateDiv = getId(peer_id + '_pMsgDiv');
            // if there isn't add it....
            if (!exsistMsgerPrivateDiv) {
                let msgerPrivateDiv = `
                <div id="${peer_id}_pMsgDiv" class="msger-peer-inputarea">
                    <input
                        id="${peer_id}_pMsgInput"
                        class="msger-input"
                        type="text"
                        placeholder="💬 Enter your message..."
                    />
                    <button id="${peer_id}_pMsgBtn" class="fas fa-paper-plane" value="${peer_name}">&nbsp;${peer_name}</button>
                </div>
                `;
                msgerCPList.insertAdjacentHTML('beforeend', msgerPrivateDiv);
                msgerCPList.scrollTop += 500;

                let msgerPrivateMsgInput = getId(peer_id + '_pMsgInput');
                let msgerPrivateBtn = getId(peer_id + '_pMsgBtn');
                addMsgerPrivateBtn(msgerPrivateBtn, msgerPrivateMsgInput);
            }
        }
    }
}

/**
 * Search peer by name in chat room lists to send the private messages
 */
function searchPeer() {
    let searchPeerBarName = getId('searchPeerBarName').value;
    let msgerPeerInputarea = getEcN('msger-peer-inputarea');
    searchPeerBarName = searchPeerBarName.toLowerCase();
    for (let i = 0; i < msgerPeerInputarea.length; i++) {
        if (!msgerPeerInputarea[i].innerHTML.toLowerCase().includes(searchPeerBarName)) {
            msgerPeerInputarea[i].style.display = 'none';
        } else {
            msgerPeerInputarea[i].style.display = 'flex';
        }
    }
}

/**
 * Remove participant from chat room lists
 * @param {*} peer_id
 */
function msgerRemovePeer(peer_id) {
    let msgerPrivateDiv = getId(peer_id + '_pMsgDiv');
    if (msgerPrivateDiv) {
        let peerToRemove = msgerPrivateDiv.firstChild;
        while (peerToRemove) {
            msgerPrivateDiv.removeChild(peerToRemove);
            peerToRemove = msgerPrivateDiv.firstChild;
        }
        msgerPrivateDiv.remove();
    }
}

/**
 * Setup msger buttons to send private messages
 * @param {*} msgerPrivateBtn
 * @param {*} msgerPrivateMsgInput
 */
function addMsgerPrivateBtn(msgerPrivateBtn, msgerPrivateMsgInput) {
    // add button to send private messages
    msgerPrivateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let pMsg = msgerPrivateMsgInput.value;
        if (!pMsg) return;
        let toPeerName = msgerPrivateBtn.value;
        emitMsg(myPeerName, toPeerName, pMsg, true);
        appendMessage(myPeerName, rightChatAvatar, 'right', pMsg + '<br/><hr>Private message to ' + toPeerName, true, false);
        msgerPrivateMsgInput.value = '';
        msgerCP.style.display = 'none';
    });
}

/**
 * Detect url from text and make it clickable
 * Detect also if url is a img to create preview of it
 * @param {*} text
 * @returns html
 */
function detectUrl(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        if (isImageURL(text)) return '<p><img src="' + url + '" alt="img" width="200" height="auto"/></p>';
        return '<a id="chat-msg-a" href="' + url + '" target="_blank">' + url + '</a>';
    });
}

/**
 * Check if url passed is a image
 * @param {*} url
 * @returns true/false
 */
function isImageURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png|tiff|bmp)$/) != null;
}

/**
 * Format data h:m:s
 * @param {*} date
 */
function getFormatDate(date) {
    const time = date.toTimeString().split(' ')[0];
    return `${time}`;
}

/**
 * Send message over Secure dataChannels
 * @param {*} from
 * @param {*} to
 * @param {*} msg
 * @param {*} privateMsg true/false
 */
function emitMsg(from, to, msg, privateMsg) {
    if (!msg) return;

    let chatMessage = {
        from: from,
        to: to,
        msg: msg,
        privateMsg: privateMsg,
    };
    console.log('Send msg', chatMessage);

    // Send chat msg through RTC Data Channels
    for (let peer_id in chatDataChannels) {
        if (chatDataChannels[peer_id].readyState === 'open')
            chatDataChannels[peer_id].send(JSON.stringify(chatMessage));
    }
}

/**
 * Hide - Show emoji picker div
 */
function hideShowEmojiPicker() {
    if (!isChatEmojiVisible) {
        // playSound('newMessage');
        msgerEmojiPicker.style.display = 'block';
        isChatEmojiVisible = true;
        return;
    }
    msgerEmojiPicker.style.display = 'none';
    isChatEmojiVisible = false;
}

/**
 * Download Chat messages in json format
 * https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
function downloadChatMsgs() {
    let a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chatMessages, null, 1));
    a.download = getDataTimeString() + '-CHAT.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Hide - show my settings
 */
function hideShowMySettings() {
    if (!isMySettingsVisible) {
        // playSound('newMessage');
        // adapt it for mobile
        if (isMobileDevice) {
            mySettings.style.setProperty('width', '90%');
            document.documentElement.style.setProperty('--mySettings-select-w', '99%');
        }
        // my current peer name
        myPeerNameSet.placeholder = myPeerName;
        // center screen on show
        mySettings.style.top = '50%';
        mySettings.style.left = '50%';
        mySettings.style.display = 'block';
        isMySettingsVisible = true;
        return;
    }
    mySettings.style.display = 'none';
    isMySettingsVisible = false;
}

/**
 * Handle html tab settings
 * https://www.w3schools.com/howto/howto_js_tabs.asp
 *
 * @param {*} evt
 * @param {*} tabName
 */
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = getEcN('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = getEcN('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    getId(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

/**
 * Update myPeerName to other peers in the room
 */
function updateMyPeerName() {
    let myNewPeerName = myPeerNameSet.value;
    let myOldPeerName = myPeerName;

    // myNewPeerName empty
    if (!myNewPeerName) return;

    myPeerName = myNewPeerName;
    myVideoParagraph.innerHTML = myPeerName;

    sendToServer('peerName', {
        room_id: roomId,
        peer_name_old: myOldPeerName,
        peer_name_new: myPeerName,
    });

    myPeerNameSet.value = '';
    myPeerNameSet.placeholder = myPeerName;

    setPeerAvatarImgName('myVideoAvatarImage', myPeerName);
    setPeerChatAvatarImgName('right', myPeerName);
    userLog('toast', 'My name changed to ' + myPeerName);
}

/**
 * Append updated peer name to video player
 * @param {*} config
 */
function handlePeerName(config) {
    let peer_id = config.peer_id;
    let peer_name = config.peer_name;
    let peer_icon = config.peer_icon;
    let videoName = getId(peer_id + '_name');
    if (videoName) videoName.innerHTML = peer_name;
    // change also btn value - name on chat lists....
    let msgerPeerName = getId(peer_id + '_pMsgBtn');
    if (msgerPeerName) {
        msgerPeerName.innerHTML = `&nbsp;${peer_name}`;
        msgerPeerName.value = peer_name;
    }
    // refresh also peer video avatar name
    setPeerAvatarImgName(peer_id + '_avatar', peer_icon);
}

/**
 * Send my Video-Audio-Hand... status
 * @param {*} element
 * @param {*} status
 */
function emitPeerStatus(element, status) {
    sendToServer('peerStatus', {
        room_id: roomId,
        peer_name: myPeerName,
        element: element,
        status: status,
    });
}

/**
 * Set my Hand Status and Icon
 */
function setMyHandStatus() {
    if (myHandStatus) {
        // Raise hand
        myHandStatus = false;
        if (!isMobileDevice) {
            tippy(raiseHandBtn, {
                content: 'RAISE your hand',
                placement: 'right-start',
            });
        }
    } else {
        // Lower hand
        myHandStatus = true;
        if (!isMobileDevice) {
            tippy(raiseHandBtn, {
                content: 'LOWER your hand',
                placement: 'right-start',
            });
        }
        // playSound('raiseHand');
    }
    raiseHandBtn.className = myHandStatus ? 'control-btn selected' : 'control-btn';
    emitPeerStatus('hand', myHandStatus);
}

/**
 * Set My Audio Status Icon and Title
 * @param {*} status
 */
function setMyAudioStatus(status) {
    myAudioStatusIcon.className = 'fas fa-microphone' + (status ? '' : '-slash');
    // send my audio status to all peers in the room
    emitPeerStatus('audio', status);
    tippy(myAudioStatusIcon, {
        content: status ? 'My audio is ON' : 'My audio is OFF',
    });
    var localAudioObj = document.getElementById('localAudioOption');
    if(typeof localAudioObj !== null && localAudioObj !== 'undefined' && localAudioObj !== null ) {
        if( status )
            localAudioObj.innerHTML = '<img src="/images/ico_small_mic2.svg" />';
        else
            localAudioObj.innerHTML = '<img src="/images/ico_small_mic1.svg" />';
    }
    // status ? playSound('on') : playSound('off');
    // only for desktop
    /* if (!isMobileDevice) {
        tippy(audioBtn, {
            content: status ? 'Click to audio OFF' : 'Click to audio ON',
            placement: 'right-start',
        });
    } */
}

/**
 * Set My Video Status Icon and Title
 * @param {*} status
 */
function setMyVideoStatus(status) {
    // on vdeo OFF display my video avatar name
    myVideoAvatarImage.style.display = status ? 'none' : 'block';
    myVideoStatusIcon.className = 'fas fa-video' + (status ? '' : '-slash');
    emitPeerStatus('video', status);
    var localCameraObj = document.getElementById('localCameraOption');
    if(typeof localCameraObj !== null && localCameraObj !== 'undefined' && localCameraObj != null) {
        if( status )
            localCameraObj.innerHTML = '<img src="/images/ico_small_camera2.svg" />';
        else
            localCameraObj.innerHTML = '<img src="/images/ico_small_camera1.svg" />';
    }
    // send my video status to all peers in the room
    
    tippy(myVideoStatusIcon, {
        content: status ? 'My video is ON' : 'My video is OFF',
    });
    // status ? playSound('on') : playSound('off');
    // only for desktop
    /* if (!isMobileDevice) {
        tippy(videoBtn, {
            content: status ? 'Click to video OFF' : 'Click to video ON',
            placement: 'right-start',
        });
    } */
}

/**
 * Handle peer audio - video - hand status
 * @param {*} config
 */
function handlePeerStatus(config) {
    //
    let peer_id = config.peer_id;
    let peer_name = config.peer_name;
    let element = config.element;
    let status = config.status;

    switch (element) {
        case 'video':
            setPeerVideoStatus(peer_id, status);
            break;
        case 'audio':
            setPeerAudioStatus(peer_id, status);
            break;
        case 'hand':
            setPeerHandStatus(peer_id, peer_name, status);
            break;
    }
}

/**
 * Set Participant Hand Status Icon and Title
 * @param {*} peer_id
 * @param {*} peer_name
 * @param {*} status
 */
function setPeerHandStatus(peer_id, peer_name, status) {
    /* let peerHandStatus = getId(peer_id + '_handStatus');
    peerHandStatus.style.display = status ? 'block' : 'none'; */
    if (status) {
        userLog('toast', peer_name + ' has raised the hand');
        // playSound('raiseHand');
    }
}

/**
 * Set Participant Video Status Icon and Title
 * @param {*} peer_id
 * @param {*} status
 */
 function setPeerVideoStatus(peer_id, status) {
    /* let peerVideoAvatarImage = getId(peer_id + '_avatar');
    let peerVideoStatus = getId(peer_id + '_videoSideStatus');
    peerVideoStatus.className = 'fas fa-video' + (status ? '' : '-slash');
    peerVideoAvatarImage.style.display = status ? 'none' : 'block';
    tippy(peerVideoStatus, {
        content: status ? 'Participant video is ON' : 'Participant video is OFF',
    }); */
    // status ? playSound('on') : playSound('off');
}

/**
 * Set Participant Audio Status Icon and Title
 * @param {*} peer_id
 * @param {*} status
 */
function setPeerAudioStatus(peer_id, status) {
    /* let peerAudioStatus = getId(peer_id + '_audioStatus');
    peerAudioStatus.className = 'fas fa-microphone' + (status ? '' : '-slash');
    tippy(peerAudioStatus, {
        content: status ? 'Participant audio is ON' : 'Participant audio is OFF',
    }); */
    // status ? playSound('on') : playSound('off');
}

/**
 * Mute Audio to specific user in the room
 * @param {*} peer_id
 */
function handlePeerAudioBtn(peer_id) {
    let peerAudioBtn = getId(peer_id + '_audioSideStatus');
    if(typeof peerAudioBtn !== null && peerAudioBtn !== 'undefined' && peerAudioBtn !== null) {
        peerAudioBtn.onclick = () => {
            if (peerAudioBtn.className === 'audio-on') {
                disablePeer(peer_id, 'audio', peerAudioBtn);
            }
        };
    }
}

/**
 * Hide Video to specific user in the room
 * @param {*} peer_id
 */
function handlePeerVideoBtn(peer_id) {
    let peerVideoBtn = getId(peer_id + '_videoSideStatus');
    peerVideoBtn.onclick = () => {
        if (peerVideoBtn.className === 'video-on') {
            disablePeer(peer_id, 'video', peerVideoBtn);
        }
    };
}

/**
 * Send Private Message to specific peer
 * @param {*} peer_id
 * @param {*} toPeerName
 */
function handlePeerPrivateMsg(peer_id, toPeerName) {
    let peerPrivateMsg = getId(peer_id + '_privateMsg');
    peerPrivateMsg.onclick = (e) => {
        e.preventDefault();
        Swal.fire({
            background: swalBackground,
            position: 'center',
            imageUrl: messageImg,
            title: 'Send private message',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: `Send`,
            customClass: {
                title: 'popup-title',
                htmlContainer: 'popup-text',
                confirmButton: 'popup-confirm-btn',
                denyButton: 'popup-deny-btn',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.value) {
                let pMsg = result.value;
                emitMsg(myPeerName, toPeerName, pMsg, true);
                appendMessage(
                    myPeerName,
                    rightChatAvatar,
                    'left',
                    pMsg + '<br/><hr>Private message to ' + toPeerName,
                    true,
                    false
                );
                userLog('toast', 'Message sent to ' + toPeerName + ' 👍');
            }
        });
    };
}

/**
 * Send YouTube video to specific peer
 * @param {*} peer_id
 */
function handlePeerYouTube(peer_id) {
    let peerYoutubeBtn = getId(peer_id + '_youtube');
    peerYoutubeBtn.onclick = () => {
        sendVideoUrl(peer_id);
    };
}

/**
 * Emit actions to all peers in the same room except yourself
 * @param {*} peerAction muteAudio hideVideo start/stop recording ...
 */
function emitPeersAction(peerAction) {
    if (!thereIsPeerConnections()) return;

    sendToServer('peerAction', {
        room_id: roomId,
        peer_name: myPeerName,
        peer_id: null,
        peer_action: peerAction,
    });
}

/**
 * Emit actions to specified peers in the same room
 * @param {*} peer_id
 * @param {*} peerAction
 */
function emitPeerAction(peer_id, peerAction) {
    if (!thereIsPeerConnections()) return;

    sendToServer('peerAction', {
        room_id: roomId,
        peer_id: peer_id,
        peer_name: myPeerName,
        peer_action: peerAction,
    });
}

/**
 * Handle received peer actions
 * @param {*} config
 */
function handlePeerAction(config) {
    let peer_name = config.peer_name;
    let peer_action = config.peer_action;

    switch (peer_action) {
        case 'muteAudio':
            setMyAudioOff(peer_name);
            break;
        case 'hideVideo':
            setMyVideoOff(peer_name);
            break;
        case 'recStart':
            notifyRecording(peer_name, 'Started');
            break;
        case 'recStop':
            notifyRecording(peer_name, 'Stopped');
            break;
    }
}

/**
 * Set my Audio off and Popup the peer name that performed this action
 */
function setMyAudioOff(peer_name) {
    if (myAudioStatus === false) return;
    localMediaStream.getAudioTracks()[0].enabled = false;
    myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
    audioBtn.className = 'fas fa-microphone-slash';
    setMyAudioStatus(myAudioStatus);
    userLog('toast', peer_name + ' has disabled your audio');
    // playSound('off');
}

/**
 * Set my Video off and Popup the peer name that performed this action
 */
function setMyVideoOff(peer_name) {
    if (myVideoStatus === false) return;
    localMediaStream.getVideoTracks()[0].enabled = false;
    myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
    videoBtn.className = 'fas fa-video-slash';
    setMyVideoStatus(myVideoStatus);
    userLog('toast', peer_name + ' has disabled your video');
    // playSound('off');
}

/**
 * Mute or Hide everyone except yourself
 * @param {*} element audio/video
 */
function disableAllPeers(element) {
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }
    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageUrl: element == 'audio' ? audioOffImg : camOffImg,
        title: element == 'audio' ? 'Mute everyone except yourself?' : 'Hide everyone except yourself?',
        text:
            element == 'audio'
                ? "Once muted, you won't be able to unmute them, but they can unmute themselves at any time."
                : "Once hided, you won't be able to unhide them, but they can unhide themselves at any time.",
        showDenyButton: true,
        confirmButtonText: element == 'audio' ? `Mute` : `Hide`,
        denyButtonText: `Cancel`,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            switch (element) {
                case 'audio':
                    // userLog('toast', 'Mute everyone 👍');
                    emitPeersAction('muteAudio');
                    break;
                case 'video':
                    // userLog('toast', 'Hide everyone 👍');
                    emitPeersAction('hideVideo');
                    break;
            }
        }
    });
}

/**
 * Mute or Hide specific peer
 * @param {*} peer_id
 * @param {*} element audio/video
 */
function disablePeer(peer_id, element, obj) {
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }
    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageUrl: element == 'audio' ? audioOffImg : camOffImg,
        title: element == 'audio' ? 'Mute this participant?' : 'Hide this participant?',
        text:
            element == 'audio'
                ? "Once muted, you won't be able to unmute them, but they can unmute themselves at any time."
                : "Once hided, you won't be able to unhide them, but they can unhide themselves at any time.",
        showDenyButton: true,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        confirmButtonText: element == 'audio' ? `Mute` : `Hide`,
        denyButtonText: `Cancel`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            switch (element) {
                case 'audio':
                    obj.className = 'audio-off';
                    obj.innerHTML = '<img src="/images/ico_small_mic1.svg">';
                    // userLog('toast', 'Mute audio 👍');
                    emitPeerAction(peer_id, 'muteAudio');
                    break;
                case 'video':
                    obj.className = 'video-off';
                    obj.innerHTML = '<img src="/images/ico_small_camera1.svg">';
                    // userLog('toast', 'Hide video 👍');
                    emitPeerAction(peer_id, 'hideVideo');
                    break;
            }
        }
    });
}

/**
 * Lock Unlock the room from unauthorized access
 */
function lockUnlockRoom() {
    // lockUnlockRoomBtn.className = roomLocked ? 'fas fa-lock-open' : 'fas fa-lock';
    lockUnlockRoomBtn.innerHTML = roomLocked ? 'Lock Meeting' : 'Unlock Meeting';

    if (roomLocked) {
        roomLocked = false;
        emitRoomStatus();
    } else {
        roomLocked = true;
        emitRoomStatus();
        // playSound('locked');
    }
}

/**
 * Refresh Room Status (Locked/Unlocked)
 */
function emitRoomStatus() {
    let rStatus = roomLocked ? '🔒 LOCKED the room, no one can access!' : '🔓 UNLOCKED the room';
    userLog('toast', rStatus);

    sendToServer('roomStatus', {
        room_id: roomId,
        room_locked: roomLocked,
        peer_name: myPeerName,
    });
}

/**
 * Handle Room Status (Lock - Unlock)
 * @param {*} config
 */
function handleRoomStatus(config) {
    let peer_name = config.peer_name;
    let room_locked = config.room_locked;
    roomLocked = room_locked;
    lockUnlockRoomBtn.className = roomLocked ? 'fas fa-lock' : 'fas fa-lock-open';
    userLog('toast', peer_name + ' set room is locked to ' + roomLocked);
}

/**
 * Room is Locked can't access...
 */
function handleRoomLocked() {
    // playSound('kickedOut');

    Swal.fire({
        allowOutsideClick: false,
        background: swalBackground,
        position: 'center',
        imageUrl: roomLockedImg,
        title: 'Oops, Room Locked',
        text: 'The room is locked, try with another one.',
        showDenyButton: false,
        confirmButtonText: `Ok`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) window.location.href = '/';
    });
}

/**
 * Handle whiteboard events
 * @param {*} config
 */
function handleWhiteboard(config) {
    //
    let peer_name = config.peer_name;
    let act = config.act;

    if (isMobileDevice) return;
    switch (act) {
        case 'draw':
            drawRemote(config);
            break;
        case 'clean':
            userLog('toast', peer_name + ' has cleaned the board');
            whiteboardClean();
            break;
        case 'open':
            userLog('toast', peer_name + ' has opened the board');
            whiteboardOpen();
            break;
        case 'close':
            userLog('toast', peer_name + ' has closed the board');
            whiteboardClose();
            break;
        case 'resize':
            userLog('toast', peer_name + ' has resized the board');
            whiteboardResize();
            break;
    }
}

/**
 * Whiteboard draggable
 */
function setWhiteboardDraggable() {
    dragElement(whiteboardCont, whiteboardHeader);
}

/**
 * Whiteboard Open
 */
function whiteboardOpen() {
    if (!isWhiteboardVisible) {
        setWhiteboardDraggable();
        setColor('#ffffff'); // color picker
        whiteboardCont.style.top = '50%';
        whiteboardCont.style.left = '50%';
        whiteboardCont.style.display = 'block';
        isWhiteboardVisible = true;
        drawsize = 3;
        fitToContainer(canvas);
        tippy(whiteboardBtn, {
            content: 'CLOSE the whiteboard',
            placement: 'right-start',
        });
        // playSound('newMessage');
    }
}

/**
 * Whiteboard close
 */
function whiteboardClose() {
    if (isWhiteboardVisible) {
        whiteboardCont.style.display = 'none';
        isWhiteboardVisible = false;
        tippy(whiteboardBtn, {
            content: 'OPEN the whiteboard',
            placement: 'right-start',
        });
    }
}

/**
 * Whiteboard resize
 */
function whiteboardResize() {
    let content;
    whiteboardCont.style.top = '50%';
    whiteboardCont.style.left = '50%';
    if (isWhiteboardFs) {
        document.documentElement.style.setProperty('--wb-width', '800px');
        document.documentElement.style.setProperty('--wb-height', '600px');
        fitToContainer(canvas);
        whiteboardFsBtn.className = 'fas fa-expand-alt';
        content = 'VIEW full screen';
        isWhiteboardFs = false;
    } else {
        document.documentElement.style.setProperty('--wb-width', '99%');
        document.documentElement.style.setProperty('--wb-height', '99%');
        fitToContainer(canvas);
        whiteboardFsBtn.className = 'fas fa-compress-alt';
        content = 'EXIT full screen';
        isWhiteboardFs = true;
    }
    tippy(whiteboardFsBtn, {
        content: content,
        placement: 'bottom',
    });
}

/**
 * Whiteboard clean
 */
function whiteboardClean() {
    if (isWhiteboardVisible) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Set whiteboard color
 * @param {*} newcolor
 */
function setColor(newcolor) {
    color = newcolor;
    drawsize = 3;
    whiteboardColorPicker.value = color;
}

/**
 * Whiteboard eraser
 */
function setEraser() {
    color = '#777982';
    drawsize = 25;
    whiteboardColorPicker.value = color;
}

/**
 * Clean whiteboard content
 */
function confirmCleanBoard() {
    // playSound('newMessage');

    Swal.fire({
        background: swalBackground,
        position: 'center',
        title: 'Clean the board',
        text: 'Are you sure you want to clean the board?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            whiteboardClean();
            remoteWbAction('clean');
        }
    });
}

/**
 * Draw on whiteboard
 * @param {*} newx
 * @param {*} newy
 * @param {*} oldx
 * @param {*} oldy
 */
function draw(newx, newy, oldx, oldy) {
    ctx.strokeStyle = color;
    ctx.lineWidth = drawsize;
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(newx, newy);
    ctx.stroke();
    ctx.closePath();
}

/**
 * Draw Remote whiteboard
 * @param {*} config draw coordinates, color and size
 */
function drawRemote(config) {
    if (!isWhiteboardVisible) return;

    ctx.strokeStyle = config.color;
    ctx.lineWidth = config.size;
    ctx.beginPath();
    ctx.moveTo(config.prevx, config.prevy);
    ctx.lineTo(config.newx, config.newy);
    ctx.stroke();
    ctx.closePath();
}

/**
 * Resize canvas
 * @param {*} canvas
 */
function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

/**
 * Handle whiteboard on windows resize, here i lose drawing, Todo fix it
 */
function reportWindowSize() {
    fitToContainer(canvas);
}

/**
 * Whiteboard setup
 */
function setupCanvas() {
    fitToContainer(canvas);

    // whiteboard touch listeners
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('touchend', touchEnd);

    // whiteboard mouse listeners
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseup', mouseUp);

    function mouseDown(e) {
        startDrawing(e.offsetX, e.offsetY);
    }

    function touchStart(e) {
        startDrawing(e.touches[0].pageX, e.touches[0].pageY);
    }

    function mouseMove(e) {
        if (!isDrawing) return;

        draw(e.offsetX, e.offsetY, x, y);
        sendDrawRemote(e.offsetX, e.offsetY, x, y);

        x = e.offsetX;
        y = e.offsetY;
    }

    function touchMove(e) {
        if (!isDrawing) return;

        draw(e.touches[0].pageX, e.touches[0].pageY, x, y);
        sendDrawRemote(e.touches[0].pageX, e.touches[0].pageY, x, y);

        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
    }

    function mouseUp() {
        stopDrawing();
    }

    function touchEnd(e) {
        stopDrawing();
    }

    window.onresize = reportWindowSize;
}

/**
 * Start to driwing
 * @param {*} ex
 * @param {*} ey
 */
function startDrawing(ex, ey) {
    x = ex;
    y = ey;
    isDrawing = true;
}

/**
 * Send drawing coordinates to other peers in the room
 * @param {*} newx
 * @param {*} newy
 * @param {*} ex
 * @param {*} ey
 */
function sendDrawRemote(newx, newy, ex, ey) {
    if (thereIsPeerConnections()) {
        sendToServer('wb', {
            room_id: roomId,
            peer_name: myPeerName,
            act: 'draw',
            newx: newx,
            newy: newy,
            prevx: ex,
            prevy: ey,
            color: color,
            size: drawsize,
        });
    }
}

/**
 * Stop to drawing
 */
function stopDrawing() {
    if (isDrawing) isDrawing = false;
}

/**
 * Save whiteboard canvas to file as png
 */
function saveWbCanvas() {
    // Improve it if erase something...
    let link = document.createElement('a');
    link.download = getDataTimeString() + 'WHITEBOARD.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

/**
 * Remote whiteboard actions
 * @param {*} action
 */
function remoteWbAction(action) {
    if (thereIsPeerConnections()) {
        sendToServer('wb', {
            room_id: roomId,
            peer_name: myPeerName,
            act: action,
        });
    }
}

/**
 * Create File Sharing Data Channel
 * @param {*} peer_id
 */
function createFileSharingDataChannel(peer_id) {
    fileDataChannels[peer_id] = peerConnections[peer_id].createDataChannel('Shuffle_file_sharing_channel');
    fileDataChannels[peer_id].binaryType = 'arraybuffer';
    fileDataChannels[peer_id].onopen = (event) => {
        console.log('fileDataChannels created', event);
    };
}

/**
 * Handle File Sharing
 * @param {*} data
 */
function handleDataChannelFileSharing(data) {
    receiveBuffer.push(data);
    receivedSize += data.byteLength;

    // let getPercentage = ((receivedSize / incomingFileInfo.fileSize) * 100).toFixed(2);
    // console.log("Received progress: " + getPercentage + "%");

    if (receivedSize === incomingFileInfo.fileSize) {
        incomingFileData = receiveBuffer;
        receiveBuffer = [];
        endDownload();
    }
}

/**
 * Send File Data trought datachannel
 * https://webrtc.github.io/samples/src/content/datachannel/filetransfer/
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/filetransfer/js/main.js
 */
function sendFileData() {
    console.log('Send file ' + fileToSend.name + ' size ' + bytesToSize(fileToSend.size) + ' type ' + fileToSend.type);

    sendInProgress = true;

    sendFileInfo.innerHTML =
        'File name: ' +
        fileToSend.name +
        '<br>' +
        'File type: ' +
        fileToSend.type +
        '<br>' +
        'File size: ' +
        bytesToSize(fileToSend.size) +
        '<br>';

    sendFileDiv.style.display = 'inline';
    sendProgress.max = fileToSend.size;
    fileReader = new FileReader();
    let offset = 0;

    fileReader.addEventListener('error', (err) => console.error('fileReader error', err));
    fileReader.addEventListener('abort', (e) => console.log('fileReader aborted', e));
    fileReader.addEventListener('load', (e) => {
        if (!sendInProgress) return;

        // peer to peer over DataChannels
        sendFSData(e.target.result);
        offset += e.target.result.byteLength;

        sendProgress.value = offset;
        sendFilePercentage.innerHTML = 'Send progress: ' + ((offset / fileToSend.size) * 100).toFixed(2) + '%';

        // send file completed
        if (offset === fileToSend.size) {
            sendInProgress = false;
            sendFileDiv.style.display = 'none';
            userLog('success', 'The file ' + fileToSend.name + ' was sent successfully.');
        }

        if (offset < fileToSend.size) readSlice(offset);
    });
    const readSlice = (o) => {
        const slice = fileToSend.slice(offset, o + chunkSize);
        fileReader.readAsArrayBuffer(slice);
    };
    readSlice(0);
}

/**
 * Send File through RTC Data Channels
 * @param {*} data fileReader e.target.result
 */
function sendFSData(data) {
    for (let peer_id in fileDataChannels) {
        if (fileDataChannels[peer_id].readyState === 'open') fileDataChannels[peer_id].send(data);
    }
}

/**
 * Abort the file transfer
 */
function abortFileTransfer() {
    if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
        sendFileDiv.style.display = 'none';
        sendInProgress = false;
        sendToServer('fileAbort', {
            room_id: roomId,
            peer_name: myPeerName,
        });
    }
}

/**
 * File Transfer aborted by peer
 */
function handleFileAbort() {
    receiveBuffer = [];
    incomingFileData = [];
    receivedSize = 0;
    console.log('File transfer aborted');
    userLog('toast', '⚠️ File transfer aborted');
}

/**
 * Select the File to Share
 */
function selectFileToShare() {
    // playSound('newMessage');

    shareFileBtn.className = 'control-btn selected';

    Swal.fire({
        allowOutsideClick: false,
        background: swalBackground,
        imageAlt: 'Shuffle-file-sharing',
        position: 'center',
        title: 'Share the file',
        text: 'Click "Choose a File" to upload a file to your meeting',
        input: 'file',
        inputAttributes: {
            accept: fileSharingInput,
            'aria-label': 'Select the file',
        },
        showDenyButton: true,
        confirmButtonText: `Send`,
        denyButtonText: `Cancel`,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            shareFileBtn.className = "control-btn";
            fileToSend = result.value;
            if (fileToSend && fileToSend.size > 0) {
                // no peers in the room
                if (!thereIsPeerConnections()) {
                    userLog('info', 'No participants detected');
                    return;
                }
                // send some metadata about our file to peers in the room
                sendToServer('fileInfo', {
                    room_id: roomId,
                    peer_name: myPeerName,
                    file: {
                        fileName: fileToSend.name,
                        fileSize: fileToSend.size,
                        fileType: fileToSend.type,
                    },
                });
                // send the File
                setTimeout(() => {
                    sendFileData();
                }, 1000);
            } else {
                userLog('error', 'File not selected or empty.');
            }
        } else if(result.isDenied) {
            shareFileBtn.className = "control-btn";
        }
    });
}

/**
 * Get remote file info
 * @param {*} config file
 */
function handleFileInfo(config) {
    incomingFileInfo = config;
    incomingFileData = [];
    receiveBuffer = [];
    receivedSize = 0;
    let fileToReceiveInfo =
        ' From: ' +
        incomingFileInfo.peerName +
        '\n' +
        ' incoming file: ' +
        incomingFileInfo.fileName +
        '\n' +
        ' size: ' +
        bytesToSize(incomingFileInfo.fileSize) +
        '\n' +
        ' type: ' +
        incomingFileInfo.fileType;
    console.log(fileToReceiveInfo);
    userLog('toast', fileToReceiveInfo);
}

/**
 * The file will be saved in the Blob. You will be asked to confirm if you want to save it on your PC / Mobile device.
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob
 */
function endDownload() {
    // playSound('download');

    // save received file into Blob
    const blob = new Blob(incomingFileData);
    const file = incomingFileInfo.fileName;

    incomingFileData = [];

    // if file is image, show the preview
    if (isImageURL(incomingFileInfo.fileName)) {
        const reader = new FileReader();
        reader.onload = (e) => {
            Swal.fire({
                allowOutsideClick: false,
                background: swalBackground,
                position: 'center',
                title: 'Received file',
                text: incomingFileInfo.fileName + ' size ' + bytesToSize(incomingFileInfo.fileSize),
                imageUrl: e.target.result,
                imageAlt: 'Shuffle-file-img-download',
                showDenyButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Cancel`,
                customClass: {
                    title: 'popup-title',
                    htmlContainer: 'popup-text',
                    confirmButton: 'popup-confirm-btn',
                    denyButton: 'popup-deny-btn',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            }).then((result) => {
                if (result.isConfirmed) saveBlobToFile(blob, file);
            });
        };
        // blob where is stored downloaded file
        reader.readAsDataURL(blob);
    } else {
        // not img file
        Swal.fire({
            allowOutsideClick: false,
            background: swalBackground,
            imageAlt: 'Shuffle-file-download',
            position: 'center',
            title: 'Received file',
            text: incomingFileInfo.fileName + ' size ' + bytesToSize(incomingFileInfo.fileSize),
            showDenyButton: true,
            confirmButtonText: `Save`,
            denyButtonText: `Cancel`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) saveBlobToFile(blob, file);
        });
    }
}

/**
 * Save to PC / Mobile devices
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * @param {*} blob
 * @param {*} file
 */
function saveBlobToFile(blob, file) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Hide show game iFrame
 */
function toggleGame() {
    if (isGameOpen) {
        gameCont.style.display = 'none';
        isGameOpen = false;
    } else {
        gameCont.style.display = 'flex';
        gameCont.style.top = '50%';
        gameCont.style.left = '50%';
        isGameOpen = true;
    }
}

/**
 * Opend and send Video URL to all peers in the room
 *
 */
function sendVideoUrl(peer_id = null) {
    // playSound('newMessage');

    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageUrl: youtubeImg,
        title: 'Share YouTube Video',
        text: 'Past YouTube video URL',
        input: 'text',
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showCancelButton: true,
        confirmButtonText: `Share`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.value) {
            if (!thereIsPeerConnections()) {
                userLog('info', 'No participants detected');
                return;
            }
            console.log('Video URL: ' + result.value);
            let config = {
                video_src: result.value,
                peer_id: peer_id,
            };
            openVideoUrlPlayer(config);
            emitVideoPlayer('open', config);
        }
    });
}

/**
 * Open video url Player
 */
function openVideoUrlPlayer(config) {
    let videoSrc = config.video_src;
    let videoEmbed = getYoutubeEmbed(videoSrc);
    //
    if (!isVideoUrlPlayerOpen) {
        if (videoEmbed) {
            // playSound('newMessage');
            videoUrlIframe.src = videoEmbed;
            videoUrlCont.style.display = 'flex';
            isVideoUrlPlayerOpen = true;
        } else {
            userLog('error', 'Something wrong, try with another Youtube URL');
        }
    } else {
        // video player seems open
        videoUrlIframe.src = videoEmbed;
    }
}

/**
 * Get youtube embed URL
 * @param {*} url
 * @returns Youtube Embed URL
 */
function getYoutubeEmbed(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return match && match[7].length == 11 ? 'https://www.youtube.com/embed/' + match[7] + '?autoplay=1' : false;
}

/**
 * Close Video Url Player
 */
function closeVideoUrlPlayer() {
    // Reload all iframes again to stop videos & disable autoplay
    videoUrlIframe.src = videoUrlIframe.src.replace('?autoplay=1', '');
    videoUrlCont.style.display = 'none';
    isVideoUrlPlayerOpen = false;
}

/**
 * Emit video palyer to peers
 * @param {*} video_action
 * @param {*} config
 */
function emitVideoPlayer(video_action, config = {}) {
    sendToServer('videoPlayer', {
        room_id: roomId,
        peer_name: myPeerName,
        video_action: video_action,
        video_src: config.video_src,
        peer_id: config.peer_id,
    });
}

/**
 * Handle Video Player
 * @param {*} config
 */
function handleVideoPlayer(config) {
    let peer_name = config.peer_name;
    let video_action = config.video_action;
    //
    switch (video_action) {
        case 'open':
            userLog('toast', peer_name + ' open video player');
            openVideoUrlPlayer(config);
            break;
        case 'close':
            userLog('toast', peer_name + ' close video player');
            closeVideoUrlPlayer();
            break;
    }
}

/**
 * Handle peer kick out event button
 * @param {*} peer_id
 */
function handlePeerKickOutBtn(peer_id) {
    let peerKickOutBtn = getId(peer_id + '_kickOut');
    peerKickOutBtn.addEventListener('click', (e) => {
        kickOut(peer_id);
    });
}

/**
 * Kick out confirm
 * @param {*} peer_id
 * @param {*} peerKickOutBtn
 */
function kickOut(peer_id) {
    let pName = getId(peer_id + '_name').innerHTML;

    Swal.fire({
        background: swalBackground,
        position: 'center',
        title: 'Kick out ' + pName,
        text: 'Are you sure you want to kick out this participant?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // send peer to kick out from room
            sendToServer('kickOut', {
                room_id: roomId,
                peer_id: peer_id,
                peer_name: myPeerName,
            });
        }
    });
}

/**
 * You will be kicked out from the room and popup the peer name that performed this action
 * @param {*} config
 */
function handleKickedOut(config) {
    let peer_name = config.peer_name;

    // playSound('kickedOut');

    let timerInterval;

    Swal.fire({
        allowOutsideClick: false,
        background: swalBackground,
        position: 'center',
        title: 'Kicked out!',
        html:
            `<h2>` +
            `User ` +
            peer_name +
            `</h2> will kick out you after <b style="color: red;"></b> milliseconds.`,
        timer: 10000,
        timerProgressBar: true,
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer();
                if (content) {
                    const b = content.querySelector('b');
                    if (b) b.textContent = Swal.getTimerLeft();
                }
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then(() => {
        window.location.href = '/';
    });
}

/**
 * Shuffle about info
 */
function showAbout() {
    // playSound('newMessage');

    Swal.fire({
        background: swalBackground,
        position: 'center',
        title: '<strong>WebRTC Made with ❤️</strong>',
        imageAlt: 'Shuffle-about',
        html: `
        <br/>
        <div id="about">
            <b>Open Source</b> project on
            <a href="https://github.com/miroslavpejic85/Shuffle" target="_blank"><br/></br>
            <img alt="Shuffle github" src="../images/github.png"></a><br/><br/>
            <button class="far fa-heart pulsate" onclick="window.open('https://github.com/sponsors/miroslavpejic85?o=esb')"> Sponsor</button>
            <br /><br />
            Author:<a href="https://www.linkedin.com/in/miroslav-pejic-976a07101/" target="_blank"> Miroslav Pejic</a>
        </div>
        `,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    });
}

/**
 * Leave the Room and create a new one
 */
function leaveRoom() {
    // playSound('newMessage');

    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageAlt: 'Shuffle-leave',
        // imageUrl: leaveRoomImg,
        title: 'Ready to Leave?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        text: 'No so fast? Are you ready to leave the room?',
        customClass: {
            title: 'popup-title',
            htmlContainer: 'popup-text',
            confirmButton: 'popup-confirm-btn',
            denyButton: 'popup-deny-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // $.ajax({
            //     url: '/api/auth/updateopen',
            //     method: 'post',
            //     data: {isOpen: false},
            //     success: function(result) {
            //         window.location.href = '/';
            //     }
            // });
            window.location.href = '/';
        }
    });
}

/**
 * Make Obj draggable
 * https://www.w3schools.com/howto/howto_js_draggable.asp
 *
 * @param {*} elmnt
 * @param {*} dragObj
 */
function dragElement(elmnt, dragObj) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (dragObj) {
        // if present, the header is where you move the DIV from:
        dragObj.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/**
 * Data Formated DD-MM-YYYY-H_M_S
 * https://convertio.co/it/
 * @returns data string
 */
function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}-${time}`;
}

/**
 * Convert bytes to KB-MB-GB-TB
 * @param {*} bytes
 * @returns size
 */
function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/**
 * Basic user logging using https://sweetalert2.github.io
 * @param {*} type
 * @param {*} message
 */
function userLog(type, message) {
    switch (type) {
        case 'error':
            Swal.fire({
                background: swalBackground,
                position: 'center',
                // icon: 'error',
                title: 'Oops...',
                text: message,
                customClass: {
                    title: 'popup-title',
                    confirmButton: 'popup-confirm-btn',
                    denyButton: 'popup-deny-btn',
                },
            });
            // playSound('error');
            break;
        case 'info':
            Swal.fire({
                background: swalBackground,
                position: 'center',
                // icon: 'info',
                title: 'Info',
                text: message,
                customClass: {
                    title: 'popup-title',
                    // htmlContainer: 'popup-text',
                    confirmButton: 'popup-confirm-btn',
                    denyButton: 'popup-deny-btn',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            });
            break;
        case 'success':
            Swal.fire({
                background: swalBackground,
                position: 'center',
                // icon: 'success',
                title: 'Success',
                text: message,
                customClass: {
                    title: 'popup-title',
                    // htmlContainer: 'popup-text',
                    confirmButton: 'popup-confirm-btn',
                    denyButton: 'popup-deny-btn',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            });
            break;
        case 'success-html':
            Swal.fire({
                background: swalBackground,
                position: 'center',
                // icon: 'success',
                title: 'Success',
                html: message,
                customClass: {
                    title: 'popup-title',
                    // htmlContainer: 'popup-text',
                    confirmButton: 'popup-confirm-btn',
                    denyButton: 'popup-deny-btn',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            });
            break;
        case 'toast':
            const Toast = Swal.mixin({
                background: swalBackground,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            Toast.fire({
                icon: 'info',
                title: message,
            });
            break;
        // ......
        default:
            alert(message);
    }
}

/**
 * https://notificationsounds.com/notification-sounds
 * */
 // async function playSound(name) {
//     if (!notifyBySound) return;
//     let sound = '../sounds/' + name + '.mp3';
//     let audioToPlay = new Audio(sound);
//     try {
//         await audioToPlay.play();
//     } catch (err) {
//         // console.error("Cannot play sound", err);
//         // Automatic playback failed. (safari)
//         return;
//     }
// }

// 
/**
 * Show-Hide all elements grp by class name
 * @param {*} className
 * @param {*} displayState
 */
function toggleClassElements(className, displayState) {
    let elements = getEcN(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = displayState;
    }
}

/**
 * Get Html element by Id
 * @param {*} id
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * Get Html element by selector
 * @param {*} selector
 */
function getSl(selector) {
    return document.querySelector(selector);
}

/**
 * Get Html element by class name
 * @param {*} className
 */
function getEcN(className) {
    return document.getElementsByClassName(className);
}

jQuery(document).ready(function($) {
    var deviceAgent = navigator.userAgent.toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
    var orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait'; 
	if (agentID) {
        if( orientation == 'landscape' ) {
            $('.main-wrapper .main-content .container').css('height', '80%');
            $('.main-wrapper .main-content .container').css('max-height', 'unset');
        }
        if( parseInt($(window).width()) == 1024 && parseInt($(window).height()) == 1247 ) {
            $('.main-wrapper .main-content .container').css('max-height', '1125px');
            $('.main-wrapper .main-content .container').css('height', '1147px');
        }
        if( parseInt($(window).width()) == 375 && parseInt($(window).height()) == 812 ) {
            $('.main-wrapper .main-content .container').css('max-height', '662px');
        }
	}
    $( window ).resize(function() {
        orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait'; 
        if (agentID) {
            if( orientation == 'landscape' ) {
                $('.main-wrapper .main-content .container').css('height', '80%');
                $('.main-wrapper .main-content .container').css('max-height', 'unset');
            }
            if( parseInt($(window).width()) == 1024 && parseInt($(window).height()) == 1247 ) {
                $('.main-wrapper .main-content .container').css('max-height', '1125px');
                $('.main-wrapper .main-content .container').css('height', '1147px');
            }
            if( parseInt($(window).width()) == 375 && parseInt($(window).height()) == 812 ) {
                $('.main-wrapper .main-content .container').css('max-height', '662px');
            }
        }
    });
    $(window).bind('orientationchange', function(event) {
        orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait'; 
        console.log(orientation);
        if (agentID) {
            if( orientation == 'landscape' ) {
                $('.main-wrapper .main-content .container').css('height', '80%');
                $('.main-wrapper .main-content .container').css('max-height', 'unset');
            }
            if( parseInt($(window).width()) == 1024 && parseInt($(window).height()) == 1247 ) {
                $('.main-wrapper .main-content .container').css('max-height', '1125px');
                $('.main-wrapper .main-content .container').css('height', '1147px');
            }
            if( parseInt($(window).width()) == 375 && parseInt($(window).height()) == 812 ) {
                $('.main-wrapper .main-content .container').css('max-height', '662px');
            }
        }
    });
    $('#meetPartyBtn').on('click', function() {
        if( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('.main-content').removeClass('show-bar');
        } else {
            $('#chatBtn').removeClass('selected');

            $(this).addClass('selected');
            if( !$('.main-content').hasClass('show-bar') ) {
                $('.chat-sidebar').fadeOut();
                $('.memparty-sidebar').fadeIn();
                $('.main-content').addClass('show-bar');
            } else {
                $('.chat-sidebar').fadeOut();
                $('.memparty-sidebar').fadeIn();
            }
        }
    });
    $('#memPartyClose').on('click', function() {
        $('#meetPartyBtn').removeClass('selected');
        $('.main-content').removeClass('show-bar');
    });
    $('#chatBtn').on('click', function() {
        if( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('.main-content').removeClass('show-bar');
        } else {
            $('#meetPartyBtn').removeClass('selected');

            $(this).addClass('selected');
            if( !$('.main-content').hasClass('show-bar') ) {
                $('.memparty-sidebar').fadeOut();
                $('.chat-sidebar').fadeIn();
                $('.main-content').addClass('show-bar');
            } else {
                $('.memparty-sidebar').fadeOut();
                $('.chat-sidebar').fadeIn();
            }
        }
    });
    $('#memChatClose').on('click', function() {
        $('#chatBtn').removeClass('selected');
        $('.main-content').removeClass('show-bar');
    });
    $('#recordBtn').on('click', function() {
        if( $('#userinfo').val() == '' ) {
            return false;
        }
        if( $(this).hasClass('selected') ) {
            stopStreamRecording();
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
            startStreamRecording();
        }
    });
    $('#closeInviteParyBtn').on('click', function() {
        $('.invite-people-wrap').fadeOut();
    });
    $('#closeCopyLink').on('click', function() {
        $('.copy-link-wrap').fadeOut();
    });
    $('#copyInviteLink').on('click', function() {
        copyRoomURL();
        $('.copy-link-wrap').fadeIn();
    });
    $('#memparty-copy-link').on('click', function() {
        copyRoomURL();
    });
    var clickedInvitedBtn = false;
    $('#invitePaticipants').on('click', function() {
        // let message = {
        //     email: '',
        //     subject: 'Please join our Video Chat Meeting',
        //     body: 'Click to join: ' + $('#inviteLink').html(),
        // };
        // shareRoomByEmail(message);

        if( clickedInvitedBtn == true ) return false;
        clickedInvitedBtn = true;
        $.ajax({
            url: '/getinvite',
            method: 'post',
            data: {
                user_id: $('#userid').val(),
            },
            success: function(result) {
                clickedInvitedBtn = false;
                var inviteList = '';
                var idx = 0;
                if( result.data.length > 0 ) {
                    for(idx = 0; idx < result.data.length; idx++) {
                        inviteList += '<div class="invite-item" id="' + result.data[idx].id + '">';
                        inviteList += '<img src="' + result.data[idx].usericon + '" class="photo">';
                        inviteList += '<span style="width:100px">' + result.data[idx].username + '</span>';
                        inviteList += '<span style="width:200px">' + result.data[idx].email + '</span>';
                        inviteList += '<img src="/images/ico_inviteclose.svg" class="close">';
                        inviteList += '</div>';
                    }
                }
                    
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    html:
                        `
                        <br/> 
                        <div class="invite-email-wrap">
                            <h2 class="align-center">Invite Participants with Email</h2>
                            <br />
                            <p class="label">Add Invite Email</p>
                            <div class="flex just-between mt-10">
                                <input type="text" id="inviteEmail" name="inviteEmail" placeholder="Enter name or email" />
                                <button type="button" id="inviteEmailBtn" class="accept-confirm-btn">Invite</button>
                            </div>
                            <br />
                            <p class="label">Invited Users</p>
                            <div id="inviteGroup">
                                ` + inviteList + `
                            </div>
                            <div class="align-right mt-15">
                                <button type="button" id="inviteCloseBtn" class="accept-deny-btn">Close</button>
                            </div>
                        </div>`,
                    showDenyButton: false,
                    showConfirmButton: false,
                    showCancelButton: false,
                    customClass: {
                        container: 'accept-container',
                        popup: 'invite-popup',
                        htmlContainer: 'accept-text',
                        confirmButton: 'accept-confirm-btn',
                        denyButton: 'accept-deny-btn',
                    },
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp',
                    },
                });

            }
        });
    });
    $('#msgerEmojiBtn img').on('click', function() {
        hideShowEmojiPicker();
    });
    $('#memparty-invite-btn').on('click', function() {
        // let message = {
        //     email: '',
        //     subject: 'Please join our Video Chat Meeting',
        //     body: 'Click to join: ' + $('#inviteLink').html(),
        // };
        // shareRoomByEmail(message);
        if( clickedInvitedBtn == true ) return false;
        clickedInvitedBtn = true;
        $.ajax({
            url: '/getinvite',
            method: 'post',
            data: {
                user_id: $('#userid').val(),
            },
            success: function(result) {
                clickedInvitedBtn = false;
                var inviteList = '';
                var idx = 0;
                if( result.data.length > 0 ) {
                    for(idx = 0; idx < result.data.length; idx++) {
                        inviteList += '<div class="invite-item" id="' + result.data[idx].id + '">';
                        inviteList += '<img src="' + result.data[idx].usericon + '" class="photo">';
                        inviteList += '<span style="width:100px">' + result.data[idx].username + '</span>';
                        inviteList += '<span style="width:200px">' + result.data[idx].email + '</span>';
                        inviteList += '<img src="/images/ico_inviteclose.svg" class="close">';
                        inviteList += '</div>';
                    }
                }
                    
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    html:
                        `
                        <br/> 
                        <div class="invite-email-wrap">
                            <h2 class="align-center">Invite Participants with Email</h2>
                            <br />
                            <p class="label">Add Invite Email</p>
                            <div class="flex just-between mt-10">
                                <input type="text" id="inviteEmail" name="inviteEmail" placeholder="Enter name or email" />
                                <button type="button" id="inviteEmailBtn" class="accept-confirm-btn">Invite</button>
                            </div>
                            <br />
                            <p class="label">Invited Users</p>
                            <div id="inviteGroup">
                                ` + inviteList + `
                            </div>
                            <div class="align-right mt-15">
                                <button type="button" id="inviteCloseBtn" class="accept-deny-btn">Close</button>
                            </div>
                        </div>`,
                    showDenyButton: false,
                    showConfirmButton: false,
                    showCancelButton: false,
                    customClass: {
                        container: 'accept-container',
                        popup: 'invite-popup',
                        htmlContainer: 'accept-text',
                        confirmButton: 'accept-confirm-btn',
                        denyButton: 'accept-deny-btn',
                    },
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp',
                    },
                });

            }
        });
    });
    
    $('#endMeetingBtn').on('click', function() {
        leaveRoom();
    });
    $('#updateScreenType').on('click', function() {
        if( $(this).find('img').attr('alt') == 'Focused' ) {
            $(this).find('img').attr('src', '/images/ico_screen1.svg');
            $(this).find('img').attr('alt', 'Grid');
            $('#videoMediaContainer').removeClass('screen-type1');
            $('#videoMediaContainer').addClass('screen-type2');
        } else {
            $(this).find('img').attr('src', '/images/ico_screen2.svg');
            $(this).find('img').attr('alt', 'Focused');
            $('#videoMediaContainer').removeClass('screen-type2');
            $('#videoMediaContainer').addClass('screen-type1');
        }
    });
    $('body').on('click', '#localCameraOption', function() {
        localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0].enabled;
        myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
        if( myVideoStatus )
            $(this).find('img').attr('src', '/images/ico_small_camera2.svg');
        else
            $(this).find('img').attr('src', '/images/ico_small_camera1.svg');
        setMyVideoStatus(myVideoStatus);
    });
    $('body').on('click', '#localAudioOption', function() {
        localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
        myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
        if( myAudioStatus )
            $(this).find('img').attr('src', '/images/ico_small_mic2.svg');
        else
            $(this).find('img').attr('src', '/images/ico_small_mic1.svg');
        setMyAudioStatus(myAudioStatus);
    });
    $('#localEnableMic').on('click', function() {
        localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
        myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
        /* if( myAudioStatus )
            $(this).find('img').attr('src', '/images/ico_unmute.svg');
        else
            $(this).find('img').attr('src', '/images/ico_mute.svg'); */
        setMyAudioStatus(myAudioStatus);
    });

    $('body').on('click', '#myVideoLayoutType', function() {
        if( $(this).find('img').attr('alt') == 'Focused' ) {
            $(this).find('img').attr('src', '/images/ico_screen1.svg');
            $(this).find('img').attr('alt', 'Grid');
            $('#videoMediaContainer').removeClass('screen-type1');
            $('#videoMediaContainer').addClass('screen-type2');
        } else {
            $(this).find('img').attr('src', '/images/ico_screen2.svg');
            $(this).find('img').attr('alt', 'Focused');
            $('#videoMediaContainer').removeClass('screen-type2');
            $('#videoMediaContainer').addClass('screen-type1');
        }
    });

    $('body').on('click', '#initVideoButton', function() {
        localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0].enabled;
        myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
        if( myVideoStatus ) {
            $(this).css('border', '1px solid white');
            $(this).find('img').attr('src', '/images/ico_small_camera.png');
            $(this).removeClass('camera-off');
        } else {
            $(this).css('border', '1px solid red');
            $(this).find('img').attr('src', '/images/ico_small_camera1.png');
            $(this).addClass('camera-off');
        }
    });
    $('body').on('click', '#initAudioButton', function() {
        localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
        myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
        if( myAudioStatus ) {
            $(this).css('border', '1px solid white');
            $(this).find('img').attr('src', '/images/ico_small_mic.png');
            $(this).removeClass('mic-off');
        } else {
            $(this).css('border', '1px solid red');
            $(this).find('img').attr('src', '/images/ico_small_mic1.png');
            $(this).addClass('mic-off');
        }
    });
    $('body').on('click', '#inviteCloseBtn', function() {
        Swal.close();
    });
    $('body').on('click', '#inviteEmailBtn', function() {
        if( $('#inviteEmail').val() == '' || !validateEmail($('#inviteEmail').val()) ) {
            alert('Incorrect email address');
        } else {
            $.ajax({
                url: '/addinvite',
                method: 'post',
                data: {
                    user_id: $('#userid').val(),
                    email: $('#inviteEmail').val(),
                },
                success: function(result) {
                    $('#inviteEmail').val('');
                    if( result.message != 'error' ) {
                        var inviteItem = '';
                        inviteItem += '<div class="invite-item" id="' + result.data.id + '">';
                        inviteItem += '<img src="' + result.data.usericon + '" class="photo">';
                        inviteItem += '<span style="width:100px">' + result.data.username + '</span>';
                        inviteItem += '<span style="width:200px">' + result.data.email + '</span>';
                        inviteItem += '<img src="/images/ico_inviteclose.svg" class="close">';
                        inviteItem += '</div>';

                        $('#inviteGroup').append(inviteItem);
                    }
                }
            });
        }
    });

    $('body').on('click', '.invite-item .close', function() {
        var id = $(this).parent().attr('id');
        console.log('invite id:' + id);
        var obj = $(this).parent();
        $.ajax({
            url: '/removeinvite',
            method: 'post',
            data: {
                id: id,
            },
            success: function(result) {
                if( result.message == 'success' ) {
                    obj.remove();
                }
            }
        });
    });

    window.onbeforeunload = function (e) {
        $.ajax({
            url: '/api/auth/updateopen',
            method: 'post',
            data: {isOpen: false},
            success: function(result) {
            }
        });
    };
});
