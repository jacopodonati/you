/* global chrome */
const PIXI = require('pixi.js')
require('@pixi/unsafe-eval') // non fa il patch, quindi ho copiato manualmente il file e importato nell'HTML
const Graph = require('graphology')
const subGraph = require('graphology-utils/subgraph')
const netmetrics = require('graphology-metrics')
const netdegree = require('graphology-metrics/degree')
const components = require('graphology-components')
const { random } = require('graphology-layout')
const forceAtlas2 = require('graphology-layout-forceatlas2')
const louvain = require('graphology-communities-louvain')
const chroma = require('chroma-js')
const copyToClipboard = require('copy-to-clipboard')
const { ParticleNet2 } = require('./aux/ParticleNet2')

document.addEventListener('DOMContentLoaded', () => {
  const you = new You()
  console.log(you)
})

class You {
  constructor () {
    this.sphereColor = 0xff0000
    this.cFuncCount = 0
    this.sizingFuncCount = 0
    this.scaleCount = 0
    this.colorModeCount = 0
    this.cCriteria = this.setCCriteria()
    this.initializeGraph()
  }

  initializeGraph () {
    const toolbar = document.querySelector('#toolbar')
    const toolbarHeight = toolbar.offsetHeight
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight - toolbarHeight,
      // transparent: true
      backgroundColor: 0x000000,
      antialias: true
    })
    this.app.stage.sortableChildren = true
    document.querySelector('#canvas').appendChild(this.app.view)
    chrome.storage.local.get(['net'], (net) => {
      const pfm = window.pfm = this.plot(net.net, this.app)
      const dn = new ParticleNet2(this.app, pfm.net, pfm.atlas, true, true)
      pfm.dn = dn
      this.setup()
    })
    // if (u('id') || u('cid') || u('fid')) {
    //   let prom
    //   if (u('fid')) {
    //     prom = transfer.fAll.f4b({ 'userData.id': u('fid') })
    //   } else {
    //     prom = u('id') ? transfer.fAll.mark({ 'userData.id': u('id') }) : transfer.fAll.aeterni({ comName: u('cid') })
    //   }
    //   prom.then(r => {
    //     window.rrr = r
    //     let anet
    //     if (u('fid')) {
    //       anet = window.anet = r[0].userData.net
    //     } else {
    //       const foo = u('cid') ? 'network' : 'net'
    //       anet = window.anet = r[0][foo]
    //     }

    //     const pfm = window.pfm = net.plotFromMongo(anet, app, u('deg'))
    //     const dn = new net.ParticleNet2(app, pfm.net, pfm.atlas, true, true)
    //     pfm.dn = dn
    //     this.setUp()
    //     $('#loading').hide()
    //   })
    // } else if (u('whats')) {
    //   transfer.fAll.ttm({ marker: u('whats') }).then(r => {
    //     window.rrr = r
    //     if (r.length === 0) return window.alert('data has been deleted')
    //     const pfm = window.pfm = net.plotWhatsFromMongo(r[0].data, r[0].creator)
    //     const dn = window.dn = new net.ParticleNet2(app, pfm.net, pfm.atlas, true, true)
    //     pfm.dn = dn
    //     this.setUp()
    //     $('#loading').hide()
    //   })
    // }
  }

  plot (socialNetwork, app) {
    let net = new Graph()
    net.import(socialNetwork)
    console.log('plot', net, socialNetwork)
    net = this.getLargestComponent(net, true)
    netdegree.assign(net)
    random.assign(net)
    const saneSettings = forceAtlas2.inferSettings(net)
    console.log('the settings:', saneSettings)
    const atlas = forceAtlas2(net, { iterations: 150, settings: saneSettings })
    this.scale(atlas, app)
    return { net, saneSettings, atlas }
  }

  getLargestComponent (g, returnNet) {
    const gg = components.connectedComponents(g)
    let gg_ = []
    for (let i = 0; i < gg.length; i++) {
      if (gg[i].length > gg_.length) {
        gg_ = gg[i]
      }
    }
    return returnNet ? subGraph(g, gg_).copy() : gg_
  }

  scale (positions, app) {
    const k = Object.values(positions)
    const kx = k.map(kk => kk.x)
    const ky = k.map(kk => kk.y)
    const maxx = Math.max(...kx)
    const minx = Math.min(...kx)
    const maxy = Math.max(...ky)
    const miny = Math.min(...ky)

    const [w_, h_] = [app.renderer.width, app.renderer.height]
    const w = w_ * 0.8
    const h = h_ * 0.8
    const w0 = w_ * 0.1
    const h0 = h_ * 0.1
    Object.keys(positions).forEach(key => {
      positions[key].x = w * (positions[key].x - minx) / (maxx - minx) + w0
      positions[key].y = h * (positions[key].y - miny) / (maxy - miny) + h0
    })
    return positions
  }

  removeNode (g, n) {
    g.getNodeAttribute(n, 'pixiElement').destroy()
    g.forEachEdge(n, (e, ea) => {
      ea.pixiElement.destroy()
    })
    g.dropNode(n)
  }

  makeInfo (text, info) {
    if (info === undefined) this.sinfo.text(text)
    else this.sinfo.textContent = `${text}: ${info}`
  }

  setup () {
    const anet = window.pfm.net
    this.sinfo = document.createElement('span')
    this.sinfo.id = 'sinfo'
    document.body.appendChild(this.sinfo)
    // sinfo.addEventListener('click', () => {
    //   FIXME: names è undefined
    //   if (!names || names.length === 0) return
    //   console.log(10, names.join(', '))
    // })
    // this.sinfo = $('<span/>', { id: 'sinfo', css: { cursor: 'pointer' } }).appendTo('body').click(() => {
    //   if (!this.names || this.names.length === 0) return
    //   window.wand.modal.show(10, this.names.join(', '))
    // })

    function stdNode (n) {
      anet.forEachNeighbor(n, (nn, na) => {
        na.pixiElement.tint = na.pixiElement.btint
        clearInterval(na.textElement.iId)
        na.textElement.alpha = 0
        na.textElement.tint = na.textElement.btint
      })
    }

    anet.forEachNode((n, a) => {
      a.textElement.btint = a.textElement.tint
      a.pixiElement.btint = a.pixiElement.tint
      a.textElement.on('pointerover', () => {
        this.makeInfo('degree', a.degree)
      })
      a.textElement.on('pointerout', () => {
        stdNode(n)
      })
      a.textElement.on('pointerupoutside', () => {
        stdNode(n)
        anet.forEachNeighbor(n, (nn, na) => {
          na.pixiElement.tint = 0x00ff00
        })
      })

      a.textElement.on('pointerdown', () => {
        anet.forEachNeighbor(n, (nn, na) => {
          na.pixiElement.tint = 0x00ff00
          na.textElement.tint = 0xff9999
          na.textElement.iId = setInterval(() => {
            if (Math.random() > 0.7) {
              na.textElement.alpha = 1
            } else {
              na.textElement.alpha = 0
            }
          }, 200)
        })
        console.log('clicked jow')
      })
      a.textElement.on('pointerup', () => {
        stdNode(n)
        console.log('up jow')
      })
    })
    this.setupButtons()
  }

  setupButtons () {
    this.calcs()
    this.setupRemoveUserButton()
    this.setupRecordSetupButton()
    this.setupGroupMembersButton()
    this.setupDetectCommunitiesButton()
    this.setupCycleThroughCommunitiesButton()
    this.setupChangeNodesColorScaleButton()
    this.setupChangeNodesColorModeButton()
    this.setupChangeNodesColorCriteriaButton()
    this.setupChangeNodesSizeButton()
    this.setupChangeEdgeColorButton()
    this.setupChangeNodeAlphaButton()
    this.setupChangeEdgeAlphaButton()
    this.setupChangeBackgroundColorButton()
    this.setupShowMembersetsButton()
    this.setupShowMembersetColorsKeys()
    this.setupNamesAlphaButton()
    this.setSize = 50
    const groupMembersButton = document.querySelector('#group-members')
    groupMembersButton.click()
  }

  setupRemoveUserButton () {
    this.removedNodes = []
    const removeUserButton = document.querySelector('#remove-member')
    removeUserButton.addEventListener('click', () => {
      // FIXME: ensure no isolated node or group is left behind
      const n = window.pfm.net
      const uid = window.prompt('enter user string id:')
      if (!n.hasNode(uid)) return window.alert('network has no such member')
      this.removeNode(n, uid)
      const newNet = this.getLargestComponent(n)
      const toBeRemoved = []
      n.forEachNode(nn => {
        if (!newNet.includes(nn)) toBeRemoved.push(nn)
      })
      toBeRemoved.forEach(nn => this.removeNode(n, nn))
      this.removedNodes.push(uid, ...toBeRemoved)
      netdegree.assign(n)
    })
  }

  setupRecordSetupButton () {
    const recordSetupButton = this.rec = document.querySelector('#record-setup')
    recordSetupButton.addEventListener('click', () => {
      if (!window.confirm('are you sure that you will be using this setup and want to write it?')) return
      if (window.comNames.filter(i => i === '').length > 0) return window.alert('first name all communities')
      // fixme: check if any of the comNames input are already in use
      const n = window.pfm.net
      const toBeWritten = []
      for (let i = 0; i < n.communities.count; i++) {
        const name = window.comNames[i]
        const members = []
        n.forEachNode((nd, a) => {
          if (a.community === i) {
            members.push(nd)
            a.origDegree = a.degree
          }
        })
        const network_ = this.getLargestComponent(subGraph(n, members).copy(), true)
        netdegree.assign(network_)
        const network = network_.toJSON()
        network.edges.forEach(n => {
          delete n.attributes.pixiElement
        })
        network.nodes.forEach(n => {
          const a = n.attributes
          delete a.pixiElement
          delete a.textElement
          delete a.community
          delete a.degreeCentrality
          delete a.x
          delete a.y
        })
        toBeWritten.push({
          // name: `${u('id')}-${i}-${name}`,
          // source: u('id'),
          comName: name,
          removedNodes: this.removedNodes,
          network,
          date: new Date()
        })
      }
      chrome.storage.sync.set({ setup: toBeWritten })
      window.toBeWritten = toBeWritten
    })
  }

  setupGroupMembersButton () {
    const groupMembersButton = document.querySelector('#group-members')
    groupMembersButton.addEventListener('click', () => {
      const n = window.pfm.net
      const members = []
      n.forEachNode((n, a) => {
        members.push({
          origId: n,
          degree: a.origDegree || a.degree,
          name: a.name,
          id: a.sid || a.nid || a.name,
          url: a.sid ? `https://www.facebook.com/${a.sid}` : `https://www.facebook.com/profile.php?id=${a.nid}`
        })
      })
      window.members = members
      members.sort((a, b) => {
        if (a.degree !== b.degree) return a.degree - b.degree
        const [ai, bi] = [a.id, b.id]
        return ai.split('').reverse().join('') > bi.split('').reverse().join('') ? 1 : -1
      })
      const memberSets = window.memberSets = chunkArray(members, this.setSize || window.prompt('Size of set:'))
      console.log('memberSets', memberSets)
      // TODO: la modale dovrebbe apparire solo dopo la pressione di un pulsante
      // let str
      // if (window.confirm('inline list?')) {
      //   str = memberSets.map((set, count) => `-> ${count} (${set[0].degree}...${set[set.length - 1].degree}) <-<br>` + set.map(member => `${member.name}`).join(', ')).join('<br>=====<br><br>')
      // } else {
      //   str = memberSets.map((set, count) => count + ' |||<br>' + set.map(member => `<a target="_blank" href="${member.url}">${member.name}</a> ${member.degree}`).join('<br>')).join('<br>=====<br><br>')
      // }
      // window.wand.modal.show(10, str)
      delete this.setSize
    })
  }

  setupDetectCommunitiesButton () {
    const detectCommunitiesButton = document.querySelector('#detect-communities')
    detectCommunitiesButton.addEventListener('click', () => {
      const n = window.pfm.net
      makeCommunities(n)
      this.cycleCom.show()
      this.rec.show()
      window.comNames = new Array(n.communities.count).fill('')
      makeCommunitiesTable()
    })

    const makeCommunitiesTable = () => {
      if (window.adiv) window.adiv.remove()
      const n = window.pfm.net
      this.makeInfo(`${n.communities.count} communities found. Sizes: ${n.communities.sizes.all.join(', ')}.`)
      const adiv = window.adiv = document.createElement('div')
      document.body.appendChild(adiv)
      const grid = document.createElement('div')
      grid.classList.add('mgrid')
      grid.id = `mgrid-${Date.now()}`
      document.body.appendChild(grid)

      function addItem (text, bold) {
        if (bold) text = `<b>${text}</b>`
        const item = document.createElement('span')
        item.classList.add('community-item')
        item.innerHTML = text
        grid.appendChild(item)
      }

      addItem('index', 1)
      addItem('size', 1)
      addItem('name', 1)
      const existingComms = []
      n.communities.sizes.all.forEach((c, i) => {
        existingComms.push(i)
        addItem(i).click(() => {
          console.log(`activate com ${i} on the visualization`)
          this.showCom(i)
        })
        addItem(c).click(() => {
          const mergeIndex = window.prompt(`enter index to merge ${i}:`)
          if (existingComms.includes(parseInt(mergeIndex))) {
            mergeCommunities(i, mergeIndex)
          }
        })
        const me = addItem(window.comNames[i]).click(() => {
          window.comNames[i] = window.prompt(`enter name for com ${i}:`)
          me.text(window.comNames[i])
        })
      })
    }

    function mergeCommunities (i, j) {
      if (i === j) return window.alert('will not merge to itself!')
      // merge them:
      //   join members of both communities into one
      //   move the higher communities down:
      const [keep, change] = [Math.min(i, j), Math.max(i, j)]
      window.pfm.net.forEachNode((n, a) => {
        if (a.community === change) a.community = keep
      })
      window.pfm.net.forEachNode((n, a) => {
        if (a.community > change) a.community--
      })
      window.comNames.forEach((foo, count) => {
        if (count >= change) {
          window.comNames[count] = window.comNames[count + 1]
        }
      })
      window.pfm.net.communities.count--
      window.pfm.net.communities.sizes.all = new Array(window.pfm.net.communities.count).fill(0)
      window.pfm.net.forEachNode((n, a) => {
        window.pfm.net.communities.sizes.all[a.community]++
      })
      makeCommunitiesTable()
    }
  }

  setupCycleThroughCommunitiesButton () {
    let counter = 0
    let names = []
    const cycleThroughCommunitiesButton = this.cycleCom = document.querySelector('#cycle-communities')
    cycleThroughCommunitiesButton.addEventListener('click', () => {
      this.showCom(counter)
      counter = ++counter % window.pfm.net.communities.count
    })

    this.showCom = index => {
      names = []
      window.pfm.net.forEachNode((n, a) => {
        let color = 0x00ffff
        if (a.community === index) {
          color = 0x0000ff
          names.push(a.name)
        }
        a.pixiElement.tint = color
      })
      this.makeInfo('community size', window.pfm.net.communities.sizes.all[index])
    }
  }

  setupChangeNodesColorScaleButton () {
    const changeNodesColorScaleButton = document.querySelector('#nodes-color-scale')
    changeNodesColorScaleButton.addEventListener('click', () => {
      this.cscale = this.getScale()
      window.pfm.net.forEachNode((n, a) => {
        a.pixiElement.tint = a.pixiElement.btint = this.getScale(this.cCriteria(a)).num()
      })
      // wand.app.renderer.backgroundColor = 0xc3a06
    })
  }

  setupChangeNodesColorModeButton () {
    const changeNodesColorModeButton = document.querySelector('#nodes-color-mode')
    changeNodesColorModeButton.addEventListener('click', () => {
      this.cscale = this.applyColorMode(this.getScale)
      window.pfm.net.forEachNode((n, a) => {
        a.pixiElement.tint = this.cscale(this.cCriteria(a)).num()
      })
      this.makeInfo('color mode:', `${this.colorModeCount}, ${this.colorModeCount % 5}`)
    })
  }

  setupChangeNodesColorCriteriaButton () {
    const changeNodesColorCriteriaButton = document.querySelector('#nodes-color-criteria')
    changeNodesColorCriteriaButton.addEventListener('click', () => {
      this.cCriteria = this.setCCriteria()
      window.pfm.net.forEachNode((n, a) => {
        a.pixiElement.tint = a.pixiElement.btint = this.getScale(this.cCriteria(a)).num()
      })
      this.makeInfo('color node criteria:', `${this.cFuncCount}, ${this.cFuncCount % 3}`)
    })
  }

  setCCriteria () {
    return [
      a => a.degree / this.maxD,
      a => a.ndegree / this.maxN,
      a => a.cc / this.maxC
    ][this.cFuncCount++ % 3]
  }

  getScale () {
    const s = [
      () => randScale1(),
      () => randScale1(true),
      () => chroma.cubehelix(),
      () => randScale2(),
      () => randScale2(true),
      () => chroma.scale('Spectral')
    ][this.scaleCount++ % 6]()
    this.makeInfo('color scale', this.scaleCount % 6)
    return s
  }

  applyColorMode (scale) {
    window.scass = scale
    if (!('mode' in scale)) return scale
    return scale.mode([
      'rgb',
      'lab',
      'lrgb',
      'hsl',
      'lch'
    ][this.colorModeCount++ % 5])
  }

  setupChangeNodesSizeButton () {
    const changeNodesSizeButton = document.querySelector('#nodes-size')
    changeNodesSizeButton.addEventListener('click', () => {
      const func = this.getSizingFunc()
      window.pfm.net.forEachNode((n, a) => { a.pixiElement.scale.set(func(a) / 10) })
      this.makeInfo('node size method', this.sizingFuncCount % 3)
    })
  }

  calcs () {
    assignCC(window.pfm.net)

    window.pfm.net.forEachNode((n, a) => {
      const nds = []
      window.pfm.net.forEachNeighbor(n, (nn, na) => nds.push(na.degree))
      a.ndegree = nds.reduce((a, b) => (a + b), 0) / nds.length
    })

    const degrees = []
    const ccs = []
    const nds = []
    window.pfm.net.forEachNode((n, a) => {
      degrees.push(a.degree)
      ccs.push(a.cc)
      nds.push(a.ndegree)
    })
    this.maxD = Math.max(...degrees)
    this.maxC = Math.max(...ccs)
    this.maxN = Math.max(...nds)
  }

  getSizingFunc () {
    return [
      a => 0.3 + 2 * a.degree / this.maxD,
      a => 0.3 + 2 * a.ndegree / this.maxN,
      a => 0.3 + 2 * a.cc / this.maxC
    ][this.sizingFuncCount++ % 3]
  }

  setupChangeEdgeColorButton () {
    // TODO: color with respect to difference between nodes
    // FIXME: non funziona dopo il primo click
    let methodCount = 0
    const methods = ['multiply', 'darken', 'lighten', 'screen', 'overlay', 'burn', 'dodge']
    const changeEdgeColorButton = document.querySelector('#edge-color')
    changeEdgeColorButton.addEventListener('click', () => {
      const method = methods[methodCount++ % methods.length]
      window.pfm.net.forEachEdge((e, a, n1, n2, a1, a2) => {
        a.pixiElement.tint = chroma.blend(a1.pixiElement.btint, a2.pixiElement.btint, method).num()
      })
      this.makeInfo('edge color method', method)
    })
  }

  setupChangeNodeAlphaButton () {
    let count = 0
    const changeNodeAlphaButton = document.querySelector('#node-alpha')
    changeNodeAlphaButton.addEventListener('click', () => {
      const alpha = (count++ % 11) / 10
      window.pfm.net.forEachNode((n, a) => {
        a.pixiElement.alpha = alpha
        this.makeInfo('node alpha', alpha.toFixed(2))
      })
    })
  }

  setupChangeEdgeAlphaButton () {
    let count = 0
    const changeEdgeAlphaButton = document.querySelector('#edge-alpha')
    changeEdgeAlphaButton.addEventListener('click', () => {
      const alpha = (count++ % 11) / 10
      window.pfm.net.forEachEdge((e, a) => {
        a.pixiElement.alpha = alpha
        this.makeInfo('link alpha', alpha.toFixed(2))
      })
    })
  }

  setupChangeBackgroundColorButton () { // 7444373, 3026478.3020627154
    let counter = 0
    const changeBackgroundColorButton = document.querySelector('#background-color')
    changeBackgroundColorButton.addEventListener('click', () => {
      let color
      if (counter++ % 2) color = chroma.random()
      else color = chroma.scale()(Math.random())
      this.app.renderer.backgroundColor = color.num()
      this.makeInfo('background', color.rgb())
    })
  }

  setupShowMembersetsButton () {
    let counter = 0
    const showMembersetsButton = document.querySelector('#memberset-names')
    showMembersetsButton.addEventListener('click', () => {
      if (!window.memberSets) return
      // window.pfm.net.forEachNode((n, a) => {
      //   a.textElement.alpha = 0
      // })
      const namesAlphaButton = document.querySelector('#names-alpha')
      namesAlphaButton.disabled = false
      if (this.mm !== undefined) {
        this.mm.forEach(m => {
          const pe = window.pfm.net.getNodeAttribute(m, 'pixiElement')
          const te = window.pfm.net.getNodeAttribute(m, 'textElement')
          te.visible = false
          // te.alpha = 0.9
          // te.scale.set(0.8)
          pe.tint = pe.backTint
          pe.alpha = pe.backAlpha
        })
      }
      this.mm = window.memberSets[counter++ % window.memberSets.length].map(m => m.origId)
      this.mm.forEach(m => {
        const pe = window.pfm.net.getNodeAttribute(m, 'pixiElement')
        const te = window.pfm.net.getNodeAttribute(m, 'textElement')
        te.tint = pe.tint
        te.visible = true
        te.alpha = 0.9
        pe.backTint = pe.tint
        pe.backAlpha = pe.alpha
        pe.tint = this.sphereColor
        pe.alpha = 0.8
        te.scale.set(0.8)
      })
      this.makeInfo('member set shown', `${counter % window.memberSets.length}/${window.memberSets.length} (size: ${window.memberSets[0].length})`)
    })
  }

  setupShowMembersetColorsKeys () {
    console.log('yeah, started')
    const rgbm = [0, 0, 0, 0, 0, 0.8]
    const calc = (i, h) => Math.floor(rgbm[i] * 0xff / 10) * h
    const mix = chroma.mix
    const update = (color, up = true) => {
      const val = rgbm[color] + up
      if (color === 5) { // actually size
        rgbm[color] = val > 1.3 ? 0.3 : (val < 0.3 ? 1.3 : val)
        this.mm.forEach(m => {
          window.pfm.net.getNodeAttribute(m, 'textElement').scale.set(rgbm[color])
        })
        return this.makeInfo('name size', rgbm[color].toFixed(2))
      } else if (color >= 3) rgbm[color] = val >= 0 ? (val >= 1 ? 0 : val % 1) : 0.9
      else rgbm[color] = val >= 0 ? val % 11 : 10
      // const color_ = Math.floor(rgb[0] * 0xff / 10) * 0x010000 + rgb[1] * 0x000100 + rgb[2] * 0x000001
      const color_ = calc(0, 0x010000) + calc(1, 0x000100) + calc(2, 0x000001)
      this.mm.forEach(m => {
        const a = window.pfm.net.getNodeAttributes(m)
        a.textElement.tint = mix(mix(color_, a.pixiElement.btint, rgbm[3]), chroma.random(), rgbm[4]).num()
      })
      this.makeInfo('names color', `${chroma(color_).hex()} (${[rgbm[0], rgbm[1], rgbm[2], rgbm[3].toFixed(2), rgbm[4].toFixed(2)]})`)
    }

    document.onkeydown = function (e) {
      if (!window.memberSets) return
      console.log('yeah, turned on')
      e = e || window.event
      console.log(e, e.keyCode)
      switch (e.keyCode) {
        case 114: // r
          update(0)
          break
        case 82: // R
          update(0, -1)
          break
        case 103: // g
          update(1)
          break
        case 71: // G
          update(1, -1)
          break
        case 98: // b
          update(2)
          break
        case 66: // B
          update(2, -1)
          break
        case 109: // m
          update(3, 0.1)
          break
        case 77: // M
          update(3, -0.1)
          break
        case 110: // n
          update(4, 0.1)
          break
        case 78: // N
          update(4, -0.1)
          break
        case 115: // s
          update(5, 0.1)
          break
        case 83: // S
          update(5, -0.1)
          break
        case 101: // e
          spread()
          break
        case 69: // E
          spread(false)
          break
        case 99: // c
          tagHelper()
          break
        case 67: // C
          tagHelper(false)
          break
        case 97: // a
          window.pfm.net.forEachNode((n, a) => { a.textElement.tint = a.pixiElement.tint })
          this.mkInfo('node colors for names')
          break
        case 122: // z
          window.pfm.net.forEachNode((n, a) => { a.textElement.tint = 0xffffff * Math.random() })
          this.mkInfo('random colors for names (Math.random)')
          break
        case 90: // Z
          window.pfm.net.forEachNode((n, a) => { a.textElement.tint = chroma.random().num() })
          this.mkInfo('random colors for names (chroma)')
          break
      }
      // if (e.keyCode === 99) ff()
      // use e.keyCode
    }
    let scounter = 0
    const spread = (real = true) => {
      if (!real) {
        return this.mm.forEach(m => {
          const a = window.pfm.net.getNodeAttributes(m)
          a.textElement.position.set(a.pixiElement.x, a.pixiElement.y)
        })
      }
      this.mm.forEach(m => {
        const te = window.pfm.net.getNodeAttribute(m, 'textElement')
        const b = te.getBounds()
        this.mm.forEach(m2 => {
          if (m === m2) return
          const te2 = window.pfm.net.getNodeAttribute(m2, 'textElement')
          const b2 = te2.getBounds()
          if (b.x > b2.x + b2.width / 2 || b2.x > b.x + b.width / 2 || b.y > b2.y + b2.height / 2 || b2.y > b.y + b.height / 2) return
          const dist = (b.y < b2.y + b2.height ? b2.y + b2.height - b.y : b.y + b.height - b2.y) / 8
          te.y -= b.y < b2.y + b2.height ? dist : -dist
          te2.y -= b.y < b2.y + b2.height ? -dist : dist
        })
      })
      this.makeInfo('spread finished', ++scounter)
    }
    let counter = 0
    const tagHelper = (next = 1) => {
      this.mm.forEach(m => {
        window.pfm.net.getNodeAttribute(m, 'textElement').alpha = 0
      })
      const m = this.mm[next === 1 ? counter++ : counter--]
      window.pfm.net.getNodeAttribute(m, 'textElement').alpha = 1
      window.pfm.net.getNodeAttribute(m, 'textElement').tint = 0xff0000
      console.log(window.pfm.net.getNodeAttribute(m, 'name'), counter - 1)
      console.log(`https://www.facebook.com/${m}`)
      console.log(`https://www.facebook.com/profile.php?id=${m}`)
      console.log(m)
      copyToClipboard(m)
      this.makeInfo('tagging', `${counter} of ${this.mm.length}`)
    }
  }

  setupNamesAlphaButton () {
    let counter = 0
    const namesAlphaButton = document.querySelector('#names-alpha')
    namesAlphaButton.addEventListener('click', () => {
      if (!window.memberSets) return
      const alpha = (counter++ % 11) / 10
      this.mm.forEach(m => {
        window.pfm.net.getNodeAttribute(m, 'textElement').alpha = alpha
      })
      this.makeInfo('names alpha', alpha.toFixed(2))
    })
  }
}

const assignCC = net => net.forEachNode((n, a) => {
  if (a.degree < 2) a.cc = 0
  else {
    const sg = subGraph(net, [...net.neighbors(n), n])
    a.cc = 2 * (sg.size - a.degree) / (a.degree * (a.degree - 1))
  }
})

const chooseUnique = (marray, nelements) => {
  nelements = nelements || 1
  let i = marray.length
  marray = [...marray]
  if (i === 0) { return false }
  let c = 0
  const choice = []
  while (i) {
    const j = Math.floor(Math.random() * i)
    const tempi = marray[--i]
    const tempj = marray[j]
    choice.push(tempj)
    marray[i] = tempj
    marray[j] = tempi
    c++
    if (c === nelements) { return choice }
  }
  console.log({ choice })
  return choice
}

const colorNames = Object.keys(chroma.colors)
const brewerNames = Object.keys(chroma.brewer)

const randScale1 = (bezier = false) => {
  const colors = chooseUnique(colorNames, 2 + Math.floor(Math.random() * 3))
  const s = chroma[bezier ? 'bezier' : 'scale'](colors)
  s.colors_ = colors
  s.bezier_ = bezier
  return s
}

const randScale2 = (bezier = false) => {
  const brewer = chooseUnique(brewerNames, 1)[0]
  const colors = chroma.brewer[brewer]
  const s = chroma[bezier ? 'bezier' : 'scale'](bezier ? chooseUnique(colors, 5) : colors)
  s.colors_ = colors
  s.bezier_ = bezier
  s.brewer_ = brewer
  return s
}

const chunkArray = (array, chunkSize) => {
  const results = []
  array = array.slice()
  while (array.length) {
    results.push(array.splice(0, chunkSize))
  }
  return results
}

const makeCommunities = g => {
  // const gg = components.connectedComponents(g)
  // let gg_ = []
  // for (let i = 0; i < gg.length; i++) {
  //   if (gg[i].length > gg_.length) {
  //     gg_ = gg[i]
  //   }
  // }
  // const sg = subGraph(g, gg_).copy()
  const sg = g
  netdegree.assign(sg)
  netmetrics.centrality.degree.assign(sg)
  sg.communities = louvain.detailed(sg)
  const communitySizes = new Array(sg.communities.count).fill(0)
  for (const key in sg.communities.communities) {
    const index = sg.communities.communities[key]
    sg.setNodeAttribute(key, 'community', index)
    communitySizes[index]++
  }
  sg.communities.sizes = {
    all: communitySizes,
    max: Math.max(...communitySizes),
    min: Math.min(...communitySizes)
  }
  return sg
}
