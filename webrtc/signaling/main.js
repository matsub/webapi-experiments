const constraints = {
  video: { width: 160, height: 120 },
  audio: false
}

const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}

var localVideo = document.getElementById('local')
var remoteVideo = document.getElementById('remote')
var textForSendSdp = document.getElementById('sending')
var textToReceiveSdp = document.getElementById('receiving')

var pc = null


function writeSdp(sessionDescription) {
  textForSendSdp.value = sessionDescription.sdp
  textForSendSdp.focus()
  textForSendSdp.select()
}

async function prepareNewConnection() {
  var pc = new RTCPeerConnection(config)

  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream
  }

  pc.onicecandidate = event => {
    if (event.candidate === null) {
      writeSdp(pc.localDescription)
    }
  }

  var stream = await navigator.mediaDevices.getUserMedia(constraints)
  pc.addStream(stream)
  localVideo.srcObject = stream

  return pc
}

async function makeOffer() {
  pc = await prepareNewConnection()

  var offer = await pc.createOffer()
  pc.setLocalDescription(offer)
}

function answerOffer() {
  var sdp = textToReceiveSdp.value
  _answerOffer(sdp)
}

async function _answerOffer(sdp) {
  var offer = new RTCSessionDescription({ type : 'offer', sdp })

  pc = await prepareNewConnection()
  await pc.setRemoteDescription(offer)

  var answer = await pc.createAnswer()
  pc.setLocalDescription(answer)
}

function acceptAnswer() {
  var sdp = textToReceiveSdp.value
  _acceptAnswer(sdp)
}

function _acceptAnswer(sdp) {
  var answer = new RTCSessionDescription({ type : 'answer', sdp })
  pc.setRemoteDescription(answer)
}
