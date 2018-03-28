const socket = io('https://callvideobyvu96.herokuapp.com/')

$("#div-chat").hide();

let customConfig;

$.ajax({
  url: "https://service.xirsys.com/ice",
  data: {
    ident: "huyvu0505",
    secret: "9a7cf394-328a-11e8-aebf-56e9e468e26d",
    domain: "huyvu96.github.io",
    channel:"VideoCall",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});


socket.on('DANH-SACH-ONLINE', arr =>{
    $("#div-chat").show();
    $("#div-dang-ky").hide();
    arr.forEach(e => {
        const {ten, peerId} = e;
        $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('CO-NGUOI-DUNG-MOI', arr =>{
        const {ten, peerId} = arr;
            $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('NGAT-KET-NOI', peerId =>{
        $(`#${peerId}`).remove();
    })
});
socket.on('DANG-KY-THAT-BAI', ()=> alert('UserNamd da duoc dang ky'))


function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
    const video= document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
//openStream().then(stream => playStream('localStream', stream));


 const peer = new Peer({key: 'peerjs',
  host: 'myvideocall96.herokuapp.com',
   secure: true,
    port: 443,
    config: customConfig});
//const peer = new Peer({key: '9evme5fuka0b2o6r'});
peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

$("#btnCall").click(()=>{
    const id = $("#remoteId").val();
    openStream().then(stream =>{
        playStream('localStream', stream)
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    });
    console.log("Call asdasdas");
})

peer.on('call', call=>{
    openStream().then(stream =>{
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
})

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});