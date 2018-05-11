const iceConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}

var pc1 = new RTCPeerConnection(iceConfig)
var pc2 = new RTCPeerConnection(iceConfig)

var stream
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(s => stream = s)

function eventSnitcher

// events of RTCPeerConnection
pc1.onconnectionstatechange
pc1.ondatachannel
pc1.onicecandidate
pc1.oniceconnectionstatechange
pc1.onicegatheringstatechange
pc1.onidentityresult
pc1.onidpassertionerror
pc1.onidpvalidationerror
pc1.onnegotiationneeded
pc1.onpeeridentity
pc1.onremovestream
pc1.onsignalingstatechange
pc1.ontrack
