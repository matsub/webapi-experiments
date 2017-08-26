class Indicator {
  constructor(audioCtx, canvas) {
    var ai = new AudioIndicator(canvas)

    // setup a analyser
    var analyser = audioCtx.createAnalyser()
    analyser.smoothingTimeConstant = 0.3
    analyser.fftSize = 1024

    // setup a script node
    var processor = audioCtx.createScriptProcessor(2048, 1, 1)
    processor.onaudioprocess = this.setup(analyser, ai)

    analyser.connect(processor)
    processor.connect(audioCtx.destination)

    this.analyser = analyser
  }

  setup(analyser, ai) {
    var array =  new Uint8Array(analyser.frequencyBinCount)
    return () => {
      // get the average for the first channel
      analyser.getByteFrequencyData(array)
      var average = getAverageVolume(array)
      ai.draw(average*2)
    }
  }

  get node() {
    return this.analyser
  }
}


function getAverageVolume(array) {
  var sum = array.reduce((a,b)=>a+b, 0)
  return sum / array.length
}
