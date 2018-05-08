const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}


class Peer {
  constructor() {
    this.pc = new RTCPeerConnection(config)

    this.pc.onicecandidate = event => {
      if (event.candidate === null) {
        var sdp = JSON.stringify(this.pc.localDescription)
        this.socket.send(sdp)
      }
    }
  }

  async offer() {
    this.socket = new WebSocket('ws://localhost:8001/')
    console.log('offering...')
    this.socket.onmessage = msg => {
      var sdp = JSON.parse(msg.data)
      console.log(`got sdp: ${sdp.type}`)
      this.pc.setRemoteDescription(sdp)
    }

    var offer = await this.pc.createOffer()
    this.pc.setLocalDescription(offer)
  }

  async answer() {
    this.socket = new WebSocket('ws://localhost:8001/')
    console.log('answering...')
    this.socket.onmessage = msg => {
      var sdp = JSON.parse(msg.data)
      console.log(`got sdp: ${sdp.type}`)
      this.answerOffer(sdp)
    }
  }

  async answerOffer(sdp) {
    await this.pc.setRemoteDescription(sdp)

    var answer = await this.pc.createAnswer()
    this.pc.setLocalDescription(answer)
  }

  addTrack(track, stream) {
    this.pc.addTrack(track, stream)
  }

  set ontrack(eventHandler) {
    this.pc.ontrack = eventHandler
  }
}
