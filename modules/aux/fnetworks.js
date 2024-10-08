/* global chrome */
const Graph = require('graphology')

class FNetwork {
  constructor () {
    this.anonCount = 0
    this.anonNames = {} // { name: id }
    this.anonPrefix = 'inactive-'
    this.membersNotFound = []
    this.restart()
  }

  restart () {
    const net = this
    chrome.storage.local.get('net', function (data) {
      net.graph = new Graph()
      if (typeof data.net === 'undefined') {
        net.graph.setAttribute('preclude', [])
        net.anonString = this.anonPrefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '-'
        net.graph.setAttribute('anonString', net.anonString)
      } else {
        net.graph.import(data.net)
        net.anonString = net.graph.getAttribute('anonString')
      }
      net.defineRound()
    })
  }

  defineRound () {
    const rounds = []
    this.graph.forEachNode((n, a) => {
      if (a.nid) rounds.push(a.scraped)
    })
    if (rounds.length === 0) {
      this.round = 1
    } else {
      const rounds_ = rounds.map(i => {
        if (i === true) return 1
        else if (i === undefined) return 0
        return i
      })
      const allEqual = rounds_.every(i => i === rounds_[0])
      let round
      if (allEqual) round = rounds_[0] + 1
      else round = Math.max(...rounds_)
      chrome.rounds_ = rounds_
      this.round = round
      chrome.storage.sync.set({ sround: this.round })
      console.log('the round:', this.round)
    }
  }

  absorb (struct) {
    if (struct === undefined) return
    if (this.graph.order) this.addFriendships(struct)
    else this.addFriends(struct)
  }

  addFriends (struct) {
    struct.forEach(s => {
      const { name, sid, nid, mutual, nfriends } = s
      let id = sid || nid
      const anon = !id
      if (anon) {
        id = this.anonString + this.anonCount++
        this.anonNames[name] = id
      }
      this.graph.addNode(id, { name, sid, nid, mutual, nfriends, anon })
    })
  }

  addFriendships (struct) {
    struct.forEach(s => {
      const { name, sid, nid, mutual, nfriends } = s
      if (name === '') return // if there's no name, the div is bogus
      let id = this.findNode(name, sid, nid)
      let a = {}
      let exists = true
      if (id === undefined) [exists, id] = [false, s.sid || s.nid]
      else a = this.graph.getNodeAttributes(id)
      a.name = name
      a.sid = a.sid || sid
      a.nid = a.nid || nid
      a.mutual = a.mutual || mutual
      a.nfriends = a.nfriends || nfriends
      a.anon = !(a.sid || a.nid)
      if (a.anon) {
        id = this.anonString + this.anonCount++
        this.anonNames[name] = id
      }
      if (!exists) {
        a.foundInRound = this.round
        this.graph.addNode(id, a)
      }
      if (!this.graph.hasEdge(this.lastId, id)) {
        console.log(`adding ${this.lastId}, ${id}`)
        this.graph.addUndirectedEdge(this.lastId, id)
      }
    })
    if (struct.length !== this.lastMutual) {
      console.warn(`Expected ${this.lastMutual} friends for ${this.lastId}, but ${struct.length} found.`)
    }
    this.graph.setNodeAttribute(this.lastId, 'scraped', this.round)
  }

  getIds () {
    const sids = {}
    const nids = {}
    this.graph.forEachNode((n, a) => {
      if (a.sid) sids[a.sid] = a.nid
      if (a.nid) nids[a.nid] = a.sid
    })
    return { sids, nids }
  }

  findNode (name, sid, nid) {
    const { sids, nids } = this.getIds()
    // node can be sid or nid or anon-xxx, have to try them all
    const nodes = this.graph.nodes()
    if (nodes.includes(sid)) {
      return sid
    } else if (nodes.includes(nid)) {
      return nid
    } else { // id returned might be in the attributes
      const temp = nid
      nid = sids[sid]
      sid = nids[temp]
      if (nodes.includes(sid)) {
        return sid
      } else if (nodes.includes(nid)) {
        return nid
      } else { // or anon
        // fixme: will raise error if two anons have same name, but ok for now:
        return this.anonNames[name]
      }
    }
  }

  getNextURL () {
    // we are only visiting the nodes with numeric id,
    // which implies the giant component
    // TODO: visit string ids to have the small components as well
    const nodeIds = []
    this.graph.forEachNode((n, a) => {
      nodeIds.push({
        nid: a.nid,
        sid: a.sid,
        scraped: a.scraped,
        id: n,
        mutual: a.mutual
      })
    })
    let url
    nodeIds.some(i => {
      if (!i.scraped && (i.mutual === undefined)) {
        this.graph.setNodeAttribute(i.id, 'scraped', this.round)
      } else if (!i.scraped) {
        if (i.nid !== undefined) url = `https://www.facebook.com/profile.php?id=${i.nid}&sk=friends_mutual`
        else url = `https://www.facebook.com/${i.sid}/friends_mutual`
        // url = `https://www.facebook.com/browse/mutual_friends/?uid=${i.nid}`  // old
        // url = `https://www.facebook.com/profile.php?id=${i.nid}&sk=friends_mutual`
        this.lastId = i.id
        this.lastMutual = parseInt(i.mutual)
      }
      return Boolean(url)
    })
    if (!url) {
      nodeIds.some(i => {
        if (i.mutual === undefined) {
          this.graph.setNodeAttribute(i.id, 'scraped', this.round)
        } else if ((i.scraped < this.round)) {
          // url = `https://www.facebook.com/browse/mutual_friends/?uid=${i.nid}` // old
          url = `https://www.facebook.com/profile.php?id=${i.nid}&sk=friends_mutual`
          this.lastId = i.id
        }
        return Boolean(url)
      })
    }
    return url
  }

  nScraped () { // calculate scraped in the round and not ever, update in popup
    let count = 0
    this.graph.forEachNode((n, a) => { count += Boolean(a.scraped) })
    return count
  }

  info () {
    return {
      scraped: this.nScraped(),
      order: this.graph.order,
      size: this.graph.size
    }
  }
}

module.exports = new FNetwork()
