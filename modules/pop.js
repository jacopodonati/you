/* global chrome */
console.log('popup (script) initiated')

function formatDate (date) {
  if (!date) {
    return '--'
  }

  const formattedDate = new Date(date).toLocaleString(navigator.language,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  return formattedDate // .replace(/ /, '/').replace(/ /, '/')
}

const build = () => {
  setFacebook()
}

function setFacebook () {
  const section = document.querySelector('#facebook')

  function setField (name, dict, attr) {
    attr = attr || name
    const field = section.querySelector(`.value.${name}`)
    let value = dict || '--'
    if (dict && dict.constructor === Object) {
      value = dict[attr] || '--'
    }
    field.textContent = value
  }

  chrome.storage.sync.get(
    ['userData', 'nfriends', 'nfriendships', 'nscrapped', 'metaData', 'lastScrapped', 'sround'],
    ({ userData, nfriends, nfriendships, nscrapped, metaData, lastScrapped, sround }) => {
      console.log({ userData, nfriends, metaData, lastScrapped, sround })
      userData = userData || {}

      setField('name', userData)
      setField('id', userData)
      setField('friends', nfriends)
      setField('friendships', nfriendships)
      setField('scraped', nscrapped)
      setField('last-scrape', formatDate(lastScrapped))
      setField('round', sround)

      metaData = metaData || {}

      const command = userData.id ? 'logout' : 'login'
      const loginButton = section.querySelector('.login')
      loginButton.textContent = command
      loginButton.addEventListener('click', function () {
        if (command === 'logout') {
          chrome.storage.sync.remove(['userData', 'lastScrapped', 'nfriends', 'nfriendships', 'nscrapped'], () => {
            console.log('yeah, logged out')
            setTimeout(() => window.close(), 1000)
          })
          chrome.storage.local.remove(['net'])
        } else {
          chrome.runtime.sendMessage({
            command,
            background: true
          })
        }
      })

      const getFriendsButton = section.querySelector('.get-friends')
      getFriendsButton.disabled = userData.id === undefined
      getFriendsButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({
          command: 'scrappeFriends',
          background: true
        })
      })

      const getFriendshipsButton = section.querySelector('.get-friendships')
      getFriendshipsButton.disabled = (nfriends === undefined || nfriends === nscrapped)
      getFriendshipsButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({
          command: 'scrappeFriendships',
          background: true
        })
      })

      const seeYourselfButton = section.querySelector('.see-yourself')
      seeYourselfButton.disabled = !(nfriendships > 0)
      seeYourselfButton.addEventListener('click', function () {
        chrome.runtime.openOptionsPage()
      })
    }
  )
}

document.addEventListener('DOMContentLoaded', function () {
  build()
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log('received message on popup!', { request, sender, sendResponse })
    }
  )
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!request.popup) return
  const { command } = request
  if (command === 'writeNet') {
    chrome.storage.sync.get(['userData'])
  }
})
