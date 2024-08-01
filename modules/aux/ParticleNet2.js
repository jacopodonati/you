const PIXI = require('pixi.js')

class ParticleNet2 { // using graphology net and positions as given by forceatlas2
  constructor (app, net, atlas, interactive = true, bezier = false) {
    this.interactive = interactive
    this.makeContainers(app)
    this.makeTextures(app, bezier)
    this.plot(net, atlas, app)
    this.input = { app, net, atlas }
  }

  makeContainers (app) {
    this.nodeContainer = new PIXI.ParticleContainer(100000, {
      scale: true,
      position: true,
      rotation: true,
      alpha: true
    })
    this.nodeContainer.interactiveChildren = this.interactive
    this.nodeContainer.interactive = this.interactive
    this.edgeContainer = new PIXI.ParticleContainer(100000, {
      scale: true,
      position: true,
      rotation: true,
      alpha: true
    })
    // this.edgeContainer = new PIXI.Container()
    app.stage.addChild(this.edgeContainer)
    app.stage.addChild(this.nodeContainer)
  }

  makeTextures (app, bezier) {
    const myCircle = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawCircle(0, 0, 50)
      .endFill()
    this.circleTexture = app.renderer.generateTexture(myCircle)
    const myLine = new PIXI.Graphics()
      .lineStyle(1, 0xffffff)
    if (bezier) setBezier(myLine)
    else {
      myLine
        .moveTo(0, 0)
        .lineTo(1000, 0)
    }
    this.lineTexture = app.renderer.generateTexture(myLine)
  }

  plot (net, atlas, app) {
    net.forEachNode((k, a) => {
      const p = atlas[k]
      const circle = new PIXI.Sprite(this.circleTexture)
      circle.x = p.x / window.devicePixelRatio
      circle.y = p.y / window.devicePixelRatio
      circle.anchor.x = 0.5 / window.devicePixelRatio
      circle.anchor.y = 0.5 / window.devicePixelRatio
      circle.tint = 0x00ffff
      circle.scale.set(0.1)
      circle.interactive = this.interactive
      this.nodeContainer.addChild(circle)
      a.pixiElement = circle
      a.name = a.name || 'anonym'
      if (a.name) { // todo: implement rendering of the names on the fly
        const texto = new PIXI.Text(
          a.name,
          { fontFamily: 'Arial', fontSize: 35, fill: 0xffffff, align: 'center' }
        )

        texto.tint = 0xffffff
        texto.x = p.x / window.devicePixelRatio
        texto.y = p.y / window.devicePixelRatio
        texto.zIndex = 1000
        texto.alpha = 0
        texto.interactive = this.interactive
        texto.hitArea = new PIXI.Rectangle(-5, -5, 10, 10)
        app.stage.addChild(texto)

        a.textElement = texto
        texto.on('pointerover', () => {
          texto.alpha = 1
        })
        texto.on('pointerout', () => {
          texto.alpha = 0
        })
      }
    })
    net.forEachEdge((e, a, s, t) => {
      a.pixiElement = this.makeEdge(atlas[s], atlas[t]) // , 1, 0, 0xff0000, app)
    })
  }

  makeLink (p1, p2, weight = 1, level = 0, tint = 0xff0000, app = undefined) {
    const line = new PIXI.Graphics()
    // fixme: how to map [1, 10] linewidth to resolution and screensize?
    // this was performed in a previous implementation with this ad-hoc-found relation:
    // line.lineStyle(1 + (9 * weight / this.max_weights[level_]) / (this.networks.length - level_) , 0xFFFFFF);
    line.lineStyle(1, 0xffffff) // always 1 pixel width white.
    // fixme: make/migrate colors/palletes to be used.  e.g. line.tint = this.colors[level_];
    line.tint = tint
    line.mtint = tint
    line.mlevel = level
    line.moveTo(p1.x, p1.y)
    line.lineTo(p2.x, p2.y)
    line.alpha = 0.2
    line.p1 = p1
    line.zIndex = 1
    line.p2 = p2
    app.stage.addChild(line)
    return line
  }

  makeEdge (pos1, pos2) {
    const line = new PIXI.Sprite(this.lineTexture)
    const dx = pos2.x / window.devicePixelRatio - pos1.x / window.devicePixelRatio
    const dy = pos2.y / window.devicePixelRatio - pos1.y / window.devicePixelRatio
    const length = (dx ** 2 + dy ** 2) ** 0.5
    line.scale.set(length / 1000, 1)
    const angle = Math.atan2(dy, dx)
    line.rotation = angle
    line.x = pos1.x / window.devicePixelRatio
    line.y = pos1.y / window.devicePixelRatio
    line.tint = 0xff00ff
    this.edgeContainer.addChild(line)
    return line
  }

  hide () {
    this.input.net.forEachNode((k, a) => {
      a.pixiElement.alpha = 0
    })
    this.input.net.forEachEdge((k, a) => {
      a.pixiElement.alpha = 0
    })
  }
}

function setBezier (bezier, xd = 1000, yd = 0, dx1 = 0.25, dy1 = 30, dx2 = 0.75, dy2 = 30) {
  bezier.position.x = 0
  bezier.position.y = 0
  const localDest = { x: xd, y: yd }
  const cp1 = { x: localDest.x * dx1, y: dy1 }
  const cp2 = { x: localDest.x * dx2, y: dy2 }
  bezier.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, localDest.x, localDest.y)
}

module.exports = { ParticleNet2 }
