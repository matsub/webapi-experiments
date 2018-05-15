const iceConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}

var pc1 = new RTCPeerConnection(iceConfig)
var pc2 = new RTCPeerConnection(iceConfig)
pc1.pcname = "pc1"
pc2.pcname = "pc2"

function eventSnitcher (event) {
  console.warn(`=== ${event.target.pcname}: ${event.type} ===`)
}

// events of RTCPeerConnection
pc1.onconnectionstatechange = eventSnitcher
pc1.ondatachannel = eventSnitcher
pc1.onicecandidate = eventSnitcher
pc1.oniceconnectionstatechange = eventSnitcher
pc1.onicegatheringstatechange = eventSnitcher
pc1.onidentityresult = eventSnitcher
pc1.onidpassertionerror = eventSnitcher
pc1.onidpvalidationerror = eventSnitcher
pc1.onnegotiationneeded = eventSnitcher
pc1.onpeeridentity = eventSnitcher
pc1.onremovestream = eventSnitcher
pc1.onsignalingstatechange = eventSnitcher
pc1.ontrack = eventSnitcher


pc2.onconnectionstatechange = eventSnitcher
pc2.ondatachannel = eventSnitcher
pc2.onicecandidate = eventSnitcher
pc2.oniceconnectionstatechange = eventSnitcher
pc2.onicegatheringstatechange = eventSnitcher
pc2.onidentityresult = eventSnitcher
pc2.onidpassertionerror = eventSnitcher
pc2.onidpvalidationerror = eventSnitcher
pc2.onnegotiationneeded = eventSnitcher
pc2.onpeeridentity = eventSnitcher
pc2.onremovestream = eventSnitcher
pc2.onsignalingstatechange = eventSnitcher
pc2.ontrack = eventSnitcher


navigator.mediaDevices.getUserMedia({video: false, audio: true})
  .then(s => pc1.addTrack(s.getTracks()[0], s))
