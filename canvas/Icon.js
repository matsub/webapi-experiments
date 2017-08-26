class Icon {
  constructor (canvas) {
    this.svg = SVG(canvas)
  }

  draw() {
    this.svg.clear()
  }
}


class Speaker extends Icon {
  draw(strength) {
    super.draw()

    this.svg.rect(10, 10).move(0, 5)
      .fill('#404040')
    this.svg.polygon('0,10 10,0 10,20')
      .fill('#404040')

    // first echo
    if (strength > 0) {
      this.svg.path('M 12,5.6 a 3,4.2 0 0 1 0,8.8')
        .fill('#404040')
    }
    // second echo
    if (strength > 0.5) {
      this.svg.path('M 12,2 a 6,8 0 0 1 0,16')
        .fill('transparent')
        .stroke({ color: '#404040', width: 2.5 })
    }
  }
}
