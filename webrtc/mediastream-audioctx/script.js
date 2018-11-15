const constraints = {
  video: false,
  audio: true
}

// AudioIndicator
function getAverageVolume(array) {
  const sum = array.reduce((a,b)=>a+b, 0)
  return sum / array.length
}

class AudioIndicator {
  constructor(audioCtx, canvas) {
    const indicator = new Indicator(canvas)

    // setup a analyser
    const analyser = audioCtx.createAnalyser()
    analyser.smoothingTimeConstant = 0.3
    analyser.fftSize = 1024

    // setup a script node
    const processor = audioCtx.createScriptProcessor(2048, 1, 1)
    processor.onaudioprocess = this.setup(analyser, indicator)

    analyser.connect(processor)
    processor.connect(audioCtx.destination)

    this.analyser = analyser
  }

  setup(analyser, indicator) {
    const array =  new Uint8Array(analyser.frequencyBinCount)
    return () => {
      // get the average for the first channel
      analyser.getByteFrequencyData(array)
      const average = getAverageVolume(array)
      indicator.draw(average*2)
    }
  }

  get node() {
    return this.analyser
  }
}


class Indicator {
  constructor(canvas) {
    this.width = canvas.width
    this.height = canvas.height
    this.scale = this.width/120

    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0, 0, this.width, 0)

    gradient.addColorStop(0,'#004400')
    gradient.addColorStop(1,'#00ff00')
    ctx.fillStyle = gradient
    ctx.lineWidth = 4
    ctx.strokeStyle = "#ffffff"

    this.ctx = ctx
  }

  draw(strength) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.fillRect(0, 0, strength*this.scale, this.height)

    for (let x=0; x < this.width; x+=8*this.scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.height)
      ctx.stroke()
    }
  }
}

class VolumeController {
  constructor(audioCtx, controllerView) {
    const input = controllerView.querySelector('input')

    input.addEventListener('input', e => {
      this.gainNode.gain.value = input.value
    })

    const gainNode = audioCtx.createGain()
    gainNode.gain.value = input.value
    gainNode.connect(audioCtx.destination)

    this.gainNode = gainNode
  }

  get node() {
    return this.gainNode
  }
}


// main
async function getStreamSource(audioCtx) {
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  return audioCtx.createMediaStreamSource(stream)
}

async function main() {
  const audioCtx = new AudioContext()

  // create indicator
  const canvas = document.querySelector("canvas")
  const indicator = new AudioIndicator(audioCtx, canvas)

  // create controller
  const controllerView = document.querySelector('div')
  const controller = new VolumeController(audioCtx, controllerView)

  // connect audio context
  const source = await getStreamSource(audioCtx)
  source.connect(indicator.node)
  source.connect(controller.node)
}

main()
