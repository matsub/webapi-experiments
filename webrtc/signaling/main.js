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

var pc = null


async function prepareNewConnection(ws) {
  var pc = new RTCPeerConnection(config)

  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream
  }

  pc.onicecandidate = event => {
    if (event.candidate === null) {
      ws.send(pc.localDescription.sdp)
    }
  }

  var stream = await navigator.mediaDevices.getUserMedia(constraints)
  pc.addStream(stream)
  localVideo.srcObject = stream

  return pc
}

async function offer() {
  var ws = new WebSocket('ws://localhost:8001/')
  ws.onmessage = msg => {
    var sdp = msg.data
    acceptAnswer(sdp)
  }

  pc = await prepareNewConnection(ws)

  var offer = await pc.createOffer()
  pc.setLocalDescription(offer)
}

function acceptAnswer(sdp) {
  var answer = new RTCSessionDescription({ type: 'answer', sdp })
  pc.setRemoteDescription(answer)
}


async function answer() {
  var ws = new WebSocket('ws://localhost:8001/')
  ws.onmessage = msg => {
    var sdp = msg.data
    answerOffer(ws, sdp)
  }
}

async function answerOffer(ws, sdp) {
  var offer = new RTCSessionDescription({ type: 'offer', sdp })

  pc = await prepareNewConnection(ws)
  await pc.setRemoteDescription(offer)

  var answer = await pc.createAnswer()
  pc.setLocalDescription(answer)
}
