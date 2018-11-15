class VolumeController {
  constructor(audioCtx, controller) {
    var input = controller.querySelector('input')

    input.addEventListener('input', e => {
      this.gainNode.gain.value = input.value
    })

    var gainNode = audioCtx.createGain()
    gainNode.gain.value = input.value
    gainNode.connect(audioCtx.destination)

    this.gainNode = gainNode
  }

  get node() {
    return this.gainNode
  }
}
