function recvStream(room) {
  return new Promise((res, rej) => room.on('stream', res))
}

async function yabai(peer, stream) {
  var room = peer.joinRoom('svas', { mode: 'mesh', stream })
  console.log('joined room')
  console.log(room)
  return await recvStream(room)
}

async function sugoi(peer, audioCtx) {
  var dest = audioCtx.createMediaStreamDestination()
  var source = await loadSource(audioCtx, "../../webaudio/sample.ogg")
  source.connect(dest)
  source.start(0)

  var stream = await yabai(peer, dest.stream)
  console.log('got stream')
  console.log(stream)
  return audioCtx.createMediaStreamSource(stream)
}
