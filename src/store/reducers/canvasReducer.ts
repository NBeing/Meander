import { UPDATE_MOTIF, UPDATE_CONFIG } from "../actions/canvasActions"
import { parseFloatByKey } from "../../util/util"
// Default Motif Config
const motif = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0]

// Default options
const config = 
 [{ optionName: 'depth'       , min: 0 , max:7     , value: 3   , type: 'range'    },
  { optionName: 'sides'       , min: 2 , max:25    , value: 7   , type: 'range'    },
  { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10  , type: 'range'    },
  { optionName: 'sideLength'  , min: 2 , max:1200  , value: 300 , type: 'range'    },
  { optionName: 'baseRotation', min: 0 , max:0     , value: 0   , type: 'range'    },
  { optionName: 'numSegments' , min: 2 , max:20000 , value: 300 , type: 'range'    },
  { optionName: 'flip'        , min: 0 , max:1     , value: 0   , type: 'checkbox' },
  { optionName: 'noAnimation' , min: 1 , max:9     , value: 0   , type: 'checkbox' },
  { optionName: 'fitToSide'   , min: 0 , max:1     , value: 1   , type: 'checkbox' }]

export const defaultCanvasState = {
  motif,
  config
}

export const canvasReducer = (state = defaultCanvasState, action) => {
  switch (action.type) {
    case UPDATE_MOTIF:
      let {index, value} = action.payload.motif;
      var m = state.motif.map( (y,i) => (index === i) ? parseFloat(value): y)
      return { ...state, ...{motif: m}}
    case UPDATE_CONFIG:
      const updateOptionInMeanderConfig =
        ( optionName , value ) => {
          return state.config.map( configOption => {
            if( configOption.optionName === optionName ) {
              configOption.value = value;
            }
            return configOption;
          })
        }
     const getValFromConfig = 
        configOption => ( configOption.option.type === 'range' ) 
                          ? parseInt(configOption.value.value) 
                          : configOption.value.checked;

      let option  = action.payload.config.option;
      let val     = action.payload.config.value;
      let y = updateOptionInMeanderConfig( option.optionName , getValFromConfig(action.payload.config));
      return { ...state, ...{config: y}}
    default:
      return state;
  }
}
