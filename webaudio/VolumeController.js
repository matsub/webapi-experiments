class VolumeController {
  constructor(audioCtx, controller) {
    var speaker = new Speaker(controller.querySelector('svg'))
    var input = controller.querySelector('input')

    speaker.draw(input.value)
    input.addEventListener('input', e => {
      this.gainNode.gain.value = input.value
      speaker.draw(input.value)
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
