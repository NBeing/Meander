import CantorCanvas from "./cantorCanvas"
import * as Rx from 'rxjs';

const configOptions = ['depth',
                       'length',
                       'baseLen',
                       'sides',
                       'lineHeight',
                       'lineWidth',
                       'divisions']

var inputs = document.getElementById('inputs');

var x = configOptions.map( optionName => {
  let div   = document.createElement('div')
  let label = document.createElement(`<span>`)
  let t     = document.createElement('input');
  t.setAttribute('type','number');
  t.setAttribute('id','optionName');
  inputs.appendChild(t)
  return t
})
console.log(x);



console.log(inputs);
let elements = configOptions.map( selector => document.getElementById(selector))

let subs = elements.map(el => Rx.Observable.fromEvent(el, 'keyup'));
console.log("subs", subs)
var depth = document.getElementById('depth');
var length = document.getElementById('length');

var $depth = Rx.Observable.fromEvent(depth, 'keyup')
var $length = Rx.Observable.fromEvent(length, 'keyup')
let $merged = $depth.merge($length)
var subscription =
  $merged.subscribe(n => {
    console.log("n", n)
    var C2 = new CantorCanvas( 'c', {
      baseLen     : 10  ,
      depth       : 4   ,
      sides       : 4   ,
      divisions   : 7   ,
      lineHeight  : 10 ,
      lineWidth   : 250 ,
      makeLonger  : 80  ,
    })
  })




