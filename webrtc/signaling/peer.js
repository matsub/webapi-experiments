const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}


class Peer {
  constructor() {
    this.pc = new RTCPeerConnection(config)

    this.pc.onicecandidate = event => {
      if (event.candidate) {
        var icecandidate = JSON.stringify(event.candidate)
        this.socket.send(icecandidate)
      }
    }
  }

  async offer() {
    var socket = new WebSocket('ws://localhost:8001/')
    console.log('offering...')
    this.socket.onmessage = msg => {
      var candidate = JSON.parse(msg.data)
      console.log(`got candidate: ${candidate}`)
      this.pc.addIceCandidate(candidate)
    }

    var offer = await this.pc.createOffer()
    var offerDescription = new RTCSessionDescription(offer)
    await this.pc.setLocalDescription(offerDescription)
    socket.send(JSON.stringify(offer))
  }

  async answer() {
    var socket = new WebSocket('ws://localhost:8001/')
    console.log('answering...')
    this.socket.onmessage = async msg => {
      var candidate = JSON.parse(msg.data)
      console.log(`got candidate: ${candidate}`)
      this.pc.addIceCandidate(candidate)
    }
  }

  addTrack(track, stream) {
    this.pc.addTrack(track, stream)
  }

  set ontrack(eventHandler) {
    this.pc.ontrack = eventHandler
  }
}
