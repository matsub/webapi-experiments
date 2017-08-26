/*  Compatibility shim */
navigator.getUserMedia = (
  navigator.getUserMedia
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
)

var constraints = {
  video:false,
  audio:true
}

async function getStreamSource(audioCtx) {
  var stream = await navigator.mediaDevices.getUserMedia(constraints)
  return audioCtx.createMediaStreamSource(stream)
}
