(async function() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const orifinSource = devices.filter(info => info.kind === "videoinput")[1].deviceId
  const replacingSource = devices.filter(info => info.kind === "videoinput")[3].deviceId

  const pc = new RTCPeerConnection()

  let constraints = {video: {deviceId: {exact: orifinSource}}}
  const origin = await navigator.mediaDevices.getUserMedia(constraints)
  const sender = pc.addTrack(origin.getTracks()[0], origin)

  let offer = await pc.createOffer()
  console.log(offer.sdp)
  console.warn("-----------------------------------------------------------")

  constraints = {video: {deviceId: {exact: replacingSource}}}
  const replacing = await navigator.mediaDevices.getUserMedia(constraints)
  sender.replaceTrack(replacing.getTracks()[0])

  offer = await pc.createOffer()
  console.log(offer.sdp)
})()
