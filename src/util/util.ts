import { merge } from 'rxjs/observable/merge';

export default {
  windowWidth : () =>{
    return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  },
  windowHeight : () =>{
    return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  },
  getScreenDimensions: () => ({ width: this.windowWidth, height: this.windowHeight}),


}
export const hasKey = key => obj => obj[key]

export const parseFloatByKey = key => obj => Object.assign({}, obj, { [key] :parseFloat(obj[key])})

export const mergeDebounceDistinct = 
  (obsA , obsB) => merge( obsA, obsB ).debounceTime(300).distinctUntilChanged()