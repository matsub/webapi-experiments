class AudioIndicator {
  constructor(canvas) {
    this.width = canvas.width
    this.height = canvas.height

    var ctx = canvas.getContext("2d")
    var gradient = ctx.createLinearGradient(0, 0, this.width, 0)

    gradient.addColorStop(0,'#004400')
    gradient.addColorStop(1,'#00ff00')
    ctx.fillStyle = gradient
    ctx.lineWidth = 4
    ctx.strokeStyle = "#ffffff"

    this.ctx = ctx
  }

  draw(strength) {
    var ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.fillRect(0, 0, strength, this.height)

    for (let x=0; x < 120; x+=8) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 20)
      ctx.stroke()
    }
  }
}
