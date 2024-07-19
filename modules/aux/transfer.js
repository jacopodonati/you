// mongo:
const s = require('mongodb-stitch-browser-sdk')
const e = module.exports
e.ss = s

const creds = {}
const regName = (name, app, url, db, coll) => {
  creds[name] = {
    cluster: 'mongodb-atlas', // always
    app,
    url,
    db: db || 'anydb',
    collections: { test: coll || 'anycollection' }
  }
}

regName('ttm', 'freene-gui-fzgxa', 'https://ttm.github.io/oa/', 'freenet-all', 'test3') // renato.fabbri@, also cols: test, test2, nets
// regName('ttm', 'freene-gui-fzgxa', 'https://ttm.github.io/oa/', 'freenet-all', 'nets') // dummy
regName('tokisona', 'aplicationcreated-mkwpm', 'https://tokisona.github.io/oa/', 'adbcreated', 'acolectioncreated') // sync.aquarium@ and aeterni, also col aatest
regName('f4b', 'application-0-bcham', '', 'fdb', 'fcol') // f466r1@
regName('costa', 'application-0-izpfj', '', 'adbb', 'acoll') // rcostafabbri@
regName('aeterni', 'application-0-knxbk', '', 'adb', 'acol') // aeterni.anima@
regName('mark', 'anyapplication-faajz', 'https://markturian.github.io/ouraquarium/', 'anydb', 'anycollection') // markarcturian@
// regName('sync', 'anyapplication-faajz', 'https://worldhealing.github.io/ouraquarium/', 'anydb', 'anycollection') // markarcturian@

const auth = creds.tokisona
// const auth = creds.mark
// const auth = creds.ttm
// const auth = creds.sync

// auth.url = 'http://localhost:8080/'

const client = s.Stitch.initializeDefaultAppClient(auth.app)
const db = client.getServiceClient(s.RemoteMongoClient.factory, auth.cluster).db(auth.db)

e.writeAny = (data, aa) => {
  return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
    return db.collection(aa ? 'aatest' : auth.collections.test).insertOne(data)
  })
}

e.findAny = (data, aa) => {
  return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
    return db.collection(aa ? 'aatest' : auth.collections.test).findOne(data)
  })
}

e.findAll = (query, aa, projection, col) => {
  return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
    return db.collection(aa ? 'aatest' : (col || auth.collections.test)).find(query, { projection }).asArray()
  })
}

e.remove = (query, aa) => {
  return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
    return db.collection(aa ? 'aatest' : auth.collections.test).deleteMany(query)
  })
}

// ////////////// generic:
class FindAll {
  constructor () {
    this.dbs = {}
    this.clients = {}
    this.auths = {}
    this.tests = {}
    for (const au in creds) {
      if (au === 'tokisona') continue
      this.mkOne(au)
    }
    this.tokisona = (query, projection, col) => e.findAll(query, false, projection, col)
  }

  mkOne (au) {
    const auth = creds[au]
    const client = s.Stitch.initializeAppClient(auth.app)
    const db = client.getServiceClient(s.RemoteMongoClient.factory, auth.cluster).db(auth.db)
    const find = (query, projection, col) => client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
      return db.collection(col || auth.collections.test).find(query, { projection }).asArray()
    })
    const findo = (query, projection, col) => client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
      return db.collection(col || auth.collections.test).findOne(query, { projection })
    })
    const write = (query, col) => client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
      return db.collection(col || auth.collections.test).insertOne(query)
    })
    const remove = (query, col) => {
      return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
        return db.collection(col || auth.collections.test).deleteMany(query)
      })
    }
    const update = (query, set, col) => {
      return client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
        return db.collection(col || auth.collections.test).updateOne(query, { $set: set })
      })
    }
    const test = (query, projection, col) => client.auth.loginWithCredential(new s.AnonymousCredential()).then(user => {
      return db.collection(col || auth.collections.test)
    })

    this.tests[au] = test
    this[au] = find
    this['o' + au] = findo
    this['w' + au] = write
    this['d' + au] = remove
    this['u' + au] = update
    this.dbs[au] = db
    this.clients[au] = client
    this.auths[au] = auth
  }
}

e.fAll = new FindAll()
// fAll.ttm({ sid: { $exists: true } }, { sid: 1 }, 'test').then(r => console.log(r.map(i => i.sid)))
