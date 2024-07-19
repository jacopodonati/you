(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"mongodb-stitch-browser-sdk":32}],2:[function(require,module,exports){
const e = module.exports
const $ = require('jquery')

let count = 0
e.mkGrid = (cols, el, w, bgc, tcol) => {
  console.log({ cols, el, w, bgc, tcol })
  return $('<div/>', {
    class: 'mgrid',
    id: `mgrid-${count++}`,
    css: {
      display: 'grid',
      // 'grid-template-columns': Array(cols).fill('auto').join(' '),
      'grid-template-columns': Array(cols).fill(tcol || 'auto').join(' '),
      'background-color': bgc || '#21F693',
      padding: '8px',
      margin: '0 auto',
      // height: Math.floor(wand.artist.use.height * 0.065) + 'px',
      width: w || '30%',
      'border-radius': '2%'
    }
  }).appendTo(el || 'body')
}

e.gridDivider = (r, g, b, grid, sec, after, count) => {
  const fun = after ? 'insertAfter' : 'appendTo'
  count = count || 2
  for (let i = 0; i < count; i++) {
    $('<div/>', { css: { 'background-color': `rgba(${r},${g},${b},1)`, color: 'rgba(0,0,0,0)', height: '3px' } }).text('--')[fun](grid)
  }
}

e.chooseUnique = (marray, nelements) => {
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

e.stdDiv = () => e.centerDiv(undefined, undefined, e.chooseUnique(['#eeeeff', '#eeffee', '#ffeeee'], 1)[0], 3, 2)

e.centerDiv = (width, container, color, margin, padding) => {
  return $('<div/>', {
    css: {
      'background-color': color || '#c2F6c3',
      // margin: `0px auto ${d(margin, 0)}%`,
      margin: `0px auto ${d(margin, 0)}%`,
      padding: `${d(padding, 1)}%`,
      width: d(width, '50%'),
      'border-radius': '5%'
    }
  }).appendTo(container || 'body')
}

const d = e.defaultArg = (arg, def) => arg === undefined ? def : arg

},{"jquery":7}],3:[function(require,module,exports){
/* global chrome */
console.log('popup (script) initiated')
const $ = window.$ = require('jquery')
const fAll = require('./aux/transfer.js').fAll
const { stdDiv, mkGrid, gridDivider } = require('./aux/utils.js')

let cDiv

function mkDate (adate) {
  if (!adate) return '--'
  return new Date(adate).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
  }).replace(/ /, '/').replace(/ /, '/')
}

const mkRadio = id => {
  $('<input/>', { value: id, id, type: 'radio', name: 'oradio' }).appendTo(
    $('<label/>', { for: id }).html(id).appendTo(cDiv)
  )
  stdDiv('80%').attr('class', 'info').attr('id', 'd' + id).hide().html(id)
    .css('background-color', '#ddd')
}

function addRow (name, dict, grid, attr) {
  attr = attr || name
  $('<span/>').html(name + ':').appendTo(grid)
  $('<span/>').html(dict[attr] || '--').appendTo(grid)
}

const build = () => {
  cDiv = $('<div/>').appendTo('body')
  mkRadio('Facebook')
  mkRadio('WhatsApp')
  mkRadio('Telegram')
  $('input[type=radio][name=oradio]').on('change', function () {
    const option = $(this).val()
    console.log(option)
    $('.info').hide()
    $('#d' + option).show()
  })
  setFacebook()
}

function setFacebook () {
  const grid = mkGrid(2, '#dFacebook', '100%', '#fff')
    .css('margin-bottom', '1em')
    .css('width', '')
  function add (name, dict, attr) {
    addRow(name, dict, grid, attr)
  }
  chrome.storage.sync.get(
    ['userData', 'nfriends', 'nfriendships', 'nscrapped', 'metaData', 'lastScrapped', 'sround'],
    ({ userData, nfriends, nfriendships, nscrapped, metaData, lastScrapped, sround }) => {
      console.log({ userData, nfriends, metaData, lastScrapped, sround })
      userData = userData || {}
      add('name', userData)
      if (userData.codename) add('codename', userData)
      add('id', userData)
      gridDivider(160, 160, 160, grid, 1)
      metaData = metaData || {}
      $('<span/>').html('friends:').appendTo(grid)
      $('<span/>').html(nfriends).appendTo(grid)
      $('<span/>').html('friendships:').appendTo(grid)
      $('<span/>').html(nfriendships).appendTo(grid)
      $('<span/>').html('scrapped:').appendTo(grid)
      $('<span/>').html(nscrapped).appendTo(grid)
      gridDivider(160, 160, 160, grid, 1)
      $('<span/>').html('previous scrappe:').appendTo(grid)
      $('<span/>').html(mkDate(lastScrapped)).appendTo(grid)
      $('<span/>').html('round:').appendTo(grid)
      $('<span/>').html(sround || '--').appendTo(grid)
      const command = userData.id ? 'logout' : 'login'
      $('<button/>', {
        css: {
          width: '75%',
          background: '#efe'
        }
      })
        .appendTo('#dFacebook')
        .text(command)
        .click(() => {
          if (command === 'logout') {
            chrome.storage.sync.remove(['userData', 'lastScrapped', 'nfriends', 'nfriendships', 'nscrapped'], () => {
              console.log('yeah, logged out')
              setTimeout(() => window.close(), 1000)
            })
          } else {
            chrome.runtime.sendMessage({
              command,
              background: true
            })
          }
        })

      const disabled = command === 'login'
      $('<button/>', {
        disabled,
        css: {
          width: '75%',
          background: 'lightred'
        }
      })
        .appendTo('#dFacebook')
        .text('Get friends')
        .click(() => {
          chrome.runtime.sendMessage({
            command: 'scrappeFriends',
            background: true
          })
        })
      $('<button/>', {
        disabled,
        css: {
          width: '75%',
          background: 'lightred'
        }
      })
        .appendTo('#dFacebook')
        .text('Get friendships')
        .click(() => {
          chrome.runtime.sendMessage({
            command: 'scrappeFriendships',
            background: true
          })
        })
      $('<button/>', {
        disabled,
        css: {
          width: '75%',
          background: 'lightyellow'
        }
      })
        .appendTo('#dFacebook')
        .text('See yourself')
        .click(() => {
          chrome.runtime.sendMessage({
            command: 'seeNetwork',
            background: true
          })
        })
    }
  )
}

const start = () => {
  $('#Facebook').click()
}

$(document).ready(() => {
  build()
  start()

  $('<button/>')
    .appendTo(cDiv)
    .text('click to send message to content script!')
    .click(() => {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const activeTab = tabs[0]
        console.log({ activeTab })
        chrome.tabs.sendMessage(activeTab.id, { message: 'getMeContentScript' })
      })
    }).hide()
  $('<button/>')
    .appendTo(cDiv)
    .text('click to send message to service worker!')
    .click(() => {
      chrome.runtime.sendMessage({ message: 'forwardToServiceWorker' })
    }).hide()
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
    chrome.storage.sync.get(
      ['userData'],
      ({ userData }) => {
        fAll.df4b({ 'userData.id': userData.id }).then(() => {
          userData.net = request.net
          fAll.wf4b({ userData }).then(() => {
            console.log('net written')
            chrome.tabs.create({ url: `http://audiovisualmedicine.github.io?you&fid=${userData.id}&deg=true` })
          })
        })
      }
    )
  }
})

},{"./aux/transfer.js":1,"./aux/utils.js":2,"jquery":7}],4:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],5:[function(require,module,exports){
(function (Buffer,global){(function (){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('long'), require('buffer')) :
	typeof define === 'function' && define.amd ? define(['exports', 'long', 'buffer'], factory) :
	(factory((global.BSON = {}),global.long,global.Buffer));
}(this, (function (exports,long,buffer) { 'use strict';

	long = long && long.hasOwnProperty('default') ? long['default'] : long;
	buffer = buffer && buffer.hasOwnProperty('default') ? buffer['default'] : buffer;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n.default || n;
	}

	var map = createCommonjsModule(function (module) {

	  if (typeof commonjsGlobal.Map !== 'undefined') {
	    module.exports = commonjsGlobal.Map;
	    module.exports.Map = commonjsGlobal.Map;
	  } else {
	    // We will return a polyfill
	    var Map = function Map(array) {
	      this._keys = [];
	      this._values = {};

	      for (var i = 0; i < array.length; i++) {
	        if (array[i] == null) continue; // skip null and undefined

	        var entry = array[i];
	        var key = entry[0];
	        var value = entry[1]; // Add the key to the list of keys in order

	        this._keys.push(key); // Add the key and value to the values dictionary with a point
	        // to the location in the ordered keys list


	        this._values[key] = {
	          v: value,
	          i: this._keys.length - 1
	        };
	      }
	    };

	    Map.prototype.clear = function () {
	      this._keys = [];
	      this._values = {};
	    };

	    Map.prototype.delete = function (key) {
	      var value = this._values[key];
	      if (value == null) return false; // Delete entry

	      delete this._values[key]; // Remove the key from the ordered keys list

	      this._keys.splice(value.i, 1);

	      return true;
	    };

	    Map.prototype.entries = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? [key, self._values[key].v] : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    };

	    Map.prototype.forEach = function (callback, self) {
	      self = self || this;

	      for (var i = 0; i < this._keys.length; i++) {
	        var key = this._keys[i]; // Call the forEach callback

	        callback.call(self, this._values[key].v, key, self);
	      }
	    };

	    Map.prototype.get = function (key) {
	      return this._values[key] ? this._values[key].v : undefined;
	    };

	    Map.prototype.has = function (key) {
	      return this._values[key] != null;
	    };

	    Map.prototype.keys = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? key : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    };

	    Map.prototype.set = function (key, value) {
	      if (this._values[key]) {
	        this._values[key].v = value;
	        return this;
	      } // Add the key to the list of keys in order


	      this._keys.push(key); // Add the key and value to the values dictionary with a point
	      // to the location in the ordered keys list


	      this._values[key] = {
	        v: value,
	        i: this._keys.length - 1
	      };
	      return this;
	    };

	    Map.prototype.values = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? self._values[key].v : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    }; // Last ismaster


	    Object.defineProperty(Map.prototype, 'size', {
	      enumerable: true,
	      get: function get() {
	        return this._keys.length;
	      }
	    });
	    module.exports = Map;
	  }
	});
	var map_1 = map.Map;

	/**
	 * @ignore
	 */


	long.prototype.toExtendedJSON = function (options) {
	  if (options && options.relaxed) return this.toNumber();
	  return {
	    $numberLong: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	long.fromExtendedJSON = function (doc, options) {
	  var result = long.fromString(doc.$numberLong);
	  return options && options.relaxed ? result.toNumber() : result;
	};

	Object.defineProperty(long.prototype, '_bsontype', {
	  value: 'Long'
	});
	var long_1 = long;

	/**
	 * A class representation of the BSON Double type.
	 */

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

	var Double =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Double type
	   *
	   * @param {number} value the number we want to represent as a double.
	   * @return {Double}
	   */
	  function Double(value) {
	    _classCallCheck(this, Double);

	    this.value = value;
	  }
	  /**
	   * Access the number value.
	   *
	   * @method
	   * @return {number} returns the wrapped double number.
	   */


	  _createClass(Double, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON(options) {
	      if (options && options.relaxed && isFinite(this.value)) return this.value;
	      return {
	        $numberDouble: this.value.toString()
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc, options) {
	      return options && options.relaxed ? parseFloat(doc.$numberDouble) : new Double(parseFloat(doc.$numberDouble));
	    }
	  }]);

	  return Double;
	}();

	Object.defineProperty(Double.prototype, '_bsontype', {
	  value: 'Double'
	});
	var double_1 = Double;

	function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

	function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

	function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

	function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

	function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
	/**
	 * @class
	 * @param {number} low  the low (signed) 32 bits of the Timestamp.
	 * @param {number} high the high (signed) 32 bits of the Timestamp.
	 * @return {Timestamp}
	 */


	var Timestamp =
	/*#__PURE__*/
	function (_Long) {
	  _inherits(Timestamp, _Long);

	  function Timestamp(low, high) {
	    var _this;

	    _classCallCheck$1(this, Timestamp);

	    if (long_1.isLong(low)) {
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Timestamp).call(this, low.low, low.high));
	    } else {
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Timestamp).call(this, low, high));
	    }

	    return _possibleConstructorReturn(_this);
	  }
	  /**
	   * Return the JSON value.
	   *
	   * @method
	   * @return {String} the JSON representation.
	   */


	  _createClass$1(Timestamp, [{
	    key: "toJSON",
	    value: function toJSON() {
	      return {
	        $timestamp: this.toString()
	      };
	    }
	    /**
	     * Returns a Timestamp represented by the given (32-bit) integer value.
	     *
	     * @method
	     * @param {number} value the 32-bit integer in question.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "toExtendedJSON",

	    /**
	     * @ignore
	     */
	    value: function toExtendedJSON() {
	      return {
	        $timestamp: {
	          t: this.high,
	          i: this.low
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromInt",
	    value: function fromInt(value) {
	      return new Timestamp(long_1.fromInt(value));
	    }
	    /**
	     * Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned.
	     *
	     * @method
	     * @param {number} value the number in question.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromNumber",
	    value: function fromNumber(value) {
	      return new Timestamp(long_1.fromNumber(value));
	    }
	    /**
	     * Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.
	     *
	     * @method
	     * @param {number} lowBits the low 32-bits.
	     * @param {number} highBits the high 32-bits.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromBits",
	    value: function fromBits(lowBits, highBits) {
	      return new Timestamp(lowBits, highBits);
	    }
	    /**
	     * Returns a Timestamp from the given string, optionally using the given radix.
	     *
	     * @method
	     * @param {String} str the textual representation of the Timestamp.
	     * @param {number} [opt_radix] the radix in which the text is written.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromString",
	    value: function fromString(str, opt_radix) {
	      return new Timestamp(long_1.fromString(str, opt_radix));
	    }
	  }, {
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new Timestamp(doc.$timestamp.i, doc.$timestamp.t);
	    }
	  }]);

	  return Timestamp;
	}(long_1);

	Object.defineProperty(Timestamp.prototype, '_bsontype', {
	  value: 'Timestamp'
	});
	var timestamp = Timestamp;

	var empty = {};

	var empty$1 = /*#__PURE__*/Object.freeze({
		default: empty
	});

	var require$$0 = getCjsExportFromNamespace(empty$1);

	/* global window */

	/**
	 * Normalizes our expected stringified form of a function across versions of node
	 * @param {Function} fn The function to stringify
	 */


	function normalizedFunctionString(fn) {
	  return fn.toString().replace('function(', 'function (');
	}

	function insecureRandomBytes(size) {
	  var result = new Uint8Array(size);

	  for (var i = 0; i < size; ++i) {
	    result[i] = Math.floor(Math.random() * 256);
	  }

	  return result;
	}

	var randomBytes = insecureRandomBytes;

	if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
	  randomBytes = function randomBytes(size) {
	    return window.crypto.getRandomValues(new Uint8Array(size));
	  };
	} else {
	  try {
	    randomBytes = require$$0.randomBytes;
	  } catch (e) {} // keep the fallback
	  // NOTE: in transpiled cases the above require might return null/undefined


	  if (randomBytes == null) {
	    randomBytes = insecureRandomBytes;
	  }
	}

	var utils = {
	  normalizedFunctionString: normalizedFunctionString,
	  randomBytes: randomBytes
	};

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js
	function defaultSetTimout() {
	  throw new Error('setTimeout has not been defined');
	}

	function defaultClearTimeout() {
	  throw new Error('clearTimeout has not been defined');
	}

	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;

	if (typeof global.setTimeout === 'function') {
	  cachedSetTimeout = setTimeout;
	}

	if (typeof global.clearTimeout === 'function') {
	  cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	  if (cachedSetTimeout === setTimeout) {
	    //normal enviroments in sane situations
	    return setTimeout(fun, 0);
	  } // if setTimeout wasn't available but was latter defined


	  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	    cachedSetTimeout = setTimeout;
	    return setTimeout(fun, 0);
	  }

	  try {
	    // when when somebody has screwed with setTimeout but no I.E. maddness
	    return cachedSetTimeout(fun, 0);
	  } catch (e) {
	    try {
	      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	      return cachedSetTimeout.call(null, fun, 0);
	    } catch (e) {
	      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	      return cachedSetTimeout.call(this, fun, 0);
	    }
	  }
	}

	function runClearTimeout(marker) {
	  if (cachedClearTimeout === clearTimeout) {
	    //normal enviroments in sane situations
	    return clearTimeout(marker);
	  } // if clearTimeout wasn't available but was latter defined


	  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	    cachedClearTimeout = clearTimeout;
	    return clearTimeout(marker);
	  }

	  try {
	    // when when somebody has screwed with setTimeout but no I.E. maddness
	    return cachedClearTimeout(marker);
	  } catch (e) {
	    try {
	      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	      return cachedClearTimeout.call(null, marker);
	    } catch (e) {
	      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	      return cachedClearTimeout.call(this, marker);
	    }
	  }
	}

	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	  if (!draining || !currentQueue) {
	    return;
	  }

	  draining = false;

	  if (currentQueue.length) {
	    queue = currentQueue.concat(queue);
	  } else {
	    queueIndex = -1;
	  }

	  if (queue.length) {
	    drainQueue();
	  }
	}

	function drainQueue() {
	  if (draining) {
	    return;
	  }

	  var timeout = runTimeout(cleanUpNextTick);
	  draining = true;
	  var len = queue.length;

	  while (len) {
	    currentQueue = queue;
	    queue = [];

	    while (++queueIndex < len) {
	      if (currentQueue) {
	        currentQueue[queueIndex].run();
	      }
	    }

	    queueIndex = -1;
	    len = queue.length;
	  }

	  currentQueue = null;
	  draining = false;
	  runClearTimeout(timeout);
	}

	function nextTick(fun) {
	  var args = new Array(arguments.length - 1);

	  if (arguments.length > 1) {
	    for (var i = 1; i < arguments.length; i++) {
	      args[i - 1] = arguments[i];
	    }
	  }

	  queue.push(new Item(fun, args));

	  if (queue.length === 1 && !draining) {
	    runTimeout(drainQueue);
	  }
	} // v8 likes predictible objects

	function Item(fun, array) {
	  this.fun = fun;
	  this.array = array;
	}

	Item.prototype.run = function () {
	  this.fun.apply(null, this.array);
	};

	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues

	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;
	function binding(name) {
	  throw new Error('process.binding is not supported');
	}
	function cwd() {
	  return '/';
	}
	function chdir(dir) {
	  throw new Error('process.chdir is not supported');
	}
	function umask() {
	  return 0;
	} // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

	var performance = global.performance || {};

	var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
	  return new Date().getTime();
	}; // generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime


	function hrtime(previousTimestamp) {
	  var clocktime = performanceNow.call(performance) * 1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor(clocktime % 1 * 1e9);

	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];

	    if (nanoseconds < 0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }

	  return [seconds, nanoseconds];
	}
	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}
	var process = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var inherits;

	if (typeof Object.create === 'function') {
	  inherits = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;

	    var TempCtor = function TempCtor() {};

	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

	var inherits$1 = inherits;

	function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
	var formatRegExp = /%[sdj%]/g;
	function format(f) {
	  if (!isString(f)) {
	    var objects = [];

	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }

	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;

	    switch (x) {
	      case '%s':
	        return String(args[i++]);

	      case '%d':
	        return Number(args[i++]);

	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }

	      default:
	        return x;
	    }
	  });

	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }

	  return str;
	}
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.

	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  var warned = false;

	  function deprecated() {
	    if (!warned) {
	      {
	        console.error(msg);
	      }

	      warned = true;
	    }

	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}
	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();

	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;

	      debugs[set] = function () {
	        var msg = format.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
	    }
	  }

	  return debugs[set];
	}
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */

	/* legacy: obj, showHidden, depth, colors*/

	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  }; // legacy...

	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];

	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  } // set default options


	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	} // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

	inspect.colors = {
	  'bold': [1, 22],
	  'italic': [3, 23],
	  'underline': [4, 24],
	  'inverse': [7, 27],
	  'white': [37, 39],
	  'grey': [90, 39],
	  'black': [30, 39],
	  'blue': [34, 39],
	  'cyan': [36, 39],
	  'green': [32, 39],
	  'magenta': [35, 39],
	  'red': [31, 39],
	  'yellow': [33, 39]
	}; // Don't use 'blue' not visible on cmd.exe

	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};

	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}

	function stylizeNoColor(str, styleType) {
	  return str;
	}

	function arrayToHash(array) {
	  var hash = {};
	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });
	  return hash;
	}

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
	  value.inspect !== inspect && // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);

	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }

	    return ret;
	  } // Primitive types cannot have properties


	  var primitive = formatPrimitive(ctx, value);

	  if (primitive) {
	    return primitive;
	  } // Look up the keys of the object.


	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  } // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


	  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  } // Some type of object without properties can be shortcutted.


	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }

	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }

	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }

	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '',
	      array = false,
	      braces = ['{', '}']; // Make Array say that they are Array

	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  } // Make functions say that they are functions


	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  } // Make RegExps say that they are RegExps


	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  } // Make dates with properties first say the date


	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  } // Make error with message first say the error


	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);
	  var output;

	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();
	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }

	  if (isNumber(value)) return ctx.stylize('' + value, 'number');
	  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

	  if (isNull(value)) return ctx.stylize('null', 'null');
	}

	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];

	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }

	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}

	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || {
	    value: value[key]
	  };

	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }

	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }

	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }

	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }

	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }

	    name = JSON.stringify('' + key);

	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function (prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	} // NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.


	function isArray(ar) {
	  return Array.isArray(ar);
	}
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	function isString(arg) {
	  return typeof arg === 'string';
	}
	function isSymbol(arg) {
	  return _typeof$1(arg) === 'symbol';
	}
	function isUndefined(arg) {
	  return arg === void 0;
	}
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	function isObject(arg) {
	  return _typeof$1(arg) === 'object' && arg !== null;
	}
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	function isError(e) {
	  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof$1(arg) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	function isBuffer(maybeBuf) {
	  return Buffer.isBuffer(maybeBuf);
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

	function timestamp$1() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	} // log is just a thin wrapper to console.log that prepends a timestamp


	function log() {
	  console.log('%s - %s', timestamp$1(), format.apply(null, arguments));
	}
	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	  var keys = Object.keys(add);
	  var i = keys.length;

	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }

	  return origin;
	}

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var util = {
	  inherits: inherits$1,
	  _extend: _extend,
	  log: log,
	  isBuffer: isBuffer,
	  isPrimitive: isPrimitive,
	  isFunction: isFunction,
	  isError: isError,
	  isDate: isDate,
	  isObject: isObject,
	  isRegExp: isRegExp,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol,
	  isString: isString,
	  isNumber: isNumber,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean,
	  isArray: isArray,
	  inspect: inspect,
	  deprecate: deprecate,
	  format: format,
	  debuglog: debuglog
	};

	var util$1 = /*#__PURE__*/Object.freeze({
		format: format,
		deprecate: deprecate,
		debuglog: debuglog,
		inspect: inspect,
		isArray: isArray,
		isBoolean: isBoolean,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber,
		isString: isString,
		isSymbol: isSymbol,
		isUndefined: isUndefined,
		isRegExp: isRegExp,
		isObject: isObject,
		isDate: isDate,
		isError: isError,
		isFunction: isFunction,
		isPrimitive: isPrimitive,
		isBuffer: isBuffer,
		log: log,
		inherits: inherits$1,
		_extend: _extend,
		default: util
	});

	var util$2 = getCjsExportFromNamespace(util$1);

	function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

	var Buffer$1 = buffer.Buffer;
	var randomBytes$1 = utils.randomBytes;
	var deprecate$1 = util$2.deprecate; // constants

	var PROCESS_UNIQUE = randomBytes$1(5); // Regular expression that checks for hex value

	var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
	var hasBufferType = false; // Check if buffer exists

	try {
	  if (Buffer$1 && Buffer$1.from) hasBufferType = true;
	} catch (err) {
	  hasBufferType = false;
	} // Precomputed hex table enables speedy hex string conversion


	var hexTable = [];

	for (var _i = 0; _i < 256; _i++) {
	  hexTable[_i] = (_i <= 15 ? '0' : '') + _i.toString(16);
	} // Lookup tables


	var decodeLookup = [];
	var i = 0;

	while (i < 10) {
	  decodeLookup[0x30 + i] = i++;
	}

	while (i < 16) {
	  decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++;
	}

	var _Buffer = Buffer$1;

	function convertToHex(bytes) {
	  return bytes.toString('hex');
	}

	function makeObjectIdError(invalidString, index) {
	  var invalidCharacter = invalidString[index];
	  return new TypeError("ObjectId string \"".concat(invalidString, "\" contains invalid character \"").concat(invalidCharacter, "\" with character code (").concat(invalidString.charCodeAt(index), "). All character codes for a non-hex string must be less than 256."));
	}
	/**
	 * A class representation of the BSON ObjectId type.
	 */


	var ObjectId =
	/*#__PURE__*/
	function () {
	  /**
	   * Create an ObjectId type
	   *
	   * @param {(string|Buffer|number)} id Can be a 24 byte hex string, 12 byte binary Buffer, or a Number.
	   * @property {number} generationTime The generation time of this ObjectId instance
	   * @return {ObjectId} instance of ObjectId.
	   */
	  function ObjectId(id) {
	    _classCallCheck$2(this, ObjectId);

	    // Duck-typing to support ObjectId from different npm packages
	    if (id instanceof ObjectId) return id; // The most common usecase (blank id, new objectId instance)

	    if (id == null || typeof id === 'number') {
	      // Generate a new id
	      this.id = ObjectId.generate(id); // If we are caching the hex string

	      if (ObjectId.cacheHexString) this.__id = this.toString('hex'); // Return the object

	      return;
	    } // Check if the passed in id is valid


	    var valid = ObjectId.isValid(id); // Throw an error if it's not a valid setup

	    if (!valid && id != null) {
	      throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	    } else if (valid && typeof id === 'string' && id.length === 24 && hasBufferType) {
	      return new ObjectId(Buffer$1.from(id, 'hex'));
	    } else if (valid && typeof id === 'string' && id.length === 24) {
	      return ObjectId.createFromHexString(id);
	    } else if (id != null && id.length === 12) {
	      // assume 12 byte string
	      this.id = id;
	    } else if (id != null && id.toHexString) {
	      // Duck-typing to support ObjectId from different npm packages
	      return ObjectId.createFromHexString(id.toHexString());
	    } else {
	      throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	    }

	    if (ObjectId.cacheHexString) this.__id = this.toString('hex');
	  }
	  /**
	   * Return the ObjectId id as a 24 byte hex string representation
	   *
	   * @method
	   * @return {string} return the 24 byte hex string representation.
	   */


	  _createClass$2(ObjectId, [{
	    key: "toHexString",
	    value: function toHexString() {
	      if (ObjectId.cacheHexString && this.__id) return this.__id;
	      var hexString = '';

	      if (!this.id || !this.id.length) {
	        throw new TypeError('invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' + JSON.stringify(this.id) + ']');
	      }

	      if (this.id instanceof _Buffer) {
	        hexString = convertToHex(this.id);
	        if (ObjectId.cacheHexString) this.__id = hexString;
	        return hexString;
	      }

	      for (var _i2 = 0; _i2 < this.id.length; _i2++) {
	        var hexChar = hexTable[this.id.charCodeAt(_i2)];

	        if (typeof hexChar !== 'string') {
	          throw makeObjectIdError(this.id, _i2);
	        }

	        hexString += hexChar;
	      }

	      if (ObjectId.cacheHexString) this.__id = hexString;
	      return hexString;
	    }
	    /**
	     * Update the ObjectId index used in generating new ObjectId's on the driver
	     *
	     * @method
	     * @return {number} returns next index value.
	     * @ignore
	     */

	  }, {
	    key: "toString",

	    /**
	     * Converts the id into a 24 byte hex string for printing
	     *
	     * @param {String} format The Buffer toString format parameter.
	     * @return {String} return the 24 byte hex string representation.
	     * @ignore
	     */
	    value: function toString(format) {
	      // Is the id a buffer then use the buffer toString method to return the format
	      if (this.id && this.id.copy) {
	        return this.id.toString(typeof format === 'string' ? format : 'hex');
	      }

	      return this.toHexString();
	    }
	    /**
	     * Converts to its JSON representation.
	     *
	     * @return {String} return the 24 byte hex string representation.
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.toHexString();
	    }
	    /**
	     * Compares the equality of this ObjectId with `otherID`.
	     *
	     * @method
	     * @param {object} otherId ObjectId instance to compare against.
	     * @return {boolean} the result of comparing two ObjectId's
	     */

	  }, {
	    key: "equals",
	    value: function equals(otherId) {
	      if (otherId instanceof ObjectId) {
	        return this.toString() === otherId.toString();
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12 && this.id instanceof _Buffer) {
	        return otherId === this.id.toString('binary');
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
	        return otherId.toLowerCase() === this.toHexString();
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
	        return otherId === this.id;
	      }

	      if (otherId != null && (otherId instanceof ObjectId || otherId.toHexString)) {
	        return otherId.toHexString() === this.toHexString();
	      }

	      return false;
	    }
	    /**
	     * Returns the generation date (accurate up to the second) that this ID was generated.
	     *
	     * @method
	     * @return {Date} the generation date
	     */

	  }, {
	    key: "getTimestamp",
	    value: function getTimestamp() {
	      var timestamp = new Date();
	      var time = this.id.readUInt32BE(0);
	      timestamp.setTime(Math.floor(time) * 1000);
	      return timestamp;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",

	    /**
	     * @ignore
	     */
	    value: function toExtendedJSON() {
	      if (this.toHexString) return {
	        $oid: this.toHexString()
	      };
	      return {
	        $oid: this.toString('hex')
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "getInc",
	    value: function getInc() {
	      return ObjectId.index = (ObjectId.index + 1) % 0xffffff;
	    }
	    /**
	     * Generate a 12 byte id buffer used in ObjectId's
	     *
	     * @method
	     * @param {number} [time] optional parameter allowing to pass in a second based timestamp.
	     * @return {Buffer} return the 12 byte id buffer string.
	     */

	  }, {
	    key: "generate",
	    value: function generate(time) {
	      if ('number' !== typeof time) {
	        time = ~~(Date.now() / 1000);
	      }

	      var inc = ObjectId.getInc();
	      var buffer$$1 = Buffer$1.alloc(12); // 4-byte timestamp

	      buffer$$1[3] = time & 0xff;
	      buffer$$1[2] = time >> 8 & 0xff;
	      buffer$$1[1] = time >> 16 & 0xff;
	      buffer$$1[0] = time >> 24 & 0xff; // 5-byte process unique

	      buffer$$1[4] = PROCESS_UNIQUE[0];
	      buffer$$1[5] = PROCESS_UNIQUE[1];
	      buffer$$1[6] = PROCESS_UNIQUE[2];
	      buffer$$1[7] = PROCESS_UNIQUE[3];
	      buffer$$1[8] = PROCESS_UNIQUE[4]; // 3-byte counter

	      buffer$$1[11] = inc & 0xff;
	      buffer$$1[10] = inc >> 8 & 0xff;
	      buffer$$1[9] = inc >> 16 & 0xff;
	      return buffer$$1;
	    }
	  }, {
	    key: "createPk",
	    value: function createPk() {
	      return new ObjectId();
	    }
	    /**
	     * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
	     *
	     * @method
	     * @param {number} time an integer number representing a number of seconds.
	     * @return {ObjectId} return the created ObjectId
	     */

	  }, {
	    key: "createFromTime",
	    value: function createFromTime(time) {
	      var buffer$$1 = Buffer$1.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Encode time into first 4 bytes

	      buffer$$1[3] = time & 0xff;
	      buffer$$1[2] = time >> 8 & 0xff;
	      buffer$$1[1] = time >> 16 & 0xff;
	      buffer$$1[0] = time >> 24 & 0xff; // Return the new objectId

	      return new ObjectId(buffer$$1);
	    }
	    /**
	     * Creates an ObjectId from a hex string representation of an ObjectId.
	     *
	     * @method
	     * @param {string} hexString create a ObjectId from a passed in 24 byte hexstring.
	     * @return {ObjectId} return the created ObjectId
	     */

	  }, {
	    key: "createFromHexString",
	    value: function createFromHexString(string) {
	      // Throw an error if it's not a valid setup
	      if (typeof string === 'undefined' || string != null && string.length !== 24) {
	        throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	      } // Use Buffer.from method if available


	      if (hasBufferType) return new ObjectId(Buffer$1.from(string, 'hex')); // Calculate lengths

	      var array = new _Buffer(12);
	      var n = 0;
	      var i = 0;

	      while (i < 24) {
	        array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)];
	      }

	      return new ObjectId(array);
	    }
	    /**
	     * Checks if a value is a valid bson ObjectId
	     *
	     * @method
	     * @return {boolean} return true if the value is a valid bson ObjectId, return false otherwise.
	     */

	  }, {
	    key: "isValid",
	    value: function isValid(id) {
	      if (id == null) return false;

	      if (typeof id === 'number') {
	        return true;
	      }

	      if (typeof id === 'string') {
	        return id.length === 12 || id.length === 24 && checkForHexRegExp.test(id);
	      }

	      if (id instanceof ObjectId) {
	        return true;
	      }

	      if (id instanceof _Buffer && id.length === 12) {
	        return true;
	      } // Duck-Typing detection of ObjectId like objects


	      if (id.toHexString) {
	        return id.id.length === 12 || id.id.length === 24 && checkForHexRegExp.test(id.id);
	      }

	      return false;
	    }
	  }, {
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new ObjectId(doc.$oid);
	    }
	  }]);

	  return ObjectId;
	}(); // Deprecated methods


	ObjectId.get_inc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.get_inc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.getInc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.generate = deprecate$1(function (time) {
	  return ObjectId.generate(time);
	}, 'Please use the static `ObjectId.generate(time)` instead');
	/**
	 * @ignore
	 */

	Object.defineProperty(ObjectId.prototype, 'generationTime', {
	  enumerable: true,
	  get: function get() {
	    return this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24;
	  },
	  set: function set(value) {
	    // Encode time into first 4 bytes
	    this.id[3] = value & 0xff;
	    this.id[2] = value >> 8 & 0xff;
	    this.id[1] = value >> 16 & 0xff;
	    this.id[0] = value >> 24 & 0xff;
	  }
	});
	/**
	 * Converts to a string representation of this Id.
	 *
	 * @return {String} return the 24 byte hex string representation.
	 * @ignore
	 */

	ObjectId.prototype[util$2.inspect.custom || 'inspect'] = ObjectId.prototype.toString;
	/**
	 * @ignore
	 */

	ObjectId.index = ~~(Math.random() * 0xffffff); // In 4.0.0 and 4.0.1, this property name was changed to ObjectId to match the class name.
	// This caused interoperability problems with previous versions of the library, so in
	// later builds we changed it back to ObjectID (capital D) to match legacy implementations.

	Object.defineProperty(ObjectId.prototype, '_bsontype', {
	  value: 'ObjectID'
	});
	var objectid = ObjectId;

	function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

	function alphabetize(str) {
	  return str.split('').sort().join('');
	}
	/**
	 * A class representation of the BSON RegExp type.
	 */


	var BSONRegExp =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a RegExp type
	   *
	   * @param {string} pattern The regular expression pattern to match
	   * @param {string} options The regular expression options
	   */
	  function BSONRegExp(pattern, options) {
	    _classCallCheck$3(this, BSONRegExp);

	    // Execute
	    this.pattern = pattern || '';
	    this.options = options ? alphabetize(options) : ''; // Validate options

	    for (var i = 0; i < this.options.length; i++) {
	      if (!(this.options[i] === 'i' || this.options[i] === 'm' || this.options[i] === 'x' || this.options[i] === 'l' || this.options[i] === 's' || this.options[i] === 'u')) {
	        throw new Error("The regular expression option [".concat(this.options[i], "] is not supported"));
	      }
	    }
	  }
	  /**
	   * @ignore
	   */


	  _createClass$3(BSONRegExp, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $regularExpression: {
	          pattern: this.pattern,
	          options: this.options
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new BSONRegExp(doc.$regularExpression.pattern, doc.$regularExpression.options.split('').sort().join(''));
	    }
	  }]);

	  return BSONRegExp;
	}();

	Object.defineProperty(BSONRegExp.prototype, '_bsontype', {
	  value: 'BSONRegExp'
	});
	var regexp = BSONRegExp;

	/**
	 * A class representation of the BSON Symbol type.
	 */

	function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

	var BSONSymbol =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Symbol type
	   *
	   * @param {string} value the string representing the symbol.
	   */
	  function BSONSymbol(value) {
	    _classCallCheck$4(this, BSONSymbol);

	    this.value = value;
	  }
	  /**
	   * Access the wrapped string value.
	   *
	   * @method
	   * @return {String} returns the wrapped string.
	   */


	  _createClass$4(BSONSymbol, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "inspect",
	    value: function inspect() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $symbol: this.value
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new BSONSymbol(doc.$symbol);
	    }
	  }]);

	  return BSONSymbol;
	}();

	Object.defineProperty(BSONSymbol.prototype, '_bsontype', {
	  value: 'Symbol'
	});
	var symbol = BSONSymbol;

	/**
	 * A class representation of a BSON Int32 type.
	 */

	function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }

	var Int32 =
	/*#__PURE__*/
	function () {
	  /**
	   * Create an Int32 type
	   *
	   * @param {number} value the number we want to represent as an int32.
	   * @return {Int32}
	   */
	  function Int32(value) {
	    _classCallCheck$5(this, Int32);

	    this.value = value;
	  }
	  /**
	   * Access the number value.
	   *
	   * @method
	   * @return {number} returns the wrapped int32 number.
	   */


	  _createClass$5(Int32, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON(options) {
	      if (options && options.relaxed) return this.value;
	      return {
	        $numberInt: this.value.toString()
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc, options) {
	      return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
	    }
	  }]);

	  return Int32;
	}();

	Object.defineProperty(Int32.prototype, '_bsontype', {
	  value: 'Int32'
	});
	var int_32 = Int32;

	/**
	 * A class representation of the BSON Code type.
	 */

	function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }

	var Code =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Code type
	   *
	   * @param {(string|function)} code a string or function.
	   * @param {Object} [scope] an optional scope for the function.
	   * @return {Code}
	   */
	  function Code(code, scope) {
	    _classCallCheck$6(this, Code);

	    this.code = code;
	    this.scope = scope;
	  }
	  /**
	   * @ignore
	   */


	  _createClass$6(Code, [{
	    key: "toJSON",
	    value: function toJSON() {
	      return {
	        scope: this.scope,
	        code: this.code
	      };
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      if (this.scope) {
	        return {
	          $code: this.code,
	          $scope: this.scope
	        };
	      }

	      return {
	        $code: this.code
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new Code(doc.$code, doc.$scope);
	    }
	  }]);

	  return Code;
	}();

	Object.defineProperty(Code.prototype, '_bsontype', {
	  value: 'Code'
	});
	var code = Code;

	var Buffer$2 = buffer.Buffer;
	var PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
	var PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
	var PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
	var EXPONENT_MAX = 6111;
	var EXPONENT_MIN = -6176;
	var EXPONENT_BIAS = 6176;
	var MAX_DIGITS = 34; // Nan value bits as 32 bit values (due to lack of longs)

	var NAN_BUFFER = [0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse(); // Infinity value bits 32 bit values (due to lack of longs)

	var INF_NEGATIVE_BUFFER = [0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
	var INF_POSITIVE_BUFFER = [0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
	var EXPONENT_REGEX = /^([-+])?(\d+)?$/; // Detect if the value is a digit

	function isDigit(value) {
	  return !isNaN(parseInt(value, 10));
	} // Divide two uint128 values


	function divideu128(value) {
	  var DIVISOR = long_1.fromNumber(1000 * 1000 * 1000);

	  var _rem = long_1.fromNumber(0);

	  if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
	    return {
	      quotient: value,
	      rem: _rem
	    };
	  }

	  for (var i = 0; i <= 3; i++) {
	    // Adjust remainder to match value of next dividend
	    _rem = _rem.shiftLeft(32); // Add the divided to _rem

	    _rem = _rem.add(new long_1(value.parts[i], 0));
	    value.parts[i] = _rem.div(DIVISOR).low;
	    _rem = _rem.modulo(DIVISOR);
	  }

	  return {
	    quotient: value,
	    rem: _rem
	  };
	} // Multiply two Long values and return the 128 bit value


	function multiply64x2(left, right) {
	  if (!left && !right) {
	    return {
	      high: long_1.fromNumber(0),
	      low: long_1.fromNumber(0)
	    };
	  }

	  var leftHigh = left.shiftRightUnsigned(32);
	  var leftLow = new long_1(left.getLowBits(), 0);
	  var rightHigh = right.shiftRightUnsigned(32);
	  var rightLow = new long_1(right.getLowBits(), 0);
	  var productHigh = leftHigh.multiply(rightHigh);
	  var productMid = leftHigh.multiply(rightLow);
	  var productMid2 = leftLow.multiply(rightHigh);
	  var productLow = leftLow.multiply(rightLow);
	  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	  productMid = new long_1(productMid.getLowBits(), 0).add(productMid2).add(productLow.shiftRightUnsigned(32));
	  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	  productLow = productMid.shiftLeft(32).add(new long_1(productLow.getLowBits(), 0)); // Return the 128 bit result

	  return {
	    high: productHigh,
	    low: productLow
	  };
	}

	function lessThan(left, right) {
	  // Make values unsigned
	  var uhleft = left.high >>> 0;
	  var uhright = right.high >>> 0; // Compare high bits first

	  if (uhleft < uhright) {
	    return true;
	  } else if (uhleft === uhright) {
	    var ulleft = left.low >>> 0;
	    var ulright = right.low >>> 0;
	    if (ulleft < ulright) return true;
	  }

	  return false;
	}

	function invalidErr(string, message) {
	  throw new TypeError("\"".concat(string, "\" is not a valid Decimal128 string - ").concat(message));
	}
	/**
	 * A class representation of the BSON Decimal128 type.
	 *
	 * @class
	 * @param {Buffer} bytes a buffer containing the raw Decimal128 bytes.
	 * @return {Double}
	 */


	function Decimal128(bytes) {
	  this.bytes = bytes;
	}
	/**
	 * Create a Decimal128 instance from a string representation
	 *
	 * @method
	 * @param {string} string a numeric string representation.
	 * @return {Decimal128} returns a Decimal128 instance.
	 */


	Decimal128.fromString = function (string) {
	  // Parse state tracking
	  var isNegative = false;
	  var sawRadix = false;
	  var foundNonZero = false; // Total number of significant digits (no leading or trailing zero)

	  var significantDigits = 0; // Total number of significand digits read

	  var nDigitsRead = 0; // Total number of digits (no leading zeros)

	  var nDigits = 0; // The number of the digits after radix

	  var radixPosition = 0; // The index of the first non-zero in *str*

	  var firstNonZero = 0; // Digits Array

	  var digits = [0]; // The number of digits in digits

	  var nDigitsStored = 0; // Insertion pointer for digits

	  var digitsInsert = 0; // The index of the first non-zero digit

	  var firstDigit = 0; // The index of the last digit

	  var lastDigit = 0; // Exponent

	  var exponent = 0; // loop index over array

	  var i = 0; // The high 17 digits of the significand

	  var significandHigh = [0, 0]; // The low 17 digits of the significand

	  var significandLow = [0, 0]; // The biased exponent

	  var biasedExponent = 0; // Read index

	  var index = 0; // Naively prevent against REDOS attacks.
	  // TODO: implementing a custom parsing for this, or refactoring the regex would yield
	  //       further gains.

	  if (string.length >= 7000) {
	    throw new TypeError('' + string + ' not a valid Decimal128 string');
	  } // Results


	  var stringMatch = string.match(PARSE_STRING_REGEXP);
	  var infMatch = string.match(PARSE_INF_REGEXP);
	  var nanMatch = string.match(PARSE_NAN_REGEXP); // Validate the string

	  if (!stringMatch && !infMatch && !nanMatch || string.length === 0) {
	    throw new TypeError('' + string + ' not a valid Decimal128 string');
	  }

	  if (stringMatch) {
	    // full_match = stringMatch[0]
	    // sign = stringMatch[1]
	    var unsignedNumber = stringMatch[2]; // stringMatch[3] is undefined if a whole number (ex "1", 12")
	    // but defined if a number w/ decimal in it (ex "1.0, 12.2")

	    var e = stringMatch[4];
	    var expSign = stringMatch[5];
	    var expNumber = stringMatch[6]; // they provided e, but didn't give an exponent number. for ex "1e"

	    if (e && expNumber === undefined) invalidErr(string, 'missing exponent power'); // they provided e, but didn't give a number before it. for ex "e1"

	    if (e && unsignedNumber === undefined) invalidErr(string, 'missing exponent base');

	    if (e === undefined && (expSign || expNumber)) {
	      invalidErr(string, 'missing e before exponent');
	    }
	  } // Get the negative or positive sign


	  if (string[index] === '+' || string[index] === '-') {
	    isNegative = string[index++] === '-';
	  } // Check if user passed Infinity or NaN


	  if (!isDigit(string[index]) && string[index] !== '.') {
	    if (string[index] === 'i' || string[index] === 'I') {
	      return new Decimal128(Buffer$2.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	    } else if (string[index] === 'N') {
	      return new Decimal128(Buffer$2.from(NAN_BUFFER));
	    }
	  } // Read all the digits


	  while (isDigit(string[index]) || string[index] === '.') {
	    if (string[index] === '.') {
	      if (sawRadix) invalidErr(string, 'contains multiple periods');
	      sawRadix = true;
	      index = index + 1;
	      continue;
	    }

	    if (nDigitsStored < 34) {
	      if (string[index] !== '0' || foundNonZero) {
	        if (!foundNonZero) {
	          firstNonZero = nDigitsRead;
	        }

	        foundNonZero = true; // Only store 34 digits

	        digits[digitsInsert++] = parseInt(string[index], 10);
	        nDigitsStored = nDigitsStored + 1;
	      }
	    }

	    if (foundNonZero) nDigits = nDigits + 1;
	    if (sawRadix) radixPosition = radixPosition + 1;
	    nDigitsRead = nDigitsRead + 1;
	    index = index + 1;
	  }

	  if (sawRadix && !nDigitsRead) throw new TypeError('' + string + ' not a valid Decimal128 string'); // Read exponent if exists

	  if (string[index] === 'e' || string[index] === 'E') {
	    // Read exponent digits
	    var match = string.substr(++index).match(EXPONENT_REGEX); // No digits read

	    if (!match || !match[2]) return new Decimal128(Buffer$2.from(NAN_BUFFER)); // Get exponent

	    exponent = parseInt(match[0], 10); // Adjust the index

	    index = index + match[0].length;
	  } // Return not a number


	  if (string[index]) return new Decimal128(Buffer$2.from(NAN_BUFFER)); // Done reading input
	  // Find first non-zero digit in digits

	  firstDigit = 0;

	  if (!nDigitsStored) {
	    firstDigit = 0;
	    lastDigit = 0;
	    digits[0] = 0;
	    nDigits = 1;
	    nDigitsStored = 1;
	    significantDigits = 0;
	  } else {
	    lastDigit = nDigitsStored - 1;
	    significantDigits = nDigits;

	    if (significantDigits !== 1) {
	      while (string[firstNonZero + significantDigits - 1] === '0') {
	        significantDigits = significantDigits - 1;
	      }
	    }
	  } // Normalization of exponent
	  // Correct exponent based on radix position, and shift significand as needed
	  // to represent user input
	  // Overflow prevention


	  if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
	    exponent = EXPONENT_MIN;
	  } else {
	    exponent = exponent - radixPosition;
	  } // Attempt to normalize the exponent


	  while (exponent > EXPONENT_MAX) {
	    // Shift exponent to significand and decrease
	    lastDigit = lastDigit + 1;

	    if (lastDigit - firstDigit > MAX_DIGITS) {
	      // Check if we have a zero then just hard clamp, otherwise fail
	      var digitsString = digits.join('');

	      if (digitsString.match(/^0+$/)) {
	        exponent = EXPONENT_MAX;
	        break;
	      }

	      invalidErr(string, 'overflow');
	    }

	    exponent = exponent - 1;
	  }

	  while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
	    // Shift last digit. can only do this if < significant digits than # stored.
	    if (lastDigit === 0 && significantDigits < nDigitsStored) {
	      exponent = EXPONENT_MIN;
	      significantDigits = 0;
	      break;
	    }

	    if (nDigitsStored < nDigits) {
	      // adjust to match digits not stored
	      nDigits = nDigits - 1;
	    } else {
	      // adjust to round
	      lastDigit = lastDigit - 1;
	    }

	    if (exponent < EXPONENT_MAX) {
	      exponent = exponent + 1;
	    } else {
	      // Check if we have a zero then just hard clamp, otherwise fail
	      var _digitsString = digits.join('');

	      if (_digitsString.match(/^0+$/)) {
	        exponent = EXPONENT_MAX;
	        break;
	      }

	      invalidErr(string, 'overflow');
	    }
	  } // Round
	  // We've normalized the exponent, but might still need to round.


	  if (lastDigit - firstDigit + 1 < significantDigits) {
	    var endOfString = nDigitsRead; // If we have seen a radix point, 'string' is 1 longer than we have
	    // documented with ndigits_read, so inc the position of the first nonzero
	    // digit and the position that digits are read to.

	    if (sawRadix) {
	      firstNonZero = firstNonZero + 1;
	      endOfString = endOfString + 1;
	    } // if negative, we need to increment again to account for - sign at start.


	    if (isNegative) {
	      firstNonZero = firstNonZero + 1;
	      endOfString = endOfString + 1;
	    }

	    var roundDigit = parseInt(string[firstNonZero + lastDigit + 1], 10);
	    var roundBit = 0;

	    if (roundDigit >= 5) {
	      roundBit = 1;

	      if (roundDigit === 5) {
	        roundBit = digits[lastDigit] % 2 === 1;

	        for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
	          if (parseInt(string[i], 10)) {
	            roundBit = 1;
	            break;
	          }
	        }
	      }
	    }

	    if (roundBit) {
	      var dIdx = lastDigit;

	      for (; dIdx >= 0; dIdx--) {
	        if (++digits[dIdx] > 9) {
	          digits[dIdx] = 0; // overflowed most significant digit

	          if (dIdx === 0) {
	            if (exponent < EXPONENT_MAX) {
	              exponent = exponent + 1;
	              digits[dIdx] = 1;
	            } else {
	              return new Decimal128(Buffer$2.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	            }
	          }
	        }
	      }
	    }
	  } // Encode significand
	  // The high 17 digits of the significand


	  significandHigh = long_1.fromNumber(0); // The low 17 digits of the significand

	  significandLow = long_1.fromNumber(0); // read a zero

	  if (significantDigits === 0) {
	    significandHigh = long_1.fromNumber(0);
	    significandLow = long_1.fromNumber(0);
	  } else if (lastDigit - firstDigit < 17) {
	    var _dIdx = firstDigit;
	    significandLow = long_1.fromNumber(digits[_dIdx++]);
	    significandHigh = new long_1(0, 0);

	    for (; _dIdx <= lastDigit; _dIdx++) {
	      significandLow = significandLow.multiply(long_1.fromNumber(10));
	      significandLow = significandLow.add(long_1.fromNumber(digits[_dIdx]));
	    }
	  } else {
	    var _dIdx2 = firstDigit;
	    significandHigh = long_1.fromNumber(digits[_dIdx2++]);

	    for (; _dIdx2 <= lastDigit - 17; _dIdx2++) {
	      significandHigh = significandHigh.multiply(long_1.fromNumber(10));
	      significandHigh = significandHigh.add(long_1.fromNumber(digits[_dIdx2]));
	    }

	    significandLow = long_1.fromNumber(digits[_dIdx2++]);

	    for (; _dIdx2 <= lastDigit; _dIdx2++) {
	      significandLow = significandLow.multiply(long_1.fromNumber(10));
	      significandLow = significandLow.add(long_1.fromNumber(digits[_dIdx2]));
	    }
	  }

	  var significand = multiply64x2(significandHigh, long_1.fromString('100000000000000000'));
	  significand.low = significand.low.add(significandLow);

	  if (lessThan(significand.low, significandLow)) {
	    significand.high = significand.high.add(long_1.fromNumber(1));
	  } // Biased exponent


	  biasedExponent = exponent + EXPONENT_BIAS;
	  var dec = {
	    low: long_1.fromNumber(0),
	    high: long_1.fromNumber(0)
	  }; // Encode combination, exponent, and significand.

	  if (significand.high.shiftRightUnsigned(49).and(long_1.fromNumber(1)).equals(long_1.fromNumber(1))) {
	    // Encode '11' into bits 1 to 3
	    dec.high = dec.high.or(long_1.fromNumber(0x3).shiftLeft(61));
	    dec.high = dec.high.or(long_1.fromNumber(biasedExponent).and(long_1.fromNumber(0x3fff).shiftLeft(47)));
	    dec.high = dec.high.or(significand.high.and(long_1.fromNumber(0x7fffffffffff)));
	  } else {
	    dec.high = dec.high.or(long_1.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
	    dec.high = dec.high.or(significand.high.and(long_1.fromNumber(0x1ffffffffffff)));
	  }

	  dec.low = significand.low; // Encode sign

	  if (isNegative) {
	    dec.high = dec.high.or(long_1.fromString('9223372036854775808'));
	  } // Encode into a buffer


	  var buffer$$1 = Buffer$2.alloc(16);
	  index = 0; // Encode the low 64 bits of the decimal
	  // Encode low bits

	  buffer$$1[index++] = dec.low.low & 0xff;
	  buffer$$1[index++] = dec.low.low >> 8 & 0xff;
	  buffer$$1[index++] = dec.low.low >> 16 & 0xff;
	  buffer$$1[index++] = dec.low.low >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = dec.low.high & 0xff;
	  buffer$$1[index++] = dec.low.high >> 8 & 0xff;
	  buffer$$1[index++] = dec.low.high >> 16 & 0xff;
	  buffer$$1[index++] = dec.low.high >> 24 & 0xff; // Encode the high 64 bits of the decimal
	  // Encode low bits

	  buffer$$1[index++] = dec.high.low & 0xff;
	  buffer$$1[index++] = dec.high.low >> 8 & 0xff;
	  buffer$$1[index++] = dec.high.low >> 16 & 0xff;
	  buffer$$1[index++] = dec.high.low >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = dec.high.high & 0xff;
	  buffer$$1[index++] = dec.high.high >> 8 & 0xff;
	  buffer$$1[index++] = dec.high.high >> 16 & 0xff;
	  buffer$$1[index++] = dec.high.high >> 24 & 0xff; // Return the new Decimal128

	  return new Decimal128(buffer$$1);
	}; // Extract least significant 5 bits


	var COMBINATION_MASK = 0x1f; // Extract least significant 14 bits

	var EXPONENT_MASK = 0x3fff; // Value of combination field for Inf

	var COMBINATION_INFINITY = 30; // Value of combination field for NaN

	var COMBINATION_NAN = 31;
	/**
	 * Create a string representation of the raw Decimal128 value
	 *
	 * @method
	 * @return {string} returns a Decimal128 string representation.
	 */

	Decimal128.prototype.toString = function () {
	  // Note: bits in this routine are referred to starting at 0,
	  // from the sign bit, towards the coefficient.
	  // bits 0 - 31
	  var high; // bits 32 - 63

	  var midh; // bits 64 - 95

	  var midl; // bits 96 - 127

	  var low; // bits 1 - 5

	  var combination; // decoded biased exponent (14 bits)

	  var biased_exponent; // the number of significand digits

	  var significand_digits = 0; // the base-10 digits in the significand

	  var significand = new Array(36);

	  for (var i = 0; i < significand.length; i++) {
	    significand[i] = 0;
	  } // read pointer into significand


	  var index = 0; // unbiased exponent

	  var exponent; // the exponent if scientific notation is used

	  var scientific_exponent; // true if the number is zero

	  var is_zero = false; // the most signifcant significand bits (50-46)

	  var significand_msb; // temporary storage for significand decoding

	  var significand128 = {
	    parts: new Array(4)
	  }; // indexing variables

	  var j, k; // Output string

	  var string = []; // Unpack index

	  index = 0; // Buffer reference

	  var buffer$$1 = this.bytes; // Unpack the low 64bits into a long

	  low = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	  midl = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Unpack the high 64bits into a long

	  midh = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	  high = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Unpack index

	  index = 0; // Create the state of the decimal

	  var dec = {
	    low: new long_1(low, midl),
	    high: new long_1(midh, high)
	  };

	  if (dec.high.lessThan(long_1.ZERO)) {
	    string.push('-');
	  } // Decode combination field and exponent


	  combination = high >> 26 & COMBINATION_MASK;

	  if (combination >> 3 === 3) {
	    // Check for 'special' values
	    if (combination === COMBINATION_INFINITY) {
	      return string.join('') + 'Infinity';
	    } else if (combination === COMBINATION_NAN) {
	      return 'NaN';
	    } else {
	      biased_exponent = high >> 15 & EXPONENT_MASK;
	      significand_msb = 0x08 + (high >> 14 & 0x01);
	    }
	  } else {
	    significand_msb = high >> 14 & 0x07;
	    biased_exponent = high >> 17 & EXPONENT_MASK;
	  }

	  exponent = biased_exponent - EXPONENT_BIAS; // Create string of significand digits
	  // Convert the 114-bit binary number represented by
	  // (significand_high, significand_low) to at most 34 decimal
	  // digits through modulo and division.

	  significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
	  significand128.parts[1] = midh;
	  significand128.parts[2] = midl;
	  significand128.parts[3] = low;

	  if (significand128.parts[0] === 0 && significand128.parts[1] === 0 && significand128.parts[2] === 0 && significand128.parts[3] === 0) {
	    is_zero = true;
	  } else {
	    for (k = 3; k >= 0; k--) {
	      var least_digits = 0; // Peform the divide

	      var result = divideu128(significand128);
	      significand128 = result.quotient;
	      least_digits = result.rem.low; // We now have the 9 least significant digits (in base 2).
	      // Convert and output to string.

	      if (!least_digits) continue;

	      for (j = 8; j >= 0; j--) {
	        // significand[k * 9 + j] = Math.round(least_digits % 10);
	        significand[k * 9 + j] = least_digits % 10; // least_digits = Math.round(least_digits / 10);

	        least_digits = Math.floor(least_digits / 10);
	      }
	    }
	  } // Output format options:
	  // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
	  // Regular    - ddd.ddd


	  if (is_zero) {
	    significand_digits = 1;
	    significand[index] = 0;
	  } else {
	    significand_digits = 36;

	    while (!significand[index]) {
	      significand_digits = significand_digits - 1;
	      index = index + 1;
	    }
	  }

	  scientific_exponent = significand_digits - 1 + exponent; // The scientific exponent checks are dictated by the string conversion
	  // specification and are somewhat arbitrary cutoffs.
	  //
	  // We must check exponent > 0, because if this is the case, the number
	  // has trailing zeros.  However, we *cannot* output these trailing zeros,
	  // because doing so would change the precision of the value, and would
	  // change stored data if the string converted number is round tripped.

	  if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
	    // Scientific format
	    // if there are too many significant digits, we should just be treating numbers
	    // as + or - 0 and using the non-scientific exponent (this is for the "invalid
	    // representation should be treated as 0/-0" spec cases in decimal128-1.json)
	    if (significand_digits > 34) {
	      string.push(0);
	      if (exponent > 0) string.push('E+' + exponent);else if (exponent < 0) string.push('E' + exponent);
	      return string.join('');
	    }

	    string.push(significand[index++]);
	    significand_digits = significand_digits - 1;

	    if (significand_digits) {
	      string.push('.');
	    }

	    for (var _i = 0; _i < significand_digits; _i++) {
	      string.push(significand[index++]);
	    } // Exponent


	    string.push('E');

	    if (scientific_exponent > 0) {
	      string.push('+' + scientific_exponent);
	    } else {
	      string.push(scientific_exponent);
	    }
	  } else {
	    // Regular format with no decimal place
	    if (exponent >= 0) {
	      for (var _i2 = 0; _i2 < significand_digits; _i2++) {
	        string.push(significand[index++]);
	      }
	    } else {
	      var radix_position = significand_digits + exponent; // non-zero digits before radix

	      if (radix_position > 0) {
	        for (var _i3 = 0; _i3 < radix_position; _i3++) {
	          string.push(significand[index++]);
	        }
	      } else {
	        string.push('0');
	      }

	      string.push('.'); // add leading zeros after radix

	      while (radix_position++ < 0) {
	        string.push('0');
	      }

	      for (var _i4 = 0; _i4 < significand_digits - Math.max(radix_position - 1, 0); _i4++) {
	        string.push(significand[index++]);
	      }
	    }
	  }

	  return string.join('');
	};

	Decimal128.prototype.toJSON = function () {
	  return {
	    $numberDecimal: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	Decimal128.prototype.toExtendedJSON = function () {
	  return {
	    $numberDecimal: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	Decimal128.fromExtendedJSON = function (doc) {
	  return Decimal128.fromString(doc.$numberDecimal);
	};

	Object.defineProperty(Decimal128.prototype, '_bsontype', {
	  value: 'Decimal128'
	});
	var decimal128 = Decimal128;

	/**
	 * A class representation of the BSON MinKey type.
	 */

	function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }

	var MinKey =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a MinKey type
	   *
	   * @return {MinKey} A MinKey instance
	   */
	  function MinKey() {
	    _classCallCheck$7(this, MinKey);
	  }
	  /**
	   * @ignore
	   */


	  _createClass$7(MinKey, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $minKey: 1
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON() {
	      return new MinKey();
	    }
	  }]);

	  return MinKey;
	}();

	Object.defineProperty(MinKey.prototype, '_bsontype', {
	  value: 'MinKey'
	});
	var min_key = MinKey;

	/**
	 * A class representation of the BSON MaxKey type.
	 */

	function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }

	var MaxKey =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a MaxKey type
	   *
	   * @return {MaxKey} A MaxKey instance
	   */
	  function MaxKey() {
	    _classCallCheck$8(this, MaxKey);
	  }
	  /**
	   * @ignore
	   */


	  _createClass$8(MaxKey, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $maxKey: 1
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON() {
	      return new MaxKey();
	    }
	  }]);

	  return MaxKey;
	}();

	Object.defineProperty(MaxKey.prototype, '_bsontype', {
	  value: 'MaxKey'
	});
	var max_key = MaxKey;

	/**
	 * A class representation of the BSON DBRef type.
	 */

	function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); return Constructor; }

	var DBRef =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a DBRef type
	   *
	   * @param {string} collection the collection name.
	   * @param {ObjectId} oid the reference ObjectId.
	   * @param {string} [db] optional db name, if omitted the reference is local to the current db.
	   * @return {DBRef}
	   */
	  function DBRef(collection, oid, db, fields) {
	    _classCallCheck$9(this, DBRef);

	    // check if namespace has been provided
	    var parts = collection.split('.');

	    if (parts.length === 2) {
	      db = parts.shift();
	      collection = parts.shift();
	    }

	    this.collection = collection;
	    this.oid = oid;
	    this.db = db;
	    this.fields = fields || {};
	  }
	  /**
	   * @ignore
	   * @api private
	   */


	  _createClass$9(DBRef, [{
	    key: "toJSON",
	    value: function toJSON() {
	      var o = Object.assign({
	        $ref: this.collection,
	        $id: this.oid
	      }, this.fields);
	      if (this.db != null) o.$db = this.db;
	      return o;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      var o = {
	        $ref: this.collection,
	        $id: this.oid
	      };
	      if (this.db) o.$db = this.db;
	      o = Object.assign(o, this.fields);
	      return o;
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      var copy = Object.assign({}, doc);
	      ['$ref', '$id', '$db'].forEach(function (k) {
	        return delete copy[k];
	      });
	      return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
	    }
	  }]);

	  return DBRef;
	}();

	Object.defineProperty(DBRef.prototype, '_bsontype', {
	  value: 'DBRef'
	}); // the 1.x parser used a "namespace" property, while 4.x uses "collection". To ensure backwards
	// compatibility, let's expose "namespace"

	Object.defineProperty(DBRef.prototype, 'namespace', {
	  get: function get() {
	    return this.collection;
	  },
	  set: function set(val) {
	    this.collection = val;
	  },
	  configurable: false
	});
	var db_ref = DBRef;

	function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); return Constructor; }

	var Buffer$3 = buffer.Buffer;
	/**
	 * A class representation of the BSON Binary type.
	 */

	var Binary =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Binary type
	   *
	   * Sub types
	   *  - **BSON.BSON_BINARY_SUBTYPE_DEFAULT**, default BSON type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_FUNCTION**, BSON function type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY**, BSON byte array type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_UUID**, BSON uuid type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_MD5**, BSON md5 type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_USER_DEFINED**, BSON user defined type.
	   *
	   * @param {Buffer} buffer a buffer object containing the binary data.
	   * @param {Number} [subType] the option binary type.
	   * @return {Binary}
	   */
	  function Binary(buffer$$1, subType) {
	    _classCallCheck$a(this, Binary);

	    if (buffer$$1 != null && !(typeof buffer$$1 === 'string') && !Buffer$3.isBuffer(buffer$$1) && !(buffer$$1 instanceof Uint8Array) && !Array.isArray(buffer$$1)) {
	      throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
	    }

	    this.sub_type = subType == null ? BSON_BINARY_SUBTYPE_DEFAULT : subType;
	    this.position = 0;

	    if (buffer$$1 != null && !(buffer$$1 instanceof Number)) {
	      // Only accept Buffer, Uint8Array or Arrays
	      if (typeof buffer$$1 === 'string') {
	        // Different ways of writing the length of the string for the different types
	        if (typeof Buffer$3 !== 'undefined') {
	          this.buffer = Buffer$3.from(buffer$$1);
	        } else if (typeof Uint8Array !== 'undefined' || Array.isArray(buffer$$1)) {
	          this.buffer = writeStringToArray(buffer$$1);
	        } else {
	          throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
	        }
	      } else {
	        this.buffer = buffer$$1;
	      }

	      this.position = buffer$$1.length;
	    } else {
	      if (typeof Buffer$3 !== 'undefined') {
	        this.buffer = Buffer$3.alloc(Binary.BUFFER_SIZE);
	      } else if (typeof Uint8Array !== 'undefined') {
	        this.buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE));
	      } else {
	        this.buffer = new Array(Binary.BUFFER_SIZE);
	      }
	    }
	  }
	  /**
	   * Updates this binary with byte_value.
	   *
	   * @method
	   * @param {string} byte_value a single byte we wish to write.
	   */


	  _createClass$a(Binary, [{
	    key: "put",
	    value: function put(byte_value) {
	      // If it's a string and a has more than one character throw an error
	      if (byte_value['length'] != null && typeof byte_value !== 'number' && byte_value.length !== 1) throw new TypeError('only accepts single character String, Uint8Array or Array');
	      if (typeof byte_value !== 'number' && byte_value < 0 || byte_value > 255) throw new TypeError('only accepts number in a valid unsigned byte range 0-255'); // Decode the byte value once

	      var decoded_byte = null;

	      if (typeof byte_value === 'string') {
	        decoded_byte = byte_value.charCodeAt(0);
	      } else if (byte_value['length'] != null) {
	        decoded_byte = byte_value[0];
	      } else {
	        decoded_byte = byte_value;
	      }

	      if (this.buffer.length > this.position) {
	        this.buffer[this.position++] = decoded_byte;
	      } else {
	        if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	          // Create additional overflow buffer
	          var buffer$$1 = Buffer$3.alloc(Binary.BUFFER_SIZE + this.buffer.length); // Combine the two buffers together

	          this.buffer.copy(buffer$$1, 0, 0, this.buffer.length);
	          this.buffer = buffer$$1;
	          this.buffer[this.position++] = decoded_byte;
	        } else {
	          var _buffer = null; // Create a new buffer (typed or normal array)

	          if (isUint8Array(this.buffer)) {
	            _buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE + this.buffer.length));
	          } else {
	            _buffer = new Array(Binary.BUFFER_SIZE + this.buffer.length);
	          } // We need to copy all the content to the new array


	          for (var i = 0; i < this.buffer.length; i++) {
	            _buffer[i] = this.buffer[i];
	          } // Reassign the buffer


	          this.buffer = _buffer; // Write the byte

	          this.buffer[this.position++] = decoded_byte;
	        }
	      }
	    }
	    /**
	     * Writes a buffer or string to the binary.
	     *
	     * @method
	     * @param {(Buffer|string)} string a string or buffer to be written to the Binary BSON object.
	     * @param {number} offset specify the binary of where to write the content.
	     * @return {null}
	     */

	  }, {
	    key: "write",
	    value: function write(string, offset) {
	      offset = typeof offset === 'number' ? offset : this.position; // If the buffer is to small let's extend the buffer

	      if (this.buffer.length < offset + string.length) {
	        var buffer$$1 = null; // If we are in node.js

	        if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	          buffer$$1 = Buffer$3.alloc(this.buffer.length + string.length);
	          this.buffer.copy(buffer$$1, 0, 0, this.buffer.length);
	        } else if (isUint8Array(this.buffer)) {
	          // Create a new buffer
	          buffer$$1 = new Uint8Array(new ArrayBuffer(this.buffer.length + string.length)); // Copy the content

	          for (var i = 0; i < this.position; i++) {
	            buffer$$1[i] = this.buffer[i];
	          }
	        } // Assign the new buffer


	        this.buffer = buffer$$1;
	      }

	      if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(string) && Buffer$3.isBuffer(this.buffer)) {
	        string.copy(this.buffer, offset, 0, string.length);
	        this.position = offset + string.length > this.position ? offset + string.length : this.position; // offset = string.length
	      } else if (typeof Buffer$3 !== 'undefined' && typeof string === 'string' && Buffer$3.isBuffer(this.buffer)) {
	        this.buffer.write(string, offset, 'binary');
	        this.position = offset + string.length > this.position ? offset + string.length : this.position; // offset = string.length;
	      } else if (isUint8Array(string) || Array.isArray(string) && typeof string !== 'string') {
	        for (var _i = 0; _i < string.length; _i++) {
	          this.buffer[offset++] = string[_i];
	        }

	        this.position = offset > this.position ? offset : this.position;
	      } else if (typeof string === 'string') {
	        for (var _i2 = 0; _i2 < string.length; _i2++) {
	          this.buffer[offset++] = string.charCodeAt(_i2);
	        }

	        this.position = offset > this.position ? offset : this.position;
	      }
	    }
	    /**
	     * Reads **length** bytes starting at **position**.
	     *
	     * @method
	     * @param {number} position read from the given position in the Binary.
	     * @param {number} length the number of bytes to read.
	     * @return {Buffer}
	     */

	  }, {
	    key: "read",
	    value: function read(position, length) {
	      length = length && length > 0 ? length : this.position; // Let's return the data based on the type we have

	      if (this.buffer['slice']) {
	        return this.buffer.slice(position, position + length);
	      } // Create a buffer to keep the result


	      var buffer$$1 = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(length)) : new Array(length);

	      for (var i = 0; i < length; i++) {
	        buffer$$1[i] = this.buffer[position++];
	      } // Return the buffer


	      return buffer$$1;
	    }
	    /**
	     * Returns the value of this binary as a string.
	     *
	     * @method
	     * @return {string}
	     */

	  }, {
	    key: "value",
	    value: function value(asRaw) {
	      asRaw = asRaw == null ? false : asRaw; // Optimize to serialize for the situation where the data == size of buffer

	      if (asRaw && typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer) && this.buffer.length === this.position) return this.buffer; // If it's a node.js buffer object

	      if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	        return asRaw ? this.buffer.slice(0, this.position) : this.buffer.toString('binary', 0, this.position);
	      } else {
	        if (asRaw) {
	          // we support the slice command use it
	          if (this.buffer['slice'] != null) {
	            return this.buffer.slice(0, this.position);
	          } else {
	            // Create a new buffer to copy content to
	            var newBuffer = isUint8Array(this.buffer) ? new Uint8Array(new ArrayBuffer(this.position)) : new Array(this.position); // Copy content

	            for (var i = 0; i < this.position; i++) {
	              newBuffer[i] = this.buffer[i];
	            } // Return the buffer


	            return newBuffer;
	          }
	        } else {
	          return convertArraytoUtf8BinaryString(this.buffer, 0, this.position);
	        }
	      }
	    }
	    /**
	     * Length.
	     *
	     * @method
	     * @return {number} the length of the binary.
	     */

	  }, {
	    key: "length",
	    value: function length() {
	      return this.position;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.buffer != null ? this.buffer.toString('base64') : '';
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toString",
	    value: function toString(format) {
	      return this.buffer != null ? this.buffer.slice(0, this.position).toString(format) : '';
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      var base64String = Buffer$3.isBuffer(this.buffer) ? this.buffer.toString('base64') : Buffer$3.from(this.buffer).toString('base64');
	      var subType = Number(this.sub_type).toString(16);
	      return {
	        $binary: {
	          base64: base64String,
	          subType: subType.length === 1 ? '0' + subType : subType
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      var type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
	      var data = Buffer$3.from(doc.$binary.base64, 'base64');
	      return new Binary(data, type);
	    }
	  }]);

	  return Binary;
	}();
	/**
	 * Binary default subtype
	 * @ignore
	 */


	var BSON_BINARY_SUBTYPE_DEFAULT = 0;

	function isUint8Array(obj) {
	  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
	}
	/**
	 * @ignore
	 */


	function writeStringToArray(data) {
	  // Create a buffer
	  var buffer$$1 = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(data.length)) : new Array(data.length); // Write the content to the buffer

	  for (var i = 0; i < data.length; i++) {
	    buffer$$1[i] = data.charCodeAt(i);
	  } // Write the string to the buffer


	  return buffer$$1;
	}
	/**
	 * Convert Array ot Uint8Array to Binary String
	 *
	 * @ignore
	 */


	function convertArraytoUtf8BinaryString(byteArray, startIndex, endIndex) {
	  var result = '';

	  for (var i = startIndex; i < endIndex; i++) {
	    result = result + String.fromCharCode(byteArray[i]);
	  }

	  return result;
	}

	Binary.BUFFER_SIZE = 256;
	/**
	 * Default BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_DEFAULT = 0;
	/**
	 * Function BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_FUNCTION = 1;
	/**
	 * Byte Array BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_BYTE_ARRAY = 2;
	/**
	 * OLD UUID BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_UUID_OLD = 3;
	/**
	 * UUID BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_UUID = 4;
	/**
	 * MD5 BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_MD5 = 5;
	/**
	 * User BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_USER_DEFINED = 128;
	Object.defineProperty(Binary.prototype, '_bsontype', {
	  value: 'Binary'
	});
	var binary = Binary;

	var constants = {
	  // BSON MAX VALUES
	  BSON_INT32_MAX: 0x7fffffff,
	  BSON_INT32_MIN: -0x80000000,
	  BSON_INT64_MAX: Math.pow(2, 63) - 1,
	  BSON_INT64_MIN: -Math.pow(2, 63),
	  // JS MAX PRECISE VALUES
	  JS_INT_MAX: 0x20000000000000,
	  // Any integer up to 2^53 can be precisely represented by a double.
	  JS_INT_MIN: -0x20000000000000,
	  // Any integer down to -2^53 can be precisely represented by a double.

	  /**
	   * Number BSON Type
	   *
	   * @classconstant BSON_DATA_NUMBER
	   **/
	  BSON_DATA_NUMBER: 1,

	  /**
	   * String BSON Type
	   *
	   * @classconstant BSON_DATA_STRING
	   **/
	  BSON_DATA_STRING: 2,

	  /**
	   * Object BSON Type
	   *
	   * @classconstant BSON_DATA_OBJECT
	   **/
	  BSON_DATA_OBJECT: 3,

	  /**
	   * Array BSON Type
	   *
	   * @classconstant BSON_DATA_ARRAY
	   **/
	  BSON_DATA_ARRAY: 4,

	  /**
	   * Binary BSON Type
	   *
	   * @classconstant BSON_DATA_BINARY
	   **/
	  BSON_DATA_BINARY: 5,

	  /**
	   * Binary BSON Type
	   *
	   * @classconstant BSON_DATA_UNDEFINED
	   **/
	  BSON_DATA_UNDEFINED: 6,

	  /**
	   * ObjectId BSON Type
	   *
	   * @classconstant BSON_DATA_OID
	   **/
	  BSON_DATA_OID: 7,

	  /**
	   * Boolean BSON Type
	   *
	   * @classconstant BSON_DATA_BOOLEAN
	   **/
	  BSON_DATA_BOOLEAN: 8,

	  /**
	   * Date BSON Type
	   *
	   * @classconstant BSON_DATA_DATE
	   **/
	  BSON_DATA_DATE: 9,

	  /**
	   * null BSON Type
	   *
	   * @classconstant BSON_DATA_NULL
	   **/
	  BSON_DATA_NULL: 10,

	  /**
	   * RegExp BSON Type
	   *
	   * @classconstant BSON_DATA_REGEXP
	   **/
	  BSON_DATA_REGEXP: 11,

	  /**
	   * Code BSON Type
	   *
	   * @classconstant BSON_DATA_DBPOINTER
	   **/
	  BSON_DATA_DBPOINTER: 12,

	  /**
	   * Code BSON Type
	   *
	   * @classconstant BSON_DATA_CODE
	   **/
	  BSON_DATA_CODE: 13,

	  /**
	   * Symbol BSON Type
	   *
	   * @classconstant BSON_DATA_SYMBOL
	   **/
	  BSON_DATA_SYMBOL: 14,

	  /**
	   * Code with Scope BSON Type
	   *
	   * @classconstant BSON_DATA_CODE_W_SCOPE
	   **/
	  BSON_DATA_CODE_W_SCOPE: 15,

	  /**
	   * 32 bit Integer BSON Type
	   *
	   * @classconstant BSON_DATA_INT
	   **/
	  BSON_DATA_INT: 16,

	  /**
	   * Timestamp BSON Type
	   *
	   * @classconstant BSON_DATA_TIMESTAMP
	   **/
	  BSON_DATA_TIMESTAMP: 17,

	  /**
	   * Long BSON Type
	   *
	   * @classconstant BSON_DATA_LONG
	   **/
	  BSON_DATA_LONG: 18,

	  /**
	   * Long BSON Type
	   *
	   * @classconstant BSON_DATA_DECIMAL128
	   **/
	  BSON_DATA_DECIMAL128: 19,

	  /**
	   * MinKey BSON Type
	   *
	   * @classconstant BSON_DATA_MIN_KEY
	   **/
	  BSON_DATA_MIN_KEY: 0xff,

	  /**
	   * MaxKey BSON Type
	   *
	   * @classconstant BSON_DATA_MAX_KEY
	   **/
	  BSON_DATA_MAX_KEY: 0x7f,

	  /**
	   * Binary Default Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
	   **/
	  BSON_BINARY_SUBTYPE_DEFAULT: 0,

	  /**
	   * Binary Function Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
	   **/
	  BSON_BINARY_SUBTYPE_FUNCTION: 1,

	  /**
	   * Binary Byte Array Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
	   **/
	  BSON_BINARY_SUBTYPE_BYTE_ARRAY: 2,

	  /**
	   * Binary UUID Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_UUID
	   **/
	  BSON_BINARY_SUBTYPE_UUID: 3,

	  /**
	   * Binary MD5 Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_MD5
	   **/
	  BSON_BINARY_SUBTYPE_MD5: 4,

	  /**
	   * Binary User Defined Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
	   **/
	  BSON_BINARY_SUBTYPE_USER_DEFINED: 128
	};

	function _typeof$2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
	// const Map = require('./map');

	/**
	 * @namespace EJSON
	 */
	// all the types where we don't need to do any special processing and can just pass the EJSON
	//straight to type.fromExtendedJSON


	var keysToCodecs = {
	  $oid: objectid,
	  $binary: binary,
	  $symbol: symbol,
	  $numberInt: int_32,
	  $numberDecimal: decimal128,
	  $numberDouble: double_1,
	  $numberLong: long_1,
	  $minKey: min_key,
	  $maxKey: max_key,
	  $regularExpression: regexp,
	  $timestamp: timestamp
	};

	function deserializeValue(self, key, value, options) {
	  if (typeof value === 'number') {
	    if (options.relaxed) {
	      return value;
	    } // if it's an integer, should interpret as smallest BSON integer
	    // that can represent it exactly. (if out of range, interpret as double.)


	    if (Math.floor(value) === value) {
	      if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) return new int_32(value);
	      if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) return new long_1.fromNumber(value);
	    } // If the number is a non-integer or out of integer range, should interpret as BSON Double.


	    return new double_1(value);
	  } // from here on out we're looking for bson types, so bail if its not an object


	  if (value == null || _typeof$2(value) !== 'object') return value; // upgrade deprecated undefined to null

	  if (value.$undefined) return null;
	  var keys = Object.keys(value).filter(function (k) {
	    return k.startsWith('$') && value[k] != null;
	  });

	  for (var i = 0; i < keys.length; i++) {
	    var c = keysToCodecs[keys[i]];
	    if (c) return c.fromExtendedJSON(value, options);
	  }

	  if (value.$date != null) {
	    var d = value.$date;
	    var date = new Date();
	    if (typeof d === 'string') date.setTime(Date.parse(d));else if (long_1.isLong(d)) date.setTime(d.toNumber());else if (typeof d === 'number' && options.relaxed) date.setTime(d);
	    return date;
	  }

	  if (value.$code != null) {
	    var copy = Object.assign({}, value);

	    if (value.$scope) {
	      copy.$scope = deserializeValue(self, null, value.$scope);
	    }

	    return code.fromExtendedJSON(value);
	  }

	  if (value.$ref != null || value.$dbPointer != null) {
	    var v = value.$ref ? value : value.$dbPointer; // we run into this in a "degenerate EJSON" case (with $id and $ref order flipped)
	    // because of the order JSON.parse goes through the document

	    if (v instanceof db_ref) return v;
	    var dollarKeys = Object.keys(v).filter(function (k) {
	      return k.startsWith('$');
	    });
	    var valid = true;
	    dollarKeys.forEach(function (k) {
	      if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
	    }); // only make DBRef if $ keys are all valid

	    if (valid) return db_ref.fromExtendedJSON(v);
	  }

	  return value;
	}
	/**
	 * Parse an Extended JSON string, constructing the JavaScript value or object described by that
	 * string.
	 *
	 * @memberof EJSON
	 * @param {string} text
	 * @param {object} [options] Optional settings
	 * @param {boolean} [options.relaxed=true] Attempt to return native JS types where possible, rather than BSON types (if true)
	 * @return {object}
	 *
	 * @example
	 * const { EJSON } = require('bson');
	 * const text = '{ "int32": { "$numberInt": "10" } }';
	 *
	 * // prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
	 * console.log(EJSON.parse(text, { relaxed: false }));
	 *
	 * // prints { int32: 10 }
	 * console.log(EJSON.parse(text));
	 */


	function parse(text, options) {
	  var _this = this;

	  options = Object.assign({}, {
	    relaxed: true
	  }, options); // relaxed implies not strict

	  if (typeof options.relaxed === 'boolean') options.strict = !options.relaxed;
	  if (typeof options.strict === 'boolean') options.relaxed = !options.strict;
	  return JSON.parse(text, function (key, value) {
	    return deserializeValue(_this, key, value, options);
	  });
	} //
	// Serializer
	//
	// MAX INT32 boundaries


	var BSON_INT32_MAX = 0x7fffffff,
	    BSON_INT32_MIN = -0x80000000,
	    BSON_INT64_MAX = 0x7fffffffffffffff,
	    BSON_INT64_MIN = -0x8000000000000000;
	/**
	 * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
	 * function is specified or optionally including only the specified properties if a replacer array
	 * is specified.
	 *
	 * @memberof EJSON
	 * @param {object} value The value to convert to extended JSON
	 * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
	 * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
	 * @param {object} [options] Optional settings
	 * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
	 * @returns {string}
	 *
	 * @example
	 * const { EJSON } = require('bson');
	 * const Int32 = require('mongodb').Int32;
	 * const doc = { int32: new Int32(10) };
	 *
	 * // prints '{"int32":{"$numberInt":"10"}}'
	 * console.log(EJSON.stringify(doc, { relaxed: false }));
	 *
	 * // prints '{"int32":10}'
	 * console.log(EJSON.stringify(doc));
	 */

	function stringify(value, replacer, space, options) {
	  if (space != null && _typeof$2(space) === 'object') {
	    options = space;
	    space = 0;
	  }

	  if (replacer != null && _typeof$2(replacer) === 'object' && !Array.isArray(replacer)) {
	    options = replacer;
	    replacer = null;
	    space = 0;
	  }

	  options = Object.assign({}, {
	    relaxed: true
	  }, options);
	  var doc = Array.isArray(value) ? serializeArray(value, options) : serializeDocument(value, options);
	  return JSON.stringify(doc, replacer, space);
	}
	/**
	 * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
	 *
	 * @memberof EJSON
	 * @param {object} bson The object to serialize
	 * @param {object} [options] Optional settings passed to the `stringify` function
	 * @return {object}
	 */


	function serialize(bson, options) {
	  options = options || {};
	  return JSON.parse(stringify(bson, options));
	}
	/**
	 * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
	 *
	 * @memberof EJSON
	 * @param {object} ejson The Extended JSON object to deserialize
	 * @param {object} [options] Optional settings passed to the parse method
	 * @return {object}
	 */


	function deserialize(ejson, options) {
	  options = options || {};
	  return parse(JSON.stringify(ejson), options);
	}

	function serializeArray(array, options) {
	  return array.map(function (v) {
	    return serializeValue(v, options);
	  });
	}

	function getISOString(date) {
	  var isoStr = date.toISOString(); // we should only show milliseconds in timestamp if they're non-zero

	  return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
	}

	function serializeValue(value, options) {
	  if (Array.isArray(value)) return serializeArray(value, options);
	  if (value === undefined) return null;

	  if (value instanceof Date) {
	    var dateNum = value.getTime(),
	        // is it in year range 1970-9999?
	    inRange = dateNum > -1 && dateNum < 253402318800000;
	    return options.relaxed && inRange ? {
	      $date: getISOString(value)
	    } : {
	      $date: {
	        $numberLong: value.getTime().toString()
	      }
	    };
	  }

	  if (typeof value === 'number' && !options.relaxed) {
	    // it's an integer
	    if (Math.floor(value) === value) {
	      var int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX,
	          int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX; // interpret as being of the smallest BSON integer type that can represent the number exactly

	      if (int32Range) return {
	        $numberInt: value.toString()
	      };
	      if (int64Range) return {
	        $numberLong: value.toString()
	      };
	    }

	    return {
	      $numberDouble: value.toString()
	    };
	  }

	  if (value instanceof RegExp) {
	    var flags = value.flags;

	    if (flags === undefined) {
	      flags = value.toString().match(/[gimuy]*$/)[0];
	    }

	    var rx = new regexp(value.source, flags);
	    return rx.toExtendedJSON();
	  }

	  if (value != null && _typeof$2(value) === 'object') return serializeDocument(value, options);
	  return value;
	}

	var BSON_TYPE_MAPPINGS = {
	  Binary: function Binary(o) {
	    return new binary(o.value(), o.subtype);
	  },
	  Code: function Code(o) {
	    return new code(o.code, o.scope);
	  },
	  DBRef: function DBRef(o) {
	    return new db_ref(o.collection || o.namespace, o.oid, o.db, o.fields);
	  },
	  // "namespace" for 1.x library backwards compat
	  Decimal128: function Decimal128(o) {
	    return new decimal128(o.bytes);
	  },
	  Double: function Double(o) {
	    return new double_1(o.value);
	  },
	  Int32: function Int32(o) {
	    return new int_32(o.value);
	  },
	  Long: function Long(o) {
	    return long_1.fromBits( // underscore variants for 1.x backwards compatibility
	    o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_);
	  },
	  MaxKey: function MaxKey() {
	    return new max_key();
	  },
	  MinKey: function MinKey() {
	    return new min_key();
	  },
	  ObjectID: function ObjectID(o) {
	    return new objectid(o);
	  },
	  ObjectId: function ObjectId(o) {
	    return new objectid(o);
	  },
	  // support 4.0.0/4.0.1 before _bsontype was reverted back to ObjectID
	  BSONRegExp: function BSONRegExp(o) {
	    return new regexp(o.pattern, o.options);
	  },
	  Symbol: function Symbol(o) {
	    return new symbol(o.value);
	  },
	  Timestamp: function Timestamp(o) {
	    return timestamp.fromBits(o.low, o.high);
	  }
	};

	function serializeDocument(doc, options) {
	  if (doc == null || _typeof$2(doc) !== 'object') throw new Error('not an object instance');
	  var bsontype = doc._bsontype;

	  if (typeof bsontype === 'undefined') {
	    // It's a regular object. Recursively serialize its property values.
	    var _doc = {};

	    for (var name in doc) {
	      _doc[name] = serializeValue(doc[name], options);
	    }

	    return _doc;
	  } else if (typeof bsontype === 'string') {
	    // the "document" is really just a BSON type object
	    var _doc2 = doc;

	    if (typeof _doc2.toExtendedJSON !== 'function') {
	      // There's no EJSON serialization function on the object. It's probably an
	      // object created by a previous version of this library (or another library)
	      // that's duck-typing objects to look like they were generated by this library).
	      // Copy the object into this library's version of that type.
	      var mapper = BSON_TYPE_MAPPINGS[bsontype];

	      if (!mapper) {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + bsontype);
	      }

	      _doc2 = mapper(_doc2);
	    } // Two BSON types may have nested objects that may need to be serialized too


	    if (bsontype === 'Code' && _doc2.scope) {
	      _doc2 = new code(_doc2.code, serializeValue(_doc2.scope, options));
	    } else if (bsontype === 'DBRef' && _doc2.oid) {
	      _doc2 = new db_ref(_doc2.collection, serializeValue(_doc2.oid, options), _doc2.db, _doc2.fields);
	    }

	    return _doc2.toExtendedJSON(options);
	  } else {
	    throw new Error('_bsontype must be a string, but was: ' + _typeof$2(bsontype));
	  }
	}

	var extended_json = {
	  parse: parse,
	  deserialize: deserialize,
	  serialize: serialize,
	  stringify: stringify
	};

	var FIRST_BIT = 0x80;
	var FIRST_TWO_BITS = 0xc0;
	var FIRST_THREE_BITS = 0xe0;
	var FIRST_FOUR_BITS = 0xf0;
	var FIRST_FIVE_BITS = 0xf8;
	var TWO_BIT_CHAR = 0xc0;
	var THREE_BIT_CHAR = 0xe0;
	var FOUR_BIT_CHAR = 0xf0;
	var CONTINUING_CHAR = 0x80;
	/**
	 * Determines if the passed in bytes are valid utf8
	 * @param {Buffer|Uint8Array} bytes An array of 8-bit bytes. Must be indexable and have length property
	 * @param {Number} start The index to start validating
	 * @param {Number} end The index to end validating
	 * @returns {boolean} True if valid utf8
	 */

	function validateUtf8(bytes, start, end) {
	  var continuation = 0;

	  for (var i = start; i < end; i += 1) {
	    var byte = bytes[i];

	    if (continuation) {
	      if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
	        return false;
	      }

	      continuation -= 1;
	    } else if (byte & FIRST_BIT) {
	      if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
	        continuation = 1;
	      } else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
	        continuation = 2;
	      } else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
	        continuation = 3;
	      } else {
	        return false;
	      }
	    }
	  }

	  return !continuation;
	}

	var validateUtf8_1 = validateUtf8;
	var validate_utf8 = {
	  validateUtf8: validateUtf8_1
	};

	var Buffer$4 = buffer.Buffer;
	var validateUtf8$1 = validate_utf8.validateUtf8; // Internal long versions

	var JS_INT_MAX_LONG = long_1.fromNumber(constants.JS_INT_MAX);
	var JS_INT_MIN_LONG = long_1.fromNumber(constants.JS_INT_MIN);
	var functionCache = {};

	function deserialize$1(buffer$$1, options, isArray) {
	  options = options == null ? {} : options;
	  var index = options && options.index ? options.index : 0; // Read the document size

	  var size = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;

	  if (size < 5) {
	    throw new Error("bson size must be >= 5, is ".concat(size));
	  }

	  if (options.allowObjectSmallerThanBufferSize && buffer$$1.length < size) {
	    throw new Error("buffer length ".concat(buffer$$1.length, " must be >= bson size ").concat(size));
	  }

	  if (!options.allowObjectSmallerThanBufferSize && buffer$$1.length !== size) {
	    throw new Error("buffer length ".concat(buffer$$1.length, " must === bson size ").concat(size));
	  }

	  if (size + index > buffer$$1.length) {
	    throw new Error("(bson size ".concat(size, " + options.index ").concat(index, " must be <= buffer length ").concat(Buffer$4.byteLength(buffer$$1), ")"));
	  } // Illegal end value


	  if (buffer$$1[index + size - 1] !== 0) {
	    throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
	  } // Start deserializtion


	  return deserializeObject(buffer$$1, index, options, isArray);
	}

	function deserializeObject(buffer$$1, index, options, isArray) {
	  var evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
	  var cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
	  var cacheFunctionsCrc32 = options['cacheFunctionsCrc32'] == null ? false : options['cacheFunctionsCrc32'];
	  if (!cacheFunctionsCrc32) var crc32 = null;
	  var fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw']; // Return raw bson buffer instead of parsing it

	  var raw = options['raw'] == null ? false : options['raw']; // Return BSONRegExp objects instead of native regular expressions

	  var bsonRegExp = typeof options['bsonRegExp'] === 'boolean' ? options['bsonRegExp'] : false; // Controls the promotion of values vs wrapper classes

	  var promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];
	  var promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
	  var promoteValues = options['promoteValues'] == null ? true : options['promoteValues']; // Set the start index

	  var startIndex = index; // Validate that we have at least 4 bytes of buffer

	  if (buffer$$1.length < 5) throw new Error('corrupt bson message < 5 bytes long'); // Read the document size

	  var size = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Ensure buffer is valid size

	  if (size < 5 || size > buffer$$1.length) throw new Error('corrupt bson message'); // Create holding object

	  var object = isArray ? [] : {}; // Used for arrays to skip having to perform utf8 decoding

	  var arrayIndex = 0;
	  var done = false; // While we have more left data left keep parsing

	  while (!done) {
	    // Read the type
	    var elementType = buffer$$1[index++]; // If we get a zero it's the last byte, exit

	    if (elementType === 0) break; // Get the start search index

	    var i = index; // Locate the end of the c string

	    while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	      i++;
	    } // If are at the end of the buffer there is a problem with the document


	    if (i >= Buffer$4.byteLength(buffer$$1)) throw new Error('Bad BSON Document: illegal CString');
	    var name = isArray ? arrayIndex++ : buffer$$1.toString('utf8', index, i);
	    index = i + 1;

	    if (elementType === constants.BSON_DATA_STRING) {
	      var stringSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      if (stringSize <= 0 || stringSize > buffer$$1.length - index || buffer$$1[index + stringSize - 1] !== 0) throw new Error('bad string length in bson');

	      if (!validateUtf8$1(buffer$$1, index, index + stringSize - 1)) {
	        throw new Error('Invalid UTF-8 string in BSON document');
	      }

	      var s = buffer$$1.toString('utf8', index, index + stringSize - 1);
	      object[name] = s;
	      index = index + stringSize;
	    } else if (elementType === constants.BSON_DATA_OID) {
	      var oid = Buffer$4.alloc(12);
	      buffer$$1.copy(oid, 0, index, index + 12);
	      object[name] = new objectid(oid);
	      index = index + 12;
	    } else if (elementType === constants.BSON_DATA_INT && promoteValues === false) {
	      object[name] = new int_32(buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24);
	    } else if (elementType === constants.BSON_DATA_INT) {
	      object[name] = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	    } else if (elementType === constants.BSON_DATA_NUMBER && promoteValues === false) {
	      object[name] = new double_1(buffer$$1.readDoubleLE(index));
	      index = index + 8;
	    } else if (elementType === constants.BSON_DATA_NUMBER) {
	      object[name] = buffer$$1.readDoubleLE(index);
	      index = index + 8;
	    } else if (elementType === constants.BSON_DATA_DATE) {
	      var lowBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      var highBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      object[name] = new Date(new long_1(lowBits, highBits).toNumber());
	    } else if (elementType === constants.BSON_DATA_BOOLEAN) {
	      if (buffer$$1[index] !== 0 && buffer$$1[index] !== 1) throw new Error('illegal boolean type value');
	      object[name] = buffer$$1[index++] === 1;
	    } else if (elementType === constants.BSON_DATA_OBJECT) {
	      var _index = index;
	      var objectSize = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;
	      if (objectSize <= 0 || objectSize > buffer$$1.length - index) throw new Error('bad embedded document length in bson'); // We have a raw value

	      if (raw) {
	        object[name] = buffer$$1.slice(index, index + objectSize);
	      } else {
	        object[name] = deserializeObject(buffer$$1, _index, options, false);
	      }

	      index = index + objectSize;
	    } else if (elementType === constants.BSON_DATA_ARRAY) {
	      var _index2 = index;

	      var _objectSize = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;

	      var arrayOptions = options; // Stop index

	      var stopIndex = index + _objectSize; // All elements of array to be returned as raw bson

	      if (fieldsAsRaw && fieldsAsRaw[name]) {
	        arrayOptions = {};

	        for (var n in options) {
	          arrayOptions[n] = options[n];
	        }

	        arrayOptions['raw'] = true;
	      }

	      object[name] = deserializeObject(buffer$$1, _index2, arrayOptions, true);
	      index = index + _objectSize;
	      if (buffer$$1[index - 1] !== 0) throw new Error('invalid array terminator byte');
	      if (index !== stopIndex) throw new Error('corrupted array bson');
	    } else if (elementType === constants.BSON_DATA_UNDEFINED) {
	      object[name] = undefined;
	    } else if (elementType === constants.BSON_DATA_NULL) {
	      object[name] = null;
	    } else if (elementType === constants.BSON_DATA_LONG) {
	      // Unpack the low and high bits
	      var _lowBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var _highBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var long$$1 = new long_1(_lowBits, _highBits); // Promote the long if possible

	      if (promoteLongs && promoteValues === true) {
	        object[name] = long$$1.lessThanOrEqual(JS_INT_MAX_LONG) && long$$1.greaterThanOrEqual(JS_INT_MIN_LONG) ? long$$1.toNumber() : long$$1;
	      } else {
	        object[name] = long$$1;
	      }
	    } else if (elementType === constants.BSON_DATA_DECIMAL128) {
	      // Buffer to contain the decimal bytes
	      var bytes = Buffer$4.alloc(16); // Copy the next 16 bytes into the bytes buffer

	      buffer$$1.copy(bytes, 0, index, index + 16); // Update index

	      index = index + 16; // Assign the new Decimal128 value

	      var decimal128$$1 = new decimal128(bytes); // If we have an alternative mapper use that

	      object[name] = decimal128$$1.toObject ? decimal128$$1.toObject() : decimal128$$1;
	    } else if (elementType === constants.BSON_DATA_BINARY) {
	      var binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      var totalBinarySize = binarySize;
	      var subType = buffer$$1[index++]; // Did we have a negative binary size, throw

	      if (binarySize < 0) throw new Error('Negative binary type element size found'); // Is the length longer than the document

	      if (binarySize > Buffer$4.byteLength(buffer$$1)) throw new Error('Binary type size larger than document size'); // Decode as raw Buffer object if options specifies it

	      if (buffer$$1['slice'] != null) {
	        // If we have subtype 2 skip the 4 bytes for the size
	        if (subType === binary.SUBTYPE_BYTE_ARRAY) {
	          binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	          if (binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
	          if (binarySize > totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to long binary size');
	          if (binarySize < totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to short binary size');
	        }

	        if (promoteBuffers && promoteValues) {
	          object[name] = buffer$$1.slice(index, index + binarySize);
	        } else {
	          object[name] = new binary(buffer$$1.slice(index, index + binarySize), subType);
	        }
	      } else {
	        var _buffer = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(binarySize)) : new Array(binarySize); // If we have subtype 2 skip the 4 bytes for the size


	        if (subType === binary.SUBTYPE_BYTE_ARRAY) {
	          binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	          if (binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
	          if (binarySize > totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to long binary size');
	          if (binarySize < totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to short binary size');
	        } // Copy the data


	        for (i = 0; i < binarySize; i++) {
	          _buffer[i] = buffer$$1[index + i];
	        }

	        if (promoteBuffers && promoteValues) {
	          object[name] = _buffer;
	        } else {
	          object[name] = new binary(_buffer, subType);
	        }
	      } // Update the index


	      index = index + binarySize;
	    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === false) {
	      // Get the start search index
	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var source = buffer$$1.toString('utf8', index, i); // Create the regexp

	      index = i + 1; // Get the start search index

	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var regExpOptions = buffer$$1.toString('utf8', index, i);
	      index = i + 1; // For each option add the corresponding one for javascript

	      var optionsArray = new Array(regExpOptions.length); // Parse options

	      for (i = 0; i < regExpOptions.length; i++) {
	        switch (regExpOptions[i]) {
	          case 'm':
	            optionsArray[i] = 'm';
	            break;

	          case 's':
	            optionsArray[i] = 'g';
	            break;

	          case 'i':
	            optionsArray[i] = 'i';
	            break;
	        }
	      }

	      object[name] = new RegExp(source, optionsArray.join(''));
	    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === true) {
	      // Get the start search index
	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var _source = buffer$$1.toString('utf8', index, i);

	      index = i + 1; // Get the start search index

	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var _regExpOptions = buffer$$1.toString('utf8', index, i);

	      index = i + 1; // Set the object

	      object[name] = new regexp(_source, _regExpOptions);
	    } else if (elementType === constants.BSON_DATA_SYMBOL) {
	      var _stringSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      if (_stringSize <= 0 || _stringSize > buffer$$1.length - index || buffer$$1[index + _stringSize - 1] !== 0) throw new Error('bad string length in bson'); // symbol is deprecated - upgrade to string.

	      object[name] = buffer$$1.toString('utf8', index, index + _stringSize - 1);
	      index = index + _stringSize;
	    } else if (elementType === constants.BSON_DATA_TIMESTAMP) {
	      var _lowBits2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var _highBits2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      object[name] = new timestamp(_lowBits2, _highBits2);
	    } else if (elementType === constants.BSON_DATA_MIN_KEY) {
	      object[name] = new min_key();
	    } else if (elementType === constants.BSON_DATA_MAX_KEY) {
	      object[name] = new max_key();
	    } else if (elementType === constants.BSON_DATA_CODE) {
	      var _stringSize2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      if (_stringSize2 <= 0 || _stringSize2 > buffer$$1.length - index || buffer$$1[index + _stringSize2 - 1] !== 0) throw new Error('bad string length in bson');
	      var functionString = buffer$$1.toString('utf8', index, index + _stringSize2 - 1); // If we are evaluating the functions

	      if (evalFunctions) {
	        // If we have cache enabled let's look for the md5 of the function in the cache
	        if (cacheFunctions) {
	          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString; // Got to do this to avoid V8 deoptimizing the call due to finding eval

	          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
	        } else {
	          object[name] = isolateEval(functionString);
	        }
	      } else {
	        object[name] = new code(functionString);
	      } // Update parse index position


	      index = index + _stringSize2;
	    } else if (elementType === constants.BSON_DATA_CODE_W_SCOPE) {
	      var totalSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Element cannot be shorter than totalSize + stringSize + documentSize + terminator

	      if (totalSize < 4 + 4 + 4 + 1) {
	        throw new Error('code_w_scope total size shorter minimum expected length');
	      } // Get the code string size


	      var _stringSize3 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Check if we have a valid string


	      if (_stringSize3 <= 0 || _stringSize3 > buffer$$1.length - index || buffer$$1[index + _stringSize3 - 1] !== 0) throw new Error('bad string length in bson'); // Javascript function

	      var _functionString = buffer$$1.toString('utf8', index, index + _stringSize3 - 1); // Update parse index position


	      index = index + _stringSize3; // Parse the element

	      var _index3 = index; // Decode the size of the object document

	      var _objectSize2 = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24; // Decode the scope object


	      var scopeObject = deserializeObject(buffer$$1, _index3, options, false); // Adjust the index

	      index = index + _objectSize2; // Check if field length is to short

	      if (totalSize < 4 + 4 + _objectSize2 + _stringSize3) {
	        throw new Error('code_w_scope total size is to short, truncating scope');
	      } // Check if totalSize field is to long


	      if (totalSize > 4 + 4 + _objectSize2 + _stringSize3) {
	        throw new Error('code_w_scope total size is to long, clips outer document');
	      } // If we are evaluating the functions


	      if (evalFunctions) {
	        // If we have cache enabled let's look for the md5 of the function in the cache
	        if (cacheFunctions) {
	          var _hash = cacheFunctionsCrc32 ? crc32(_functionString) : _functionString; // Got to do this to avoid V8 deoptimizing the call due to finding eval


	          object[name] = isolateEvalWithHash(functionCache, _hash, _functionString, object);
	        } else {
	          object[name] = isolateEval(_functionString);
	        }

	        object[name].scope = scopeObject;
	      } else {
	        object[name] = new code(_functionString, scopeObject);
	      }
	    } else if (elementType === constants.BSON_DATA_DBPOINTER) {
	      // Get the code string size
	      var _stringSize4 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Check if we have a valid string


	      if (_stringSize4 <= 0 || _stringSize4 > buffer$$1.length - index || buffer$$1[index + _stringSize4 - 1] !== 0) throw new Error('bad string length in bson'); // Namespace

	      if (!validateUtf8$1(buffer$$1, index, index + _stringSize4 - 1)) {
	        throw new Error('Invalid UTF-8 string in BSON document');
	      }

	      var namespace = buffer$$1.toString('utf8', index, index + _stringSize4 - 1); // Update parse index position

	      index = index + _stringSize4; // Read the oid

	      var oidBuffer = Buffer$4.alloc(12);
	      buffer$$1.copy(oidBuffer, 0, index, index + 12);

	      var _oid = new objectid(oidBuffer); // Update the index


	      index = index + 12; // Upgrade to DBRef type

	      object[name] = new db_ref(namespace, _oid);
	    } else {
	      throw new Error('Detected unknown BSON type ' + elementType.toString(16) + ' for fieldname "' + name + '", are you using the latest BSON parser?');
	    }
	  } // Check if the deserialization was against a valid array/object


	  if (size !== index - startIndex) {
	    if (isArray) throw new Error('corrupt array bson');
	    throw new Error('corrupt object bson');
	  } // check if object's $ keys are those of a DBRef


	  var dollarKeys = Object.keys(object).filter(function (k) {
	    return k.startsWith('$');
	  });
	  var valid = true;
	  dollarKeys.forEach(function (k) {
	    if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
	  }); // if a $key not in "$ref", "$id", "$db", don't make a DBRef

	  if (!valid) return object;

	  if (object['$id'] != null && object['$ref'] != null) {
	    var copy = Object.assign({}, object);
	    delete copy.$ref;
	    delete copy.$id;
	    delete copy.$db;
	    return new db_ref(object.$ref, object.$id, object.$db || null, copy);
	  }

	  return object;
	}
	/**
	 * Ensure eval is isolated.
	 *
	 * @ignore
	 * @api private
	 */


	function isolateEvalWithHash(functionCache, hash, functionString, object) {
	  // Contains the value we are going to set
	  var value = null; // Check for cache hit, eval if missing and return cached function

	  if (functionCache[hash] == null) {
	    eval('value = ' + functionString);
	    functionCache[hash] = value;
	  } // Set the object


	  return functionCache[hash].bind(object);
	}
	/**
	 * Ensure eval is isolated.
	 *
	 * @ignore
	 * @api private
	 */


	function isolateEval(functionString) {
	  // Contains the value we are going to set
	  var value = null; // Eval the function

	  eval('value = ' + functionString);
	  return value;
	}

	var deserializer = deserialize$1;

	// All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:
	//
	//  * Redistributions of source code must retain the above copyright notice,
	//    this list of conditions and the following disclaimer.
	//
	//  * Redistributions in binary form must reproduce the above copyright notice,
	//    this list of conditions and the following disclaimer in the documentation
	//    and/or other materials provided with the distribution.
	//
	//  * Neither the name of Fair Oaks Labs, Inc. nor the names of its contributors
	//    may be used to endorse or promote products derived from this software
	//    without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	// ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
	// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	// POSSIBILITY OF SUCH DAMAGE.
	//
	//
	// Modifications to writeIEEE754 to support negative zeroes made by Brian White

	function readIEEE754(buffer$$1, offset, endian, mLen, nBytes) {
	  var e,
	      m,
	      bBE = endian === 'big',
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = bBE ? 0 : nBytes - 1,
	      d = bBE ? 1 : -1,
	      s = buffer$$1[offset + i];
	  i += d;
	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;

	  for (; nBits > 0; e = e * 256 + buffer$$1[offset + i], i += d, nBits -= 8) {
	  }

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;

	  for (; nBits > 0; m = m * 256 + buffer$$1[offset + i], i += d, nBits -= 8) {
	  }

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }

	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	}

	function writeIEEE754(buffer$$1, value, offset, endian, mLen, nBytes) {
	  var e,
	      m,
	      c,
	      bBE = endian === 'big',
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
	      i = bBE ? nBytes - 1 : 0,
	      d = bBE ? -1 : 1,
	      s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);

	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }

	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }

	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  if (isNaN(value)) m = 0;

	  while (mLen >= 8) {
	    buffer$$1[offset + i] = m & 0xff;
	    i += d;
	    m /= 256;
	    mLen -= 8;
	  }

	  e = e << mLen | m;
	  if (isNaN(value)) e += 8;
	  eLen += mLen;

	  while (eLen > 0) {
	    buffer$$1[offset + i] = e & 0xff;
	    i += d;
	    e /= 256;
	    eLen -= 8;
	  }

	  buffer$$1[offset + i - d] |= s * 128;
	}

	var float_parser = {
	  readIEEE754: readIEEE754,
	  writeIEEE754: writeIEEE754
	};

	function _typeof$3(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

	var Buffer$5 = buffer.Buffer;
	var writeIEEE754$1 = float_parser.writeIEEE754;
	var normalizedFunctionString$1 = utils.normalizedFunctionString;
	var regexp$1 = /\x00/; // eslint-disable-line no-control-regex

	var ignoreKeys = new Set(['$db', '$ref', '$id', '$clusterTime']); // To ensure that 0.4 of node works correctly

	var isDate$1 = function isDate(d) {
	  return _typeof$3(d) === 'object' && Object.prototype.toString.call(d) === '[object Date]';
	};

	var isRegExp$1 = function isRegExp(d) {
	  return Object.prototype.toString.call(d) === '[object RegExp]';
	};

	function serializeString(buffer$$1, key, value, index, isArray) {
	  // Encode String type
	  buffer$$1[index++] = constants.BSON_DATA_STRING; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes + 1;
	  buffer$$1[index - 1] = 0; // Write the string

	  var size = buffer$$1.write(value, index + 4, 'utf8'); // Write the size of the string to buffer

	  buffer$$1[index + 3] = size + 1 >> 24 & 0xff;
	  buffer$$1[index + 2] = size + 1 >> 16 & 0xff;
	  buffer$$1[index + 1] = size + 1 >> 8 & 0xff;
	  buffer$$1[index] = size + 1 & 0xff; // Update index

	  index = index + 4 + size; // Write zero

	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeNumber(buffer$$1, key, value, index, isArray) {
	  // We have an integer value
	  if (Math.floor(value) === value && value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	    // If the value fits in 32 bits encode as int, if it fits in a double
	    // encode it as a double, otherwise long
	    if (value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
	      // Set int type 32 bits or less
	      buffer$$1[index++] = constants.BSON_DATA_INT; // Number of written bytes

	      var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	      index = index + numberOfWrittenBytes;
	      buffer$$1[index++] = 0; // Write the int value

	      buffer$$1[index++] = value & 0xff;
	      buffer$$1[index++] = value >> 8 & 0xff;
	      buffer$$1[index++] = value >> 16 & 0xff;
	      buffer$$1[index++] = value >> 24 & 0xff;
	    } else if (value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	      // Encode as double
	      buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	      var _numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	      index = index + _numberOfWrittenBytes;
	      buffer$$1[index++] = 0; // Write float

	      writeIEEE754$1(buffer$$1, value, index, 'little', 52, 8); // Ajust index

	      index = index + 8;
	    } else {
	      // Set long type
	      buffer$$1[index++] = constants.BSON_DATA_LONG; // Number of written bytes

	      var _numberOfWrittenBytes2 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	      index = index + _numberOfWrittenBytes2;
	      buffer$$1[index++] = 0;
	      var longVal = long_1.fromNumber(value);
	      var lowBits = longVal.getLowBits();
	      var highBits = longVal.getHighBits(); // Encode low bits

	      buffer$$1[index++] = lowBits & 0xff;
	      buffer$$1[index++] = lowBits >> 8 & 0xff;
	      buffer$$1[index++] = lowBits >> 16 & 0xff;
	      buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	      buffer$$1[index++] = highBits & 0xff;
	      buffer$$1[index++] = highBits >> 8 & 0xff;
	      buffer$$1[index++] = highBits >> 16 & 0xff;
	      buffer$$1[index++] = highBits >> 24 & 0xff;
	    }
	  } else {
	    // Encode as double
	    buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	    var _numberOfWrittenBytes3 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	    index = index + _numberOfWrittenBytes3;
	    buffer$$1[index++] = 0; // Write float

	    writeIEEE754$1(buffer$$1, value, index, 'little', 52, 8); // Ajust index

	    index = index + 8;
	  }

	  return index;
	}

	function serializeNull(buffer$$1, key, value, index, isArray) {
	  // Set long type
	  buffer$$1[index++] = constants.BSON_DATA_NULL; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeBoolean(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BOOLEAN; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Encode the boolean value

	  buffer$$1[index++] = value ? 1 : 0;
	  return index;
	}

	function serializeDate(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_DATE; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the date

	  var dateInMilis = long_1.fromNumber(value.getTime());
	  var lowBits = dateInMilis.getLowBits();
	  var highBits = dateInMilis.getHighBits(); // Encode low bits

	  buffer$$1[index++] = lowBits & 0xff;
	  buffer$$1[index++] = lowBits >> 8 & 0xff;
	  buffer$$1[index++] = lowBits >> 16 & 0xff;
	  buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = highBits & 0xff;
	  buffer$$1[index++] = highBits >> 8 & 0xff;
	  buffer$$1[index++] = highBits >> 16 & 0xff;
	  buffer$$1[index++] = highBits >> 24 & 0xff;
	  return index;
	}

	function serializeRegExp(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_REGEXP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;

	  if (value.source && value.source.match(regexp$1) != null) {
	    throw Error('value ' + value.source + ' must not contain null bytes');
	  } // Adjust the index


	  index = index + buffer$$1.write(value.source, index, 'utf8'); // Write zero

	  buffer$$1[index++] = 0x00; // Write the parameters

	  if (value.ignoreCase) buffer$$1[index++] = 0x69; // i

	  if (value.global) buffer$$1[index++] = 0x73; // s

	  if (value.multiline) buffer$$1[index++] = 0x6d; // m
	  // Add ending zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeBSONRegExp(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_REGEXP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Check the pattern for 0 bytes

	  if (value.pattern.match(regexp$1) != null) {
	    // The BSON spec doesn't allow keys with null bytes because keys are
	    // null-terminated.
	    throw Error('pattern ' + value.pattern + ' must not contain null bytes');
	  } // Adjust the index


	  index = index + buffer$$1.write(value.pattern, index, 'utf8'); // Write zero

	  buffer$$1[index++] = 0x00; // Write the options

	  index = index + buffer$$1.write(value.options.split('').sort().join(''), index, 'utf8'); // Add ending zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeMinMax(buffer$$1, key, value, index, isArray) {
	  // Write the type of either min or max key
	  if (value === null) {
	    buffer$$1[index++] = constants.BSON_DATA_NULL;
	  } else if (value._bsontype === 'MinKey') {
	    buffer$$1[index++] = constants.BSON_DATA_MIN_KEY;
	  } else {
	    buffer$$1[index++] = constants.BSON_DATA_MAX_KEY;
	  } // Number of written bytes


	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeObjectId(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_OID; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the objectId into the shared buffer

	  if (typeof value.id === 'string') {
	    buffer$$1.write(value.id, index, 'binary');
	  } else if (value.id && value.id.copy) {
	    value.id.copy(buffer$$1, index, 0, 12);
	  } else {
	    throw new TypeError('object [' + JSON.stringify(value) + '] is not a valid ObjectId');
	  } // Ajust index


	  return index + 12;
	}

	function serializeBuffer(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BINARY; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Get size of the buffer (current write point)

	  var size = value.length; // Write the size of the string to buffer

	  buffer$$1[index++] = size & 0xff;
	  buffer$$1[index++] = size >> 8 & 0xff;
	  buffer$$1[index++] = size >> 16 & 0xff;
	  buffer$$1[index++] = size >> 24 & 0xff; // Write the default subtype

	  buffer$$1[index++] = constants.BSON_BINARY_SUBTYPE_DEFAULT; // Copy the content form the binary field to the buffer

	  value.copy(buffer$$1, index, 0, size); // Adjust the index

	  index = index + size;
	  return index;
	}

	function serializeObject(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray, path) {
	  for (var i = 0; i < path.length; i++) {
	    if (path[i] === value) throw new Error('cyclic dependency detected');
	  } // Push value to stack


	  path.push(value); // Write the type

	  buffer$$1[index++] = Array.isArray(value) ? constants.BSON_DATA_ARRAY : constants.BSON_DATA_OBJECT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  var endIndex = serializeInto(buffer$$1, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path); // Pop stack

	  path.pop();
	  return endIndex;
	}

	function serializeDecimal128(buffer$$1, key, value, index, isArray) {
	  buffer$$1[index++] = constants.BSON_DATA_DECIMAL128; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the data from the value

	  value.bytes.copy(buffer$$1, index, 0, 16);
	  return index + 16;
	}

	function serializeLong(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = value._bsontype === 'Long' ? constants.BSON_DATA_LONG : constants.BSON_DATA_TIMESTAMP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the date

	  var lowBits = value.getLowBits();
	  var highBits = value.getHighBits(); // Encode low bits

	  buffer$$1[index++] = lowBits & 0xff;
	  buffer$$1[index++] = lowBits >> 8 & 0xff;
	  buffer$$1[index++] = lowBits >> 16 & 0xff;
	  buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = highBits & 0xff;
	  buffer$$1[index++] = highBits >> 8 & 0xff;
	  buffer$$1[index++] = highBits >> 16 & 0xff;
	  buffer$$1[index++] = highBits >> 24 & 0xff;
	  return index;
	}

	function serializeInt32(buffer$$1, key, value, index, isArray) {
	  // Set int type 32 bits or less
	  buffer$$1[index++] = constants.BSON_DATA_INT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the int value

	  buffer$$1[index++] = value & 0xff;
	  buffer$$1[index++] = value >> 8 & 0xff;
	  buffer$$1[index++] = value >> 16 & 0xff;
	  buffer$$1[index++] = value >> 24 & 0xff;
	  return index;
	}

	function serializeDouble(buffer$$1, key, value, index, isArray) {
	  // Encode as double
	  buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write float

	  writeIEEE754$1(buffer$$1, value.value, index, 'little', 52, 8); // Adjust index

	  index = index + 8;
	  return index;
	}

	function serializeFunction(buffer$$1, key, value, index, checkKeys, depth, isArray) {
	  buffer$$1[index++] = constants.BSON_DATA_CODE; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Function string

	  var functionString = normalizedFunctionString$1(value); // Write the string

	  var size = buffer$$1.write(functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	  buffer$$1[index] = size & 0xff;
	  buffer$$1[index + 1] = size >> 8 & 0xff;
	  buffer$$1[index + 2] = size >> 16 & 0xff;
	  buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	  index = index + 4 + size - 1; // Write zero

	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeCode(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray) {
	  if (value.scope && _typeof$3(value.scope) === 'object') {
	    // Write the type
	    buffer$$1[index++] = constants.BSON_DATA_CODE_W_SCOPE; // Number of written bytes

	    var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	    index = index + numberOfWrittenBytes;
	    buffer$$1[index++] = 0; // Starting index

	    var startIndex = index; // Serialize the function
	    // Get the function string

	    var functionString = typeof value.code === 'string' ? value.code : value.code.toString(); // Index adjustment

	    index = index + 4; // Write string into buffer

	    var codeSize = buffer$$1.write(functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	    buffer$$1[index] = codeSize & 0xff;
	    buffer$$1[index + 1] = codeSize >> 8 & 0xff;
	    buffer$$1[index + 2] = codeSize >> 16 & 0xff;
	    buffer$$1[index + 3] = codeSize >> 24 & 0xff; // Write end 0

	    buffer$$1[index + 4 + codeSize - 1] = 0; // Write the

	    index = index + codeSize + 4; //
	    // Serialize the scope value

	    var endIndex = serializeInto(buffer$$1, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined);
	    index = endIndex - 1; // Writ the total

	    var totalSize = endIndex - startIndex; // Write the total size of the object

	    buffer$$1[startIndex++] = totalSize & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 8 & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 16 & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 24 & 0xff; // Write trailing zero

	    buffer$$1[index++] = 0;
	  } else {
	    buffer$$1[index++] = constants.BSON_DATA_CODE; // Number of written bytes

	    var _numberOfWrittenBytes4 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	    index = index + _numberOfWrittenBytes4;
	    buffer$$1[index++] = 0; // Function string

	    var _functionString = value.code.toString(); // Write the string


	    var size = buffer$$1.write(_functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	    buffer$$1[index] = size & 0xff;
	    buffer$$1[index + 1] = size >> 8 & 0xff;
	    buffer$$1[index + 2] = size >> 16 & 0xff;
	    buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	    index = index + 4 + size - 1; // Write zero

	    buffer$$1[index++] = 0;
	  }

	  return index;
	}

	function serializeBinary(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BINARY; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Extract the buffer

	  var data = value.value(true); // Calculate size

	  var size = value.position; // Add the deprecated 02 type 4 bytes of size to total

	  if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) size = size + 4; // Write the size of the string to buffer

	  buffer$$1[index++] = size & 0xff;
	  buffer$$1[index++] = size >> 8 & 0xff;
	  buffer$$1[index++] = size >> 16 & 0xff;
	  buffer$$1[index++] = size >> 24 & 0xff; // Write the subtype to the buffer

	  buffer$$1[index++] = value.sub_type; // If we have binary type 2 the 4 first bytes are the size

	  if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) {
	    size = size - 4;
	    buffer$$1[index++] = size & 0xff;
	    buffer$$1[index++] = size >> 8 & 0xff;
	    buffer$$1[index++] = size >> 16 & 0xff;
	    buffer$$1[index++] = size >> 24 & 0xff;
	  } // Write the data to the object


	  data.copy(buffer$$1, index, 0, value.position); // Adjust the index

	  index = index + value.position;
	  return index;
	}

	function serializeSymbol(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_SYMBOL; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the string

	  var size = buffer$$1.write(value.value, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	  buffer$$1[index] = size & 0xff;
	  buffer$$1[index + 1] = size >> 8 & 0xff;
	  buffer$$1[index + 2] = size >> 16 & 0xff;
	  buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	  index = index + 4 + size - 1; // Write zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeDBRef(buffer$$1, key, value, index, depth, serializeFunctions, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_OBJECT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  var startIndex = index;
	  var endIndex;
	  var output = {
	    $ref: value.collection || value.namespace,
	    // "namespace" was what library 1.x called "collection"
	    $id: value.oid
	  };
	  if (value.db != null) output.$db = value.db;
	  output = Object.assign(output, value.fields);
	  endIndex = serializeInto(buffer$$1, output, false, index, depth + 1, serializeFunctions); // Calculate object size

	  var size = endIndex - startIndex; // Write the size

	  buffer$$1[startIndex++] = size & 0xff;
	  buffer$$1[startIndex++] = size >> 8 & 0xff;
	  buffer$$1[startIndex++] = size >> 16 & 0xff;
	  buffer$$1[startIndex++] = size >> 24 & 0xff; // Set index

	  return endIndex;
	}

	function serializeInto(buffer$$1, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
	  startingIndex = startingIndex || 0;
	  path = path || []; // Push the object to the path

	  path.push(object); // Start place to serialize into

	  var index = startingIndex + 4; // Special case isArray

	  if (Array.isArray(object)) {
	    // Get object keys
	    for (var i = 0; i < object.length; i++) {
	      var key = '' + i;
	      var value = object[i]; // Is there an override value

	      if (value && value.toBSON) {
	        if (typeof value.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	        value = value.toBSON();
	      }

	      var type = _typeof$3(value);

	      if (type === 'string') {
	        index = serializeString(buffer$$1, key, value, index, true);
	      } else if (type === 'number') {
	        index = serializeNumber(buffer$$1, key, value, index, true);
	      } else if (type === 'boolean') {
	        index = serializeBoolean(buffer$$1, key, value, index, true);
	      } else if (value instanceof Date || isDate$1(value)) {
	        index = serializeDate(buffer$$1, key, value, index, true);
	      } else if (value === undefined) {
	        index = serializeNull(buffer$$1, key, value, index, true);
	      } else if (value === null) {
	        index = serializeNull(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, key, value, index, true);
	      } else if (Buffer$5.isBuffer(value)) {
	        index = serializeBuffer(buffer$$1, key, value, index, true);
	      } else if (value instanceof RegExp || isRegExp$1(value)) {
	        index = serializeRegExp(buffer$$1, key, value, index, true);
	      } else if (type === 'object' && value['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true, path);
	      } else if (type === 'object' && value['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, key, value, index, true);
	      } else if (typeof value === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, true);
	      } else if (value['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true);
	      } else if (value['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, key, value, index, depth, serializeFunctions, true);
	      } else if (value['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, key, value, index, true);
	      } else if (typeof value['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + value['_bsontype']);
	      }
	    }
	  } else if (object instanceof map) {
	    var iterator = object.entries();
	    var done = false;

	    while (!done) {
	      // Unpack the next entry
	      var entry = iterator.next();
	      done = entry.done; // Are we done, then skip and terminate

	      if (done) continue; // Get the entry values

	      var _key = entry.value[0];
	      var _value = entry.value[1]; // Check the type of the value

	      var _type = _typeof$3(_value); // Check the key and throw error if it's illegal


	      if (typeof _key === 'string' && !ignoreKeys.has(_key)) {
	        if (_key.match(regexp$1) != null) {
	          // The BSON spec doesn't allow keys with null bytes because keys are
	          // null-terminated.
	          throw Error('key ' + _key + ' must not contain null bytes');
	        }

	        if (checkKeys) {
	          if ('$' === _key[0]) {
	            throw Error('key ' + _key + " must not start with '$'");
	          } else if (~_key.indexOf('.')) {
	            throw Error('key ' + _key + " must not contain '.'");
	          }
	        }
	      }

	      if (_type === 'string') {
	        index = serializeString(buffer$$1, _key, _value, index);
	      } else if (_type === 'number') {
	        index = serializeNumber(buffer$$1, _key, _value, index);
	      } else if (_type === 'boolean') {
	        index = serializeBoolean(buffer$$1, _key, _value, index);
	      } else if (_value instanceof Date || isDate$1(_value)) {
	        index = serializeDate(buffer$$1, _key, _value, index);
	      } else if (_value === null || _value === undefined && ignoreUndefined === false) {
	        index = serializeNull(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'ObjectId' || _value['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, _key, _value, index);
	      } else if (Buffer$5.isBuffer(_value)) {
	        index = serializeBuffer(buffer$$1, _key, _value, index);
	      } else if (_value instanceof RegExp || isRegExp$1(_value)) {
	        index = serializeRegExp(buffer$$1, _key, _value, index);
	      } else if (_type === 'object' && _value['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	      } else if (_type === 'object' && _value['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Long' || _value['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	      } else if (typeof _value === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions);
	      } else if (_value['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, _key, _value, index, depth, serializeFunctions);
	      } else if (_value['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'MinKey' || _value['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, _key, _value, index);
	      } else if (typeof _value['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + _value['_bsontype']);
	      }
	    }
	  } else {
	    // Did we provide a custom serialization method
	    if (object.toBSON) {
	      if (typeof object.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	      object = object.toBSON();
	      if (object != null && _typeof$3(object) !== 'object') throw new TypeError('toBSON function did not return an object');
	    } // Iterate over all the keys


	    for (var _key2 in object) {
	      var _value2 = object[_key2]; // Is there an override value

	      if (_value2 && _value2.toBSON) {
	        if (typeof _value2.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	        _value2 = _value2.toBSON();
	      } // Check the type of the value


	      var _type2 = _typeof$3(_value2); // Check the key and throw error if it's illegal


	      if (typeof _key2 === 'string' && !ignoreKeys.has(_key2)) {
	        if (_key2.match(regexp$1) != null) {
	          // The BSON spec doesn't allow keys with null bytes because keys are
	          // null-terminated.
	          throw Error('key ' + _key2 + ' must not contain null bytes');
	        }

	        if (checkKeys) {
	          if ('$' === _key2[0]) {
	            throw Error('key ' + _key2 + " must not start with '$'");
	          } else if (~_key2.indexOf('.')) {
	            throw Error('key ' + _key2 + " must not contain '.'");
	          }
	        }
	      }

	      if (_type2 === 'string') {
	        index = serializeString(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'number') {
	        index = serializeNumber(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'boolean') {
	        index = serializeBoolean(buffer$$1, _key2, _value2, index);
	      } else if (_value2 instanceof Date || isDate$1(_value2)) {
	        index = serializeDate(buffer$$1, _key2, _value2, index);
	      } else if (_value2 === undefined) {
	        if (ignoreUndefined === false) index = serializeNull(buffer$$1, _key2, _value2, index);
	      } else if (_value2 === null) {
	        index = serializeNull(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'ObjectId' || _value2['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, _key2, _value2, index);
	      } else if (Buffer$5.isBuffer(_value2)) {
	        index = serializeBuffer(buffer$$1, _key2, _value2, index);
	      } else if (_value2 instanceof RegExp || isRegExp$1(_value2)) {
	        index = serializeRegExp(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'object' && _value2['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	      } else if (_type2 === 'object' && _value2['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Long' || _value2['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	      } else if (typeof _value2 === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions);
	      } else if (_value2['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, _key2, _value2, index, depth, serializeFunctions);
	      } else if (_value2['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'MinKey' || _value2['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, _key2, _value2, index);
	      } else if (typeof _value2['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + _value2['_bsontype']);
	      }
	    }
	  } // Remove the path


	  path.pop(); // Final padding byte for object

	  buffer$$1[index++] = 0x00; // Final size

	  var size = index - startingIndex; // Write the size of the object

	  buffer$$1[startingIndex++] = size & 0xff;
	  buffer$$1[startingIndex++] = size >> 8 & 0xff;
	  buffer$$1[startingIndex++] = size >> 16 & 0xff;
	  buffer$$1[startingIndex++] = size >> 24 & 0xff;
	  return index;
	}

	var serializer = serializeInto;

	function _typeof$4(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

	var Buffer$6 = buffer.Buffer;
	var normalizedFunctionString$2 = utils.normalizedFunctionString; // To ensure that 0.4 of node works correctly

	function isDate$2(d) {
	  return _typeof$4(d) === 'object' && Object.prototype.toString.call(d) === '[object Date]';
	}

	function calculateObjectSize(object, serializeFunctions, ignoreUndefined) {
	  var totalLength = 4 + 1;

	  if (Array.isArray(object)) {
	    for (var i = 0; i < object.length; i++) {
	      totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
	    }
	  } else {
	    // If we have toBSON defined, override the current object
	    if (object.toBSON) {
	      object = object.toBSON();
	    } // Calculate size


	    for (var key in object) {
	      totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
	    }
	  }

	  return totalLength;
	}
	/**
	 * @ignore
	 * @api private
	 */


	function calculateElement(name, value, serializeFunctions, isArray, ignoreUndefined) {
	  // If we have toBSON defined, override the current object
	  if (value && value.toBSON) {
	    value = value.toBSON();
	  }

	  switch (_typeof$4(value)) {
	    case 'string':
	      return 1 + Buffer$6.byteLength(name, 'utf8') + 1 + 4 + Buffer$6.byteLength(value, 'utf8') + 1;

	    case 'number':
	      if (Math.floor(value) === value && value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	        if (value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
	          // 32 bit
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (4 + 1);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	        }
	      } else {
	        // 64 bit
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      }

	    case 'undefined':
	      if (isArray || !ignoreUndefined) return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1;
	      return 0;

	    case 'boolean':
	      return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (1 + 1);

	    case 'object':
	      if (value == null || value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1;
	      } else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (12 + 1);
	      } else if (value instanceof Date || isDate$2(value)) {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      } else if (typeof Buffer$6 !== 'undefined' && Buffer$6.isBuffer(value)) {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (1 + 4 + 1) + value.length;
	      } else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Double' || value['_bsontype'] === 'Timestamp') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      } else if (value['_bsontype'] === 'Decimal128') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (16 + 1);
	      } else if (value['_bsontype'] === 'Code') {
	        // Calculate size depending on the availability of a scope
	        if (value.scope != null && Object.keys(value.scope).length > 0) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + 4 + Buffer$6.byteLength(value.code.toString(), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + Buffer$6.byteLength(value.code.toString(), 'utf8') + 1;
	        }
	      } else if (value['_bsontype'] === 'Binary') {
	        // Check what kind of subtype we have
	        if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (value.position + 1 + 4 + 1 + 4);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (value.position + 1 + 4 + 1);
	        }
	      } else if (value['_bsontype'] === 'Symbol') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + Buffer$6.byteLength(value.value, 'utf8') + 4 + 1 + 1;
	      } else if (value['_bsontype'] === 'DBRef') {
	        // Set up correct object for serialization
	        var ordered_values = Object.assign({
	          $ref: value.collection,
	          $id: value.oid
	        }, value.fields); // Add db reference if it exists

	        if (value.db != null) {
	          ordered_values['$db'] = value.db;
	        }

	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + calculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined);
	      } else if (value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.source, 'utf8') + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
	      } else if (value['_bsontype'] === 'BSONRegExp') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.pattern, 'utf8') + 1 + Buffer$6.byteLength(value.options, 'utf8') + 1;
	      } else {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + calculateObjectSize(value, serializeFunctions, ignoreUndefined) + 1;
	      }

	    case 'function':
	      // WTF for 0.4.X where typeof /someregexp/ === 'function'
	      if (value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]' || String.call(value) === '[object RegExp]') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.source, 'utf8') + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
	      } else {
	        if (serializeFunctions && value.scope != null && Object.keys(value.scope).length > 0) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + 4 + Buffer$6.byteLength(normalizedFunctionString$2(value), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
	        } else if (serializeFunctions) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + Buffer$6.byteLength(normalizedFunctionString$2(value), 'utf8') + 1;
	        }
	      }

	  }

	  return 0;
	}

	var calculate_size = calculateObjectSize;

	var Buffer$7 = buffer.Buffer;
	/**
	 * Makes sure that, if a Uint8Array is passed in, it is wrapped in a Buffer.
	 *
	 * @param {Buffer|Uint8Array} potentialBuffer The potential buffer
	 * @returns {Buffer} the input if potentialBuffer is a buffer, or a buffer that
	 * wraps a passed in Uint8Array
	 * @throws {TypeError} If anything other than a Buffer or Uint8Array is passed in
	 */

	var ensure_buffer = function ensureBuffer(potentialBuffer) {
	  if (potentialBuffer instanceof Buffer$7) {
	    return potentialBuffer;
	  }

	  if (potentialBuffer instanceof Uint8Array) {
	    return Buffer$7.from(potentialBuffer.buffer);
	  }

	  throw new TypeError('Must use either Buffer or Uint8Array');
	};

	var Buffer$8 = buffer.Buffer; // Parts of the parser

	/**
	 * @ignore
	 */
	// Default Max Size

	var MAXSIZE = 1024 * 1024 * 17; // Current Internal Temporary Serialization Buffer

	var buffer$1 = Buffer$8.alloc(MAXSIZE);
	/**
	 * Sets the size of the internal serialization buffer.
	 *
	 * @method
	 * @param {number} size The desired size for the internal serialization buffer
	 */

	function setInternalBufferSize(size) {
	  // Resize the internal serialization buffer if needed
	  if (buffer$1.length < size) {
	    buffer$1 = Buffer$8.alloc(size);
	  }
	}
	/**
	 * Serialize a Javascript object.
	 *
	 * @param {Object} object the Javascript object to serialize.
	 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @return {Buffer} returns the Buffer object containing the serialized object.
	 */


	function serialize$1(object, options) {
	  options = options || {}; // Unpack the options

	  var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  var minInternalBufferSize = typeof options.minInternalBufferSize === 'number' ? options.minInternalBufferSize : MAXSIZE; // Resize the internal serialization buffer if needed

	  if (buffer$1.length < minInternalBufferSize) {
	    buffer$1 = Buffer$8.alloc(minInternalBufferSize);
	  } // Attempt to serialize


	  var serializationIndex = serializer(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, []); // Create the final buffer

	  var finishedBuffer = Buffer$8.alloc(serializationIndex); // Copy into the finished buffer

	  buffer$1.copy(finishedBuffer, 0, 0, finishedBuffer.length); // Return the buffer

	  return finishedBuffer;
	}
	/**
	 * Serialize a Javascript object using a predefined Buffer and index into the buffer, useful when pre-allocating the space for serialization.
	 *
	 * @param {Object} object the Javascript object to serialize.
	 * @param {Buffer} buffer the Buffer you pre-allocated to store the serialized BSON object.
	 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @param {Number} [options.index] the index in the buffer where we wish to start serializing into.
	 * @return {Number} returns the index pointing to the last written byte in the buffer.
	 */


	function serializeWithBufferAndIndex(object, finalBuffer, options) {
	  options = options || {}; // Unpack the options

	  var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  var startIndex = typeof options.index === 'number' ? options.index : 0; // Attempt to serialize

	  var serializationIndex = serializer(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined);
	  buffer$1.copy(finalBuffer, startIndex, 0, serializationIndex); // Return the index

	  return startIndex + serializationIndex - 1;
	}
	/**
	 * Deserialize data as BSON.
	 *
	 * @param {Buffer} buffer the buffer containing the serialized set of BSON documents.
	 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
	 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
	 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
	 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
	 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
	 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
	 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
	 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
	 * @param {boolean} [options.allowObjectSmallerThanBufferSize=false] allows the buffer to be larger than the parsed BSON object
	 * @return {Object} returns the deserialized Javascript Object.
	 */


	function deserialize$2(buffer$$1, options) {
	  buffer$$1 = ensure_buffer(buffer$$1);
	  return deserializer(buffer$$1, options);
	}
	/**
	 * Calculate the bson size for a passed in Javascript object.
	 *
	 * @param {Object} object the Javascript object to calculate the BSON byte size for.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @return {Number} returns the number of bytes the BSON object will take up.
	 */


	function calculateObjectSize$1(object, options) {
	  options = options || {};
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  return calculate_size(object, serializeFunctions, ignoreUndefined);
	}
	/**
	 * Deserialize stream data as BSON documents.
	 *
	 * @param {Buffer} data the buffer containing the serialized set of BSON documents.
	 * @param {Number} startIndex the start index in the data Buffer where the deserialization is to start.
	 * @param {Number} numberOfDocuments number of documents to deserialize.
	 * @param {Array} documents an array where to store the deserialized documents.
	 * @param {Number} docStartIndex the index in the documents array from where to start inserting documents.
	 * @param {Object} [options] additional options used for the deserialization.
	 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
	 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
	 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
	 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
	 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
	 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
	 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
	 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
	 * @return {Number} returns the next index in the buffer after deserialization **x** numbers of documents.
	 */


	function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
	  options = Object.assign({
	    allowObjectSmallerThanBufferSize: true
	  }, options);
	  data = ensure_buffer(data);
	  var index = startIndex; // Loop over all documents

	  for (var i = 0; i < numberOfDocuments; i++) {
	    // Find size of the document
	    var size = data[index] | data[index + 1] << 8 | data[index + 2] << 16 | data[index + 3] << 24; // Update options with index

	    options.index = index; // Parse the document at this point

	    documents[docStartIndex + i] = deserializer(data, options); // Adjust index by the document size

	    index = index + size;
	  } // Return object containing end index of parsing and list of documents


	  return index;
	}

	var bson = {
	  // constants
	  // NOTE: this is done this way because rollup can't resolve an `Object.assign`ed export
	  BSON_INT32_MAX: constants.BSON_INT32_MAX,
	  BSON_INT32_MIN: constants.BSON_INT32_MIN,
	  BSON_INT64_MAX: constants.BSON_INT64_MAX,
	  BSON_INT64_MIN: constants.BSON_INT64_MIN,
	  JS_INT_MAX: constants.JS_INT_MAX,
	  JS_INT_MIN: constants.JS_INT_MIN,
	  BSON_DATA_NUMBER: constants.BSON_DATA_NUMBER,
	  BSON_DATA_STRING: constants.BSON_DATA_STRING,
	  BSON_DATA_OBJECT: constants.BSON_DATA_OBJECT,
	  BSON_DATA_ARRAY: constants.BSON_DATA_ARRAY,
	  BSON_DATA_BINARY: constants.BSON_DATA_BINARY,
	  BSON_DATA_UNDEFINED: constants.BSON_DATA_UNDEFINED,
	  BSON_DATA_OID: constants.BSON_DATA_OID,
	  BSON_DATA_BOOLEAN: constants.BSON_DATA_BOOLEAN,
	  BSON_DATA_DATE: constants.BSON_DATA_DATE,
	  BSON_DATA_NULL: constants.BSON_DATA_NULL,
	  BSON_DATA_REGEXP: constants.BSON_DATA_REGEXP,
	  BSON_DATA_DBPOINTER: constants.BSON_DATA_DBPOINTER,
	  BSON_DATA_CODE: constants.BSON_DATA_CODE,
	  BSON_DATA_SYMBOL: constants.BSON_DATA_SYMBOL,
	  BSON_DATA_CODE_W_SCOPE: constants.BSON_DATA_CODE_W_SCOPE,
	  BSON_DATA_INT: constants.BSON_DATA_INT,
	  BSON_DATA_TIMESTAMP: constants.BSON_DATA_TIMESTAMP,
	  BSON_DATA_LONG: constants.BSON_DATA_LONG,
	  BSON_DATA_DECIMAL128: constants.BSON_DATA_DECIMAL128,
	  BSON_DATA_MIN_KEY: constants.BSON_DATA_MIN_KEY,
	  BSON_DATA_MAX_KEY: constants.BSON_DATA_MAX_KEY,
	  BSON_BINARY_SUBTYPE_DEFAULT: constants.BSON_BINARY_SUBTYPE_DEFAULT,
	  BSON_BINARY_SUBTYPE_FUNCTION: constants.BSON_BINARY_SUBTYPE_FUNCTION,
	  BSON_BINARY_SUBTYPE_BYTE_ARRAY: constants.BSON_BINARY_SUBTYPE_BYTE_ARRAY,
	  BSON_BINARY_SUBTYPE_UUID: constants.BSON_BINARY_SUBTYPE_UUID,
	  BSON_BINARY_SUBTYPE_MD5: constants.BSON_BINARY_SUBTYPE_MD5,
	  BSON_BINARY_SUBTYPE_USER_DEFINED: constants.BSON_BINARY_SUBTYPE_USER_DEFINED,
	  // wrapped types
	  Code: code,
	  Map: map,
	  BSONSymbol: symbol,
	  DBRef: db_ref,
	  Binary: binary,
	  ObjectId: objectid,
	  Long: long_1,
	  Timestamp: timestamp,
	  Double: double_1,
	  Int32: int_32,
	  MinKey: min_key,
	  MaxKey: max_key,
	  BSONRegExp: regexp,
	  Decimal128: decimal128,
	  // methods
	  serialize: serialize$1,
	  serializeWithBufferAndIndex: serializeWithBufferAndIndex,
	  deserialize: deserialize$2,
	  calculateObjectSize: calculateObjectSize$1,
	  deserializeStream: deserializeStream,
	  setInternalBufferSize: setInternalBufferSize,
	  // legacy support
	  ObjectID: objectid,
	  // Extended JSON
	  EJSON: extended_json
	};
	var bson_1 = bson.BSON_INT32_MAX;
	var bson_2 = bson.BSON_INT32_MIN;
	var bson_3 = bson.BSON_INT64_MAX;
	var bson_4 = bson.BSON_INT64_MIN;
	var bson_5 = bson.JS_INT_MAX;
	var bson_6 = bson.JS_INT_MIN;
	var bson_7 = bson.BSON_DATA_NUMBER;
	var bson_8 = bson.BSON_DATA_STRING;
	var bson_9 = bson.BSON_DATA_OBJECT;
	var bson_10 = bson.BSON_DATA_ARRAY;
	var bson_11 = bson.BSON_DATA_BINARY;
	var bson_12 = bson.BSON_DATA_UNDEFINED;
	var bson_13 = bson.BSON_DATA_OID;
	var bson_14 = bson.BSON_DATA_BOOLEAN;
	var bson_15 = bson.BSON_DATA_DATE;
	var bson_16 = bson.BSON_DATA_NULL;
	var bson_17 = bson.BSON_DATA_REGEXP;
	var bson_18 = bson.BSON_DATA_DBPOINTER;
	var bson_19 = bson.BSON_DATA_CODE;
	var bson_20 = bson.BSON_DATA_SYMBOL;
	var bson_21 = bson.BSON_DATA_CODE_W_SCOPE;
	var bson_22 = bson.BSON_DATA_INT;
	var bson_23 = bson.BSON_DATA_TIMESTAMP;
	var bson_24 = bson.BSON_DATA_LONG;
	var bson_25 = bson.BSON_DATA_DECIMAL128;
	var bson_26 = bson.BSON_DATA_MIN_KEY;
	var bson_27 = bson.BSON_DATA_MAX_KEY;
	var bson_28 = bson.BSON_BINARY_SUBTYPE_DEFAULT;
	var bson_29 = bson.BSON_BINARY_SUBTYPE_FUNCTION;
	var bson_30 = bson.BSON_BINARY_SUBTYPE_BYTE_ARRAY;
	var bson_31 = bson.BSON_BINARY_SUBTYPE_UUID;
	var bson_32 = bson.BSON_BINARY_SUBTYPE_MD5;
	var bson_33 = bson.BSON_BINARY_SUBTYPE_USER_DEFINED;
	var bson_34 = bson.Code;
	var bson_35 = bson.BSONSymbol;
	var bson_36 = bson.DBRef;
	var bson_37 = bson.Binary;
	var bson_38 = bson.ObjectId;
	var bson_39 = bson.Long;
	var bson_40 = bson.Timestamp;
	var bson_41 = bson.Double;
	var bson_42 = bson.Int32;
	var bson_43 = bson.MinKey;
	var bson_44 = bson.MaxKey;
	var bson_45 = bson.BSONRegExp;
	var bson_46 = bson.Decimal128;
	var bson_47 = bson.serialize;
	var bson_48 = bson.serializeWithBufferAndIndex;
	var bson_49 = bson.deserialize;
	var bson_50 = bson.calculateObjectSize;
	var bson_51 = bson.deserializeStream;
	var bson_52 = bson.setInternalBufferSize;
	var bson_53 = bson.ObjectID;
	var bson_54 = bson.EJSON;

	exports.default = bson;
	exports.BSON_INT32_MAX = bson_1;
	exports.BSON_INT32_MIN = bson_2;
	exports.BSON_INT64_MAX = bson_3;
	exports.BSON_INT64_MIN = bson_4;
	exports.JS_INT_MAX = bson_5;
	exports.JS_INT_MIN = bson_6;
	exports.BSON_DATA_NUMBER = bson_7;
	exports.BSON_DATA_STRING = bson_8;
	exports.BSON_DATA_OBJECT = bson_9;
	exports.BSON_DATA_ARRAY = bson_10;
	exports.BSON_DATA_BINARY = bson_11;
	exports.BSON_DATA_UNDEFINED = bson_12;
	exports.BSON_DATA_OID = bson_13;
	exports.BSON_DATA_BOOLEAN = bson_14;
	exports.BSON_DATA_DATE = bson_15;
	exports.BSON_DATA_NULL = bson_16;
	exports.BSON_DATA_REGEXP = bson_17;
	exports.BSON_DATA_DBPOINTER = bson_18;
	exports.BSON_DATA_CODE = bson_19;
	exports.BSON_DATA_SYMBOL = bson_20;
	exports.BSON_DATA_CODE_W_SCOPE = bson_21;
	exports.BSON_DATA_INT = bson_22;
	exports.BSON_DATA_TIMESTAMP = bson_23;
	exports.BSON_DATA_LONG = bson_24;
	exports.BSON_DATA_DECIMAL128 = bson_25;
	exports.BSON_DATA_MIN_KEY = bson_26;
	exports.BSON_DATA_MAX_KEY = bson_27;
	exports.BSON_BINARY_SUBTYPE_DEFAULT = bson_28;
	exports.BSON_BINARY_SUBTYPE_FUNCTION = bson_29;
	exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = bson_30;
	exports.BSON_BINARY_SUBTYPE_UUID = bson_31;
	exports.BSON_BINARY_SUBTYPE_MD5 = bson_32;
	exports.BSON_BINARY_SUBTYPE_USER_DEFINED = bson_33;
	exports.Code = bson_34;
	exports.BSONSymbol = bson_35;
	exports.DBRef = bson_36;
	exports.Binary = bson_37;
	exports.ObjectId = bson_38;
	exports.Long = bson_39;
	exports.Timestamp = bson_40;
	exports.Double = bson_41;
	exports.Int32 = bson_42;
	exports.MinKey = bson_43;
	exports.MaxKey = bson_44;
	exports.BSONRegExp = bson_45;
	exports.Decimal128 = bson_46;
	exports.serialize = bson_47;
	exports.serializeWithBufferAndIndex = bson_48;
	exports.deserialize = bson_49;
	exports.calculateObjectSize = bson_50;
	exports.deserializeStream = bson_51;
	exports.setInternalBufferSize = bson_52;
	exports.ObjectID = bson_53;
	exports.EJSON = bson_54;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,{"isBuffer":require("../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js")},typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js":130,"buffer":128,"long":8}],6:[function(require,module,exports){
(function (process){(function (){
function detect() {
  if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return getNodeVersion();
}

function detectOS(userAgentString) {
  var rules = getOperatingSystemRules();
  var detected = rules.filter(function (os) {
    return os.rule && os.rule.test(userAgentString);
  })[0];

  return detected ? detected.name : null;
}

function getNodeVersion() {
  var isNode = typeof process !== 'undefined' && process.version;
  return isNode && {
    name: 'node',
    version: process.version.slice(1),
    os: process.platform
  };
}

function parseUserAgent(userAgentString) {
  var browsers = getBrowserRules();
  if (!userAgentString) {
    return null;
  }

  var detected = browsers.map(function(browser) {
    var match = browser.rule.exec(userAgentString);
    var version = match && match[1].split(/[._]/).slice(0,3);

    if (version && version.length < 3) {
      version = version.concat(version.length == 1 ? [0, 0] : [0]);
    }

    return match && {
      name: browser.name,
      version: version.join('.')
    };
  }).filter(Boolean)[0] || null;

  if (detected) {
    detected.os = detectOS(userAgentString);
  }

  if (/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/i.test(userAgentString)) {
    detected = detected || {};
    detected.bot = true;
  }

  return detected;
}

function getBrowserRules() {
  return buildRules([
    [ 'aol', /AOLShield\/([0-9\._]+)/ ],
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
    [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
    [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
    [ 'samsung', /SamsungBrowser\/([0-9\.]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ],
    [ 'facebook', /FBAV\/([0-9\.]+)/],
    [ 'instagram', /Instagram\s([0-9\.]+)/],
    [ 'ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/]
  ]);
}

function getOperatingSystemRules() {
  return buildRules([
    [ 'iOS', /iP(hone|od|ad)/ ],
    [ 'Android OS', /Android/ ],
    [ 'BlackBerry OS', /BlackBerry|BB10/ ],
    [ 'Windows Mobile', /IEMobile/ ],
    [ 'Amazon OS', /Kindle/ ],
    [ 'Windows 3.11', /Win16/ ],
    [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
    [ 'Windows 98', /(Windows 98)|(Win98)/ ],
    [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
    [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
    [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
    [ 'Windows Vista', /(Windows NT 6.0)/ ],
    [ 'Windows 7', /(Windows NT 6.1)/ ],
    [ 'Windows 8', /(Windows NT 6.2)/ ],
    [ 'Windows 8.1', /(Windows NT 6.3)/ ],
    [ 'Windows 10', /(Windows NT 10.0)/ ],
    [ 'Windows ME', /Windows ME/ ],
    [ 'Open BSD', /OpenBSD/ ],
    [ 'Sun OS', /SunOS/ ],
    [ 'Linux', /(Linux)|(X11)/ ],
    [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
    [ 'QNX', /QNX/ ],
    [ 'BeOS', /BeOS/ ],
    [ 'OS/2', /OS\/2/ ],
    [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
  ]);
}

function buildRules(ruleTuples) {
  return ruleTuples.map(function(tuple) {
    return {
      name: tuple[0],
      rule: tuple[1]
    };
  });
}

module.exports = {
  detect: detect,
  detectOS: detectOS,
  getNodeVersion: getNodeVersion,
  parseUserAgent: parseUserAgent
};

}).call(this)}).call(this,require('_process'))
},{"_process":131}],7:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],8:[function(require,module,exports){
module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};

},{}],9:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var LocalStorage_1 = __importDefault(require("./internal/common/LocalStorage"));
var BrowserFetchStreamTransport_1 = __importDefault(require("./internal/net/BrowserFetchStreamTransport"));
var BrowserFetchTransport_1 = __importDefault(require("./internal/net/BrowserFetchTransport"));
var StitchAppClientImpl_1 = __importDefault(require("./internal/StitchAppClientImpl"));
var DEFAULT_BASE_URL = "https://stitch.mongodb.com";
var appClients = {};
var Stitch = (function () {
    function Stitch() {
    }
    Object.defineProperty(Stitch, "defaultAppClient", {
        get: function () {
            if (Stitch.defaultClientAppId === undefined) {
                throw new Error("default app client has not yet been initialized/set");
            }
            return appClients[Stitch.defaultClientAppId];
        },
        enumerable: true,
        configurable: true
    });
    Stitch.getAppClient = function (clientAppId) {
        if (appClients[clientAppId] === undefined) {
            throw new Error("client for app '" + clientAppId + "' has not yet been initialized");
        }
        return appClients[clientAppId];
    };
    Stitch.hasAppClient = function (clientAppId) {
        return appClients[clientAppId] !== undefined;
    };
    Stitch.initializeDefaultAppClient = function (clientAppId, config) {
        if (config === void 0) { config = new mongodb_stitch_core_sdk_1.StitchAppClientConfiguration.Builder().build(); }
        if (clientAppId === undefined || clientAppId === "") {
            throw new Error("clientAppId must be set to a non-empty string");
        }
        if (Stitch.defaultClientAppId !== undefined) {
            throw new Error("default app can only be set once; currently set to '" + Stitch.defaultClientAppId + "'");
        }
        var client = Stitch.initializeAppClient(clientAppId, config);
        Stitch.defaultClientAppId = clientAppId;
        return client;
    };
    Stitch.initializeAppClient = function (clientAppId, config) {
        if (config === void 0) { config = new mongodb_stitch_core_sdk_1.StitchAppClientConfiguration.Builder().build(); }
        if (clientAppId === undefined || clientAppId === "") {
            throw new Error("clientAppId must be set to a non-empty string");
        }
        if (appClients[clientAppId] !== undefined) {
            throw new Error("client for app '" + clientAppId + "' has already been initialized");
        }
        var builder = config.builder ? config.builder() : new mongodb_stitch_core_sdk_1.StitchAppClientConfiguration.Builder(config);
        if (builder.storage === undefined) {
            builder.withStorage(new LocalStorage_1.default(clientAppId));
        }
        if (builder.transport === undefined) {
            if (window["EventSource"]) {
                builder.withTransport(new BrowserFetchStreamTransport_1.default());
            }
            else {
                builder.withTransport(new BrowserFetchTransport_1.default());
            }
        }
        if (builder.baseUrl === undefined || builder.baseUrl === "") {
            builder.withBaseUrl(DEFAULT_BASE_URL);
        }
        if (builder.localAppName === undefined || builder.localAppName === "") {
            builder.withLocalAppName(Stitch.localAppName);
        }
        if (builder.localAppVersion === undefined ||
            builder.localAppVersion === "") {
            builder.withLocalAppVersion(Stitch.localAppVersion);
        }
        var client = new StitchAppClientImpl_1.default(clientAppId, builder.build());
        appClients[clientAppId] = client;
        return client;
    };
    Stitch.clearApps = function () {
        appClients = {};
    };
    return Stitch;
}());
exports.default = Stitch;

},{"./internal/StitchAppClientImpl":24,"./internal/common/LocalStorage":25,"./internal/net/BrowserFetchStreamTransport":27,"./internal/net/BrowserFetchTransport":28,"mongodb-stitch-core-sdk":89}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedirectFragmentFields;
(function (RedirectFragmentFields) {
    RedirectFragmentFields["StitchError"] = "_stitch_error";
    RedirectFragmentFields["State"] = "_stitch_state";
    RedirectFragmentFields["UserAuth"] = "_stitch_ua";
    RedirectFragmentFields["LinkUser"] = "_stitch_link_user";
    RedirectFragmentFields["StitchLink"] = "_stitch_link";
    RedirectFragmentFields["ClientAppId"] = "_stitch_client_app_id";
})(RedirectFragmentFields || (RedirectFragmentFields = {}));
exports.default = RedirectFragmentFields;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedirectKeys;
(function (RedirectKeys) {
    RedirectKeys["ProviderName"] = "_stitch_redirect_provider_name";
    RedirectKeys["ProviderType"] = "_stitch_redirect_provider_type";
    RedirectKeys["State"] = "_stitch_redirect_state";
})(RedirectKeys || (RedirectKeys = {}));
exports.default = RedirectKeys;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var detect_browser_1 = require("detect-browser");
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var Version_1 = __importDefault(require("../../internal/common/Version"));
var RedirectFragmentFields_1 = __importDefault(require("./RedirectFragmentFields"));
var RedirectKeys_1 = __importDefault(require("./RedirectKeys"));
var StitchRedirectError_1 = __importDefault(require("./StitchRedirectError"));
var StitchUserFactoryImpl_1 = __importDefault(require("./StitchUserFactoryImpl"));
var alphaNumericCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var StitchAuthImpl = (function (_super) {
    __extends(StitchAuthImpl, _super);
    function StitchAuthImpl(requestClient, browserAuthRoutes, authStorage, appInfo, jsdomWindow) {
        if (jsdomWindow === void 0) { jsdomWindow = window; }
        var _this = _super.call(this, requestClient, browserAuthRoutes, authStorage) || this;
        _this.browserAuthRoutes = browserAuthRoutes;
        _this.authStorage = authStorage;
        _this.appInfo = appInfo;
        _this.jsdomWindow = jsdomWindow;
        _this.listeners = new Set();
        _this.synchronousListeners = new Set();
        return _this;
    }
    Object.defineProperty(StitchAuthImpl.prototype, "userFactory", {
        get: function () {
            return new StitchUserFactoryImpl_1.default(this);
        },
        enumerable: true,
        configurable: true
    });
    StitchAuthImpl.prototype.getProviderClient = function (factory, providerName) {
        if (isAuthProviderClientFactory(factory)) {
            return factory.getClient(this, this.requestClient, this.authRoutes);
        }
        else {
            return factory.getNamedClient(providerName, this.requestClient, this.authRoutes);
        }
    };
    StitchAuthImpl.prototype.loginWithCredential = function (credential) {
        return _super.prototype.loginWithCredentialInternal.call(this, credential);
    };
    StitchAuthImpl.prototype.loginWithRedirect = function (credential) {
        var _this = this;
        var _a = this.prepareRedirect(credential), redirectUrl = _a.redirectUrl, state = _a.state;
        this.requestClient.getBaseURL().then(function (baseUrl) {
            _this.jsdomWindow.location.replace(baseUrl +
                _this.browserAuthRoutes.getAuthProviderRedirectRoute(credential, redirectUrl, state, _this.deviceInfo));
        });
    };
    StitchAuthImpl.prototype.linkWithRedirectInternal = function (user, credential) {
        var _this = this;
        if (this.user !== undefined && user.id !== this.user.id) {
            return Promise.reject(new mongodb_stitch_core_sdk_1.StitchClientError(mongodb_stitch_core_sdk_1.StitchClientErrorCode.UserNoLongerValid));
        }
        var _a = this.prepareRedirect(credential), redirectUrl = _a.redirectUrl, state = _a.state;
        return this.requestClient.getBaseURL().then(function (baseUrl) {
            var link = baseUrl +
                _this.browserAuthRoutes.getAuthProviderLinkRedirectRoute(credential, redirectUrl, state, _this.deviceInfo);
            return (StitchAuthImpl.injectedFetch ? StitchAuthImpl.injectedFetch : fetch)(new Request(link, {
                credentials: "include",
                headers: {
                    Authorization: "Bearer " + _this.authInfo.accessToken
                },
                mode: 'cors'
            }));
        }).then(function (response) {
            _this.jsdomWindow.location.replace(response.headers.get("X-Stitch-Location"));
        });
    };
    StitchAuthImpl.prototype.hasRedirectResult = function () {
        var isValid = false;
        try {
            isValid = this.parseRedirect().isValid;
            return isValid;
        }
        catch (_) {
            return false;
        }
        finally {
            if (!isValid) {
                this.cleanupRedirect();
            }
        }
    };
    StitchAuthImpl.prototype.handleRedirectResult = function () {
        try {
            var providerName = this.authStorage.get(RedirectKeys_1.default.ProviderName);
            var providerType = this.authStorage.get(RedirectKeys_1.default.ProviderType);
            var redirectFragment = this.parseRedirect();
            return this.loginWithCredentialInternal(new mongodb_stitch_core_sdk_1.StitchAuthResponseCredential(this.processRedirectResult(redirectFragment), providerType, providerName, redirectFragment.asLink)).then(function (user) { return user; });
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    StitchAuthImpl.prototype.linkWithCredential = function (user, credential) {
        return _super.prototype.linkUserWithCredentialInternal.call(this, user, credential);
    };
    StitchAuthImpl.prototype.logout = function () {
        if (arguments.length > 0) {
            return Promise.reject(new mongodb_stitch_core_sdk_1.StitchClientError(mongodb_stitch_core_sdk_1.StitchClientErrorCode.UnexpectedArguments));
        }
        return _super.prototype.logoutInternal.call(this);
    };
    StitchAuthImpl.prototype.logoutUserWithId = function (userId) {
        return _super.prototype.logoutUserWithIdInternal.call(this, userId);
    };
    StitchAuthImpl.prototype.removeUser = function () {
        if (arguments.length > 0) {
            return Promise.reject(new mongodb_stitch_core_sdk_1.StitchClientError(mongodb_stitch_core_sdk_1.StitchClientErrorCode.UnexpectedArguments));
        }
        return _super.prototype.removeUserInternal.call(this);
    };
    StitchAuthImpl.prototype.removeUserWithId = function (userId) {
        return _super.prototype.removeUserWithIdInternal.call(this, userId);
    };
    Object.defineProperty(StitchAuthImpl.prototype, "deviceInfo", {
        get: function () {
            var info = {};
            if (this.hasDeviceId) {
                info[mongodb_stitch_core_sdk_1.DeviceFields.DEVICE_ID] = this.deviceId;
            }
            if (this.appInfo.localAppName !== undefined) {
                info[mongodb_stitch_core_sdk_1.DeviceFields.APP_ID] = this.appInfo.localAppName;
            }
            if (this.appInfo.localAppVersion !== undefined) {
                info[mongodb_stitch_core_sdk_1.DeviceFields.APP_VERSION] = this.appInfo.localAppVersion;
            }
            var browser = detect_browser_1.detect();
            if (browser) {
                info[mongodb_stitch_core_sdk_1.DeviceFields.PLATFORM] = browser.name;
                info[mongodb_stitch_core_sdk_1.DeviceFields.PLATFORM_VERSION] = browser.version;
            }
            else {
                info[mongodb_stitch_core_sdk_1.DeviceFields.PLATFORM] = "web";
                info[mongodb_stitch_core_sdk_1.DeviceFields.PLATFORM_VERSION] = "0.0.0";
            }
            info[mongodb_stitch_core_sdk_1.DeviceFields.SDK_VERSION] = Version_1.default;
            return info;
        },
        enumerable: true,
        configurable: true
    });
    StitchAuthImpl.prototype.addAuthListener = function (listener) {
        this.listeners.add(listener);
        this.onAuthEvent(listener);
        this.dispatchAuthEvent({
            kind: mongodb_stitch_core_sdk_1.AuthEventKind.ListenerRegistered,
        });
    };
    StitchAuthImpl.prototype.addSynchronousAuthListener = function (listener) {
        this.listeners.add(listener);
        this.onAuthEvent(listener);
        this.dispatchAuthEvent({
            kind: mongodb_stitch_core_sdk_1.AuthEventKind.ListenerRegistered,
        });
    };
    StitchAuthImpl.prototype.removeAuthListener = function (listener) {
        this.listeners.delete(listener);
    };
    StitchAuthImpl.prototype.onAuthEvent = function (listener) {
        var _this = this;
        if (listener) {
            var _1 = new Promise(function (resolve) {
                if (listener.onAuthEvent) {
                    listener.onAuthEvent(_this);
                }
                resolve(undefined);
            });
        }
        else {
            this.listeners.forEach(function (one) {
                _this.onAuthEvent(one);
            });
        }
    };
    StitchAuthImpl.prototype.dispatchAuthEvent = function (event) {
        var _this = this;
        switch (event.kind) {
            case mongodb_stitch_core_sdk_1.AuthEventKind.ActiveUserChanged:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onActiveUserChanged) {
                        listener.onActiveUserChanged(_this, event.currentActiveUser, event.previousActiveUser);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.ListenerRegistered:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onListenerRegistered) {
                        listener.onListenerRegistered(_this);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.UserAdded:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onUserAdded) {
                        listener.onUserAdded(_this, event.addedUser);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.UserLinked:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onUserLinked) {
                        listener.onUserLinked(_this, event.linkedUser);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.UserLoggedIn:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onUserLoggedIn) {
                        listener.onUserLoggedIn(_this, event.loggedInUser);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.UserLoggedOut:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onUserLoggedOut) {
                        listener.onUserLoggedOut(_this, event.loggedOutUser);
                    }
                });
                break;
            case mongodb_stitch_core_sdk_1.AuthEventKind.UserRemoved:
                this.dispatchBlockToListeners(function (listener) {
                    if (listener.onUserRemoved) {
                        listener.onUserRemoved(_this, event.removedUser);
                    }
                });
                break;
            default:
                return this.assertNever(event);
        }
    };
    StitchAuthImpl.prototype.refreshCustomData = function () {
        return this.refreshAccessToken();
    };
    StitchAuthImpl.prototype.assertNever = function (x) {
        throw new Error("unexpected object: " + x);
    };
    StitchAuthImpl.prototype.dispatchBlockToListeners = function (block) {
        this.synchronousListeners.forEach(block);
        this.listeners.forEach(function (listener) {
            var _ = new Promise(function (resolve) {
                block(listener);
                resolve(undefined);
            });
        });
    };
    StitchAuthImpl.prototype.cleanupRedirect = function () {
        this.jsdomWindow.history.replaceState(null, "", this.pageRootUrl());
        this.authStorage.remove(RedirectKeys_1.default.State);
        this.authStorage.remove(RedirectKeys_1.default.ProviderName);
        this.authStorage.remove(RedirectKeys_1.default.ProviderType);
    };
    StitchAuthImpl.prototype.parseRedirect = function () {
        if (typeof this.jsdomWindow === "undefined") {
            throw new StitchRedirectError_1.default("running in a non-browser environment");
        }
        if (!this.jsdomWindow.location || !this.jsdomWindow.location.hash) {
            throw new StitchRedirectError_1.default("window location hash was undefined");
        }
        var ourState = this.authStorage.get(RedirectKeys_1.default.State);
        var redirectFragment = this.jsdomWindow.location.hash.substring(1);
        return parseRedirectFragment(redirectFragment, ourState, this.appInfo.clientAppId);
    };
    StitchAuthImpl.prototype.processRedirectResult = function (redirectFragment) {
        try {
            if (!redirectFragment.isValid) {
                throw new StitchRedirectError_1.default("invalid redirect result");
            }
            if (redirectFragment.lastError) {
                throw new StitchRedirectError_1.default("error handling redirect: " + redirectFragment.lastError);
            }
            if (!redirectFragment.authInfo) {
                throw new StitchRedirectError_1.default("no user auth value was found: it could not be decoded from fragment");
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            this.cleanupRedirect();
        }
        return redirectFragment.authInfo;
    };
    StitchAuthImpl.prototype.prepareRedirect = function (credential) {
        this.authStorage.set(RedirectKeys_1.default.ProviderName, credential.providerName);
        this.authStorage.set(RedirectKeys_1.default.ProviderType, credential.providerType);
        var redirectUrl = credential.redirectUrl;
        if (redirectUrl === undefined) {
            redirectUrl = this.pageRootUrl();
        }
        var state = generateState();
        this.authStorage.set(RedirectKeys_1.default.State, state);
        return { redirectUrl: redirectUrl, state: state };
    };
    StitchAuthImpl.prototype.pageRootUrl = function () {
        return [
            this.jsdomWindow.location.protocol,
            "//",
            this.jsdomWindow.location.host,
            this.jsdomWindow.location.pathname
        ].join("");
    };
    return StitchAuthImpl;
}(mongodb_stitch_core_sdk_1.CoreStitchAuth));
exports.default = StitchAuthImpl;
function generateState() {
    var state = "";
    for (var i = 0; i < 64; ++i) {
        state += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharacters.length));
    }
    return state;
}
function unmarshallUserAuth(data) {
    var parts = data.split("$");
    if (parts.length !== 4) {
        throw new StitchRedirectError_1.default("invalid user auth data provided while " +
            "marshalling user authentication data: " +
            data);
    }
    var _a = __read(parts, 4), accessToken = _a[0], refreshToken = _a[1], userId = _a[2], deviceId = _a[3];
    return new mongodb_stitch_core_sdk_1.AuthInfo(userId, deviceId, accessToken, refreshToken);
}
var ParsedRedirectFragment = (function () {
    function ParsedRedirectFragment() {
        this.stateValid = false;
        this.clientAppIdValid = false;
        this.asLink = false;
    }
    Object.defineProperty(ParsedRedirectFragment.prototype, "isValid", {
        get: function () {
            return this.stateValid && this.clientAppIdValid;
        },
        enumerable: true,
        configurable: true
    });
    return ParsedRedirectFragment;
}());
function parseRedirectFragment(fragment, ourState, ourClientAppId) {
    var vars = fragment.split("&");
    var result = new ParsedRedirectFragment();
    vars.forEach(function (kvp) {
        var pairParts = kvp.split("=");
        var pairKey = decodeURIComponent(pairParts[0]);
        switch (pairKey) {
            case RedirectFragmentFields_1.default.StitchError:
                result.lastError = decodeURIComponent(pairParts[1]);
                break;
            case RedirectFragmentFields_1.default.UserAuth:
                try {
                    result.authInfo = unmarshallUserAuth(decodeURIComponent(pairParts[1]));
                }
                catch (e) {
                    result.lastError = e;
                }
                break;
            case RedirectFragmentFields_1.default.StitchLink:
                if (pairParts[1] === "ok") {
                    result.asLink = true;
                }
                break;
            case RedirectFragmentFields_1.default.State:
                var theirState = decodeURIComponent(pairParts[1]);
                if (ourState === theirState) {
                    result.stateValid = true;
                }
                break;
            case RedirectFragmentFields_1.default.ClientAppId:
                var clientAppId = decodeURIComponent(pairParts[1]);
                if (ourClientAppId === clientAppId) {
                    result.clientAppIdValid = true;
                }
                break;
            default:
                break;
        }
    });
    return result;
}
function isAuthProviderClientFactory(factory) {
    return (factory.getClient !== undefined);
}

},{"../../internal/common/Version":26,"./RedirectFragmentFields":10,"./RedirectKeys":11,"./StitchRedirectError":15,"./StitchUserFactoryImpl":16,"detect-browser":6,"mongodb-stitch-core-sdk":89}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var StitchBrowserAppAuthRoutes = (function (_super) {
    __extends(StitchBrowserAppAuthRoutes, _super);
    function StitchBrowserAppAuthRoutes(clientAppId) {
        return _super.call(this, clientAppId) || this;
    }
    StitchBrowserAppAuthRoutes.prototype.getAuthProviderRedirectRoute = function (credential, redirectUrl, state, deviceInfo) {
        return this.getAuthProviderLoginRoute(credential.providerName) + "?redirect=" + encodeURI(redirectUrl) + "&state=" + state + "&device=" + this.uriEncodeObject(deviceInfo);
    };
    StitchBrowserAppAuthRoutes.prototype.getAuthProviderLinkRedirectRoute = function (credential, redirectUrl, state, deviceInfo) {
        return this.getAuthProviderLoginRoute(credential.providerName) + "?redirect=" + encodeURI(redirectUrl) + "&state=" + state + "&device=" + this.uriEncodeObject(deviceInfo) + "&link=true&providerRedirectHeader=true";
    };
    StitchBrowserAppAuthRoutes.prototype.uriEncodeObject = function (obj) {
        return encodeURIComponent(mongodb_stitch_core_sdk_1.base64Encode(JSON.stringify(obj)));
    };
    return StitchBrowserAppAuthRoutes;
}(mongodb_stitch_core_sdk_1.StitchAppAuthRoutes));
exports.default = StitchBrowserAppAuthRoutes;

},{"mongodb-stitch-core-sdk":89}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var StitchBrowserAppAuthRoutes_1 = __importDefault(require("./StitchBrowserAppAuthRoutes"));
var StitchBrowserAppRoutes = (function (_super) {
    __extends(StitchBrowserAppRoutes, _super);
    function StitchBrowserAppRoutes(clientAppId) {
        var _this = _super.call(this, clientAppId) || this;
        _this.authRoutes = new StitchBrowserAppAuthRoutes_1.default(clientAppId);
        return _this;
    }
    return StitchBrowserAppRoutes;
}(mongodb_stitch_core_sdk_1.StitchAppRoutes));
exports.default = StitchBrowserAppRoutes;

},{"./StitchBrowserAppAuthRoutes":13,"mongodb-stitch-core-sdk":89}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var StitchRedirectError = (function (_super) {
    __extends(StitchRedirectError, _super);
    function StitchRedirectError(msg) {
        return _super.call(this, msg) || this;
    }
    return StitchRedirectError;
}(mongodb_stitch_core_sdk_1.StitchError));
exports.default = StitchRedirectError;

},{"mongodb-stitch-core-sdk":89}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserImpl_1 = __importDefault(require("./StitchUserImpl"));
var StitchUserFactoryImpl = (function () {
    function StitchUserFactoryImpl(auth) {
        this.auth = auth;
    }
    StitchUserFactoryImpl.prototype.makeUser = function (id, loggedInProviderType, loggedInProviderName, isLoggedIn, lastAuthActivity, userProfile, customData) {
        return new StitchUserImpl_1.default(id, loggedInProviderType, loggedInProviderName, isLoggedIn, lastAuthActivity, userProfile, this.auth, customData);
    };
    return StitchUserFactoryImpl;
}());
exports.default = StitchUserFactoryImpl;

},{"./StitchUserImpl":17}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var StitchUserImpl = (function (_super) {
    __extends(StitchUserImpl, _super);
    function StitchUserImpl(id, loggedInProviderType, loggedInProviderName, isLoggedIn, lastAuthActivity, profile, auth, customData) {
        var _this = _super.call(this, id, loggedInProviderType, loggedInProviderName, isLoggedIn, lastAuthActivity, profile, customData) || this;
        _this.auth = auth;
        return _this;
    }
    StitchUserImpl.prototype.linkWithCredential = function (credential) {
        return this.auth.linkWithCredential(this, credential);
    };
    StitchUserImpl.prototype.linkUserWithRedirect = function (credential) {
        return this.auth.linkWithRedirectInternal(this, credential);
    };
    return StitchUserImpl;
}(mongodb_stitch_core_sdk_1.CoreStitchUserImpl));
exports.default = StitchUserImpl;

},{"mongodb-stitch-core-sdk":89}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var FacebookRedirectCredential = (function () {
    function FacebookRedirectCredential(redirectUrl, providerName, providerType) {
        if (providerName === void 0) { providerName = mongodb_stitch_core_sdk_1.FacebookAuthProvider.DEFAULT_NAME; }
        if (providerType === void 0) { providerType = mongodb_stitch_core_sdk_1.FacebookAuthProvider.TYPE; }
        this.redirectUrl = redirectUrl;
        this.providerName = providerName;
        this.providerType = providerType;
    }
    return FacebookRedirectCredential;
}());
exports.default = FacebookRedirectCredential;

},{"mongodb-stitch-core-sdk":89}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var GoogleRedirectCredential = (function () {
    function GoogleRedirectCredential(redirectUrl, providerName, providerType) {
        if (providerName === void 0) { providerName = mongodb_stitch_core_sdk_1.GoogleAuthProvider.DEFAULT_NAME; }
        if (providerType === void 0) { providerType = mongodb_stitch_core_sdk_1.GoogleAuthProvider.TYPE; }
        this.redirectUrl = redirectUrl;
        this.providerName = providerName;
        this.providerType = providerType;
    }
    return GoogleRedirectCredential;
}());
exports.default = GoogleRedirectCredential;

},{"mongodb-stitch-core-sdk":89}],20:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserApiKeyAuthProviderClientImpl_1 = __importDefault(require("./internal/UserApiKeyAuthProviderClientImpl"));
var UserApiKeyAuthProviderClient;
(function (UserApiKeyAuthProviderClient) {
    UserApiKeyAuthProviderClient.factory = new (function () {
        function class_1() {
        }
        class_1.prototype.getClient = function (authRequestClient, requestClient, routes) {
            return new UserApiKeyAuthProviderClientImpl_1.default(authRequestClient, routes);
        };
        return class_1;
    }())();
})(UserApiKeyAuthProviderClient = exports.UserApiKeyAuthProviderClient || (exports.UserApiKeyAuthProviderClient = {}));

},{"./internal/UserApiKeyAuthProviderClientImpl":21}],21:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var UserApiKeyAuthProviderClientImpl = (function (_super) {
    __extends(UserApiKeyAuthProviderClientImpl, _super);
    function UserApiKeyAuthProviderClientImpl(requestClient, routes) {
        return _super.call(this, requestClient, routes) || this;
    }
    UserApiKeyAuthProviderClientImpl.prototype.createApiKey = function (name) {
        return _super.prototype.createApiKey.call(this, name);
    };
    UserApiKeyAuthProviderClientImpl.prototype.fetchApiKey = function (keyId) {
        return _super.prototype.fetchApiKey.call(this, keyId);
    };
    UserApiKeyAuthProviderClientImpl.prototype.fetchApiKeys = function () {
        return _super.prototype.fetchApiKeys.call(this);
    };
    UserApiKeyAuthProviderClientImpl.prototype.deleteApiKey = function (keyId) {
        return _super.prototype.deleteApiKey.call(this, keyId);
    };
    UserApiKeyAuthProviderClientImpl.prototype.enableApiKey = function (keyId) {
        return _super.prototype.enableApiKey.call(this, keyId);
    };
    UserApiKeyAuthProviderClientImpl.prototype.disableApiKey = function (keyId) {
        return _super.prototype.disableApiKey.call(this, keyId);
    };
    return UserApiKeyAuthProviderClientImpl;
}(mongodb_stitch_core_sdk_1.CoreUserApiKeyAuthProviderClient));
exports.default = UserApiKeyAuthProviderClientImpl;

},{"mongodb-stitch-core-sdk":89}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserPasswordAuthProviderClientImpl_1 = __importDefault(require("./internal/UserPasswordAuthProviderClientImpl"));
var UserPasswordAuthProviderClient;
(function (UserPasswordAuthProviderClient) {
    UserPasswordAuthProviderClient.factory = new (function () {
        function class_1() {
        }
        class_1.prototype.getClient = function (authRequestClient, requestClient, routes) {
            return new UserPasswordAuthProviderClientImpl_1.default(requestClient, routes);
        };
        return class_1;
    }())();
})(UserPasswordAuthProviderClient = exports.UserPasswordAuthProviderClient || (exports.UserPasswordAuthProviderClient = {}));

},{"./internal/UserPasswordAuthProviderClientImpl":23}],23:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var UserPasswordAuthProviderClientImpl = (function (_super) {
    __extends(UserPasswordAuthProviderClientImpl, _super);
    function UserPasswordAuthProviderClientImpl(requestClient, routes) {
        return _super.call(this, mongodb_stitch_core_sdk_1.UserPasswordAuthProvider.DEFAULT_NAME, requestClient, routes) || this;
    }
    UserPasswordAuthProviderClientImpl.prototype.registerWithEmail = function (email, password) {
        return _super.prototype.registerWithEmailInternal.call(this, email, password);
    };
    UserPasswordAuthProviderClientImpl.prototype.confirmUser = function (token, tokenId) {
        return _super.prototype.confirmUserInternal.call(this, token, tokenId);
    };
    UserPasswordAuthProviderClientImpl.prototype.resendConfirmationEmail = function (email) {
        return _super.prototype.resendConfirmationEmailInternal.call(this, email);
    };
    UserPasswordAuthProviderClientImpl.prototype.resetPassword = function (token, tokenId, password) {
        return _super.prototype.resetPasswordInternal.call(this, token, tokenId, password);
    };
    UserPasswordAuthProviderClientImpl.prototype.sendResetPasswordEmail = function (email) {
        return _super.prototype.sendResetPasswordEmailInternal.call(this, email);
    };
    UserPasswordAuthProviderClientImpl.prototype.callResetPasswordFunction = function (email, password, args) {
        return _super.prototype.callResetPasswordFunctionInternal.call(this, email, password, args);
    };
    return UserPasswordAuthProviderClientImpl;
}(mongodb_stitch_core_sdk_1.CoreUserPassAuthProviderClient));
exports.default = UserPasswordAuthProviderClientImpl;

},{"mongodb-stitch-core-sdk":89}],24:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var StitchServiceClientImpl_1 = __importDefault(require("../../services/internal/StitchServiceClientImpl"));
var StitchAuthImpl_1 = __importDefault(require("../auth/internal/StitchAuthImpl"));
var StitchBrowserAppRoutes_1 = __importDefault(require("../auth/internal/StitchBrowserAppRoutes"));
var StitchAppClientImpl = (function () {
    function StitchAppClientImpl(clientAppId, config) {
        this.info = new mongodb_stitch_core_sdk_1.StitchAppClientInfo(clientAppId, config.dataDirectory, config.localAppName, config.localAppVersion);
        this.routes = new StitchBrowserAppRoutes_1.default(this.info.clientAppId);
        var requestClient = new mongodb_stitch_core_sdk_1.StitchAppRequestClient(clientAppId, config.baseUrl, config.transport);
        this.auth = new StitchAuthImpl_1.default(requestClient, this.routes.authRoutes, config.storage, this.info);
        this.coreClient = new mongodb_stitch_core_sdk_1.CoreStitchAppClient(this.auth, this.routes);
        this.serviceClients = [];
        this.auth.addSynchronousAuthListener(this);
    }
    StitchAppClientImpl.prototype.getServiceClient = function (factory, serviceName) {
        if (isServiceClientFactory(factory)) {
            var serviceClient = new mongodb_stitch_core_sdk_1.CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, "");
            this.bindServiceClient(serviceClient);
            return factory.getClient(serviceClient, this.info);
        }
        else {
            var serviceClient = new mongodb_stitch_core_sdk_1.CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, serviceName);
            this.bindServiceClient(serviceClient);
            return factory.getNamedClient(serviceClient, this.info);
        }
    };
    StitchAppClientImpl.prototype.getGeneralServiceClient = function (serviceName) {
        var serviceClient = new mongodb_stitch_core_sdk_1.CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, serviceName);
        this.bindServiceClient(serviceClient);
        return new StitchServiceClientImpl_1.default(serviceClient);
    };
    StitchAppClientImpl.prototype.callFunction = function (name, args) {
        return this.coreClient.callFunction(name, args);
    };
    StitchAppClientImpl.prototype.onActiveUserChanged = function (_, currentActiveUser, previousActiveUser) {
        this.onRebindEvent(new mongodb_stitch_core_sdk_1.AuthRebindEvent({
            currentActiveUser: currentActiveUser,
            kind: mongodb_stitch_core_sdk_1.AuthEventKind.ActiveUserChanged,
            previousActiveUser: previousActiveUser
        }));
    };
    StitchAppClientImpl.prototype.bindServiceClient = function (coreStitchServiceClient) {
        this.serviceClients.push(coreStitchServiceClient);
    };
    StitchAppClientImpl.prototype.onRebindEvent = function (rebindEvent) {
        this.serviceClients.forEach(function (serviceClient) {
            serviceClient.onRebindEvent(rebindEvent);
        });
    };
    return StitchAppClientImpl;
}());
exports.default = StitchAppClientImpl;
function isServiceClientFactory(factory) {
    return factory.getClient !== undefined;
}

},{"../../services/internal/StitchServiceClientImpl":31,"../auth/internal/StitchAuthImpl":12,"../auth/internal/StitchBrowserAppRoutes":14,"mongodb-stitch-core-sdk":89}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stitchPrefixKey = "__stitch.client";
var LocalStorage = (function () {
    function LocalStorage(suiteName) {
        this.suiteName = suiteName;
    }
    LocalStorage.prototype.get = function (key) {
        return localStorage.getItem(this.getKey(key));
    };
    LocalStorage.prototype.set = function (key, value) {
        localStorage.setItem(this.getKey(key), value);
    };
    LocalStorage.prototype.remove = function (key) {
        localStorage.removeItem(this.getKey(key));
    };
    LocalStorage.prototype.getKey = function (forKey) {
        return stitchPrefixKey + "." + this.suiteName + "." + forKey;
    };
    return LocalStorage;
}());
exports.default = LocalStorage;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version = "4.9.0";
exports.default = version;


},{}],27:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var whatwg_fetch_1 = require("whatwg-fetch");
var BrowserFetchTransport_1 = __importDefault(require("./BrowserFetchTransport"));
var EventSourceEventStream_1 = __importDefault(require("./EventSourceEventStream"));
var BrowserFetchStreamTransport = (function (_super) {
    __extends(BrowserFetchStreamTransport, _super);
    function BrowserFetchStreamTransport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserFetchStreamTransport.prototype.stream = function (request, open, retryRequest) {
        if (open === void 0) { open = true; }
        var reqHeaders = __assign({}, request.headers);
        reqHeaders[mongodb_stitch_core_sdk_1.Headers.ACCEPT] = mongodb_stitch_core_sdk_1.ContentTypes.TEXT_EVENT_STREAM;
        reqHeaders[mongodb_stitch_core_sdk_1.Headers.CONTENT_TYPE] = mongodb_stitch_core_sdk_1.ContentTypes.TEXT_EVENT_STREAM;
        return whatwg_fetch_1.fetch(request.url + "&stitch_validate=true", {
            body: request.body,
            headers: reqHeaders,
            method: request.method,
            mode: 'cors'
        }).then(function (response) {
            var respHeaders = {};
            response.headers.forEach(function (value, key) {
                respHeaders[key] = value;
            });
            if (response.status < 200 || response.status >= 300) {
                return response.text()
                    .then(function (body) { return mongodb_stitch_core_sdk_1.handleRequestError(new mongodb_stitch_core_sdk_1.Response(respHeaders, response.status, body)); });
            }
            return new Promise(function (resolve, reject) {
                return new EventSourceEventStream_1.default(new EventSource(request.url), function (stream) { return resolve(stream); }, function (error) { return reject(error); }, retryRequest ?
                    function () { return retryRequest().then(function (es) { return es; }); }
                    : undefined);
            });
        });
    };
    return BrowserFetchStreamTransport;
}(BrowserFetchTransport_1.default));
exports.default = BrowserFetchStreamTransport;

},{"./BrowserFetchTransport":28,"./EventSourceEventStream":29,"mongodb-stitch-core-sdk":89,"whatwg-fetch":126}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var whatwg_fetch_1 = require("whatwg-fetch");
var BrowserFetchTransport = (function () {
    function BrowserFetchTransport() {
    }
    BrowserFetchTransport.prototype.roundTrip = function (request) {
        var responsePromise = whatwg_fetch_1.fetch(request.url, {
            body: request.body,
            headers: request.headers,
            method: request.method,
            mode: 'cors'
        });
        var responseTextPromise = responsePromise.then(function (response) {
            return response.text();
        });
        return Promise.all([responsePromise, responseTextPromise]).then(function (values) {
            var response = values[0];
            var body = values[1];
            var headers = {};
            response.headers.forEach(function (value, key) {
                headers[key] = value;
            });
            return new mongodb_stitch_core_sdk_1.Response(headers, response.status, body);
        });
    };
    BrowserFetchTransport.prototype.stream = function (request, open, retryRequest) {
        if (open === void 0) { open = true; }
        throw new mongodb_stitch_core_sdk_1.StitchClientError(mongodb_stitch_core_sdk_1.StitchClientErrorCode.StreamingNotSupported);
    };
    return BrowserFetchTransport;
}());
exports.default = BrowserFetchTransport;

},{"mongodb-stitch-core-sdk":89,"whatwg-fetch":126}],29:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var EventSourceEventStream = (function (_super) {
    __extends(EventSourceEventStream, _super);
    function EventSourceEventStream(evtSrc, onOpen, onOpenError, reconnecter) {
        var _this = _super.call(this, reconnecter) || this;
        _this.evtSrc = evtSrc;
        _this.onOpenError = onOpenError;
        _this.openedOnce = false;
        _this.evtSrc.onopen = function (e) {
            onOpen(_this);
            _this.openedOnce = true;
        };
        _this.reset();
        return _this;
    }
    EventSourceEventStream.prototype.open = function () {
        if (this.closed) {
            throw new mongodb_stitch_core_sdk_1.StitchClientError(mongodb_stitch_core_sdk_1.StitchClientErrorCode.StreamClosed);
        }
    };
    EventSourceEventStream.prototype.afterClose = function () {
        this.evtSrc.close();
    };
    EventSourceEventStream.prototype.onReconnect = function (next) {
        this.evtSrc = next.evtSrc;
        this.reset();
        this.events = next.events.concat(this.events);
    };
    EventSourceEventStream.prototype.reset = function () {
        var _this = this;
        this.evtSrc.onmessage = function (e) {
            _this.events.push(new mongodb_stitch_core_sdk_1.Event(mongodb_stitch_core_sdk_1.Event.MESSAGE_EVENT, e.data));
            _this.poll();
        };
        this.evtSrc.onerror = function (e) {
            if (e instanceof MessageEvent) {
                _this.lastErr = e.data;
                _this.events.push(new mongodb_stitch_core_sdk_1.Event(mongodb_stitch_core_sdk_1.StitchEvent.ERROR_EVENT_NAME, _this.lastErr));
                _this.close();
                _this.poll();
                return;
            }
            if (!_this.openedOnce) {
                _this.close();
                _this.onOpenError(new Error("event source failed to open and will not reconnect; check network log for more details"));
                return;
            }
            _this.evtSrc.close();
            _this.reconnect();
        };
    };
    return EventSourceEventStream;
}(mongodb_stitch_core_sdk_1.BaseEventStream));
exports.default = EventSourceEventStream;

},{"mongodb-stitch-core-sdk":89}],30:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
exports.AnonymousAuthProvider = mongodb_stitch_core_sdk_1.AnonymousAuthProvider;
exports.AnonymousCredential = mongodb_stitch_core_sdk_1.AnonymousCredential;
exports.BSON = mongodb_stitch_core_sdk_1.BSON;
exports.CustomAuthProvider = mongodb_stitch_core_sdk_1.CustomAuthProvider;
exports.CustomCredential = mongodb_stitch_core_sdk_1.CustomCredential;
exports.FacebookAuthProvider = mongodb_stitch_core_sdk_1.FacebookAuthProvider;
exports.FacebookCredential = mongodb_stitch_core_sdk_1.FacebookCredential;
exports.FunctionAuthProvider = mongodb_stitch_core_sdk_1.FunctionAuthProvider;
exports.FunctionCredential = mongodb_stitch_core_sdk_1.FunctionCredential;
exports.GoogleAuthProvider = mongodb_stitch_core_sdk_1.GoogleAuthProvider;
exports.GoogleCredential = mongodb_stitch_core_sdk_1.GoogleCredential;
exports.MemoryStorage = mongodb_stitch_core_sdk_1.MemoryStorage;
exports.ServerApiKeyAuthProvider = mongodb_stitch_core_sdk_1.ServerApiKeyAuthProvider;
exports.ServerApiKeyCredential = mongodb_stitch_core_sdk_1.ServerApiKeyCredential;
exports.StitchAppClientConfiguration = mongodb_stitch_core_sdk_1.StitchAppClientConfiguration;
exports.StitchAppClientInfo = mongodb_stitch_core_sdk_1.StitchAppClientInfo;
exports.StitchClientError = mongodb_stitch_core_sdk_1.StitchClientError;
exports.StitchClientErrorCode = mongodb_stitch_core_sdk_1.StitchClientErrorCode;
exports.StitchRequestError = mongodb_stitch_core_sdk_1.StitchRequestError;
exports.StitchRequestErrorCode = mongodb_stitch_core_sdk_1.StitchRequestErrorCode;
exports.StitchServiceError = mongodb_stitch_core_sdk_1.StitchServiceError;
exports.StitchServiceErrorCode = mongodb_stitch_core_sdk_1.StitchServiceErrorCode;
exports.StitchUserIdentity = mongodb_stitch_core_sdk_1.StitchUserIdentity;
exports.Stream = mongodb_stitch_core_sdk_1.Stream;
exports.UserApiKey = mongodb_stitch_core_sdk_1.UserApiKey;
exports.UserApiKeyAuthProvider = mongodb_stitch_core_sdk_1.UserApiKeyAuthProvider;
exports.UserApiKeyCredential = mongodb_stitch_core_sdk_1.UserApiKeyCredential;
exports.UserPasswordAuthProvider = mongodb_stitch_core_sdk_1.UserPasswordAuthProvider;
exports.UserPasswordCredential = mongodb_stitch_core_sdk_1.UserPasswordCredential;
exports.UserType = mongodb_stitch_core_sdk_1.UserType;
var FacebookRedirectCredential_1 = __importDefault(require("./core/auth/providers/facebook/FacebookRedirectCredential"));
exports.FacebookRedirectCredential = FacebookRedirectCredential_1.default;
var GoogleRedirectCredential_1 = __importDefault(require("./core/auth/providers/google/GoogleRedirectCredential"));
exports.GoogleRedirectCredential = GoogleRedirectCredential_1.default;
var UserApiKeyAuthProviderClient_1 = require("./core/auth/providers/userapikey/UserApiKeyAuthProviderClient");
exports.UserApiKeyAuthProviderClient = UserApiKeyAuthProviderClient_1.UserApiKeyAuthProviderClient;
var UserPasswordAuthProviderClient_1 = require("./core/auth/providers/userpassword/UserPasswordAuthProviderClient");
exports.UserPasswordAuthProviderClient = UserPasswordAuthProviderClient_1.UserPasswordAuthProviderClient;
var BrowserFetchTransport_1 = __importDefault(require("./core/internal/net/BrowserFetchTransport"));
exports.BrowserFetchTransport = BrowserFetchTransport_1.default;
var Stitch_1 = __importDefault(require("./core/Stitch"));
exports.Stitch = Stitch_1.default;

},{"./core/Stitch":9,"./core/auth/providers/facebook/FacebookRedirectCredential":18,"./core/auth/providers/google/GoogleRedirectCredential":19,"./core/auth/providers/userapikey/UserApiKeyAuthProviderClient":20,"./core/auth/providers/userpassword/UserPasswordAuthProviderClient":22,"./core/internal/net/BrowserFetchTransport":28,"mongodb-stitch-core-sdk":89}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchServiceClientImpl = (function () {
    function StitchServiceClientImpl(proxy) {
        this.proxy = proxy;
    }
    StitchServiceClientImpl.prototype.callFunction = function (name, args, codec) {
        return this.proxy.callFunction(name, args, codec);
    };
    StitchServiceClientImpl.prototype.streamFunction = function (name, args, codec) {
        return this.proxy.streamFunction(name, args, codec);
    };
    return StitchServiceClientImpl;
}());
exports.default = StitchServiceClientImpl;

},{}],32:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("mongodb-stitch-browser-core"));
__export(require("mongodb-stitch-browser-services-mongodb-remote"));

},{"mongodb-stitch-browser-core":30,"mongodb-stitch-browser-services-mongodb-remote":36}],33:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_services_mongodb_remote_1 = require("mongodb-stitch-core-services-mongodb-remote");
var RemoteMongoClientImpl_1 = __importDefault(require("./internal/RemoteMongoClientImpl"));
var RemoteMongoClient;
(function (RemoteMongoClient) {
    RemoteMongoClient.factory = new (function () {
        function class_1() {
        }
        class_1.prototype.getNamedClient = function (service, client) {
            return new RemoteMongoClientImpl_1.default(new mongodb_stitch_core_services_mongodb_remote_1.CoreRemoteMongoClientImpl(service));
        };
        return class_1;
    }())();
})(RemoteMongoClient = exports.RemoteMongoClient || (exports.RemoteMongoClient = {}));

},{"./internal/RemoteMongoClientImpl":37,"mongodb-stitch-core-services-mongodb-remote":120}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteMongoCursor = (function () {
    function RemoteMongoCursor(proxy) {
        this.proxy = proxy;
    }
    RemoteMongoCursor.prototype.next = function () {
        return Promise.resolve(this.proxy.next().value);
    };
    return RemoteMongoCursor;
}());
exports.default = RemoteMongoCursor;

},{}],35:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteMongoCursor_1 = __importDefault(require("./RemoteMongoCursor"));
var RemoteMongoReadOperation = (function () {
    function RemoteMongoReadOperation(proxy) {
        this.proxy = proxy;
    }
    RemoteMongoReadOperation.prototype.first = function () {
        return this.proxy.first();
    };
    RemoteMongoReadOperation.prototype.toArray = function () {
        return this.proxy.toArray();
    };
    RemoteMongoReadOperation.prototype.asArray = function () {
        return this.toArray();
    };
    RemoteMongoReadOperation.prototype.iterator = function () {
        return this.proxy.iterator().then(function (res) { return new RemoteMongoCursor_1.default(res); });
    };
    return RemoteMongoReadOperation;
}());
exports.default = RemoteMongoReadOperation;

},{"./RemoteMongoCursor":34}],36:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_services_mongodb_remote_1 = require("mongodb-stitch-core-services-mongodb-remote");
exports.RemoteInsertManyResult = mongodb_stitch_core_services_mongodb_remote_1.RemoteInsertManyResult;
var RemoteMongoClient_1 = require("./RemoteMongoClient");
exports.RemoteMongoClient = RemoteMongoClient_1.RemoteMongoClient;
var RemoteMongoReadOperation_1 = __importDefault(require("./RemoteMongoReadOperation"));
exports.RemoteMongoReadOperation = RemoteMongoReadOperation_1.default;

},{"./RemoteMongoClient":33,"./RemoteMongoReadOperation":35,"mongodb-stitch-core-services-mongodb-remote":120}],37:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteMongoDatabaseImpl_1 = __importDefault(require("./RemoteMongoDatabaseImpl"));
var RemoteMongoClientImpl = (function () {
    function RemoteMongoClientImpl(proxy) {
        this.proxy = proxy;
    }
    RemoteMongoClientImpl.prototype.db = function (name) {
        return new RemoteMongoDatabaseImpl_1.default(this.proxy.db(name));
    };
    return RemoteMongoClientImpl;
}());
exports.default = RemoteMongoClientImpl;

},{"./RemoteMongoDatabaseImpl":39}],38:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteMongoReadOperation_1 = __importDefault(require("../RemoteMongoReadOperation"));
var RemoteMongoCollectionImpl = (function () {
    function RemoteMongoCollectionImpl(proxy) {
        this.proxy = proxy;
        this.namespace = this.proxy.namespace;
    }
    RemoteMongoCollectionImpl.prototype.withCollectionType = function (codec) {
        return new RemoteMongoCollectionImpl(this.proxy.withCollectionType(codec));
    };
    RemoteMongoCollectionImpl.prototype.count = function (query, options) {
        return this.proxy.count(query, options);
    };
    RemoteMongoCollectionImpl.prototype.find = function (query, options) {
        return new RemoteMongoReadOperation_1.default(this.proxy.find(query, options));
    };
    RemoteMongoCollectionImpl.prototype.findOne = function (query, options) {
        return this.proxy.findOne(query, options);
    };
    RemoteMongoCollectionImpl.prototype.findOneAndUpdate = function (query, update, options) {
        return this.proxy.findOneAndUpdate(query, update, options);
    };
    RemoteMongoCollectionImpl.prototype.findOneAndReplace = function (query, replacement, options) {
        return this.proxy.findOneAndReplace(query, replacement, options);
    };
    RemoteMongoCollectionImpl.prototype.findOneAndDelete = function (query, options) {
        return this.proxy.findOneAndDelete(query, options);
    };
    RemoteMongoCollectionImpl.prototype.aggregate = function (pipeline) {
        return new RemoteMongoReadOperation_1.default(this.proxy.aggregate(pipeline));
    };
    RemoteMongoCollectionImpl.prototype.insertOne = function (doc) {
        return this.proxy.insertOne(doc);
    };
    RemoteMongoCollectionImpl.prototype.insertMany = function (docs) {
        return this.proxy.insertMany(docs);
    };
    RemoteMongoCollectionImpl.prototype.deleteOne = function (query) {
        return this.proxy.deleteOne(query);
    };
    RemoteMongoCollectionImpl.prototype.deleteMany = function (query) {
        return this.proxy.deleteMany(query);
    };
    RemoteMongoCollectionImpl.prototype.updateOne = function (query, update, updateOptions) {
        return this.proxy.updateOne(query, update, updateOptions);
    };
    RemoteMongoCollectionImpl.prototype.updateMany = function (query, update, updateOptions) {
        return this.proxy.updateMany(query, update, updateOptions);
    };
    RemoteMongoCollectionImpl.prototype.watch = function (arg) {
        return this.proxy.watch(arg);
    };
    RemoteMongoCollectionImpl.prototype.watchCompact = function (ids) {
        return this.proxy.watchCompact(ids);
    };
    return RemoteMongoCollectionImpl;
}());
exports.default = RemoteMongoCollectionImpl;

},{"../RemoteMongoReadOperation":35}],39:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteMongoCollectionImpl_1 = __importDefault(require("./RemoteMongoCollectionImpl"));
var RemoteMongoDatabaseImpl = (function () {
    function RemoteMongoDatabaseImpl(proxy) {
        this.proxy = proxy;
        this.name = this.proxy.name;
    }
    RemoteMongoDatabaseImpl.prototype.collection = function (name, codec) {
        return new RemoteMongoCollectionImpl_1.default(this.proxy.collection(name, codec));
    };
    return RemoteMongoDatabaseImpl;
}());
exports.default = RemoteMongoDatabaseImpl;

},{"./RemoteMongoCollectionImpl":38}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StitchClientConfiguration_1 = require("./StitchClientConfiguration");
var StitchAppClientConfiguration = (function (_super) {
    __extends(StitchAppClientConfiguration, _super);
    function StitchAppClientConfiguration(config, localAppName, localAppVersion) {
        var _this = _super.call(this, config.baseUrl, config.storage, config.dataDirectory, config.transport) || this;
        _this.localAppVersion = localAppVersion;
        _this.localAppName = localAppName;
        return _this;
    }
    StitchAppClientConfiguration.prototype.builder = function () {
        return new StitchAppClientConfiguration.Builder(this);
    };
    return StitchAppClientConfiguration;
}(StitchClientConfiguration_1.StitchClientConfiguration));
exports.StitchAppClientConfiguration = StitchAppClientConfiguration;
(function (StitchAppClientConfiguration) {
    var Builder = (function (_super) {
        __extends(Builder, _super);
        function Builder(config) {
            var _this = _super.call(this, config) || this;
            if (config) {
                _this.localAppVersion = config.localAppVersion;
                _this.localAppName = config.localAppName;
            }
            return _this;
        }
        Builder.prototype.withLocalAppName = function (localAppName) {
            this.localAppName = localAppName;
            return this;
        };
        Builder.prototype.withLocalAppVersion = function (localAppVersion) {
            this.localAppVersion = localAppVersion;
            return this;
        };
        Builder.prototype.build = function () {
            var config = _super.prototype.build.call(this);
            return new StitchAppClientConfiguration(config, this.localAppName, this.localAppVersion);
        };
        return Builder;
    }(StitchClientConfiguration_1.StitchClientConfiguration.Builder));
    StitchAppClientConfiguration.Builder = Builder;
})(StitchAppClientConfiguration = exports.StitchAppClientConfiguration || (exports.StitchAppClientConfiguration = {}));
exports.StitchAppClientConfiguration = StitchAppClientConfiguration;

},{"./StitchClientConfiguration":42}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchAppClientInfo = (function () {
    function StitchAppClientInfo(clientAppId, dataDirectory, localAppName, localAppVersion) {
        this.clientAppId = clientAppId;
        this.dataDirectory = dataDirectory;
        this.localAppName = localAppName;
        this.localAppVersion = localAppVersion;
    }
    return StitchAppClientInfo;
}());
exports.default = StitchAppClientInfo;

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchClientConfiguration = (function () {
    function StitchClientConfiguration(baseUrl, storage, dataDirectory, transport) {
        this.baseUrl = baseUrl;
        this.storage = storage;
        this.dataDirectory = dataDirectory;
        this.transport = transport;
    }
    StitchClientConfiguration.prototype.builder = function () {
        return new StitchClientConfiguration.Builder(this);
    };
    return StitchClientConfiguration;
}());
exports.StitchClientConfiguration = StitchClientConfiguration;
(function (StitchClientConfiguration) {
    var Builder = (function () {
        function Builder(config) {
            if (config) {
                this.baseUrl = config.baseUrl;
                this.storage = config.storage;
                this.dataDirectory = config.dataDirectory;
                this.transport = config.transport;
            }
        }
        Builder.prototype.withBaseUrl = function (baseUrl) {
            this.baseUrl = baseUrl;
            return this;
        };
        Builder.prototype.withStorage = function (storage) {
            this.storage = storage;
            return this;
        };
        Builder.prototype.withDataDirectory = function (dataDirectory) {
            this.dataDirectory = dataDirectory;
            return this;
        };
        Builder.prototype.withTransport = function (transport) {
            this.transport = transport;
            return this;
        };
        Builder.prototype.build = function () {
            return new StitchClientConfiguration(this.baseUrl, this.storage, this.dataDirectory, this.transport);
        };
        return Builder;
    }());
    StitchClientConfiguration.Builder = Builder;
})(StitchClientConfiguration = exports.StitchClientConfiguration || (exports.StitchClientConfiguration = {}));
exports.StitchClientConfiguration = StitchClientConfiguration;

},{}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchClientErrorCode_1 = require("./StitchClientErrorCode");
var StitchError_1 = __importDefault(require("./StitchError"));
var StitchClientError = (function (_super) {
    __extends(StitchClientError, _super);
    function StitchClientError(errorCode) {
        var _this = this;
        var message = "(" + StitchClientErrorCode_1.StitchClientErrorCode[errorCode] + "): " + StitchClientErrorCode_1.clientErrorCodeDescs[errorCode];
        _this = _super.call(this, message) || this;
        _this.errorCode = errorCode;
        _this.errorCodeName = StitchClientErrorCode_1.StitchClientErrorCode[errorCode];
        return _this;
    }
    return StitchClientError;
}(StitchError_1.default));
exports.default = StitchClientError;

},{"./StitchClientErrorCode":44,"./StitchError":45}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var StitchClientErrorCode;
(function (StitchClientErrorCode) {
    StitchClientErrorCode[StitchClientErrorCode["LoggedOutDuringRequest"] = 0] = "LoggedOutDuringRequest";
    StitchClientErrorCode[StitchClientErrorCode["MustAuthenticateFirst"] = 1] = "MustAuthenticateFirst";
    StitchClientErrorCode[StitchClientErrorCode["UserNoLongerValid"] = 2] = "UserNoLongerValid";
    StitchClientErrorCode[StitchClientErrorCode["UserNotFound"] = 3] = "UserNotFound";
    StitchClientErrorCode[StitchClientErrorCode["UserNotLoggedIn"] = 4] = "UserNotLoggedIn";
    StitchClientErrorCode[StitchClientErrorCode["CouldNotLoadPersistedAuthInfo"] = 5] = "CouldNotLoadPersistedAuthInfo";
    StitchClientErrorCode[StitchClientErrorCode["CouldNotPersistAuthInfo"] = 6] = "CouldNotPersistAuthInfo";
    StitchClientErrorCode[StitchClientErrorCode["StreamingNotSupported"] = 7] = "StreamingNotSupported";
    StitchClientErrorCode[StitchClientErrorCode["StreamClosed"] = 8] = "StreamClosed";
    StitchClientErrorCode[StitchClientErrorCode["UnexpectedArguments"] = 9] = "UnexpectedArguments";
})(StitchClientErrorCode = exports.StitchClientErrorCode || (exports.StitchClientErrorCode = {}));
exports.clientErrorCodeDescs = (_a = {},
    _a[StitchClientErrorCode.LoggedOutDuringRequest] = "logged out while making a request to Stitch",
    _a[StitchClientErrorCode.MustAuthenticateFirst] = "method called requires being authenticated",
    _a[StitchClientErrorCode.UserNoLongerValid] = "user instance being accessed is no longer valid; please get a new user with auth.getUser()",
    _a[StitchClientErrorCode.UserNotFound] = "user not found in list of users",
    _a[StitchClientErrorCode.UserNotLoggedIn] = "cannot make the active user a logged out user; please use loginWithCredential() to switch to this user",
    _a[StitchClientErrorCode.CouldNotLoadPersistedAuthInfo] = "failed to load stored auth information for Stitch",
    _a[StitchClientErrorCode.CouldNotPersistAuthInfo] = "failed to save auth information for Stitch",
    _a[StitchClientErrorCode.StreamingNotSupported] = "streaming not supported in this SDK",
    _a[StitchClientErrorCode.StreamClosed] = "stream is closed",
    _a[StitchClientErrorCode.UnexpectedArguments] = "function does not accept arguments",
    _a);

},{}],45:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _Error = function (message) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this);
    }
    this.message = message;
    this.name = this.constructor.name;
};
_Error.prototype = Object.create(Error.prototype);
var StitchError = (function (_super) {
    __extends(StitchError, _super);
    function StitchError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StitchError;
}(_Error));
exports.default = StitchError;

},{}],46:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchError_1 = __importDefault(require("./StitchError"));
var StitchRequestErrorCode_1 = require("./StitchRequestErrorCode");
var StitchRequestError = (function (_super) {
    __extends(StitchRequestError, _super);
    function StitchRequestError(underlyingError, errorCode) {
        var _this = this;
        var message = "(" + StitchRequestErrorCode_1.StitchRequestErrorCode[errorCode] + "): " + StitchRequestErrorCode_1.requestErrorCodeDescs[errorCode] + ": " + underlyingError.message;
        _this = _super.call(this, message) || this;
        _this.underlyingError = underlyingError;
        _this.errorCode = errorCode;
        _this.errorCodeName = StitchRequestErrorCode_1.StitchRequestErrorCode[errorCode];
        return _this;
    }
    return StitchRequestError;
}(StitchError_1.default));
exports.default = StitchRequestError;

},{"./StitchError":45,"./StitchRequestErrorCode":47}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var StitchRequestErrorCode;
(function (StitchRequestErrorCode) {
    StitchRequestErrorCode[StitchRequestErrorCode["TRANSPORT_ERROR"] = 0] = "TRANSPORT_ERROR";
    StitchRequestErrorCode[StitchRequestErrorCode["DECODING_ERROR"] = 1] = "DECODING_ERROR";
    StitchRequestErrorCode[StitchRequestErrorCode["ENCODING_ERROR"] = 2] = "ENCODING_ERROR";
})(StitchRequestErrorCode = exports.StitchRequestErrorCode || (exports.StitchRequestErrorCode = {}));
exports.requestErrorCodeDescs = (_a = {},
    _a[StitchRequestErrorCode.TRANSPORT_ERROR] = "the request transport encountered an error communicating with Stitch",
    _a[StitchRequestErrorCode.DECODING_ERROR] = "an error occurred while decoding a response from Stitch",
    _a[StitchRequestErrorCode.ENCODING_ERROR] = "an error occurred while encoding a request for Stitch",
    _a);

},{}],48:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchError_1 = __importDefault(require("./StitchError"));
var StitchServiceErrorCode_1 = require("./StitchServiceErrorCode");
var StitchServiceError = (function (_super) {
    __extends(StitchServiceError, _super);
    function StitchServiceError(message, errorCode) {
        if (errorCode === void 0) { errorCode = StitchServiceErrorCode_1.StitchServiceErrorCode.Unknown; }
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.errorCode = errorCode;
        _this.errorCodeName = StitchServiceErrorCode_1.StitchServiceErrorCode[errorCode];
        return _this;
    }
    return StitchServiceError;
}(StitchError_1.default));
exports.default = StitchServiceError;

},{"./StitchError":45,"./StitchServiceErrorCode":49}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchServiceErrorCode;
(function (StitchServiceErrorCode) {
    StitchServiceErrorCode[StitchServiceErrorCode["MissingAuthReq"] = 0] = "MissingAuthReq";
    StitchServiceErrorCode[StitchServiceErrorCode["InvalidSession"] = 1] = "InvalidSession";
    StitchServiceErrorCode[StitchServiceErrorCode["UserAppDomainMismatch"] = 2] = "UserAppDomainMismatch";
    StitchServiceErrorCode[StitchServiceErrorCode["DomainNotAllowed"] = 3] = "DomainNotAllowed";
    StitchServiceErrorCode[StitchServiceErrorCode["ReadSizeLimitExceeded"] = 4] = "ReadSizeLimitExceeded";
    StitchServiceErrorCode[StitchServiceErrorCode["InvalidParameter"] = 5] = "InvalidParameter";
    StitchServiceErrorCode[StitchServiceErrorCode["MissingParameter"] = 6] = "MissingParameter";
    StitchServiceErrorCode[StitchServiceErrorCode["TwilioError"] = 7] = "TwilioError";
    StitchServiceErrorCode[StitchServiceErrorCode["GCMError"] = 8] = "GCMError";
    StitchServiceErrorCode[StitchServiceErrorCode["HTTPError"] = 9] = "HTTPError";
    StitchServiceErrorCode[StitchServiceErrorCode["AWSError"] = 10] = "AWSError";
    StitchServiceErrorCode[StitchServiceErrorCode["MongoDBError"] = 11] = "MongoDBError";
    StitchServiceErrorCode[StitchServiceErrorCode["ArgumentsNotAllowed"] = 12] = "ArgumentsNotAllowed";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionExecutionError"] = 13] = "FunctionExecutionError";
    StitchServiceErrorCode[StitchServiceErrorCode["NoMatchingRuleFound"] = 14] = "NoMatchingRuleFound";
    StitchServiceErrorCode[StitchServiceErrorCode["InternalServerError"] = 15] = "InternalServerError";
    StitchServiceErrorCode[StitchServiceErrorCode["AuthProviderNotFound"] = 16] = "AuthProviderNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["AuthProviderAlreadyExists"] = 17] = "AuthProviderAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["ServiceNotFound"] = 18] = "ServiceNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["ServiceTypeNotFound"] = 19] = "ServiceTypeNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["ServiceAlreadyExists"] = 20] = "ServiceAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["ServiceCommandNotFound"] = 21] = "ServiceCommandNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["ValueNotFound"] = 22] = "ValueNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["ValueAlreadyExists"] = 23] = "ValueAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["ValueDuplicateName"] = 24] = "ValueDuplicateName";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionNotFound"] = 25] = "FunctionNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionAlreadyExists"] = 26] = "FunctionAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionDuplicateName"] = 27] = "FunctionDuplicateName";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionSyntaxError"] = 28] = "FunctionSyntaxError";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionInvalid"] = 29] = "FunctionInvalid";
    StitchServiceErrorCode[StitchServiceErrorCode["IncomingWebhookNotFound"] = 30] = "IncomingWebhookNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["IncomingWebhookAlreadyExists"] = 31] = "IncomingWebhookAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["IncomingWebhookDuplicateName"] = 32] = "IncomingWebhookDuplicateName";
    StitchServiceErrorCode[StitchServiceErrorCode["RuleNotFound"] = 33] = "RuleNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["ApiKeyNotFound"] = 34] = "ApiKeyNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["RuleAlreadyExists"] = 35] = "RuleAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["RuleDuplicateName"] = 36] = "RuleDuplicateName";
    StitchServiceErrorCode[StitchServiceErrorCode["AuthProviderDuplicateName"] = 37] = "AuthProviderDuplicateName";
    StitchServiceErrorCode[StitchServiceErrorCode["RestrictedHost"] = 38] = "RestrictedHost";
    StitchServiceErrorCode[StitchServiceErrorCode["ApiKeyAlreadyExists"] = 39] = "ApiKeyAlreadyExists";
    StitchServiceErrorCode[StitchServiceErrorCode["IncomingWebhookAuthFailed"] = 40] = "IncomingWebhookAuthFailed";
    StitchServiceErrorCode[StitchServiceErrorCode["ExecutionTimeLimitExceeded"] = 41] = "ExecutionTimeLimitExceeded";
    StitchServiceErrorCode[StitchServiceErrorCode["FunctionNotCallable"] = 42] = "FunctionNotCallable";
    StitchServiceErrorCode[StitchServiceErrorCode["UserAlreadyConfirmed"] = 43] = "UserAlreadyConfirmed";
    StitchServiceErrorCode[StitchServiceErrorCode["UserNotFound"] = 44] = "UserNotFound";
    StitchServiceErrorCode[StitchServiceErrorCode["UserDisabled"] = 45] = "UserDisabled";
    StitchServiceErrorCode[StitchServiceErrorCode["Unknown"] = 46] = "Unknown";
})(StitchServiceErrorCode = exports.StitchServiceErrorCode || (exports.StitchServiceErrorCode = {}));
var apiErrorCodes = {
    APIKeyAlreadyExists: StitchServiceErrorCode.ApiKeyAlreadyExists,
    APIKeyNotFound: StitchServiceErrorCode.ApiKeyNotFound,
    AWSError: StitchServiceErrorCode.AWSError,
    ArgumentsNotAllowed: StitchServiceErrorCode.ArgumentsNotAllowed,
    AuthProviderAlreadyExists: StitchServiceErrorCode.AuthProviderAlreadyExists,
    AuthProviderDuplicateName: StitchServiceErrorCode.AuthProviderDuplicateName,
    AuthProviderNotFound: StitchServiceErrorCode.AuthProviderNotFound,
    DomainNotAllowed: StitchServiceErrorCode.DomainNotAllowed,
    ExecutionTimeLimitExceeded: StitchServiceErrorCode.ExecutionTimeLimitExceeded,
    FunctionAlreadyExists: StitchServiceErrorCode.FunctionAlreadyExists,
    FunctionDuplicateName: StitchServiceErrorCode.FunctionDuplicateName,
    FunctionExecutionError: StitchServiceErrorCode.FunctionExecutionError,
    FunctionInvalid: StitchServiceErrorCode.FunctionInvalid,
    FunctionNotCallable: StitchServiceErrorCode.FunctionNotCallable,
    FunctionNotFound: StitchServiceErrorCode.FunctionNotFound,
    FunctionSyntaxError: StitchServiceErrorCode.FunctionSyntaxError,
    GCMError: StitchServiceErrorCode.GCMError,
    HTTPError: StitchServiceErrorCode.HTTPError,
    IncomingWebhookAlreadyExists: StitchServiceErrorCode.IncomingWebhookAlreadyExists,
    IncomingWebhookAuthFailed: StitchServiceErrorCode.IncomingWebhookAuthFailed,
    IncomingWebhookDuplicateName: StitchServiceErrorCode.IncomingWebhookDuplicateName,
    IncomingWebhookNotFound: StitchServiceErrorCode.IncomingWebhookNotFound,
    InternalServerError: StitchServiceErrorCode.InternalServerError,
    InvalidParameter: StitchServiceErrorCode.InvalidParameter,
    InvalidSession: StitchServiceErrorCode.InvalidSession,
    MissingAuthReq: StitchServiceErrorCode.MissingAuthReq,
    MissingParameter: StitchServiceErrorCode.MissingParameter,
    MongoDBError: StitchServiceErrorCode.MongoDBError,
    NoMatchingRuleFound: StitchServiceErrorCode.NoMatchingRuleFound,
    ReadSizeLimitExceeded: StitchServiceErrorCode.ReadSizeLimitExceeded,
    RestrictedHost: StitchServiceErrorCode.RestrictedHost,
    RuleAlreadyExists: StitchServiceErrorCode.RuleAlreadyExists,
    RuleDuplicateName: StitchServiceErrorCode.RuleDuplicateName,
    RuleNotFound: StitchServiceErrorCode.RuleNotFound,
    ServiceAlreadyExists: StitchServiceErrorCode.ServiceAlreadyExists,
    ServiceCommandNotFound: StitchServiceErrorCode.ServiceCommandNotFound,
    ServiceNotFound: StitchServiceErrorCode.ServiceNotFound,
    ServiceTypeNotFound: StitchServiceErrorCode.ServiceTypeNotFound,
    TwilioError: StitchServiceErrorCode.TwilioError,
    UserAlreadyConfirmed: StitchServiceErrorCode.UserAlreadyConfirmed,
    UserAppDomainMismatch: StitchServiceErrorCode.UserAppDomainMismatch,
    UserDisabled: StitchServiceErrorCode.UserDisabled,
    UserNotFound: StitchServiceErrorCode.UserNotFound,
    ValueAlreadyExists: StitchServiceErrorCode.ValueAlreadyExists,
    ValueDuplicateName: StitchServiceErrorCode.ValueDuplicateName,
    ValueNotFound: StitchServiceErrorCode.ValueNotFound
};
function stitchServiceErrorCodeFromApi(code) {
    if (!(code in apiErrorCodes)) {
        return StitchServiceErrorCode.Unknown;
    }
    return apiErrorCodes[code];
}
exports.stitchServiceErrorCodeFromApi = stitchServiceErrorCodeFromApi;

},{}],50:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __importDefault(require("./internal/net/Event"));
var StitchEvent_1 = __importDefault(require("./internal/net/StitchEvent"));
var Stream = (function () {
    function Stream(eventStream, decoder) {
        this.eventStream = eventStream;
        this.decoder = decoder;
        this.listeners = [];
    }
    Stream.prototype.next = function () {
        var _this = this;
        return this.eventStream.nextEvent()
            .then(function (event) {
            var se = StitchEvent_1.default.fromEvent(event, _this.decoder);
            if (se.eventName === StitchEvent_1.default.ERROR_EVENT_NAME) {
                throw se.error;
            }
            if (se.eventName === Event_1.default.MESSAGE_EVENT) {
                return se.data;
            }
            return _this.next();
        });
    };
    Stream.prototype.onNext = function (callback) {
        var _this = this;
        var wrapper = {
            onEvent: function (e) {
                var se = StitchEvent_1.default.fromEvent(e, _this.decoder);
                if (se.eventName !== Event_1.default.MESSAGE_EVENT) {
                    return;
                }
                callback(se.data);
            }
        };
        this.eventStream.addListener(wrapper);
    };
    Stream.prototype.onError = function (callback) {
        var _this = this;
        var wrapper = {
            onEvent: function (e) {
                var se = StitchEvent_1.default.fromEvent(e, _this.decoder);
                if (se.eventName === StitchEvent_1.default.ERROR_EVENT_NAME) {
                    callback(se.error);
                }
            }
        };
        this.eventStream.addListener(wrapper);
    };
    Stream.prototype.addListener = function (listener) {
        var _this = this;
        var wrapper = {
            onEvent: function (e) {
                var se = StitchEvent_1.default.fromEvent(e, _this.decoder);
                if (se.eventName === StitchEvent_1.default.ERROR_EVENT_NAME) {
                    if (listener.onError) {
                        listener.onError(se.error);
                    }
                }
                else {
                    if (listener.onNext) {
                        listener.onNext(se.data);
                    }
                }
            }
        };
        this.listeners.push([listener, wrapper]);
        this.eventStream.addListener(wrapper);
    };
    Stream.prototype.removeListener = function (listener) {
        var index = -1;
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i][0] === listener) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            return;
        }
        var wrapper = this.listeners[index][1];
        this.listeners.splice(index, 1);
        this.eventStream.removeListener(wrapper);
    };
    Stream.prototype.isOpen = function () {
        return this.eventStream.isOpen();
    };
    Stream.prototype.close = function () {
        this.eventStream.close();
    };
    return Stream;
}());
exports.default = Stream;

},{"./internal/net/Event":100,"./internal/net/StitchEvent":110}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities = (function () {
    function ProviderCapabilities(reusesExistingSession) {
        if (reusesExistingSession === void 0) { reusesExistingSession = false; }
        this.reusesExistingSession = reusesExistingSession;
    }
    return ProviderCapabilities;
}());
exports.default = ProviderCapabilities;

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserIdentity = (function () {
    function StitchUserIdentity(id, providerType) {
        this.id = id;
        this.providerType = providerType;
    }
    return StitchUserIdentity;
}());
exports.default = StitchUserIdentity;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserType;
(function (UserType) {
    UserType["Normal"] = "normal";
    UserType["Server"] = "server";
    UserType["Unknown"] = "unknown";
})(UserType || (UserType = {}));
exports.default = UserType;

},{}],54:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var JWT_1 = __importDefault(require("./JWT"));
var SLEEP_MILLIS = 60000;
var EXPIRATION_WINDOW_SECS = 300;
var AccessTokenRefresher = (function () {
    function AccessTokenRefresher(auth) {
        this.auth = auth;
    }
    AccessTokenRefresher.prototype.shouldRefresh = function () {
        var auth = this.auth;
        if (auth === undefined) {
            return false;
        }
        if (!auth.isLoggedIn) {
            return false;
        }
        var info = auth.authInfo;
        if (info === undefined) {
            return false;
        }
        if (!info.isLoggedIn) {
            return false;
        }
        var jwt;
        try {
            jwt = JWT_1.default.fromEncoded(info.accessToken);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        if (Date.now() / 1000 < jwt.expires - EXPIRATION_WINDOW_SECS) {
            return false;
        }
        return true;
    };
    AccessTokenRefresher.prototype.run = function () {
        var _this = this;
        if (!this.shouldRefresh()) {
            this.nextTimeout = setTimeout(function () { return _this.run(); }, SLEEP_MILLIS);
        }
        else {
            this.auth.refreshAccessToken().then(function () {
                _this.nextTimeout = setTimeout(function () { return _this.run(); }, SLEEP_MILLIS);
            }).catch(function () {
                _this.nextTimeout = setTimeout(function () { return _this.run(); }, SLEEP_MILLIS);
            });
        }
    };
    AccessTokenRefresher.prototype.stop = function () {
        clearTimeout(this.nextTimeout);
    };
    return AccessTokenRefresher;
}());
exports.default = AccessTokenRefresher;

},{"./JWT":60}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthEventKind;
(function (AuthEventKind) {
    AuthEventKind[AuthEventKind["ActiveUserChanged"] = 0] = "ActiveUserChanged";
    AuthEventKind[AuthEventKind["ListenerRegistered"] = 1] = "ListenerRegistered";
    AuthEventKind[AuthEventKind["UserAdded"] = 2] = "UserAdded";
    AuthEventKind[AuthEventKind["UserLinked"] = 3] = "UserLinked";
    AuthEventKind[AuthEventKind["UserLoggedIn"] = 4] = "UserLoggedIn";
    AuthEventKind[AuthEventKind["UserLoggedOut"] = 5] = "UserLoggedOut";
    AuthEventKind[AuthEventKind["UserRemoved"] = 6] = "UserRemoved";
})(AuthEventKind = exports.AuthEventKind || (exports.AuthEventKind = {}));

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthInfo = (function () {
    function AuthInfo(userId, deviceId, accessToken, refreshToken, loggedInProviderType, loggedInProviderName, lastAuthActivity, userProfile) {
        this.userId = userId;
        this.deviceId = deviceId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.loggedInProviderType = loggedInProviderType;
        this.loggedInProviderName = loggedInProviderName;
        this.lastAuthActivity = lastAuthActivity;
        this.userProfile = userProfile;
    }
    AuthInfo.empty = function () {
        return new AuthInfo(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };
    Object.defineProperty(AuthInfo.prototype, "hasUser", {
        get: function () {
            return this.userId !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthInfo.prototype, "isEmpty", {
        get: function () {
            return this.deviceId === undefined;
        },
        enumerable: true,
        configurable: true
    });
    AuthInfo.prototype.loggedOut = function () {
        return new AuthInfo(this.userId, this.deviceId, undefined, undefined, this.loggedInProviderType, this.loggedInProviderName, new Date(), this.userProfile);
    };
    AuthInfo.prototype.withClearedUser = function () {
        return new AuthInfo(undefined, this.deviceId, undefined, undefined, undefined, undefined, undefined, undefined);
    };
    AuthInfo.prototype.withAuthProvider = function (providerType, providerName) {
        return new AuthInfo(this.userId, this.deviceId, this.accessToken, this.refreshToken, providerType, providerName, new Date(), this.userProfile);
    };
    AuthInfo.prototype.withNewAuthActivityTime = function () {
        return new AuthInfo(this.userId, this.deviceId, this.accessToken, this.refreshToken, this.loggedInProviderType, this.loggedInProviderName, new Date(), this.userProfile);
    };
    Object.defineProperty(AuthInfo.prototype, "isLoggedIn", {
        get: function () {
            return this.accessToken !== undefined && this.refreshToken !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    AuthInfo.prototype.merge = function (newInfo) {
        return new AuthInfo(newInfo.userId === undefined ? this.userId : newInfo.userId, newInfo.deviceId === undefined ? this.deviceId : newInfo.deviceId, newInfo.accessToken === undefined
            ? this.accessToken
            : newInfo.accessToken, newInfo.refreshToken === undefined
            ? this.refreshToken
            : newInfo.refreshToken, newInfo.loggedInProviderType === undefined
            ? this.loggedInProviderType
            : newInfo.loggedInProviderType, newInfo.loggedInProviderName === undefined
            ? this.loggedInProviderName
            : newInfo.loggedInProviderName, newInfo.lastAuthActivity === undefined
            ? this.lastAuthActivity
            : newInfo.lastAuthActivity, newInfo.userProfile === undefined
            ? this.userProfile
            : newInfo.userProfile);
    };
    return AuthInfo;
}());
exports.default = AuthInfo;

},{}],57:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var StitchErrorUtils_1 = require("../../internal/common/StitchErrorUtils");
var Headers_1 = __importDefault(require("../../internal/net/Headers"));
var Method_1 = __importDefault(require("../../internal/net/Method"));
var StitchAuthDocRequest_1 = require("../../internal/net/StitchAuthDocRequest");
var StitchAuthRequest_1 = require("../../internal/net/StitchAuthRequest");
var StitchDocRequest_1 = require("../../internal/net/StitchDocRequest");
var StitchClientError_1 = __importDefault(require("../../StitchClientError"));
var StitchClientErrorCode_1 = require("../../StitchClientErrorCode");
var StitchError_1 = __importDefault(require("../../StitchError"));
var StitchRequestError_1 = __importDefault(require("../../StitchRequestError"));
var StitchRequestErrorCode_1 = require("../../StitchRequestErrorCode");
var StitchServiceError_1 = __importDefault(require("../../StitchServiceError"));
var StitchServiceErrorCode_1 = require("../../StitchServiceErrorCode");
var Stream_1 = __importDefault(require("../../Stream"));
var CoreStitchUserImpl_1 = __importDefault(require("../internal/CoreStitchUserImpl"));
var AnonymousAuthProvider_1 = __importDefault(require("../providers/anonymous/AnonymousAuthProvider"));
var StitchAuthResponseCredential_1 = __importDefault(require("../providers/internal/StitchAuthResponseCredential"));
var AccessTokenRefresher_1 = __importDefault(require("./AccessTokenRefresher"));
var AuthEvent_1 = require("./AuthEvent");
var AuthInfo_1 = __importDefault(require("./AuthInfo"));
var JWT_1 = __importDefault(require("./JWT"));
var ApiAuthInfo_1 = __importDefault(require("./models/ApiAuthInfo"));
var ApiCoreUserProfile_1 = __importDefault(require("./models/ApiCoreUserProfile"));
var StoreAuthInfo_1 = require("./models/StoreAuthInfo");
var OPTIONS = "options";
var DEVICE = "device";
var CoreStitchAuth = (function () {
    function CoreStitchAuth(requestClient, authRoutes, storage, useTokenRefresher) {
        if (useTokenRefresher === void 0) { useTokenRefresher = true; }
        this.requestClient = requestClient;
        this.authRoutes = authRoutes;
        this.storage = storage;
        var allUsersAuthInfo;
        try {
            allUsersAuthInfo = StoreAuthInfo_1.readCurrentUsersFromStorage(storage);
        }
        catch (e) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotLoadPersistedAuthInfo);
        }
        this.allUsersAuthInfo = allUsersAuthInfo;
        var activeUserAuthInfo;
        try {
            activeUserAuthInfo = StoreAuthInfo_1.readActiveUserFromStorage(storage);
        }
        catch (e) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotLoadPersistedAuthInfo);
        }
        this.activeUserAuthInfo =
            activeUserAuthInfo === undefined ? AuthInfo_1.default.empty() : activeUserAuthInfo;
        if (this.activeUserAuthInfo.hasUser) {
            this.currentUser = this.prepUser(this.activeUserAuthInfo);
        }
        if (useTokenRefresher) {
            this.accessTokenRefresher = new AccessTokenRefresher_1.default(this);
            this.accessTokenRefresher.run();
        }
    }
    Object.defineProperty(CoreStitchAuth.prototype, "authInfo", {
        get: function () {
            return this.activeUserAuthInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreStitchAuth.prototype, "isLoggedIn", {
        get: function () {
            return this.currentUser !== undefined && this.currentUser.isLoggedIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreStitchAuth.prototype, "user", {
        get: function () {
            return this.currentUser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreStitchAuth.prototype, "hasDeviceId", {
        get: function () {
            return (this.activeUserAuthInfo.deviceId !== undefined &&
                this.activeUserAuthInfo.deviceId !== "" &&
                this.activeUserAuthInfo.deviceId !== "000000000000000000000000");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreStitchAuth.prototype, "deviceId", {
        get: function () {
            if (!this.hasDeviceId) {
                return undefined;
            }
            return this.activeUserAuthInfo.deviceId;
        },
        enumerable: true,
        configurable: true
    });
    CoreStitchAuth.prototype.listUsers = function () {
        var _this = this;
        var list = [];
        this.allUsersAuthInfo.forEach(function (authInfo) {
            list.push(_this.prepUser(authInfo));
        });
        return list;
    };
    CoreStitchAuth.prototype.doAuthenticatedRequest = function (stitchReq, authInfo) {
        var _this = this;
        try {
            return this.requestClient
                .doRequest(this.prepareAuthRequest(stitchReq, authInfo || this.activeUserAuthInfo))
                .catch(function (err) {
                return _this.handleAuthFailure(err, stitchReq);
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    CoreStitchAuth.prototype.doAuthenticatedRequestWithDecoder = function (stitchReq, decoder) {
        return this.doAuthenticatedRequest(stitchReq)
            .then(function (response) {
            var obj = bson_1.EJSON.parse(response.body, { strict: false });
            if (decoder) {
                return decoder.decode(obj);
            }
            return obj;
        })
            .catch(function (err) {
            throw StitchErrorUtils_1.wrapDecodingError(err);
        });
    };
    CoreStitchAuth.prototype.openAuthenticatedEventStream = function (stitchReq, open) {
        var _this = this;
        if (open === void 0) { open = true; }
        if (!this.isLoggedIn) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.MustAuthenticateFirst);
        }
        var authToken = stitchReq.useRefreshToken ?
            this.activeUserAuthInfo.refreshToken : this.activeUserAuthInfo.accessToken;
        return this.requestClient.doStreamRequest(stitchReq.builder
            .withPath(stitchReq.path + "&stitch_at=" + authToken)
            .build(), open, function () { return _this.openAuthenticatedEventStream(stitchReq, false); })
            .catch(function (err) {
            return _this.handleAuthFailureForEventStream(err, stitchReq, open);
        });
    };
    CoreStitchAuth.prototype.openAuthenticatedStreamWithDecoder = function (stitchReq, decoder) {
        return this.openAuthenticatedEventStream(stitchReq)
            .then(function (eventStream) {
            return new Stream_1.default(eventStream, decoder);
        });
    };
    CoreStitchAuth.prototype.refreshAccessToken = function () {
        var _this = this;
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder()
            .withRefreshToken()
            .withPath(this.authRoutes.sessionRoute)
            .withMethod(Method_1.default.POST);
        return this.doAuthenticatedRequest(reqBuilder.build()).then(function (response) {
            try {
                var partialInfo = ApiAuthInfo_1.default.fromJSON(JSON.parse(response.body));
                _this.activeUserAuthInfo = _this.activeUserAuthInfo.merge(partialInfo);
                if (partialInfo.accessToken && _this.user instanceof CoreStitchUserImpl_1.default) {
                    var userData = JWT_1.default.fromEncoded(partialInfo.accessToken).userData;
                    _this.user.customData = userData === undefined ? {} : userData;
                }
            }
            catch (err) {
                throw new StitchRequestError_1.default(err, StitchRequestErrorCode_1.StitchRequestErrorCode.DECODING_ERROR);
            }
            try {
                StoreAuthInfo_1.writeActiveUserAuthInfoToStorage(_this.activeUserAuthInfo, _this.storage);
                _this.allUsersAuthInfo.set(_this.activeUserAuthInfo.userId, _this.activeUserAuthInfo);
                StoreAuthInfo_1.writeAllUsersAuthInfoToStorage(_this.allUsersAuthInfo, _this.storage);
            }
            catch (err) {
                throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotPersistAuthInfo);
            }
        });
    };
    CoreStitchAuth.prototype.switchToUserWithId = function (userId) {
        var authInfo = this.allUsersAuthInfo.get(userId);
        if (authInfo === undefined) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNotFound);
        }
        if (!authInfo.isLoggedIn) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNotLoggedIn);
        }
        if (this.activeUserAuthInfo.hasUser) {
            this.allUsersAuthInfo.set(this.activeUserAuthInfo.userId, this.activeUserAuthInfo.withNewAuthActivityTime());
        }
        var newAuthInfo = authInfo.withNewAuthActivityTime();
        this.allUsersAuthInfo.set(userId, newAuthInfo);
        StoreAuthInfo_1.writeActiveUserAuthInfoToStorage(newAuthInfo, this.storage);
        this.activeUserAuthInfo = newAuthInfo;
        var previousUser = this.currentUser;
        this.currentUser = this.prepUser(newAuthInfo);
        this.onAuthEvent();
        this.dispatchAuthEvent({
            currentActiveUser: this.currentUser,
            kind: AuthEvent_1.AuthEventKind.ActiveUserChanged,
            previousActiveUser: previousUser
        });
        return this.currentUser;
    };
    CoreStitchAuth.prototype.loginWithCredentialInternal = function (credential) {
        var _this = this;
        var e_1, _a;
        if (credential instanceof StitchAuthResponseCredential_1.default) {
            return this.processLogin(credential, credential.authInfo, credential.asLink).then(function (user) {
                _this.dispatchAuthEvent({
                    kind: AuthEvent_1.AuthEventKind.UserLoggedIn,
                    loggedInUser: user
                });
                return user;
            });
        }
        if (credential.providerCapabilities.reusesExistingSession) {
            try {
                for (var _b = __values(this.allUsersAuthInfo), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), userId = _d[0], authInfo = _d[1];
                    if (authInfo.loggedInProviderType === credential.providerType) {
                        if (authInfo.isLoggedIn) {
                            try {
                                return Promise.resolve(this.switchToUserWithId(userId));
                            }
                            catch (error) {
                                return Promise.reject(error);
                            }
                        }
                        if (authInfo.userId !== undefined) {
                            this.removeUserWithIdInternal(authInfo.userId);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return this.doLogin(credential, false);
    };
    CoreStitchAuth.prototype.linkUserWithCredentialInternal = function (user, credential) {
        if (this.currentUser !== undefined && user.id !== this.currentUser.id) {
            return Promise.reject(new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNoLongerValid));
        }
        return this.doLogin(credential, true);
    };
    CoreStitchAuth.prototype.logoutInternal = function () {
        if (!this.isLoggedIn || !this.currentUser) {
            return Promise.resolve();
        }
        return this.logoutUserWithIdInternal(this.currentUser.id);
    };
    CoreStitchAuth.prototype.logoutUserWithIdInternal = function (userId) {
        var _this = this;
        var authInfo = this.allUsersAuthInfo.get(userId);
        if (authInfo === undefined) {
            return Promise.reject(new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNotFound));
        }
        if (!authInfo.isLoggedIn) {
            return Promise.resolve();
        }
        var clearAuthBlock = function () {
            _this.clearUserAuthTokens(authInfo.userId);
            if (authInfo.loggedInProviderType === AnonymousAuthProvider_1.default.TYPE) {
                _this.removeUserWithIdInternal(authInfo.userId);
            }
        };
        return this.doLogout(authInfo)
            .then(function () {
            clearAuthBlock();
        })
            .catch(function () {
            clearAuthBlock();
        });
    };
    CoreStitchAuth.prototype.removeUserInternal = function () {
        if (!this.isLoggedIn || this.currentUser === undefined) {
            return Promise.resolve();
        }
        return this.removeUserWithIdInternal(this.currentUser.id);
    };
    CoreStitchAuth.prototype.removeUserWithIdInternal = function (userId) {
        var _this = this;
        var authInfo = this.allUsersAuthInfo.get(userId);
        if (authInfo === undefined) {
            return Promise.reject(new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNotFound));
        }
        var removeBlock = function () {
            _this.clearUserAuthTokens(authInfo.userId);
            _this.allUsersAuthInfo.delete(userId);
            StoreAuthInfo_1.writeAllUsersAuthInfoToStorage(_this.allUsersAuthInfo, _this.storage);
            var removedUser = _this.prepUser(authInfo.loggedOut());
            _this.onAuthEvent();
            _this.dispatchAuthEvent({
                kind: AuthEvent_1.AuthEventKind.UserRemoved,
                removedUser: removedUser
            });
        };
        if (authInfo.isLoggedIn) {
            return this.doLogout(authInfo).then(function () {
                removeBlock();
            }).catch(function (err) {
                removeBlock();
            });
        }
        removeBlock();
        return Promise.resolve();
    };
    CoreStitchAuth.prototype.close = function () {
        if (this.accessTokenRefresher) {
            this.accessTokenRefresher.stop();
        }
    };
    CoreStitchAuth.prototype.prepareAuthRequest = function (stitchReq, authInfo) {
        if (!authInfo.isLoggedIn) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.MustAuthenticateFirst);
        }
        var newReq = stitchReq.builder;
        var newHeaders = newReq.headers || {};
        if (stitchReq.useRefreshToken) {
            newHeaders[Headers_1.default.AUTHORIZATION] = Headers_1.default.getAuthorizationBearer(authInfo.refreshToken);
        }
        else {
            newHeaders[Headers_1.default.AUTHORIZATION] = Headers_1.default.getAuthorizationBearer(authInfo.accessToken);
        }
        newReq.withHeaders(newHeaders);
        return newReq.build();
    };
    CoreStitchAuth.prototype.handleAuthFailureForEventStream = function (ex, req, open) {
        var _this = this;
        if (open === void 0) { open = true; }
        if (!(ex instanceof StitchServiceError_1.default) ||
            ex.errorCode !== StitchServiceErrorCode_1.StitchServiceErrorCode.InvalidSession) {
            throw ex;
        }
        if (req.useRefreshToken || !req.shouldRefreshOnFailure) {
            this.clearActiveUserAuth();
            throw ex;
        }
        return this.tryRefreshAccessToken(req.startedAt).then(function () {
            return _this.openAuthenticatedEventStream(req.builder.withShouldRefreshOnFailure(false).build(), open);
        });
    };
    CoreStitchAuth.prototype.handleAuthFailure = function (ex, req) {
        var _this = this;
        if (!(ex instanceof StitchServiceError_1.default) ||
            ex.errorCode !== StitchServiceErrorCode_1.StitchServiceErrorCode.InvalidSession) {
            throw ex;
        }
        if (req.useRefreshToken || !req.shouldRefreshOnFailure) {
            this.clearActiveUserAuth();
            throw ex;
        }
        return this.tryRefreshAccessToken(req.startedAt).then(function () {
            return _this.doAuthenticatedRequest(req.builder.withShouldRefreshOnFailure(false).build());
        });
    };
    CoreStitchAuth.prototype.tryRefreshAccessToken = function (reqStartedAt) {
        if (!this.isLoggedIn) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.LoggedOutDuringRequest);
        }
        try {
            var jwt = JWT_1.default.fromEncoded(this.activeUserAuthInfo.accessToken);
            if (jwt.issuedAt >= reqStartedAt) {
                return Promise.resolve();
            }
        }
        catch (e) {
        }
        return this.refreshAccessToken();
    };
    CoreStitchAuth.prototype.prepUser = function (authInfo) {
        return this.userFactory.makeUser(authInfo.userId, authInfo.loggedInProviderType, authInfo.loggedInProviderName, authInfo.isLoggedIn, authInfo.lastAuthActivity, authInfo.userProfile);
    };
    CoreStitchAuth.prototype.attachAuthOptions = function (authBody) {
        var options = {};
        options[DEVICE] = this.deviceInfo;
        authBody[OPTIONS] = options;
    };
    CoreStitchAuth.prototype.doLogin = function (credential, asLinkRequest) {
        var _this = this;
        var previousActiveUser = this.currentUser;
        return this.doLoginRequest(credential, asLinkRequest)
            .then(function (response) { return _this.processLoginResponse(credential, response, asLinkRequest); })
            .then(function (user) {
            _this.onAuthEvent();
            if (asLinkRequest) {
                _this.dispatchAuthEvent({
                    kind: AuthEvent_1.AuthEventKind.UserLinked,
                    linkedUser: user
                });
            }
            else {
                _this.dispatchAuthEvent({
                    kind: AuthEvent_1.AuthEventKind.UserLoggedIn,
                    loggedInUser: user,
                });
                _this.dispatchAuthEvent({
                    currentActiveUser: user,
                    kind: AuthEvent_1.AuthEventKind.ActiveUserChanged,
                    previousActiveUser: previousActiveUser
                });
            }
            return user;
        });
    };
    CoreStitchAuth.prototype.doLoginRequest = function (credential, asLinkRequest) {
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder.withMethod(Method_1.default.POST);
        if (asLinkRequest) {
            reqBuilder.withPath(this.authRoutes.getAuthProviderLinkRoute(credential.providerName));
        }
        else {
            reqBuilder.withPath(this.authRoutes.getAuthProviderLoginRoute(credential.providerName));
        }
        var material = credential.material;
        this.attachAuthOptions(material);
        reqBuilder.withDocument(material);
        if (!asLinkRequest) {
            return this.requestClient.doRequest(reqBuilder.build());
        }
        var linkRequest = new StitchAuthDocRequest_1.StitchAuthDocRequest(reqBuilder.build(), reqBuilder.document);
        return this.doAuthenticatedRequest(linkRequest);
    };
    CoreStitchAuth.prototype.processLogin = function (credential, newAuthInfo, asLinkRequest) {
        var _this = this;
        var oldActiveUserInfo = this.activeUserAuthInfo;
        var oldActiveUser = this.currentUser;
        newAuthInfo = this.activeUserAuthInfo.merge(new AuthInfo_1.default(newAuthInfo.userId, newAuthInfo.deviceId, newAuthInfo.accessToken, newAuthInfo.refreshToken, credential.providerType, credential.providerName, undefined, undefined));
        this.activeUserAuthInfo = newAuthInfo;
        this.currentUser = this.userFactory.makeUser(this.activeUserAuthInfo.userId, credential.providerType, credential.providerName, this.activeUserAuthInfo.isLoggedIn, new Date(), undefined, JWT_1.default.fromEncoded(newAuthInfo.accessToken).userData);
        return this.doGetUserProfile()
            .then(function (profile) {
            if (oldActiveUserInfo.hasUser) {
                _this.allUsersAuthInfo.set(oldActiveUserInfo.userId, oldActiveUserInfo.withNewAuthActivityTime());
            }
            newAuthInfo = newAuthInfo.merge(new AuthInfo_1.default(newAuthInfo.userId, newAuthInfo.deviceId, newAuthInfo.accessToken, newAuthInfo.refreshToken, credential.providerType, credential.providerName, new Date(), profile));
            var newUserAdded = !_this.allUsersAuthInfo.has(newAuthInfo.userId);
            try {
                StoreAuthInfo_1.writeActiveUserAuthInfoToStorage(newAuthInfo, _this.storage);
                _this.allUsersAuthInfo.set(newAuthInfo.userId, newAuthInfo);
                StoreAuthInfo_1.writeAllUsersAuthInfoToStorage(_this.allUsersAuthInfo, _this.storage);
            }
            catch (err) {
                _this.activeUserAuthInfo = oldActiveUserInfo;
                _this.currentUser = oldActiveUser;
                if (newAuthInfo.userId !== oldActiveUserInfo.userId && newAuthInfo.userId) {
                    _this.allUsersAuthInfo.delete(newAuthInfo.userId);
                }
                throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotPersistAuthInfo);
            }
            _this.activeUserAuthInfo = newAuthInfo;
            _this.currentUser = _this.userFactory.makeUser(_this.activeUserAuthInfo.userId, credential.providerType, credential.providerName, _this.activeUserAuthInfo.isLoggedIn, _this.activeUserAuthInfo.lastAuthActivity, profile, JWT_1.default.fromEncoded(newAuthInfo.accessToken).userData);
            if (newUserAdded) {
                _this.onAuthEvent();
                _this.dispatchAuthEvent({
                    addedUser: _this.currentUser,
                    kind: AuthEvent_1.AuthEventKind.UserAdded
                });
            }
            return _this.currentUser;
        })
            .catch(function (err) {
            if (err instanceof StitchClientError_1.default) {
                throw err;
            }
            if (asLinkRequest || oldActiveUserInfo.hasUser) {
                var linkedAuthInfo = _this.activeUserAuthInfo;
                _this.activeUserAuthInfo = oldActiveUserInfo;
                _this.currentUser = oldActiveUser;
                if (asLinkRequest) {
                    _this.activeUserAuthInfo = _this.activeUserAuthInfo.withAuthProvider(linkedAuthInfo.loggedInProviderType, linkedAuthInfo.loggedInProviderName);
                }
            }
            else {
                _this.clearActiveUserAuth();
            }
            throw err;
        });
    };
    CoreStitchAuth.prototype.processLoginResponse = function (credential, response, asLinkRequest) {
        try {
            if (!response) {
                throw new StitchServiceError_1.default("the login response could not be processed for credential: " + credential + ";" +
                    "response was undefined");
            }
            if (!response.body) {
                throw new StitchServiceError_1.default("response with status code " + response.statusCode + " has empty body");
            }
            return this.processLogin(credential, ApiAuthInfo_1.default.fromJSON(JSON.parse(response.body)), asLinkRequest);
        }
        catch (err) {
            throw new StitchRequestError_1.default(err, StitchRequestErrorCode_1.StitchRequestErrorCode.DECODING_ERROR);
        }
    };
    CoreStitchAuth.prototype.doGetUserProfile = function () {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder.withMethod(Method_1.default.GET).withPath(this.authRoutes.profileRoute);
        return this.doAuthenticatedRequest(reqBuilder.build())
            .then(function (response) { return ApiCoreUserProfile_1.default.fromJSON(JSON.parse(response.body)); })
            .catch(function (err) {
            if (err instanceof StitchError_1.default) {
                throw err;
            }
            else {
                throw new StitchRequestError_1.default(err, StitchRequestErrorCode_1.StitchRequestErrorCode.DECODING_ERROR);
            }
        });
    };
    CoreStitchAuth.prototype.doLogout = function (authInfo) {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withRefreshToken()
            .withPath(this.authRoutes.sessionRoute)
            .withMethod(Method_1.default.DELETE);
        return this.doAuthenticatedRequest(reqBuilder.build(), authInfo).then(function () {
            return;
        });
    };
    CoreStitchAuth.prototype.clearActiveUserAuth = function () {
        if (!this.isLoggedIn) {
            return;
        }
        this.clearUserAuthTokens(this.activeUserAuthInfo.userId);
    };
    CoreStitchAuth.prototype.clearUserAuthTokens = function (userId) {
        var unclearedAuthInfo = this.allUsersAuthInfo.get(userId);
        if (unclearedAuthInfo === undefined) {
            if (this.activeUserAuthInfo.userId !== userId) {
                throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.UserNotFound);
            }
        }
        else if (!unclearedAuthInfo.isLoggedIn) {
            return;
        }
        try {
            var loggedOutUser = void 0;
            if (unclearedAuthInfo) {
                var loggedOutAuthInfo = unclearedAuthInfo.loggedOut();
                this.allUsersAuthInfo.set(userId, loggedOutAuthInfo);
                StoreAuthInfo_1.writeAllUsersAuthInfoToStorage(this.allUsersAuthInfo, this.storage);
                loggedOutUser = this.userFactory.makeUser(loggedOutAuthInfo.userId, loggedOutAuthInfo.loggedInProviderType, loggedOutAuthInfo.loggedInProviderName, loggedOutAuthInfo.isLoggedIn, loggedOutAuthInfo.lastAuthActivity, loggedOutAuthInfo.userProfile);
            }
            var wasActiveUser = false;
            if (this.activeUserAuthInfo.hasUser && this.activeUserAuthInfo.userId === userId) {
                wasActiveUser = true;
                this.activeUserAuthInfo = this.activeUserAuthInfo.withClearedUser();
                this.currentUser = undefined;
                StoreAuthInfo_1.writeActiveUserAuthInfoToStorage(this.activeUserAuthInfo, this.storage);
            }
            if (loggedOutUser) {
                this.onAuthEvent();
                this.dispatchAuthEvent({
                    kind: AuthEvent_1.AuthEventKind.UserLoggedOut,
                    loggedOutUser: loggedOutUser,
                });
                if (wasActiveUser) {
                    this.dispatchAuthEvent({
                        currentActiveUser: undefined,
                        kind: AuthEvent_1.AuthEventKind.ActiveUserChanged,
                        previousActiveUser: loggedOutUser
                    });
                }
            }
        }
        catch (err) {
            throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotPersistAuthInfo);
        }
    };
    return CoreStitchAuth;
}());
exports.default = CoreStitchAuth;

},{"../../StitchClientError":43,"../../StitchClientErrorCode":44,"../../StitchError":45,"../../StitchRequestError":46,"../../StitchRequestErrorCode":47,"../../StitchServiceError":48,"../../StitchServiceErrorCode":49,"../../Stream":50,"../../internal/common/StitchErrorUtils":93,"../../internal/net/Headers":101,"../../internal/net/Method":102,"../../internal/net/StitchAuthDocRequest":107,"../../internal/net/StitchAuthRequest":108,"../../internal/net/StitchDocRequest":109,"../internal/CoreStitchUserImpl":58,"../providers/anonymous/AnonymousAuthProvider":68,"../providers/internal/StitchAuthResponseCredential":79,"./AccessTokenRefresher":54,"./AuthEvent":55,"./AuthInfo":56,"./JWT":60,"./models/ApiAuthInfo":62,"./models/ApiCoreUserProfile":63,"./models/StoreAuthInfo":65,"bson":5}],58:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserProfileImpl_1 = __importDefault(require("./StitchUserProfileImpl"));
var CoreStitchUserImpl = (function () {
    function CoreStitchUserImpl(id, loggedInProviderType, loggedInProviderName, isLoggedIn, lastAuthActivity, profile, customData) {
        this.id = id;
        this.loggedInProviderType = loggedInProviderType;
        this.loggedInProviderName = loggedInProviderName;
        this.profile =
            profile === undefined ? StitchUserProfileImpl_1.default.empty() : profile;
        this.isLoggedIn = isLoggedIn;
        this.lastAuthActivity = lastAuthActivity;
        this.customData = customData === undefined ? {} : customData;
    }
    Object.defineProperty(CoreStitchUserImpl.prototype, "userType", {
        get: function () {
            return this.profile.userType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreStitchUserImpl.prototype, "identities", {
        get: function () {
            return this.profile.identities;
        },
        enumerable: true,
        configurable: true
    });
    CoreStitchUserImpl.prototype.equals = function (other) {
        return this.id === other.id
            && JSON.stringify(this.identities) === JSON.stringify(other.identities)
            && this.isLoggedIn === other.isLoggedIn
            && this.loggedInProviderName === other.loggedInProviderName
            && this.loggedInProviderType === other.loggedInProviderType
            && JSON.stringify(this.profile) === JSON.stringify(other.profile);
    };
    return CoreStitchUserImpl;
}());
exports.default = CoreStitchUserImpl;

},{"./StitchUserProfileImpl":61}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeviceFields;
(function (DeviceFields) {
    DeviceFields["DEVICE_ID"] = "deviceId";
    DeviceFields["APP_ID"] = "appId";
    DeviceFields["APP_VERSION"] = "appVersion";
    DeviceFields["PLATFORM"] = "platform";
    DeviceFields["PLATFORM_VERSION"] = "platformVersion";
    DeviceFields["SDK_VERSION"] = "sdkVersion";
})(DeviceFields || (DeviceFields = {}));
exports.default = DeviceFields;

},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base64_1 = require("../../internal/common/Base64");
var EXPIRES = "exp";
var ISSUED_AT = "iat";
var USER_DATA = "user_data";
var JWT = (function () {
    function JWT(expires, issuedAt, userData) {
        this.expires = expires;
        this.issuedAt = issuedAt;
        this.userData = userData;
    }
    JWT.fromEncoded = function (encodedJWT) {
        var parts = JWT.splitToken(encodedJWT);
        var json = JSON.parse(Base64_1.base64Decode(parts[1]));
        var expires = json[EXPIRES];
        var iat = json[ISSUED_AT];
        var userData = json[USER_DATA];
        return new JWT(expires, iat, userData);
    };
    JWT.splitToken = function (jwt) {
        var parts = jwt.split(".");
        if (parts.length !== 3) {
            throw new Error("Malformed JWT token. The string " + jwt + " should have 3 parts.");
        }
        return parts;
    };
    return JWT;
}());
exports.default = JWT;

},{"../../internal/common/Base64":92}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NAME = "name";
var EMAIL = "email";
var PICTURE_URL = "picture";
var FIRST_NAME = "first_name";
var LAST_NAME = "last_name";
var GENDER = "gender";
var BIRTHDAY = "birthday";
var MIN_AGE = "min_age";
var MAX_AGE = "max_age";
var StitchUserProfileImpl = (function () {
    function StitchUserProfileImpl(userType, data, identities) {
        if (data === void 0) { data = {}; }
        if (identities === void 0) { identities = []; }
        this.userType = userType;
        this.data = data;
        this.identities = identities;
    }
    StitchUserProfileImpl.empty = function () {
        return new StitchUserProfileImpl();
    };
    Object.defineProperty(StitchUserProfileImpl.prototype, "name", {
        get: function () {
            return this.data[NAME];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "email", {
        get: function () {
            return this.data[EMAIL];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "pictureUrl", {
        get: function () {
            return this.data[PICTURE_URL];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "firstName", {
        get: function () {
            return this.data[FIRST_NAME];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "lastName", {
        get: function () {
            return this.data[LAST_NAME];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "gender", {
        get: function () {
            return this.data[GENDER];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "birthday", {
        get: function () {
            return this.data[BIRTHDAY];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "minAge", {
        get: function () {
            var age = this.data[MIN_AGE];
            if (age === undefined) {
                return undefined;
            }
            return age;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StitchUserProfileImpl.prototype, "maxAge", {
        get: function () {
            var age = this.data[MAX_AGE];
            if (age === undefined) {
                return undefined;
            }
            return age;
        },
        enumerable: true,
        configurable: true
    });
    return StitchUserProfileImpl;
}());
exports.default = StitchUserProfileImpl;

},{}],62:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AuthInfo_1 = __importDefault(require("../AuthInfo"));
var Fields;
(function (Fields) {
    Fields["USER_ID"] = "user_id";
    Fields["DEVICE_ID"] = "device_id";
    Fields["ACCESS_TOKEN"] = "access_token";
    Fields["REFRESH_TOKEN"] = "refresh_token";
})(Fields || (Fields = {}));
var ApiAuthInfo = (function (_super) {
    __extends(ApiAuthInfo, _super);
    function ApiAuthInfo(userId, deviceId, accessToken, refreshToken) {
        return _super.call(this, userId, deviceId, accessToken, refreshToken) || this;
    }
    ApiAuthInfo.fromJSON = function (json) {
        return new ApiAuthInfo(json[Fields.USER_ID], json[Fields.DEVICE_ID], json[Fields.ACCESS_TOKEN], json[Fields.REFRESH_TOKEN]);
    };
    ApiAuthInfo.prototype.toJSON = function () {
        var _a;
        return _a = {},
            _a[Fields.USER_ID] = this.userId,
            _a[Fields.DEVICE_ID] = this.deviceId,
            _a[Fields.ACCESS_TOKEN] = this.accessToken,
            _a[Fields.REFRESH_TOKEN] = this.refreshToken,
            _a;
    };
    return ApiAuthInfo;
}(AuthInfo_1.default));
exports.default = ApiAuthInfo;

},{"../AuthInfo":56}],63:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assertions_1 = __importDefault(require("../../../internal/common/Assertions"));
var StitchUserProfileImpl_1 = __importDefault(require("../StitchUserProfileImpl"));
var ApiStitchUserIdentity_1 = __importDefault(require("./ApiStitchUserIdentity"));
var Fields;
(function (Fields) {
    Fields["DATA"] = "data";
    Fields["USER_TYPE"] = "type";
    Fields["IDENTITIES"] = "identities";
})(Fields || (Fields = {}));
var ApiCoreUserProfile = (function (_super) {
    __extends(ApiCoreUserProfile, _super);
    function ApiCoreUserProfile(userType, data, identities) {
        return _super.call(this, userType, data, identities) || this;
    }
    ApiCoreUserProfile.fromJSON = function (json) {
        Assertions_1.default.keyPresent(Fields.USER_TYPE, json);
        Assertions_1.default.keyPresent(Fields.DATA, json);
        Assertions_1.default.keyPresent(Fields.IDENTITIES, json);
        return new ApiCoreUserProfile(json[Fields.USER_TYPE], json[Fields.DATA], json[Fields.IDENTITIES].map(ApiStitchUserIdentity_1.default.fromJSON));
    };
    ApiCoreUserProfile.prototype.toJSON = function () {
        var _a;
        return _a = {},
            _a[Fields.DATA] = this.data,
            _a[Fields.USER_TYPE] = this.userType,
            _a[Fields.IDENTITIES] = this.identities,
            _a;
    };
    return ApiCoreUserProfile;
}(StitchUserProfileImpl_1.default));
exports.default = ApiCoreUserProfile;

},{"../../../internal/common/Assertions":91,"../StitchUserProfileImpl":61,"./ApiStitchUserIdentity":64}],64:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserIdentity_1 = __importDefault(require("../../StitchUserIdentity"));
var Fields;
(function (Fields) {
    Fields["ID"] = "id";
    Fields["PROVIDER_TYPE"] = "provider_type";
})(Fields || (Fields = {}));
var ApiStitchUserIdentity = (function (_super) {
    __extends(ApiStitchUserIdentity, _super);
    function ApiStitchUserIdentity(id, providerType) {
        return _super.call(this, id, providerType) || this;
    }
    ApiStitchUserIdentity.fromJSON = function (json) {
        return new ApiStitchUserIdentity(json[Fields.ID], json[Fields.PROVIDER_TYPE]);
    };
    ApiStitchUserIdentity.prototype.toJSON = function () {
        var _a;
        return _a = {},
            _a[Fields.ID] = this.id,
            _a[Fields.PROVIDER_TYPE] = this.providerType,
            _a;
    };
    return ApiStitchUserIdentity;
}(StitchUserIdentity_1.default));
exports.default = ApiStitchUserIdentity;

},{"../../StitchUserIdentity":52}],65:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchClientError_1 = __importDefault(require("../../../StitchClientError"));
var StitchClientErrorCode_1 = require("../../../StitchClientErrorCode");
var AuthInfo_1 = __importDefault(require("../AuthInfo"));
var StoreCoreUserProfile_1 = __importDefault(require("./StoreCoreUserProfile"));
var StoreStitchUserIdentity_1 = __importDefault(require("./StoreStitchUserIdentity"));
var Fields;
(function (Fields) {
    Fields["USER_ID"] = "user_id";
    Fields["DEVICE_ID"] = "device_id";
    Fields["ACCESS_TOKEN"] = "access_token";
    Fields["REFRESH_TOKEN"] = "refresh_token";
    Fields["LAST_AUTH_ACTIVITY"] = "last_auth_activity";
    Fields["LOGGED_IN_PROVIDER_TYPE"] = "logged_in_provider_type";
    Fields["LOGGED_IN_PROVIDER_NAME"] = "logged_in_provider_name";
    Fields["USER_PROFILE"] = "user_profile";
})(Fields || (Fields = {}));
function readActiveUserFromStorage(storage) {
    var rawInfo = storage.get(StoreAuthInfo.ACTIVE_USER_STORAGE_NAME);
    if (!rawInfo) {
        return undefined;
    }
    return StoreAuthInfo.decode(JSON.parse(rawInfo));
}
exports.readActiveUserFromStorage = readActiveUserFromStorage;
function readCurrentUsersFromStorage(storage) {
    var rawInfo = storage.get(StoreAuthInfo.ALL_USERS_STORAGE_NAME);
    if (!rawInfo) {
        return new Map();
    }
    var rawArray = JSON.parse(rawInfo);
    if (!Array.isArray(rawArray)) {
        throw new StitchClientError_1.default(StitchClientErrorCode_1.StitchClientErrorCode.CouldNotLoadPersistedAuthInfo);
    }
    var userIdToAuthInfoMap = new Map();
    rawArray.forEach(function (rawEntry) {
        var authInfo = StoreAuthInfo.decode(rawEntry);
        userIdToAuthInfoMap.set(authInfo.userId, authInfo);
    });
    return userIdToAuthInfoMap;
}
exports.readCurrentUsersFromStorage = readCurrentUsersFromStorage;
function writeActiveUserAuthInfoToStorage(authInfo, storage) {
    if (authInfo.isEmpty) {
        storage.remove(StoreAuthInfo.ACTIVE_USER_STORAGE_NAME);
        return;
    }
    var info = new StoreAuthInfo(authInfo.userId, authInfo.deviceId, authInfo.accessToken, authInfo.refreshToken, authInfo.loggedInProviderType, authInfo.loggedInProviderName, authInfo.lastAuthActivity, authInfo.userProfile
        ? new StoreCoreUserProfile_1.default(authInfo.userProfile.userType, authInfo.userProfile.data, authInfo.userProfile.identities.map(function (identity) {
            return new StoreStitchUserIdentity_1.default(identity.id, identity.providerType);
        }))
        : undefined);
    storage.set(StoreAuthInfo.ACTIVE_USER_STORAGE_NAME, JSON.stringify(info.encode()));
}
exports.writeActiveUserAuthInfoToStorage = writeActiveUserAuthInfoToStorage;
function writeAllUsersAuthInfoToStorage(currentUsersAuthInfo, storage) {
    var encodedStoreInfos = [];
    currentUsersAuthInfo.forEach(function (authInfo, userId) {
        var storeInfo = new StoreAuthInfo(userId, authInfo.deviceId, authInfo.accessToken, authInfo.refreshToken, authInfo.loggedInProviderType, authInfo.loggedInProviderName, authInfo.lastAuthActivity, authInfo.userProfile
            ? new StoreCoreUserProfile_1.default(authInfo.userProfile.userType, authInfo.userProfile.data, authInfo.userProfile.identities.map(function (identity) {
                return new StoreStitchUserIdentity_1.default(identity.id, identity.providerType);
            }))
            : undefined);
        encodedStoreInfos.push(storeInfo.encode());
    });
    storage.set(StoreAuthInfo.ALL_USERS_STORAGE_NAME, JSON.stringify(encodedStoreInfos));
}
exports.writeAllUsersAuthInfoToStorage = writeAllUsersAuthInfoToStorage;
var StoreAuthInfo = (function (_super) {
    __extends(StoreAuthInfo, _super);
    function StoreAuthInfo(userId, deviceId, accessToken, refreshToken, loggedInProviderType, loggedInProviderName, lastAuthActivity, userProfile) {
        var _this = _super.call(this, userId, deviceId, accessToken, refreshToken, loggedInProviderType, loggedInProviderName, lastAuthActivity, userProfile) || this;
        _this.userProfile = userProfile;
        return _this;
    }
    StoreAuthInfo.decode = function (from) {
        var userId = from[Fields.USER_ID];
        var deviceId = from[Fields.DEVICE_ID];
        var accessToken = from[Fields.ACCESS_TOKEN];
        var refreshToken = from[Fields.REFRESH_TOKEN];
        var loggedInProviderType = from[Fields.LOGGED_IN_PROVIDER_TYPE];
        var loggedInProviderName = from[Fields.LOGGED_IN_PROVIDER_NAME];
        var userProfile = from[Fields.USER_PROFILE];
        var lastAuthActivityMillisSinceEpoch = from[Fields.LAST_AUTH_ACTIVITY];
        return new StoreAuthInfo(userId, deviceId, accessToken, refreshToken, loggedInProviderType, loggedInProviderName, new Date(lastAuthActivityMillisSinceEpoch), StoreCoreUserProfile_1.default.decode(userProfile));
    };
    StoreAuthInfo.prototype.encode = function () {
        var to = {};
        to[Fields.USER_ID] = this.userId;
        to[Fields.ACCESS_TOKEN] = this.accessToken;
        to[Fields.REFRESH_TOKEN] = this.refreshToken;
        to[Fields.DEVICE_ID] = this.deviceId;
        to[Fields.LOGGED_IN_PROVIDER_NAME] = this.loggedInProviderName;
        to[Fields.LOGGED_IN_PROVIDER_TYPE] = this.loggedInProviderType;
        to[Fields.LAST_AUTH_ACTIVITY] = this.lastAuthActivity
            ? this.lastAuthActivity.getTime()
            : undefined;
        to[Fields.USER_PROFILE] = this.userProfile
            ? this.userProfile.encode()
            : undefined;
        return to;
    };
    StoreAuthInfo.ACTIVE_USER_STORAGE_NAME = "auth_info";
    StoreAuthInfo.ALL_USERS_STORAGE_NAME = "all_auth_infos";
    return StoreAuthInfo;
}(AuthInfo_1.default));
exports.StoreAuthInfo = StoreAuthInfo;

},{"../../../StitchClientError":43,"../../../StitchClientErrorCode":44,"../AuthInfo":56,"./StoreCoreUserProfile":66,"./StoreStitchUserIdentity":67}],66:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserProfileImpl_1 = __importDefault(require("../StitchUserProfileImpl"));
var StoreStitchUserIdentity_1 = __importDefault(require("./StoreStitchUserIdentity"));
var Fields;
(function (Fields) {
    Fields["DATA"] = "data";
    Fields["USER_TYPE"] = "type";
    Fields["IDENTITIES"] = "identities";
})(Fields || (Fields = {}));
var StoreCoreUserProfile = (function (_super) {
    __extends(StoreCoreUserProfile, _super);
    function StoreCoreUserProfile(userType, data, identities) {
        var _this = _super.call(this, userType, data, identities) || this;
        _this.userType = userType;
        _this.data = data;
        _this.identities = identities;
        return _this;
    }
    StoreCoreUserProfile.decode = function (from) {
        return from
            ? new StoreCoreUserProfile(from[Fields.USER_TYPE], from[Fields.DATA], from[Fields.IDENTITIES].map(function (identity) {
                return StoreStitchUserIdentity_1.default.decode(identity);
            }))
            : undefined;
    };
    StoreCoreUserProfile.prototype.encode = function () {
        var _a;
        return _a = {},
            _a[Fields.DATA] = this.data,
            _a[Fields.USER_TYPE] = this.userType,
            _a[Fields.IDENTITIES] = this.identities.map(function (identity) { return identity.encode(); }),
            _a;
    };
    return StoreCoreUserProfile;
}(StitchUserProfileImpl_1.default));
exports.default = StoreCoreUserProfile;

},{"../StitchUserProfileImpl":61,"./StoreStitchUserIdentity":67}],67:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchUserIdentity_1 = __importDefault(require("../../StitchUserIdentity"));
var Fields;
(function (Fields) {
    Fields["ID"] = "id";
    Fields["PROVIDER_TYPE"] = "provider_type";
})(Fields || (Fields = {}));
var StoreStitchUserIdentity = (function (_super) {
    __extends(StoreStitchUserIdentity, _super);
    function StoreStitchUserIdentity(id, providerType) {
        return _super.call(this, id, providerType) || this;
    }
    StoreStitchUserIdentity.decode = function (from) {
        return new StoreStitchUserIdentity(from[Fields.ID], from[Fields.PROVIDER_TYPE]);
    };
    StoreStitchUserIdentity.prototype.encode = function () {
        var _a;
        return _a = {},
            _a[Fields.ID] = this.id,
            _a[Fields.PROVIDER_TYPE] = this.providerType,
            _a;
    };
    return StoreStitchUserIdentity;
}(StitchUserIdentity_1.default));
exports.default = StoreStitchUserIdentity;

},{"../../StitchUserIdentity":52}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnonymousAuthProvider = (function () {
    function AnonymousAuthProvider() {
    }
    AnonymousAuthProvider.TYPE = "anon-user";
    AnonymousAuthProvider.DEFAULT_NAME = "anon-user";
    return AnonymousAuthProvider;
}());
exports.default = AnonymousAuthProvider;

},{}],69:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var AnonymousAuthProvider_1 = __importDefault(require("./AnonymousAuthProvider"));
var AnonymousCredential = (function () {
    function AnonymousCredential(providerName) {
        if (providerName === void 0) { providerName = AnonymousAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = AnonymousAuthProvider_1.default.TYPE;
        this.material = {};
        this.providerCapabilities = new ProviderCapabilities_1.default(true);
        this.providerName = providerName;
    }
    return AnonymousCredential;
}());
exports.default = AnonymousCredential;

},{"../../ProviderCapabilities":51,"./AnonymousAuthProvider":68}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomAuthProvider = (function () {
    function CustomAuthProvider() {
    }
    CustomAuthProvider.TYPE = "custom-token";
    CustomAuthProvider.DEFAULT_NAME = "custom-token";
    return CustomAuthProvider;
}());
exports.default = CustomAuthProvider;

},{}],71:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var CustomAuthProvider_1 = __importDefault(require("./CustomAuthProvider"));
var Fields;
(function (Fields) {
    Fields["TOKEN"] = "token";
})(Fields || (Fields = {}));
var CustomCredential = (function () {
    function CustomCredential(token, providerName) {
        var _a;
        if (providerName === void 0) { providerName = CustomAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = CustomAuthProvider_1.default.TYPE;
        this.providerCapabilities = new ProviderCapabilities_1.default(false);
        this.providerName = providerName;
        this.token = token;
        this.material = (_a = {}, _a[Fields.TOKEN] = this.token, _a);
    }
    return CustomCredential;
}());
exports.default = CustomCredential;

},{"../../ProviderCapabilities":51,"./CustomAuthProvider":70}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FacebookAuthProvider = (function () {
    function FacebookAuthProvider() {
    }
    FacebookAuthProvider.TYPE = "oauth2-facebook";
    FacebookAuthProvider.DEFAULT_NAME = "oauth2-facebook";
    return FacebookAuthProvider;
}());
exports.default = FacebookAuthProvider;

},{}],73:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var FacebookAuthProvider_1 = __importDefault(require("./FacebookAuthProvider"));
var Fields;
(function (Fields) {
    Fields["ACCESS_TOKEN"] = "accessToken";
})(Fields || (Fields = {}));
var FacebookCredential = (function () {
    function FacebookCredential(accessToken, providerName) {
        var _a;
        if (providerName === void 0) { providerName = FacebookAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = FacebookAuthProvider_1.default.TYPE;
        this.providerName = providerName;
        this.accessToken = accessToken;
        this.material = (_a = {}, _a[Fields.ACCESS_TOKEN] = this.accessToken, _a);
    }
    Object.defineProperty(FacebookCredential.prototype, "providerCapabilities", {
        get: function () {
            return new ProviderCapabilities_1.default(false);
        },
        enumerable: true,
        configurable: true
    });
    return FacebookCredential;
}());
exports.default = FacebookCredential;

},{"../../ProviderCapabilities":51,"./FacebookAuthProvider":72}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionAuthProvider = (function () {
    function FunctionAuthProvider() {
    }
    FunctionAuthProvider.TYPE = "custom-function";
    FunctionAuthProvider.DEFAULT_NAME = "custom-function";
    return FunctionAuthProvider;
}());
exports.default = FunctionAuthProvider;

},{}],75:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var FunctionAuthProvider_1 = __importDefault(require("./FunctionAuthProvider"));
var FunctionCredential = (function () {
    function FunctionCredential(payload, providerName) {
        if (providerName === void 0) { providerName = FunctionAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = FunctionAuthProvider_1.default.TYPE;
        this.providerName = providerName;
        this.material = payload;
    }
    Object.defineProperty(FunctionCredential.prototype, "providerCapabilities", {
        get: function () {
            return new ProviderCapabilities_1.default(false);
        },
        enumerable: true,
        configurable: true
    });
    return FunctionCredential;
}());
exports.default = FunctionCredential;

},{"../../ProviderCapabilities":51,"./FunctionAuthProvider":74}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GoogleAuthProvider = (function () {
    function GoogleAuthProvider() {
    }
    GoogleAuthProvider.TYPE = "oauth2-google";
    GoogleAuthProvider.DEFAULT_NAME = "oauth2-google";
    return GoogleAuthProvider;
}());
exports.default = GoogleAuthProvider;

},{}],77:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var GoogleAuthProvider_1 = __importDefault(require("./GoogleAuthProvider"));
var Fields;
(function (Fields) {
    Fields["AUTH_CODE"] = "authCode";
})(Fields || (Fields = {}));
var GoogleCredential = (function () {
    function GoogleCredential(authCode, providerName) {
        var _a;
        if (providerName === void 0) { providerName = GoogleAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = GoogleAuthProvider_1.default.TYPE;
        this.providerCapabilities = new ProviderCapabilities_1.default(false);
        this.providerName = providerName;
        this.authCode = authCode;
        this.material = (_a = {}, _a[Fields.AUTH_CODE] = this.authCode, _a);
    }
    return GoogleCredential;
}());
exports.default = GoogleCredential;

},{"../../ProviderCapabilities":51,"./GoogleAuthProvider":76}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoreAuthProviderClient = (function () {
    function CoreAuthProviderClient(providerName, requestClient, baseRoute) {
        this.providerName = providerName;
        this.requestClient = requestClient;
        this.baseRoute = baseRoute;
    }
    return CoreAuthProviderClient;
}());
exports.default = CoreAuthProviderClient;

},{}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchAuthResponseCredential = (function () {
    function StitchAuthResponseCredential(authInfo, providerType, providerName, asLink) {
        this.authInfo = authInfo;
        this.providerType = providerType;
        this.providerName = providerName;
        this.asLink = asLink;
    }
    return StitchAuthResponseCredential;
}());
exports.default = StitchAuthResponseCredential;

},{}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerApiKeyAuthProvider = (function () {
    function ServerApiKeyAuthProvider() {
    }
    ServerApiKeyAuthProvider.TYPE = "api-key";
    ServerApiKeyAuthProvider.DEFAULT_NAME = "api-key";
    return ServerApiKeyAuthProvider;
}());
exports.default = ServerApiKeyAuthProvider;

},{}],81:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var ServerApiKeyAuthProvider_1 = __importDefault(require("./ServerApiKeyAuthProvider"));
var Fields;
(function (Fields) {
    Fields["KEY"] = "key";
})(Fields || (Fields = {}));
var ServerApiKeyCredential = (function () {
    function ServerApiKeyCredential(key, providerName) {
        var _a;
        if (providerName === void 0) { providerName = ServerApiKeyAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = ServerApiKeyAuthProvider_1.default.TYPE;
        this.providerCapabilities = new ProviderCapabilities_1.default(false);
        this.providerName = providerName;
        this.key = key;
        this.material = (_a = {}, _a[Fields.KEY] = this.key, _a);
    }
    return ServerApiKeyCredential;
}());
exports.default = ServerApiKeyCredential;

},{"../../ProviderCapabilities":51,"./ServerApiKeyAuthProvider":80}],82:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchErrorUtils_1 = require("../../../internal/common/StitchErrorUtils");
var Method_1 = __importDefault(require("../../../internal/net/Method"));
var StitchAuthDocRequest_1 = require("../../../internal/net/StitchAuthDocRequest");
var StitchAuthRequest_1 = require("../../../internal/net/StitchAuthRequest");
var StitchRequestError_1 = __importDefault(require("../../../StitchRequestError"));
var StitchRequestErrorCode_1 = require("../../../StitchRequestErrorCode");
var CoreAuthProviderClient_1 = __importDefault(require("../internal/CoreAuthProviderClient"));
var UserApiKey_1 = __importDefault(require("./models/UserApiKey"));
var UserApiKeyAuthProvider_1 = __importDefault(require("./UserApiKeyAuthProvider"));
var ApiKeyFields;
(function (ApiKeyFields) {
    ApiKeyFields["NAME"] = "name";
})(ApiKeyFields || (ApiKeyFields = {}));
var CoreUserApiKeyAuthProviderClient = (function (_super) {
    __extends(CoreUserApiKeyAuthProviderClient, _super);
    function CoreUserApiKeyAuthProviderClient(requestClient, authRoutes) {
        var _this = this;
        var baseRoute = authRoutes.baseAuthRoute + "/api_keys";
        var name = UserApiKeyAuthProvider_1.default.DEFAULT_NAME;
        _this = _super.call(this, name, requestClient, baseRoute) || this;
        return _this;
    }
    CoreUserApiKeyAuthProviderClient.prototype.createApiKey = function (name) {
        var _a;
        var reqBuilder = new StitchAuthDocRequest_1.StitchAuthDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.baseRoute)
            .withDocument((_a = {},
            _a[ApiKeyFields.NAME] = name,
            _a))
            .withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function (response) {
            return UserApiKey_1.default.readFromApi(response.body);
        })
            .catch(function (err) {
            throw StitchErrorUtils_1.wrapDecodingError(err);
        });
    };
    CoreUserApiKeyAuthProviderClient.prototype.fetchApiKey = function (keyId) {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.GET)
            .withPath(this.getApiKeyRoute(keyId.toHexString()));
        reqBuilder.withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function (response) {
            return UserApiKey_1.default.readFromApi(response.body);
        })
            .catch(function (err) {
            throw StitchErrorUtils_1.wrapDecodingError(err);
        });
    };
    CoreUserApiKeyAuthProviderClient.prototype.fetchApiKeys = function () {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder.withMethod(Method_1.default.GET).withPath(this.baseRoute);
        reqBuilder.withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function (response) {
            var json = JSON.parse(response.body);
            if (Array.isArray(json)) {
                return json.map(function (value) { return UserApiKey_1.default.readFromApi(value); });
            }
            throw new StitchRequestError_1.default(new Error("unexpected non-array response from server"), StitchRequestErrorCode_1.StitchRequestErrorCode.DECODING_ERROR);
        })
            .catch(function (err) {
            throw StitchErrorUtils_1.wrapDecodingError(err);
        });
    };
    CoreUserApiKeyAuthProviderClient.prototype.deleteApiKey = function (keyId) {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.DELETE)
            .withPath(this.getApiKeyRoute(keyId.toHexString()));
        reqBuilder.withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function () { });
    };
    CoreUserApiKeyAuthProviderClient.prototype.enableApiKey = function (keyId) {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.PUT)
            .withPath(this.getApiKeyEnableRoute(keyId.toHexString()));
        reqBuilder.withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function () { });
    };
    CoreUserApiKeyAuthProviderClient.prototype.disableApiKey = function (keyId) {
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.PUT)
            .withPath(this.getApiKeyDisableRoute(keyId.toHexString()));
        reqBuilder.withRefreshToken();
        return this.requestClient
            .doAuthenticatedRequest(reqBuilder.build())
            .then(function () { });
    };
    CoreUserApiKeyAuthProviderClient.prototype.getApiKeyRoute = function (keyId) {
        return this.baseRoute + "/" + keyId;
    };
    CoreUserApiKeyAuthProviderClient.prototype.getApiKeyEnableRoute = function (keyId) {
        return this.getApiKeyRoute(keyId) + "/enable";
    };
    CoreUserApiKeyAuthProviderClient.prototype.getApiKeyDisableRoute = function (keyId) {
        return this.getApiKeyRoute(keyId) + "/disable";
    };
    return CoreUserApiKeyAuthProviderClient;
}(CoreAuthProviderClient_1.default));
exports.default = CoreUserApiKeyAuthProviderClient;

},{"../../../StitchRequestError":46,"../../../StitchRequestErrorCode":47,"../../../internal/common/StitchErrorUtils":93,"../../../internal/net/Method":102,"../../../internal/net/StitchAuthDocRequest":107,"../../../internal/net/StitchAuthRequest":108,"../internal/CoreAuthProviderClient":78,"./UserApiKeyAuthProvider":83,"./models/UserApiKey":85}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserApiKeyAuthProvider = (function () {
    function UserApiKeyAuthProvider() {
    }
    UserApiKeyAuthProvider.TYPE = "api-key";
    UserApiKeyAuthProvider.DEFAULT_NAME = "api-key";
    return UserApiKeyAuthProvider;
}());
exports.default = UserApiKeyAuthProvider;

},{}],84:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var UserApiKeyAuthProvider_1 = __importDefault(require("./UserApiKeyAuthProvider"));
var Fields;
(function (Fields) {
    Fields["KEY"] = "key";
})(Fields || (Fields = {}));
var UserApiKeyCredential = (function () {
    function UserApiKeyCredential(key, providerName) {
        var _a;
        if (providerName === void 0) { providerName = UserApiKeyAuthProvider_1.default.DEFAULT_NAME; }
        this.providerType = UserApiKeyAuthProvider_1.default.TYPE;
        this.providerCapabilities = new ProviderCapabilities_1.default(false);
        this.providerName = providerName;
        this.key = key;
        this.material = (_a = {},
            _a[Fields.KEY] = this.key,
            _a);
    }
    return UserApiKeyCredential;
}());
exports.default = UserApiKeyCredential;

},{"../../ProviderCapabilities":51,"./UserApiKeyAuthProvider":83}],85:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = __importDefault(require("bson"));
var Assertions_1 = __importDefault(require("../../../../internal/common/Assertions"));
var Fields;
(function (Fields) {
    Fields["ID"] = "_id";
    Fields["KEY"] = "key";
    Fields["NAME"] = "name";
    Fields["DISABLED"] = "disabled";
})(Fields || (Fields = {}));
var UserApiKey = (function () {
    function UserApiKey(id, key, name, disabled) {
        this.id = bson_1.default.ObjectID.createFromHexString(id);
        this.key = key;
        this.name = name;
        this.disabled = disabled;
    }
    UserApiKey.readFromApi = function (json) {
        var body = typeof json === "string" ? JSON.parse(json) : json;
        Assertions_1.default.keyPresent(Fields.ID, body);
        Assertions_1.default.keyPresent(Fields.NAME, body);
        Assertions_1.default.keyPresent(Fields.DISABLED, body);
        return new UserApiKey(body[Fields.ID], body[Fields.KEY], body[Fields.NAME], body[Fields.DISABLED]);
    };
    UserApiKey.prototype.toJSON = function () {
        var _a;
        return _a = {},
            _a[Fields.ID] = this.id,
            _a[Fields.KEY] = this.key,
            _a[Fields.NAME] = this.name,
            _a[Fields.DISABLED] = this.disabled,
            _a;
    };
    return UserApiKey;
}());
exports.default = UserApiKey;

},{"../../../../internal/common/Assertions":91,"bson":5}],86:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Method_1 = __importDefault(require("../../../internal/net/Method"));
var StitchDocRequest_1 = require("../../../internal/net/StitchDocRequest");
var CoreAuthProviderClient_1 = __importDefault(require("../internal/CoreAuthProviderClient"));
var UserPasswordAuthProvider_1 = __importDefault(require("./UserPasswordAuthProvider"));
var RegistrationFields;
(function (RegistrationFields) {
    RegistrationFields["EMAIL"] = "email";
    RegistrationFields["PASSWORD"] = "password";
})(RegistrationFields || (RegistrationFields = {}));
var ActionFields;
(function (ActionFields) {
    ActionFields["EMAIL"] = "email";
    ActionFields["PASSWORD"] = "password";
    ActionFields["TOKEN"] = "token";
    ActionFields["TOKEN_ID"] = "tokenId";
    ActionFields["ARGS"] = "arguments";
})(ActionFields || (ActionFields = {}));
var CoreUserPasswordAuthProviderClient = (function (_super) {
    __extends(CoreUserPasswordAuthProviderClient, _super);
    function CoreUserPasswordAuthProviderClient(providerName, requestClient, authRoutes) {
        if (providerName === void 0) { providerName = UserPasswordAuthProvider_1.default.DEFAULT_NAME; }
        var _this = this;
        var baseRoute = authRoutes.getAuthProviderRoute(providerName);
        _this = _super.call(this, providerName, requestClient, baseRoute) || this;
        return _this;
    }
    CoreUserPasswordAuthProviderClient.prototype.registerWithEmailInternal = function (email, password) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.getRegisterWithEmailRoute());
        reqBuilder.withDocument((_a = {},
            _a[RegistrationFields.EMAIL] = email,
            _a[RegistrationFields.PASSWORD] = password,
            _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.confirmUserInternal = function (token, tokenId) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder.withMethod(Method_1.default.POST).withPath(this.getConfirmUserRoute());
        reqBuilder.withDocument((_a = {},
            _a[ActionFields.TOKEN] = token,
            _a[ActionFields.TOKEN_ID] = tokenId,
            _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.resendConfirmationEmailInternal = function (email) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.getResendConfirmationEmailRoute());
        reqBuilder.withDocument((_a = {}, _a[ActionFields.EMAIL] = email, _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.resetPasswordInternal = function (token, tokenId, password) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder.withMethod(Method_1.default.POST).withPath(this.getResetPasswordRoute());
        reqBuilder.withDocument((_a = {},
            _a[ActionFields.TOKEN] = token,
            _a[ActionFields.TOKEN_ID] = tokenId,
            _a[ActionFields.PASSWORD] = password,
            _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.sendResetPasswordEmailInternal = function (email) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.getSendResetPasswordEmailRoute());
        reqBuilder.withDocument((_a = {}, _a[ActionFields.EMAIL] = email, _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.callResetPasswordFunctionInternal = function (email, password, args) {
        var _a;
        var reqBuilder = new StitchDocRequest_1.StitchDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.getCallResetPasswordFunctionRoute());
        reqBuilder.withDocument((_a = {},
            _a[ActionFields.EMAIL] = email,
            _a[ActionFields.PASSWORD] = password,
            _a[ActionFields.ARGS] = args,
            _a));
        return this.requestClient.doRequest(reqBuilder.build()).then(function () { });
    };
    CoreUserPasswordAuthProviderClient.prototype.getRegisterWithEmailRoute = function () {
        return this.getExtensionRoute("register");
    };
    CoreUserPasswordAuthProviderClient.prototype.getConfirmUserRoute = function () {
        return this.getExtensionRoute("confirm");
    };
    CoreUserPasswordAuthProviderClient.prototype.getResendConfirmationEmailRoute = function () {
        return this.getExtensionRoute("confirm/send");
    };
    CoreUserPasswordAuthProviderClient.prototype.getResetPasswordRoute = function () {
        return this.getExtensionRoute("reset");
    };
    CoreUserPasswordAuthProviderClient.prototype.getSendResetPasswordEmailRoute = function () {
        return this.getExtensionRoute("reset/send");
    };
    CoreUserPasswordAuthProviderClient.prototype.getCallResetPasswordFunctionRoute = function () {
        return this.getExtensionRoute("reset/call");
    };
    CoreUserPasswordAuthProviderClient.prototype.getExtensionRoute = function (path) {
        return this.baseRoute + "/" + path;
    };
    return CoreUserPasswordAuthProviderClient;
}(CoreAuthProviderClient_1.default));
exports.default = CoreUserPasswordAuthProviderClient;

},{"../../../internal/net/Method":102,"../../../internal/net/StitchDocRequest":109,"../internal/CoreAuthProviderClient":78,"./UserPasswordAuthProvider":87}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserPasswordAuthProvider = (function () {
    function UserPasswordAuthProvider() {
    }
    UserPasswordAuthProvider.TYPE = "local-userpass";
    UserPasswordAuthProvider.DEFAULT_NAME = "local-userpass";
    return UserPasswordAuthProvider;
}());
exports.default = UserPasswordAuthProvider;

},{}],88:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderCapabilities_1 = __importDefault(require("../../ProviderCapabilities"));
var UserPasswordAuthProvider_1 = __importDefault(require("./UserPasswordAuthProvider"));
var Fields;
(function (Fields) {
    Fields["USERNAME"] = "username";
    Fields["PASSWORD"] = "password";
})(Fields || (Fields = {}));
var UserPasswordCredential = (function () {
    function UserPasswordCredential(username, password, providerName) {
        var _a;
        if (providerName === void 0) { providerName = UserPasswordAuthProvider_1.default.DEFAULT_NAME; }
        this.username = username;
        this.password = password;
        this.providerName = providerName;
        this.providerType = UserPasswordAuthProvider_1.default.TYPE;
        this.providerCapabilities = new ProviderCapabilities_1.default(false);
        this.material = (_a = {},
            _a[Fields.USERNAME] = this.username,
            _a[Fields.PASSWORD] = this.password,
            _a);
    }
    return UserPasswordCredential;
}());
exports.default = UserPasswordCredential;

},{"../../ProviderCapabilities":51,"./UserPasswordAuthProvider":87}],89:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = __importDefault(require("bson"));
exports.BSON = bson_1.default;
var AuthEvent_1 = require("./auth/internal/AuthEvent");
exports.AuthEventKind = AuthEvent_1.AuthEventKind;
var AuthInfo_1 = __importDefault(require("./auth/internal/AuthInfo"));
exports.AuthInfo = AuthInfo_1.default;
var CoreStitchAuth_1 = __importDefault(require("./auth/internal/CoreStitchAuth"));
exports.CoreStitchAuth = CoreStitchAuth_1.default;
var CoreStitchUserImpl_1 = __importDefault(require("./auth/internal/CoreStitchUserImpl"));
exports.CoreStitchUserImpl = CoreStitchUserImpl_1.default;
var DeviceFields_1 = __importDefault(require("./auth/internal/DeviceFields"));
exports.DeviceFields = DeviceFields_1.default;
var ApiStitchUserIdentity_1 = __importDefault(require("./auth/internal/models/ApiStitchUserIdentity"));
exports.ApiStitchUserIdentity = ApiStitchUserIdentity_1.default;
var StitchUserProfileImpl_1 = __importDefault(require("./auth/internal/StitchUserProfileImpl"));
exports.StitchUserProfileImpl = StitchUserProfileImpl_1.default;
var AnonymousAuthProvider_1 = __importDefault(require("./auth/providers/anonymous/AnonymousAuthProvider"));
exports.AnonymousAuthProvider = AnonymousAuthProvider_1.default;
var AnonymousCredential_1 = __importDefault(require("./auth/providers/anonymous/AnonymousCredential"));
exports.AnonymousCredential = AnonymousCredential_1.default;
var CustomAuthProvider_1 = __importDefault(require("./auth/providers/custom/CustomAuthProvider"));
exports.CustomAuthProvider = CustomAuthProvider_1.default;
var CustomCredential_1 = __importDefault(require("./auth/providers/custom/CustomCredential"));
exports.CustomCredential = CustomCredential_1.default;
var FacebookAuthProvider_1 = __importDefault(require("./auth/providers/facebook/FacebookAuthProvider"));
exports.FacebookAuthProvider = FacebookAuthProvider_1.default;
var FacebookCredential_1 = __importDefault(require("./auth/providers/facebook/FacebookCredential"));
exports.FacebookCredential = FacebookCredential_1.default;
var FunctionAuthProvider_1 = __importDefault(require("./auth/providers/function/FunctionAuthProvider"));
exports.FunctionAuthProvider = FunctionAuthProvider_1.default;
var FunctionCredential_1 = __importDefault(require("./auth/providers/function/FunctionCredential"));
exports.FunctionCredential = FunctionCredential_1.default;
var GoogleAuthProvider_1 = __importDefault(require("./auth/providers/google/GoogleAuthProvider"));
exports.GoogleAuthProvider = GoogleAuthProvider_1.default;
var GoogleCredential_1 = __importDefault(require("./auth/providers/google/GoogleCredential"));
exports.GoogleCredential = GoogleCredential_1.default;
var StitchAuthResponseCredential_1 = __importDefault(require("./auth/providers/internal/StitchAuthResponseCredential"));
exports.StitchAuthResponseCredential = StitchAuthResponseCredential_1.default;
var ServerApiKeyAuthProvider_1 = __importDefault(require("./auth/providers/serverapikey/ServerApiKeyAuthProvider"));
exports.ServerApiKeyAuthProvider = ServerApiKeyAuthProvider_1.default;
var ServerApiKeyCredential_1 = __importDefault(require("./auth/providers/serverapikey/ServerApiKeyCredential"));
exports.ServerApiKeyCredential = ServerApiKeyCredential_1.default;
var CoreUserApiKeyAuthProviderClient_1 = __importDefault(require("./auth/providers/userapikey/CoreUserApiKeyAuthProviderClient"));
exports.CoreUserApiKeyAuthProviderClient = CoreUserApiKeyAuthProviderClient_1.default;
var UserApiKey_1 = __importDefault(require("./auth/providers/userapikey/models/UserApiKey"));
exports.UserApiKey = UserApiKey_1.default;
var UserApiKeyAuthProvider_1 = __importDefault(require("./auth/providers/userapikey/UserApiKeyAuthProvider"));
exports.UserApiKeyAuthProvider = UserApiKeyAuthProvider_1.default;
var UserApiKeyCredential_1 = __importDefault(require("./auth/providers/userapikey/UserApiKeyCredential"));
exports.UserApiKeyCredential = UserApiKeyCredential_1.default;
var CoreUserPasswordAuthProviderClient_1 = __importDefault(require("./auth/providers/userpass/CoreUserPasswordAuthProviderClient"));
exports.CoreUserPassAuthProviderClient = CoreUserPasswordAuthProviderClient_1.default;
var UserPasswordAuthProvider_1 = __importDefault(require("./auth/providers/userpass/UserPasswordAuthProvider"));
exports.UserPasswordAuthProvider = UserPasswordAuthProvider_1.default;
var UserPasswordCredential_1 = __importDefault(require("./auth/providers/userpass/UserPasswordCredential"));
exports.UserPasswordCredential = UserPasswordCredential_1.default;
var StitchUserIdentity_1 = __importDefault(require("./auth/StitchUserIdentity"));
exports.StitchUserIdentity = StitchUserIdentity_1.default;
var UserType_1 = __importDefault(require("./auth/UserType"));
exports.UserType = UserType_1.default;
var Assertions_1 = __importDefault(require("./internal/common/Assertions"));
exports.Assertions = Assertions_1.default;
var Base64_1 = require("./internal/common/Base64");
exports.base64Decode = Base64_1.base64Decode;
exports.base64Encode = Base64_1.base64Encode;
exports.utf8Slice = Base64_1.utf8Slice;
var StitchErrorUtils_1 = require("./internal/common/StitchErrorUtils");
exports.handleRequestError = StitchErrorUtils_1.handleRequestError;
var Storage_1 = require("./internal/common/Storage");
exports.MemoryStorage = Storage_1.MemoryStorage;
var CoreStitchAppClient_1 = __importDefault(require("./internal/CoreStitchAppClient"));
exports.CoreStitchAppClient = CoreStitchAppClient_1.default;
var BaseEventStream_1 = __importDefault(require("./internal/net/BaseEventStream"));
exports.BaseEventStream = BaseEventStream_1.default;
var BasicRequest_1 = require("./internal/net/BasicRequest");
exports.BasicRequest = BasicRequest_1.BasicRequest;
var ContentTypes_1 = __importDefault(require("./internal/net/ContentTypes"));
exports.ContentTypes = ContentTypes_1.default;
var Event_1 = __importDefault(require("./internal/net/Event"));
exports.Event = Event_1.default;
var Headers_1 = __importDefault(require("./internal/net/Headers"));
exports.Headers = Headers_1.default;
var Method_1 = __importDefault(require("./internal/net/Method"));
exports.Method = Method_1.default;
var Response_1 = __importDefault(require("./internal/net/Response"));
exports.Response = Response_1.default;
var StitchAppAuthRoutes_1 = __importDefault(require("./internal/net/StitchAppAuthRoutes"));
exports.StitchAppAuthRoutes = StitchAppAuthRoutes_1.default;
var StitchAppRequestClient_1 = __importDefault(require("./internal/net/StitchAppRequestClient"));
exports.StitchAppRequestClient = StitchAppRequestClient_1.default;
var StitchAppRoutes_1 = __importDefault(require("./internal/net/StitchAppRoutes"));
exports.StitchAppRoutes = StitchAppRoutes_1.default;
var StitchAuthRequest_1 = require("./internal/net/StitchAuthRequest");
exports.StitchAuthRequest = StitchAuthRequest_1.StitchAuthRequest;
var StitchEvent_1 = __importDefault(require("./internal/net/StitchEvent"));
exports.StitchEvent = StitchEvent_1.default;
var StitchRequestClient_1 = __importDefault(require("./internal/net/StitchRequestClient"));
exports.StitchRequestClient = StitchRequestClient_1.default;
var AuthRebindEvent_1 = __importDefault(require("./services/internal/AuthRebindEvent"));
exports.AuthRebindEvent = AuthRebindEvent_1.default;
var CoreStitchServiceClientImpl_1 = __importDefault(require("./services/internal/CoreStitchServiceClientImpl"));
exports.CoreStitchServiceClientImpl = CoreStitchServiceClientImpl_1.default;
var RebindEvent_1 = require("./services/internal/RebindEvent");
exports.RebindEvent = RebindEvent_1.RebindEvent;
var StitchServiceRoutes_1 = __importDefault(require("./services/internal/StitchServiceRoutes"));
exports.StitchServiceRoutes = StitchServiceRoutes_1.default;
var StitchAppClientConfiguration_1 = require("./StitchAppClientConfiguration");
exports.StitchAppClientConfiguration = StitchAppClientConfiguration_1.StitchAppClientConfiguration;
var StitchAppClientInfo_1 = __importDefault(require("./StitchAppClientInfo"));
exports.StitchAppClientInfo = StitchAppClientInfo_1.default;
var StitchClientError_1 = __importDefault(require("./StitchClientError"));
exports.StitchClientError = StitchClientError_1.default;
var StitchClientErrorCode_1 = require("./StitchClientErrorCode");
exports.StitchClientErrorCode = StitchClientErrorCode_1.StitchClientErrorCode;
var StitchError_1 = __importDefault(require("./StitchError"));
exports.StitchError = StitchError_1.default;
var StitchRequestError_1 = __importDefault(require("./StitchRequestError"));
exports.StitchRequestError = StitchRequestError_1.default;
var StitchRequestErrorCode_1 = require("./StitchRequestErrorCode");
exports.StitchRequestErrorCode = StitchRequestErrorCode_1.StitchRequestErrorCode;
var StitchServiceError_1 = __importDefault(require("./StitchServiceError"));
exports.StitchServiceError = StitchServiceError_1.default;
var StitchServiceErrorCode_1 = require("./StitchServiceErrorCode");
exports.StitchServiceErrorCode = StitchServiceErrorCode_1.StitchServiceErrorCode;
var Stream_1 = __importDefault(require("./Stream"));
exports.Stream = Stream_1.default;

},{"./StitchAppClientConfiguration":40,"./StitchAppClientInfo":41,"./StitchClientError":43,"./StitchClientErrorCode":44,"./StitchError":45,"./StitchRequestError":46,"./StitchRequestErrorCode":47,"./StitchServiceError":48,"./StitchServiceErrorCode":49,"./Stream":50,"./auth/StitchUserIdentity":52,"./auth/UserType":53,"./auth/internal/AuthEvent":55,"./auth/internal/AuthInfo":56,"./auth/internal/CoreStitchAuth":57,"./auth/internal/CoreStitchUserImpl":58,"./auth/internal/DeviceFields":59,"./auth/internal/StitchUserProfileImpl":61,"./auth/internal/models/ApiStitchUserIdentity":64,"./auth/providers/anonymous/AnonymousAuthProvider":68,"./auth/providers/anonymous/AnonymousCredential":69,"./auth/providers/custom/CustomAuthProvider":70,"./auth/providers/custom/CustomCredential":71,"./auth/providers/facebook/FacebookAuthProvider":72,"./auth/providers/facebook/FacebookCredential":73,"./auth/providers/function/FunctionAuthProvider":74,"./auth/providers/function/FunctionCredential":75,"./auth/providers/google/GoogleAuthProvider":76,"./auth/providers/google/GoogleCredential":77,"./auth/providers/internal/StitchAuthResponseCredential":79,"./auth/providers/serverapikey/ServerApiKeyAuthProvider":80,"./auth/providers/serverapikey/ServerApiKeyCredential":81,"./auth/providers/userapikey/CoreUserApiKeyAuthProviderClient":82,"./auth/providers/userapikey/UserApiKeyAuthProvider":83,"./auth/providers/userapikey/UserApiKeyCredential":84,"./auth/providers/userapikey/models/UserApiKey":85,"./auth/providers/userpass/CoreUserPasswordAuthProviderClient":86,"./auth/providers/userpass/UserPasswordAuthProvider":87,"./auth/providers/userpass/UserPasswordCredential":88,"./internal/CoreStitchAppClient":90,"./internal/common/Assertions":91,"./internal/common/Base64":92,"./internal/common/StitchErrorUtils":93,"./internal/common/Storage":94,"./internal/net/BaseEventStream":96,"./internal/net/BasicRequest":98,"./internal/net/ContentTypes":99,"./internal/net/Event":100,"./internal/net/Headers":101,"./internal/net/Method":102,"./internal/net/Response":103,"./internal/net/StitchAppAuthRoutes":104,"./internal/net/StitchAppRequestClient":105,"./internal/net/StitchAppRoutes":106,"./internal/net/StitchAuthRequest":108,"./internal/net/StitchEvent":110,"./internal/net/StitchRequestClient":112,"./services/internal/AuthRebindEvent":114,"./services/internal/CoreStitchServiceClientImpl":115,"./services/internal/RebindEvent":116,"./services/internal/StitchServiceRoutes":117,"bson":5}],90:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CoreStitchServiceClientImpl_1 = __importDefault(require("../services/internal/CoreStitchServiceClientImpl"));
var CoreStitchAppClient = (function () {
    function CoreStitchAppClient(authRequestClient, routes) {
        this.functionService =
            new CoreStitchServiceClientImpl_1.default(authRequestClient, routes.serviceRoutes);
    }
    CoreStitchAppClient.prototype.callFunction = function (name, args, decoder) {
        return this.functionService.callFunction(name, args, decoder);
    };
    return CoreStitchAppClient;
}());
exports.default = CoreStitchAppClient;

},{"../services/internal/CoreStitchServiceClientImpl":115}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Assertions = (function () {
    function Assertions() {
    }
    Assertions.keyPresent = function (key, object) {
        if (object[key] === undefined) {
            throw new Error("expected " + key + " to be present");
        }
    };
    return Assertions;
}());
exports.default = Assertions;

},{}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_js_1 = require("base64-js");
function base64Decode(str) {
    var unevenBytes = str.length % 4;
    var strToDecode;
    if (unevenBytes != 0) {
        var paddingNeeded = 4 - unevenBytes;
        strToDecode = str + "=".repeat(paddingNeeded);
    }
    else {
        strToDecode = str;
    }
    var bytes = base64_js_1.toByteArray(strToDecode);
    return utf8Slice(bytes, 0, bytes.length);
}
exports.base64Decode = base64Decode;
function base64Encode(str) {
    var result;
    if ("undefined" === typeof Uint8Array) {
        result = utf8ToBytes(str);
    }
    result = new Uint8Array(utf8ToBytes(str));
    return base64_js_1.fromByteArray(result);
}
exports.base64Encode = base64Encode;
function utf8ToBytes(string) {
    var units = Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    var i = 0;
    for (; i < length; i++) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 0xd7ff && codePoint < 0xe000) {
            if (leadSurrogate) {
                if (codePoint < 0xdc00) {
                    if ((units -= 3) > -1) {
                        bytes.push(0xef, 0xbf, 0xbd);
                    }
                    leadSurrogate = codePoint;
                    continue;
                }
                else {
                    codePoint =
                        ((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00) | 0x10000;
                    leadSurrogate = null;
                }
            }
            else {
                if (codePoint > 0xdbff) {
                    if ((units -= 3) > -1) {
                        bytes.push(0xef, 0xbf, 0xbd);
                    }
                    continue;
                }
                else if (i + 1 === length) {
                    if ((units -= 3) > -1) {
                        bytes.push(0xef, 0xbf, 0xbd);
                    }
                    continue;
                }
                else {
                    leadSurrogate = codePoint;
                    continue;
                }
            }
        }
        else if (leadSurrogate) {
            if ((units -= 3) > -1) {
                bytes.push(0xef, 0xbf, 0xbd);
            }
            leadSurrogate = null;
        }
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) {
                break;
            }
            bytes.push(codePoint);
        }
        else if (codePoint < 0x800) {
            if ((units -= 2) < 0) {
                break;
            }
            bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) {
                break;
            }
            bytes.push((codePoint >> 0xc) | 0xe0, ((codePoint >> 0x6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint < 0x200000) {
            if ((units -= 4) < 0) {
                break;
            }
            bytes.push((codePoint >> 0x12) | 0xf0, ((codePoint >> 0xc) & 0x3f) | 0x80, ((codePoint >> 0x6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else {
            throw new Error("Invalid code point");
        }
    }
    return bytes;
}
function utf8Slice(buf, start, end) {
    var res = "";
    var tmp = "";
    end = Math.min(buf.length, end || Infinity);
    start = start || 0;
    for (var i = start; i < end; i++) {
        if (buf[i] <= 0x7f) {
            res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
            tmp = "";
        }
        else {
            tmp += "%" + buf[i].toString(16);
        }
    }
    return res + decodeUtf8Char(tmp);
}
exports.utf8Slice = utf8Slice;
function decodeUtf8Char(str) {
    try {
        return decodeURIComponent(str);
    }
    catch (err) {
        return String.fromCharCode(0xfffd);
    }
}

},{"base64-js":4}],93:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchError_1 = __importDefault(require("../../StitchError"));
var StitchRequestError_1 = __importDefault(require("../../StitchRequestError"));
var StitchRequestErrorCode_1 = require("../../StitchRequestErrorCode");
var StitchServiceError_1 = __importDefault(require("../../StitchServiceError"));
var StitchServiceErrorCode_1 = require("../../StitchServiceErrorCode");
var ContentTypes_1 = __importDefault(require("../net/ContentTypes"));
var Headers_1 = __importDefault(require("../net/Headers"));
var Fields;
(function (Fields) {
    Fields["ERROR"] = "error";
    Fields["ERROR_CODE"] = "error_code";
})(Fields || (Fields = {}));
function wrapDecodingError(err) {
    if (err instanceof StitchError_1.default) {
        return err;
    }
    return new StitchRequestError_1.default(err, StitchRequestErrorCode_1.StitchRequestErrorCode.DECODING_ERROR);
}
exports.wrapDecodingError = wrapDecodingError;
function handleRequestError(response) {
    if (response.body === undefined) {
        throw new StitchServiceError_1.default("received unexpected status code " + response.statusCode, StitchServiceErrorCode_1.StitchServiceErrorCode.Unknown);
    }
    var body;
    try {
        body = response.body;
    }
    catch (e) {
        throw new StitchServiceError_1.default("received unexpected status code " + response.statusCode, StitchServiceErrorCode_1.StitchServiceErrorCode.Unknown);
    }
    var errorMsg = handleRichError(response, body);
    throw new StitchServiceError_1.default(errorMsg, StitchServiceErrorCode_1.StitchServiceErrorCode.Unknown);
}
exports.handleRequestError = handleRequestError;
function handleRichError(response, body) {
    if (response.headers[Headers_1.default.CONTENT_TYPE] === undefined ||
        (response.headers[Headers_1.default.CONTENT_TYPE] !== undefined &&
            response.headers[Headers_1.default.CONTENT_TYPE] !== ContentTypes_1.default.APPLICATION_JSON)) {
        return body;
    }
    var bsonObj = JSON.parse(body);
    if (!(bsonObj instanceof Object)) {
        return body;
    }
    var doc = bsonObj;
    if (doc[Fields.ERROR] === undefined) {
        return body;
    }
    var errorMsg = doc[Fields.ERROR];
    if (doc[Fields.ERROR_CODE] === undefined) {
        return errorMsg;
    }
    var errorCode = doc[Fields.ERROR_CODE];
    throw new StitchServiceError_1.default(errorMsg, StitchServiceErrorCode_1.stitchServiceErrorCodeFromApi(errorCode));
}

},{"../../StitchError":45,"../../StitchRequestError":46,"../../StitchRequestErrorCode":47,"../../StitchServiceError":48,"../../StitchServiceErrorCode":49,"../net/ContentTypes":99,"../net/Headers":101}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MemoryStorage = (function () {
    function MemoryStorage(suiteName) {
        this.suiteName = suiteName;
        this.storage = {};
    }
    MemoryStorage.prototype.get = function (key) {
        return this.storage[this.suiteName + "." + key];
    };
    MemoryStorage.prototype.set = function (key, value) {
        this.storage[this.suiteName + "." + key] = value;
    };
    MemoryStorage.prototype.remove = function (key) {
        delete this.storage[this.suiteName + "." + key];
    };
    return MemoryStorage;
}());
exports.MemoryStorage = MemoryStorage;

},{}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fields;
(function (Fields) {
    Fields["DEPLOYMENT_MODEL"] = "deployment_model";
    Fields["LOCATION"] = "location";
    Fields["HOSTNAME"] = "hostname";
})(Fields || (Fields = {}));
var ApiAppMetadata = (function () {
    function ApiAppMetadata(deploymentModel, location, hostname) {
        this.deploymentModel = deploymentModel;
        this.location = location;
        this.hostname = hostname;
    }
    ApiAppMetadata.fromJSON = function (json) {
        return new ApiAppMetadata(json[Fields.DEPLOYMENT_MODEL], json[Fields.LOCATION], json[Fields.HOSTNAME]);
    };
    ApiAppMetadata.prototype.toJSON = function () {
        var _a;
        return _a = {},
            _a[Fields.DEPLOYMENT_MODEL] = this.deploymentModel,
            _a[Fields.LOCATION] = this.location,
            _a[Fields.HOSTNAME] = this.hostname,
            _a;
    };
    return ApiAppMetadata;
}());
exports.default = ApiAppMetadata;

},{}],96:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchError_1 = __importDefault(require("../../StitchError"));
var StitchRequestError_1 = __importDefault(require("../../StitchRequestError"));
var Event_1 = __importDefault(require("./Event"));
var StitchEvent_1 = __importDefault(require("./StitchEvent"));
var BaseEventStream = (function () {
    function BaseEventStream(reconnecter) {
        this.reconnecter = reconnecter;
        this.closed = false;
        this.events = [];
        this.listeners = [];
        this.lastErr = undefined;
    }
    BaseEventStream.prototype.isOpen = function () {
        return !this.closed;
    };
    BaseEventStream.prototype.addListener = function (listener) {
        var _this = this;
        if (this.closed) {
            setTimeout(function () { return listener.onEvent(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, "stream closed")); }, 0);
            return;
        }
        if (this.lastErr !== undefined) {
            setTimeout(function () { return listener.onEvent(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, _this.lastErr)); }, 0);
            return;
        }
        this.listeners.push(listener);
        this.poll();
    };
    BaseEventStream.prototype.removeListener = function (listener) {
        var index = this.listeners.indexOf(listener);
        if (index === -1) {
            return;
        }
        this.listeners.splice(index, 1);
    };
    BaseEventStream.prototype.nextEvent = function () {
        var _this = this;
        if (this.closed) {
            return Promise.reject(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, "stream closed"));
        }
        if (this.lastErr !== undefined) {
            return Promise.reject(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, this.lastErr));
        }
        return new Promise(function (resolve, reject) {
            _this.listenOnce({
                onEvent: function (e) {
                    resolve(e);
                }
            });
        });
    };
    BaseEventStream.prototype.close = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        this.afterClose();
    };
    BaseEventStream.prototype.reconnect = function (error) {
        var _this = this;
        if (!this.reconnecter) {
            if (!this.closed) {
                this.closed = true;
                this.events.push(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, "stream closed: " + error));
                this.poll();
            }
            return;
        }
        this.reconnecter()
            .then(function (next) {
            _this.onReconnect(next);
        })
            .catch(function (e) {
            if (!(e instanceof StitchError_1.default) || !(e instanceof StitchRequestError_1.default)) {
                _this.closed = true;
                _this.events.push(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, "stream closed: " + error));
                _this.poll();
                return;
            }
            setTimeout(function () { return _this.reconnect(e); }, BaseEventStream.RETRY_TIMEOUT_MILLIS);
        });
    };
    BaseEventStream.prototype.poll = function () {
        var e_1, _a;
        while (this.events.length !== 0) {
            var event_1 = this.events.pop();
            try {
                for (var _b = __values(this.listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var listener = _c.value;
                    if (listener.onEvent) {
                        listener.onEvent(event_1);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    BaseEventStream.prototype.listenOnce = function (listener) {
        var _this = this;
        if (this.closed) {
            setTimeout(function () { return listener.onEvent(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, "stream closed")); }, 0);
            return;
        }
        if (this.lastErr !== undefined) {
            setTimeout(function () { return listener.onEvent(new Event_1.default(StitchEvent_1.default.ERROR_EVENT_NAME, _this.lastErr)); }, 0);
            return;
        }
        var wrapper = {
            onEvent: function (e) {
                _this.removeListener(wrapper);
                listener.onEvent(e);
            }
        };
        this.addListener(wrapper);
    };
    BaseEventStream.RETRY_TIMEOUT_MILLIS = 5000;
    return BaseEventStream;
}());
exports.default = BaseEventStream;

},{"../../StitchError":45,"../../StitchRequestError":46,"./Event":100,"./StitchEvent":110}],97:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchErrorUtils_1 = require("../../internal/common/StitchErrorUtils");
var StitchError_1 = __importDefault(require("../../StitchError"));
var StitchRequestError_1 = __importDefault(require("../../StitchRequestError"));
var StitchRequestErrorCode_1 = require("../../StitchRequestErrorCode");
var BasicRequest_1 = require("./BasicRequest");
function inspectResponse(request, url, response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
    }
    return StitchErrorUtils_1.handleRequestError(response);
}
var BaseStitchRequestClient = (function () {
    function BaseStitchRequestClient(baseUrl, transport) {
        this.baseUrl = baseUrl;
        this.transport = transport;
    }
    BaseStitchRequestClient.prototype.doRequestToURL = function (stitchReq, url) {
        return this.transport
            .roundTrip(this.buildRequest(stitchReq, url))
            .catch(function (error) {
            throw new StitchRequestError_1.default(error, StitchRequestErrorCode_1.StitchRequestErrorCode.TRANSPORT_ERROR);
        })
            .then(function (resp) { return inspectResponse(stitchReq, url, resp); });
    };
    BaseStitchRequestClient.prototype.doStreamRequestToURL = function (stitchReq, url, open, retryRequest) {
        if (open === void 0) { open = true; }
        return this.transport
            .stream(this.buildRequest(stitchReq, url), open, retryRequest)
            .catch(function (error) {
            if (error instanceof StitchError_1.default) {
                throw error;
            }
            throw new StitchRequestError_1.default(error, StitchRequestErrorCode_1.StitchRequestErrorCode.TRANSPORT_ERROR);
        });
    };
    BaseStitchRequestClient.prototype.buildRequest = function (stitchReq, url) {
        return new BasicRequest_1.BasicRequest.Builder()
            .withMethod(stitchReq.method)
            .withUrl("" + url + stitchReq.path)
            .withHeaders(stitchReq.headers)
            .withBody(stitchReq.body)
            .build();
    };
    return BaseStitchRequestClient;
}());
exports.default = BaseStitchRequestClient;

},{"../../StitchError":45,"../../StitchRequestError":46,"../../StitchRequestErrorCode":47,"../../internal/common/StitchErrorUtils":93,"./BasicRequest":98}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicRequest = (function () {
    function BasicRequest(method, url, headers, body) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.body = body;
    }
    return BasicRequest;
}());
exports.BasicRequest = BasicRequest;
(function (BasicRequest) {
    var Builder = (function () {
        function Builder(request) {
            if (!request) {
                return;
            }
            this.method = request.method;
            this.url = request.url;
            this.headers = request.headers;
            this.body = request.body;
        }
        Builder.prototype.withMethod = function (method) {
            this.method = method;
            return this;
        };
        Builder.prototype.withUrl = function (url) {
            this.url = url;
            return this;
        };
        Builder.prototype.withHeaders = function (headers) {
            this.headers = headers;
            return this;
        };
        Builder.prototype.withBody = function (body) {
            this.body = body;
            return this;
        };
        Builder.prototype.build = function () {
            if (this.method === undefined) {
                throw new Error("must set method");
            }
            if (this.url === undefined) {
                throw new Error("must set non-empty url");
            }
            return new BasicRequest(this.method, this.url, this.headers === undefined ? {} : this.headers, this.body);
        };
        return Builder;
    }());
    BasicRequest.Builder = Builder;
})(BasicRequest = exports.BasicRequest || (exports.BasicRequest = {}));
exports.BasicRequest = BasicRequest;

},{}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentTypes = (function () {
    function ContentTypes() {
    }
    ContentTypes.APPLICATION_JSON = "application/json";
    ContentTypes.TEXT_EVENT_STREAM = "text/event-stream";
    return ContentTypes;
}());
exports.default = ContentTypes;

},{}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = (function () {
    function Event(eventName, data) {
        this.eventName = eventName;
        this.data = data;
    }
    Event.MESSAGE_EVENT = "message";
    return Event;
}());
exports.default = Event;

},{}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Headers = (function () {
    function Headers() {
    }
    Headers.getAuthorizationBearer = function (value) {
        return Headers.AUTHORIZATION_BEARER + " " + value;
    };
    Headers.CONTENT_TYPE_CANON = "Content-Type";
    Headers.CONTENT_TYPE = Headers.CONTENT_TYPE_CANON.toLocaleLowerCase();
    Headers.AUTHORIZATION_CANON = "Authorization";
    Headers.AUTHORIZATION = Headers.AUTHORIZATION_CANON.toLocaleLowerCase();
    Headers.ACCEPT_CANON = "Accept";
    Headers.ACCEPT = Headers.ACCEPT_CANON.toLocaleLowerCase();
    Headers.AUTHORIZATION_BEARER = "Bearer";
    return Headers;
}());
exports.default = Headers;

},{}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Method;
(function (Method) {
    Method["GET"] = "GET";
    Method["POST"] = "POST";
    Method["PUT"] = "PUT";
    Method["DELETE"] = "DELETE";
    Method["HEAD"] = "HEAD";
    Method["OPTIONS"] = "OPTIONS";
    Method["TRACE"] = "TRACE";
    Method["PATCH"] = "PATCH";
})(Method || (Method = {}));
exports.default = Method;

},{}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response = (function () {
    function Response(headers, statusCode, body) {
        var _this = this;
        this.statusCode = statusCode;
        this.body = body;
        this.headers = {};
        Object.keys(headers).map(function (key, index) {
            _this.headers[key.toLocaleLowerCase()] = headers[key];
        });
    }
    return Response;
}());
exports.default = Response;

},{}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchRoutes_1 = require("./StitchRoutes");
function getAuthProviderRoute(clientAppId, providerName) {
    return StitchRoutes_1.getAppRoute(clientAppId) + ("/auth/providers/" + providerName);
}
function getAuthProviderLoginRoute(clientAppId, providerName) {
    return getAuthProviderRoute(clientAppId, providerName) + "/login";
}
function getAuthProviderLinkRoute(clientAppId, providerName) {
    return getAuthProviderLoginRoute(clientAppId, providerName) + "?link=true";
}
var StitchAppAuthRoutes = (function () {
    function StitchAppAuthRoutes(clientAppId) {
        var _this = this;
        this.baseAuthRoute = StitchRoutes_1.BASE_ROUTE + "/auth";
        this.sessionRoute = (function () {
            return _this.baseAuthRoute + "/session";
        })();
        this.profileRoute = (function () {
            return _this.baseAuthRoute + "/profile";
        })();
        this.clientAppId = clientAppId;
    }
    StitchAppAuthRoutes.prototype.getAuthProviderRoute = function (providerName) {
        return getAuthProviderRoute(this.clientAppId, providerName);
    };
    StitchAppAuthRoutes.prototype.getAuthProviderLoginRoute = function (providerName) {
        return getAuthProviderLoginRoute(this.clientAppId, providerName);
    };
    StitchAppAuthRoutes.prototype.getAuthProviderLinkRoute = function (providerName) {
        return getAuthProviderLinkRoute(this.clientAppId, providerName);
    };
    StitchAppAuthRoutes.prototype.getAuthProviderExtensionRoute = function (providerName, path) {
        return this.getAuthProviderRoute(providerName) + "/" + path;
    };
    return StitchAppAuthRoutes;
}());
exports.default = StitchAppAuthRoutes;

},{"./StitchRoutes":113}],105:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var ApiAppMetadata_1 = __importDefault(require("./ApiAppMetadata"));
var BaseStitchRequestClient_1 = __importDefault(require("./BaseStitchRequestClient"));
var Method_1 = __importDefault(require("./Method"));
var StitchAppRoutes_1 = __importDefault(require("./StitchAppRoutes"));
var StitchRequest_1 = require("./StitchRequest");
var StitchAppRequestClient = (function (_super) {
    __extends(StitchAppRequestClient, _super);
    function StitchAppRequestClient(clientAppId, baseUrl, transport) {
        var _this = _super.call(this, baseUrl, transport) || this;
        _this.clientAppId = clientAppId;
        _this.routes = new StitchAppRoutes_1.default(clientAppId);
        return _this;
    }
    StitchAppRequestClient.prototype.doRequest = function (stitchReq) {
        var _this = this;
        return this.initAppMetadata()
            .then(function (metadata) { return _super.prototype.doRequestToURL.call(_this, stitchReq, metadata.hostname); });
    };
    StitchAppRequestClient.prototype.doStreamRequest = function (stitchReq, open, retryRequest) {
        var _this = this;
        if (open === void 0) { open = true; }
        return this.initAppMetadata()
            .then(function (metadata) { return _super.prototype.doStreamRequestToURL.call(_this, stitchReq, metadata.hostname, open, retryRequest); });
    };
    StitchAppRequestClient.prototype.getBaseURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.initAppMetadata().then(function (metadata) { return metadata.hostname; })];
            });
        });
    };
    StitchAppRequestClient.prototype.initAppMetadata = function () {
        var _this = this;
        if (this.appMetadata) {
            return Promise.resolve(this.appMetadata);
        }
        var request = new StitchRequest_1.StitchRequest.Builder()
            .withMethod(Method_1.default.GET)
            .withPath(this.routes.appMetadataRoute)
            .build();
        return _super.prototype.doRequestToURL.call(this, request, this.baseUrl)
            .then(function (resp) {
            _this.appMetadata = ApiAppMetadata_1.default.fromJSON(bson_1.EJSON.parse(resp.body));
            return _this.appMetadata;
        });
    };
    return StitchAppRequestClient;
}(BaseStitchRequestClient_1.default));
exports.default = StitchAppRequestClient;

},{"./ApiAppMetadata":95,"./BaseStitchRequestClient":97,"./Method":102,"./StitchAppRoutes":106,"./StitchRequest":111,"bson":5}],106:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StitchServiceRoutes_1 = __importDefault(require("../../services/internal/StitchServiceRoutes"));
var StitchAppAuthRoutes_1 = __importDefault(require("./StitchAppAuthRoutes"));
var StitchRoutes_1 = require("./StitchRoutes");
var StitchAppRoutes = (function () {
    function StitchAppRoutes(clientAppId) {
        this.clientAppId = clientAppId;
        this.authRoutes = new StitchAppAuthRoutes_1.default(clientAppId);
        this.serviceRoutes = new StitchServiceRoutes_1.default(clientAppId);
        this.appMetadataRoute = StitchRoutes_1.getAppMetadataRoute(clientAppId);
        this.functionCallRoute = StitchRoutes_1.getFunctionCallRoute(clientAppId);
    }
    return StitchAppRoutes;
}());
exports.default = StitchAppRoutes;

},{"../../services/internal/StitchServiceRoutes":117,"./StitchAppAuthRoutes":104,"./StitchRoutes":113}],107:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var ContentTypes_1 = __importDefault(require("./ContentTypes"));
var Headers_1 = __importDefault(require("./Headers"));
var StitchAuthRequest_1 = require("./StitchAuthRequest");
var StitchAuthDocRequest = (function (_super) {
    __extends(StitchAuthDocRequest, _super);
    function StitchAuthDocRequest(request, document) {
        var _this = this;
        request instanceof StitchAuthRequest_1.StitchAuthRequest
            ? _this = _super.call(this, request, request.useRefreshToken, request.shouldRefreshOnFailure) || this : _this = _super.call(this, request) || this;
        _this.document = document;
        return _this;
    }
    Object.defineProperty(StitchAuthDocRequest.prototype, "builder", {
        get: function () {
            return new StitchAuthDocRequest.Builder(this);
        },
        enumerable: true,
        configurable: true
    });
    return StitchAuthDocRequest;
}(StitchAuthRequest_1.StitchAuthRequest));
exports.StitchAuthDocRequest = StitchAuthDocRequest;
(function (StitchAuthDocRequest) {
    var Builder = (function (_super) {
        __extends(Builder, _super);
        function Builder(request) {
            var _this = _super.call(this, request) || this;
            if (request !== undefined) {
                _this.document = request.document;
                _this.useRefreshToken = request.useRefreshToken;
            }
            return _this;
        }
        Builder.prototype.withDocument = function (document) {
            this.document = document;
            return this;
        };
        Builder.prototype.withAccessToken = function () {
            this.useRefreshToken = false;
            return this;
        };
        Builder.prototype.build = function () {
            if (this.document === undefined || !(this.document instanceof Object)) {
                throw new Error("document must be set: " + this.document);
            }
            if (this.headers === undefined) {
                this.withHeaders({});
            }
            this.headers[Headers_1.default.CONTENT_TYPE] = ContentTypes_1.default.APPLICATION_JSON;
            this.withBody(bson_1.EJSON.stringify(this.document, { relaxed: false }));
            return new StitchAuthDocRequest(_super.prototype.build.call(this), this.document);
        };
        return Builder;
    }(StitchAuthRequest_1.StitchAuthRequest.Builder));
    StitchAuthDocRequest.Builder = Builder;
})(StitchAuthDocRequest = exports.StitchAuthDocRequest || (exports.StitchAuthDocRequest = {}));
exports.StitchAuthDocRequest = StitchAuthDocRequest;

},{"./ContentTypes":99,"./Headers":101,"./StitchAuthRequest":108,"bson":5}],108:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StitchRequest_1 = require("./StitchRequest");
var StitchAuthRequest = (function (_super) {
    __extends(StitchAuthRequest, _super);
    function StitchAuthRequest(request, useRefreshToken, shouldRefreshOnFailure) {
        if (useRefreshToken === void 0) { useRefreshToken = false; }
        if (shouldRefreshOnFailure === void 0) { shouldRefreshOnFailure = true; }
        var _this = _super.call(this, request.method, request.path, request.headers, request.startedAt, request.body) || this;
        _this.useRefreshToken = useRefreshToken;
        _this.shouldRefreshOnFailure = shouldRefreshOnFailure;
        return _this;
    }
    Object.defineProperty(StitchAuthRequest.prototype, "builder", {
        get: function () {
            return new StitchAuthRequest.Builder(this);
        },
        enumerable: true,
        configurable: true
    });
    return StitchAuthRequest;
}(StitchRequest_1.StitchRequest));
exports.StitchAuthRequest = StitchAuthRequest;
(function (StitchAuthRequest) {
    var Builder = (function (_super) {
        __extends(Builder, _super);
        function Builder(request) {
            return _super.call(this, request) || this;
        }
        Builder.prototype.withAccessToken = function () {
            this.useRefreshToken = false;
            return this;
        };
        Builder.prototype.withRefreshToken = function () {
            this.useRefreshToken = true;
            return this;
        };
        Builder.prototype.withShouldRefreshOnFailure = function (shouldRefreshOnFailure) {
            this.shouldRefreshOnFailure = shouldRefreshOnFailure;
            return this;
        };
        Builder.prototype.build = function () {
            if (this.useRefreshToken) {
                this.shouldRefreshOnFailure = false;
            }
            return new StitchAuthRequest(_super.prototype.build.call(this), this.useRefreshToken, this.shouldRefreshOnFailure);
        };
        return Builder;
    }(StitchRequest_1.StitchRequest.Builder));
    StitchAuthRequest.Builder = Builder;
})(StitchAuthRequest = exports.StitchAuthRequest || (exports.StitchAuthRequest = {}));
exports.StitchAuthRequest = StitchAuthRequest;

},{"./StitchRequest":111}],109:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var ContentTypes_1 = __importDefault(require("./ContentTypes"));
var Headers_1 = __importDefault(require("./Headers"));
var StitchRequest_1 = require("./StitchRequest");
var StitchDocRequest = (function (_super) {
    __extends(StitchDocRequest, _super);
    function StitchDocRequest(request, document) {
        var _this = _super.call(this, request.method, request.path, request.headers, request.startedAt, request.body) || this;
        _this.document = document;
        return _this;
    }
    Object.defineProperty(StitchDocRequest.prototype, "builder", {
        get: function () {
            return new StitchDocRequest.Builder(this);
        },
        enumerable: true,
        configurable: true
    });
    return StitchDocRequest;
}(StitchRequest_1.StitchRequest));
exports.StitchDocRequest = StitchDocRequest;
(function (StitchDocRequest) {
    var Builder = (function (_super) {
        __extends(Builder, _super);
        function Builder(request) {
            var _this = _super.call(this, request) || this;
            if (request !== undefined) {
                _this.document = request.document;
            }
            return _this;
        }
        Builder.prototype.withDocument = function (document) {
            this.document = document;
            return this;
        };
        Builder.prototype.build = function () {
            if (this.document === undefined || !(this.document instanceof Object)) {
                throw new Error("document must be set");
            }
            if (this.headers === undefined) {
                this.withHeaders({});
            }
            this.headers[Headers_1.default.CONTENT_TYPE] = ContentTypes_1.default.APPLICATION_JSON;
            this.withBody(bson_1.EJSON.stringify(this.document, { relaxed: false }));
            return new StitchDocRequest(_super.prototype.build.call(this), this.document);
        };
        return Builder;
    }(StitchRequest_1.StitchRequest.Builder));
    StitchDocRequest.Builder = Builder;
})(StitchDocRequest = exports.StitchDocRequest || (exports.StitchDocRequest = {}));
exports.StitchDocRequest = StitchDocRequest;

},{"./ContentTypes":99,"./Headers":101,"./StitchRequest":111,"bson":5}],110:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var StitchServiceError_1 = __importDefault(require("../../StitchServiceError"));
var StitchServiceErrorCode_1 = require("../../StitchServiceErrorCode");
var Event_1 = __importDefault(require("./Event"));
var StitchEvent = (function () {
    function StitchEvent(eventName, data, decoder) {
        this.eventName = eventName;
        data = data ? data : "";
        var decodedStringBuffer = [];
        for (var chIdx = 0; chIdx < data.length; chIdx++) {
            var c = data[chIdx];
            switch (c) {
                case '%':
                    if (chIdx + 2 >= data.length) {
                        break;
                    }
                    var code = data.substring(chIdx + 1, chIdx + 3);
                    var found = void 0;
                    switch (code) {
                        case "25":
                            found = true;
                            decodedStringBuffer.push("%");
                            break;
                        case "0A":
                            found = true;
                            decodedStringBuffer.push("\n");
                            break;
                        case "0D":
                            found = true;
                            decodedStringBuffer.push("\r");
                            break;
                        default:
                            found = false;
                    }
                    if (found) {
                        chIdx += 2;
                        continue;
                    }
                    break;
                default:
                    break;
            }
            decodedStringBuffer.push(c);
        }
        var decodedData = decodedStringBuffer.join('');
        switch (this.eventName) {
            case StitchEvent.ERROR_EVENT_NAME:
                var errorMsg = void 0;
                var errorCode = void 0;
                try {
                    var errorDoc = bson_1.EJSON.parse(decodedData, { strict: false });
                    errorMsg = errorDoc[ErrorFields.Error];
                    errorCode = StitchServiceErrorCode_1.stitchServiceErrorCodeFromApi(errorDoc[ErrorFields.ErrorCode]);
                }
                catch (error) {
                    errorMsg = decodedData;
                    errorCode = StitchServiceErrorCode_1.StitchServiceErrorCode.Unknown;
                }
                this.error = new StitchServiceError_1.default(errorMsg, errorCode);
                break;
            case Event_1.default.MESSAGE_EVENT:
                this.data = bson_1.EJSON.parse(decodedData, { strict: false });
                if (decoder) {
                    this.data = decoder.decode(this.data);
                }
                break;
        }
    }
    StitchEvent.fromEvent = function (event, decoder) {
        return new StitchEvent(event.eventName, event.data, decoder);
    };
    StitchEvent.ERROR_EVENT_NAME = "error";
    return StitchEvent;
}());
exports.default = StitchEvent;
var ErrorFields;
(function (ErrorFields) {
    ErrorFields["Error"] = "error";
    ErrorFields["ErrorCode"] = "error_code";
})(ErrorFields || (ErrorFields = {}));

},{"../../StitchServiceError":48,"../../StitchServiceErrorCode":49,"./Event":100,"bson":5}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchRequest = (function () {
    function StitchRequest(method, path, headers, startedAt, body) {
        this.method = method;
        this.path = path;
        this.headers = headers;
        this.body = body;
        this.startedAt = startedAt;
    }
    Object.defineProperty(StitchRequest.prototype, "builder", {
        get: function () {
            return new StitchRequest.Builder(this);
        },
        enumerable: true,
        configurable: true
    });
    return StitchRequest;
}());
exports.StitchRequest = StitchRequest;
(function (StitchRequest) {
    var Builder = (function () {
        function Builder(request) {
            if (request !== undefined) {
                this.method = request.method;
                this.path = request.path;
                this.headers = request.headers;
                this.body = request.body;
                this.startedAt = request.startedAt;
            }
        }
        Builder.prototype.withMethod = function (method) {
            this.method = method;
            return this;
        };
        Builder.prototype.withPath = function (path) {
            this.path = path;
            return this;
        };
        Builder.prototype.withHeaders = function (headers) {
            this.headers = headers;
            return this;
        };
        Builder.prototype.withBody = function (body) {
            this.body = body;
            return this;
        };
        Builder.prototype.build = function () {
            if (this.method === undefined) {
                throw Error("must set method");
            }
            if (this.path === undefined) {
                throw Error("must set non-empty path");
            }
            if (this.startedAt === undefined) {
                this.startedAt = Date.now() / 1000;
            }
            return new StitchRequest(this.method, this.path, this.headers === undefined ? {} : this.headers, this.startedAt, this.body);
        };
        return Builder;
    }());
    StitchRequest.Builder = Builder;
})(StitchRequest = exports.StitchRequest || (exports.StitchRequest = {}));
exports.StitchRequest = StitchRequest;

},{}],112:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseStitchRequestClient_1 = __importDefault(require("./BaseStitchRequestClient"));
var StitchRequestClient = (function (_super) {
    __extends(StitchRequestClient, _super);
    function StitchRequestClient(baseUrl, transport) {
        return _super.call(this, baseUrl, transport) || this;
    }
    StitchRequestClient.prototype.doRequest = function (stitchReq) {
        return _super.prototype.doRequestToURL.call(this, stitchReq, this.baseUrl);
    };
    StitchRequestClient.prototype.doStreamRequest = function (stitchReq, open, retryRequest) {
        if (open === void 0) { open = true; }
        return _super.prototype.doStreamRequestToURL.call(this, stitchReq, this.baseUrl, open, retryRequest);
    };
    StitchRequestClient.prototype.getBaseURL = function () {
        return Promise.resolve(this.baseUrl);
    };
    return StitchRequestClient;
}(BaseStitchRequestClient_1.default));
exports.default = StitchRequestClient;

},{"./BaseStitchRequestClient":97}],113:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BASE_ROUTE = "/api/client/v2.0";
exports.BASE_ROUTE = BASE_ROUTE;
function getAppRoute(clientAppId) {
    return BASE_ROUTE + ("/app/" + clientAppId);
}
exports.getAppRoute = getAppRoute;
function getFunctionCallRoute(clientAppId) {
    return getAppRoute(clientAppId) + "/functions/call";
}
exports.getFunctionCallRoute = getFunctionCallRoute;
function getAppMetadataRoute(clientAppId) {
    return getAppRoute(clientAppId) + "/location";
}
exports.getAppMetadataRoute = getAppMetadataRoute;

},{}],114:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RebindEvent_1 = require("./RebindEvent");
var AuthRebindEvent = (function (_super) {
    __extends(AuthRebindEvent, _super);
    function AuthRebindEvent(event) {
        var _this = _super.call(this) || this;
        _this.type = RebindEvent_1.RebindEventType.AUTH_EVENT;
        _this.event = event;
        return _this;
    }
    return AuthRebindEvent;
}(RebindEvent_1.RebindEvent));
exports.default = AuthRebindEvent;

},{"./RebindEvent":116}],115:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var AuthEvent_1 = require("../../auth/internal/AuthEvent");
var Base64_1 = require("../../internal/common/Base64");
var Method_1 = __importDefault(require("../../internal/net/Method"));
var StitchAuthDocRequest_1 = require("../../internal/net/StitchAuthDocRequest");
var StitchAuthRequest_1 = require("../../internal/net/StitchAuthRequest");
var RebindEvent_1 = require("./RebindEvent");
var CoreStitchServiceClientImpl = (function () {
    function CoreStitchServiceClientImpl(requestClient, routes, name) {
        this.serviceField = "service";
        this.argumentsField = "arguments";
        this.requestClient = requestClient;
        this.serviceRoutes = routes;
        this.serviceName = name;
        this.serviceBinders = [];
        this.allocatedStreams = [];
    }
    CoreStitchServiceClientImpl.prototype.callFunction = function (name, args, decoder) {
        return this.requestClient.doAuthenticatedRequestWithDecoder(this.getCallServiceFunctionRequest(name, args), decoder);
    };
    CoreStitchServiceClientImpl.prototype.streamFunction = function (name, args, decoder) {
        var _this = this;
        return this.requestClient.openAuthenticatedStreamWithDecoder(this.getStreamServiceFunctionRequest(name, args), decoder).then(function (newStream) {
            _this.allocatedStreams.push(newStream);
            return newStream;
        });
    };
    CoreStitchServiceClientImpl.prototype.bind = function (binder) {
        this.serviceBinders.push(binder);
    };
    CoreStitchServiceClientImpl.prototype.onRebindEvent = function (rebindEvent) {
        switch (rebindEvent.type) {
            case RebindEvent_1.RebindEventType.AUTH_EVENT:
                var authRebindEvent = rebindEvent;
                if (authRebindEvent.event.kind === AuthEvent_1.AuthEventKind.ActiveUserChanged) {
                    this.closeAllocatedStreams();
                }
                break;
            default:
                break;
        }
        this.serviceBinders.forEach(function (binder) {
            binder.onRebindEvent(rebindEvent);
        });
    };
    CoreStitchServiceClientImpl.prototype.getStreamServiceFunctionRequest = function (name, args) {
        var body = { name: name };
        if (this.serviceName !== undefined) {
            body[this.serviceField] = this.serviceName;
        }
        body[this.argumentsField] = args;
        var reqBuilder = new StitchAuthRequest_1.StitchAuthRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.GET)
            .withPath(this.serviceRoutes.functionCallRoute +
            ("?stitch_request=" + encodeURIComponent(Base64_1.base64Encode(bson_1.EJSON.stringify(body)))));
        return reqBuilder.build();
    };
    CoreStitchServiceClientImpl.prototype.getCallServiceFunctionRequest = function (name, args) {
        var body = { name: name };
        if (this.serviceName !== undefined) {
            body[this.serviceField] = this.serviceName;
        }
        body[this.argumentsField] = args;
        var reqBuilder = new StitchAuthDocRequest_1.StitchAuthDocRequest.Builder();
        reqBuilder
            .withMethod(Method_1.default.POST)
            .withPath(this.serviceRoutes.functionCallRoute);
        reqBuilder.withDocument(body);
        return reqBuilder.build();
    };
    CoreStitchServiceClientImpl.prototype.closeAllocatedStreams = function () {
        this.allocatedStreams.forEach(function (stream) {
            if (stream.isOpen()) {
                stream.close();
            }
        });
        this.allocatedStreams = [];
    };
    return CoreStitchServiceClientImpl;
}());
exports.default = CoreStitchServiceClientImpl;

},{"../../auth/internal/AuthEvent":55,"../../internal/common/Base64":92,"../../internal/net/Method":102,"../../internal/net/StitchAuthDocRequest":107,"../../internal/net/StitchAuthRequest":108,"./RebindEvent":116,"bson":5}],116:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RebindEvent = (function () {
    function RebindEvent() {
    }
    return RebindEvent;
}());
exports.RebindEvent = RebindEvent;
var RebindEventType;
(function (RebindEventType) {
    RebindEventType[RebindEventType["AUTH_EVENT"] = 0] = "AUTH_EVENT";
})(RebindEventType = exports.RebindEventType || (exports.RebindEventType = {}));

},{}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StitchRoutes_1 = require("../../internal/net/StitchRoutes");
var StitchServiceRoutes = (function () {
    function StitchServiceRoutes(clientAppId) {
        this.clientAppId = clientAppId;
        this.functionCallRoute = StitchRoutes_1.getFunctionCallRoute(clientAppId);
    }
    return StitchServiceRoutes;
}());
exports.default = StitchServiceRoutes;

},{"../../internal/net/StitchRoutes":113}],118:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperationType;
(function (OperationType) {
    OperationType["Insert"] = "insert";
    OperationType["Delete"] = "delete";
    OperationType["Replace"] = "replace";
    OperationType["Update"] = "update";
    OperationType["Unknown"] = "unknown";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
function operationTypeFromRemote(type) {
    switch (type) {
        case "insert":
            return OperationType.Insert;
        case "delete":
            return OperationType.Delete;
        case "replace":
            return OperationType.Replace;
        case "update":
            return OperationType.Update;
        default:
            return OperationType.Unknown;
    }
}
exports.operationTypeFromRemote = operationTypeFromRemote;

},{}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteInsertManyResult = (function () {
    function RemoteInsertManyResult(arr) {
        var inserted = {};
        arr.forEach(function (value, index) {
            inserted[index] = value;
        });
        this.insertedIds = inserted;
    }
    return RemoteInsertManyResult;
}());
exports.default = RemoteInsertManyResult;

},{}],120:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CoreRemoteMongoClientImpl_1 = __importDefault(require("./internal/CoreRemoteMongoClientImpl"));
exports.CoreRemoteMongoClientImpl = CoreRemoteMongoClientImpl_1.default;
var CoreRemoteMongoCollectionImpl_1 = __importDefault(require("./internal/CoreRemoteMongoCollectionImpl"));
exports.CoreRemoteMongoCollectionImpl = CoreRemoteMongoCollectionImpl_1.default;
var CoreRemoteMongoDatabaseImpl_1 = __importDefault(require("./internal/CoreRemoteMongoDatabaseImpl"));
exports.CoreRemoteMongoDatabaseImpl = CoreRemoteMongoDatabaseImpl_1.default;
var CoreRemoteMongoReadOperation_1 = __importDefault(require("./internal/CoreRemoteMongoReadOperation"));
exports.CoreRemoteMongoReadOperation = CoreRemoteMongoReadOperation_1.default;
var OperationType_1 = require("./OperationType");
exports.OperationType = OperationType_1.OperationType;
var RemoteInsertManyResult_1 = __importDefault(require("./RemoteInsertManyResult"));
exports.RemoteInsertManyResult = RemoteInsertManyResult_1.default;

},{"./OperationType":118,"./RemoteInsertManyResult":119,"./internal/CoreRemoteMongoClientImpl":121,"./internal/CoreRemoteMongoCollectionImpl":122,"./internal/CoreRemoteMongoDatabaseImpl":123,"./internal/CoreRemoteMongoReadOperation":124}],121:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CoreRemoteMongoDatabaseImpl_1 = __importDefault(require("./CoreRemoteMongoDatabaseImpl"));
var CoreRemoteMongoClientImpl = (function () {
    function CoreRemoteMongoClientImpl(service) {
        this.service = service;
    }
    CoreRemoteMongoClientImpl.prototype.db = function (name) {
        return new CoreRemoteMongoDatabaseImpl_1.default(name, this.service);
    };
    return CoreRemoteMongoClientImpl;
}());
exports.default = CoreRemoteMongoClientImpl;

},{"./CoreRemoteMongoDatabaseImpl":123}],122:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = __importDefault(require("bson"));
var CoreRemoteMongoReadOperation_1 = __importDefault(require("./CoreRemoteMongoReadOperation"));
var ResultDecoders_1 = __importDefault(require("./ResultDecoders"));
var CoreRemoteMongoCollectionImpl = (function () {
    function CoreRemoteMongoCollectionImpl(name, databaseName, service, codec) {
        var _this = this;
        this.name = name;
        this.databaseName = databaseName;
        this.service = service;
        this.codec = codec;
        this.namespace = this.databaseName + "." + this.name;
        this.baseOperationArgs = (function () { return ({
            collection: _this.name,
            database: _this.databaseName
        }); })();
    }
    CoreRemoteMongoCollectionImpl.prototype.withCollectionType = function (codec) {
        return new CoreRemoteMongoCollectionImpl(this.name, this.databaseName, this.service, codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.find = function (filter, options) {
        if (filter === void 0) { filter = {}; }
        var args = __assign({}, this.baseOperationArgs);
        args.query = filter;
        if (options) {
            if (options.limit) {
                args.limit = options.limit;
            }
            if (options.projection) {
                args.project = options.projection;
            }
            if (options.sort) {
                args.sort = options.sort;
            }
        }
        return new CoreRemoteMongoReadOperation_1.default("find", args, this.service, this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.findOne = function (filter, options) {
        if (filter === void 0) { filter = {}; }
        var args = __assign({}, this.baseOperationArgs);
        args.query = filter;
        if (options) {
            if (options.projection) {
                args.project = options.projection;
            }
            if (options.sort) {
                args.sort = options.sort;
            }
        }
        return this.service.callFunction("findOne", [args], this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.findOneAndUpdate = function (filter, update, options) {
        var args = __assign({}, this.baseOperationArgs);
        args.filter = filter;
        args.update = update;
        if (options) {
            if (options.projection) {
                args.projection = options.projection;
            }
            if (options.sort) {
                args.sort = options.sort;
            }
            if (options.upsert) {
                args.upsert = true;
            }
            if (options.returnNewDocument) {
                args.returnNewDocument = true;
            }
        }
        return this.service.callFunction("findOneAndUpdate", [args], this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.findOneAndReplace = function (filter, replacement, options) {
        var args = __assign({}, this.baseOperationArgs);
        args.filter = filter;
        args.update = replacement;
        if (options) {
            if (options.projection) {
                args.projection = options.projection;
            }
            if (options.sort) {
                args.sort = options.sort;
            }
            if (options.upsert) {
                args.upsert = true;
            }
            if (options.returnNewDocument) {
                args.returnNewDocument = true;
            }
        }
        return this.service.callFunction("findOneAndReplace", [args], this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.findOneAndDelete = function (filter, options) {
        var args = __assign({}, this.baseOperationArgs);
        args.filter = filter;
        if (options) {
            if (options.projection) {
                args.projection = options.projection;
            }
            if (options.sort) {
                args.sort = options.sort;
            }
        }
        return this.service.callFunction("findOneAndDelete", [args], this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.aggregate = function (pipeline) {
        var args = __assign({}, this.baseOperationArgs);
        args.pipeline = pipeline;
        return new CoreRemoteMongoReadOperation_1.default("aggregate", args, this.service, this.codec);
    };
    CoreRemoteMongoCollectionImpl.prototype.count = function (query, options) {
        if (query === void 0) { query = {}; }
        var args = __assign({}, this.baseOperationArgs);
        args.query = query;
        if (options && options.limit) {
            args.limit = options.limit;
        }
        return this.service.callFunction("count", [args]);
    };
    CoreRemoteMongoCollectionImpl.prototype.insertOne = function (value) {
        var args = __assign({}, this.baseOperationArgs);
        args.document = this.generateObjectIdIfMissing(this.codec ? this.codec.encode(value) : value);
        return this.service.callFunction("insertOne", [args], ResultDecoders_1.default.remoteInsertOneResultDecoder);
    };
    CoreRemoteMongoCollectionImpl.prototype.insertMany = function (docs) {
        var _this = this;
        var args = __assign({}, this.baseOperationArgs);
        args.documents = docs.map(function (doc) {
            return _this.generateObjectIdIfMissing(_this.codec ? _this.codec.encode(doc) : doc);
        });
        return this.service.callFunction("insertMany", [args], ResultDecoders_1.default.remoteInsertManyResultDecoder);
    };
    CoreRemoteMongoCollectionImpl.prototype.deleteOne = function (query) {
        return this.executeDelete(query, false);
    };
    CoreRemoteMongoCollectionImpl.prototype.deleteMany = function (query) {
        return this.executeDelete(query, true);
    };
    CoreRemoteMongoCollectionImpl.prototype.updateOne = function (query, update, options) {
        return this.executeUpdate(query, update, options, false);
    };
    CoreRemoteMongoCollectionImpl.prototype.updateMany = function (query, update, options) {
        return this.executeUpdate(query, update, options, true);
    };
    CoreRemoteMongoCollectionImpl.prototype.watch = function (arg) {
        var args = __assign({}, this.baseOperationArgs);
        if (arg !== undefined) {
            if (arg instanceof Array) {
                if (arg.length !== 0) {
                    args.ids = arg;
                }
            }
            else if (arg instanceof Object) {
                args.filter = arg;
            }
        }
        args.useCompactEvents = false;
        return this.service.streamFunction("watch", [args], new ResultDecoders_1.default.ChangeEventDecoder(this.codec));
    };
    CoreRemoteMongoCollectionImpl.prototype.watchCompact = function (ids) {
        var args = __assign({}, this.baseOperationArgs);
        args.ids = ids;
        args.useCompactEvents = true;
        return this.service.streamFunction("watch", [args], new ResultDecoders_1.default.CompactChangeEventDecoder(this.codec));
    };
    CoreRemoteMongoCollectionImpl.prototype.executeDelete = function (query, multi) {
        var args = __assign({}, this.baseOperationArgs);
        args.query = query;
        return this.service.callFunction(multi ? "deleteMany" : "deleteOne", [args], ResultDecoders_1.default.remoteDeleteResultDecoder);
    };
    CoreRemoteMongoCollectionImpl.prototype.executeUpdate = function (query, update, options, multi) {
        if (multi === void 0) { multi = false; }
        var args = __assign({}, this.baseOperationArgs);
        args.query = query;
        args.update = update;
        if (options && options.upsert) {
            args.upsert = options.upsert;
        }
        return this.service.callFunction(multi ? "updateMany" : "updateOne", [args], ResultDecoders_1.default.remoteUpdateResultDecoder);
    };
    CoreRemoteMongoCollectionImpl.prototype.generateObjectIdIfMissing = function (doc) {
        if (!doc._id) {
            var newDoc = doc;
            newDoc._id = new bson_1.default.ObjectID();
            return newDoc;
        }
        return doc;
    };
    return CoreRemoteMongoCollectionImpl;
}());
exports.default = CoreRemoteMongoCollectionImpl;

},{"./CoreRemoteMongoReadOperation":124,"./ResultDecoders":125,"bson":5}],123:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CoreRemoteMongoCollectionImpl_1 = __importDefault(require("./CoreRemoteMongoCollectionImpl"));
var CoreRemoteMongoDatabaseImpl = (function () {
    function CoreRemoteMongoDatabaseImpl(name, service) {
        this.name = name;
        this.service = service;
    }
    CoreRemoteMongoDatabaseImpl.prototype.collection = function (name, codec) {
        return new CoreRemoteMongoCollectionImpl_1.default(name, this.name, this.service, codec);
    };
    return CoreRemoteMongoDatabaseImpl;
}());
exports.default = CoreRemoteMongoDatabaseImpl;

},{"./CoreRemoteMongoCollectionImpl":122}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoreRemoteMongoReadOperation = (function () {
    function CoreRemoteMongoReadOperation(command, args, service, decoder) {
        this.command = command;
        this.args = args;
        this.service = service;
        if (decoder) {
            this.collectionDecoder = new (function () {
                function class_1() {
                }
                class_1.prototype.decode = function (from) {
                    if (from instanceof Array) {
                        return from.map(function (t) { return decoder.decode(t); });
                    }
                    return [decoder.decode(from)];
                };
                return class_1;
            }())();
        }
    }
    CoreRemoteMongoReadOperation.prototype.iterator = function () {
        return this.executeRead().then(function (res) { return res[Symbol.iterator](); });
    };
    CoreRemoteMongoReadOperation.prototype.first = function () {
        return this.executeRead().then(function (res) { return res[0]; });
    };
    CoreRemoteMongoReadOperation.prototype.toArray = function () {
        return this.executeRead();
    };
    CoreRemoteMongoReadOperation.prototype.asArray = function () {
        return this.toArray();
    };
    CoreRemoteMongoReadOperation.prototype.executeRead = function () {
        return this.service.callFunction(this.command, [this.args], this.collectionDecoder);
    };
    return CoreRemoteMongoReadOperation;
}());
exports.default = CoreRemoteMongoReadOperation;

},{}],125:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_stitch_core_sdk_1 = require("mongodb-stitch-core-sdk");
var OperationType_1 = require("../OperationType");
var RemoteInsertManyResult_1 = __importDefault(require("../RemoteInsertManyResult"));
var RemoteInsertManyResultFields;
(function (RemoteInsertManyResultFields) {
    RemoteInsertManyResultFields["InsertedIds"] = "insertedIds";
})(RemoteInsertManyResultFields || (RemoteInsertManyResultFields = {}));
var RemoteInsertOneResultFields;
(function (RemoteInsertOneResultFields) {
    RemoteInsertOneResultFields["InsertedId"] = "insertedId";
})(RemoteInsertOneResultFields || (RemoteInsertOneResultFields = {}));
var RemoteUpdateResultFields;
(function (RemoteUpdateResultFields) {
    RemoteUpdateResultFields["MatchedCount"] = "matchedCount";
    RemoteUpdateResultFields["ModifiedCount"] = "modifiedCount";
    RemoteUpdateResultFields["UpsertedId"] = "upsertedId";
})(RemoteUpdateResultFields || (RemoteUpdateResultFields = {}));
var RemoteDeleteResultFields;
(function (RemoteDeleteResultFields) {
    RemoteDeleteResultFields["DeletedCount"] = "deletedCount";
})(RemoteDeleteResultFields || (RemoteDeleteResultFields = {}));
var UpdateDescriptionFields;
(function (UpdateDescriptionFields) {
    UpdateDescriptionFields["UpdatedFields"] = "updatedFields";
    UpdateDescriptionFields["RemovedFields"] = "removedFields";
})(UpdateDescriptionFields || (UpdateDescriptionFields = {}));
var ChangeEventFields;
(function (ChangeEventFields) {
    ChangeEventFields["Id"] = "_id";
    ChangeEventFields["OperationType"] = "operationType";
    ChangeEventFields["FullDocument"] = "fullDocument";
    ChangeEventFields["DocumentKey"] = "documentKey";
    ChangeEventFields["Namespace"] = "ns";
    ChangeEventFields["NamespaceDb"] = "db";
    ChangeEventFields["NamespaceColl"] = "coll";
    ChangeEventFields["UpdateDescription"] = "updateDescription";
})(ChangeEventFields || (ChangeEventFields = {}));
var CompactChangeEventFields;
(function (CompactChangeEventFields) {
    CompactChangeEventFields["OperationType"] = "ot";
    CompactChangeEventFields["FullDocument"] = "fd";
    CompactChangeEventFields["DocumentKey"] = "dk";
    CompactChangeEventFields["UpdateDescription"] = "ud";
    CompactChangeEventFields["StitchDocumentVersion"] = "sdv";
    CompactChangeEventFields["StitchDocumentHash"] = "sdh";
})(CompactChangeEventFields || (CompactChangeEventFields = {}));
var RemoteInsertManyResultDecoder = (function () {
    function RemoteInsertManyResultDecoder() {
    }
    RemoteInsertManyResultDecoder.prototype.decode = function (from) {
        return new RemoteInsertManyResult_1.default(from[RemoteInsertManyResultFields.InsertedIds]);
    };
    return RemoteInsertManyResultDecoder;
}());
var RemoteInsertOneResultDecoder = (function () {
    function RemoteInsertOneResultDecoder() {
    }
    RemoteInsertOneResultDecoder.prototype.decode = function (from) {
        return {
            insertedId: from[RemoteInsertOneResultFields.InsertedId]
        };
    };
    return RemoteInsertOneResultDecoder;
}());
var RemoteUpdateResultDecoder = (function () {
    function RemoteUpdateResultDecoder() {
    }
    RemoteUpdateResultDecoder.prototype.decode = function (from) {
        return {
            matchedCount: from[RemoteUpdateResultFields.MatchedCount],
            modifiedCount: from[RemoteUpdateResultFields.ModifiedCount],
            upsertedId: from[RemoteUpdateResultFields.UpsertedId]
        };
    };
    return RemoteUpdateResultDecoder;
}());
var RemoteDeleteResultDecoder = (function () {
    function RemoteDeleteResultDecoder() {
    }
    RemoteDeleteResultDecoder.prototype.decode = function (from) {
        return {
            deletedCount: from[RemoteDeleteResultFields.DeletedCount]
        };
    };
    return RemoteDeleteResultDecoder;
}());
var UpdateDescriptionDecoder = (function () {
    function UpdateDescriptionDecoder() {
    }
    UpdateDescriptionDecoder.prototype.decode = function (from) {
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(UpdateDescriptionFields.UpdatedFields, from);
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(UpdateDescriptionFields.RemovedFields, from);
        return {
            removedFields: from[UpdateDescriptionFields.RemovedFields],
            updatedFields: from[UpdateDescriptionFields.UpdatedFields],
        };
    };
    return UpdateDescriptionDecoder;
}());
function decodeBaseChangeEventFields(from, updateDescriptionField, fullDocumentField, decoder) {
    var updateDescription;
    if (updateDescriptionField in from) {
        updateDescription = ResultDecoders.updateDescriptionDecoder.decode(from[updateDescriptionField]);
    }
    else {
        updateDescription = undefined;
    }
    var fullDocument;
    if (fullDocumentField in from) {
        fullDocument = from[fullDocumentField];
        if (decoder) {
            fullDocument = decoder.decode(fullDocument);
        }
    }
    else {
        fullDocument = undefined;
    }
    return { updateDescription: updateDescription, fullDocument: fullDocument };
}
var ChangeEventDecoder = (function () {
    function ChangeEventDecoder(decoder) {
        this.decoder = decoder;
    }
    ChangeEventDecoder.prototype.decode = function (from) {
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(ChangeEventFields.Id, from);
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(ChangeEventFields.OperationType, from);
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(ChangeEventFields.Namespace, from);
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(ChangeEventFields.DocumentKey, from);
        var nsDoc = from[ChangeEventFields.Namespace];
        var _a = decodeBaseChangeEventFields(from, ChangeEventFields.UpdateDescription, ChangeEventFields.FullDocument, this.decoder), updateDescription = _a.updateDescription, fullDocument = _a.fullDocument;
        return {
            documentKey: from[ChangeEventFields.DocumentKey],
            fullDocument: fullDocument,
            id: from[ChangeEventFields.Id],
            namespace: {
                collection: nsDoc[ChangeEventFields.NamespaceColl],
                database: nsDoc[ChangeEventFields.NamespaceDb]
            },
            operationType: OperationType_1.operationTypeFromRemote(from[ChangeEventFields.OperationType]),
            updateDescription: updateDescription
        };
    };
    return ChangeEventDecoder;
}());
var CompactChangeEventDecoder = (function () {
    function CompactChangeEventDecoder(decoder) {
        this.decoder = decoder;
    }
    CompactChangeEventDecoder.prototype.decode = function (from) {
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(CompactChangeEventFields.OperationType, from);
        mongodb_stitch_core_sdk_1.Assertions.keyPresent(CompactChangeEventFields.DocumentKey, from);
        var _a = decodeBaseChangeEventFields(from, CompactChangeEventFields.UpdateDescription, CompactChangeEventFields.FullDocument, this.decoder), updateDescription = _a.updateDescription, fullDocument = _a.fullDocument;
        var stitchDocumentVersion;
        if (CompactChangeEventFields.StitchDocumentVersion in from) {
            stitchDocumentVersion = from[CompactChangeEventFields.StitchDocumentVersion];
        }
        else {
            stitchDocumentVersion = undefined;
        }
        var stitchDocumentHash;
        if (CompactChangeEventFields.StitchDocumentHash in from) {
            stitchDocumentHash = from[CompactChangeEventFields.StitchDocumentHash];
        }
        else {
            stitchDocumentHash = undefined;
        }
        return {
            documentKey: from[CompactChangeEventFields.DocumentKey],
            fullDocument: fullDocument,
            operationType: OperationType_1.operationTypeFromRemote(from[CompactChangeEventFields.OperationType]),
            stitchDocumentHash: stitchDocumentHash,
            stitchDocumentVersion: stitchDocumentVersion,
            updateDescription: updateDescription,
        };
    };
    return CompactChangeEventDecoder;
}());
var ResultDecoders = (function () {
    function ResultDecoders() {
    }
    ResultDecoders.remoteInsertManyResultDecoder = new RemoteInsertManyResultDecoder();
    ResultDecoders.remoteInsertOneResultDecoder = new RemoteInsertOneResultDecoder();
    ResultDecoders.remoteUpdateResultDecoder = new RemoteUpdateResultDecoder();
    ResultDecoders.remoteDeleteResultDecoder = new RemoteDeleteResultDecoder();
    ResultDecoders.updateDescriptionDecoder = new UpdateDescriptionDecoder();
    ResultDecoders.ChangeEventDecoder = ChangeEventDecoder;
    ResultDecoders.CompactChangeEventDecoder = CompactChangeEventDecoder;
    return ResultDecoders;
}());
exports.default = ResultDecoders;

},{"../OperationType":118,"../RemoteInsertManyResult":119,"mongodb-stitch-core-sdk":89}],126:[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  /* eslint-disable no-prototype-builtins */
  var g =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof self !== 'undefined' && self) ||
    // eslint-disable-next-line no-undef
    (typeof global !== 'undefined' && global) ||
    {};

  var support = {
    searchParams: 'URLSearchParams' in g,
    iterable: 'Symbol' in g && 'iterator' in Symbol,
    blob:
      'FileReader' in g &&
      'Blob' in g &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in g,
    arrayBuffer: 'ArrayBuffer' in g
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new TypeError('Invalid character in header field name: "' + name + '"')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        if (header.length != 2) {
          throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
        }
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body._noBody) return
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
    var encoding = match ? match[1] : 'utf-8';
    reader.readAsText(blob, encoding);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
      // eslint-disable-next-line no-self-assign
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._noBody = true;
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);
        if (isConsumed) {
          return isConsumed
        } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else if (support.blob) {
        return this.blob().then(readBlobAsArrayBuffer)
      } else {
        throw new Error('could not read as ArrayBuffer')
      }
    };

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }

    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal || (function () {
      if ('AbortController' in g) {
        var ctrl = new AbortController();
        return ctrl.signal;
      }
    }());
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
        }
      }
    }
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
    // https://github.com/github/fetch/issues/748
    // https://github.com/zloirock/core-js/issues/751
    preProcessedHeaders
      .split('\r')
      .map(function(header) {
        return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
      })
      .forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn('Response ' + error.message);
          }
        }
      });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    if (this.status < 200 || this.status > 599) {
      throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
    }
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 200, statusText: ''});
    response.ok = false;
    response.status = 0;
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = g.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        // This check if specifically for when a user fetches a file locally from the file system
        // Only if the status is out of a normal range
        if (request.url.indexOf('file://') === 0 && (xhr.status < 200 || xhr.status > 599)) {
          options.status = 200;
        } else {
          options.status = xhr.status;
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };

      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError('Network request timed out'));
        }, 0);
      };

      xhr.onabort = function() {
        setTimeout(function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        }, 0);
      };

      function fixUrl(url) {
        try {
          return url === '' && g.location.href ? g.location.href : url
        } catch (e) {
          return url
        }
      }

      xhr.open(request.method, fixUrl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr) {
        if (support.blob) {
          xhr.responseType = 'blob';
        } else if (
          support.arrayBuffer
        ) {
          xhr.responseType = 'arraybuffer';
        }
      }

      if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
        var names = [];
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          names.push(normalizeName(name));
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
        request.headers.forEach(function(value, name) {
          if (names.indexOf(name) === -1) {
            xhr.setRequestHeader(name, value);
          }
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!g.fetch) {
    g.fetch = fetch;
    g.Headers = Headers;
    g.Request = Request;
    g.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],127:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],128:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":127,"buffer":128,"ieee754":129}],129:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],130:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],131:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[3]);
