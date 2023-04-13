const windowWidth = () =>{
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
};
const windowHeight = () =>{
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
}

const getScreenDimensions = () => ({ width: windowWidth(), height: windowHeight()})

export default {
  windowWidth ,
  windowHeight,
  getScreenDimensions
}
export const hasKey = key => obj => obj[key]

export const parseFloatByKey = key => obj => Object.assign({}, obj, { [key] :parseFloat(obj[key])})

export const addOption = (acc:any, cur:any) => {
    acc[cur.optionName] = cur.value
    return acc
}
export const parseMeanderConfigToMeanderCanvasOptions =
  config => config.reduce(addOption, {})

export const createNodeFromStoreConfig = 
  state => Object.assign({}, 
                        parseMeanderConfigToMeanderCanvasOptions(state.canvas.config),
                        {motifConfig: state.canvas.motif});

