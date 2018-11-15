class VolumeController {
  constructor(audioCtx, inputElement) {
    inputElement.addEventListener('input', e => {
      this.gainNode.gain.value = inputElement.value
    })

    const gainNode = audioCtx.createGain()
    gainNode.gain.value = inputElement.value
    gainNode.connect(audioCtx.destination)

    this.gainNode = gainNode
  }

  get node() {
    return this.gainNode
  }
}

function attachVolumeController (inputElement, stream) {
  const audioCtx = new AudioContext()

  // create controller
  const controller = new VolumeController(audioCtx, inputElement)

  // connect audio context
  const source = audioCtx.createMediaStreamSource(stream)
  source.connect(controller.node)
}
