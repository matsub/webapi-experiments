const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
}


class Peer {
  constructor() {
    this.pc = new RTCPeerConnection(config)

    this.pc.onicecandidate = event => {
      console.log(event.candidate)
      console.log(this.pc.localDescription)
    }
  }

  async offer() {
    var socket = new WebSocket('ws://localhost:8001/')
    console.log('offering...')
    socket.onmessage = msg => {
      var answer = JSON.parse(msg.data)
      console.log(`got sdp: ${answer.type}`)
      this.pc.setRemoteDescription(new RTCSessionDescription(answer))
    }

    var offer = await this.pc.createOffer()
    var offerDescription = new RTCSessionDescription(offer)
    await this.pc.setLocalDescription(offerDescription)
    socket.send(JSON.stringify(offer))
  }

  async answer() {
    var socket = new WebSocket('ws://localhost:8001/')
    console.log('answering...')
    socket.onmessage = async msg => {
      var offer = JSON.parse(msg.data)
      console.log(`got sdp: ${offer.type}`)

      // answering
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer))

      var answer = await this.pc.createAnswer()
      var answerDescription = new RTCSessionDescription(answer)
      await this.pc.setLocalDescription(answerDescription)
      socket.send(JSON.stringify(answer))
    }
  }

  async answerOffer(sdp) {
  }

  addTrack(track, stream) {
    this.pc.addTrack(track, stream)
  }

  set ontrack(eventHandler) {
    this.pc.ontrack = eventHandler
  }
}
