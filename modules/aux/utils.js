/* global wand */
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

e.stdDiv = () => e.centerDiv(undefined, undefined, e.chooseUnique(['#eeeeff', '#eeffee', '#ffeeee'], 1)[0], 3, 2)
