// load the specified sound
async function loadSource(audioCtx, url) {
  var response = await fetch(url)
  var buffer = await response.arrayBuffer()

  var decoded = await audioCtx.decodeAudioData(buffer)
  var source = audioCtx.createBufferSource()
  source.buffer = decoded

  return source
}
