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

export const createNodeFromStoreConfig = 
  state => Object.assign({}, 
                        parseMeanderConfigToMeanderCanvasOptions(state.canvas.config),
                        {motifConfig: state.canvas.motif});

export const parseMeanderConfigToMeanderCanvasOptions =
  config => config.reduce(this.addOption, {})

export const addOption = (acc:any, cur:any) => {
    acc[cur.optionName] = cur.value
    return acc
}