/* global chrome */
console.log('content script initiated', window.performance.now(), window.location.href)

function getElementsByXPath (xpath, element) {
  const results = []
  const query = document.evaluate(xpath, element || document,
    null, window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i))
  }
  return results
}

function monload (work) {
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      work()
    })
  } else {
    work()
  }
}
const scrollDelayInMilliSeconds = 300
const scrollMagnitude = 1000
const scrollTillEnd = (call) => {
  const curUrl = document.location.href
  let criterion
  if (curUrl.match(/\?uid=(\d+)/)) { // special numeric mutual friends page:
    if (document.getElementsByClassName('UIStandardFrame_Container').length === 0) {
      return chrome.runtime.sendMessage({ step: 'blocked', background: true })
    }
    criterion = () => document.getElementsByClassName('morePager').length === 0
  } else {
    // criterion = () => getElementsByXPath('//*/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div/div[@role="progressbar"]').length === 0
    // criterion = () => getElementsByXPath('/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[2]/div/div/div/div').length > 0
    criterion = () => document.querySelectorAll('.x1xzczws').length < 2
  }

  monload(() => {
    const time = setInterval(() => {
      document.documentElement.scrollTop += scrollMagnitude
      if (criterion()) {
        clearInterval(time)
        call()
      }
    }, scrollDelayInMilliSeconds)
  })
}

function loginFB () {
  const curUrl = document.location.href
  let nid = curUrl.match(/\?uid=(\d+)/) || curUrl.match(/\/profile.php\?id=(\d+)/)
  let sid
  if (nid) {
    nid = nid[1]
  } else {
    sid = curUrl.match(/facebook.com\/(.*)\b/)[1]
  }
  const id = nid || sid
  let h1el
  const interval = setInterval(() => {
    const h1elements = getElementsByXPath('//*/h1')
    if (h1elements.length === 0) {
      h1el = getElementsByXPath('//*/h2/div')[0]
    } else {
      h1el = h1elements.length > 1 ? h1elements[1] : h1elements[0]
    }
    if (h1el) {
      clearInterval(interval)
      advance()
    }
  }, 200)

  function advance () {
    const membername = h1el.innerText
    const parts = membername.match(/[^\r\n]+/g)
    const name = parts[0]
    let codename // abbiamo perso codename, guardi: https://www.facebook.com/renato.fabbri.125
    if (parts.length > 1) {
      codename = parts[1]
    }
    const userData = { name, codename, sid, nid, id, newfb: true }
    chrome.storage.sync.set({ userData }, () => {
      console.log('userData set', { userData })
      window.alert('login succeded.')
    })
  }
}

function getFriends (isFriends) { // if isFriends is false, getting friendships
  scrollTillEnd(() => chrome.storage.sync.get(
    ['userData'],
    ({ userData }) => scrapeFriends(userData, isFriends)
  ), true)
}

function scrapeFriends (userData, isFriends) {
  let elements = getElementsByXPath('//*/li/div[1]/div[1]/div[2]/div[1]/div[2]') // mutual friends
  if (elements.length === 0) { // maybe users' friends:
    elements = getElementsByXPath('//*/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div/div[2]').filter(c => c.children[0] !== undefined)
  } else if (getElementsByXPath('//*/li/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/a').length === 0) { // not mutual friends page:
    elements = [] // bypassing!
  }
  const structs = elements.map(c => {
    const struct = { name: c.children[0].innerText }
    if (!c.children[0].children[0]) {
      return struct
    }
    const linkName = c.children[0].children[0].href
    if (!linkName) {
      return struct
    }
    const numericMatch = linkName.match(/\?uid=(\d+)/) || linkName.match(/\/profile.php\?id=(\d+)/)

    if (numericMatch) {
      const nid = numericMatch[1]
      if (nid !== userData.nid) {
        struct.nid = nid
      }
    } else {
      const stringMatch = linkName.match(/facebook.com\/([^?/]+)/)
      if (stringMatch) {
        const sid = stringMatch[1]
        if (sid !== userData.sid) {
          struct.sid = sid
        }
      }
    }
    if (c.children.length === 1) {
      return struct
    }
    let linkFriends = c.children[1].href
    if (!linkFriends) {
      try {
        linkFriends = c.children[1].children[0].children[0].children[0].children[0].href // fixme: when happends?
      } catch (err) {
        console.log('one friend href not obtained')
      }
    }
    if (linkFriends && (/^([.,\d]+)/).test(c.childNodes[1].innerText)) {
      const num = c.childNodes[1].innerText.match(/^([.,\d]+)/)[1]
      if ((/\?uid=(\d+)/).test(linkFriends)) {
        struct.nid = linkFriends.match(/\?uid=(\d+)/)[1]
        struct.mutual = num
      } else if ((/\/profile.php\?id=(\d+)/).test(linkFriends)) {
        struct.nid = linkFriends.match(/\/profile.php\?id=(\d+)/)[1]
        struct.mutual = num
        struct.nfriends = num // FIXME: perché per alcuni sono nfriends, per altri mutual?
      } else if ((/\/friends_mutual$/).test(linkFriends)) {
        struct.sid = linkFriends.match(/facebook.com\/(.*)\/friends_mutual$/)[1]
        struct.mutual = num
      } else if ((/\/friends$/).test(linkFriends)) {
        struct.sid = linkFriends.match(/facebook.com\/(.*)\/friends$/)[1]
        struct.mutual = num
        struct.nfriends = num
      } else {
        throw new Error('friends link of a scraped friend not understood:', linkFriends)
      }
    }
    return struct
  })
  console.log('scraped data:', structs)
  chrome.runtime.sendMessage({ command: 'absorb', background: true, structs }, () => {
    if (isFriends) {
      console.log('friends scraped and sent to background:', structs.length)
      window.alert('friends registered.')
    } else {
      console.log('friendships scraped and sent to background:', structs.length)
    }
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request, sender, sendResponse })
  if (!request.content) return
  const { command } = request
  if (command === 'login') {
    console.log('lets get this login data!')
    loginFB()
  } if (command === 'scrapeFriends') {
    getFriends(true)
  } if (command === 'scrapeFriendships') {
    getFriends(false)
  }
})
