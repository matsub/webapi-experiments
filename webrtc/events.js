const iceConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}

var pc1 = new RTCPeerConnection(iceConfig)
var pc2 = new RTCPeerConnection(iceConfig)

var stream = null
var currentEvent = null

function eventSnitcher (event) {
  currentEvent = event
  console.log(`=== ${event.type} ===`)
  console.log(event)
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
