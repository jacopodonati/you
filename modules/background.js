/* global chrome */
console.log('background service worker initiated')
const fnet = chrome.fnet = require('./aux/fnetworks.js')

let currentTabId
let currentStep
// let visitCount

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message on background!', { request, sender, sendResponse })
  if (!request.background) return
  const { command } = request
  switch (command) {
    case 'login':
      loginFacebook()
      break
    case 'scrappeFriends':
      scrapeFacebookFriends()
      break
    case 'scrappeFriendships':
      scrapeFacebookRelatioships()
      break
    case 'seeNetwork':
      seeNetwork()
      break
    case 'absorb':
      absorbNetwork(request)
      break
    default:
      break
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (tabId !== currentTabId || changeInfo.status !== 'complete') return
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['modules/content.js']
  }, () => {
    chrome.tabs.sendMessage(tabId, { command: currentStep, content: true })
  })
})

function loginFacebook () {
  chrome.storage.sync.set({ lastScrapped: new Date().toJSON() }, () => {
    chrome.windows.create({ url: 'https://www.facebook.com/profile.php' }).then(r => {
      currentTabId = r.tabs[0].id
      currentStep = 'login'
    })
  })
}

function scrapeFacebookFriends () {
  chrome.storage.sync.get(['userData'], ({ userData }) => {
    const { sid, nid } = userData
    let url
    if (sid) {
      url = `https://www.facebook.com/${sid}/friends`
    } else {
      url = `https://www.facebook.com/profile.php?id=${nid}&sk=friends`
    }
    chrome.tabs.create({ url }).then(r => {
      currentTabId = r.id
      currentStep = 'scrappeFriends'
    })
  })
}

function scrapeFacebookRelatioships () {
  const url = fnet.getNextURL()
  console.log({ url })
  chrome.tabs.create({ url }).then(r => {
    currentTabId = r.id
    currentStep = 'scrappeFriendships'
  })
  // visitCount = 1
}

function seeNetwork () {
  // write net to database (send to content or popup to do so)
  // then open tab with url
  chrome.runtime.sendMessage({
    command: 'writeNet',
    net: fnet.graph.toJSON(),
    popup: true
  })
}

function absorbNetwork (request) {
  const { structs } = request
  let lastFriendships
  chrome.storage.sync.get(['nfriendships'], ({ nfriendships }) => {
    lastFriendships = nfriendships
  })
  fnet.absorb(structs)
  chrome.storage.local.set({ net: fnet.graph.export() })
  chrome.storage.sync.set({
    nfriends: fnet.graph.order,
    nfriendships: fnet.graph.size,
    nscrapped: fnet.nScrapped()
  }, () => {
    console.log('friends(ships) absorbed in network, and their number written to storage:', { structs })
    // check if we've scraped friends or mutual friends
    if (lastFriendships < fnet.graph.size) scrapeFacebookRelatioships()
  })
}
